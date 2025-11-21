// src/pages/recruitment/models/applicationReviewModels.js
/**
 * Application Review Models
 * Helper functions, validation, formatting, and data transformation for HR Application Review
 */

// ============================================
// 1. CONSTANTS & ENUMS
// ============================================

export const APPLICATION_STATUS = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  INTERVIEW_SCHEDULED: 'Interview Scheduled',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ARCHIVED: 'Archived'
};

export const APPROVAL_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

export const POSITION_OPTIONS = [
  'Direct Support Professional (DSP)',
  'Program Coordinator',
  'Registered Nurse (RN)',
  'Licensed Practical Nurse (LPN)',
  'Administrative Assistant',
  'HR Manager',
  'Other'
];

export const EMPLOYEE_TYPE_OPTIONS = [
  'Full Time',
  'Part Time',
  'PRN (As Needed)',
  'Contractor'
];

export const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: APPLICATION_STATUS.SUBMITTED, label: 'Submitted' },
  { value: APPLICATION_STATUS.UNDER_REVIEW, label: 'Under Review' },
  { value: APPLICATION_STATUS.INTERVIEW_SCHEDULED, label: 'Interview Scheduled' },
  { value: APPLICATION_STATUS.APPROVED, label: 'Approved' },
  { value: APPLICATION_STATUS.REJECTED, label: 'Rejected' }
];

export const APPROVAL_FILTER_OPTIONS = [
  { value: '', label: 'All Approvals' },
  { value: APPROVAL_STATUS.PENDING, label: 'Pending' },
  { value: APPROVAL_STATUS.APPROVED, label: 'Approved' },
  { value: APPROVAL_STATUS.REJECTED, label: 'Rejected' }
];

// ============================================
// 2. STATUS & DISPLAY HELPERS
// ============================================

/**
 * Get status color for StatusChip component
 * @param {string} status - Application status
 * @returns {string} Color name ('info', 'success', 'error', 'warning', 'default')
 */
export const getStatusColor = (status) => {
  switch (status) {
    case APPLICATION_STATUS.SUBMITTED:
      return 'info';
    case APPLICATION_STATUS.UNDER_REVIEW:
      return 'warning';
    case APPLICATION_STATUS.INTERVIEW_SCHEDULED:
      return 'warning';
    case APPLICATION_STATUS.APPROVED:
      return 'success';
    case APPLICATION_STATUS.REJECTED:
      return 'error';
    case APPLICATION_STATUS.ARCHIVED:
      return 'default';
    default:
      return 'default';
  }
};

/**
 * Get approval status color
 * @param {string} approvalStatus - Approval status
 * @returns {string} Color name
 */
export const getApprovalStatusColor = (approvalStatus) => {
  switch (approvalStatus) {
    case APPROVAL_STATUS.PENDING:
      return 'warning';
    case APPROVAL_STATUS.APPROVED:
      return 'success';
    case APPROVAL_STATUS.REJECTED:
      return 'error';
    default:
      return 'default';
  }
};

/**
 * Get status variant for Material-UI
 * @param {string} status - Application status
 * @returns {string} MUI variant
 */
export const getStatusVariant = (status) => {
  return getStatusColor(status);
};

/**
 * Get display label for status
 * @param {string} status - Status value
 * @returns {string} Display label
 */
export const getStatusLabel = (status) => {
  if (!status) return 'Unknown';
  return status;
};

// ============================================
// 3. DATA FORMATTING FUNCTIONS
// ============================================

/**
 * Format date for display
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date (e.g., 'Nov 21, 2025')
 */
export const formatApplicationDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format date and time for display
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date and time (e.g., 'Nov 21, 2025 3:45 PM')
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone (e.g., '(615) 555-1234')
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Return original if not 10 digits
  return phone;
};

/**
 * Format full name
 * @param {string} firstName - First name
 * @param {string} middleName - Middle name (optional)
 * @param {string} lastName - Last name
 * @returns {string} Full name
 */
export const formatFullName = (firstName, middleName, lastName) => {
  const parts = [firstName, middleName, lastName].filter(Boolean);
  return parts.join(' ') || 'N/A';
};

/**
 * Format address
 * @param {Object} application - Application object
 * @returns {string} Formatted address
 */
export const formatAddress = (application) => {
  if (!application) return 'N/A';
  
  const parts = [
    application.address,
    application.aptNumber ? `Apt ${application.aptNumber}` : null,
    application.city,
    application.state,
    application.zipCode
  ].filter(Boolean);
  
  return parts.length > 0 ? parts.join(', ') : 'N/A';
};

/**
 * Format employment type
 * @param {string} type - Employee type
 * @returns {string} Display label
 */
export const formatEmploymentType = (type) => {
  if (!type) return 'N/A';
  return type;
};

/**
 * Format years of experience
 * @param {number} years - Number of years
 * @returns {string} Formatted string
 */
export const formatYearsExperience = (years) => {
  if (years === null || years === undefined) return 'N/A';
  
  if (years === 0) return 'Less than 1 year';
  if (years === 1) return '1 year';
  return `${years} years`;
};

/**
 * Format salary expectation
 * @param {number} amount - Salary amount
 * @returns {string} Formatted currency
 */
export const formatSalaryExpectation = (amount) => {
  if (!amount) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Get relative time since submission
 * @param {string|Date} submittedDate - Submission date
 * @returns {string} Relative time (e.g., '2 hours ago')
 */
export const getTimeSinceSubmission = (submittedDate) => {
  if (!submittedDate) return 'Unknown';
  
  try {
    const now = new Date();
    const submitted = new Date(submittedDate);
    const diffMs = now - submitted;
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  } catch (error) {
    return 'Unknown';
  }
};

// ============================================
// 4. VALIDATION FUNCTIONS
// ============================================

/**
 * Validate rejection reason
 * @param {string} reason - Rejection reason
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateRejectReason = (reason) => {
  if (!reason || !reason.trim()) {
    return {
      isValid: false,
      error: 'Rejection reason is required'
    };
  }
  
  if (reason.trim().length < 10) {
    return {
      isValid: false,
      error: 'Rejection reason must be at least 10 characters'
    };
  }
  
  if (reason.trim().length > 500) {
    return {
      isValid: false,
      error: 'Rejection reason cannot exceed 500 characters'
    };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate notes
 * @param {string} notes - Notes text
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateNotes = (notes) => {
  if (!notes || !notes.trim()) {
    return {
      isValid: false,
      error: 'Notes are required'
    };
  }
  
  if (notes.trim().length < 5) {
    return {
      isValid: false,
      error: 'Notes must be at least 5 characters'
    };
  }
  
  if (notes.trim().length > 1000) {
    return {
      isValid: false,
      error: 'Notes cannot exceed 1000 characters'
    };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate approval status
 * @param {string} status - Approval status
 * @returns {boolean} Is valid
 */
export const validateApprovalStatus = (status) => {
  return Object.values(APPROVAL_STATUS).includes(status);
};

// ============================================
// 5. DATA TRANSFORMATION FUNCTIONS
// ============================================

/**
 * Prepare reject request for API
 * @param {string} reason - Rejection reason
 * @returns {Object} API request object
 */
export const prepareRejectRequest = (reason) => {
  return {
    rejectionReason: reason.trim()
  };
};

/**
 * Prepare notes request for API
 * @param {string} notes - Notes text
 * @returns {Object} API request object
 */
export const prepareNotesRequest = (notes) => {
  return {
    notes: notes.trim()
  };
};

/**
 * Prepare approval request for API
 * @param {string} status - Approval status
 * @param {string} notes - Optional notes
 * @returns {Object} API request object
 */
export const prepareApprovalRequest = (status, notes = '') => {
  return {
    approvalStatus: status,
    notes: notes.trim()
  };
};

/**
 * Prepare filter parameters for API
 * @param {Object} filters - Filter object
 * @returns {Object} Clean params for API
 */
export const prepareFilterParams = (filters) => {
  const params = {
    pageNumber: filters.page || 1,
    pageSize: filters.pageSize || 10
  };
  
  // Only add non-empty filters
  if (filters.searchTerm && filters.searchTerm.trim()) {
    params.searchTerm = filters.searchTerm.trim();
  }
  
  if (filters.status) {
    params.status = filters.status;
  }
  
  if (filters.approvalStatus) {
    params.approvalStatus = filters.approvalStatus;
  }
  
  if (filters.position) {
    params.position = filters.position;
  }
  
  return params;
};

/**
 * Transform application for display in table
 * @param {Object} application - Raw application from API
 * @returns {Object} Transformed application
 */
export const transformApplicationForDisplay = (application) => {
  if (!application) return null;
  
  return {
    id: application.applicationId,
    applicationId: application.applicationId,
    fullName: formatFullName(application.firstName, application.middleName, application.lastName),
    firstName: application.firstName,
    lastName: application.lastName,
    email: application.email || 'N/A',
    phoneNumber: formatPhoneNumber(application.cellPhone || application.homePhone),
    positionAppliedFor: application.position1 || 'N/A',
    status: application.status || APPLICATION_STATUS.SUBMITTED,
    approvalStatus: application.approvalStatus || APPROVAL_STATUS.PENDING,
    submittedAt: application.submissionDate || application.applicationDate,
    submittedAtFormatted: formatApplicationDate(application.submissionDate || application.applicationDate),
    timeSince: getTimeSinceSubmission(application.submissionDate || application.applicationDate),
    city: application.city,
    state: application.state,
    reviewedBy: application.reviewedBy,
    reviewedDate: application.reviewedDate
  };
};

/**
 * Transform multiple applications
 * @param {Array} applications - Array of applications
 * @returns {Array} Transformed applications
 */
export const transformApplicationsForDisplay = (applications) => {
  if (!Array.isArray(applications)) return [];
  return applications.map(transformApplicationForDisplay).filter(Boolean);
};

// ============================================
// 6. FILTER & SORT HELPERS
// ============================================

/**
 * Filter applications by search term (client-side)
 * @param {Array} applications - Applications array
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered applications
 */
export const filterBySearchTerm = (applications, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) return applications;
  
  const search = searchTerm.toLowerCase().trim();
  
  return applications.filter(app => {
    return (
      (app.fullName && app.fullName.toLowerCase().includes(search)) ||
      (app.email && app.email.toLowerCase().includes(search)) ||
      (app.phoneNumber && app.phoneNumber.includes(search)) ||
      (app.positionAppliedFor && app.positionAppliedFor.toLowerCase().includes(search))
    );
  });
};

/**
 * Filter applications by status
 * @param {Array} applications - Applications array
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered applications
 */
export const filterByStatus = (applications, status) => {
  if (!status || status === '') return applications;
  return applications.filter(app => app.status === status);
};

/**
 * Filter applications by approval status
 * @param {Array} applications - Applications array
 * @param {string} approvalStatus - Approval status to filter by
 * @returns {Array} Filtered applications
 */
export const filterByApprovalStatus = (applications, approvalStatus) => {
  if (!approvalStatus || approvalStatus === '') return applications;
  return applications.filter(app => app.approvalStatus === approvalStatus);
};

/**
 * Sort applications
 * @param {Array} applications - Applications array
 * @param {string} sortBy - Field to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted applications
 */
export const sortApplications = (applications, sortBy = 'submittedAt', order = 'desc') => {
  const sorted = [...applications];
  
  sorted.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = (a.fullName || '').localeCompare(b.fullName || '');
        break;
      case 'submittedAt':
        comparison = new Date(a.submittedAt) - new Date(b.submittedAt);
        break;
      case 'status':
        comparison = (a.status || '').localeCompare(b.status || '');
        break;
      case 'position':
        comparison = (a.positionAppliedFor || '').localeCompare(b.positionAppliedFor || '');
        break;
      default:
        comparison = 0;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
};

// ============================================
// 7. STATISTICS HELPERS
// ============================================

/**
 * Calculate statistics from applications
 * @param {Array} applications - Applications array
 * @returns {Object} Statistics
 */
export const calculateStatistics = (applications) => {
  if (!Array.isArray(applications) || applications.length === 0) {
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      underReview: 0
    };
  }
  
  return {
    total: applications.length,
    pending: applications.filter(app => app.approvalStatus === APPROVAL_STATUS.PENDING).length,
    approved: applications.filter(app => app.approvalStatus === APPROVAL_STATUS.APPROVED).length,
    rejected: applications.filter(app => app.approvalStatus === APPROVAL_STATUS.REJECTED).length,
    underReview: applications.filter(app => app.status === APPLICATION_STATUS.UNDER_REVIEW).length
  };
};

/**
 * Get initial filter state
 * @returns {Object} Initial filter state
 */
export const getInitialFilterState = () => ({
  searchTerm: '',
  status: '',
  approvalStatus: '',
  position: '',
  page: 0,
  pageSize: 10
});

/**
 * Check if application can be approved
 * @param {Object} application - Application object
 * @returns {boolean} Can approve
 */
export const canApproveApplication = (application) => {
  if (!application) return false;
  return application.approvalStatus === APPROVAL_STATUS.PENDING;
};

/**
 * Check if application can be rejected
 * @param {Object} application - Application object
 * @returns {boolean} Can reject
 */
export const canRejectApplication = (application) => {
  if (!application) return false;
  return application.approvalStatus === APPROVAL_STATUS.PENDING;
};

/**
 * Get action buttons for application
 * @param {Object} application - Application object
 * @returns {Object} Available actions
 */
export const getAvailableActions = (application) => {
  return {
    canView: true,
    canApprove: canApproveApplication(application),
    canReject: canRejectApplication(application),
    canAddNotes: true,
    canArchive: application.approvalStatus !== APPROVAL_STATUS.PENDING
  };
};