import api from './authService';

export const onboardingService = {
  // Employee endpoints
  getMyTasks: async () => {
    try {
      const response = await api.get('/Onboarding/MyTasks');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch onboarding tasks' };
    }
  },

  completeTask: async (taskId, data) => {
    try {
      const response = await api.put(`/Onboarding/Task/${taskId}/Complete`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to complete task' };
    }
  },

  uploadTaskDocument: async (taskId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/Onboarding/Task/${taskId}/Upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload document' };
    }
  },

  // HR endpoints
  getOnboardingMonitor: async () => {
    try {
      const response = await api.get('/Onboarding/Monitor');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch onboarding monitor' };
    }
  },

  getEmployeeTasks: async (employeeId) => {
    try {
      const response = await api.get(`/Onboarding/Employee/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch employee tasks' };
    }
  },

  initializeOnboarding: async (employeeId) => {
    try {
      const response = await api.post(`/Onboarding/Initialize/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to initialize onboarding' };
    }
  },

  verifyTask: async (taskId, data) => {
    try {
      const response = await api.put(`/Onboarding/Task/${taskId}/Verify`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to verify task' };
    }
  },

  extendDueDate: async (taskId, data) => {
    try {
      const response = await api.put(`/Onboarding/Task/${taskId}/Extend`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to extend due date' };
    }
  },

  assignTask: async (data) => {
    try {
      const response = await api.post('/Onboarding/Task/Assign', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to assign task' };
    }
  },

  removeTask: async (taskId) => {
    try {
      const response = await api.delete(`/Onboarding/Task/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to remove task' };
    }
  },

  getProgress: async (employeeId) => {
    try {
      const response = await api.get(`/Onboarding/Progress/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch progress' };
    }
  },

  getStatistics: async () => {
    try {
      const response = await api.get('/Onboarding/Statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch statistics' };
    }
  },

  // Job Application - Hire candidate
  hireCandidate: async (applicationId, hireData) => {
    try {
      const response = await api.post(`/JobApplication/${applicationId}/Hire`, hireData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to hire candidate' };
    }
  },
};

export default onboardingService;
