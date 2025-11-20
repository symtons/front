// src/pages/leave/RequestLeave.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  Grid,
  TextField,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Paper,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Send as SubmitIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  CheckCircle as SuccessIcon,
  EventAvailable as LeaveIcon,
  Person as PersonIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Universal Components
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import DateRangePicker from '../../components/common/inputs/DateRangePicker';

// Leave Components
import { LeaveTypeSelector, PTOBalanceCard } from './components';

// Services
import leaveService from '../../services/leaveService';

// Models
import {
  calculateTotalDays,
  validateLeaveRequestForm,
  getTodayString
} from './models/leaveModels';

const RequestLeave = () => {
  const navigate = useNavigate();
  
  // Current user
  const [currentUser, setCurrentUser] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  
  // PTO Balance
  const [ptoBalance, setPtoBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  
  // Leave Types
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  
  // Form Steps
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Select Leave Type', 'Choose Dates', 'Review & Submit'];
  
  // Form Data
  const [formData, setFormData] = useState({
    leaveTypeId: null,
    startDate: getTodayString(),
    endDate: getTodayString(),
    reason: '',
    isHalfDay: false
  });
  
  // Calculated Fields
  const [totalDays, setTotalDays] = useState(0);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  
  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch current user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const employee = JSON.parse(localStorage.getItem('employee'));
    setCurrentUser(user);
    setCurrentEmployee(employee);
  }, []);

  // Fetch PTO Balance
  useEffect(() => {
    fetchPTOBalance();
  }, []);

  // Fetch Leave Types
  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  // Calculate total days when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const days = calculateTotalDays(formData.startDate, formData.endDate);
      setTotalDays(formData.isHalfDay ? 0.5 : days);
    }
  }, [formData.startDate, formData.endDate, formData.isHalfDay]);

  // Update selected leave type
  useEffect(() => {
    if (formData.leaveTypeId) {
      const type = leaveTypes.find(t => t.leaveTypeId === formData.leaveTypeId);
      setSelectedLeaveType(type);
    }
  }, [formData.leaveTypeId, leaveTypes]);

  const fetchPTOBalance = async () => {
    try {
      setLoadingBalance(true);
      const response = await leaveService.getMyBalance();
      setPtoBalance(response);
    } catch (err) {
      console.error('Error fetching PTO balance:', err);
    } finally {
      setLoadingBalance(false);
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      setLoadingTypes(true);
      console.log('Fetching leave types...');
      const response = await leaveService.getLeaveTypes();
      console.log('Leave types response:', response);
      
      // Normalize property names to match component expectations
      const normalizedTypes = Array.isArray(response) ? response.map(type => ({
        leaveTypeId: type.leaveTypeId || type.LeaveTypeId,
        typeName: type.typeName || type.TypeName,
        description: type.description || type.Description,
        isPaidLeave: type.isPaidLeave !== undefined ? type.isPaidLeave : type.IsPaidLeave,
        requiresApproval: type.requiresApproval !== undefined ? type.requiresApproval : type.RequiresApproval,
        maxDaysPerYear: type.maxDaysPerYear || type.MaxDaysPerYear,
        requiresFullTimeStatus: type.requiresFullTimeStatus !== undefined ? type.requiresFullTimeStatus : type.RequiresFullTimeStatus,
        color: type.color || type.Color,
        isActive: type.isActive !== undefined ? type.isActive : type.IsActive,
        isEligible: type.isEligible !== undefined ? type.isEligible : type.IsEligible
      })) : [];
      
      if (normalizedTypes.length > 0) {
        setLeaveTypes(normalizedTypes);
        console.log(`Loaded ${normalizedTypes.length} leave types`);
      } else {
        console.warn('No leave types returned from API');
        setLeaveTypes([]);
      }
    } catch (err) {
      console.error('Error fetching leave types:', err);
      setError(`Failed to load leave types: ${err.message || 'Please try again'}`);
      setLeaveTypes([]);
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleNext = () => {
    // Validate current step
    if (activeStep === 0 && !formData.leaveTypeId) {
      setError('Please select a leave type');
      return;
    }
    
    if (activeStep === 1) {
      if (!formData.startDate || !formData.endDate) {
        setError('Please select start and end dates');
        return;
      }
      
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        setError('End date cannot be before start date');
        return;
      }
    }
    
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleLeaveTypeChange = (leaveTypeId) => {
    setFormData({ ...formData, leaveTypeId });
  };

  const handleDateChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleReasonChange = (e) => {
    setFormData({ ...formData, reason: e.target.value });
  };

  const handleHalfDayChange = (e) => {
    setFormData({ ...formData, isHalfDay: e.target.checked });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    
    try {
      // Prepare request data
      const requestData = {
        leaveTypeId: formData.leaveTypeId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason || null,
        totalDays: totalDays
      };
      
      // Submit request
      const response = await leaveService.submitLeaveRequest(requestData);
      
      setSuccessMessage(`Leave request submitted successfully! ${response.message || ''}`);
      setShowSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/leave/my-requests');
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting request:', err);
      setError(err.message || 'Failed to submit leave request');
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/leave/my-requests');
  };

  // Header chips
  const headerChips = currentUser ? [
    { icon: <PersonIcon />, label: currentUser.email },
    { icon: <BadgeIcon />, label: currentUser.role?.roleName || currentUser.role || 'User' }
  ] : [];

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Page Header */}
        <PageHeader
          icon={LeaveIcon}
          title="Request Leave"
          subtitle="Submit a new leave request"
          chips={headerChips}
          backgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />

        {/* PTO Balance Card - Full Width */}
        {currentEmployee?.employeeType !== 'Field Staff' && (
          <Box sx={{ mb: 3 }}>
            <PTOBalanceCard
              balance={ptoBalance}
              loading={loadingBalance}
            />
          </Box>
        )}

        {/* Stepper */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
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
                Step 1: Select Leave Type
              </Typography>
              
              {loadingTypes ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    Loading leave types...
                  </Typography>
                </Box>
              ) : leaveTypes.length === 0 ? (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    No Leave Types Available
                  </Typography>
                  <Typography variant="body2">
                    There are currently no leave types configured in the system. 
                    Please contact your HR administrator to set up leave types.
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                    Leave types need to be added to the database table <code>LeaveTypes</code>.
                  </Typography>
                </Alert>
              ) : (
                <LeaveTypeSelector
                  leaveTypes={leaveTypes}
                  selectedTypeId={formData.leaveTypeId}
                  onChange={handleLeaveTypeChange}
                  employeeType={currentEmployee?.employeeType || 'Admin Staff'}
                  loading={false}
                  error=""
                />
              )}
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Step 2: Choose Dates
              </Typography>
              
              {selectedLeaveType && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  <strong>Selected:</strong> {selectedLeaveType.typeName}
                  {selectedLeaveType.description && ` - ${selectedLeaveType.description}`}
                </Alert>
              )}

              <DateRangePicker
                startDate={formData.startDate}
                endDate={formData.endDate}
                onStartDateChange={(value) => handleDateChange('startDate', value)}
                onEndDateChange={(value) => handleDateChange('endDate', value)}
                startLabel="Start Date"
                endLabel="End Date"
                disablePastDates={true}
                showTotalDays={true}
                allowHalfDay={true}
                isHalfDay={formData.isHalfDay}
                onHalfDayChange={handleHalfDayChange}
              />

              {/* Summary Box */}
              <Paper 
                elevation={0} 
                sx={{ 
                  mt: 3, 
                  p: 2, 
                  bgcolor: '#f5f5f5',
                  borderRadius: 2 
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Total Days Requested
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
                      {totalDays} {totalDays === 1 ? 'day' : 'days'}
                    </Typography>
                  </Grid>
                  {ptoBalance && selectedLeaveType?.isPaidLeave && (
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Remaining After Request
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                        {(ptoBalance.remaining - totalDays).toFixed(1)} days
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Step 3: Review & Submit
              </Typography>

              {/* Review Summary */}
              <Card elevation={0} sx={{ bgcolor: '#f5f5f5', mb: 3 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    {/* Leave Type */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Leave Type
                      </Typography>
                      <Chip 
                        label={selectedLeaveType?.typeName}
                        sx={{ 
                          bgcolor: '#667eea',
                          color: '#fff',
                          fontWeight: 600
                        }}
                      />
                    </Grid>

                    {/* Dates */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Date Range
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {totalDays} {totalDays === 1 ? 'day' : 'days'} {formData.isHalfDay && '(Half Day)'}
                      </Typography>
                    </Grid>

                    {/* Employee Info */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Requested By
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {currentEmployee?.firstName} {currentEmployee?.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {currentEmployee?.employeeCode}
                      </Typography>
                    </Grid>

                    {/* PTO Impact */}
                    {selectedLeaveType?.isPaidLeave && ptoBalance && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          PTO Impact
                        </Typography>
                        <Typography variant="body1">
                          <span style={{ fontWeight: 600, color: '#f44336' }}>-{totalDays}</span> days
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Remaining: {(ptoBalance.remaining - totalDays).toFixed(1)} days
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  {/* Reason */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Reason (Optional)
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={formData.reason}
                      onChange={handleReasonChange}
                      placeholder="Add a reason for your leave request..."
                      disabled={submitting}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Warning for PTO */}
              {selectedLeaveType?.isPaidLeave && ptoBalance && (ptoBalance.remaining - totalDays) < 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Warning: This request exceeds your available PTO balance. It may require special approval.
                </Alert>
              )}

              {/* Info about approval */}
              {selectedLeaveType?.requiresApproval && (
                <Alert severity="info">
                  This leave type requires approval. Your request will be sent to your manager for review.
                </Alert>
              )}
            </Box>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={activeStep === 0 ? handleCancel : handleBack}
              disabled={submitting}
              startIcon={<BackIcon />}
            >
              {activeStep === 0 ? 'Cancel' : 'Back'}
            </Button>

            <Box sx={{ flex: 1 }} />

            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<NextIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SubmitIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                  }
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            )}
          </Box>
        </Paper>

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setShowSuccess(false)} 
            severity="success" 
            sx={{ width: '100%' }}
            icon={<SuccessIcon />}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default RequestLeave;