// src/pages/hr-actions/models/hrActionModels.js
// HR Actions Models - Validation, Helpers, Constants

// ============================================
// CONSTANTS
// ============================================

export const ACTION_TYPES = {
  RATE_CHANGE: 1,
  TRANSFER: 2,
  PROMOTION: 3,
  STATUS_CHANGE: 4,
  PERSONAL_INFO: 5,
  INSURANCE: 6,
  PAYROLL_DEDUCTION: 7,
  LEAVE_OF_ABSENCE: 8
};

export const REQUEST_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

export const CLASSIFICATION_OPTIONS = [
  { value: 'FT', label: 'Full-Time' },
  { value: 'PT', label: 'Part-Time' },
  { value: 'PRN', label: 'PRN (As Needed)' }
];

export const RATE_TYPE_OPTIONS = [
  { value: 'Salary', label: 'Salary' },
  { value: 'Hourly', label: 'Hourly' }
];

export const MARITAL_STATUS_OPTIONS = [
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' }
];

export const INSURANCE_OPTIONS = [
  { value: 'S', label: 'Single' },
  { value: 'E+S', label: 'Employee + Spouse' },
  { value: 'E+C', label: 'Employee + Children' },
  { value: 'F', label: 'Family' },
  { value: 'Disenroll', label: 'Disenroll' }
];

export const LEAVE_TYPES = [
  'Vacation',
  'FMLA',
  'Medical Leave',
  'Funeral',
  'Military',
  'Jury Duty',
  'Personal',
  'Other'
];

// ============================================
// COLOR HELPERS
// ============================================

export const getActionTypeColor = (actionTypeName) => {
  const colors = {
    'Rate Change': '#667eea',
    'Transfer': '#6AB4A8',
    'Promotion': '#4caf50',
    'Status Change': '#5B8FCC',
    'Personal Info Change': '#FDB94E',
    'Insurance Change': '#764ba2',
    'Payroll Deduction': '#f59e42',
    'Leave of Absence': '#34495e'
  };
  return colors[actionTypeName] || '#667eea';
};

export const getStatusColor = (status) => {
  const colors = {
    'Pending': 'warning',
    'Approved': 'success',
    'Rejected': 'error'
  };
  return colors[status] || 'default';
};

export const getActionTypeIcon = (actionTypeName) => {
  const icons = {
    'Rate Change': '💰',
    'Transfer': '🔄',
    'Promotion': '📈',
    'Status Change': '📊',
    'Personal Info Change': '📝',
    'Insurance Change': '💼',
    'Payroll Deduction': '💵',
    'Leave of Absence': '🏖️'
  };
  return icons[actionTypeName] || '📋';
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================

export const validateRateChange = (data) => {
  const errors = {};
  
  if (!data.newRate || data.newRate <= 0) {
    errors.newRate = 'New rate is required and must be greater than 0';
  }
  
  if (!data.newRateType) {
    errors.newRateType = 'Rate type is required';
  }
  
  if (!data.effectiveDate) {
    errors.effectiveDate = 'Effective date is required';
  }
  
  if (!data.reason || data.reason.trim().length < 10) {
    errors.reason = 'Reason is required (minimum 10 characters)';
  }
  
  return errors;
};

export const validateTransfer = (data) => {
  const errors = {};
  
  if (!data.newDepartmentId) {
    errors.newDepartmentId = 'New department is required';
  }
  
  if (!data.effectiveDate) {
    errors.effectiveDate = 'Effective date is required';
  }
  
  if (!data.reason || data.reason.trim().length < 10) {
    errors.reason = 'Reason is required (minimum 10 characters)';
  }
  
  return errors;
};

export const validatePromotion = (data) => {
  const errors = {};
  
  if (!data.newJobTitle || data.newJobTitle.trim().length < 3) {
    errors.newJobTitle = 'New job title is required (minimum 3 characters)';
  }
  
  if (!data.newRate || data.newRate <= 0) {
    errors.newRate = 'New salary is required and must be greater than 0';
  }
  
  if (!data.effectiveDate) {
    errors.effectiveDate = 'Effective date is required';
  }
  
  if (!data.reason || data.reason.trim().length < 10) {
    errors.reason = 'Reason is required (minimum 10 characters)';
  }
  
  return errors;
};

export const validateStatusChange = (data) => {
  const errors = {};
  
  if (!data.newEmploymentType && !data.newMaritalStatus) {
    errors.general = 'At least one change is required';
  }
  
  if (!data.effectiveDate) {
    errors.effectiveDate = 'Effective date is required';
  }
  
  if (!data.reason || data.reason.trim().length < 10) {
    errors.reason = 'Reason is required (minimum 10 characters)';
  }
  
  return errors;
};

export const validatePersonalInfo = (data) => {
  const errors = {};
  
  let hasChange = false;
  
  if (data.newFirstName || data.newLastName || data.newAddress || 
      data.newPhone || data.newEmail) {
    hasChange = true;
  }
  
  if (!hasChange) {
    errors.general = 'At least one field change is required';
  }
  
  if (data.newEmail && !isValidEmail(data.newEmail)) {
    errors.newEmail = 'Please enter a valid email address';
  }
  
  if (!data.reason || data.reason.trim().length < 10) {
    errors.reason = 'Reason is required (minimum 10 characters)';
  }
  
  return errors;
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const formatRequestNumber = (number) => {
  return number || 'N/A';
};

export const formatCurrency = (amount) => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

// ============================================
// FILTER FUNCTIONS
// ============================================

export const filterRequests = (requests, filters) => {
  let filtered = [...requests];
  
  // Filter by search term
  if (filters.searchTerm) {
    const search = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(req =>
      req.requestNumber?.toLowerCase().includes(search) ||
      req.employee?.fullName?.toLowerCase().includes(search) ||
      req.actionType?.toLowerCase().includes(search)
    );
  }
  
  // Filter by action type
  if (filters.actionTypeFilter) {
    filtered = filtered.filter(req => 
      req.actionType === filters.actionTypeFilter
    );
  }
  
  // Filter by status
  if (filters.statusFilter) {
    filtered = filtered.filter(req => 
      req.status === filters.statusFilter
    );
  }
  
  return filtered;
};

export const getInitialFilterState = () => ({
  searchTerm: '',
  actionTypeFilter: '',
  statusFilter: ''
});

// ============================================
// SUMMARY FUNCTIONS
// ============================================

export const getRequestSummary = (request) => {
  const { actionType, oldRate, newRate, oldJobTitle, newJobTitle, newLocation } = request;
  
  if (actionType === 'Rate Change' && oldRate && newRate) {
    return `${formatCurrency(oldRate)} → ${formatCurrency(newRate)}`;
  }
  
  if (actionType === 'Promotion' && oldJobTitle && newJobTitle) {
    return `${oldJobTitle} → ${newJobTitle}`;
  }
  
  if (actionType === 'Transfer' && newLocation) {
    return `Transfer to ${newLocation}`;
  }
  
  return request.reason?.substring(0, 50) + '...' || 'No details';
};

export default {
  ACTION_TYPES,
  REQUEST_STATUS,
  CLASSIFICATION_OPTIONS,
  RATE_TYPE_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  INSURANCE_OPTIONS,
  LEAVE_TYPES,
  getActionTypeColor,
  getStatusColor,
  getActionTypeIcon,
  validateRateChange,
  validateTransfer,
  validatePromotion,
  validateStatusChange,
  validatePersonalInfo,
  isValidEmail,
  formatRequestNumber,
  formatCurrency,
  formatDate,
  getTimeAgo,
  filterRequests,
  getInitialFilterState,
  getRequestSummary
};