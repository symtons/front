import api from './authService';

export const employeeService = {
  // Get employee directory with filters
  getDirectory: async (params) => {
    try {
      const response = await api.get('/Employee/Directory', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load employees' };
    }
  },

  // Get single employee details
  getEmployeeById: async (id) => {
    try {
      const response = await api.get(`/Employee/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load employee details' };
    }
  },

  // Get employee statistics
  getStats: async () => {
    try {
      const response = await api.get('/Employee/Stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load employee stats' };
    }
  },

  // Create new employee (to be implemented later)
  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/Employee', employeeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create employee' };
    }
  },

  // Update employee (to be implemented later) 
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await api.put(`/Employee/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update employee' };
    }
  },

  // Delete employee (to be implemented later)
  deleteEmployee: async (id) => {
    try {
      const response = await api.delete(`/Employee/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete employee' };
    }
  },
};