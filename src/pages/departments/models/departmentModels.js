// src/pages/departments/models/departmentModels.js
/**
 * Department Models
 * Data structures, validation, formatting, and business logic for Departments module
 */

// ============================================
// CONSTANTS & ENUMS
// ============================================

export const DEPARTMENT_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
};

export const DEPARTMENT_STATUS_COLORS = {
  Active: {
    bg: '#e8f5e9',
    text: '#2e7d32',
    border: '#66bb6a'
  },
  Inactive: {
    bg: '#ffebee',
    text: '#c62828',
    border: '#ef5350'
  }
};

// TPA Brand Colors
export const TPA_COLORS = {
  primary: '#667eea',
  secondary: '#6AB4A8',
  accent: '#FDB94E',
  info: '#5B8FCC',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  dark: '#2c3e50'
};

// Department Icons (Material-UI icon names)
export const DEPARTMENT_ICONS = {
  'Nursing': 'local_hospital',
  'Event Management': 'event',
  'Human Resources': 'people',
  'Information Technology': 'computer',
  'Finance': 'account_balance',
  'Programs': 'work'
};

// Default icon for departments
export const DEFAULT_DEPARTMENT_ICON = 'business';

// ============================================
// INITIAL FORM DATA
// ============================================

/**
 * Get initial form data for creating/editing department
 * @returns {Object} Initial form data structure
 */
export const getInitialDepartmentFormData = () => ({
  departmentName: '',
  departmentCode: '',
  description: '',
  isActive: true
});

/**
 * Map department API response to form data
 * @param {Object} department - Department object from API
 * @returns {Object} Form data structure
 */
export const mapDepartmentToFormData = (department) => {
  if (!department) return getInitialDepartmentFormData();

  return {
    departmentName: department.departmentName || '',
    departmentCode: department.departmentCode || '',
    description: department.description || '',
    isActive: department.isActive !== undefined ? department.isActive : true
  };
};

/**
 * Prepare department data for API submission
 * @param {Object} formData - Form data
 * @returns {Object} API request payload
 */
export const prepareDepartmentDataForAPI = (formData) => {
  return {
    departmentName: formData.departmentName.trim(),
    departmentCode: formData.departmentCode.trim().toUpperCase(),
    description: formData.description?.trim() || null,
    isActive: formData.isActive
  };
};

// ============================================
// VALIDATION
// ============================================

/**
 * Validate department form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateDepartmentForm = (formData) => {
  const errors = {};

  // Department Name validation
  if (!formData.departmentName || formData.departmentName.trim() === '') {
    errors.departmentName = 'Department name is required';
  } else if (formData.departmentName.trim().length < 2) {
    errors.departmentName = 'Department name must be at least 2 characters';
  } else if (formData.departmentName.trim().length > 100) {
    errors.departmentName = 'Department name must not exceed 100 characters';
  }

  // Department Code validation
  if (!formData.departmentCode || formData.departmentCode.trim() === '') {
    errors.departmentCode = 'Department code is required';
  } else if (formData.departmentCode.trim().length < 2) {
    errors.departmentCode = 'Department code must be at least 2 characters';
  } else if (formData.departmentCode.trim().length > 10) {
    errors.departmentCode = 'Department code must not exceed 10 characters';
  } else if (!/^[A-Z0-9]+$/i.test(formData.departmentCode.trim())) {
    errors.departmentCode = 'Department code must contain only letters and numbers';
  }

  // Description validation (optional)
  if (formData.description && formData.description.trim().length > 255) {
    errors.description = 'Description must not exceed 255 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ============================================
// FORMATTING HELPERS
// ============================================

/**
 * Format department code to uppercase
 * @param {string} code - Department code
 * @returns {string} Formatted code
 */
export const formatDepartmentCode = (code) => {
  if (!code) return '';
  return code.trim().toUpperCase();
};

/**
 * Get department icon by name
 * @param {string} departmentName - Department name
 * @returns {string} Material-UI icon name
 */
export const getDepartmentIcon = (departmentName) => {
  return DEPARTMENT_ICONS[departmentName] || DEFAULT_DEPARTMENT_ICON;
};

/**
 * Get status badge color
 * @param {string} status - Department status
 * @returns {Object} Color object with bg, text, border
 */
export const getStatusColor = (status) => {
  return DEPARTMENT_STATUS_COLORS[status] || DEPARTMENT_STATUS_COLORS.Active;
};

/**
 * Format employee count for display
 * @param {number} count - Employee count
 * @returns {string} Formatted count
 */
export const formatEmployeeCount = (count) => {
  if (!count || count === 0) return '0 employees';
  if (count === 1) return '1 employee';
  return `${count} employees`;
};

/**
 * Get department color (based on name)
 * @param {string} departmentName - Department name
 * @returns {string} Hex color code
 */
export const getDepartmentColor = (departmentName) => {
  const colorMap = {
    'Nursing': '#e91e63',
    'Event Management': '#9c27b0',
    'Human Resources': '#2196f3',
    'Information Technology': '#00bcd4',
    'Finance': '#4caf50',
    'Programs': '#ff9800'
  };
  return colorMap[departmentName] || TPA_COLORS.primary;
};

// ============================================
// STATISTICS HELPERS
// ============================================

/**
 * Calculate department statistics
 * @param {Object} department - Department object with stats
 * @returns {Object} Calculated statistics
 */
export const calculateDepartmentStats = (department) => {
  const total = department.totalEmployees || 0;
  const adminStaff = department.adminStaffCount || 0;
  const fieldStaff = department.fieldStaffCount || 0;

  return {
    total,
    adminStaff,
    fieldStaff,
    adminStaffPercentage: total > 0 ? Math.round((adminStaff / total) * 100) : 0,
    fieldStaffPercentage: total > 0 ? Math.round((fieldStaff / total) * 100) : 0
  };
};

/**
 * Get employee type distribution
 * @param {number} adminCount - Admin staff count
 * @param {number} fieldCount - Field staff count
 * @returns {Array} Distribution data for charts
 */
export const getEmployeeTypeDistribution = (adminCount, fieldCount) => {
  return [
    {
      name: 'Admin Staff',
      value: adminCount,
      color: TPA_COLORS.primary
    },
    {
      name: 'Field Staff',
      value: fieldCount,
      color: TPA_COLORS.secondary
    }
  ];
};

// ============================================
// SORTING & FILTERING
// ============================================

/**
 * Sort departments by name
 * @param {Array} departments - Array of departments
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted departments
 */
export const sortDepartmentsByName = (departments, order = 'asc') => {
  return [...departments].sort((a, b) => {
    const nameA = a.departmentName.toLowerCase();
    const nameB = b.departmentName.toLowerCase();
    if (order === 'asc') {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });
};

/**
 * Sort departments by employee count
 * @param {Array} departments - Array of departments
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted departments
 */
export const sortDepartmentsByEmployeeCount = (departments, order = 'desc') => {
  return [...departments].sort((a, b) => {
    if (order === 'desc') {
      return b.employeeCount - a.employeeCount;
    } else {
      return a.employeeCount - b.employeeCount;
    }
  });
};

/**
 * Filter departments by search query
 * @param {Array} departments - Array of departments
 * @param {string} searchQuery - Search query
 * @returns {Array} Filtered departments
 */
export const filterDepartments = (departments, searchQuery) => {
  if (!searchQuery || searchQuery.trim() === '') {
    return departments;
  }

  const query = searchQuery.toLowerCase().trim();
  
  return departments.filter(dept => 
    dept.departmentName.toLowerCase().includes(query) ||
    dept.departmentCode.toLowerCase().includes(query) ||
    (dept.description && dept.description.toLowerCase().includes(query))
  );
};

/**
 * Filter departments by status
 * @param {Array} departments - Array of departments
 * @param {string} status - 'Active' or 'Inactive' or 'All'
 * @returns {Array} Filtered departments
 */
export const filterDepartmentsByStatus = (departments, status) => {
  if (status === 'All' || !status) {
    return departments;
  }
  
  return departments.filter(dept => dept.isActive === (status === 'Active'));
};

// ============================================
// DISPLAY HELPERS
// ============================================

/**
 * Get department summary text
 * @param {Object} department - Department object
 * @returns {string} Summary text
 */
export const getDepartmentSummary = (department) => {
  const total = department.employeeCount || 0;
  const admin = department.adminStaffCount || 0;
  const field = department.fieldStaffCount || 0;
  
  if (total === 0) return 'No employees';
  
  return `${total} total (${admin} admin, ${field} field)`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  // Constants
  DEPARTMENT_STATUS,
  DEPARTMENT_STATUS_COLORS,
  TPA_COLORS,
  DEPARTMENT_ICONS,
  DEFAULT_DEPARTMENT_ICON,
  
  // Initial Data
  getInitialDepartmentFormData,
  mapDepartmentToFormData,
  prepareDepartmentDataForAPI,
  
  // Validation
  validateDepartmentForm,
  
  // Formatting
  formatDepartmentCode,
  getDepartmentIcon,
  getStatusColor,
  formatEmployeeCount,
  getDepartmentColor,
  
  // Statistics
  calculateDepartmentStats,
  getEmployeeTypeDistribution,
  
  // Sorting & Filtering
  sortDepartmentsByName,
  sortDepartmentsByEmployeeCount,
  filterDepartments,
  filterDepartmentsByStatus,
  
  // Display
  getDepartmentSummary,
  truncateText
};