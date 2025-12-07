// src/services/departmentService.js
/**
 * Department Service
 * Handles all API calls for department management
 */

import api from './authService';

const departmentService = {
  // ============================================
  // GET ALL DEPARTMENTS
  // ============================================
  
  /**
   * Get all active departments with employee counts
   * GET /api/Department/All
   * @returns {Promise<Array>} Array of departments
   */
  getAllDepartments: async () => {
    try {
      const response = await api.get('/Department/All');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch departments' };
    }
  },

  // ============================================
  // GET DEPARTMENT BY ID
  // ============================================
  
  /**
   * Get single department details
   * GET /api/Department/{id}
   * @param {number} id - Department ID
   * @returns {Promise<Object>} Department details
   */
  getDepartmentById: async (id) => {
    try {
      const response = await api.get(`/Department/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch department details' };
    }
  },

  // ============================================
  // GET DEPARTMENT EMPLOYEES
  // ============================================
  
  /**
   * Get all employees in a department
   * GET /api/Department/{id}/Employees
   * @param {number} id - Department ID
   * @returns {Promise<Object>} { departmentId, totalEmployees, employees: Array }
   */
  getDepartmentEmployees: async (id) => {
    try {
      const response = await api.get(`/Department/${id}/Employees`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch department employees' };
    }
  },

  // ============================================
  // GET DEPARTMENT STATISTICS
  // ============================================
  
  /**
   * Get department statistics
   * GET /api/Department/{id}/Stats
   * @param {number} id - Department ID
   * @returns {Promise<Object>} Department statistics
   */
  getDepartmentStats: async (id) => {
    try {
      const response = await api.get(`/Department/${id}/Stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch department statistics' };
    }
  },

  // ============================================
  // CREATE DEPARTMENT
  // ============================================
  
  /**
   * Create new department (Admin/Executive only)
   * POST /api/Department
   * @param {Object} data - Department data
   * @param {string} data.departmentName - Department name
   * @param {string} data.departmentCode - Department code
   * @param {string} data.description - Department description (optional)
   * @returns {Promise<Object>} Created department response
   */
  createDepartment: async (data) => {
    try {
      const response = await api.post('/Department', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create department' };
    }
  },

  // ============================================
  // UPDATE DEPARTMENT
  // ============================================
  
  /**
   * Update department (Admin/Executive only)
   * PUT /api/Department/{id}
   * @param {number} id - Department ID
   * @param {Object} data - Updated department data
   * @param {string} data.departmentName - Department name (optional)
   * @param {string} data.departmentCode - Department code (optional)
   * @param {string} data.description - Department description (optional)
   * @param {boolean} data.isActive - Active status (optional)
   * @returns {Promise<Object>} Updated department response
   */
  updateDepartment: async (id, data) => {
    try {
      const response = await api.put(`/Department/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update department' };
    }
  },

  // ============================================
  // DELETE DEPARTMENT
  // ============================================
  
  /**
   * Delete (deactivate) department (Admin only)
   * DELETE /api/Department/{id}
   * @param {number} id - Department ID
   * @returns {Promise<Object>} Delete response
   */
  deleteDepartment: async (id) => {
    try {
      const response = await api.delete(`/Department/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete department' };
    }
  },

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Check if department name is unique
   * @param {string} departmentName - Department name to check
   * @param {number} excludeId - Department ID to exclude from check (for editing)
   * @returns {Promise<boolean>} True if unique
   */
  isDepartmentNameUnique: async (departmentName, excludeId = null) => {
    try {
      const departments = await departmentService.getAllDepartments();
      return !departments.some(dept => 
        dept.departmentName.toLowerCase() === departmentName.toLowerCase() &&
        dept.departmentId !== excludeId
      );
    } catch (error) {
      console.error('Error checking department name uniqueness:', error);
      return true; // Assume unique on error to allow backend validation
    }
  },

  /**
   * Check if department code is unique
   * @param {string} departmentCode - Department code to check
   * @param {number} excludeId - Department ID to exclude from check (for editing)
   * @returns {Promise<boolean>} True if unique
   */
  isDepartmentCodeUnique: async (departmentCode, excludeId = null) => {
    try {
      const departments = await departmentService.getAllDepartments();
      return !departments.some(dept => 
        dept.departmentCode.toLowerCase() === departmentCode.toLowerCase() &&
        dept.departmentId !== excludeId
      );
    } catch (error) {
      console.error('Error checking department code uniqueness:', error);
      return true; // Assume unique on error to allow backend validation
    }
  },

  /**
   * Get department by name
   * @param {string} departmentName - Department name
   * @returns {Promise<Object|null>} Department object or null
   */
  getDepartmentByName: async (departmentName) => {
    try {
      const departments = await departmentService.getAllDepartments();
      return departments.find(dept => 
        dept.departmentName.toLowerCase() === departmentName.toLowerCase()
      ) || null;
    } catch (error) {
      console.error('Error fetching department by name:', error);
      return null;
    }
  },

  /**
   * Get department by code
   * @param {string} departmentCode - Department code
   * @returns {Promise<Object|null>} Department object or null
   */
  getDepartmentByCode: async (departmentCode) => {
    try {
      const departments = await departmentService.getAllDepartments();
      return departments.find(dept => 
        dept.departmentCode.toLowerCase() === departmentCode.toLowerCase()
      ) || null;
    } catch (error) {
      console.error('Error fetching department by code:', error);
      return null;
    }
  },

  /**
   * Get total employee count across all departments
   * @returns {Promise<number>} Total employee count
   */
  getTotalEmployeeCount: async () => {
    try {
      const departments = await departmentService.getAllDepartments();
      return departments.reduce((total, dept) => total + (dept.employeeCount || 0), 0);
    } catch (error) {
      console.error('Error calculating total employee count:', error);
      return 0;
    }
  },

  /**
   * Get departments sorted by employee count (descending)
   * @returns {Promise<Array>} Sorted departments
   */
  getDepartmentsByEmployeeCount: async () => {
    try {
      const departments = await departmentService.getAllDepartments();
      return departments.sort((a, b) => (b.employeeCount || 0) - (a.employeeCount || 0));
    } catch (error) {
      console.error('Error fetching departments by employee count:', error);
      return [];
    }
  },

  /**
   * Get department with most employees
   * @returns {Promise<Object|null>} Department with most employees
   */
  getLargestDepartment: async () => {
    try {
      const departments = await departmentService.getDepartmentsByEmployeeCount();
      return departments.length > 0 ? departments[0] : null;
    } catch (error) {
      console.error('Error fetching largest department:', error);
      return null;
    }
  },

  /**
   * Get department with least employees
   * @returns {Promise<Object|null>} Department with least employees
   */
  getSmallestDepartment: async () => {
    try {
      const departments = await departmentService.getDepartmentsByEmployeeCount();
      return departments.length > 0 ? departments[departments.length - 1] : null;
    } catch (error) {
      console.error('Error fetching smallest department:', error);
      return null;
    }
  },

  /**
   * Validate department data before submission
   * @param {Object} data - Department data to validate
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  validateDepartmentData: (data) => {
    const errors = {};

    if (!data.departmentName || data.departmentName.trim() === '') {
      errors.departmentName = 'Department name is required';
    }

    if (!data.departmentCode || data.departmentCode.trim() === '') {
      errors.departmentCode = 'Department code is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default departmentService;