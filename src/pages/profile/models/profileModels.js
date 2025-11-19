// src/pages/profile/models/profileModels.js

// ============================================
// CONSTANTS
// ============================================

export const RELATIONSHIP_OPTIONS = [
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Parent', label: 'Parent' },
  { value: 'Sibling', label: 'Sibling' },
  { value: 'Child', label: 'Child' },
  { value: 'Friend', label: 'Friend' },
  { value: 'Other', label: 'Other' }
];

export const ACCOUNT_TYPE_OPTIONS = [
  { value: 'Checking', label: 'Checking' },
  { value: 'Savings', label: 'Savings' }
];

export const EMPLOYMENT_STATUS_COLORS = {
  Active: { bg: '#E8F5E9', text: '#2E7D32' },      // Green
  OnLeave: { bg: '#FFF3E0', text: '#E65100' },     // Orange
  Terminated: { bg: '#FFEBEE', text: '#C62828' }   // Red
};

export const EMPLOYEE_TYPE_COLORS = {
  'Full-Time': { bg: '#E3F2FD', text: '#1565C0' },
  'Part-Time': { bg: '#F3E5F5', text: '#6A1B9A' },
  'Contract': { bg: '#FFF9C4', text: '#F57F17' },
  'Intern': { bg: '#E0F2F1', text: '#00695C' }
};

// ============================================
// INITIAL STATES
// ============================================

export const initialContactInfo = {
  personalEmail: '',
  phoneNumber: '',
  address: '',
  city: '',
  state: '',
  zipCode: ''
};

export const initialEmergencyContact = {
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: ''
};

export const initialBankingInfo = {
  bankName: '',
  accountType: '',
  routingNumber: '',
  accountNumber: '',
  confirmAccountNumber: ''
};

export const initialPasswordChange = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
};

// ============================================
// FORMATTING HELPERS
// ============================================

/**
 * Format phone number to (XXX) XXX-XXXX
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

/**
 * Mask account number showing only last 4 digits
 */
export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return '';
  
  const cleaned = accountNumber.replace(/\D/g, '');
  if (cleaned.length < 4) return accountNumber;
  
  const lastFour = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 4);
  
  return `${masked}${lastFour}`;
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Format full name
 */
export const formatFullName = (firstName, middleName, lastName) => {
  const parts = [firstName, middleName, lastName].filter(Boolean);
  return parts.join(' ');
};

/**
 * Get initials from name
 */
export const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return '??';
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
};

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (10 digits)
 */
export const isValidPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
};

/**
 * Validate zip code (5 or 9 digits)
 */
export const isValidZipCode = (zipCode) => {
  const cleaned = zipCode.replace(/\D/g, '');
  return cleaned.length === 5 || cleaned.length === 9;
};

/**
 * Validate routing number (9 digits)
 */
export const isValidRoutingNumber = (routingNumber) => {
  const cleaned = routingNumber.replace(/\D/g, '');
  return cleaned.length === 9;
};

/**
 * Validate password strength
 */
export const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return minLength && hasUpper && hasLower && hasNumber;
};

/**
 * Get password strength message
 */
export const getPasswordStrengthMessage = (password) => {
  if (!password) return '';
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  return '';
};

// ============================================
// FORM VALIDATORS
// ============================================

/**
 * Validate contact information form
 */
export const validateContactForm = (formData) => {
  const errors = {};
  
  // Email validation
  if (!formData.personalEmail?.trim()) {
    errors.personalEmail = 'Email is required';
  } else if (!isValidEmail(formData.personalEmail)) {
    errors.personalEmail = 'Invalid email format';
  }
  
  // Phone validation
  if (!formData.phoneNumber?.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!isValidPhone(formData.phoneNumber)) {
    errors.phoneNumber = 'Invalid phone number (must be 10 digits)';
  }
  
  // Address validation
  if (formData.address && formData.address.length > 200) {
    errors.address = 'Address must not exceed 200 characters';
  }
  
  // City validation
  if (formData.city && formData.city.length > 100) {
    errors.city = 'City must not exceed 100 characters';
  }
  
  // State validation
  if (formData.state && formData.state.length > 50) {
    errors.state = 'State must not exceed 50 characters';
  }
  
  // Zip code validation
  if (formData.zipCode && !isValidZipCode(formData.zipCode)) {
    errors.zipCode = 'Invalid zip code (must be 5 or 9 digits)';
  }
  
  return errors;
};

/**
 * Validate emergency contact form
 */
export const validateEmergencyContactForm = (formData) => {
  const errors = {};
  
  // Name validation
  if (!formData.emergencyContactName?.trim()) {
    errors.emergencyContactName = 'Emergency contact name is required';
  } else if (formData.emergencyContactName.length > 100) {
    errors.emergencyContactName = 'Name must not exceed 100 characters';
  }
  
  // Phone validation
  if (!formData.emergencyContactPhone?.trim()) {
    errors.emergencyContactPhone = 'Emergency contact phone is required';
  } else if (!isValidPhone(formData.emergencyContactPhone)) {
    errors.emergencyContactPhone = 'Invalid phone number (must be 10 digits)';
  }
  
  // Relationship validation
  if (!formData.emergencyContactRelationship?.trim()) {
    errors.emergencyContactRelationship = 'Relationship is required';
  }
  
  return errors;
};

/**
 * Validate banking information form
 */
export const validateBankingForm = (formData) => {
  const errors = {};
  
  // Bank name validation
  if (!formData.bankName?.trim()) {
    errors.bankName = 'Bank name is required';
  } else if (formData.bankName.length > 100) {
    errors.bankName = 'Bank name must not exceed 100 characters';
  }
  
  // Account type validation
  if (!formData.accountType) {
    errors.accountType = 'Account type is required';
  }
  
  // Routing number validation
  if (!formData.routingNumber?.trim()) {
    errors.routingNumber = 'Routing number is required';
  } else if (!isValidRoutingNumber(formData.routingNumber)) {
    errors.routingNumber = 'Invalid routing number (must be 9 digits)';
  }
  
  // Account number validation
  if (!formData.accountNumber?.trim()) {
    errors.accountNumber = 'Account number is required';
  } else if (formData.accountNumber.length < 4 || formData.accountNumber.length > 17) {
    errors.accountNumber = 'Account number must be between 4 and 17 digits';
  }
  
  // Confirm account number validation
  if (!formData.confirmAccountNumber?.trim()) {
    errors.confirmAccountNumber = 'Please confirm account number';
  } else if (formData.accountNumber !== formData.confirmAccountNumber) {
    errors.confirmAccountNumber = 'Account numbers do not match';
  }
  
  return errors;
};

/**
 * Validate password change form
 */
export const validatePasswordChangeForm = (formData) => {
  const errors = {};
  
  // Current password validation
  if (!formData.currentPassword?.trim()) {
    errors.currentPassword = 'Current password is required';
  }
  
  // New password validation
  if (!formData.newPassword?.trim()) {
    errors.newPassword = 'New password is required';
  } else {
    const strengthMessage = getPasswordStrengthMessage(formData.newPassword);
    if (strengthMessage) {
      errors.newPassword = strengthMessage;
    }
  }
  
  // Check if new password is different from current
  if (formData.currentPassword && formData.newPassword && 
      formData.currentPassword === formData.newPassword) {
    errors.newPassword = 'New password must be different from current password';
  }
  
  // Confirm password validation
  if (!formData.confirmPassword?.trim()) {
    errors.confirmPassword = 'Please confirm new password';
  } else if (formData.newPassword !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
};

// ============================================
// DATA MAPPERS
// ============================================

/**
 * Map API response to contact form data
 */
export const mapToContactForm = (profile) => {
  return {
    personalEmail: profile.personalEmail || '',
    phoneNumber: profile.phoneNumber || '',
    address: profile.address || '',
    city: profile.city || '',
    state: profile.state || '',
    zipCode: profile.zipCode || ''
  };
};

/**
 * Map API response to emergency contact form data
 */
export const mapToEmergencyContactForm = (profile) => {
  return {
    emergencyContactName: profile.emergencyContactName || '',
    emergencyContactPhone: profile.emergencyContactPhone || '',
    emergencyContactRelationship: profile.emergencyContactRelationship || ''
  };
};

/**
 * Map API response to banking form data (for display)
 */
export const mapToBankingDisplay = (banking) => {
  if (!banking) return null;
  
  return {
    bankName: banking.bankName || '',
    accountType: banking.accountType || '',
    routingNumber: banking.routingNumber || '',
    accountNumber: banking.accountNumber || '', // Will be masked by API
    isVerified: banking.isVerified || false
  };
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get employment status chip props
 */
export const getEmploymentStatusChipProps = (status) => {
  const colors = EMPLOYMENT_STATUS_COLORS[status] || { bg: '#E0E0E0', text: '#424242' };
  return {
    label: status,
    sx: {
      backgroundColor: colors.bg,
      color: colors.text,
      fontWeight: 600
    }
  };
};

/**
 * Get employee type chip props
 */
export const getEmployeeTypeChipProps = (type) => {
  const colors = EMPLOYEE_TYPE_COLORS[type] || { bg: '#E0E0E0', text: '#424242' };
  return {
    label: type,
    sx: {
      backgroundColor: colors.bg,
      color: colors.text,
      fontWeight: 600
    }
  };
};

/**
 * Check if profile is complete
 */
export const isProfileComplete = (profile) => {
  const requiredFields = [
    'firstName',
    'lastName',
    'personalEmail',
    'phoneNumber',
    'emergencyContactName',
    'emergencyContactPhone'
  ];
  
  return requiredFields.every(field => profile[field]?.trim());
};

/**
 * Get profile completion percentage
 */
export const getProfileCompletionPercentage = (profile) => {
  const allFields = [
    'firstName',
    'lastName',
    'personalEmail',
    'phoneNumber',
    'address',
    'city',
    'state',
    'zipCode',
    'emergencyContactName',
    'emergencyContactPhone',
    'emergencyContactRelationship'
  ];
  
  const completedFields = allFields.filter(field => profile[field]?.trim()).length;
  return Math.round((completedFields / allFields.length) * 100);
};

export default {
  // Constants
  RELATIONSHIP_OPTIONS,
  ACCOUNT_TYPE_OPTIONS,
  EMPLOYMENT_STATUS_COLORS,
  EMPLOYEE_TYPE_COLORS,
  
  // Initial States
  initialContactInfo,
  initialEmergencyContact,
  initialBankingInfo,
  initialPasswordChange,
  
  // Formatters
  formatPhoneNumber,
  maskAccountNumber,
  formatDate,
  formatCurrency,
  formatFullName,
  getInitials,
  
  // Validators
  isValidEmail,
  isValidPhone,
  isValidZipCode,
  isValidRoutingNumber,
  isStrongPassword,
  getPasswordStrengthMessage,
  validateContactForm,
  validateEmergencyContactForm,
  validateBankingForm,
  validatePasswordChangeForm,
  
  // Mappers
  mapToContactForm,
  mapToEmergencyContactForm,
  mapToBankingDisplay,
  
  // Helpers
  getEmploymentStatusChipProps,
  getEmployeeTypeChipProps,
  isProfileComplete,
  getProfileCompletionPercentage
};