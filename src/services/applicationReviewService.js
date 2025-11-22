// src/services/applicationReviewService.js
import api from './authService';

/**
 * Application Review Service
 * Handles all API calls for HR Application Review Dashboard
 */

const applicationReviewService = {
  
  // ============================================
  // GET APPLICATIONS
  // ============================================

  /**
   * Get all applications with filters and pagination
   * GET /api/JobApplication/All
   */
  getAllApplications: async (params) => {
    try {
      const response = await api.get('/JobApplication/All', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load applications' };
    }
  },

  /**
   * Get single application details
   * GET /api/JobApplication/{id}
   */
  getApplicationById: async (id) => {
    try {
      const response = await api.get(`/JobApplication/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load application details' };
    }
  },

  /**
   * Get application statistics
   * GET /api/JobApplication/Statistics
   */
  getStatistics: async () => {
    try {
      const response = await api.get('/JobApplication/Statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load statistics' };
    }
  },

  // ============================================
  // ACTIONS
  // ============================================

  /**
   * Reject application with reason
   * POST /api/JobApplication/{id}/Reject
   */
  rejectApplication: async (id, rejectionReason) => {
    try {
      const response = await api.post(`/JobApplication/${id}/Reject`, {
        rejectionReason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject application' };
    }
  },

  /**
   * Add review notes to application
   * POST /api/JobApplication/{id}/Notes
   */
  addNotes: async (id, notes) => {
    try {
      const response = await api.post(`/JobApplication/${id}/Notes`, {
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add notes' };
    }
  },

  /**
   * Update approval status
   * PUT /api/JobApplication/{id}/Approval
   */
  updateApprovalStatus: async (id, approvalStatus, notes = '') => {
    try {
      const response = await api.put(`/JobApplication/${id}/Approval`, {
        approvalStatus,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update approval status' };
    }
  },

  /**
   * Update application status
   * PUT /api/JobApplication/{id}/Status
   */
  updateStatus: async (id, status, notes = '') => {
    try {
      const response = await api.put(`/JobApplication/${id}/Status`, {
        status,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update status' };
    }
  }
};

export default applicationReviewService;