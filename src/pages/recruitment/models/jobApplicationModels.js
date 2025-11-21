// src/pages/recruitment/models/jobApplicationModels.js
/**
 * Job Application Models, Constants, and Helper Functions
 * 
 * This file contains all data structures, validation logic, and helper functions
 * for the Job Application module, following the established patterns in the project.
 */

// ============================================
// CONSTANTS - DROPDOWN OPTIONS
// ============================================

/**
 * Gender options for application form
 */
export const GENDER_OPTIONS = [
  { value: '', label: 'Select Gender' },
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'PreferNotToSay', label: 'Prefer not to say' }
];

/**
 * Employee type preference options
 */
export const EMPLOYEE_TYPE_OPTIONS = [
  { value: '', label: 'Select Employee Type' },
  { value: 'AdminStaff', label: 'Admin Staff' },
  { value: 'FieldStaff', label: 'Field Staff' }
];

/**
 * Education level options
 */
export const EDUCATION_LEVEL_OPTIONS = [
  { value: '', label: 'Select Education Level' },
  { value: 'HighSchool', label: 'High School Diploma/GED' },
  { value: 'Associate', label: 'Associate Degree' },
  { value: 'Bachelor', label: 'Bachelor\'s Degree' },
  { value: 'Master', label: 'Master\'s Degree' },
  { value: 'PhD', label: 'Doctorate (PhD)' },
  { value: 'Other', label: 'Other' }
];

/**
 * Department preference options (should match backend Departments)
 */
export const DEPARTMENT_OPTIONS = [
  { value: '', label: 'Select Department' },
  { value: 'Nursing', label: 'Nursing' },
  { value: 'EventManagement', label: 'Event Management' },
  { value: 'HR', label: 'Human Resources' },
  { value: 'IT', label: 'Information Technology' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Programs', label: 'Programs' }
];

/**
 * How did you hear about us options
 */
export const HOW_HEARD_OPTIONS = [
  { value: '', label: 'Select an option' },
  { value: 'Website', label: 'Company Website' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Indeed', label: 'Indeed' },
  { value: 'Glassdoor', label: 'Glassdoor' },
  { value: 'Referral', label: 'Employee Referral' },
  { value: 'JobFair', label: 'Job Fair' },
  { value: 'SocialMedia', label: 'Social Media' },
  { value: 'Other', label: 'Other' }
];

/**
 * Availability type options
 */
export const AVAILABILITY_OPTIONS = [
  { value: '', label: 'Select Availability' },
  { value: 'FullTime', label: 'Full-Time' },
  { value: 'PartTime', label: 'Part-Time' },
  { value: 'Either', label: 'Either Full-Time or Part-Time' }
];

/**
 * US States options
 */
export const STATE_OPTIONS = [
  { value: '', label: 'Select State' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

/**
 * Application status constants
 */
export const APPLICATION_STATUS = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'UnderReview',
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

// ============================================
// INITIAL FORM DATA
// ============================================

/**
 * Get initial empty form data structure
 * @returns {Object} Initial form data
 */
export const getInitialApplicationFormData = () => ({
  // Personal Information
  firstName: '',
  lastName: '',
  middleName: '',
  dateOfBirth: '',
  gender: '',
  phoneNumber: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'USA',

  // Position Details
  positionAppliedFor: '',
  departmentPreference: '',
  preferredEmployeeType: '',
  expectedStartDate: '',
  desiredSalary: '',

  // Experience & Qualifications
  yearsOfExperience: '',
  educationLevel: '',
  certifications: '',
  previousEmployer: '',
  skills: '',

  // Additional Information
  howDidYouHear: '',
  availabilityType: '',
  willingToRelocate: false,
  additionalNotes: ''
});

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (US format)
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid
 */
export const isValidPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
};

/**
 * Validate ZIP code format
 * @param {string} zipCode - ZIP code
 * @returns {boolean} True if valid
 */
export const isValidZipCode = (zipCode) => {
  const cleaned = zipCode.replace(/\D/g, '');
  return cleaned.length === 5 || cleaned.length === 9;
};

/**
 * Validate date is in the past (for date of birth)
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @returns {boolean} True if valid
 */
export const isValidDateOfBirth = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  const minAge = 16; // Minimum age requirement
  const maxAge = 100;
  
  const age = (today - date) / (1000 * 60 * 60 * 24 * 365.25);
  return age >= minAge && age <= maxAge;
};

/**
 * Validate date is in the future (for expected start date)
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @returns {boolean} True if valid
 */
export const isValidFutureDate = (dateString) => {
  if (!dateString) return true; // Optional field
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Validate personal information section
 * @param {Object} formData - Form data
 * @returns {Object} Validation errors
 */
export const validatePersonalInfo = (formData) => {
  const errors = {};

  // Required fields
  if (!formData.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }
  if (!formData.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }
  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }
  if (!formData.phoneNumber?.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!isValidPhoneNumber(formData.phoneNumber)) {
    errors.phoneNumber = 'Invalid phone number (10 digits required)';
  }

  // Optional but validated if provided
  if (formData.dateOfBirth && !isValidDateOfBirth(formData.dateOfBirth)) {
    errors.dateOfBirth = 'Must be at least 16 years old';
  }
  if (formData.zipCode && !isValidZipCode(formData.zipCode)) {
    errors.zipCode = 'Invalid ZIP code format';
  }

  return errors;
};

/**
 * Validate position information section
 * @param {Object} formData - Form data
 * @returns {Object} Validation errors
 */
export const validatePositionInfo = (formData) => {
  const errors = {};

  if (!formData.positionAppliedFor?.trim()) {
    errors.positionAppliedFor = 'Position is required';
  }
  if (!formData.preferredEmployeeType) {
    errors.preferredEmployeeType = 'Employee type is required';
  }

  // Optional but validated if provided
  if (formData.expectedStartDate && !isValidFutureDate(formData.expectedStartDate)) {
    errors.expectedStartDate = 'Start date must be today or in the future';
  }
  if (formData.desiredSalary && (isNaN(formData.desiredSalary) || formData.desiredSalary < 0)) {
    errors.desiredSalary = 'Invalid salary amount';
  }
  if (formData.yearsOfExperience && (isNaN(formData.yearsOfExperience) || formData.yearsOfExperience < 0)) {
    errors.yearsOfExperience = 'Invalid years of experience';
  }

  return errors;
};

/**
 * Validate complete application form
 * @param {Object} formData - Complete form data
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateApplicationForm = (formData) => {
  const personalErrors = validatePersonalInfo(formData);
  const positionErrors = validatePositionInfo(formData);

  const allErrors = { ...personalErrors, ...positionErrors };

  return {
    isValid: Object.keys(allErrors).length === 0,
    errors: allErrors
  };
};

// ============================================
// FORMATTING FUNCTIONS
// ============================================

/**
 * Format phone number to (XXX) XXX-XXXX
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) return phone;
  
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};

/**
 * Format ZIP code to XXXXX or XXXXX-XXXX
 * @param {string} zipCode - ZIP code
 * @returns {string} Formatted ZIP code
 */
export const formatZipCode = (zipCode) => {
  const cleaned = zipCode.replace(/\D/g, '');
  if (cleaned.length === 5) {
    return cleaned;
  } else if (cleaned.length === 9) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  return zipCode;
};

/**
 * Format currency amount
 * @param {number|string} amount - Amount to format
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format full name from parts
 * @param {string} firstName - First name
 * @param {string} middleName - Middle name
 * @param {string} lastName - Last name
 * @returns {string} Full name
 */
export const formatFullName = (firstName, middleName, lastName) => {
  const parts = [firstName, middleName, lastName].filter(Boolean);
  return parts.join(' ');
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get employee type label
 * @param {string} type - Employee type value
 * @returns {string} Display label
 */
export const getEmployeeTypeLabel = (type) => {
  const option = EMPLOYEE_TYPE_OPTIONS.find(opt => opt.value === type);
  return option ? option.label : type;
};

/**
 * Get education level label
 * @param {string} level - Education level value
 * @returns {string} Display label
 */
export const getEducationLevelLabel = (level) => {
  const option = EDUCATION_LEVEL_OPTIONS.find(opt => opt.value === level);
  return option ? option.label : level;
};

/**
 * Get application status color
 * @param {string} status - Application status
 * @returns {string} Color for status chip
 */
export const getApplicationStatusColor = (status) => {
  const colors = {
    'Submitted': 'info',
    'UnderReview': 'warning',
    'Pending': 'warning',
    'Approved': 'success',
    'Rejected': 'error'
  };
  return colors[status] || 'default';
};

/**
 * Calculate application completion percentage
 * @param {Object} formData - Form data
 * @returns {number} Completion percentage (0-100)
 */
export const calculateCompletionPercentage = (formData) => {
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'positionAppliedFor',
    'preferredEmployeeType'
  ];

  const optionalImportantFields = [
    'dateOfBirth',
    'address',
    'city',
    'state',
    'zipCode',
    'departmentPreference',
    'yearsOfExperience',
    'educationLevel'
  ];

  const allFields = [...requiredFields, ...optionalImportantFields];
  
  const filledFields = allFields.filter(field => {
    const value = formData[field];
    return value !== null && value !== undefined && value !== '';
  });

  return Math.round((filledFields.length / allFields.length) * 100);
};

/**
 * Prepare application data for API submission
 * @param {Object} formData - Raw form data
 * @returns {Object} Formatted data for API
 */
export const prepareApplicationForAPI = (formData) => {
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
    state: formData.state || null,
    zipCode: formData.zipCode?.trim() || null,
    country: formData.country?.trim() || 'USA',

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
    additionalNotes: formData.additionalNotes?.trim() || null
  };
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get minimum date for date of birth (16 years ago)
 * @returns {string} Minimum date in YYYY-MM-DD format
 */
export const getMinDateOfBirth = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 100);
  return date.toISOString().split('T')[0];
};

/**
 * Get maximum date for date of birth (16 years ago for minimum age)
 * @returns {string} Maximum date in YYYY-MM-DD format
 */
export const getMaxDateOfBirth = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 16);
  return date.toISOString().split('T')[0];
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  // Constants
  GENDER_OPTIONS,
  EMPLOYEE_TYPE_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  DEPARTMENT_OPTIONS,
  HOW_HEARD_OPTIONS,
  AVAILABILITY_OPTIONS,
  STATE_OPTIONS,
  APPLICATION_STATUS,

  // Initial Data
  getInitialApplicationFormData,

  // Validation
  isValidEmail,
  isValidPhoneNumber,
  isValidZipCode,
  isValidDateOfBirth,
  isValidFutureDate,
  validatePersonalInfo,
  validatePositionInfo,
  validateApplicationForm,

  // Formatting
  formatPhoneNumber,
  formatZipCode,
  formatCurrency,
  formatDate,
  formatFullName,

  // Helpers
  getEmployeeTypeLabel,
  getEducationLevelLabel,
  getApplicationStatusColor,
  calculateCompletionPercentage,
  prepareApplicationForAPI,
  getTodayString,
  getMinDateOfBirth,
  getMaxDateOfBirth
};