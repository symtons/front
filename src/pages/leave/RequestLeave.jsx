// src/pages/leave/RequestLeave.jsx
// Page for submitting new leave requests

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Send as SubmitIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LeaveTypeSelector, PTOBalanceCard } from '../leave/components';
import { DateRangePicker } from '../../components/common';
import {
  calculateTotalDays,
  validateLeaveRequestForm,
  prepareLeaveRequestForAPI,
  getTodayString
} from '../leave/models/leaveModels';

/**
 * RequestLeave Page
 * 
 * Multi-step form for submitting leave requests:
 * Step 1: Select Leave Type
 * Step 2: Select Dates
 * Step 3: Add Details & Review
 * Step 4: Confirmation
 */

const RequestLeave = () => {
  const navigate = useNavigate();
  
  // User info (from auth context or API)
  const [currentUser, setCurrentUser] = useState({
    employeeId: 1,
    employeeName: 'John Doe',
    employeeType: 'Admin Staff', // or 'Field Staff'
    email: 'john.doe@tpa.com'
  });

  // PTO Balance
  const [ptoBalance, setPtoBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(true);

  // Leave Types
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  // Form State
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    leaveTypeId: null,
    startDate: getTodayString(),
    endDate: getTodayString(),
    reason: '',
    totalDays: 0
  });

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Steps
  const steps = ['Select Leave Type', 'Choose Dates', 'Review & Submit'];

  // Load PTO Balance
  useEffect(() => {
    const fetchPTOBalance = async () => {
      try {
        setLoadingBalance(true);
        // TODO: Replace with actual API call
        // const response = await leaveService.getPTOBalance(currentUser.employeeId);
        
        // Mock data
        setTimeout(() => {
          setPtoBalance({
            total: 15,
            available: 10.5,
            used: 3,
            pending: 1.5,
            accrualRate: 1.25
          });
          setLoadingBalance(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching PTO balance:', error);
        setLoadingBalance(false);
      }
    };

    if (currentUser.employeeType === 'Admin Staff') {
      fetchPTOBalance();
    } else {
      setLoadingBalance(false);
    }
  }, [currentUser]);

  // Load Leave Types
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        setLoadingTypes(true);
        // TODO: Replace with actual API call
        // const response = await leaveService.getLeaveTypes();
        
        // Mock data
        setTimeout(() => {
          setLeaveTypes([
            {
              leaveTypeId: 1,
              typeName: 'PTO',
              description: 'Paid Time Off for vacation and personal days',
              isPaidLeave: true,
              requiresApproval: true,
              maxDaysPerYear: 15,
              color: '#5B8FCC',
              isActive: true
            },
            {
              leaveTypeId: 2,
              typeName: 'Sick Leave',
              description: 'Medical leave for illness or medical appointments',
              isPaidLeave: true,
              requiresApproval: false,
              maxDaysPerYear: null,
              color: '#e74c3c',
              isActive: true
            },
            {
              leaveTypeId: 3,
              typeName: 'Unpaid Leave',
              description: 'Time off without pay',
              isPaidLeave: false,
              requiresApproval: true,
              maxDaysPerYear: null,
              color: '#95a5a6',
              isActive: true
            },
            {
              leaveTypeId: 4,
              typeName: 'Bereavement',
              description: 'Leave for family bereavement',
              isPaidLeave: true,
              requiresApproval: true,
              maxDaysPerYear: 5,
              color: '#34495e',
              isActive: true
            },
            {
              leaveTypeId: 5,
              typeName: 'Jury Duty',
              description: 'Leave for jury duty service',
              isPaidLeave: true,
              requiresApproval: true,
              maxDaysPerYear: null,
              color: '#3498db',
              isActive: true
            }
          ]);
          setLoadingTypes(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching leave types:', error);
        setLoadingTypes(false);
      }
    };

    fetchLeaveTypes();
  }, []);

  // Calculate total days when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const days = calculateTotalDays(formData.startDate, formData.endDate);
      setFormData(prev => ({ ...prev, totalDays: days }));
    }
  }, [formData.startDate, formData.endDate]);

  // Handle Next Step
  const handleNext = () => {
    // Validate current step
    const validation = validateCurrentStep();
    
    if (validation.isValid) {
      setValidationErrors({});
      setActiveStep(prev => prev + 1);
    } else {
      setValidationErrors(validation.errors);
    }
  };

  // Handle Back Step
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setValidationErrors({});
  };

  // Validate Current Step
  const validateCurrentStep = () => {
    const errors = {};

    if (activeStep === 0) {
      // Step 1: Leave Type Selection
      if (!formData.leaveTypeId) {
        errors.leaveType = 'Please select a leave type';
      }
    } else if (activeStep === 1) {
      // Step 2: Date Selection
      const dateValidation = validateLeaveRequestForm(formData, ptoBalance, currentUser.employeeType);
      if (!dateValidation.isValid) {
        return dateValidation;
      }
    } else if (activeStep === 2) {
      // Step 3: Reason (optional for some types)
      const selectedType = leaveTypes.find(t => t.leaveTypeId === formData.leaveTypeId);
      if (selectedType?.requiresApproval && !formData.reason?.trim()) {
        errors.reason = 'Please provide a reason for your leave request';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // Handle Submit
  const handleSubmit = async () => {
    // Final validation
    const validation = validateLeaveRequestForm(formData, ptoBalance, currentUser.employeeType);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      // Prepare data for API
      const requestData = prepareLeaveRequestForAPI({
        ...formData,
        employeeId: currentUser.employeeId
      });

      // TODO: Replace with actual API call
      // const response = await leaveService.submitLeaveRequest(requestData);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmitSuccess(true);
      setSubmitting(false);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/leave/my-requests');
      }, 3000);

    } catch (error) {
      console.error('Error submitting leave request:', error);
      setSubmitError(error.message || 'Failed to submit leave request. Please try again.');
      setSubmitting(false);
    }
  };

  // Get selected leave type details
  const selectedLeaveType = leaveTypes.find(t => t.leaveTypeId === formData.leaveTypeId);

  // Render Step Content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        // Step 1: Select Leave Type
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              What type of leave would you like to request?
            </Typography>

            <LeaveTypeSelector
              leaveTypes={leaveTypes}
              selectedTypeId={formData.leaveTypeId}
              onChange={(typeId) => setFormData(prev => ({ ...prev, leaveTypeId: typeId }))}
              employeeType={currentUser.employeeType}
              loading={loadingTypes}
              error={validationErrors.leaveType}
            />
          </Box>
        );

      case 1:
        // Step 2: Choose Dates
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Select your leave dates
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose the start and end dates for your {selectedLeaveType?.typeName} request
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: getTodayString() }}
                  error={Boolean(validationErrors.startDate)}
                  helperText={validationErrors.startDate}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: formData.startDate || getTodayString() }}
                  error={Boolean(validationErrors.endDate)}
                  helperText={validationErrors.endDate}
                />
              </Grid>
            </Grid>

            {/* Duration Display */}
            {formData.totalDays > 0 && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Total Duration:</strong> {formData.totalDays} {formData.totalDays === 1 ? 'day' : 'days'}
                </Typography>
                {selectedLeaveType?.isPaidLeave && currentUser.employeeType === 'Admin Staff' && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    This will deduct {formData.totalDays} days from your PTO balance
                  </Typography>
                )}
              </Alert>
            )}

            {/* Balance Warning */}
            {selectedLeaveType?.isPaidLeave && 
             currentUser.employeeType === 'Admin Staff' && 
             ptoBalance && 
             formData.totalDays > ptoBalance.available && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                You have {ptoBalance.available} days available. This request exceeds your current balance.
              </Alert>
            )}
          </Box>
        );

      case 2:
        // Step 3: Review & Submit
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Review your leave request
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please review the details and add any additional information
            </Typography>

            {/* Summary Card */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Leave Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedLeaveType?.typeName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formData.totalDays} {formData.totalDays === 1 ? 'day' : 'days'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {new Date(formData.startDate).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    End Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {new Date(formData.endDate).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Reason Input */}
            <TextField
              label={selectedLeaveType?.requiresApproval ? "Reason for Leave *" : "Reason for Leave (Optional)"}
              multiline
              rows={4}
              fullWidth
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Please provide details about your leave request..."
              error={Boolean(validationErrors.reason)}
              helperText={validationErrors.reason || 'Provide a clear explanation for your leave request'}
              sx={{ mb: 2 }}
            />

            {/* Approval Notice */}
            {selectedLeaveType?.requiresApproval && (
              <Alert severity="info">
                This leave request requires approval from your manager. You will receive a notification once it has been reviewed.
              </Alert>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  // Success Screen
  if (submitSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <SuccessIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2, color: 'success.main' }}>
            Request Submitted Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your leave request has been submitted and is now pending approval.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Redirecting to My Requests...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Request Time Off
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Submit a new leave request following the steps below
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - PTO Balance (Admin Staff Only) */}
        {currentUser.employeeType === 'Admin Staff' && (
          <Grid item xs={12} md={4}>
            <PTOBalanceCard
              balance={ptoBalance}
              loading={loadingBalance}
              employeeType={currentUser.employeeType}
            />
          </Grid>
        )}

        {/* Right Column - Request Form */}
        <Grid item xs={12} md={currentUser.employeeType === 'Admin Staff' ? 8 : 12}>
          <Paper sx={{ p: 4 }}>
            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Divider sx={{ mb: 3 }} />

            {/* Step Content */}
            {renderStepContent()}

            {/* Error Message */}
            {submitError && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {submitError}
              </Alert>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                onClick={() => navigate('/leave/my-requests')}
                startIcon={<BackIcon />}
                disabled={submitting}
              >
                Cancel
              </Button>

              <Box sx={{ flex: 1 }} />

              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  disabled={submitting}
                >
                  Back
                </Button>
              )}

              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<NextIcon />}
                  disabled={submitting}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  startIcon={submitting ? <CircularProgress size={20} /> : <SubmitIcon />}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RequestLeave;