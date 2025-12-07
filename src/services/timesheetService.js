// src/services/timesheetService.js
import api from './authService';

/**
 * Timesheet Service
 * Handles all API calls for Timesheet Approval module
 */

const timesheetService = {

  // ============================================
  // EMPLOYEE - MY TIMESHEETS
  // ============================================

  /**
   * Get my timesheets
   * GET /api/Timesheet/MyTimesheets
   */
  getMyTimesheets: async (filters = {}) => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await api.get('/Timesheet/MyTimesheets', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load timesheets' };
    }
  },

  /**
   * Get timesheet details (with daily breakdown)
   * GET /api/Timesheet/{id}
   */
  getTimesheetDetails: async (timesheetId) => {
    try {
      const response = await api.get(`/Timesheet/${timesheetId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load timesheet details' };
    }
  },

  /**
   * Submit timesheet for approval
   * POST /api/Timesheet/{id}/Submit
   */
  submitTimesheet: async (timesheetId) => {
    try {
      const response = await api.post(`/Timesheet/${timesheetId}/Submit`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit timesheet' };
    }
  },

  /**
   * Generate timesheet from time entries
   * POST /api/Timesheet/Generate
   */
  generateTimesheet: async (startDate, endDate) => {
    try {
      const response = await api.post('/Timesheet/Generate', {
        startDate,
        endDate
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate timesheet' };
    }
  },

  /**
   * Get timesheet statistics
   * GET /api/Timesheet/Statistics
   */
  getStatistics: async () => {
    try {
      const response = await api.get('/Timesheet/Statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load statistics' };
    }
  },

  // ============================================
  // MANAGER/DIRECTOR - APPROVAL
  // ============================================

  /**
   * Get pending timesheets (role-based)
   * GET /api/Timesheet/Pending
   */
  getPendingTimesheets: async (departmentId = null) => {
    try {
      const params = {};
      if (departmentId) params.departmentId = departmentId;

      const response = await api.get('/Timesheet/Pending', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load pending timesheets' };
    }
  },

  /**
   * Approve timesheet
   * POST /api/Timesheet/{id}/Approve
   */
  approveTimesheet: async (timesheetId, comments = '') => {
    try {
      const response = await api.post(`/Timesheet/${timesheetId}/Approve`, {
        comments
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to approve timesheet' };
    }
  },

  /**
   * Reject timesheet
   * POST /api/Timesheet/{id}/Reject
   */
  rejectTimesheet: async (timesheetId, rejectionReason) => {
    try {
      const response = await api.post(`/Timesheet/${timesheetId}/Reject`, {
        rejectionReason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject timesheet' };
    }
  }
};

export default timesheetService;