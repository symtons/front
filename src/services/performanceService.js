// src/services/performanceService.js
import api from './authService';

/**
 * Performance Management Service
 * Handles all API calls for performance reviews, goals, and feedback
 */

const performanceService = {
  
  // =============================================
  // REVIEW PERIODS
  // =============================================
  
  createPeriod: async (periodData) => {
    try {
      const response = await api.post('/PerformanceReview/CreatePeriod', periodData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create review period' };
    }
  },

  // =============================================
  // RATINGS (What I need to rate)
  // =============================================
  
  getMyRatings: async (periodId = null) => {
    try {
      const params = periodId ? { periodId } : {};
      const response = await api.get('/PerformanceReview/MyRatings', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load ratings' };
    }
  },

  submitRating: async (ratingData) => {
    try {
      const response = await api.post('/PerformanceReview/SubmitRating', ratingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit rating' };
    }
  },

  // =============================================
  // MY REVIEWS (My performance reviews)
  // =============================================
  
  getMyReviews: async () => {
    try {
      const response = await api.get('/PerformanceReview/MyReviews');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load reviews' };
    }
  },

  getReviewDetails: async (employeeReviewId) => {
    try {
      const response = await api.get(`/PerformanceReview/ReviewDetails/${employeeReviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load review details' };
    }
  },

  // =============================================
  // RANKINGS
  // =============================================
  
  getRankings: async (periodId, filter = 'all') => {
    try {
      const params = { filter };
      const response = await api.get(`/PerformanceReview/Rankings/${periodId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load rankings' };
    }
  },

  // =============================================
  // GOALS
  // =============================================
  
  getMyGoals: async (status = null) => {
    try {
      const params = status ? { status } : {};
      const response = await api.get('/Goal/MyGoals', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load goals' };
    }
  },

  createGoal: async (goalData) => {
    try {
      const response = await api.post('/Goal', goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create goal' };
    }
  },

  updateProgress: async (goalId, progress) => {
    try {
      const response = await api.put(`/Goal/${goalId}/Progress`, { progress });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update progress' };
    }
  },

  deleteGoal: async (goalId) => {
    try {
      const response = await api.delete(`/Goal/${goalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete goal' };
    }
  },

  // =============================================
  // FEEDBACK
  // =============================================
  
  getReceivedFeedback: async () => {
    try {
      const response = await api.get('/Feedback/Received');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load received feedback' };
    }
  },

  getGivenFeedback: async () => {
    try {
      const response = await api.get('/Feedback/Given');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load given feedback' };
    }
  },

  giveFeedback: async (feedbackData) => {
    try {
      const response = await api.post('/Feedback', feedbackData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit feedback' };
    }
  },

  markFeedbackAsRead: async (feedbackId) => {
    try {
      const response = await api.put(`/Feedback/${feedbackId}/MarkAsRead`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark feedback as read' };
    }
  }
};

export default performanceService;