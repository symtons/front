// src/pages/reports/models/reportsModels.js
/**
 * Reports Models
 * Constants, data structures, and formatting helpers for Reports & Analytics module
 */

// ============================================
// CONSTANTS
// ============================================

export const TPA_COLORS = {
  primary: '#667eea',      // Purple
  secondary: '#6AB4A8',    // Teal
  accent: '#FDB94E',       // Gold
  success: '#48bb78',      // Green
  warning: '#ff9800',      // Orange
  error: '#f56565',        // Red
  info: '#4299e1',         // Blue
  dark: '#2c3e50'          // Dark
};

// Report Categories
export const REPORT_CATEGORIES = {
  WORKFORCE: 'workforce',
  PAYROLL: 'payroll',
  LEAVE: 'leave',
  PERFORMANCE: 'performance',
  RECRUITMENT: 'recruitment',
  HR_ACTIONS: 'hr-actions'
};

// Export Formats
export const EXPORT_FORMATS = {
  CSV: 'csv',
  PDF: 'pdf',
  EXCEL: 'xlsx'
};

// Date Range Presets
export const DATE_RANGES = {
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  THIS_QUARTER: 'this_quarter',
  THIS_YEAR: 'this_year',
  LAST_MONTH: 'last_month',
  LAST_QUARTER: 'last_quarter',
  LAST_YEAR: 'last_year',
  CUSTOM: 'custom'
};

// ============================================
// TABLE COLUMN DEFINITIONS
// ============================================

/**
 * Workforce Summary Columns
 */
export const WORKFORCE_COLUMNS = [
  { 
    id: 'employeeCode', 
    label: 'Employee Code', 
    minWidth: 120,
    sortable: true 
  },
  { 
    id: 'firstName', 
    label: 'First Name', 
    minWidth: 150,
    sortable: true 
  },
  { 
    id: 'lastName', 
    label: 'Last Name', 
    minWidth: 150,
    sortable: true 
  },
  { 
    id: 'departmentName', 
    label: 'Department', 
    minWidth: 150,
    sortable: true 
  },
  { 
    id: 'jobTitle', 
    label: 'Job Title', 
    minWidth: 180,
    sortable: true 
  },
  { 
    id: 'employeeType', 
    label: 'Type', 
    minWidth: 120,
    sortable: true 
  },
  { 
    id: 'employmentStatus', 
    label: 'Status', 
    minWidth: 120,
    align: 'center',
    sortable: true 
  },
  { 
    id: 'hireDate', 
    label: 'Hire Date', 
    minWidth: 120,
    sortable: true,
    format: 'date'
  },
  { 
    id: 'yearsOfService', 
    label: 'Years of Service', 
    minWidth: 140,
    align: 'right',
    sortable: true 
  },
  { 
    id: 'salary', 
    label: 'Salary', 
    minWidth: 120,
    align: 'right',
    sortable: true,
    format: 'currency'
  }
];

/**
 * Leave Summary Columns
 */
export const LEAVE_COLUMNS = [
  { 
    id: 'employeeCode', 
    label: 'Employee Code', 
    minWidth: 120 
  },
  { 
    id: 'firstName', 
    label: 'First Name', 
    minWidth: 130 
  },
  { 
    id: 'lastName', 
    label: 'Last Name', 
    minWidth: 130 
  },
  { 
    id: 'departmentName', 
    label: 'Department', 
    minWidth: 140 
  },
  { 
    id: 'leaveType', 
    label: 'Leave Type', 
    minWidth: 120 
  },
  { 
    id: 'startDate', 
    label: 'Start Date', 
    minWidth: 110,
    format: 'date'
  },
  { 
    id: 'endDate', 
    label: 'End Date', 
    minWidth: 110,
    format: 'date'
  },
  { 
    id: 'totalDays', 
    label: 'Days', 
    minWidth: 80,
    align: 'center'
  },
  { 
    id: 'status', 
    label: 'Status', 
    minWidth: 100,
    align: 'center'
  }
];

/**
 * Performance Summary Columns
 */
export const PERFORMANCE_COLUMNS = [
  { 
    id: 'employeeCode', 
    label: 'Employee Code', 
    minWidth: 120 
  },
  { 
    id: 'firstName', 
    label: 'First Name', 
    minWidth: 130 
  },
  { 
    id: 'lastName', 
    label: 'Last Name', 
    minWidth: 130 
  },
  { 
    id: 'departmentName', 
    label: 'Department', 
    minWidth: 140 
  },
  { 
    id: 'jobTitle', 
    label: 'Job Title', 
    minWidth: 160 
  },
  { 
    id: 'periodName', 
    label: 'Review Period', 
    minWidth: 150 
  },
  { 
    id: 'overallRating', 
    label: 'Rating', 
    minWidth: 100,
    align: 'center'
  },
  { 
    id: 'status', 
    label: 'Status', 
    minWidth: 120,
    align: 'center'
  },
  { 
    id: 'reviewDate', 
    label: 'Review Date', 
    minWidth: 120,
    format: 'date'
  }
];

/**
 * Application Summary Columns
 */
export const APPLICATION_COLUMNS = [
  { 
    id: 'firstName', 
    label: 'First Name', 
    minWidth: 130 
  },
  { 
    id: 'lastName', 
    label: 'Last Name', 
    minWidth: 130 
  },
  { 
    id: 'email', 
    label: 'Email', 
    minWidth: 200 
  },
  { 
    id: 'phoneNumber', 
    label: 'Phone', 
    minWidth: 130 
  },
  { 
    id: 'position1', 
    label: 'Position', 
    minWidth: 160 
  },
  { 
    id: 'submittedAt', 
    label: 'Submitted', 
    minWidth: 120,
    format: 'date'
  },
  { 
    id: 'approvalStatus', 
    label: 'Status', 
    minWidth: 120,
    align: 'center'
  },
  { 
    id: 'daysToReview', 
    label: 'Days to Review', 
    minWidth: 130,
    align: 'right'
  }
];

/**
 * HR Actions Summary Columns
 */
export const HR_ACTIONS_COLUMNS = [
  { 
    id: 'requestNumber', 
    label: 'Request #', 
    minWidth: 120 
  },
  { 
    id: 'firstName', 
    label: 'First Name', 
    minWidth: 130 
  },
  { 
    id: 'lastName', 
    label: 'Last Name', 
    minWidth: 130 
  },
  { 
    id: 'departmentName', 
    label: 'Department', 
    minWidth: 140 
  },
  { 
    id: 'actionType', 
    label: 'Action Type', 
    minWidth: 160 
  },
  { 
    id: 'submittedDate', 
    label: 'Submitted', 
    minWidth: 120,
    format: 'date'
  },
  { 
    id: 'effectiveDate', 
    label: 'Effective Date', 
    minWidth: 130,
    format: 'date'
  },
  { 
    id: 'status', 
    label: 'Status', 
    minWidth: 120,
    align: 'center'
  },
  { 
    id: 'processingDays', 
    label: 'Processing Days', 
    minWidth: 140,
    align: 'right'
  }
];

// ============================================
// STATUS MAPPINGS
// ============================================

export const STATUS_COLORS = {
  'Active': TPA_COLORS.success,
  'Approved': TPA_COLORS.success,
  'Completed': TPA_COLORS.success,
  'Pending': TPA_COLORS.warning,
  'In Progress': TPA_COLORS.info,
  'Rejected': TPA_COLORS.error,
  'Terminated': TPA_COLORS.error,
  'Cancelled': TPA_COLORS.error,
  'On Leave': TPA_COLORS.warning,
  'Open': TPA_COLORS.info
};

export const EMPLOYEE_TYPE_LABELS = {
  'AdminStaff': 'Admin Staff',
  'FieldStaff': 'Field Staff'
};

export const EMPLOYMENT_STATUS_LABELS = {
  'Active': 'Active',
  'OnLeave': 'On Leave',
  'Terminated': 'Terminated'
};

// ============================================
// CHART CONFIGURATIONS
// ============================================

export const CHART_DEFAULTS = {
  height: 300,
  margin: { top: 20, right: 30, bottom: 20, left: 40 },
  colors: [
    TPA_COLORS.primary,
    TPA_COLORS.secondary,
    TPA_COLORS.accent,
    TPA_COLORS.success,
    TPA_COLORS.warning,
    TPA_COLORS.error,
    TPA_COLORS.info
  ]
};

export const PIE_CHART_CONFIG = {
  ...CHART_DEFAULTS,
  innerRadius: 0,
  outerRadius: 100,
  paddingAngle: 2,
  labelLine: true
};

export const BAR_CHART_CONFIG = {
  ...CHART_DEFAULTS,
  barSize: 40,
  barGap: 8
};

export const LINE_CHART_CONFIG = {
  ...CHART_DEFAULTS,
  strokeWidth: 2,
  dot: true,
  activeDot: { r: 6 }
};

// ============================================
// INITIAL FILTER STATE
// ============================================

export const getInitialFilterState = () => ({
  departmentId: '',
  year: new Date().getFullYear(),
  periodId: '',
  dateRange: DATE_RANGES.THIS_YEAR,
  startDate: null,
  endDate: null,
  status: '',
  employeeType: ''
});

// ============================================
// VALIDATION
// ============================================

export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true;
  return new Date(startDate) <= new Date(endDate);
};

export const validateYear = (year) => {
  const currentYear = new Date().getFullYear();
  return year >= 2000 && year <= currentYear + 1;
};

// ============================================
// DATA TRANSFORMERS
// ============================================

/**
 * Transform API response for table display
 */
export const transformTableData = (data, columns) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(row => {
    const transformed = { ...row };
    columns.forEach(col => {
      if (col.format === 'currency' && transformed[col.id]) {
        transformed[`${col.id}Formatted`] = formatCurrency(transformed[col.id]);
      } else if (col.format === 'date' && transformed[col.id]) {
        transformed[`${col.id}Formatted`] = formatDate(transformed[col.id]);
      }
    });
    return transformed;
  });
};

/**
 * Transform data for chart display
 */
export const transformChartData = (data, xKey, yKey, nameKey = null) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(item => ({
    name: nameKey ? item[nameKey] : item[xKey],
    value: item[yKey],
    ...item
  }));
};

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// ============================================
// EXPORT CONFIGURATION
// ============================================

export const CSV_EXPORT_CONFIG = {
  filename: 'report',
  separator: ',',
  includeHeaders: true,
  dateFormat: 'yyyy-MM-dd'
};

export const PDF_EXPORT_CONFIG = {
  orientation: 'landscape',
  unit: 'in',
  format: 'letter',
  fontSize: 10
};