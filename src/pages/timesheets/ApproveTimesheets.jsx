// src/pages/timesheets/ApproveTimesheets.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import timesheetService from '../../services/timesheetService';

const ApproveTimesheets = () => {
  // State
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userRole, setUserRole] = useState('');
  const [canApproveAll, setCanApproveAll] = useState(false);
  
  // Filters
  const [selectedDepartment, setSelectedDepartment] = useState('');
  
  // View Details Dialog
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [timesheetDetails, setTimesheetDetails] = useState(null);
  
  // Reject Dialog
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [timesheetToReject, setTimesheetToReject] = useState(null);

  // Load pending timesheets
  const loadPendingTimesheets = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await timesheetService.getPendingTimesheets(
        selectedDepartment || null
      );
      
      setTimesheets(response.timesheets || []);
      setUserRole(response.userRole || '');
      setCanApproveAll(response.canApproveAll || false);
    } catch (err) {
      console.error('Error loading pending timesheets:', err);
      setError(err.message || 'Failed to load pending timesheets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingTimesheets();
  }, [selectedDepartment]);

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

  // Approve
  const handleApprove = async (timesheet) => {
    if (!window.confirm(`Approve timesheet for ${timesheet.employeeName}?`)) {
      return;
    }

    try {
      setProcessing(true);
      setError('');
      
      await timesheetService.approveTimesheet(timesheet.timesheetId, 'Approved');
      
      setSuccess(`Timesheet approved for ${timesheet.employeeName}`);
      
      // Reload list
      await loadPendingTimesheets();
      
      // Close details if open
      if (detailsOpen) {
        handleCloseDetails();
      }
    } catch (err) {
      console.error('Error approving timesheet:', err);
      setError(err.message || 'Failed to approve timesheet');
    } finally {
      setProcessing(false);
    }
  };

  // Reject - Open Dialog
  const handleRejectClick = (timesheet) => {
    setTimesheetToReject(timesheet);
    setRejectReason('');
    setRejectOpen(true);
  };

  // Reject - Submit
  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      setError('Rejection reason is required');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      
      await timesheetService.rejectTimesheet(
        timesheetToReject.timesheetId,
        rejectReason
      );
      
      setSuccess(`Timesheet rejected for ${timesheetToReject.employeeName}`);
      
      // Close dialogs
      setRejectOpen(false);
      setRejectReason('');
      setTimesheetToReject(null);
      
      if (detailsOpen) {
        handleCloseDetails();
      }
      
      // Reload list
      await loadPendingTimesheets();
    } catch (err) {
      console.error('Error rejecting timesheet:', err);
      setError(err.message || 'Failed to reject timesheet');
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

  // Get unique departments for filter
  const departments = [...new Set(timesheets.map(t => t.departmentName))].filter(Boolean);

  return (
    <Layout>
      <PageHeader
        title="Approve Timesheets"
        subtitle={`Pending Approval: ${timesheets.length} timesheet${timesheets.length !== 1 ? 's' : ''}`}
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

        {/* Filters */}
        {canApproveAll && departments.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FilterIcon color="action" />
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    label="Department"
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Tooltip title="Refresh">
                  <IconButton onClick={loadPendingTimesheets} disabled={loading}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>

                <Box sx={{ ml: 'auto' }}>
                  <Chip 
                    label={userRole} 
                    color="primary" 
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Timesheets Table */}
        <Card>
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : timesheets.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No Pending Timesheets
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  All timesheets have been approved or no timesheets have been submitted.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Employee</strong></TableCell>
                      {canApproveAll && <TableCell><strong>Department</strong></TableCell>}
                      <TableCell><strong>Period</strong></TableCell>
                      <TableCell align="center"><strong>Total Hours</strong></TableCell>
                      <TableCell align="center"><strong>Overtime</strong></TableCell>
                      <TableCell align="center"><strong>Submitted</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {timesheets.map((timesheet) => (
                      <TableRow key={timesheet.timesheetId} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              {timesheet.employeeName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {timesheet.employeeCode} • {timesheet.jobTitle}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        {canApproveAll && (
                          <TableCell>
                            <Chip 
                              label={timesheet.departmentName} 
                              size="small"
                              sx={{ backgroundColor: '#f0f0f0' }}
                            />
                          </TableCell>
                        )}
                        
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(timesheet.startDate)} - {formatDate(timesheet.endDate)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {timesheet.daysWorked} days worked
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
                          <Typography variant="body2">
                            {formatDateTime(timesheet.submittedAt)}
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
                            
                            <Tooltip title="Approve">
                              <IconButton 
                                size="small" 
                                onClick={() => handleApprove(timesheet)}
                                disabled={processing}
                                sx={{ color: '#4caf50' }}
                              >
                                <ApproveIcon />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Reject">
                              <IconButton 
                                size="small" 
                                onClick={() => handleRejectClick(timesheet)}
                                disabled={processing}
                                sx={{ color: '#f44336' }}
                              >
                                <RejectIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
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
            <Chip label="Pending Approval" color="warning" size="small" />
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {!timesheetDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {/* Employee Info */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {timesheetDetails.employeeName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {timesheetDetails.employeeCode} • {timesheetDetails.jobTitle} • {timesheetDetails.departmentName}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Period: {formatDate(timesheetDetails.startDate)} - {formatDate(timesheetDetails.endDate)}
                </Typography>
              </Box>

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
          <Button 
            variant="outlined" 
            color="error"
            startIcon={<RejectIcon />}
            onClick={() => {
              handleCloseDetails();
              handleRejectClick(selectedTimesheet);
            }}
            disabled={processing}
          >
            Reject
          </Button>
          <Button 
            variant="contained" 
            color="success"
            startIcon={<ApproveIcon />}
            onClick={() => handleApprove(selectedTimesheet)}
            disabled={processing}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RejectIcon color="error" />
            <Typography variant="h6" fontWeight={700}>
              Reject Timesheet
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {timesheetToReject && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to reject the timesheet for:
              </Typography>
              <Typography variant="body1" fontWeight={600} color="primary">
                {timesheetToReject.employeeName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Period: {formatDate(timesheetToReject.startDate)} - {formatDate(timesheetToReject.endDate)}
              </Typography>
            </Box>
          )}
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason (Required)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Please provide a clear reason for rejection so the employee can correct and resubmit..."
            required
          />
          
          <Alert severity="warning" sx={{ mt: 2 }}>
            The employee will be notified and can fix the issues and resubmit.
          </Alert>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRejectOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleRejectSubmit}
            disabled={processing || !rejectReason.trim()}
            startIcon={<RejectIcon />}
          >
            {processing ? 'Rejecting...' : 'Reject Timesheet'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ApproveTimesheets;