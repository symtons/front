// src/pages/timesheets/MyTimesheets.jsx
// UPDATED VERSION WITH GENERATE TIMESHEET BUTTON

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
  Tooltip,
  TextField
} from '@mui/material';
import {
  Send as SubmitIcon,
  Visibility as ViewIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Schedule as PendingIcon,
  Edit as DraftIcon,
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@mui/icons-material';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
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

  // Generate Timesheet Dialog
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [generateStartDate, setGenerateStartDate] = useState('');
  const [generateEndDate, setGenerateEndDate] = useState('');

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

  // Generate Timesheet
  const handleGenerateTimesheet = async () => {
    if (!generateStartDate || !generateEndDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (new Date(generateStartDate) > new Date(generateEndDate)) {
      setError('Start date must be before end date');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      
      await timesheetService.generateTimesheet(generateStartDate, generateEndDate);
      
      setSuccess('Timesheet generated successfully');
      setGenerateDialogOpen(false);
      setGenerateStartDate('');
      setGenerateEndDate('');
      
      // Reload data
      await loadData();
    } catch (err) {
      console.error('Error generating timesheet:', err);
      setError(err.message || 'Failed to generate timesheet');
    } finally {
      setProcessing(false);
    }
  };

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

  const getStatusDisplay = (status) => {
    const displays = {
      Draft: { label: 'Draft', color: 'default', icon: <DraftIcon /> },
      Submitted: { label: 'Pending Approval', color: 'warning', icon: <PendingIcon /> },
      Approved: { label: 'Approved', color: 'success', icon: <ApprovedIcon /> },
      Rejected: { label: 'Rejected', color: 'error', icon: <RejectedIcon /> }
    };
    return displays[status] || displays.Draft;
  };

  if (loading && timesheets.length === 0) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="My Timesheets"
        subtitle="View and manage your submitted timesheets"
        icon={DraftIcon}
      />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setGenerateDialogOpen(true)}
          disabled={loading}
        >
          Generate Timesheet
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Box>
        <Grid container spacing={3}>
          {statistics && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Timesheets
                    </Typography>
                    <Typography variant="h4" component="div" color="primary">
                      {statistics.totalTimesheets || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Pending Approval
                    </Typography>
                    <Typography variant="h4" component="div" color="warning.main">
                      {statistics.pendingApproval || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md=

{3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Hours This Month
                    </Typography>
                    <Typography variant="h4" component="div">
                      {formatHours(statistics.hoursThisMonth || 0)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Overtime This Month
                    </Typography>
                    <Typography variant="h4" component="div">
                      {formatHours(statistics.overtimeThisMonth || 0)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>

        {/* Timesheets Table */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Recent Timesheets
            </Typography>

            {timesheets.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No Timesheets Yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Your submitted timesheets will appear here.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setGenerateDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Generate Your First Timesheet
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Period</strong></TableCell>
                      <TableCell><strong>Total Hours</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Submitted</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {timesheets.map((timesheet) => {
                      const statusDisplay = getStatusDisplay(timesheet.status);
                      return (
                        <TableRow key={timesheet.timesheetId} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {formatDate(timesheet.startDate)} - {formatDate(timesheet.endDate)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={formatHours(timesheet.totalHours)} 
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              icon={statusDisplay.icon}
                              label={statusDisplay.label}
                              color={statusDisplay.color}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {timesheet.submittedAt ? 
                                formatDateTime(timesheet.submittedAt)
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

      {/* Generate Timesheet Dialog */}
      <Dialog 
        open={generateDialogOpen} 
        onClose={() => setGenerateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Generate Timesheet
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Select a date range to generate a timesheet from your time entries.
          </Typography>
          
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            value={generateStartDate}
            onChange={(e) => setGenerateStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            type="date"
            label="End Date"
            value={generateEndDate}
            onChange={(e) => setGenerateEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          
          <Alert severity="info" sx={{ mt: 2 }}>
            Only closed time entries within this date range will be included.
          </Alert>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setGenerateDialogOpen(false)}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleGenerateTimesheet}
            disabled={processing || !generateStartDate || !generateEndDate}
          >
            {processing ? 'Generating...' : 'Generate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog - keeping existing code */}
      <Dialog 
        open={detailsOpen} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {/* Existing details dialog code stays the same */}
      </Dialog>
    </Layout>
  );
};

export default MyTimesheets;