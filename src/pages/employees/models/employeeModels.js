// ============================================
// Employee Models & Types (JavaScript Version)
// File: src/pages/employees/models/employeeModels.js
// COMPLETE VERSION with EmploymentType Support
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

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'Full-Time', label: 'Full-Time' },
  { value: 'Part-Time', label: 'Part-Time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Temporary', label: 'Temporary' }
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
// Helper Functions - Initialization
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
  employmentType: 'Full-Time',
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

// ============================================
// Helper Functions - Mapping
// ============================================

/**
 * Map employee data from API to form format
 * Handles date formatting and null values
 * @param {Object} employee - Employee object from API
 * @returns {Object} Mapped form data
 */
export const mapEmployeeToFormData = (employee) => {
  const initialData = getInitialEmployeeFormData();
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  return {
    // Personal Information
    firstName: employee.firstName || initialData.firstName,
    lastName: employee.lastName || initialData.lastName,
    middleName: employee.middleName || initialData.middleName,
    dateOfBirth: formatDate(employee.dateOfBirth),
    gender: employee.gender || initialData.gender,
    maritalStatus: employee.maritalStatus || initialData.maritalStatus,
    phoneNumber: employee.phoneNumber || initialData.phoneNumber,
    personalEmail: employee.personalEmail || initialData.personalEmail,
    
    // Address
    address: employee.address || initialData.address,
    city: employee.city || initialData.city,
    state: employee.state || initialData.state,
    zipCode: employee.zipCode || initialData.zipCode,
    country: employee.country || initialData.country,
    
    // Emergency Contact
    emergencyContactName: employee.emergencyContactName || initialData.emergencyContactName,
    emergencyContactPhone: employee.emergencyContactPhone || initialData.emergencyContactPhone,
    emergencyContactRelationship: employee.emergencyContactRelationship || initialData.emergencyContactRelationship,
    
    // Employment
    employeeCode: employee.employeeCode || initialData.employeeCode,
    departmentId: employee.department?.departmentId || employee.departmentId || initialData.departmentId,
    managerId: employee.manager?.employeeId || employee.managerId || initialData.managerId,
    jobTitle: employee.jobTitle || initialData.jobTitle,
    employeeType: employee.employeeType || initialData.employeeType,
    employmentType: employee.employmentType || initialData.employmentType,
    employmentStatus: employee.employmentStatus || initialData.employmentStatus,
    hireDate: formatDate(employee.hireDate),
    
    // Compensation
    salary: employee.salary || initialData.salary,
    payFrequency: employee.payFrequency || initialData.payFrequency,
    
    // Banking
    bankName: employee.bankName || initialData.bankName,
    bankAccountNumber: employee.bankAccountNumber || initialData.bankAccountNumber,
    bankRoutingNumber: employee.bankRoutingNumber || initialData.bankRoutingNumber,
    
    // Benefits
    isEligibleForPTO: employee.isEligibleForPTO !== undefined ? employee.isEligibleForPTO : initialData.isEligibleForPTO,
    ptoBalance: employee.ptoBalance || initialData.ptoBalance,
    isEligibleForInsurance: employee.isEligibleForInsurance !== undefined ? employee.isEligibleForInsurance : initialData.isEligibleForInsurance
  };
};

// ============================================
// Helper Functions - API Preparation
// ============================================

/**
 * Prepare employee data for API submission
 * Converts form data to API request format
 * Matches backend RegisterRequest model exactly
 * @param {Object} formData - Form data from component
 * @returns {Object} API request payload
 */
export const prepareEmployeeDataForAPI = (formData) => ({
  // Account (required by backend RegisterRequest)
  email: formData.email,
  password: formData.password,
  roleId: formData.roleId ? parseInt(formData.roleId) : null,
  
  // Basic Info (required by backend)
  firstName: formData.firstName,
  lastName: formData.lastName,
  employeeCode: formData.employeeCode,
  
  // Employment (required by backend)
  departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
  employeeType: formData.employeeType,
  employmentType: formData.employmentType || 'Full-Time',
  jobTitle: formData.jobTitle,
  hireDate: formData.hireDate ? new Date(formData.hireDate).toISOString() : null
});

// ============================================
// Helper Functions - Validation
// ============================================

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
// Helper Functions - Formatting
// ============================================

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