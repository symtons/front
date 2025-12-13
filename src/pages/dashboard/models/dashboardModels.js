// src/pages/dashboard/models/dashboardModels.js
/**
 * Dashboard Models & Helpers
 * Constants, formatters, and utility functions for dashboards
 */

// =============================================
// ROLE LEVEL CONSTANTS
// =============================================

export const ROLE_LEVELS = {
  ADMIN: 1,
  EXECUTIVE: 2,
  DIRECTOR: 3,
  COORDINATOR: 4,
  MANAGER: 5,
  EMPLOYEE: 6,
};

// =============================================
// STATUS COLORS (TPA Brand)
// =============================================

export const STATUS_COLORS = {
  active: '#6AB4A8',      // Green
  pending: '#FDB94E',     // Orange
  approved: '#6AB4A8',    // Green
  rejected: '#F44336',    // Red
  onLeave: '#667eea',     // Purple
  warning: '#FDB94E',     // Orange
};

// =============================================
// ACTIVITY TYPE ICONS
// =============================================

export const ACTIVITY_ICONS = {
  'Leave Request': '🏖️',
  'Job Application': '📝',
  'HR Action': '📋',
  'Performance Review': '⭐',
  'Onboarding': '👋',
};

// =============================================
// FORMATTING HELPERS
// =============================================

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format datetime to readable string with time
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(dateString);
};

/**
 * Format rating to stars
 */
export const formatRating = (rating) => {
  if (rating === null || rating === undefined) return 'N/A';
  const num = Number(rating);
  if (isNaN(num)) return 'N/A';
  return num.toFixed(1);
};

// =============================================
// STATUS HELPERS
// =============================================

/**
 * Get status chip color
 */
export const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase() || '';
  
  if (statusLower.includes('pending')) return STATUS_COLORS.pending;
  if (statusLower.includes('approved')) return STATUS_COLORS.approved;
  if (statusLower.includes('rejected') || statusLower.includes('denied')) return STATUS_COLORS.rejected;
  if (statusLower.includes('active')) return STATUS_COLORS.active;
  if (statusLower.includes('leave')) return STATUS_COLORS.onLeave;
  
  return '#757575'; // Default gray
};

/**
 * Get status icon
 */
export const getStatusIcon = (status) => {
  const statusLower = status?.toLowerCase() || '';
  
  if (statusLower.includes('pending')) return '⏳';
  if (statusLower.includes('approved')) return '✅';
  if (statusLower.includes('rejected') || statusLower.includes('denied')) return '❌';
  if (statusLower.includes('active')) return '🟢';
  if (statusLower.includes('leave')) return '🔴';
  
  return '⚪';
};

/**
 * Get activity icon
 */
export const getActivityIcon = (activityType) => {
  return ACTIVITY_ICONS[activityType] || '📌';
};

// =============================================
// TREND HELPERS
// =============================================

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Get trend indicator
 */
export const getTrendIndicator = (current, previous) => {
  const change = calculatePercentageChange(current, previous);
  if (change > 0) return { icon: '↑', color: '#6AB4A8', text: 'up' };
  if (change < 0) return { icon: '↓', color: '#F44336', text: 'down' };
  return { icon: '→', color: '#757575', text: 'stable' };
};

// =============================================
// UTILITY HELPERS
// =============================================

/**
 * Safe number conversion
 */
export const toNumber = (value, defaultValue = 0) => {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Get greeting based on time of day
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Get dashboard title by role level
 */
export const getDashboardTitle = (roleLevel) => {
  const titles = {
    [ROLE_LEVELS.ADMIN]: 'System Administrator Dashboard',
    [ROLE_LEVELS.EXECUTIVE]: 'Executive Dashboard',
    [ROLE_LEVELS.DIRECTOR]: 'Director Dashboard',
    [ROLE_LEVELS.COORDINATOR]: 'Program Coordinator Dashboard',
    [ROLE_LEVELS.MANAGER]: 'Field Manager Dashboard',
    [ROLE_LEVELS.EMPLOYEE]: 'My Dashboard',
  };
  return titles[roleLevel] || 'Dashboard';
};

// =============================================
// VALIDATION HELPERS
// =============================================

/**
 * Check if data is loaded
 */
export const isDataLoaded = (data) => {
  return data !== null && data !== undefined && Object.keys(data).length > 0;
};

/**
 * Safe data extraction from API response
 */
export const extractData = (response, key, defaultValue = []) => {
  return response?.[key] || defaultValue;
};

/**
 * Safe metric extraction
 */
export const getMetric = (metrics, key, defaultValue = 0) => {
  return metrics?.[key] !== undefined ? metrics[key] : defaultValue;
};