// src/pages/recruitment/JobApplicationForm.jsx
/**
 * JobApplicationForm Component - UPDATED VERSION
 * 
 * 8-Step comprehensive job application (NO FILE UPLOADS)
 * All document uploads removed - form data only
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  Send as SubmitIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';

// Import all step components
import ApplicationFormHeader from './components/Applicationformheader';
import ApplicationProgress from './components/ApplicationProgress';
import PersonalInfoSection from './components/PersonalInfoSection';
import PositionSection from './components/PositionSection';
import BackgroundQuestionsSection from './components/BackgroundQuestionsSection';
import EducationSection from './components/EducationSection';
import LicensesSection from './components/LicensesSection';
import ReferencesSection from './components/ReferencesSection';
import EmploymentHistorySection from './components/EmploymentHistorySection';
import AuthorizationsSection from './components/AuthorizationsSection';

// Import services and models
import {
  getInitialApplicationFormData,
  validatePersonalInfo,
  validatePositionInfo,
  validateBackgroundQuestions,
  validateReferences,
  validateAuthorizations,
  prepareApplicationForAPI
} from './models/jobApplicationModels';

// API Configuration
const API_BASE_URL = 'https://localhost:7144/api';

const STEPS = [
  'Personal Info',
  'Position & Availability',
  'Background Questions',
  'Education',
  'Licenses & Certifications',
  'References',
  'Employment History',
  'Authorizations & Submit'
];

const JobApplicationForm = () => {
  // Form state
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(getInitialApplicationFormData());
  const [errors, setErrors] = useState({});

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState(null);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validate current step
  const validateStep = (step) => {
    let stepErrors = {};
    
    switch (step) {
      case 0:
        // Personal Information
        const personalValidation = validatePersonalInfo(formData);
        if (!personalValidation.isValid) {
          stepErrors = { ...personalValidation.errors };
        }
        break;
        
      case 1:
        // Position & Availability
        const positionValidation = validatePositionInfo(formData);
        if (!positionValidation.isValid) {
          stepErrors = { ...positionValidation.errors };
        }
        break;
        
      case 2:
        // Background Questions
        const backgroundValidation = validateBackgroundQuestions(formData);
        if (!backgroundValidation.isValid) {
          stepErrors = { ...backgroundValidation.errors };
        }
        break;
        
      case 3:
        // Education - Optional, no required validation
        break;
        
      case 4:
        // Licenses - Optional, no required validation
        break;
        
      case 5:
        // References
        const referencesValidation = validateReferences(formData);
        if (!referencesValidation.isValid) {
          stepErrors = { ...referencesValidation.errors };
        }
        break;
        
      case 6:
        // Employment History - Optional but recommended
        // No validation errors, just proceed
        break;
        
      case 7:
        // Authorizations
        const authValidation = validateAuthorizations(formData);
        if (!authValidation.isValid) {
          stepErrors = { ...authValidation.errors };
        }
        break;
        
      default:
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      window.scrollTo(0, 0);
      setErrors({}); // Clear errors when moving to next step
    } else {
      window.scrollTo(0, 0);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setErrors({}); // Clear errors when going back
    window.scrollTo(0, 0);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Final validation
    if (!validateStep(7)) {
      window.scrollTo(0, 0);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare form data for API
      const preparedData = prepareApplicationForAPI(formData);

      console.log('Submitting application data:', preparedData);

      // Submit application (NO FILES - just JSON data)
      const response = await fetch(`${API_BASE_URL}/JobApplication/Submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preparedData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Application submitted successfully:', data);

      // Save application ID
      setApplicationId(data.applicationId);

      // Show success dialog
      setShowSuccess(true);

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error.message || 'Failed to submit application. Please try again.');
      window.scrollTo(0, 0);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle success dialog close
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    // Reset form
    setFormData(getInitialApplicationFormData());
    setActiveStep(0);
    setApplicationId(null);
    setErrors({});
    window.scrollTo(0, 0);
  };

  // Render current step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <PersonalInfoSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <PositionSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <BackgroundQuestionsSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <EducationSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <LicensesSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 5:
        return (
          <ReferencesSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 6:
        return (
          <EmploymentHistorySection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 7:
        return (
          <AuthorizationsSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ApplicationFormHeader />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Progress Stepper */}
          <ApplicationProgress activeStep={activeStep} steps={STEPS} />

          {/* Error Alert */}
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}

          {/* Validation Errors Alert */}
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Please correct the errors below before proceeding:
              </Typography>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                {Object.entries(errors).map(([key, message]) => (
                  <li key={key}>
                    <Typography variant="body2">{message}</Typography>
                  </li>
                ))}
              </ul>
            </Alert>
          )}

          {/* Step Content */}
          <Box sx={{ mt: 3, mb: 4, minHeight: '400px' }}>
            {renderStepContent()}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={handleBack}
              disabled={activeStep === 0 || submitting}
            >
              Back
            </Button>

            <Box>
              {activeStep < STEPS.length - 1 ? (
                <Button
                  variant="contained"
                  endIcon={<NextIcon />}
                  onClick={handleNext}
                  disabled={submitting}
                  sx={{
                    backgroundColor: '#667eea',
                    '&:hover': {
                      backgroundColor: '#5568d3'
                    }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  endIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SubmitIcon />}
                  onClick={handleSubmit}
                  disabled={submitting}
                  sx={{
                    backgroundColor: '#4caf50',
                    '&:hover': {
                      backgroundColor: '#45a049'
                    }
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onClose={handleCloseSuccess} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <SuccessIcon sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Application Submitted Successfully!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Thank you for applying to Tennessee Personal Assistance, Inc.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Your application ID: <strong>#{applicationId}</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            We will review your application and contact you soon.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleCloseSuccess}
            sx={{
              backgroundColor: '#667eea',
              '&:hover': {
                backgroundColor: '#5568d3'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JobApplicationForm;