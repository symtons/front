// src/services/jobApplicationService.js
/**
 * Job Application Service
 * 
 * Handles all API calls for job application submission and management
 * Includes PDF download functionality for application confirmation
 */

import axios from 'axios';

// API Base URL - matches your existing services
const API_BASE_URL = 'https://localhost:7144/api';

// Create a separate axios instance for job applications (no authentication required)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create multipart axios instance for file uploads
const publicApiMultipart = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const jobApplicationService = {
  
  // ============================================
  // PUBLIC APPLICATION SUBMISSION
  // ============================================

  /**
   * Submit a new job application (with documents)
   * POST /api/JobApplication/Submit
   * 
   * @param {Object} applicationData - Form data
   * @param {File} resumeFile - Resume file object
   * @param {File} coverLetterFile - Cover letter file object (optional)
   * @param {Array<File>} certificationFiles - Certification files (optional)
   * @returns {Promise<Object>} Response with applicationId and PDF download info
   */
  submitApplication: async (applicationData, resumeFile, coverLetterFile = null, certificationFiles = []) => {
    try {
      // Create FormData object for multipart submission
      const formData = new FormData();

      // Add all text fields
      Object.keys(applicationData).forEach(key => {
        if (applicationData[key] !== null && applicationData[key] !== undefined && applicationData[key] !== '') {
          formData.append(key, applicationData[key]);
        }
      });

      // Add resume file (required)
      if (resumeFile) {
        formData.append('resumeFile', resumeFile);
      }

      // Add cover letter file (optional)
      if (coverLetterFile) {
        formData.append('coverLetterFile', coverLetterFile);
      }

      // Add certification files (optional)
      if (certificationFiles && certificationFiles.length > 0) {
        certificationFiles.forEach((file, index) => {
          formData.append('certificationFiles', file);
        });
      }

      // Submit application
      const response = await publicApiMultipart.post('/JobApplication/Submit', formData);
      
      return response.data;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw {
        message: error.response?.data?.message || 'Failed to submit application. Please try again.',
        errors: error.response?.data?.errors || null
      };
    }
  },

  /**
   * Download application confirmation PDF
   * GET /api/JobApplication/DownloadPDF/{applicationId}
   * 
   * @param {number} applicationId - Application ID
   * @returns {Promise<Blob>} PDF blob for download
   */
  downloadApplicationPDF: async (applicationId) => {
    try {
      const response = await publicApi.get(
        `/JobApplication/DownloadPDF/${applicationId}`,
        {
          responseType: 'blob', // Important for file download
        }
      );

      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Application_${applicationId}_Confirmation.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'PDF downloaded successfully' };
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw {
        message: error.response?.data?.message || 'Failed to download PDF. Please try again.',
      };
    }
  },

  /**
   * Get application status by ID (public endpoint for applicants to check status)
   * GET /api/JobApplication/Status/{applicationId}
   * 
   * @param {number} applicationId - Application ID
   * @returns {Promise<Object>} Application status info
   */
  getApplicationStatus: async (applicationId) => {
    try {
      const response = await publicApi.get(`/JobApplication/Status/${applicationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application status:', error);
      throw {
        message: error.response?.data?.message || 'Failed to fetch application status.',
      };
    }
  },

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Validate file type
   * @param {File} file - File to validate
   * @param {Array<string>} allowedTypes - Allowed MIME types
   * @returns {boolean} True if valid
   */
  validateFileType: (file, allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']) => {
    if (!file) return false;
    return allowedTypes.includes(file.type);
  },

  /**
   * Validate file size
   * @param {File} file - File to validate
   * @param {number} maxSizeMB - Maximum size in MB (default 5MB)
   * @returns {boolean} True if valid
   */
  validateFileSize: (file, maxSizeMB = 5) => {
    if (!file) return false;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },

  /**
   * Get file size in human-readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Validate all uploaded files
   * @param {File} resumeFile - Resume file
   * @param {File} coverLetterFile - Cover letter file
   * @param {Array<File>} certificationFiles - Certification files
   * @returns {Object} Validation result with errors
   */
  validateFiles: (resumeFile, coverLetterFile = null, certificationFiles = []) => {
    const errors = {};

    // Validate resume (required)
    if (!resumeFile) {
      errors.resume = 'Resume is required';
    } else {
      if (!jobApplicationService.validateFileType(resumeFile)) {
        errors.resume = 'Resume must be a PDF or Word document';
      }
      if (!jobApplicationService.validateFileSize(resumeFile)) {
        errors.resume = 'Resume file size must be less than 5MB';
      }
    }

    // Validate cover letter (optional)
    if (coverLetterFile) {
      if (!jobApplicationService.validateFileType(coverLetterFile)) {
        errors.coverLetter = 'Cover letter must be a PDF or Word document';
      }
      if (!jobApplicationService.validateFileSize(coverLetterFile)) {
        errors.coverLetter = 'Cover letter file size must be less than 5MB';
      }
    }

    // Validate certifications (optional)
    if (certificationFiles && certificationFiles.length > 0) {
      certificationFiles.forEach((file, index) => {
        if (!jobApplicationService.validateFileType(file, ['application/pdf'])) {
          errors[`certification${index}`] = 'Certification files must be PDF only';
        }
        if (!jobApplicationService.validateFileSize(file)) {
          errors[`certification${index}`] = 'Certification file size must be less than 5MB';
        }
      });
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Prepare application data for submission
   * Converts form data to API format
   * @param {Object} formData - Raw form data
   * @returns {Object} Formatted application data
   */
  prepareApplicationData: (formData) => {
    return {
      // Personal Information
      firstName: formData.firstName?.trim(),
      lastName: formData.lastName?.trim(),
      middleName: formData.middleName?.trim() || null,
      dateOfBirth: formData.dateOfBirth || null,
      gender: formData.gender || null,
      phoneNumber: formData.phoneNumber?.trim(),
      email: formData.email?.trim(),
      address: formData.address?.trim() || null,
      city: formData.city?.trim() || null,
      state: formData.state?.trim() || null,
      zipCode: formData.zipCode?.trim() || null,
      country: formData.country?.trim() || null,

      // Position Details
      positionAppliedFor: formData.positionAppliedFor?.trim(),
      departmentPreference: formData.departmentPreference || null,
      preferredEmployeeType: formData.preferredEmployeeType,
      expectedStartDate: formData.expectedStartDate || null,
      desiredSalary: formData.desiredSalary ? parseFloat(formData.desiredSalary) : null,

      // Experience & Qualifications
      yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : null,
      educationLevel: formData.educationLevel || null,
      certifications: formData.certifications?.trim() || null,
      previousEmployer: formData.previousEmployer?.trim() || null,
      skills: formData.skills?.trim() || null,

      // Additional Information
      howDidYouHear: formData.howDidYouHear || null,
      availabilityType: formData.availabilityType || null,
      willingToRelocate: formData.willingToRelocate || false,
      additionalNotes: formData.additionalNotes?.trim() || null,
    };
  },
};

export default jobApplicationService;