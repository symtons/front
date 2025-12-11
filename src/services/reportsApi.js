// src/services/reportsApi.js
import api from './authService';

// =============================================
// OVERVIEW / DASHBOARD
// =============================================
export const getReportsOverview = () => api.get('/reports/overview');

// =============================================
// WORKFORCE REPORTS
// =============================================
export const getWorkforceSummary = (departmentId = null) => {
  const params = departmentId ? { departmentId } : {};
  return api.get('/reports/workforce/summary', { params });
};

export const getHeadcountByDepartment = () => api.get('/reports/workforce/headcount');

export const getTurnoverAnalysis = (year = null) => {
  const params = year ? { year } : {};
  return api.get('/reports/workforce/turnover', { params });
};

// =============================================
// PAYROLL REPORTS
// =============================================
export const getPayrollByDepartment = () => api.get('/reports/payroll/by-department');

export const getSalaryByRole = () => api.get('/reports/payroll/by-role');

// =============================================
// LEAVE REPORTS
// =============================================
export const getLeaveSummary = (year = null) => {
  const params = year ? { year } : {};
  return api.get('/reports/leave/summary', { params });
};

export const getLeaveUsageByDepartment = () => api.get('/reports/leave/usage-by-department');

export const getPTOBalances = () => api.get('/reports/leave/pto-balances');

// =============================================
// PERFORMANCE REPORTS
// =============================================
export const getPerformanceSummary = (periodId = null) => {
  const params = periodId ? { periodId } : {};
  return api.get('/reports/performance/summary', { params });
};

export const getPerformanceByDepartment = (periodId = null) => {
  const params = periodId ? { periodId } : {};
  return api.get('/reports/performance/by-department', { params });
};

export const getGoalCompletion = () => api.get('/reports/performance/goals');

// =============================================
// RECRUITMENT REPORTS
// =============================================
export const getApplicationSummary = (year = null) => {
  const params = year ? { year } : {};
  return api.get('/reports/recruitment/applications', { params });
};

export const getHiringFunnel = (year = null) => {
  const params = year ? { year } : {};
  return api.get('/reports/recruitment/hiring-funnel', { params });
};

// =============================================
// HR ACTIONS REPORTS
// =============================================
export const getHRActionsSummary = (year = null) => {
  const params = year ? { year } : {};
  return api.get('/reports/hr-actions/summary', { params });
};

export const getHRActionsByType = (year = null) => {
  const params = year ? { year } : {};
  return api.get('/reports/hr-actions/by-type', { params });
};