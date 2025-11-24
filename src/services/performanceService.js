import api from './authService';

export const performanceService = {
  // =============================================
  // PERFORMANCE REVIEWS
  // =============================================

  // Get employee's reviews
  getMyReviews: async () => {
    try {
      const response = await api.get('/PerformanceReview/MyReviews');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load reviews' };
    }
  },

  // Get review by ID
  getReviewById: async (id) => {
    try {
      const response = await api.get(`/PerformanceReview/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load review details' };
    }
  },

  // Submit self-assessment
  submitSelfAssessment: async (reviewData) => {
    try {
      const response = await api.post('/PerformanceReview/SubmitSelfAssessment', reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit self-assessment' };
    }
  },

  // Submit manager assessment
  submitManagerAssessment: async (reviewData) => {
    try {
      const response = await api.post('/PerformanceReview/SubmitManagerAssessment', reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit manager assessment' };
    }
  },

  // Get team reviews (for managers)
  getTeamReviews: async (params) => {
    try {
      const response = await api.get('/PerformanceReview/TeamReviews', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load team reviews' };
    }
  },

  // Get active review cycles
  getActiveReviewCycles: async () => {
    try {
      const response = await api.get('/PerformanceReview/ActiveCycles');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load review cycles' };
    }
  },

  // Get performance summary
  getPerformanceSummary: async () => {
    try {
      const response = await api.get('/PerformanceReview/Summary');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load performance summary' };
    }
  },

  // =============================================
  // GOALS
  // =============================================

  // Get employee's goals
  getMyGoals: async (params) => {
    try {
      const response = await api.get('/Goal/MyGoals', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load goals' };
    }
  },

  // Get goal by ID
  getGoalById: async (id) => {
    try {
      const response = await api.get(`/Goal/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load goal details' };
    }
  },

  // Create new goal
  createGoal: async (goalData) => {
    try {
      const response = await api.post('/Goal', goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create goal' };
    }
  },

  // Update goal
  updateGoal: async (id, goalData) => {
    try {
      const response = await api.put(`/Goal/${id}`, goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update goal' };
    }
  },

  // Add goal update
  addGoalUpdate: async (id, updateData) => {
    try {
      const response = await api.post(`/Goal/${id}/Update`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add goal update' };
    }
  },

  // Delete goal
  deleteGoal: async (id) => {
    try {
      const response = await api.delete(`/Goal/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete goal' };
    }
  },

  // Get team goals (for managers)
  getTeamGoals: async (params) => {
    try {
      const response = await api.get('/Goal/TeamGoals', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load team goals' };
    }
  },

  // Get goal statistics
  getGoalStatistics: async () => {
    try {
      const response = await api.get('/Goal/Statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load goal statistics' };
    }
  },

  // =============================================
  // FEEDBACK
  // =============================================

  // Get received feedback
  getReceivedFeedback: async (params) => {
    try {
      const response = await api.get('/Feedback/Received', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load received feedback' };
    }
  },

  // Get given feedback
  getGivenFeedback: async (params) => {
    try {
      const response = await api.get('/Feedback/Given', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load given feedback' };
    }
  },

  // Get feedback by ID
  getFeedbackById: async (id) => {
    try {
      const response = await api.get(`/Feedback/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load feedback details' };
    }
  },

  // Create feedback
  createFeedback: async (feedbackData) => {
    try {
      const response = await api.post('/Feedback', feedbackData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit feedback' };
    }
  },

  // Mark feedback as read
  markFeedbackAsRead: async (id) => {
    try {
      const response = await api.put(`/Feedback/${id}/MarkAsRead`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark feedback as read' };
    }
  },

  // Delete feedback
  deleteFeedback: async (id) => {
    try {
      const response = await api.delete(`/Feedback/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete feedback' };
    }
  },

  // Get feedback statistics
  getFeedbackStatistics: async () => {
    try {
      const response = await api.get('/Feedback/Statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load feedback statistics' };
    }
  },

  // Get team feedback (for managers)
  getTeamFeedback: async (params) => {
    try {
      const response = await api.get('/Feedback/TeamFeedback', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load team feedback' };
    }
  }
};

export default performanceService;
