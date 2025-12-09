// src/pages/hr-actions/HRActionRequestForm.jsx
// HR Action Request Form - Employee Submits Request
// FIXED: Ensures newRateType is always set for promotions

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Assignment as HRIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  CheckCircle as SubmitIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Universal Components
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import { Loading } from '../../components/common';

// HR Actions Components - ALL 8 FORMS
import {
  ActionTypeSelector,
  RateChangeForm,
  TransferForm,
  PromotionForm,
  StatusChangeForm,
  PersonalInfoForm,
  InsuranceForm,
  PayrollDeductionForm,
  LeaveOfAbsenceForm
} from './components';

// Services
import hrActionService from '../../services/hrActionService';

// Models
import {
  ACTION_TYPES,
  validateRateChange,
  validateTransfer,
  validatePromotion,
  validateStatusChange,
  validatePersonalInfo
} from './models/hrActionModels';

const steps = ['Select Action Type', 'Fill Details', 'Review & Submit'];

const HRActionRequestForm = () => {
  const navigate = useNavigate();
  
  // State
  const [activeStep, setActiveStep] = useState(0);
  const [selectedActionType, setSelectedActionType] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Success dialog
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  useEffect(() => {
    fetchCurrentEmployee();
  }, []);

  const fetchCurrentEmployee = async () => {
    try {
      setLoading(true);
      
      // Get employee data from localStorage
      const employeeStr = localStorage.getItem('employee');
      if (employeeStr) {
        const employee = JSON.parse(employeeStr);
        setCurrentEmployee({
          firstName: employee.firstName || '',
          lastName: employee.lastName || '',
          middleName: employee.middleName || '',
          email: employee.email || '',
          phone: employee.phoneNumber || '',
          address: employee.address || '',
          city: employee.city || '',
          state: employee.state || '',
          zipCode: employee.zipCode || '',
          salary: employee.salary || employee.hourlyRate || 0,
          payFrequency: employee.payFrequency || 'Salary',
          jobTitle: employee.jobTitle || '',
          department: employee.departmentName || '',
          employmentType: employee.employmentType || 'FT',
          maritalStatus: employee.maritalStatus || '',
          supervisor: employee.supervisorName || '',
          location: employee.location || ''
        });
      } else {
        setCurrentEmployee({
          firstName: '',
          lastName: '',
          salary: 0,
          payFrequency: 'Salary',
          jobTitle: 'Employee',
          department: 'General',
          employmentType: 'FT'
        });
      }
    } catch (err) {
      console.error('Error loading employee:', err);
      setCurrentEmployee({
        salary: 0,
        payFrequency: 'Salary',
        jobTitle: 'Employee',
        department: 'General',
        employmentType: 'FT'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActionTypeSelect = (actionType) => {
    setSelectedActionType(actionType);
    setFormData({
      actionTypeId: actionType.id,
      oldRate: currentEmployee?.salary,
      oldRateType: currentEmployee?.payFrequency,
      oldJobTitle: currentEmployee?.jobTitle,
      oldEmploymentType: currentEmployee?.employmentType,
      oldMaritalStatus: currentEmployee?.maritalStatus,
      oldFirstName: currentEmployee?.firstName,
      oldLastName: currentEmployee?.lastName,
      oldAddress: currentEmployee?.address,
      oldPhone: currentEmployee?.phone,
      oldEmail: currentEmployee?.email,
      // IMPORTANT: Set default newRateType for promotions
      newRateType: currentEmployee?.payFrequency || 'Salary'
    });
    setActiveStep(1);
  };

  const handleFormChange = (newData) => {
    setFormData(newData);
    setErrors({});
  };

  const validateCurrentStep = () => {
    if (activeStep === 0) {
      return selectedActionType !== null;
    }
    
    if (activeStep === 1) {
      let validationErrors = {};
      
      switch (selectedActionType?.id) {
        case ACTION_TYPES.RATE_CHANGE:
          validationErrors = validateRateChange(formData);
          break;
        case ACTION_TYPES.TRANSFER:
          validationErrors = validateTransfer(formData);
          break;
        case ACTION_TYPES.PROMOTION:
          // CRITICAL FIX: Ensure newRateType is set
          if (!formData.newRateType) {
            formData.newRateType = currentEmployee?.payFrequency || 'Salary';
          }
          validationErrors = validatePromotion(formData);
          break;
        case ACTION_TYPES.STATUS_CHANGE:
          validationErrors = validateStatusChange(formData);
          break;
        case ACTION_TYPES.PERSONAL_INFO:
          validationErrors = validatePersonalInfo(formData);
          break;
        default:
          if (!formData.reason || formData.reason.length < 10) {
            validationErrors.reason = 'Reason is required (minimum 10 characters)';
          }
          if (!formData.effectiveDate && !formData.insuranceEffectiveDate && !formData.deductionStartDate && !formData.leaveStartDate) {
            validationErrors.effectiveDate = 'Effective date is required';
          }
          break;
      }
      
      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');
      
      // CRITICAL FIX: Ensure newRateType has a value for promotions
      const dataToSubmit = { ...formData };
      
      if (selectedActionType?.id === ACTION_TYPES.PROMOTION) {
        if (!dataToSubmit.newRateType) {
          dataToSubmit.newRateType = currentEmployee?.payFrequency || 'Salary';
        }
      }
      
      // Also ensure newRateType for rate changes
      if (selectedActionType?.id === ACTION_TYPES.RATE_CHANGE) {
        if (!dataToSubmit.newRateType) {
          dataToSubmit.newRateType = currentEmployee?.payFrequency || 'Salary';
        }
      }
      
      console.log('🚀 Final data to submit:', dataToSubmit);
      
      const response = await hrActionService.submitRequest(dataToSubmit);
      
      setSubmittedRequest(response);
      setSuccessDialogOpen(true);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessDialogOpen(false);
    navigate('/leave/my-requests');
  };

  const getActionTypeName = (id) => {
    const types = {
      1: 'Rate Change',
      2: 'Transfer',
      3: 'Promotion',
      4: 'Status Change',
      5: 'Personal Info Change',
      6: 'Insurance Change',
      7: 'Payroll Deduction',
      8: 'Leave of Absence'
    };
    return types[id] || 'HR Action';
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ActionTypeSelector
            onSelect={handleActionTypeSelect}
            selectedTypeId={selectedActionType?.id}
          />
        );
      
      case 1:
        switch (selectedActionType?.id) {
          case ACTION_TYPES.RATE_CHANGE:
            return (
              <RateChangeForm
                formData={formData}
                onChange={handleFormChange}
                errors={errors}
                currentEmployee={currentEmployee}
              />
            );
          
          case ACTION_TYPES.TRANSFER:
            return (
              <TransferForm
                formData={formData}
                onChange={handleFormChange}
                errors={errors}
                currentEmployee={currentEmployee}
              />
            );
          
          case ACTION_TYPES.PROMOTION:
            return (
              <PromotionForm
                formData={formData}
                onChange={handleFormChange}
                errors={errors}
                currentEmployee={currentEmployee}
              />
            );
          
          case ACTION_TYPES.STATUS_CHANGE:
            return (
              <StatusChangeForm
                formData={formData}
                onChange={handleFormChange}
                errors={errors}
                currentEmployee={currentEmployee}
              />
            );
          
          case ACTION_TYPES.PERSONAL_INFO:
            return (
              <PersonalInfoForm
                formData={formData}
                onChange={handleFormChange}
                errors={errors}
                currentEmployee={currentEmployee}
              />
            );
          
          case ACTION_TYPES.INSURANCE:
            return (
              <InsuranceForm
                formData={formData}
                onChange={handleFormChange}
                errors={errors}
                currentEmployee={currentEmployee}
              />
            );
          
          case ACTION_TYPES.PAYROLL_DEDUCTION:
            return (
              <PayrollDeductionForm
                formData={formData}
                onChange={handleFormChange}
                errors={errors}
                currentEmployee={currentEmployee}
              />
            );
          
          case ACTION_TYPES.LEAVE_OF_ABSENCE:
            return (
              <LeaveOfAbsenceForm
                formData={formData}
                onChange={handleFormChange}
                errors={errors}
                currentEmployee={currentEmployee}
              />
            );
          
          default:
            return (
              <Alert severity="error" sx={{ my: 3 }}>
                Invalid action type selected. Please go back and select a valid action type.
              </Alert>
            );
        }
      
      case 2:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please review your request details before submitting. Your request will be sent to HR for approval.
            </Alert>
            
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Request Summary
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Action Type
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {getActionTypeName(selectedActionType?.id)}
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Effective Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formData.effectiveDate || formData.insuranceEffectiveDate || formData.deductionStartDate || formData.leaveStartDate || 'Not specified'}
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Reason
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formData.reason || 'Not specified'}
                </Typography>
              </Box>

              {formData.notes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Additional Notes
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formData.notes}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading employee information..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        icon={HRIcon}
        title="Request HR Action"
        subtitle="Submit a request for HR action"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0 || submitting}
            startIcon={<BackIcon />}
          >
            Back
          </Button>

          <Box>
            {activeStep < steps.length - 1 && (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<NextIcon />}
                disabled={submitting}
              >
                Next
              </Button>
            )}

            {activeStep === steps.length - 1 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : <SubmitIcon />}
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={successDialogOpen}
        onClose={handleSuccessClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SubmitIcon color="success" />
            Request Submitted Successfully
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Your HR action request has been submitted successfully.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Request Number:</strong> {submittedRequest?.requestNumber || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            You will receive a notification once your request is reviewed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessClose} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default HRActionRequestForm;