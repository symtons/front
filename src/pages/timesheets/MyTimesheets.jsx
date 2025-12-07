// src/pages/timesheets/MyTimesheets.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Send as SubmitIcon,
  Visibility as ViewIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Schedule as PendingIcon,
  Edit as DraftIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import Layout from '../../components//common/layout/Layout';
import PageHeader from '../../components//common/layout/PageHeader';
import timesheetService from '../../services/timesheetService';

const MyTimesheets = () => {
  // State
  const [timesheets, setTimesheets] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // View Details Dialog
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [timesheetDetails, setTimesheetDetails] = useState(null);

  // Load timesheets and statistics
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [timesheetsData, statsData] = await Promise.all([
        timesheetService.getMyTimesheets(),
        timesheetService.getStatistics()
      ]);
      
      setTimesheets(timesheetsData);
      setStatistics(statsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load timesheets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto-dismiss alerts
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // View Details
  const handleViewDetails = async (timesheet) => {
    try {
      setSelectedTimesheet(timesheet);
      setDetailsOpen(true);
      
      const details = await timesheetService.getTimesheetDetails(timesheet.timesheetId);
      setTimesheetDetails(details);
    } catch (err) {
      console.error('Error loading timesheet details:', err);
      setError(err.message || 'Failed to load timesheet details');
      setDetailsOpen(false);
    }
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedTimesheet(null);
    setTimesheetDetails(null);
  };

  // Submit for Approval
  const handleSubmit = async (timesheet) => {
    if (!window.confirm('Submit this timesheet for approval?')) {
      return;
    }

    try {
      setProcessing(true);
      setError('');
      
      await timesheetService.submitTimesheet(timesheet.timesheetId);
      
      setSuccess('Timesheet submitted for approval');
      
      // Reload data
      await loadData();
      
      // Close details if open
      if (detailsOpen) {
        handleCloseDetails();
      }
    } catch (err) {
      console.error('Error submitting timesheet:', err);
      setError(err.message || 'Failed to submit timesheet');
    } finally {
      setProcessing(false);
    }
  };

  // Format helpers
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatHours = (hours) => {
    if (!hours) return '0h';
    return hours % 1 === 0 ? `${hours}h` : `${hours.toFixed(1)}h`;
  };

  // Get status color and icon
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'Draft':
        return { color: 'default', icon: <DraftIcon fontSize="small" />, label: 'Draft' };
      case 'Submitted':
        return { color: 'warning', icon: <PendingIcon fontSize="small" />, label: 'Pending' };
      case 'Approved':
        return { color: 'success', icon: <ApprovedIcon fontSize="small" />, label: 'Approved' };
      case 'Rejected':
        return { color: 'error', icon: <RejectedIcon fontSize="small" />, label: 'Rejected' };
      default:
        return { color: 'default', icon: null, label: status };
    }
  };

  return (
    <Layout>
      <PageHeader
        title="My Timesheets"
        subtitle="View and manage your submitted timesheets"
      />

      <Box sx={{ p: 3 }}>
        {/* Alerts */}
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

        {/* Statistics Cards */}
        {statistics && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Total Timesheets
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {statistics.totalTimesheets}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Pending Approval
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {statistics.submittedTimesheets}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Hours This Month
                  </Typography>
                  <Typography variant="h4">
                    {formatHours(statistics.totalHoursThisMonth)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Overtime This Month
                  </Typography>
                  <Typography variant="h4" color={statistics.overtimeHoursThisMonth > 0 ? 'warning.main' : 'textSecondary'}>
                    {formatHours(statistics.overtimeHoursThisMonth)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Timesheets List */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                Recent Timesheets
              </Typography>
              <Tooltip title="Refresh">
                <IconButton onClick={loadData} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : timesheets.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No Timesheets Yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Your submitted timesheets will appear here.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Period</strong></TableCell>
                      <TableCell align="center"><strong>Total Hours</strong></TableCell>
                      <TableCell align="center"><strong>Overtime</strong></TableCell>
                      <TableCell align="center"><strong>Status</strong></TableCell>
                      <TableCell align="center"><strong>Submitted</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {timesheets.map((timesheet) => {
                      const statusDisplay = getStatusDisplay(timesheet.status);
                      
                      return (
                        <TableRow key={timesheet.timesheetId} hover>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(timesheet.startDate)} - {formatDate(timesheet.endDate)}
                            </Typography>
                          </TableCell>
                          
                          <TableCell align="center">
                            <Typography variant="body1" fontWeight={600} color="primary">
                              {formatHours(timesheet.totalHours)}
                            </Typography>
                          </TableCell>
                          
                          <TableCell align="center">
                            {timesheet.overtimeHours > 0 ? (
                              <Chip 
                                label={formatHours(timesheet.overtimeHours)} 
                                size="small"
                                color="warning"
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                          
                          <TableCell align="center">
                            <Chip 
                              icon={statusDisplay.icon}
                              label={statusDisplay.label}
                              color={statusDisplay.color}
                              size="small"
                            />
                          </TableCell>
                          
                          <TableCell align="center">
                            <Typography variant="body2">
                              {timesheet.submittedAt 
                                ? formatDateTime(timesheet.submittedAt)
                                : '-'}
                            </Typography>
                          </TableCell>
                          
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleViewDetails(timesheet)}
                                  sx={{ color: '#667eea' }}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              
                              {(timesheet.status === 'Draft' || timesheet.status === 'Rejected') && (
                                <Tooltip title="Submit for Approval">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleSubmit(timesheet)}
                                    disabled={processing}
                                    sx={{ color: '#4caf50' }}
                                  >
                                    <SubmitIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* View Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={700}>
              Timesheet Details
            </Typography>
            {timesheetDetails && (
              <Chip 
                icon={getStatusDisplay(timesheetDetails.status).icon}
                label={getStatusDisplay(timesheetDetails.status).label}
                color={getStatusDisplay(timesheetDetails.status).color}
                size="small"
              />
            )}
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {!timesheetDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {/* Period Info */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="textSecondary">
                  Period: {formatDate(timesheetDetails.startDate)} - {formatDate(timesheetDetails.endDate)}
                </Typography>
                {timesheetDetails.submittedAt && (
                  <Typography variant="body2" color="textSecondary">
                    Submitted: {formatDateTime(timesheetDetails.submittedAt)}
                  </Typography>
                )}
                {timesheetDetails.approvedAt && (
                  <Typography variant="body2" color="textSecondary">
                    Approved: {formatDateTime(timesheetDetails.approvedAt)} by {timesheetDetails.approvedByName}
                  </Typography>
                )}
              </Box>

              {/* Rejection Reason */}
              {timesheetDetails.status === 'Rejected' && timesheetDetails.rejectionReason && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Rejection Reason:
                  </Typography>
                  <Typography variant="body2">
                    {timesheetDetails.rejectionReason}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Please correct the issues and resubmit.
                  </Typography>
                </Alert>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Summary */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">Total Hours</Typography>
                      <Typography variant="h5" color="primary">
                        {formatHours(timesheetDetails.totalHours)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">Regular Hours</Typography>
                      <Typography variant="h5">
                        {formatHours(timesheetDetails.regularHours)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">Overtime</Typography>
                      <Typography variant="h5" color={timesheetDetails.overtimeHours > 0 ? 'warning.main' : 'textSecondary'}>
                        {formatHours(timesheetDetails.overtimeHours)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Daily Breakdown */}
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Daily Breakdown
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Clock In</strong></TableCell>
                      <TableCell><strong>Clock Out</strong></TableCell>
                      <TableCell align="right"><strong>Hours</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {timesheetDetails.entries && timesheetDetails.entries.map((entry) => (
                      <TableRow key={entry.timesheetEntryId}>
                        <TableCell>{formatDate(entry.workDate)}</TableCell>
                        <TableCell>
                          {entry.startTime ? formatDateTime(entry.startTime) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {entry.endTime ? formatDateTime(entry.endTime) : 'N/A'}
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={formatHours(entry.hours)} 
                            size="small"
                            color={entry.hours >= 8 ? 'primary' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDetails}>
            Close
          </Button>
          {timesheetDetails && (timesheetDetails.status === 'Draft' || timesheetDetails.status === 'Rejected') && (
            <Button 
              variant="contained" 
              color="success"
              startIcon={<SubmitIcon />}
              onClick={() => {
                handleCloseDetails();
                handleSubmit(selectedTimesheet);
              }}
              disabled={processing}
            >
              Submit for Approval
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default MyTimesheets;