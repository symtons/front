import api from './authService';

export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get('/Dashboard/Stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load stats' };
    }
  },

  // Get recent activities
  getRecentActivities: async () => {
    try {
      const response = await api.get('/Dashboard/RecentActivities');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load activities' };
    }
  },

  // Get quick actions based on role
  getQuickActions: async () => {
    try {
      const response = await api.get('/Dashboard/QuickActions');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load actions' };
    }
  },
};