// src/services/leaveService.js
// Leave Management API Service

import api from './authService';

/**
 * Leave Management Service
 * 
 * Handles all API calls for leave management:
 * - PTO Balance
 * - Leave Types
 * - Submit/Cancel Requests
 * - Approval Workflow
 * - Calendar Data
 */

const leaveService = {
  
  // ============================================
  // PTO BALANCE
  // ============================================

  /**
   * Get PTO balance for an employee
   * GET /api/Leave/Balance/{employeeId}
   */
  getPTOBalance: async (employeeId) => {
    try {
      const response = await api.get(`/Leave/Balance/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load PTO balance' };
    }
  },

  /**
   * Adjust employee PTO balance (Admin only)
   * POST /api/Leave/Balance/{employeeId}/Adjust
   */
  adjustPTOBalance: async (employeeId, adjustment, reason) => {
    try {
      const response = await api.post(`/Leave/Balance/${employeeId}/Adjust`, {
        adjustment,
        reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to adjust PTO balance' };
    }
  },

  // ============================================
  // LEAVE TYPES
  // ============================================

  /**
   * Get all active leave types
   * GET /api/Leave/Types
   */
  getLeaveTypes: async () => {
    try {
      const response = await api.get('/Leave/Types');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load leave types' };
    }
  },

  /**
   * Get leave type by ID
   * GET /api/Leave/Types/{leaveTypeId}
   */
  getLeaveTypeById: async (leaveTypeId) => {
    try {
      const response = await api.get(`/Leave/Types/${leaveTypeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load leave type' };
    }
  },

  /**
   * Create a new leave type (Admin only)
   * POST /api/Leave/Types
   */
  createLeaveType: async (leaveTypeData) => {
    try {
      const response = await api.post('/Leave/Types', leaveTypeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create leave type' };
    }
  },

  /**
   * Update a leave type (Admin only)
   * PUT /api/Leave/Types/{leaveTypeId}
   */
  updateLeaveType: async (leaveTypeId, updateData) => {
    try {
      const response = await api.put(`/Leave/Types/${leaveTypeId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update leave type' };
    }
  },

  /**
   * Delete/Deactivate a leave type (Admin only)
   * DELETE /api/Leave/Types/{leaveTypeId}
   */
  deleteLeaveType: async (leaveTypeId) => {
    try {
      const response = await api.delete(`/Leave/Types/${leaveTypeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete leave type' };
    }
  },

  // ============================================
  // SUBMIT & MANAGE REQUESTS (Employee)
  // ============================================

  /**
   * Submit a new leave request
   * POST /api/Leave/Request
   */
  submitLeaveRequest: async (requestData) => {
    try {
      const response = await api.post('/Leave/Request', requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit leave request' };
    }
  },

  /**
   * Get all leave requests for an employee
   * GET /api/Leave/Requests/Employee/{employeeId}
   */
  getMyRequests: async (employeeId) => {
    try {
      const response = await api.get(`/Leave/Requests/Employee/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load leave requests' };
    }
  },

  /**
   * Get a specific leave request by ID
   * GET /api/Leave/Request/{leaveRequestId}
   */
  getRequestById: async (leaveRequestId) => {
    try {
      const response = await api.get(`/Leave/Request/${leaveRequestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load leave request' };
    }
  },

  /**
   * Cancel a pending leave request
   * PUT /api/Leave/Request/{leaveRequestId}/Cancel
   */
  cancelRequest: async (leaveRequestId) => {
    try {
      const response = await api.put(`/Leave/Request/${leaveRequestId}/Cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel leave request' };
    }
  },

  /**
   * Update a pending leave request
   * PUT /api/Leave/Request/{leaveRequestId}
   */
  updateRequest: async (leaveRequestId, updateData) => {
    try {
      const response = await api.put(`/Leave/Request/${leaveRequestId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update leave request' };
    }
  },

  // ============================================
  // APPROVAL WORKFLOW (Manager/Admin)
  // ============================================

  /**
   * Get all pending requests for approval
   * GET /api/Leave/Requests/Pending
   */
  getPendingRequests: async (roleLevel) => {
    try {
      const response = await api.get('/Leave/Requests/Pending', {
        params: { roleLevel }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load pending requests' };
    }
  },

  /**
   * Get all leave requests (for managers)
   * GET /api/Leave/Requests
   */
  getAllRequests: async (filters = {}) => {
    try {
      const response = await api.get('/Leave/Requests', {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load leave requests' };
    }
  },

  /**
   * Approve a leave request
   * PUT /api/Leave/Request/{leaveRequestId}/Approve
   */
  approveRequest: async (leaveRequestId, approvedBy) => {
    try {
      const response = await api.put(`/Leave/Request/${leaveRequestId}/Approve`, {
        approvedBy
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to approve leave request' };
    }
  },

  /**
   * Reject a leave request
   * PUT /api/Leave/Request/{leaveRequestId}/Reject
   */
  rejectRequest: async (leaveRequestId, rejectedBy, rejectionReason) => {
    try {
      const response = await api.put(`/Leave/Request/${leaveRequestId}/Reject`, {
        rejectedBy,
        rejectionReason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject leave request' };
    }
  },

  /**
   * Bulk approve multiple requests
   * POST /api/Leave/Requests/BulkApprove
   */
  bulkApprove: async (requestIds, approvedBy) => {
    try {
      const response = await api.post('/Leave/Requests/BulkApprove', {
        requestIds,
        approvedBy
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to bulk approve requests' };
    }
  },

  // ============================================
  // CALENDAR & REPORTING
  // ============================================

  /**
   * Get leave calendar data for a date range
   * GET /api/Leave/Calendar
   */
  getLeaveCalendar: async (startDate, endDate) => {
    try {
      const response = await api.get('/Leave/Calendar', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load leave calendar' };
    }
  },

  /**
   * Get leave statistics for reporting
   * GET /api/Leave/Statistics
   */
  getLeaveStatistics: async (params = {}) => {
    try {
      const response = await api.get('/Leave/Statistics', {
        params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load leave statistics' };
    }
  },

  /**
   * Export leave data to CSV/Excel
   * GET /api/Leave/Export
   */
  exportLeaveData: async (filters = {}, format = 'csv') => {
    try {
      const response = await api.get('/Leave/Export', {
        params: { ...filters, format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to export leave data' };
    }
  },

  // ============================================
  // EMPLOYEE MANAGEMENT
  // ============================================

  /**
   * Get list of employees (for filters/dropdowns)
   * GET /api/Employee/Directory
   */
  getEmployees: async () => {
    try {
      const response = await api.get('/Employee/Directory');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load employees' };
    }
  },

  /**
   * Get employee details with leave info
   * GET /api/Leave/Employee/{employeeId}
   */
  getEmployeeLeaveInfo: async (employeeId) => {
    try {
      const response = await api.get(`/Leave/Employee/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load employee leave info' };
    }
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================

  /**
   * Get leave notifications for current user
   * GET /api/Leave/Notifications/{userId}
   */
  getNotifications: async (userId) => {
    try {
      const response = await api.get(`/Leave/Notifications/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load notifications' };
    }
  },

  /**
   * Mark notification as read
   * PUT /api/Leave/Notifications/{notificationId}/Read
   */
  markNotificationRead: async (notificationId) => {
    try {
      const response = await api.put(`/Leave/Notifications/${notificationId}/Read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark notification as read' };
    }
  }
};

export default leaveService;