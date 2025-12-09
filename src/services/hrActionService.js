// src/services/hrActionService.js
// HR Actions API Service

import api from './authService';

/**
 * HR Actions Service
 * Handles all API calls for HR action requests
 */

const hrActionService = {
  
  // ============================================
  // ACTION TYPES
  // ============================================
  
  /**
   * Get all active action types
   * GET /api/HRAction/ActionTypes
   */
  getActionTypes: async () => {
    try {
      const response = await api.get('/HRAction/ActionTypes');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load action types' };
    }
  },

  // ============================================
  // SUBMIT REQUEST
  // ============================================
  
  /**
   * Submit new HR action request
   * POST /api/HRAction/Submit
   */
  submitRequest: async (requestData) => {
    try {
      const response = await api.post('/HRAction/Submit', requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit request' };
    }
  },

  // ============================================
  // MY REQUESTS
  // ============================================
  
  /**
   * Get current user's HR action requests
   * GET /api/HRAction/MyRequests
   */
  getMyRequests: async () => {
    try {
      const response = await api.get('/HRAction/MyRequests');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load requests' };
    }
  },

  // ============================================
  // PENDING REVIEW (HR/Executive)
  // ============================================
  
  /**
   * Get all pending requests for review
   * GET /api/HRAction/PendingReview
   */
  getPendingReview: async () => {
    try {
      const response = await api.get('/HRAction/PendingReview');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load pending requests' };
    }
  },

  // ============================================
  // REQUEST DETAILS
  // ============================================
  
  /**
   * Get single request details
   * GET /api/HRAction/{id}
   */
  getRequestDetails: async (id) => {
    try {
      const response = await api.get(`/HRAction/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load request details' };
    }
  },

  // ============================================
  // APPROVE REQUEST
  // ============================================
  
  /**
   * Approve HR action request
   * PUT /api/HRAction/Approve/{id}
   */
  approveRequest: async (id, comments = '') => {
    try {
      const response = await api.put(`/HRAction/Approve/${id}`, {
        comments
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to approve request' };
    }
  },

  // ============================================
  // REJECT REQUEST
  // ============================================
  
  /**
   * Reject HR action request
   * PUT /api/HRAction/Reject/{id}
   */
  rejectRequest: async (id, rejectionReason) => {
    try {
      const response = await api.put(`/HRAction/Reject/${id}`, {
        rejectionReason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject request' };
    }
  }
};

export default hrActionService;