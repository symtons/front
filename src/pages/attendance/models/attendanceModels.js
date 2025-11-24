// src/pages/attendance/models/attendanceModels.js

// =============================================
// CONSTANTS
// =============================================

export const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  LATE: 'Late',
  LEAVE: 'Leave',
  HALF_DAY: 'HalfDay',
  HOLIDAY: 'Holiday'
};

export const TIME_ENTRY_STATUS = {
  OPEN: 'Open',
  CLOSED: 'Closed',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

export const OVERTIME_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

export const TIMESHEET_STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

// =============================================
// STATUS COLORS
// =============================================

export const getAttendanceStatusColor = (status) => {
  const colorMap = {
    [ATTENDANCE_STATUS.PRESENT]: 'success',
    [ATTENDANCE_STATUS.ABSENT]: 'error',
    [ATTENDANCE_STATUS.LATE]: 'warning',
    [ATTENDANCE_STATUS.LEAVE]: 'info',
    [ATTENDANCE_STATUS.HALF_DAY]: 'secondary',
    [ATTENDANCE_STATUS.HOLIDAY]: 'default'
  };
  return colorMap[status] || 'default';
};

export const getTimeEntryStatusColor = (status) => {
  const colorMap = {
    [TIME_ENTRY_STATUS.OPEN]: 'warning',
    [TIME_ENTRY_STATUS.CLOSED]: 'info',
    [TIME_ENTRY_STATUS.APPROVED]: 'success',
    [TIME_ENTRY_STATUS.REJECTED]: 'error'
  };
  return colorMap[status] || 'default';
};

export const getOvertimeStatusColor = (status) => {
  const colorMap = {
    [OVERTIME_STATUS.PENDING]: 'warning',
    [OVERTIME_STATUS.APPROVED]: 'success',
    [OVERTIME_STATUS.REJECTED]: 'error'
  };
  return colorMap[status] || 'default';
};

export const getTimesheetStatusColor = (status) => {
  const colorMap = {
    [TIMESHEET_STATUS.DRAFT]: 'default',
    [TIMESHEET_STATUS.SUBMITTED]: 'info',
    [TIMESHEET_STATUS.APPROVED]: 'success',
    [TIMESHEET_STATUS.REJECTED]: 'error'
  };
  return colorMap[status] || 'default';
};

// =============================================
// STATUS BACKGROUND COLORS (for calendar)
// =============================================

export const getStatusBackgroundColor = (status) => {
  const colorMap = {
    [ATTENDANCE_STATUS.PRESENT]: '#e8f5e9',
    [ATTENDANCE_STATUS.ABSENT]: '#ffebee',
    [ATTENDANCE_STATUS.LATE]: '#fff3e0',
    [ATTENDANCE_STATUS.LEAVE]: '#e3f2fd',
    [ATTENDANCE_STATUS.HALF_DAY]: '#f3e5f5',
    [ATTENDANCE_STATUS.HOLIDAY]: '#f5f5f5'
  };
  return colorMap[status] || '#ffffff';
};

export const getStatusBorderColor = (status) => {
  const colorMap = {
    [ATTENDANCE_STATUS.PRESENT]: '#4caf50',
    [ATTENDANCE_STATUS.ABSENT]: '#f44336',
    [ATTENDANCE_STATUS.LATE]: '#ff9800',
    [ATTENDANCE_STATUS.LEAVE]: '#2196f3',
    [ATTENDANCE_STATUS.HALF_DAY]: '#9c27b0',
    [ATTENDANCE_STATUS.HOLIDAY]: '#9e9e9e'
  };
  return colorMap[status] || '#e0e0e0';
};

// =============================================
// FILTER OPTIONS
// =============================================

export const ATTENDANCE_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: ATTENDANCE_STATUS.PRESENT, label: 'Present' },
  { value: ATTENDANCE_STATUS.ABSENT, label: 'Absent' },
  { value: ATTENDANCE_STATUS.LATE, label: 'Late' },
  { value: ATTENDANCE_STATUS.LEAVE, label: 'Leave' },
  { value: ATTENDANCE_STATUS.HALF_DAY, label: 'Half Day' }
];

export const TIME_ENTRY_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: TIME_ENTRY_STATUS.OPEN, label: 'Open' },
  { value: TIME_ENTRY_STATUS.CLOSED, label: 'Closed' },
  { value: TIME_ENTRY_STATUS.APPROVED, label: 'Approved' },
  { value: TIME_ENTRY_STATUS.REJECTED, label: 'Rejected' }
];

export const REPORT_TYPE_OPTIONS = [
  { value: 'summary', label: 'Summary Report' },
  { value: 'daily', label: 'Daily Report' },
  { value: 'detailed', label: 'Detailed Report' }
];

export const DATE_RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'custom', label: 'Custom Range' }
];

// =============================================
// FORMATTING HELPERS
// =============================================

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (dateTimeString) => {
  if (!dateTimeString) return '-';
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDuration = (hours) => {
  if (!hours && hours !== 0) return '-';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

export const formatHours = (hours) => {
  if (!hours && hours !== 0) return '0';
  return hours.toFixed(2);
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export const formatMonthYear = (date) => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

// =============================================
// CALCULATION HELPERS
// =============================================

export const calculateDuration = (startTime, endTime = null) => {
  if (!startTime) return '0h 0m';
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const diff = end - start;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export const calculateAttendanceRate = (presentDays, totalDays) => {
  if (!totalDays || totalDays === 0) return 0;
  return ((presentDays / totalDays) * 100).toFixed(1);
};

export const calculateAverageHours = (totalHours, totalDays) => {
  if (!totalDays || totalDays === 0) return 0;
  return (totalHours / totalDays).toFixed(1);
};

// =============================================
// VALIDATION HELPERS
// =============================================

export const isLate = (clockInTime, shiftStartTime, graceMinutes = 15) => {
  if (!clockInTime || !shiftStartTime) return false;

  const clockIn = new Date(clockInTime);
  const shiftStart = new Date(shiftStartTime);

  const diff = (clockIn - shiftStart) / (1000 * 60); // difference in minutes
  return diff > graceMinutes;
};

export const calculateLateMinutes = (clockInTime, shiftStartTime) => {
  if (!clockInTime || !shiftStartTime) return 0;

  const clockIn = new Date(clockInTime);
  const shiftStart = new Date(shiftStartTime);

  const diff = (clockIn - shiftStart) / (1000 * 60);
  return Math.max(0, Math.round(diff));
};

export const validateTimeEntry = (clockInTime, clockOutTime) => {
  const errors = {};

  if (!clockInTime) {
    errors.clockInTime = 'Clock in time is required';
  }

  if (clockOutTime) {
    const clockIn = new Date(clockInTime);
    const clockOut = new Date(clockOutTime);

    if (clockOut <= clockIn) {
      errors.clockOutTime = 'Clock out time must be after clock in time';
    }

    const diff = (clockOut - clockIn) / (1000 * 60 * 60);
    if (diff > 24) {
      errors.clockOutTime = 'Duration cannot exceed 24 hours';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// =============================================
// DATA TRANSFORMATION HELPERS
// =============================================

export const transformAttendanceForDisplay = (attendance) => {
  return {
    ...attendance,
    attendanceDateFormatted: formatDate(attendance.attendanceDate),
    clockInTimeFormatted: formatTime(attendance.clockInTime),
    clockOutTimeFormatted: formatTime(attendance.clockOutTime),
    workingHoursFormatted: formatHours(attendance.workingHours || 0),
    statusColor: getAttendanceStatusColor(attendance.status),
    isLateDisplay: attendance.isLate ? `${attendance.lateMinutes} min` : '-'
  };
};

export const transformTimeEntryForDisplay = (entry) => {
  return {
    ...entry,
    workDateFormatted: formatDate(entry.workDate),
    clockInTimeFormatted: formatTime(entry.clockInTime),
    clockOutTimeFormatted: formatTime(entry.clockOutTime),
    totalHoursFormatted: formatHours(entry.totalHours || 0),
    regularHoursFormatted: formatHours(entry.regularHours || 0),
    overtimeHoursFormatted: formatHours(entry.overtimeHours || 0),
    statusColor: getTimeEntryStatusColor(entry.status),
    durationLive: entry.clockOutTime ? null : calculateDuration(entry.clockInTime)
  };
};

export const transformShiftForDisplay = (shift) => {
  return {
    ...shift,
    workingHoursDisplay: `${shift.workingHours} hours`,
    scheduleDisplay: `${shift.startTime} - ${shift.endTime}`,
    graceDisplay: `${shift.gracePeriodMinutes || 15} minutes`,
    breakDisplay: `${shift.breakDuration || 0} minutes`
  };
};

// =============================================
// DATE UTILITIES
// =============================================

export const getDateRangeForFilter = (filterType) => {
  const now = new Date();
  let startDate, endDate;

  switch (filterType) {
    case 'today':
      startDate = new Date(now);
      endDate = new Date(now);
      break;

    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      endDate = new Date(now);
      break;

    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now);
      break;

    case 'lastMonth':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      break;

    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now);
  }

  return {
    startDate: formatDateForInput(startDate),
    endDate: formatDateForInput(endDate)
  };
};

export const getMonthStartEnd = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  return {
    startDate: new Date(year, month, 1),
    endDate: new Date(year, month + 1, 0)
  };
};

export const generateCalendarDays = (year, month, attendanceData = []) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = formatDateForInput(date);
    const attendanceRecord = attendanceData.find(
      (a) => formatDateForInput(a.attendanceDate) === dateString
    );

    days.push({
      day,
      date: dateString,
      fullDate: date,
      isToday: dateString === formatDateForInput(new Date()),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      attendance: attendanceRecord ? transformAttendanceForDisplay(attendanceRecord) : null
    });
  }

  return days;
};

// =============================================
// STATISTICS HELPERS
// =============================================

export const calculateAttendanceStats = (attendanceData = []) => {
  const stats = {
    totalDays: attendanceData.length,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    leaveDays: 0,
    halfDays: 0,
    totalHours: 0,
    totalLateMinutes: 0
  };

  attendanceData.forEach(record => {
    switch (record.status) {
      case ATTENDANCE_STATUS.PRESENT:
        stats.presentDays++;
        break;
      case ATTENDANCE_STATUS.ABSENT:
        stats.absentDays++;
        break;
      case ATTENDANCE_STATUS.LATE:
        stats.lateDays++;
        stats.presentDays++; // Late is still present
        break;
      case ATTENDANCE_STATUS.LEAVE:
        stats.leaveDays++;
        break;
      case ATTENDANCE_STATUS.HALF_DAY:
        stats.halfDays++;
        break;
      default:
        break;
    }

    if (record.workingHours) {
      stats.totalHours += record.workingHours;
    }

    if (record.isLate && record.lateMinutes) {
      stats.totalLateMinutes += record.lateMinutes;
    }
  });

  stats.attendanceRate = calculateAttendanceRate(stats.presentDays, stats.totalDays);
  stats.averageHoursPerDay = calculateAverageHours(stats.totalHours, stats.presentDays);

  return stats;
};

export const getAttendanceStatusIcon = (status) => {
  // Return icon name (to be imported in components)
  const iconMap = {
    [ATTENDANCE_STATUS.PRESENT]: 'CheckCircle',
    [ATTENDANCE_STATUS.ABSENT]: 'Cancel',
    [ATTENDANCE_STATUS.LATE]: 'AccessTime',
    [ATTENDANCE_STATUS.LEAVE]: 'EventBusy',
    [ATTENDANCE_STATUS.HALF_DAY]: 'Schedule',
    [ATTENDANCE_STATUS.HOLIDAY]: 'Event'
  };
  return iconMap[status] || 'Info';
};

// =============================================
// EXPORT ALL
// =============================================

export default {
  // Constants
  ATTENDANCE_STATUS,
  TIME_ENTRY_STATUS,
  OVERTIME_STATUS,
  TIMESHEET_STATUS,

  // Status colors
  getAttendanceStatusColor,
  getTimeEntryStatusColor,
  getOvertimeStatusColor,
  getTimesheetStatusColor,
  getStatusBackgroundColor,
  getStatusBorderColor,

  // Filter options
  ATTENDANCE_STATUS_OPTIONS,
  TIME_ENTRY_STATUS_OPTIONS,
  REPORT_TYPE_OPTIONS,
  DATE_RANGE_OPTIONS,

  // Formatting
  formatDate,
  formatDateTime,
  formatTime,
  formatDuration,
  formatHours,
  formatDateForInput,
  formatMonthYear,
  formatShortDate,

  // Calculations
  calculateDuration,
  calculateAttendanceRate,
  calculateAverageHours,
  isLate,
  calculateLateMinutes,

  // Validation
  validateTimeEntry,

  // Transformation
  transformAttendanceForDisplay,
  transformTimeEntryForDisplay,
  transformShiftForDisplay,

  // Date utilities
  getDateRangeForFilter,
  getMonthStartEnd,
  generateCalendarDays,

  // Statistics
  calculateAttendanceStats,
  getAttendanceStatusIcon
};
