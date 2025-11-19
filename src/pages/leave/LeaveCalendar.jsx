// src/pages/leave/LeaveCalendar.jsx
// Calendar view of all leave requests - CONNECTED TO API

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Chip,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Divider
} from '@mui/material';
import {
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  CalendarMonth as CalendarIcon,
  ViewWeek as WeekIcon,
  ViewDay as DayIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import {
  getLeaveTypeColor,
  getLeaveTypeIcon,
  formatDate
} from './models/leaveModels';
import leaveService from '../../services/leaveService';
import { authService } from '../../services/authService';

const LeaveCalendar = () => {
  const navigate = useNavigate();

  // Get current user
  const [currentUser, setCurrentUser] = useState(null);
  const [employee, setEmployee] = useState(null);

  // View mode
  const [viewMode, setViewMode] = useState('month'); // month, week, day

  // Current date for navigation
  const [currentDate, setCurrentDate] = useState(new Date());

  // Leave data
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Leave types for legend
  const [leaveTypes, setLeaveTypes] = useState([]);

  // Load current user on mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    const empData = JSON.parse(localStorage.getItem('employee'));
    
    if (user && empData) {
      setCurrentUser(user);
      setEmployee(empData);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Load leave data when date or view changes
  useEffect(() => {
    if (employee) {
      fetchLeaveData();
      fetchLeaveTypes();
    }
  }, [currentDate, viewMode, employee]);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range based on view mode
      let startDate, endDate;
      
      if (viewMode === 'month') {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      } else if (viewMode === 'week') {
        const day = currentDate.getDay();
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - day);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
      } else {
        startDate = new Date(currentDate);
        endDate = new Date(currentDate);
      }

      // Format dates for API
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // ✅ REAL API CALL
      const response = await leaveService.getLeaveCalendar(startDateStr, endDateStr);
      
      setLeaves(response);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching leave calendar:', error);
      setError('Failed to load calendar. Please try again.');
      setLoading(false);
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      // ✅ REAL API CALL
      const response = await leaveService.getLeaveTypes();
      setLeaveTypes(response);
    } catch (error) {
      console.error('Error fetching leave types:', error);
    }
  };

  // Navigation
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Get title based on view mode
  const getViewTitle = () => {
    const options = viewMode === 'month' 
      ? { month: 'long', year: 'numeric' }
      : viewMode === 'week'
      ? { month: 'short', day: 'numeric', year: 'numeric' }
      : { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    
    return currentDate.toLocaleDateString('en-US', options);
  };

  // Get leaves for a specific date
  const getLeavesForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return leaves.filter(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const checkDate = new Date(dateStr);
      return checkDate >= start && checkDate <= end;
    });
  };

  // Render simple month view
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const weeks = [];
    let currentWeek = [];

    // Fill empty days at start
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Fill days of month
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(new Date(year, month, day));
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill remaining days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return (
      <Paper sx={{ p: 2 }}>
        {/* Weekday Headers */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Grid item xs key={day}>
              <Typography 
                variant="subtitle2" 
                align="center" 
                sx={{ fontWeight: 600, color: 'text.secondary' }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Days */}
        {weeks.map((week, weekIndex) => (
          <Grid container spacing={1} key={weekIndex} sx={{ mb: 1 }}>
            {week.map((date, dayIndex) => {
              const isToday = date && date.toDateString() === new Date().toDateString();
              const dayLeaves = date ? getLeavesForDate(date) : [];
              
              return (
                <Grid item xs key={dayIndex}>
                  <Card 
                    sx={{ 
                      minHeight: 100,
                      bgcolor: date ? 'white' : 'grey.50',
                      border: isToday ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      cursor: date ? 'pointer' : 'default',
                      '&:hover': date ? {
                        boxShadow: 2,
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s'
                      } : {}
                    }}
                  >
                    <CardContent sx={{ p: 1 }}>
                      {date && (
                        <>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: isToday ? 700 : 400,
                              color: isToday ? 'primary.main' : 'text.primary',
                              mb: 0.5
                            }}
                          >
                            {date.getDate()}
                          </Typography>
                          
                          {/* Leave indicators */}
                          {dayLeaves.map((leave, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                bgcolor: getLeaveTypeColor(leave.leaveType),
                                color: 'white',
                                px: 0.5,
                                py: 0.25,
                                mb: 0.5,
                                borderRadius: 0.5,
                                fontSize: '0.65rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {getLeaveTypeIcon(leave.leaveType)} {leave.employeeName || leave.employee?.firstName}
                            </Box>
                          ))}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ))}
      </Paper>
    );
  };

  // Render list view for week/day
  const renderListView = () => {
    return (
      <Paper sx={{ p: 3 }}>
        {loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && leaves.length === 0 && (
          <Alert severity="info">
            No leaves scheduled for this {viewMode}.
          </Alert>
        )}

        {!loading && leaves.length > 0 && (
          <Box>
            {leaves.map(leave => (
              <Card key={leave.leaveRequestId} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                      sx={{ 
                        width: 4, 
                        height: 60, 
                        bgcolor: getLeaveTypeColor(leave.leaveType),
                        borderRadius: 1
                      }} 
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="h6">
                          {getLeaveTypeIcon(leave.leaveType)} {leave.leaveType}
                        </Typography>
                        <Chip 
                          label={leave.status} 
                          size="small"
                          color={leave.status === 'Approved' ? 'success' : 'warning'}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        <strong>{leave.employeeName || leave.employee?.firstName}</strong> • {formatDate(leave.startDate)} - {formatDate(leave.endDate)} ({leave.totalDays} days)
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>
    );
  };

  if (!employee) {
    return (
      <Layout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <CircularProgress />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Leave Calendar
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View all scheduled and pending leave requests
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Main Calendar Area */}
          <Grid item xs={12} md={9}>
            {/* Calendar Controls */}
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                {/* Navigation */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PrevIcon />}
                    onClick={handlePrevious}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleToday}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<NextIcon />}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </Box>

                {/* Current View Title */}
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {getViewTitle()}
                </Typography>

                {/* View Mode Toggle */}
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newMode) => newMode && setViewMode(newMode)}
                  size="small"
                >
                  <ToggleButton value="month">
                    <CalendarIcon sx={{ mr: 0.5 }} fontSize="small" />
                    Month
                  </ToggleButton>
                  <ToggleButton value="week">
                    <WeekIcon sx={{ mr: 0.5 }} fontSize="small" />
                    Week
                  </ToggleButton>
                  <ToggleButton value="day">
                    <DayIcon sx={{ mr: 0.5 }} fontSize="small" />
                    Day
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Paper>

            {/* Error State */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Calendar View */}
            {viewMode === 'month' ? renderMonthView() : renderListView()}
          </Grid>

          {/* Right Sidebar - Legend & Info */}
          <Grid item xs={12} md={3}>
            {/* Legend */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Leave Types
              </Typography>
              {leaveTypes.map(type => (
                <Box 
                  key={type.leaveTypeId} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: 1.5 
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 16, 
                      height: 16, 
                      bgcolor: type.color, 
                      borderRadius: 1 
                    }} 
                  />
                  <Typography variant="body2">
                    {getLeaveTypeIcon(type.typeName)} {type.typeName}
                  </Typography>
                </Box>
              ))}
            </Paper>

            {/* Quick Stats */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                This {viewMode === 'month' ? 'Month' : viewMode === 'week' ? 'Week' : 'Day'}
              </Typography>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1, mb: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  {leaves.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Leave Requests
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Approved:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {leaves.filter(l => l.status === 'Approved').length}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Pending:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {leaves.filter(l => l.status === 'Pending').length}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default LeaveCalendar;