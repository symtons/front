// src/services/applicationReviewService.js
import api from './authService';

/**
 * Application Review Service - COMPLETE VERSION
 * Handles all API calls for HR Application Review Dashboard
 * UPDATED: Added approveApplication method
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
      console.error('getAllApplications error:', error);
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
      console.error('getApplicationById error:', error);
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
      console.error('getStatistics error:', error);
      throw error.response?.data || { message: 'Failed to load statistics' };
    }
  },

  // ============================================
  // ACTIONS
  // ============================================

  /**
   * Reject application with reason
   * POST /api/JobApplication/{id}/Reject
   * FIXED: Backend expects RejectionReason with capital R
   */
  rejectApplication: async (id, rejectionReason) => {
    try {
      console.log('=== rejectApplication ===');
      console.log('ID:', id);
      console.log('Reason:', rejectionReason);
      
      const response = await api.post(`/JobApplication/${id}/Reject`, {
        RejectionReason: rejectionReason  // ← CAPITAL R for C# backend
      });
      
      console.log('Rejection successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('rejectApplication error:', error);
      console.error('Error response:', error.response?.data);
      throw error.response?.data || { message: 'Failed to reject application' };
    }
  },

  /**
   * ✅ NEW: Approve application (creates user account)
   * POST /api/JobApplication/{id}/Approve
   * Creates a user account with generated email and default password
   */
  approveApplication: async (id) => {
    try {
      console.log('=== approveApplication ===');
      console.log('ID:', id);
      
      const response = await api.post(`/JobApplication/${id}/Approve`);
      
      console.log('Approval successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('approveApplication error:', error);
      console.error('Error response:', error.response?.data);
      throw error.response?.data || { message: 'Failed to approve application' };
    }
  },

  /**
   * Add review notes to application
   * POST /api/JobApplication/{id}/Notes
   */
  addNotes: async (id, notes) => {
    try {
      console.log('=== addNotes ===');
      console.log('ID:', id);
      console.log('Notes:', notes);
      
      const response = await api.post(`/JobApplication/${id}/Notes`, {
        Notes: notes  // ← Capital N for C# backend
      });
      
      return response.data;
    } catch (error) {
      console.error('addNotes error:', error);
      throw error.response?.data || { message: 'Failed to add notes' };
    }
  },

  /**
   * Update approval status (generic)
   * PUT /api/JobApplication/{id}/Approval
   */
  updateApprovalStatus: async (id, approvalStatus, notes = '') => {
    try {
      console.log('=== updateApprovalStatus ===');
      console.log('ID:', id);
      console.log('Status:', approvalStatus);
      
      const response = await api.put(`/JobApplication/${id}/Approval`, {
        ApprovalStatus: approvalStatus,  // ← Capital A and S for C# backend
        Notes: notes || ''  // ← Capital N
      });
      
      return response.data;
    } catch (error) {
      console.error('updateApprovalStatus error:', error);
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
        Status: status,  // ← Capital S
        Notes: notes || ''  // ← Capital N
      });
      return response.data;
    } catch (error) {
      console.error('updateStatus error:', error);
      throw error.response?.data || { message: 'Failed to update status' };
    }
  }
};

export default applicationReviewService;