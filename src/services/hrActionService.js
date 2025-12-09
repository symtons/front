// src/services/hrActionService.js
// UPDATED: Added getAllRequests for HR dashboard

import api from './authService';

const hrActionService = {
  // Get action types
  getActionTypes: async () => {
    try {
      const response = await api.get('/HRAction/ActionTypes');
      return response.data;
    } catch (error) {
      console.error('Error fetching action types:', error);
      throw new Error(error.response?.data?.message || 'Failed to load action types');
    }
  },

  // Submit new request
  submitRequest: async (requestData) => {
    try {
      const cleanString = (value) => {
        if (value === null || value === undefined || value === '') {
          return null;
        }
        return String(value).trim();
      };

      const cleanRequiredString = (value) => {
        if (value === null || value === undefined) {
          return '';
        }
        return String(value).trim();
      };

      const payload = {
        actionTypeId: requestData.actionTypeId,
        effectiveDate: requestData.effectiveDate || 
                      requestData.insuranceEffectiveDate || 
                      requestData.deductionStartDate || 
                      requestData.leaveStartDate || 
                      null,
        reason: cleanRequiredString(requestData.reason),
        notes: cleanString(requestData.notes),

        // Rate Change
        oldRate: requestData.oldRate || null,
        newRate: requestData.newRate || null,
        oldRateType: cleanString(requestData.oldRateType),
        newRateType: cleanString(requestData.newRateType),
        premiumIncentive: cleanString(requestData.premiumOrIncentive || requestData.premiumIncentive),

        // Transfer
        oldDepartmentId: requestData.oldDepartmentId || null,
        newDepartmentId: requestData.newDepartmentId || null,
        oldLocation: cleanString(requestData.oldLocation),
        newLocation: cleanString(requestData.newLocation),
        oldSupervisorId: requestData.oldSupervisorId || null,
        newSupervisorId: requestData.newSupervisorId || null,
        oldClassification: cleanString(requestData.oldClassification),
        newClassification: cleanString(requestData.newClassification),

        // Promotion
        oldJobTitle: cleanString(requestData.oldJobTitle),
        newJobTitle: cleanString(requestData.newJobTitle),

        // Status Change
        oldEmploymentType: cleanString(requestData.oldEmploymentType),
        newEmploymentType: cleanString(requestData.newEmploymentType),
        oldMaritalStatus: cleanString(requestData.oldMaritalStatus),
        newMaritalStatus: cleanString(requestData.newMaritalStatus),

        // Personal Info
        oldFirstName: cleanString(requestData.oldFirstName),
        newFirstName: cleanString(requestData.newFirstName),
        oldLastName: cleanString(requestData.oldLastName),
        newLastName: cleanString(requestData.newLastName),
        oldAddress: cleanString(requestData.oldAddress),
        newAddress: cleanString(requestData.newAddress),
        oldPhone: cleanString(requestData.oldPhone),
        newPhone: cleanString(requestData.newPhone),
        oldEmail: cleanString(requestData.oldEmail),
        newEmail: cleanString(requestData.newEmail),

        // Insurance
        healthInsuranceChange: cleanString(requestData.healthInsuranceChange),
        dentalInsuranceChange: cleanString(requestData.dentalInsuranceChange),
        retirement403bEnroll: requestData.retirement403bEnroll === true,

        // Payroll Deduction
        payrollDeductionDescription: cleanString(requestData.payrollDeductionDescription),
        payrollDeductionAmount: requestData.payrollDeductionAmount || null,

        // Leave of Absence
        leaveType: cleanString(requestData.leaveType),
        leaveStartDate: requestData.leaveStartDate || null,
        leaveEndDate: requestData.leaveEndDate || null,
        leaveDays: requestData.leaveDays || null
      };

      if (!payload.reason || payload.reason.trim() === '') {
        throw new Error('Reason is required and cannot be empty');
      }

      console.log('📤 Submitting HR Action Request:', payload);

      const response = await api.post('/HRAction/Submit', payload);

      console.log('✅ Submit Response:', response.data);

      return response.data;
    } catch (error) {
      console.error('❌ Submit Error:', error);
      console.error('❌ Error Response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to submit request';
      
      throw new Error(errorMessage);
    }
  },

  // ✅ NEW: Get ALL requests (for HR dashboard - includes Pending, Approved, Rejected)
  getAllRequests: async () => {
    try {
      const response = await api.get('/HRAction/AllRequests');
      return response.data;
    } catch (error) {
      console.error('Error fetching all requests:', error);
      throw new Error(error.response?.data?.message || 'Failed to load all requests');
    }
  },

  // Get pending requests for review (HR/Admin only)
  getPendingReview: async () => {
    try {
      const response = await api.get('/HRAction/PendingReview');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      throw new Error(error.response?.data?.message || 'Failed to load pending requests');
    }
  },

  // Get my requests (employee view)
  getMyRequests: async () => {
    try {
      const response = await api.get('/HRAction/MyRequests');
      return response.data;
    } catch (error) {
      console.error('Error fetching my requests:', error);
      throw new Error(error.response?.data?.message || 'Failed to load your requests');
    }
  },

  // Get request details by ID
  getRequestDetails: async (requestId) => {
    try {
      const response = await api.get(`/HRAction/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching request details:', error);
      throw new Error(error.response?.data?.message || 'Failed to load request details');
    }
  },

  // Approve request
  approveRequest: async (requestId, comments) => {
    try {
      const response = await api.post(`/HRAction/Approve/${requestId}`, {
        comments: comments || null
      });
      return response.data;
    } catch (error) {
      console.error('Error approving request:', error);
      throw new Error(error.response?.data?.message || 'Failed to approve request');
    }
  },

  // Reject request
  rejectRequest: async (requestId, rejectionReason) => {
    try {
      const response = await api.post(`/HRAction/Reject/${requestId}`, {
        rejectionReason: rejectionReason || 'No reason provided'
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting request:', error);
      throw new Error(error.response?.data?.message || 'Failed to reject request');
    }
  }
};

export default hrActionService;