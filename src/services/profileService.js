import api from './authService';

/**
 * Profile Service
 * Handles all API calls related to user profile management
 */

const profileService = {
  /**
   * Get current user's complete profile
   * GET /api/Profile/Me
   * @returns {Promise<Object>} Complete profile data
   */
  getMe: async () => {
    try {
      const response = await api.get('/Profile/Me');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to load profile');
    }
  },

  /**
   * Update contact information
   * PUT /api/Profile/UpdateContact
   * @param {Object} contactData - Contact information
   * @param {string} contactData.personalEmail - Personal email
   * @param {string} contactData.phoneNumber - Phone number
   * @param {string} contactData.address - Address
   * @param {string} contactData.city - City
   * @param {string} contactData.state - State
   * @param {string} contactData.zipCode - Zip code
   * @returns {Promise<Object>} Success message
   */
  updateContact: async (contactData) => {
    try {
      const response = await api.put('/Profile/UpdateContact', contactData);
      return response.data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw new Error(error.response?.data?.message || 'Failed to update contact information');
    }
  },

  /**
   * Update emergency contact information
   * PUT /api/Profile/UpdateEmergencyContact
   * @param {Object} emergencyData - Emergency contact information
   * @param {string} emergencyData.emergencyContactName - Contact name
   * @param {string} emergencyData.emergencyContactPhone - Contact phone
   * @param {string} emergencyData.emergencyContactRelationship - Relationship
   * @returns {Promise<Object>} Success message
   */
  updateEmergencyContact: async (emergencyData) => {
    try {
      const response = await api.put('/Profile/UpdateEmergencyContact', emergencyData);
      return response.data;
    } catch (error) {
      console.error('Error updating emergency contact:', error);
      throw new Error(error.response?.data?.message || 'Failed to update emergency contact');
    }
  },

  /**
   * Get banking information (masked)
   * GET /api/Profile/Banking
   * @returns {Promise<Object>} Banking data with masked account number
   */
  getBanking: async () => {
    try {
      const response = await api.get('/Profile/Banking');
      return response.data;
    } catch (error) {
      // Return null if no banking info exists (404 is expected)
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching banking:', error);
      throw new Error(error.response?.data?.message || 'Failed to load banking information');
    }
  },

  /**
   * Add or update banking information
   * POST /api/Profile/Banking
   * @param {Object} bankingData - Banking information
   * @param {string} bankingData.bankName - Bank name
   * @param {string} bankingData.accountType - Account type (Checking/Savings)
   * @param {string} bankingData.routingNumber - Routing number (9 digits)
   * @param {string} bankingData.accountNumber - Account number
   * @returns {Promise<Object>} Success message
   */
  updateBanking: async (bankingData) => {
    try {
      // Remove confirmAccountNumber before sending to API
      const { confirmAccountNumber, ...dataToSend } = bankingData;
      
      const response = await api.post('/Profile/Banking', dataToSend);
      return response.data;
    } catch (error) {
      console.error('Error updating banking:', error);
      throw new Error(error.response?.data?.message || 'Failed to update banking information');
    }
  },

  /**
   * Change password
   * POST /api/Profile/ChangePassword
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<Object>} Success message
   */
  changePassword: async (passwordData) => {
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...dataToSend } = passwordData;
      
      const response = await api.post('/Profile/ChangePassword', dataToSend);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }
};

export default profileService;