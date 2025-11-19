// src/pages/leave/RequestLeave.jsx
// Page for submitting new leave requests - STYLED TO MATCH EMPLOYEE MODULE

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  Send as SubmitIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  CheckCircle as SuccessIcon,
  EventAvailable as LeaveIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import Loading from '../../components/common/feedback/Loading';
import { LeaveTypeSelector, PTOBalanceCard } from './components';
import {
  calculateTotalDays,
  validateLeaveRequestForm,
  getTodayString
} from './models/leaveModels';
import leaveService from '../../services/leaveService';
import { authService } from '../../services/authService';

const RequestLeave = () => {
  const navigate = useNavigate();
  
  // Get current user from localStorage
  const [currentUser, setCurrentUser] = useState(null);
  const [employee, setEmployee] = useState(null);

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
    totalDays: 0,
    isHalfDay: false
  });

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Steps
  const steps = ['Select Leave Type', 'Choose Dates', 'Review & Submit'];

  // Load current user on mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    const empData = JSON.parse(localStorage.getItem('employee'));
    
    if (user && empData) {
      setCurrentUser(user);
      setEmployee(empData);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Load PTO Balance - REAL API CALL
  useEffect(() => {
    const fetchPTOBalance = async () => {
      if (!employee) return;

      try {
        setLoadingBalance(true);
        const response = await leaveService.getPTOBalance(employee.employeeId);
        
        setPtoBalance({
          total: response.totalPTODays || 0,
          available: response.remainingPTODays || 0,
          used: response.usedPTODays || 0,
          pending: 0,
          accrualRate: response.accrualRate || 0
        });
        
        setLoadingBalance(false);
      } catch (error) {
        console.error('Error fetching PTO balance:', error);
        setLoadingBalance(false);
        
        if (error.message?.includes('not eligible')) {
          setPtoBalance({
            total: 0,
            available: 0,
            used: 0,
            pending: 0,
            accrualRate: 0
          });
        }
      }
    };

    if (employee) {
      if (employee.employmentType === 'FullTime') {
        fetchPTOBalance();
      } else {
        setLoadingBalance(false);
        setPtoBalance({
          total: 0,
          available: 0,
          used: 0,
          pending: 0,
          accrualRate: 0
        });
      }
    }
  }, [employee]);

  // Load Leave Types - REAL API CALL
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        setLoadingTypes(true);
        const response = await leaveService.getLeaveTypes();
        setLeaveTypes(response);
        setLoadingTypes(false);
      } catch (error) {
        console.error('Error fetching leave types:', error);
        setLoadingTypes(false);
      }
    };

    if (employee) {
      fetchLeaveTypes();
    }
  }, [employee]);

  // Calculate total days when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const days = calculateTotalDays(formData.startDate, formData.endDate);
      setFormData(prev => ({ ...prev, totalDays: days }));
    }
  }, [formData.startDate, formData.endDate]);

  // Handle Next Step
  const handleNext = () => {
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
      if (!formData.leaveTypeId) {
        errors.leaveType = 'Please select a leave type';
      }
    } else if (activeStep === 1) {
      const dateValidation = validateLeaveRequestForm(formData, ptoBalance, employee?.employmentType);
      if (!dateValidation.isValid) {
        return dateValidation;
      }
    } else if (activeStep === 2) {
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

  // Handle Submit - REAL API CALL
  const handleSubmit = async () => {
    const validation = validateLeaveRequestForm(formData, ptoBalance, employee?.employmentType);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const requestData = {
        leaveTypeId: formData.leaveTypeId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason || null,
        isHalfDay: formData.isHalfDay
      };

      await leaveService.submitLeaveRequest(requestData);

      setSubmitSuccess(true);
      setSubmitting(false);

      setTimeout(() => {
        navigate('/leave/my-requests');
      }, 2000);

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
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
              What type of leave would you like to request?
            </Typography>
            
            {loadingTypes ? (
              <Loading />
            ) : (
              <LeaveTypeSelector
                leaveTypes={leaveTypes}
                selectedTypeId={formData.leaveTypeId}
                onSelect={(typeId) => setFormData(prev => ({ ...prev, leaveTypeId: typeId }))}
                employeeType={employee?.employmentType}
              />
            )}
            
            {validationErrors.leaveType && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {validationErrors.leaveType}
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
              When do you need time off?
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: getTodayString() }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: formData.startDate }}
                />
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ bgcolor: '#E8F4F8', border: '1px solid #B3E0ED' }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                      Total Days: {formData.totalDays} day(s)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {validationErrors.dates && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {validationErrors.dates}
              </Alert>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
              Review Your Request
            </Typography>

            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      Leave Type
                    </Typography>
                    <Chip 
                      label={selectedLeaveType?.typeName}
                      sx={{ 
                        bgcolor: selectedLeaveType?.color || '#5B8FCC',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      Start Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{formData.startDate}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      End Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{formData.endDate}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      Total Days
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#5B8FCC' }}>
                      {formData.totalDays} day(s)
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <TextField
              fullWidth
              label="Reason (optional)"
              multiline
              rows={4}
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Provide a reason for your leave request..."
            />

            {validationErrors.reason && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {validationErrors.reason}
              </Alert>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  // Show success message
  if (submitSuccess) {
    return (
      <Layout>
        <Box>
          <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto', mt: 4 }}>
            <SuccessIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
              Request Submitted!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your leave request has been submitted successfully and is pending approval.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/leave/my-requests')}>
              View My Requests
            </Button>
          </Paper>
        </Box>
      </Layout>
    );
  }

  if (!employee) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        {/* Page Header - Matches Employee Module */}
        <PageHeader
          title="Request Time Off"
          subtitle="Submit a new leave request following the steps below"
          icon={<LeaveIcon />}
          backgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />

        <Grid container spacing={3}>
          {/* Left Column - PTO Balance */}
          <Grid item xs={12} md={3}>
            {employee.employmentType === 'FullTime' && (
              <PTOBalanceCard
                balance={ptoBalance}
                loading={loadingBalance}
              />
            )}
          </Grid>

          {/* Right Column - Form */}
          <Grid item xs={12} md={9}>
            <Card elevation={2}>
              <CardContent sx={{ p: 4 }}>
                {/* Stepper */}
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* Error Alert */}
                {submitError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {submitError}
                  </Alert>
                )}

                {/* Step Content */}
                {renderStepContent()}

                <Divider sx={{ my: 3 }} />

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<BackIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Back
                  </Button>

                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={submitting}
                      startIcon={submitting ? null : <SubmitIcon />}
                      sx={{ 
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<NextIcon />}
                      sx={{ 
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default RequestLeave;