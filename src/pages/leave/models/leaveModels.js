// src/pages/leave/models/leaveModels.js
// Leave Management - Models, Constants, Helpers & Validators

// ============================================
// CONSTANTS - Leave Status
// ============================================

export const LEAVE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled'
};

export const LEAVE_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Cancelled', label: 'Cancelled' }
];

// ============================================
// CONSTANTS - Status Colors
// ============================================

export const STATUS_COLORS = {
  Pending: {
    main: '#ff9800',
    light: '#fff3e0',
    text: '#e65100'
  },
  Approved: {
    main: '#4caf50',
    light: '#e8f5e9',
    text: '#2e7d32'
  },
  Rejected: {
    main: '#f44336',
    light: '#ffebee',
    text: '#c62828'
  },
  Cancelled: {
    main: '#9e9e9e',
    light: '#f5f5f5',
    text: '#616161'
  }
};

// ============================================
// CONSTANTS - Leave Type Colors (From Database)
// ============================================

export const LEAVE_TYPE_COLORS = {
  'PTO': '#5B8FCC',
  'Unpaid Leave': '#95a5a6',
  'Bereavement': '#34495e',
  'Jury Duty': '#3498db',
  'Medical Leave': '#e74c3c'
};

// ============================================
// HELPER FUNCTIONS - Status
// ============================================

/**
 * Get status badge color variant for Material-UI
 * @param {string} status - Leave status
 * @returns {string} MUI color variant
 */
export const getStatusVariant = (status) => {
  const variants = {
    'Pending': 'warning',
    'Approved': 'success',
    'Rejected': 'error',
    'Cancelled': 'default'
  };
  return variants[status] || 'default';
};

/**
 * Get status icon emoji
 * @param {string} status - Leave status
 * @returns {string} Emoji icon
 */
export const getStatusIcon = (status) => {
  const icons = {
    'Pending': '⏳',
    'Approved': '✅',
    'Rejected': '❌',
    'Cancelled': '⚪'
  };
  return icons[status] || '📄';
};

/**
 * Check if status allows cancellation
 * @param {string} status - Leave status
 * @returns {boolean} True if can cancel
 */
export const canCancelRequest = (status) => {
  return status === 'Pending';
};

/**
 * Check if status is final (no further actions possible)
 * @param {string} status - Leave status
 * @returns {boolean} True if final
 */
export const isFinalStatus = (status) => {
  return ['Approved', 'Rejected', 'Cancelled'].includes(status);
};

// ============================================
// HELPER FUNCTIONS - Leave Types
// ============================================

/**
 * Get leave type display color
 * @param {string} typeName - Leave type name
 * @returns {string} Hex color code
 */
export const getLeaveTypeColor = (typeName) => {
  return LEAVE_TYPE_COLORS[typeName] || '#5B8FCC';
};

/**
 * Check if leave type deducts from PTO
 * @param {string} typeName - Leave type name
 * @returns {boolean} True if deducts PTO
 */
export const deductsPTO = (typeName) => {
  return typeName === 'PTO';
};

/**
 * Get leave type icon
 * @param {string} typeName - Leave type name
 * @returns {string} Icon name or emoji
 */
export const getLeaveTypeIcon = (typeName) => {
  const icons = {
    'PTO': '🏖️',
    'Unpaid Leave': '📅',
    'Bereavement': '🕊️',
    'Jury Duty': '⚖️',
    'Medical Leave': '🏥'
  };
  return icons[typeName] || '📋';
};

// ============================================
// HELPER FUNCTIONS - Date Formatting
// ============================================

/**
 * Format date to display string
 * @param {string|Date} date - Date to format
 * @param {boolean} short - Use short format
 * @returns {string} Formatted date
 */
export const formatDate = (date, short = false) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  if (short) {
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
  
  return d.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

/**
 * Format date range
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Same day
  if (start.toDateString() === end.toDateString()) {
    return formatDate(start);
  }
  
  // Same month and year
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`;
  }
  
  // Different months
  return `${formatDate(start, true)} - ${formatDate(end, true)}`;
};

/**
 * Format relative time (e.g., "2 days ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date, true);
};

/**
 * Check if date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if past
 */
export const isPastDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
};

/**
 * Check if date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if today
 */
export const isToday = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

/**
 * Check if date is in the future
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if future
 */
export const isFutureDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return d > today;
};

// ============================================
// HELPER FUNCTIONS - Date Calculations
// ============================================

/**
 * Calculate total days between two dates (inclusive)
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {number} Total days
 */
export const calculateTotalDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 for inclusive
  
  return diffDays;
};

/**
 * Calculate business days between two dates (excludes weekends)
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {number} Business days
 */
export const calculateBusinessDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let count = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Add days to a date
 * @param {string|Date} date - Starting date
 * @param {number} days - Days to add
 * @returns {string} New date in YYYY-MM-DD format
 */
export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate leave request dates
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @param {boolean} allowPastDates - Allow past dates
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateDates = (startDate, endDate, allowPastDates = false) => {
  if (!startDate || !endDate) {
    return { isValid: false, error: 'Start date and end date are required' };
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (end < start) {
    return { isValid: false, error: 'End date cannot be before start date' };
  }
  
  if (!allowPastDates && isPastDate(startDate)) {
    return { isValid: false, error: 'Start date cannot be in the past' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate PTO balance
 * @param {number} remainingDays - Remaining PTO days
 * @param {number} requestedDays - Requested days
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validatePTOBalance = (remainingDays, requestedDays) => {
  if (requestedDays > remainingDays) {
    return { 
      isValid: false, 
      error: `Insufficient PTO balance. Available: ${remainingDays} days, Requested: ${requestedDays} days` 
    };
  }
  
  if (requestedDays > 20) {
    return { 
      isValid: false, 
      error: 'Cannot request more than 20 days in a single request' 
    };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate leave request form
 * @param {Object} formData - Form data
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateLeaveRequestForm = (formData) => {
  const errors = {};
  
  // Required fields
  if (!formData.leaveTypeId) {
    errors.leaveTypeId = 'Please select a leave type';
  }
  
  if (!formData.startDate) {
    errors.startDate = 'Start date is required';
  }
  
  if (!formData.endDate) {
    errors.endDate = 'End date is required';
  }
  
  // Date validation
  if (formData.startDate && formData.endDate) {
    const dateValidation = validateDates(formData.startDate, formData.endDate, false);
    if (!dateValidation.isValid) {
      errors.dates = dateValidation.error;
    }
  }
  
  // Reason length (optional but if provided, should be meaningful)
  if (formData.reason && formData.reason.length > 500) {
    errors.reason = 'Reason cannot exceed 500 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ============================================
// DATA TRANSFORMATION FUNCTIONS
// ============================================

/**
 * Prepare leave request data for API submission
 * @param {Object} formData - Form data
 * @returns {Object} API-ready data
 */
export const prepareLeaveRequestForAPI = (formData) => {
  return {
    leaveTypeId: parseInt(formData.leaveTypeId),
    startDate: formData.startDate,
    endDate: formData.endDate,
    reason: formData.reason || '',
    isHalfDay: formData.isHalfDay || false
  };
};

/**
 * Get initial leave request form data
 * @returns {Object} Initial form data
 */
export const getInitialLeaveRequestForm = () => ({
  leaveTypeId: '',
  startDate: '',
  endDate: '',
  reason: '',
  isHalfDay: false
});

// ============================================
// FILTER & SORT HELPERS
// ============================================

/**
 * Filter leave requests by status
 * @param {Array} requests - Leave requests
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered requests
 */
export const filterByStatus = (requests, status) => {
  if (!status || status === '') return requests;
  return requests.filter(req => req.status === status);
};

/**
 * Sort leave requests
 * @param {Array} requests - Leave requests
 * @param {string} sortBy - Field to sort by (date, status, type)
 * @param {string} order - Sort order (asc, desc)
 * @returns {Array} Sorted requests
 */
export const sortLeaveRequests = (requests, sortBy = 'date', order = 'desc') => {
  const sorted = [...requests];
  
  sorted.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.startDate) - new Date(b.startDate);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'type':
        comparison = a.leaveType.localeCompare(b.leaveType);
        break;
      case 'requested':
        comparison = new Date(a.requestedAt) - new Date(b.requestedAt);
        break;
      default:
        comparison = 0;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
};

/**
 * Group leave requests by month
 * @param {Array} requests - Leave requests
 * @returns {Object} Requests grouped by month
 */
export const groupByMonth = (requests) => {
  const grouped = {};
  
  requests.forEach(request => {
    const date = new Date(request.startDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!grouped[monthKey]) {
      grouped[monthKey] = {
        label: monthLabel,
        requests: []
      };
    }
    
    grouped[monthKey].requests.push(request);
  });
  
  return grouped;
};

// ============================================
// STATISTICS HELPERS
// ============================================

/**
 * Calculate leave statistics
 * @param {Array} requests - Leave requests
 * @returns {Object} Statistics
 */
export const calculateLeaveStats = (requests) => {
  const stats = {
    total: requests.length,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    totalDays: 0
  };
  
  requests.forEach(request => {
    switch (request.status) {
      case 'Pending':
        stats.pending++;
        break;
      case 'Approved':
        stats.approved++;
        stats.totalDays += request.totalDays;
        break;
      case 'Rejected':
        stats.rejected++;
        break;
      case 'Cancelled':
        stats.cancelled++;
        break;
    }
  });
  
  return stats;
};

/**
 * Get upcoming leaves (approved, future dates)
 * @param {Array} requests - Leave requests
 * @returns {Array} Upcoming leaves
 */
export const getUpcomingLeaves = (requests) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return requests.filter(request => 
    request.status === 'Approved' && 
    new Date(request.startDate) >= today
  ).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
};

/**
 * Get leaves in date range
 * @param {Array} requests - Leave requests
 * @param {string|Date} startDate - Range start
 * @param {string|Date} endDate - Range end
 * @returns {Array} Leaves in range
 */
export const getLeavesInRange = (requests, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return requests.filter(request => {
    const reqStart = new Date(request.startDate);
    const reqEnd = new Date(request.endDate);
    
    // Check if request overlaps with range
    return reqStart <= end && reqEnd >= start;
  });
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  // Constants
  LEAVE_STATUS,
  LEAVE_STATUS_OPTIONS,
  STATUS_COLORS,
  LEAVE_TYPE_COLORS,
  
  // Status Helpers
  getStatusVariant,
  getStatusIcon,
  canCancelRequest,
  isFinalStatus,
  
  // Leave Type Helpers
  getLeaveTypeColor,
  deductsPTO,
  getLeaveTypeIcon,
  
  // Date Formatting
  formatDate,
  formatDateRange,
  formatRelativeTime,
  isPastDate,
  isToday,
  isFutureDate,
  
  // Date Calculations
  calculateTotalDays,
  calculateBusinessDays,
  getTodayString,
  addDays,
  
  // Validation
  validateDates,
  validatePTOBalance,
  validateLeaveRequestForm,
  
  // Data Transformation
  prepareLeaveRequestForAPI,
  getInitialLeaveRequestForm,
  
  // Filters & Sort
  filterByStatus,
  sortLeaveRequests,
  groupByMonth,
  
  // Statistics
  calculateLeaveStats,
  getUpcomingLeaves,
  getLeavesInRange
};