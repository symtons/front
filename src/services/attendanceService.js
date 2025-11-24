// src/services/attendanceService.js
import api from './authService';

/**
 * Attendance Service
 * Handles all API calls for Time & Attendance module
 */

const attendanceService = {

  // ============================================
  // TIME ENTRY (Clock In/Out)
  // ============================================

  /**
   * Clock in
   * POST /api/TimeEntry/ClockIn
   */
  clockIn: async (location = null, notes = null) => {
    try {
      const response = await api.post('/TimeEntry/ClockIn', {
        location,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to clock in' };
    }
  },

  /**
   * Clock out
   * POST /api/TimeEntry/ClockOut
   */
  clockOut: async (location = null, breakMinutes = null) => {
    try {
      const response = await api.post('/TimeEntry/ClockOut', {
        location,
        breakMinutes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to clock out' };
    }
  },

  /**
   * Get current clock status
   * GET /api/TimeEntry/CurrentStatus
   */
  getCurrentStatus: async () => {
    try {
      const response = await api.get('/TimeEntry/CurrentStatus');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get status' };
    }
  },

  /**
   * Get my time entries
   * GET /api/TimeEntry/MyEntries
   */
  getMyTimeEntries: async (startDate = null, endDate = null) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get('/TimeEntry/MyEntries', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load time entries' };
    }
  },

  /**
   * Get all time entries (Admin)
   * GET /api/TimeEntry/All
   */
  getAllTimeEntries: async (filters = {}) => {
    try {
      const response = await api.get('/TimeEntry/All', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load time entries' };
    }
  },

  // ============================================
  // ATTENDANCE
  // ============================================

  /**
   * Get my attendance
   * GET /api/Attendance/MyAttendance
   */
  getMyAttendance: async (startDate = null, endDate = null) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get('/Attendance/MyAttendance', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load attendance' };
    }
  },

  /**
   * Get all attendance (Admin)
   * GET /api/Attendance/All
   */
  getAllAttendance: async (filters = {}) => {
    try {
      const response = await api.get('/Attendance/All', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load attendance' };
    }
  },

  /**
   * Get attendance summary
   * GET /api/Attendance/Summary
   */
  getAttendanceSummary: async (startDate = null, endDate = null, departmentId = null) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (departmentId) params.departmentId = departmentId;

      const response = await api.get('/Attendance/Summary', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load summary' };
    }
  },

  /**
   * Get daily attendance report
   * GET /api/Attendance/DailyReport
   */
  getDailyReport: async (date = null) => {
    try {
      const params = {};
      if (date) params.date = date;

      const response = await api.get('/Attendance/DailyReport', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load daily report' };
    }
  },

  /**
   * Mark attendance manually (Manager)
   * POST /api/Attendance/Mark
   */
  markAttendance: async (employeeId, attendanceDate, status, remarks = null) => {
    try {
      const response = await api.post('/Attendance/Mark', {
        employeeId,
        attendanceDate,
        status,
        remarks
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark attendance' };
    }
  },

  // ============================================
  // SHIFTS
  // ============================================

  /**
   * Get all shifts
   * GET /api/Shift
   */
  getAllShifts: async (activeOnly = true) => {
    try {
      const response = await api.get('/Shift', { params: { activeOnly } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load shifts' };
    }
  },

  /**
   * Get my current shift
   * GET /api/Shift/MyShift
   */
  getMyShift: async () => {
    try {
      const response = await api.get('/Shift/MyShift');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load shift' };
    }
  },

  /**
   * Create shift (Admin)
   * POST /api/Shift
   */
  createShift: async (shiftData) => {
    try {
      const response = await api.post('/Shift', shiftData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create shift' };
    }
  },

  /**
   * Update shift (Admin)
   * PUT /api/Shift/{id}
   */
  updateShift: async (id, shiftData) => {
    try {
      const response = await api.put(`/Shift/${id}`, shiftData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update shift' };
    }
  },

  /**
   * Assign shift to employee
   * POST /api/Shift/Assign
   */
  assignShift: async (employeeId, shiftId, effectiveDate) => {
    try {
      const response = await api.post('/Shift/Assign', {
        employeeId,
        shiftId,
        effectiveDate
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to assign shift' };
    }
  },

  /**
   * Get all shift assignments (Admin)
   * GET /api/Shift/Assignments
   */
  getAllShiftAssignments: async (departmentId = null, activeOnly = true) => {
    try {
      const params = { activeOnly };
      if (departmentId) params.departmentId = departmentId;

      const response = await api.get('/Shift/Assignments', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load assignments' };
    }
  },

  // ============================================
  // TIMESHEETS
  // ============================================

  /**
   * Get my timesheets
   * GET /api/Timesheet/MyTimesheets
   */
  getMyTimesheets: async () => {
    try {
      const response = await api.get('/Timesheet/MyTimesheets');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load timesheets' };
    }
  },

  /**
   * Get timesheet by ID
   * GET /api/Timesheet/{id}
   */
  getTimesheetById: async (id) => {
    try {
      const response = await api.get(`/Timesheet/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load timesheet' };
    }
  },

  /**
   * Generate timesheet from time entries
   * POST /api/Timesheet/Generate
   */
  generateTimesheet: async (startDate, endDate) => {
    try {
      const response = await api.post('/Timesheet/Generate', {
        startDate,
        endDate
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate timesheet' };
    }
  },

  /**
   * Submit timesheet
   * POST /api/Timesheet/{id}/Submit
   */
  submitTimesheet: async (id) => {
    try {
      const response = await api.post(`/Timesheet/${id}/Submit`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit timesheet' };
    }
  },

  /**
   * Approve timesheet (Manager)
   * POST /api/Timesheet/{id}/Approve
   */
  approveTimesheet: async (id) => {
    try {
      const response = await api.post(`/Timesheet/${id}/Approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to approve timesheet' };
    }
  },

  /**
   * Reject timesheet (Manager)
   * POST /api/Timesheet/{id}/Reject
   */
  rejectTimesheet: async (id, reason) => {
    try {
      const response = await api.post(`/Timesheet/${id}/Reject`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject timesheet' };
    }
  },

  /**
   * Get pending timesheets (Manager)
   * GET /api/Timesheet/Pending
   */
  getPendingTimesheets: async () => {
    try {
      const response = await api.get('/Timesheet/Pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load pending timesheets' };
    }
  },

  // ============================================
  // OVERTIME
  // ============================================

  /**
   * Get my overtime requests
   * GET /api/Overtime/MyRequests
   */
  getMyOvertimeRequests: async () => {
    try {
      const response = await api.get('/Overtime/MyRequests');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load overtime requests' };
    }
  },

  /**
   * Create overtime request
   * POST /api/Overtime
   */
  createOvertimeRequest: async (overtimeDate, startTime, endTime, reason = null) => {
    try {
      const response = await api.post('/Overtime', {
        overtimeDate,
        startTime,
        endTime,
        reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create overtime request' };
    }
  },

  /**
   * Get pending overtime requests (Manager)
   * GET /api/Overtime/Pending
   */
  getPendingOvertimeRequests: async (departmentId = null) => {
    try {
      const params = {};
      if (departmentId) params.departmentId = departmentId;

      const response = await api.get('/Overtime/Pending', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load pending overtime requests' };
    }
  },

  /**
   * Approve overtime request (Manager)
   * POST /api/Overtime/{id}/Approve
   */
  approveOvertimeRequest: async (id, comments = null) => {
    try {
      const response = await api.post(`/Overtime/${id}/Approve`, { comments });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to approve overtime request' };
    }
  },

  /**
   * Reject overtime request (Manager)
   * POST /api/Overtime/{id}/Reject
   */
  rejectOvertimeRequest: async (id, comments) => {
    try {
      const response = await api.post(`/Overtime/${id}/Reject`, { comments });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject overtime request' };
    }
  },

  /**
   * Get overtime summary (Admin)
   * GET /api/Overtime/Summary
   */
  getOvertimeSummary: async (startDate = null, endDate = null, departmentId = null) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (departmentId) params.departmentId = departmentId;

      const response = await api.get('/Overtime/Summary', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to load overtime summary' };
    }
  }
};

export default attendanceService;
