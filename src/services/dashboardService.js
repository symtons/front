import api from './authService';
// =============================================
// DASHBOARD API SERVICE
// Handles all dashboard-related API calls
// =============================================

const dashboardService = {
  // =============================================
  // ADMIN DASHBOARD
  // =============================================
  
  /**
   * Get complete admin dashboard data
   */
  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  /**
   * Get admin metrics only
   */
  getAdminMetrics: async () => {
    const response = await api.get('/dashboard/admin/metrics');
    return response.data;
  },

  /**
   * Get admin department breakdown
   */
  getAdminDepartments: async () => {
    const response = await api.get('/dashboard/admin/departments');
    return response.data;
  },

  /**
   * Get admin recent activity
   */
  getAdminActivity: async () => {
    const response = await api.get('/dashboard/admin/activity');
    return response.data;
  },

  // =============================================
  // EXECUTIVE DASHBOARD
  // =============================================
  
  /**
   * Get complete executive dashboard data
   */
  getExecutiveDashboard: async () => {
    const response = await api.get('/dashboard/executive');
    return response.data;
  },

  /**
   * Get executive metrics only
   */
  getExecutiveMetrics: async () => {
    const response = await api.get('/dashboard/executive/metrics');
    return response.data;
  },

  /**
   * Get executive headcount trend
   */
  getExecutiveHeadcountTrend: async () => {
    const response = await api.get('/dashboard/executive/headcount-trend');
    return response.data;
  },

  /**
   * Get executive department performance
   */
  getExecutiveDepartmentPerformance: async () => {
    const response = await api.get('/dashboard/executive/department-performance');
    return response.data;
  },

  // =============================================
  // DIRECTOR DASHBOARD
  // =============================================
  
  /**
   * Get complete director dashboard data
   */
  getDirectorDashboard: async (departmentId) => {
    const response = await api.get(`/dashboard/director/${departmentId}`);
    return response.data;
  },

  /**
   * Get director metrics only
   */
  getDirectorMetrics: async (departmentId) => {
    const response = await api.get(`/dashboard/director/${departmentId}/metrics`);
    return response.data;
  },

  /**
   * Get director pending approvals
   */
  getDirectorPendingApprovals: async (departmentId) => {
    const response = await api.get(`/dashboard/director/${departmentId}/pending-approvals`);
    return response.data;
  },

  /**
   * Get director team status
   */
  getDirectorTeamStatus: async (departmentId) => {
    const response = await api.get(`/dashboard/director/${departmentId}/team-status`);
    return response.data;
  },

  // =============================================
  // COORDINATOR DASHBOARD
  // =============================================
  
  /**
   * Get coordinator dashboard data
   */
  getCoordinatorDashboard: async (employeeId) => {
    const response = await api.get(`/dashboard/coordinator/${employeeId}`);
    return response.data;
  },

  // =============================================
  // MANAGER DASHBOARD
  // =============================================
  
  /**
   * Get manager dashboard data
   */
  getManagerDashboard: async (employeeId) => {
    const response = await api.get(`/dashboard/manager/${employeeId}`);
    return response.data;
  },

  // =============================================
  // EMPLOYEE DASHBOARD
  // =============================================
  
  /**
   * Get complete employee dashboard data
   */
  getEmployeeDashboard: async (employeeId) => {
    const response = await api.get(`/dashboard/employee/${employeeId}`);
    return response.data;
  },

  /**
   * Get employee metrics only
   */
  getEmployeeMetrics: async (employeeId) => {
    const response = await api.get(`/dashboard/employee/${employeeId}/metrics`);
    return response.data;
  },

  /**
   * Get employee leave requests
   */
  getEmployeeLeaveRequests: async (employeeId) => {
    const response = await api.get(`/dashboard/employee/${employeeId}/leave-requests`);
    return response.data;
  },

  /**
   * Get employee upcoming events
   */
  getEmployeeUpcomingEvents: async (employeeId) => {
    const response = await api.get(`/dashboard/employee/${employeeId}/upcoming-events`);
    return response.data;
  },
};

export default dashboardService;