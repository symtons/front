// src/pages/hr-actions/HRActionRequestForm.jsx
// HR Action Request Form - Employee Submits Request

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
  DialogActions
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

// HR Actions Components
import ActionTypeSelector from './components/ActionTypeSelector';
import RateChangeForm from './components/RateChangeForm';

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
      // Get current employee info from profile or context
      // For now, we'll use a placeholder
      setCurrentEmployee({
        salary: 50000,
        payFrequency: 'Salary',
        jobTitle: 'Nurse',
        department: 'Nursing',
        employmentType: 'FT'
      });
    } catch (err) {
      setError('Failed to load employee information');
    } finally {
      setLoading(false);
    }
  };

  const handleActionTypeSelect = (actionType) => {
    setSelectedActionType(actionType);
    setFormData({
      actionTypeId: actionType.id,
      // Pre-fill current values
      oldRate: currentEmployee?.salary,
      oldRateType: currentEmployee?.payFrequency,
      oldJobTitle: currentEmployee?.jobTitle,
      oldEmploymentType: currentEmployee?.employmentType
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
          validationErrors = validatePromotion(formData);
          break;
        case ACTION_TYPES.STATUS_CHANGE:
          validationErrors = validateStatusChange(formData);
          break;
        case ACTION_TYPES.PERSONAL_INFO:
          validationErrors = validatePersonalInfo(formData);
          break;
        default:
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
      
      const response = await hrActionService.submitRequest(formData);
      
      setSubmittedRequest(response);
      setSuccessDialogOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessDialogOpen(false);
    navigate('/hr-actions/my-requests');
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
        // Render appropriate form based on action type
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
          
          // Add other form types here
          default:
            return (
              <Alert severity="info">
                Form for {selectedActionType?.name} is under development.
              </Alert>
            );
        }
      
      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              Review Your Request
            </Typography>
            
            <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Action Type:</strong> {selectedActionType?.name}
              </Typography>
              
              {/* Display summary based on action type */}
              {selectedActionType?.id === ACTION_TYPES.RATE_CHANGE && (
                <>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Current Rate:</strong> ${formData.oldRate?.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>New Rate:</strong> ${formData.newRate?.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Rate Type:</strong> {formData.newRateType}
                  </Typography>
                  {formData.premiumIncentive && (
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Premium/Incentive:</strong> {formData.premiumIncentive}
                    </Typography>
                  )}
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Effective Date:</strong> {formData.effectiveDate}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Reason:</strong> {formData.reason}
                  </Typography>
                </>
              )}
            </Paper>
            
            <Alert severity="info" sx={{ mt: 3 }}>
              Please review your information carefully. Once submitted, this request will be sent to HR for approval.
            </Alert>
          </Box>
        );
      
      default:
        return null;
    }
  };

  if (loading) return <Loading message="Loading form..." />;

  return (
    <Layout>
      <PageHeader
        icon={HRIcon}
        title="Request HR Action"
        subtitle="Submit a new HR action request for approval"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Paper sx={{ p: 4, mb: 3 }}>
        {renderStepContent()}
      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={handleBack}
          disabled={activeStep === 0 || submitting}
        >
          Back
        </Button>
        
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="success"
              startIcon={submitting ? null : <SubmitIcon />}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          ) : (
            <Button
              variant="contained"
              endIcon={<NextIcon />}
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={handleSuccessClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#4caf50', color: 'white' }}>
          Request Submitted Successfully!
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {submittedRequest && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Your HR action request has been submitted and is pending approval.
              </Typography>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Request Number: {submittedRequest.requestNumber}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Action Type: {selectedActionType?.name}
                </Typography>
                <Typography variant="body2">
                  Status: {submittedRequest.status}
                </Typography>
              </Paper>
              <Alert severity="info" sx={{ mt: 2 }}>
                You will be notified once your request has been reviewed by HR.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleSuccessClose}>
            View My Requests
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default HRActionRequestForm;