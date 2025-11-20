// src/services/leaveService.js
// Leave Management API Service - CORRECTED VERSION

import api from './authService';

/**
 * Leave Management Service
 * 
 * Handles all API calls for leave management matching backend LeaveController endpoints
 */

const leaveService = {
  
  // ============================================
  // LEAVE REQUESTS
  // ============================================

  /**
   * Get all leave requests for current logged-in user
   * GET /api/Leave/MyRequests
   * No parameters needed - uses JWT token to identify user
   */
  getMyRequests: async () => {
    try {
      const response = await api.get('/Leave/MyRequests');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load leave requests' };
    }
  },

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
   * Cancel a pending leave request
   * DELETE /api/Leave/Cancel/{id}
   */
  cancelRequest: async (leaveRequestId) => {
    try {
      const response = await api.delete(`/Leave/Cancel/${leaveRequestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel leave request' };
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

  // ============================================
  // APPROVAL WORKFLOW (Directors/Executives)
  // ============================================

  /**
   * Get all pending requests for approval
   * GET /api/Leave/PendingApprovals
   */
  getPendingApprovals: async () => {
    try {
      const response = await api.get('/Leave/PendingApprovals');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load pending approvals' };
    }
  },

  /**
   * Approve a leave request
   * PUT /api/Leave/Approve/{id}
   */
  approveRequest: async (leaveRequestId, approvalNotes = '') => {
    try {
      const response = await api.put(`/Leave/Approve/${leaveRequestId}`, {
        approvalNotes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to approve leave request' };
    }
  },

  /**
   * Reject a leave request
   * PUT /api/Leave/Reject/{id}
   */
  rejectRequest: async (leaveRequestId, rejectionReason) => {
    try {
      const response = await api.put(`/Leave/Reject/${leaveRequestId}`, {
        rejectionReason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject leave request' };
    }
  },

  // ============================================
  // PTO BALANCE
  // ============================================

  /**
   * Get PTO balance for current user
   * GET /api/Leave/MyBalance
   */
  getMyBalance: async () => {
    try {
      const response = await api.get('/Leave/MyBalance');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load PTO balance' };
    }
  },

  // ============================================
  // CALENDAR & STATISTICS
  // ============================================

  /**
   * Get leave statistics (if endpoint exists)
   * GET /api/Leave/Statistics
   */
  getStatistics: async () => {
    try {
      const response = await api.get('/Leave/Statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load statistics' };
    }
  }
};

export default leaveService;