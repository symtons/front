// src/pages/leave/models/leaveModels.js
/**
 * Leave Management Models
 * 
 * Contains all data structures, validation logic, helper functions,
 * and business rules for the leave management system
 */

// ============================================
// CONSTANTS - LEAVE STATUS
// ============================================

/**
 * Leave request status values
 */
export const LEAVE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled'
};

/**
 * Status options for dropdowns
 */
export const LEAVE_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Cancelled', label: 'Cancelled' }
];

/**
 * Get status color for UI display
 */
export const getStatusColor = (status) => {
  const colors = {
    'Pending': '#FDB94E',      // Orange/Yellow
    'Approved': '#4caf50',     // Green
    'Rejected': '#f44336',     // Red
    'Cancelled': '#9e9e9e'     // Gray
  };
  return colors[status] || '#9e9e9e';
};

/**
 * Get status icon
 */
export const getStatusIcon = (status) => {
  const icons = {
    'Pending': 'Schedule',
    'Approved': 'CheckCircle',
    'Rejected': 'Cancel',
    'Cancelled': 'Block'
  };
  return icons[status] || 'Help';
};

// ============================================
// CONSTANTS - LEAVE TYPES
// ============================================

/**
 * Leave type colors (matches database)
 */
export const LEAVE_TYPE_COLORS = {
  'PTO': '#5B8FCC',
  'Unpaid Leave': '#95a5a6',
  'Bereavement': '#34495e',
  'Jury Duty': '#3498db',
  'Medical Leave': '#e74c3c'
};

/**
 * Get leave type color
 */
export const getLeaveTypeColor = (typeName) => {
  return LEAVE_TYPE_COLORS[typeName] || '#667eea';
};

/**
 * Get leave type icon
 */
export const getLeaveTypeIcon = (typeName) => {
  const icons = {
    'PTO': 'BeachAccess',
    'Unpaid Leave': 'EventBusy',
    'Bereavement': 'LocalFlorist',
    'Jury Duty': 'Gavel',
    'Medical Leave': 'LocalHospital',
    'Sick Leave': 'Sick'
  };
  return icons[typeName] || 'Event';
};

/**
 * Check if leave type deducts from PTO balance
 */
export const deductsPTO = (typeName) => {
  return typeName === 'PTO';
};

// ============================================
// INITIAL FORM DATA
// ============================================

/**
 * Get initial leave request form data
 */
export const getInitialLeaveRequestData = () => ({
  leaveTypeId: null,
  startDate: getTodayString(),
  endDate: getTodayString(),
  reason: '',
  isHalfDay: false
});

/**
 * Get initial filter state
 */
export const getInitialFilterState = () => ({
  searchTerm: '',
  statusFilter: '',
  leaveTypeFilter: '',
  startDate: '',
  endDate: ''
});

// ============================================
// DATE HELPER FUNCTIONS
// ============================================

/**
 * Get today's date as YYYY-MM-DD string
 */
export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get date N days from now
 */
export const getDateAfterDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

/**
 * Format date for display (e.g., "Dec 15, 2025")
 */
export const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format date range for display
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  
  const start = formatDisplayDate(startDate);
  const end = formatDisplayDate(endDate);
  
  if (startDate === endDate) {
    return start;
  }
  
  return `${start} - ${end}`;
};

/**
 * Calculate total days between dates (inclusive)
 */
export const calculateTotalDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // Inclusive of both start and end dates
};

/**
 * Check if date is in the past
 */
export const isPastDate = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date < today;
};

/**
 * Check if date is today
 */
export const isToday = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  return date.toDateString() === today.toDateString();
};

/**
 * Get day of week
 */
export const getDayOfWeek = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate leave request dates
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
 */
export const validateLeaveRequestForm = (formData, ptoBalance = null, leaveType = null) => {
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
  
  // PTO balance validation (if requesting PTO)
  if (leaveType && leaveType.typeName === 'PTO' && ptoBalance) {
    const totalDays = formData.isHalfDay ? 0.5 : calculateTotalDays(formData.startDate, formData.endDate);
    const balanceValidation = validatePTOBalance(ptoBalance.remainingPTODays || 0, totalDays);
    if (!balanceValidation.isValid) {
      errors.balance = balanceValidation.error;
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
// FILTER & SEARCH FUNCTIONS
// ============================================

/**
 * Filter leave requests based on search and filters
 */
export const filterLeaveRequests = (requests, filters) => {
  let filtered = [...requests];
  
  // Search by reason or employee name
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(req => 
      req.reason?.toLowerCase().includes(searchLower) ||
      req.employee?.fullName?.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by status
  if (filters.statusFilter) {
    filtered = filtered.filter(req => req.status === filters.statusFilter);
  }
  
  // Filter by leave type
  if (filters.leaveTypeFilter) {
    filtered = filtered.filter(req => req.leaveType === filters.leaveTypeFilter);
  }
  
  // Filter by date range
  if (filters.startDate) {
    filtered = filtered.filter(req => 
      new Date(req.startDate) >= new Date(filters.startDate)
    );
  }
  
  if (filters.endDate) {
    filtered = filtered.filter(req => 
      new Date(req.endDate) <= new Date(filters.endDate)
    );
  }
  
  return filtered;
};

/**
 * Sort leave requests
 */
export const sortLeaveRequests = (requests, sortBy = 'requestedAt', sortOrder = 'desc') => {
  const sorted = [...requests];
  
  sorted.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    // Handle date comparisons
    if (sortBy.includes('Date') || sortBy.includes('At')) {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
  
  return sorted;
};

// ============================================
// PTO BALANCE CALCULATIONS
// ============================================

/**
 * Calculate PTO usage percentage
 */
export const calculatePTOUsagePercentage = (usedDays, totalDays) => {
  if (!totalDays || totalDays === 0) return 0;
  return Math.round((usedDays / totalDays) * 100);
};

/**
 * Calculate remaining PTO percentage
 */
export const calculateRemainingPercentage = (remainingDays, totalDays) => {
  if (!totalDays || totalDays === 0) return 0;
  return Math.round((remainingDays / totalDays) * 100);
};

/**
 * Get PTO status (low, medium, high)
 */
export const getPTOStatus = (remainingDays, totalDays) => {
  const percentage = calculateRemainingPercentage(remainingDays, totalDays);
  
  if (percentage <= 25) return { status: 'low', color: '#f44336', label: 'Low' };
  if (percentage <= 50) return { status: 'medium', color: '#FDB94E', label: 'Medium' };
  return { status: 'high', color: '#4caf50', label: 'Good' };
};

// ============================================
// APPROVAL WORKFLOW HELPERS
// ============================================

/**
 * Get approver title based on role level
 */
export const getApproverTitle = (approverRoleLevel) => {
  if (approverRoleLevel === 2) return 'Executive';
  if (approverRoleLevel === 3) return 'Director';
  return 'Auto-Approved';
};

/**
 * Determine if user can approve request
 */
export const canApproveRequest = (userRole, request, userDepartmentId) => {
  if (userRole === 'Admin') return true;
  
  if (userRole === 'Executive' && request.approverRoleLevel === 2) {
    return true;
  }
  
  if (userRole === 'Director' && request.approverRoleLevel === 3) {
    return request.employee?.departmentId === userDepartmentId;
  }
  
  return false;
};

/**
 * Check if request can be cancelled
 */
export const canCancelRequest = (request, userId) => {
  return request.status === 'Pending' && request.employeeId === userId;
};

// ============================================
// FORMATTING FUNCTIONS
// ============================================

/**
 * Format days display (handles half days)
 */
export const formatDaysDisplay = (totalDays) => {
  if (totalDays === 0.5) return '0.5 day (Half Day)';
  if (totalDays === 1) return '1 day';
  return `${totalDays} days`;
};

/**
 * Format timestamp for display
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Get relative time (e.g., "2 days ago")
 */
export const getRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  return formatTimestamp(timestamp);
};

// ============================================
// STATISTICS & ANALYTICS
// ============================================

/**
 * Calculate leave statistics
 */
export const calculateLeaveStatistics = (requests) => {
  const stats = {
    total: requests.length,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    totalDays: 0,
    approvedDays: 0
  };
  
  requests.forEach(req => {
    if (req.status === 'Pending') stats.pending++;
    if (req.status === 'Approved') {
      stats.approved++;
      stats.approvedDays += req.totalDays || 0;
    }
    if (req.status === 'Rejected') stats.rejected++;
    if (req.status === 'Cancelled') stats.cancelled++;
    stats.totalDays += req.totalDays || 0;
  });
  
  return stats;
};

/**
 * Group requests by month
 */
export const groupRequestsByMonth = (requests) => {
  const grouped = {};
  
  requests.forEach(req => {
    const date = new Date(req.startDate);
    const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    
    grouped[monthKey].push(req);
  });
  
  return grouped;
};

/**
 * Group requests by status
 */
export const groupRequestsByStatus = (requests) => {
  const grouped = {
    Pending: [],
    Approved: [],
    Rejected: [],
    Cancelled: []
  };
  
  requests.forEach(req => {
    if (grouped[req.status]) {
      grouped[req.status].push(req);
    }
  });
  
  return grouped;
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  // Constants
  LEAVE_STATUS,
  LEAVE_STATUS_OPTIONS,
  LEAVE_TYPE_COLORS,
  
  // Status helpers
  getStatusColor,
  getStatusIcon,
  getLeaveTypeColor,
  getLeaveTypeIcon,
  deductsPTO,
  
  // Initial data
  getInitialLeaveRequestData,
  getInitialFilterState,
  
  // Date helpers
  getTodayString,
  getDateAfterDays,
  formatDisplayDate,
  formatDateRange,
  calculateTotalDays,
  isPastDate,
  isToday,
  getDayOfWeek,
  
  // Validation
  validateDates,
  validatePTOBalance,
  validateLeaveRequestForm,
  
  // Filter & search
  filterLeaveRequests,
  sortLeaveRequests,
  
  // PTO calculations
  calculatePTOUsagePercentage,
  calculateRemainingPercentage,
  getPTOStatus,
  
  // Approval helpers
  getApproverTitle,
  canApproveRequest,
  canCancelRequest,
  
  // Formatting
  formatDaysDisplay,
  formatTimestamp,
  getRelativeTime,
  
  // Statistics
  calculateLeaveStatistics,
  groupRequestsByMonth,
  groupRequestsByStatus
};