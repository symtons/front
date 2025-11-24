// src/pages/attendance/components/AttendanceCalendar.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Chip } from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today as TodayIcon
} from '@mui/icons-material';
import {
  formatMonthYear,
  generateCalendarDays,
  getStatusBackgroundColor,
  getStatusBorderColor,
  formatTime,
  getAttendanceStatusColor
} from '../models/attendanceModels';

const AttendanceCalendar = ({ attendanceData = [], onDateClick, currentDate, onDateChange }) => {
  const [date, setDate] = useState(currentDate || new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    if (currentDate) {
      setDate(currentDate);
    }
  }, [currentDate]);

  useEffect(() => {
    const days = generateCalendarDays(date.getFullYear(), date.getMonth(), attendanceData);
    setCalendarDays(days);
  }, [date, attendanceData]);

  const handlePreviousMonth = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    setDate(newDate);
    if (onDateChange) onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    setDate(newDate);
    if (onDateChange) onDateChange(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    setDate(today);
    if (onDateChange) onDateChange(today);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box>
      {/* Calendar Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          {formatMonthYear(date)}
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<TodayIcon />}
            onClick={handleToday}
          >
            Today
          </Button>
          <IconButton onClick={handlePreviousMonth} size="small">
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={handleNextMonth} size="small">
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      {/* Calendar Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 1
        }}
      >
        {/* Week day headers */}
        {weekDays.map((day) => (
          <Box
            key={day}
            sx={{
              p: 1,
              textAlign: 'center',
              fontWeight: 600,
              color: '#666',
              backgroundColor: '#f5f5f5',
              borderRadius: 1
            }}
          >
            {day}
          </Box>
        ))}

        {/* Calendar days */}
        {calendarDays.map((dayData, index) => {
          if (!dayData) {
            return <Box key={`empty-${index}`} sx={{ p: 1 }} />;
          }

          const { day, isToday, isWeekend, attendance } = dayData;
          const status = attendance?.status;

          return (
            <Box
              key={index}
              onClick={() => onDateClick && onDateClick(dayData)}
              sx={{
                p: 1.5,
                minHeight: 90,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: status ? getStatusBackgroundColor(status) : (isWeekend ? '#fafafa' : 'white'),
                borderLeft: status ? `4px solid ${getStatusBorderColor(status)}` : '1px solid #e0e0e0',
                cursor: onDateClick ? 'pointer' : 'default',
                transition: 'all 0.2s',
                position: 'relative',
                '&:hover': onDateClick ? {
                  boxShadow: 2,
                  transform: 'translateY(-2px)'
                } : {}
              }}
            >
              <Typography
                variant="body2"
                fontWeight={isToday ? 700 : 500}
                sx={{
                  color: isToday ? '#667eea' : '#333',
                  mb: 0.5
                }}
              >
                {day}
              </Typography>

              {status && (
                <Chip
                  label={status}
                  size="small"
                  color={getAttendanceStatusColor(status)}
                  sx={{
                    height: 20,
                    fontSize: '10px',
                    fontWeight: 600
                  }}
                />
              )}

              {attendance?.clockInTime && (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    color: '#666',
                    fontSize: '10px'
                  }}
                >
                  In: {formatTime(attendance.clockInTime)}
                </Typography>
              )}

              {attendance?.clockOutTime && (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: '#666',
                    fontSize: '10px'
                  }}
                >
                  Out: {formatTime(attendance.clockOutTime)}
                </Typography>
              )}

              {isToday && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#667eea'
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          Legend:
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip label="Present" size="small" color="success" />
          <Chip label="Absent" size="small" color="error" />
          <Chip label="Late" size="small" color="warning" />
          <Chip label="Leave" size="small" color="info" />
          <Chip label="Half Day" size="small" color="secondary" />
        </Box>
      </Box>
    </Box>
  );
};

export default AttendanceCalendar;
