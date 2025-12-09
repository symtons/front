// src/pages/leave/LeaveCalendar.jsx
// Simple, clean Leave Calendar - No hardcoding, real API data

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Alert,
  Chip,
  Tooltip
} from '@mui/material';
import {
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  CalendarMonth as CalendarIcon,
  Today as TodayIcon,
  Event as EventIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import { Loading } from '../../components/common';
import leaveService from '../../services/leaveService';
import { getLeaveTypeColor } from './models/leaveModels';

const LeaveCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [leaves, setLeaves] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [requestsRes, typesRes] = await Promise.all([
        leaveService.getMyRequests(),
        leaveService.getLeaveTypes()
      ]);
      
      setLeaves(Array.isArray(requestsRes) ? requestsRes : []);
      setLeaveTypes(Array.isArray(typesRes) ? typesRes : []);
      setLoading(false);
    } catch (err) {
      console.error('Calendar error:', err);
      setError(err.message || 'Failed to load calendar');
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => setCurrentDate(new Date());

  const getMonthTitle = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getLeavesForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return leaves.filter(leave => {
      const start = new Date(leave.startDate).toISOString().split('T')[0];
      const end = new Date(leave.endDate).toISOString().split('T')[0];
      return dateStr >= start && dateStr <= end && leave.status === 'Approved';
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const weeks = [];
    let week = new Array(startDay).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(new Date(year, month, day));
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }

    return (
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 2
        }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Typography key={day} align="center" sx={{ color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>
              {day.toUpperCase()}
            </Typography>
          ))}
        </Box>

        {/* Days */}
        <Box sx={{ p: 1 }}>
          {weeks.map((week, weekIdx) => (
            <Box key={weekIdx} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1 }}>
              {week.map((date, dayIdx) => {
                if (!date) return <Box key={dayIdx} />;
                
                const isToday = date.toDateString() === new Date().toDateString();
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const dayLeaves = getLeavesForDate(date);
                
                return (
                  <Tooltip key={dayIdx} title={dayLeaves.length > 0 ? `${dayLeaves.length} leave(s)` : ''} arrow>
                    <Card sx={{ 
                      minHeight: 100,
                      bgcolor: isToday ? 'rgba(102, 126, 234, 0.08)' : isWeekend ? '#fafafa' : 'white',
                      border: isToday ? '2px solid #667eea' : '1px solid #e0e0e0',
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': { boxShadow: 2, transform: 'translateY(-2px)' }
                    }}>
                      <CardContent sx={{ p: 1.5, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="h6" sx={{ 
                            fontWeight: isToday ? 700 : 600,
                            color: isToday ? '#667eea' : 'text.primary'
                          }}>
                            {date.getDate()}
                          </Typography>
                          {isToday && (
                            <Chip label="Today" size="small" sx={{ 
                              height: 20, 
                              fontSize: '0.65rem', 
                              fontWeight: 700,
                              bgcolor: '#667eea', 
                              color: 'white' 
                            }} />
                          )}
                        </Box>
                        
                        {dayLeaves.slice(0, 2).map((leave, idx) => (
                          <Box key={idx} sx={{
                            bgcolor: getLeaveTypeColor(leave.leaveType),
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            mb: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}>
                            <EventIcon sx={{ fontSize: 12 }} />
                            <Typography variant="caption" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {leave.leaveType}
                            </Typography>
                          </Box>
                        ))}
                        
                        {dayLeaves.length > 2 && (
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                            +{dayLeaves.length - 2} more
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Tooltip>
                );
              })}
            </Box>
          ))}
        </Box>
      </Paper>
    );
  };

  if (loading) return <Loading message="Loading calendar..." />;

  const approvedCount = leaves.filter(l => l.status === 'Approved').length;
  const pendingCount = leaves.filter(l => l.status === 'Pending').length;

  return (
    <Layout>
      <PageHeader
        icon={CalendarIcon}
        title="Leave Calendar"
        subtitle="View all scheduled and pending leave requests"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
          <Button size="small" onClick={fetchData} startIcon={<RefreshIcon />} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          {/* Navigation */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" onClick={handlePrevious} startIcon={<PrevIcon />} 
                  sx={{ color: '#667eea', borderColor: '#667eea' }}>
                  Previous
                </Button>
                <Button variant="contained" onClick={handleToday} startIcon={<TodayIcon />}
                  sx={{ bgcolor: '#667eea', '&:hover': { bgcolor: '#5568d3' } }}>
                  Today
                </Button>
                <Button variant="outlined" onClick={handleNext} endIcon={<NextIcon />}
                  sx={{ color: '#667eea', borderColor: '#667eea' }}>
                  Next
                </Button>
              </Box>
              
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                {getMonthTitle()}
              </Typography>
            </Box>
          </Paper>

          {/* Calendar */}
          {renderCalendar()}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          {/* Legend */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Leave Types</Typography>
            {leaveTypes.map(type => (
              <Box key={type.leaveTypeId} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ width: 20, height: 20, bgcolor: getLeaveTypeColor(type.typeName), borderRadius: 1 }} />
                <Typography variant="body2" sx={{ flex: 1, fontWeight: 600 }}>{type.typeName}</Typography>
                {type.isPaidLeave && (
                  <Chip label="Paid" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#4caf50', color: 'white' }} />
                )}
              </Box>
            ))}
          </Paper>

          {/* Stats */}
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', p: 3, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 700 }}>This Month</Typography>
              <Typography variant="h2" sx={{ fontWeight: 700, color: 'white' }}>{leaves.length}</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Leave Requests</Typography>
            </Box>
            
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 2, borderRadius: 1, bgcolor: 'rgba(76, 175, 80, 0.08)' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Approved</Typography>
                <Chip label={approvedCount} size="small" sx={{ bgcolor: '#4caf50', color: 'white', fontWeight: 700 }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderRadius: 1, bgcolor: 'rgba(253, 185, 78, 0.08)' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Pending</Typography>
                <Chip label={pendingCount} size="small" sx={{ bgcolor: '#FDB94E', color: 'white', fontWeight: 700 }} />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default LeaveCalendar;