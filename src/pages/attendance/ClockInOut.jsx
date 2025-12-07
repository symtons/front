// src/pages/attendance/ClockInOut.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Divider,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import {
  AccessTime as ClockIcon,
  Login as ClockInIcon,
  Logout as ClockOutIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import Loading from '../../components/common//feedback/Loading';
import attendanceService from '../../services/attendanceService';
import {
  formatTime,
  formatDate,
  formatHours
} from './models/attendanceModels';

const ClockInOut = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Current status
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  
  // Live timer
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveElapsed, setLiveElapsed] = useState('0h 0m');
  
  // Recent activity
  const [recentActivity, setRecentActivity] = useState([]);
  
  // Manual entry dialog
  const [manualEntryOpen, setManualEntryOpen] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    workDate: new Date().toISOString().split('T')[0],
    clockInTime: '',
    clockOutTime: '',
    breakMinutes: 0,
    notes: ''
  });

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  // Fetch status on mount
  useEffect(() => {
    fetchCurrentStatus();
    fetchRecentActivity();
  }, []);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Update live elapsed time if clocked in
      if (isClockedIn && currentEntry?.clockInTime) {
        const start = new Date(currentEntry.clockInTime);
        const now = new Date();
        const diffMs = now - start;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setLiveElapsed(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isClockedIn, currentEntry]);

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const getRelativeDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return formatDate(d);
  };

  const calculateWeekTotal = () => {
    const total = recentActivity.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
    return Math.round(total * 10) / 10;
  };

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchCurrentStatus = async () => {
    try {
      setLoading(true);
      setError('');
      const status = await attendanceService.getCurrentStatus();
      
      setIsClockedIn(status.isClockedIn || false);
      setCurrentEntry(status.timeEntry || null);
    } catch (err) {
      console.error('Error fetching status:', err);
      setError(err.message || 'Failed to load status');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      const entries = await attendanceService.getMyTimeEntries(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setRecentActivity(entries || []);
    } catch (err) {
      console.error('Error fetching recent activity:', err);
    }
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleClockIn = async () => {
    try {
      setProcessing(true);
      setError('');
      setSuccess('');
      
      await attendanceService.clockIn();
      setSuccess('Clocked in successfully!');
      
      await fetchCurrentStatus();
      await fetchRecentActivity();
    } catch (err) {
      console.error('Error clocking in:', err);
      setError(err.message || 'Failed to clock in');
    } finally {
      setProcessing(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setProcessing(true);
      setError('');
      setSuccess('');
      
      await attendanceService.clockOut();
      setSuccess('Clocked out successfully!');
      
      await fetchCurrentStatus();
      await fetchRecentActivity();
    } catch (err) {
      console.error('Error clocking out:', err);
      setError(err.message || 'Failed to clock out');
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenManualEntry = () => {
    setManualEntryOpen(true);
  };

  const handleCloseManualEntry = () => {
    setManualEntryOpen(false);
    setManualEntry({
      workDate: new Date().toISOString().split('T')[0],
      clockInTime: '',
      clockOutTime: '',
      breakMinutes: 0,
      notes: ''
    });
  };

  const handleManualEntryChange = (field, value) => {
    setManualEntry(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitManualEntry = async () => {
    try {
      setProcessing(true);
      setError('');
      
      // Validate
      if (!manualEntry.workDate || !manualEntry.clockInTime || !manualEntry.clockOutTime) {
        setError('Please fill in all required fields');
        return;
      }

      // Create datetime strings
      const clockIn = `${manualEntry.workDate}T${manualEntry.clockInTime}:00`;
      const clockOut = `${manualEntry.workDate}T${manualEntry.clockOutTime}:00`;

      // Submit manual entry via API
      // Note: You may need to add this endpoint to your backend
      await attendanceService.submitManualEntry({
        workDate: manualEntry.workDate,
        clockInTime: clockIn,
        clockOutTime: clockOut,
        breakMinutes: parseInt(manualEntry.breakMinutes) || 0,
        notes: manualEntry.notes
      });

      setSuccess('Manual timesheet entry submitted successfully!');
      handleCloseManualEntry();
      await fetchRecentActivity();
    } catch (err) {
      console.error('Error submitting manual entry:', err);
      setError(err.message || 'Failed to submit manual entry');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!entryToDelete) return;

    try {
      setProcessing(true);
      setError('');
      
      await attendanceService.deleteTimeEntry(entryToDelete.timeEntryId);
      setSuccess('Time entry deleted successfully!');
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
      
      await fetchCurrentStatus();
      await fetchRecentActivity();
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError(err.message || 'Failed to delete time entry');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEntryToDelete(null);
  };

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading attendance..." />
      </Layout>
    );
  }

  const todayEntry = recentActivity.find(entry => {
    const entryDate = new Date(entry.workDate);
    const today = new Date();
    return entryDate.toDateString() === today.toDateString();
  });

  const todayComplete = todayEntry && todayEntry.clockOutTime !== null;
  const weekTotal = calculateWeekTotal();

  return (
    <Layout>
      <PageHeader
        icon={ClockIcon}
        title="Time & Attendance"
        subtitle="Clock in/out and manage your work hours"
        actionButton={{
          label: 'Manual Entry',
          icon: <AddIcon />,
          onClick: handleOpenManualEntry
        }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Statistics Summary Bar */}
      <Box 
        sx={{ 
          mb: 3, 
          p: 3, 
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea' }}>
            {todayEntry?.totalHours ? formatHours(todayEntry.totalHours) : '0h'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Today's Hours
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#6AB4A8' }}>
            {weekTotal}h
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This Week
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#FDB94E' }}>
            {recentActivity.filter(e => e.clockOutTime).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Days Worked
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Chip
            label={isClockedIn ? 'Working' : todayComplete ? 'Complete' : 'Not Started'}
            sx={{
              fontSize: '1.2rem',
              fontWeight: 700,
              px: 2,
              py: 2.5,
              height: 'auto',
              backgroundColor: isClockedIn ? '#e8f5e9' : todayComplete ? '#e3f2fd' : '#fff3cd',
              color: isClockedIn ? '#2e7d32' : todayComplete ? '#1976d2' : '#856404'
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Status
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Clock In/Out Card */}
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 5, 
              borderRadius: 3, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative circles */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
            />

            {/* Content */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {/* Current Time Display */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {formatDate(currentTime)}
                </Typography>
              </Box>

              <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.3)' }} />

              {/* Status Display */}
              {!isClockedIn && !todayComplete && (
                <>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    Ready to Start Your Day
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                    Click the button below to clock in
                  </Typography>
                </>
              )}

              {isClockedIn && currentEntry && (
                <>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    You're Clocked In
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                    Started at {formatTime(currentEntry.clockInTime)}
                  </Typography>
                  {currentEntry.shift && (
                    <Chip
                      label={currentEntry.shift}
                      sx={{
                        mb: 3,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  )}
                  
                  {/* Live Timer */}
                  <Box 
                    sx={{ 
                      display: 'inline-block',
                      px: 4, 
                      py: 3, 
                      mb: 4,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: 3,
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Typography variant="caption" display="block" sx={{ opacity: 0.9 }}>
                      Time Elapsed
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {liveElapsed}
                    </Typography>
                  </Box>
                </>
              )}

              {todayComplete && !isClockedIn && (
                <>
                  <CheckIcon sx={{ fontSize: 80, mb: 2 }} />
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    Great Work Today!
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                    You've completed {formatHours(todayEntry.totalHours)}
                  </Typography>
                </>
              )}

              {/* Clock In/Out Button */}
              {!todayComplete && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={isClockedIn ? handleClockOut : handleClockIn}
                  disabled={processing}
                  startIcon={isClockedIn ? <ClockOutIcon /> : <ClockInIcon />}
                  sx={{
                    minWidth: 280,
                    minHeight: 70,
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    backgroundColor: 'white',
                    color: isClockedIn ? '#f44336' : '#4caf50',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                    },
                    '&:disabled': {
                      backgroundColor: '#ccc',
                      color: '#666'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {processing ? 'Processing...' : isClockedIn ? 'CLOCK OUT' : 'CLOCK IN'}
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Today's Summary Card */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarIcon sx={{ mr: 1, color: '#667eea' }} />
              <Typography variant="h6" fontWeight={700} sx={{ color: '#2c3e50' }}>
                Today's Details
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {todayEntry ? (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Clock In
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formatTime(todayEntry.clockInTime)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Clock Out
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {todayEntry.clockOutTime ? formatTime(todayEntry.clockOutTime) : 'In progress...'}
                    </Typography>
                  </Box>
                  {todayEntry.breakMinutes > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Break Time
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {todayEntry.breakMinutes} min
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box 
                  sx={{ 
                    p: 3, 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: 2,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
                    Total Hours
                  </Typography>
                  <Typography variant="h3" fontWeight={700} sx={{ color: '#667eea' }}>
                    {todayEntry.totalHours ? formatHours(todayEntry.totalHours) : liveElapsed}
                  </Typography>
                </Box>

                {todayEntry.regularHours !== undefined && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="textSecondary">
                        Regular
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {todayEntry.regularHours}h
                      </Typography>
                    </Box>
                    {todayEntry.overtimeHours > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="textSecondary">
                          Overtime
                        </Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ color: '#FDB94E' }}>
                          {todayEntry.overtimeHours}h
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <ScheduleIcon sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
                <Typography variant="body1" color="textSecondary" fontWeight={600}>
                  No activity recorded today
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Clock in to start tracking your hours
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1, color: '#667eea' }} />
                <Typography variant="h6" fontWeight={700} sx={{ color: '#2c3e50' }}>
                  Recent Activity
                </Typography>
              </Box>
              <Chip 
                label={`${recentActivity.length} entries`} 
                size="small"
                sx={{ backgroundColor: '#f0f0f0' }}
              />
            </Box>
            <Divider sx={{ mb: 3 }} />

            {recentActivity.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="body1" color="textSecondary">
                  No recent activity to display
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {recentActivity.slice(0, 6).map((entry) => (
                  <Grid item xs={12} sm={6} md={4} key={entry.timeEntryId}>
                    <Card 
                      elevation={2} 
                      sx={{ 
                        borderRadius: 2,
                        border: '1px solid #f0f0f0',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 3
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="body2" fontWeight={700} color="primary">
                            {getRelativeDate(entry.workDate)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {entry.status && (
                              <Chip 
                                label={entry.status} 
                                size="small"
                                sx={{ 
                                  fontSize: '0.7rem',
                                  height: 20
                                }}
                              />
                            )}
                            <Tooltip title="Delete Entry">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeleteClick(entry)}
                                sx={{ 
                                  color: '#f44336',
                                  '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Box>
                            <Typography variant="caption" color="textSecondary" display="block">
                              In
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {formatTime(entry.clockInTime)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="textSecondary" display="block">
                              Out
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {entry.clockOutTime ? formatTime(entry.clockOutTime) : '--'}
                            </Typography>
                          </Box>
                        </Box>
                        {entry.totalHours && (
                          <Box 
                            sx={{ 
                              mt: 2, 
                              p: 1.5, 
                              backgroundColor: '#f8f9fa', 
                              borderRadius: 1,
                              textAlign: 'center'
                            }}
                          >
                            <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 700 }}>
                              {formatHours(entry.totalHours)}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Manual Entry Dialog */}
      <Dialog 
        open={manualEntryOpen} 
        onClose={handleCloseManualEntry}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={700}>
              Manual Timesheet Entry
            </Typography>
            <IconButton onClick={handleCloseManualEntry} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Work Date"
                type="date"
                fullWidth
                value={manualEntry.workDate}
                onChange={(e) => handleManualEntryChange('workDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Clock In Time"
                type="time"
                fullWidth
                value={manualEntry.clockInTime}
                onChange={(e) => handleManualEntryChange('clockInTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Clock Out Time"
                type="time"
                fullWidth
                value={manualEntry.clockOutTime}
                onChange={(e) => handleManualEntryChange('clockOutTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Break Time (minutes)"
                type="number"
                fullWidth
                value={manualEntry.breakMinutes}
                onChange={(e) => handleManualEntryChange('breakMinutes', e.target.value)}
                helperText="Enter total break time in minutes"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes (Optional)"
                multiline
                rows={3}
                fullWidth
                value={manualEntry.notes}
                onChange={(e) => handleManualEntryChange('notes', e.target.value)}
                placeholder="Add any notes about this entry..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseManualEntry}>
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handleSubmitManualEntry}
            disabled={processing || !manualEntry.clockInTime || !manualEntry.clockOutTime}
            sx={{
              backgroundColor: '#667eea',
              '&:hover': {
                backgroundColor: '#5568d3'
              }
            }}
          >
            {processing ? 'Submitting...' : 'Submit Entry'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon sx={{ color: '#f44336' }} />
            <Typography variant="h6" fontWeight={700}>
              Delete Time Entry
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this time entry?
          </Typography>
          {entryToDelete && (
            <Box 
              sx={{ 
                p: 2, 
                backgroundColor: '#f8f9fa', 
                borderRadius: 2,
                border: '1px solid #e0e0e0'
              }}
            >
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Date:</strong> {formatDate(entryToDelete.workDate)}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Clock In:</strong> {formatTime(entryToDelete.clockInTime)}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Clock Out:</strong> {entryToDelete.clockOutTime ? formatTime(entryToDelete.clockOutTime) : 'N/A'}
              </Typography>
              {entryToDelete.totalHours && (
                <Typography variant="body2" color="textSecondary">
                  <strong>Total Hours:</strong> {formatHours(entryToDelete.totalHours)}
                </Typography>
              )}
            </Box>
          )}
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone. The time entry and related attendance record will be permanently deleted.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button 
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={processing}
            startIcon={<DeleteIcon />}
          >
            {processing ? 'Deleting...' : 'Delete Entry'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ClockInOut;