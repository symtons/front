// src/pages/recruitment/JobApplicationForm.jsx
/**
 * JobApplicationForm Component
 * 
 * Main page for public job applications
 * Multi-step form with file uploads and PDF download
 * 
 * Features:
 * - No authentication required (public page)
 * - Multi-step form (4 steps)
 * - File upload support
 * - Form validation
 * - API submission
 * - Automatic PDF download
 * - Success confirmation
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

// Components
import ApplicationFormHeader from './components/Applicationformheader';
import ApplicationProgress from './components/ApplicationProgress';
import PersonalInfoSection from './components/PersonalInfoSection';
import PositionSection from './components/PositionSection';
import DocumentsSection from './components/DocumentsSection';
import ReviewSection from './components/ReviewSection';

// Services and Models
import jobApplicationService from '../../services/jobApplicationService';
import {
  getInitialApplicationFormData,
  validatePersonalInfo,
  validatePositionInfo,
  validateApplicationForm,
  prepareApplicationForAPI
} from './models/jobApplicationModels';

const STEPS = ['Personal Info', 'Position Details', 'Documents', 'Review & Submit'];

const JobApplicationForm = () => {
  // Form state
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(getInitialApplicationFormData());
  const [errors, setErrors] = useState({});

  // File state
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [certificationFiles, setCertificationFiles] = useState([]);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Success state
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState(null);

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const { [name]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  // Handle file change
  const handleFileChange = (fileType, file) => {
    switch (fileType) {
      case 'resume':
        setResumeFile(file);
        break;
      case 'coverLetter':
        setCoverLetterFile(file);
        break;
      case 'certifications':
        setCertificationFiles(file);
        break;
      default:
        break;
    }

    // Clear file error
    if (errors[fileType]) {
      setErrors(prev => {
        const { [fileType]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  // Validate current step
  const validateStep = (step) => {
    let stepErrors = {};

    switch (step) {
      case 0: // Personal Info
        stepErrors = validatePersonalInfo(formData);
        break;
      case 1: // Position Details
        stepErrors = validatePositionInfo(formData);
        break;
      case 2: // Documents
        // Validate resume is uploaded
        if (!resumeFile) {
          stepErrors.resume = 'Resume is required';
        }
        break;
      case 3: // Review
        // Validate terms agreement
        if (!agreedToTerms) {
          stepErrors.terms = 'You must agree to the terms before submitting';
        }
        // Validate everything
        const fullValidation = validateApplicationForm(formData);
        if (!fullValidation.isValid) {
          stepErrors = { ...stepErrors, ...fullValidation.errors };
        }
        if (!resumeFile) {
          stepErrors.resume = 'Resume is required';
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
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  // Handle edit from review
  const handleEditStep = (step) => {
    setActiveStep(step);
    window.scrollTo(0, 0);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Final validation
    if (!validateStep(3)) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare form data
      const preparedData = prepareApplicationForAPI(formData);

      // Submit application with files
      const response = await jobApplicationService.submitApplication(
        preparedData,
        resumeFile,
        coverLetterFile,
        certificationFiles
      );

      // Save application ID
      setApplicationId(response.applicationId);

      // Download PDF confirmation
      try {
        await jobApplicationService.downloadApplicationPDF(response.applicationId);
      } catch (pdfError) {
        console.error('PDF download failed:', pdfError);
        // Don't fail the whole submission if PDF download fails
      }

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
    setResumeFile(null);
    setCoverLetterFile(null);
    setCertificationFiles([]);
    setAgreedToTerms(false);
    setActiveStep(0);
    setApplicationId(null);
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
          <DocumentsSection
            formData={formData}
            onChange={handleChange}
            resumeFile={resumeFile}
            coverLetterFile={coverLetterFile}
            certificationFiles={certificationFiles}
            onFileChange={handleFileChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <ReviewSection
            formData={formData}
            resumeFile={resumeFile}
            coverLetterFile={coverLetterFile}
            certificationFiles={certificationFiles}
            onEditStep={handleEditStep}
            agreedToTerms={agreedToTerms}
            onAgreeToTerms={setAgreedToTerms}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f59e42 100%)',
        py: 4,
        px: 2
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={6}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            backgroundColor: '#fff'
          }}
        >
          {/* Header */}
          <ApplicationFormHeader />

          {/* Progress Stepper */}
          <Box sx={{ px: 3 }}>
            <ApplicationProgress activeStep={activeStep} steps={STEPS} />
          </Box>

          {/* Form Content */}
          <Box sx={{ p: 4 }}>
            {/* Error Alert */}
            {submitError && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
                {submitError}
              </Alert>
            )}

            {/* Step Content */}
            {renderStepContent()}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
              <Button
                variant="outlined"
                startIcon={<BackIcon />}
                onClick={handleBack}
                disabled={activeStep === 0 || submitting}
                sx={{
                  minWidth: 120,
                  visibility: activeStep === 0 ? 'hidden' : 'visible'
                }}
              >
                Back
              </Button>

              {activeStep === STEPS.length - 1 ? (
                <Button
                  variant="contained"
                  endIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SubmitIcon />}
                  onClick={handleSubmit}
                  disabled={submitting}
                  sx={{
                    minWidth: 160,
                    background: 'linear-gradient(90deg, #667eea 0%, #f59e42 100%)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #5568d3 0%, #e08a2e 100%)'
                    }
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  endIcon={<NextIcon />}
                  onClick={handleNext}
                  sx={{
                    minWidth: 120,
                    backgroundColor: '#667eea',
                    '&:hover': {
                      backgroundColor: '#5568d3'
                    }
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Success Dialog */}
      <Dialog
        open={showSuccess}
        onClose={handleCloseSuccess}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <SuccessIcon sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Application Submitted Successfully!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Thank you for applying to Tennessee Personal Assistance.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
            Your application has been received and is being reviewed by our HR team.
          </Typography>
          {applicationId && (
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Application ID:
              </Typography>
              <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 700 }}>
                {applicationId}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" sx={{ color: '#666' }}>
            A confirmation email has been sent to your email address. 
            Please save your Application ID for future reference.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: '#999' }}>
            Your application confirmation PDF has been downloaded automatically.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            onClick={handleCloseSuccess}
            sx={{
              backgroundColor: '#667eea',
              px: 4,
              '&:hover': {
                backgroundColor: '#5568d3'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobApplicationForm;