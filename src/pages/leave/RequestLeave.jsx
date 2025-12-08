// src/pages/leave/RequestLeave.jsx
// CORRECTED VERSION - Fixed PageHeader actions prop

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  EventAvailable as LeaveIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  Send as SubmitIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Universal Components
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import { Loading } from '../../components/common';

// Leave Components
import { PTOBalanceCard } from './components';

// Services
import leaveService from '../../services/leaveService';

// Models
import {
  getInitialLeaveRequestData,
  validateLeaveRequestForm,
  calculateTotalDays,
  formatDateRange,
  formatDaysDisplay,
  getTodayString,
  getLeaveTypeColor
} from './models/leaveModels';

const steps = ['Select Leave Type', 'Choose Dates', 'Review & Submit'];

const RequestLeave = () => {
  const navigate = useNavigate();
  
  // State
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(getInitialLeaveRequestData());
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [ptoBalance, setPtoBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  // Success state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Current user
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const employee = JSON.parse(localStorage.getItem('employee'));
    setCurrentUser({ ...user, ...employee });
    
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch leave types and balance in parallel
      const [typesResponse, balanceResponse] = await Promise.all([
        leaveService.getLeaveTypes(),
        leaveService.getMyBalance()
      ]);
      
      setLeaveTypes(typesResponse);
      setPtoBalance(balanceResponse);
      setLoadingBalance(false);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      setLoading(false);
      setLoadingBalance(false);
    }
  };

  const handleNext = () => {
    // Validate current step
    if (activeStep === 0 && !formData.leaveTypeId) {
      setFormErrors({ leaveTypeId: 'Please select a leave type' });
      return;
    }
    
    if (activeStep === 1) {
      const selectedType = leaveTypes.find(lt => lt.leaveTypeId === formData.leaveTypeId);
      const validation = validateLeaveRequestForm(formData, ptoBalance, selectedType);
      
      if (!validation.isValid) {
        setFormErrors(validation.errors);
        return;
      }
    }
    
    setFormErrors({});
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setFormErrors({});
  };

  const handleLeaveTypeSelect = (leaveTypeId) => {
    setFormData({ ...formData, leaveTypeId });
    setFormErrors({});
  };

  const handleDateChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors({});
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');
      
      const response = await leaveService.submitLeaveRequest(formData);
      
      setSuccessMessage(response.message || 'Leave request submitted successfully!');
      setShowSuccess(true);
      
      // Reset form
      setFormData(getInitialLeaveRequestData());
      setActiveStep(0);
      
      // Refresh balance
      const balanceResponse = await leaveService.getMyBalance();
      setPtoBalance(balanceResponse);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/leave/my-requests');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  // Get selected leave type
  const selectedLeaveType = leaveTypes.find(lt => lt.leaveTypeId === formData.leaveTypeId);

  // Calculate total days
  const totalDays = formData.isHalfDay ? 0.5 : calculateTotalDays(formData.startDate, formData.endDate);

  if (loading) {
    return <Loading message="Loading leave request form..." />;
  }

  return (
    <Layout>
      <PageHeader
        icon={LeaveIcon}
        title="Request Leave"
        subtitle="Submit a new leave request for approval"
        chips={[
          { label: currentUser?.jobTitle || 'Employee', color: '#667eea' }
        ]}
      />

      <Grid container spacing={3}>
        {/* Left Column - Form */}
        <Grid item xs={12} md={8}>
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
              {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              {/* Step Content */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Select Leave Type
                  </Typography>
                  
                  {formErrors.leaveTypeId && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {formErrors.leaveTypeId}
                    </Alert>
                  )}

                  <Grid container spacing={2}>
                    {leaveTypes.map((type) => {
                      const isSelected = formData.leaveTypeId === type.leaveTypeId;
                      const leaveColor = getLeaveTypeColor(type.typeName);
                      
                      // Check if user is eligible for this leave type
                      const isEligible = type.typeName === 'PTO' 
                        ? ptoBalance?.isEligible 
                        : true;

                      return (
                        <Grid item xs={12} sm={6} key={type.leaveTypeId}>
                          <Card
                            sx={{
                              cursor: isEligible ? 'pointer' : 'not-allowed',
                              border: isSelected ? `3px solid ${leaveColor}` : '2px solid #e0e0e0',
                              backgroundColor: isSelected ? `${leaveColor}15` : 'white',
                              opacity: isEligible ? 1 : 0.5,
                              transition: 'all 0.3s ease',
                              '&:hover': isEligible ? {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                              } : {}
                            }}
                            onClick={() => isEligible && handleLeaveTypeSelect(type.leaveTypeId)}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  {type.typeName}
                                </Typography>
                                <Chip
                                  label={type.isPaidLeave ? 'Paid' : 'Unpaid'}
                                  size="small"
                                  sx={{
                                    backgroundColor: type.isPaidLeave ? '#4caf50' : '#9e9e9e',
                                    color: 'white'
                                  }}
                                />
                              </Box>
                              
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {type.description}
                              </Typography>
                              
                              {type.maxDaysPerYear && (
                                <Typography variant="caption" color="text.secondary">
                                  Max: {type.maxDaysPerYear} days/year
                                </Typography>
                              )}
                              
                              {!isEligible && (
                                <Alert severity="warning" sx={{ mt: 1 }}>
                                  Not eligible for this leave type
                                </Alert>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}

              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Choose Dates
                  </Typography>

                  {(formErrors.dates || formErrors.balance) && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {formErrors.dates || formErrors.balance}
                    </Alert>
                  )}

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleDateChange('startDate', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: getTodayString() }}
                        error={!!formErrors.startDate}
                        helperText={formErrors.startDate}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="End Date"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleDateChange('endDate', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: formData.startDate || getTodayString() }}
                        error={!!formErrors.endDate}
                        helperText={formErrors.endDate}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.isHalfDay}
                            onChange={(e) => setFormData({ ...formData, isHalfDay: e.target.checked })}
                            sx={{ color: '#667eea' }}
                          />
                        }
                        label="Half Day (0.5 days)"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Reason (Optional)"
                        multiline
                        rows={4}
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        placeholder="Provide a reason for your leave request..."
                        error={!!formErrors.reason}
                        helperText={formErrors.reason || `${formData.reason?.length || 0}/500 characters`}
                        inputProps={{ maxLength: 500 }}
                      />
                    </Grid>

                    {/* Days Preview */}
                    <Grid item xs={12}>
                      <Card sx={{ backgroundColor: '#f5f5f5' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Total Days Requested
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                            {formatDaysDisplay(totalDays)}
                          </Typography>
                          {selectedLeaveType?.typeName === 'PTO' && ptoBalance?.isEligible && (
                            <Typography variant="caption" color="text.secondary">
                              Remaining after request: {(ptoBalance.remainingPTODays - totalDays).toFixed(1)} days
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Review & Submit
                  </Typography>

                  <Card sx={{ backgroundColor: '#f5f5f5', mb: 3 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Leave Type
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip
                              label={selectedLeaveType?.typeName}
                              sx={{
                                backgroundColor: getLeaveTypeColor(selectedLeaveType?.typeName),
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                            <Chip
                              label={selectedLeaveType?.isPaidLeave ? 'Paid' : 'Unpaid'}
                              size="small"
                              sx={{
                                backgroundColor: selectedLeaveType?.isPaidLeave ? '#4caf50' : '#9e9e9e',
                                color: 'white'
                              }}
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Dates
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {formatDateRange(formData.startDate, formData.endDate)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDaysDisplay(totalDays)}
                          </Typography>
                        </Grid>

                        {formData.reason && (
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                              Reason
                            </Typography>
                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                              "{formData.reason}"
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>

                  {selectedLeaveType?.requiresApproval && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      This request will be sent to your supervisor for approval.
                    </Alert>
                  )}

                  {!selectedLeaveType?.requiresApproval && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      This leave type is auto-approved. Your request will be approved immediately.
                    </Alert>
                  )}
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<BackIcon />}
                  sx={{ color: '#667eea' }}
                >
                  Back
                </Button>

                {activeStep < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<NextIcon />}
                    sx={{
                      backgroundColor: '#667eea',
                      '&:hover': { backgroundColor: '#5568d3' }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={20} /> : <SubmitIcon />}
                    sx={{
                      backgroundColor: '#4caf50',
                      '&:hover': { backgroundColor: '#45a049' }
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - PTO Balance */}
        <Grid item xs={12} md={4}>
          <PTOBalanceCard 
            balance={ptoBalance} 
            loading={loadingBalance}
            error={error}
          />
        </Grid>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success"
          icon={<SuccessIcon />}
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default RequestLeave;