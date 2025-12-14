// src/services/dashboardService.js
/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */

import api from './authService';

const dashboardService = {
  // =============================================
  // ADMIN DASHBOARD
  // =============================================
  
  /**
   * Get complete admin dashboard data
   */
  getAdminDashboard: async () => {
    try {
      const response = await api.get('/dashboard/admin');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load admin dashboard' };
    }
  },

  /**
   * Get admin metrics only
   */
  getAdminMetrics: async () => {
    try {
      const response = await api.get('/dashboard/admin/metrics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load admin metrics' };
    }
  },

  /**
   * Get admin department breakdown
   */
  getAdminDepartments: async () => {
    try {
      const response = await api.get('/dashboard/admin/departments');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load department breakdown' };
    }
  },

  /**
   * Get admin recent activity
   */
  getAdminActivity: async () => {
    try {
      const response = await api.get('/dashboard/admin/activity');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load recent activity' };
    }
  },

  // =============================================
  // EXECUTIVE DASHBOARD
  // =============================================
  
  /**
   * Get complete executive dashboard data
   */
  getExecutiveDashboard: async () => {
    try {
      const response = await api.get('/dashboard/executive');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load executive dashboard' };
    }
  },

  /**
   * Get executive metrics only
   */
  getExecutiveMetrics: async () => {
    try {
      const response = await api.get('/dashboard/executive/metrics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load executive metrics' };
    }
  },

  /**
   * Get executive headcount trend
   */
  getExecutiveHeadcountTrend: async () => {
    try {
      const response = await api.get('/dashboard/executive/headcount-trend');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load headcount trend' };
    }
  },

  /**
   * Get executive department performance
   */
  getExecutiveDepartmentPerformance: async () => {
    try {
      const response = await api.get('/dashboard/executive/department-performance');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load department performance' };
    }
  },

  // =============================================
  // DIRECTOR DASHBOARD
  // =============================================
  
  /**
   * Get complete director dashboard data
   */
  getDirectorDashboard: async (departmentId) => {
    try {
      const response = await api.get(`/dashboard/director/${departmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load director dashboard' };
    }
  },

  /**
   * Get director metrics only
   */
  getDirectorMetrics: async (departmentId) => {
    try {
      const response = await api.get(`/dashboard/director/${departmentId}/metrics`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load director metrics' };
    }
  },

  /**
   * Get director pending approvals
   */
  getDirectorPendingApprovals: async (departmentId) => {
    try {
      const response = await api.get(`/dashboard/director/${departmentId}/pending-approvals`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load pending approvals' };
    }
  },

  /**
   * Get director team status
   */
  getDirectorTeamStatus: async (departmentId) => {
    try {
      const response = await api.get(`/dashboard/director/${departmentId}/team-status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load team status' };
    }
  },

  // =============================================
  // COORDINATOR DASHBOARD
  // =============================================
  
  /**
   * Get coordinator dashboard data
   */
  getCoordinatorDashboard: async (employeeId) => {
    try {
      const response = await api.get(`/dashboard/coordinator/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load coordinator dashboard' };
    }
  },

  // =============================================
  // MANAGER DASHBOARD
  // =============================================
  
  /**
   * Get manager dashboard data
   */
  getManagerDashboard: async (employeeId) => {
    try {
      const response = await api.get(`/dashboard/manager/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load manager dashboard' };
    }
  },

  // =============================================
  // EMPLOYEE DASHBOARD
  // =============================================
  
  /**
   * Get complete employee dashboard data
   */
  getEmployeeDashboard: async (employeeId) => {
    try {
      const response = await api.get(`/dashboard/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load employee dashboard' };
    }
  },

  /**
   * Get employee metrics only
   */
  getEmployeeMetrics: async (employeeId) => {
    try {
      const response = await api.get(`/dashboard/employee/${employeeId}/metrics`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load employee metrics' };
    }
  },

  /**
   * Get employee leave requests
   */
  getEmployeeLeaveRequests: async (employeeId) => {
    try {
      const response = await api.get(`/dashboard/employee/${employeeId}/leave-requests`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load leave requests' };
    }
  },

  /**
   * Get employee upcoming events
   */
  getEmployeeUpcomingEvents: async (employeeId) => {
    try {
      const response = await api.get(`/dashboard/employee/${employeeId}/upcoming-events`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load upcoming events' };
    }
  },
};

export default dashboardService;