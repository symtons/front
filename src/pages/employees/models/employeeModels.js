// ============================================
// Employee Models & Types (JavaScript Version)
// File: src/models/employeeModels.js
// ============================================

// ============================================
// Dropdown Options (Constants)
// ============================================

export const GENDER_OPTIONS = [
  { value: '', label: 'Select Gender' },
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'PreferNotToSay', label: 'Prefer Not to Say' }
];

export const MARITAL_STATUS_OPTIONS = [
  { value: '', label: 'Select Status' },
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' }
];

export const EMPLOYEE_TYPE_OPTIONS = [
  { value: 'AdminStaff', label: 'Admin Staff' },
  { value: 'FieldStaff', label: 'Field Staff' }
];

export const EMPLOYMENT_STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'OnLeave', label: 'On Leave' },
  { value: 'Terminated', label: 'Terminated' }
];

export const PAY_FREQUENCY_OPTIONS = [
  { value: 'Hourly', label: 'Hourly' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'BiWeekly', label: 'Bi-Weekly' },
  { value: 'Monthly', label: 'Monthly' }
];

export const BOOLEAN_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' }
];

// ============================================
// Helper Functions
// ============================================

/**
 * Get initial employee form data with default values
 * Used for creating new employees
 * @returns {Object} Initial form data object
 */
export const getInitialEmployeeFormData = () => ({
  // Personal Information
  firstName: '',
  lastName: '',
  middleName: '',
  dateOfBirth: '',
  gender: '',
  maritalStatus: '',
  phoneNumber: '',
  personalEmail: '',
  
  // Address
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'USA',
  
  // Emergency Contact
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  
  // Employment Information
  employeeCode: '',
  departmentId: '',
  managerId: '',
  jobTitle: '',
  employeeType: 'AdminStaff',
  employmentStatus: 'Active',
  hireDate: new Date().toISOString().split('T')[0],
  
  // Compensation
  salary: '',
  payFrequency: 'Monthly',
  
  // Banking
  bankName: '',
  bankAccountNumber: '',
  bankRoutingNumber: '',
  
  // Benefits
  isEligibleForPTO: true,
  ptoBalance: 0,
  isEligibleForInsurance: true
});

/**
 * Get initial employee registration data with default values
 * Includes account setup fields
 * @returns {Object} Initial registration data object
 */
export const getInitialEmployeeRegistrationData = () => ({
  ...getInitialEmployeeFormData(),
  // Account Setup
  email: '',
  password: '',
  confirmPassword: '',
  roleId: 2 // Default to Executive, change as needed
});

/**
 * Get initial employee filter params
 * Used for filtering employee directory
 * @returns {Object} Initial filter params
 */
export const getInitialEmployeeFilterParams = () => ({
  pageNumber: 1,
  pageSize: 10,
  search: '',
  departmentId: '',
  employeeType: '',
  employmentStatus: '',
  sortBy: 'firstName',
  sortOrder: 'asc'
});

/**
 * Prepare employee data for API submission
 * Converts form data to API request format
 * @param {Object} formData - Form data from component
 * @returns {Object} API request payload
 */
export const prepareEmployeeDataForAPI = (formData) => ({
  // Account
  email: formData.email,
  password: formData.password,
  roleId: formData.roleId ? parseInt(formData.roleId) : null,
  
  // Basic Info
  firstName: formData.firstName,
  lastName: formData.lastName,
  middleName: formData.middleName || null,
  
  // Personal Details
  dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
  gender: formData.gender || null,
  maritalStatus: formData.maritalStatus || null,
  phoneNumber: formData.phoneNumber || null,
  personalEmail: formData.personalEmail || null,
  
  // Address
  address: formData.address || null,
  city: formData.city || null,
  state: formData.state || null,
  zipCode: formData.zipCode || null,
  country: formData.country || null,
  
  // Emergency Contact
  emergencyContactName: formData.emergencyContactName || null,
  emergencyContactPhone: formData.emergencyContactPhone || null,
  emergencyContactRelationship: formData.emergencyContactRelationship || null,
  
  // Employment
  employeeCode: formData.employeeCode,
  departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
  managerId: formData.managerId ? parseInt(formData.managerId) : null,
  jobTitle: formData.jobTitle || null,
  employeeType: formData.employeeType,
  employmentStatus: formData.employmentStatus,
  hireDate: formData.hireDate ? new Date(formData.hireDate).toISOString() : null,
  
  // Compensation
  salary: formData.salary ? parseFloat(formData.salary) : null,
  payFrequency: formData.payFrequency || null,
  
  // Banking
  bankName: formData.bankName || null,
  bankAccountNumber: formData.bankAccountNumber || null,
  bankRoutingNumber: formData.bankRoutingNumber || null,
  
  // Benefits
  isEligibleForPTO: formData.isEligibleForPTO,
  ptoBalance: formData.ptoBalance ? parseFloat(formData.ptoBalance) : 0,
  isEligibleForInsurance: formData.isEligibleForInsurance
});

/**
 * Validate employee form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateEmployeeFormData = (formData) => {
  const errors = [];

  // Required fields
  if (!formData.firstName) errors.push('First name is required');
  if (!formData.lastName) errors.push('Last name is required');
  if (!formData.email) errors.push('Email is required');
  if (!formData.password) errors.push('Password is required');
  if (!formData.employeeCode) errors.push('Employee code is required');
  if (!formData.departmentId) errors.push('Department is required');
  if (!formData.employeeType) errors.push('Employee type is required');
  if (!formData.roleId) errors.push('Role is required');

  // Password validation
  if (formData.password && formData.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  // Password confirmation
  if (formData.password !== formData.confirmPassword) {
    errors.push('Passwords do not match');
  }

  // Email format
  if (formData.email && !isValidEmail(formData.email)) {
    errors.push('Email format is invalid');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Check if email format is valid
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Format employee name
 * @param {Object} employee - Employee object
 * @returns {string} Formatted full name
 */
export const formatEmployeeName = (employee) => {
  const parts = [employee.firstName];
  if (employee.middleName) parts.push(employee.middleName);
  parts.push(employee.lastName);
  return parts.join(' ');
};

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
 * Get employment status label
 * @param {string} status - Employment status value
 * @returns {string} Display label
 */
export const getEmploymentStatusLabel = (status) => {
  const option = EMPLOYMENT_STATUS_OPTIONS.find(opt => opt.value === status);
  return option ? option.label : status;
};

/**
 * Check if employee is eligible for benefits
 * @param {string} employeeType - Employee type
 * @returns {boolean} True if eligible
 */
export const isEligibleForBenefits = (employeeType) => {
  return employeeType === 'AdminStaff';
};

/**
 * Get default PTO balance based on employee type
 * @param {string} employeeType - Employee type
 * @returns {number} Default PTO balance
 */
export const getDefaultPTOBalance = (employeeType) => {
  return employeeType === 'AdminStaff' ? 15 : 0;
};

// ============================================
// Field Validation Helpers
// ============================================

/**
 * Validate employee code format
 * @param {string} code - Employee code
 * @returns {boolean} True if valid
 */
export const isValidEmployeeCode = (code) => {
  // Example: TPA-EMP-001
  const codeRegex = /^[A-Z]{3}-[A-Z]{3}-\d{3}$/;
  return codeRegex.test(code);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid
 */
export const isValidPhoneNumber = (phone) => {
  // US phone format: 615-555-0100
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate ZIP code format
 * @param {string} zip - ZIP code
 * @returns {boolean} True if valid
 */
export const isValidZipCode = (zip) => {
  // 5 digits or 5+4 format
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
};

// ============================================
// JSDoc Type Definitions (for IDE support)
// ============================================

/**
 * @typedef {Object} EmployeeFormData
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} middleName
 * @property {string} dateOfBirth
 * @property {string} gender
 * @property {string} maritalStatus
 * @property {string} phoneNumber
 * @property {string} personalEmail
 * @property {string} address
 * @property {string} city
 * @property {string} state
 * @property {string} zipCode
 * @property {string} country
 * @property {string} emergencyContactName
 * @property {string} emergencyContactPhone
 * @property {string} emergencyContactRelationship
 * @property {string} employeeCode
 * @property {string|number} departmentId
 * @property {string|number} managerId
 * @property {string} jobTitle
 * @property {('AdminStaff'|'FieldStaff')} employeeType
 * @property {('Active'|'OnLeave'|'Terminated')} employmentStatus
 * @property {string} hireDate
 * @property {string|number} salary
 * @property {string} payFrequency
 * @property {string} bankName
 * @property {string} bankAccountNumber
 * @property {string} bankRoutingNumber
 * @property {boolean} isEligibleForPTO
 * @property {string|number} ptoBalance
 * @property {boolean} isEligibleForInsurance
 */

/**
 * @typedef {Object} EmployeeRegistrationData
 * @extends EmployeeFormData
 * @property {string} email
 * @property {string} password
 * @property {string} confirmPassword
 * @property {string|number} roleId
 */

/**
 * @typedef {Object} EmployeeDirectoryItem
 * @property {number} employeeId
 * @property {string} employeeCode
 * @property {string} fullName
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} phoneNumber
 * @property {string} jobTitle
 * @property {('AdminStaff'|'FieldStaff')} employeeType
 * @property {('Active'|'OnLeave'|'Terminated')} employmentStatus
 * @property {Object} department
 * @property {Object} manager
 * @property {string} hireDate
 * @property {boolean} isEligibleForPTO
 * @property {number} ptoBalance
 * @property {boolean} isEligibleForInsurance
 */