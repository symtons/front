// src/pages/leave/MyRequests.jsx
// Page for viewing employee's own leave requests - CONNECTED TO API

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  Button
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import { PTOBalanceCard, LeaveRequestCard } from './components';
import { EmptyState } from '../../components/common';
import {
  filterByStatus,
  sortLeaveRequests,
  calculateLeaveStats,
  LEAVE_STATUS_OPTIONS
} from './models/leaveModels';
import leaveService from '../../services/leaveService';
import { authService } from '../../services/authService';

const MyRequests = () => {
  const navigate = useNavigate();
  
  // Get current user
  const [currentUser, setCurrentUser] = useState(null);
  const [employee, setEmployee] = useState(null);

  // PTO Balance
  const [ptoBalance, setPtoBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(true);

  // Leave Requests
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('requestedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    totalDays: 0
  });

  // Submission State
  const [submitting, setSubmitting] = useState(false);

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

  // Load PTO Balance - REAL API CALL
  useEffect(() => {
    const fetchPTOBalance = async () => {
      if (!employee) return;

      try {
        setLoadingBalance(true);
        
        // ✅ REAL API CALL
        const response = await leaveService.getPTOBalance(employee.employeeId);
        
        setPtoBalance({
          total: response.totalPTODays || 0,
          available: response.remainingPTODays || 0,
          used: response.usedPTODays || 0,
          pending: 0,
          accrualRate: response.accrualRate || 0
        });
        
        setLoadingBalance(false);
      } catch (error) {
        console.error('Error fetching PTO balance:', error);
        setLoadingBalance(false);
        
        if (error.message?.includes('not eligible')) {
          setPtoBalance({
            total: 0,
            available: 0,
            used: 0,
            pending: 0,
            accrualRate: 0
          });
        }
      }
    };

    if (employee) {
      if (employee.employmentType === 'FullTime') {
        fetchPTOBalance();
      } else {
        setLoadingBalance(false);
        setPtoBalance({
          total: 0,
          available: 0,
          used: 0,
          pending: 0,
          accrualRate: 0
        });
      }
    }
  }, [employee]);

  // Load Leave Requests - REAL API CALL
  useEffect(() => {
    if (employee) {
      fetchLeaveRequests();
    }
  }, [employee]);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ REAL API CALL
      const response = await leaveService.getMyRequests(employee.employeeId);
      
      setRequests(response);
      setFilteredRequests(response);
      setStats(calculateLeaveStats(response));
      setLoading(false);

    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setError('Failed to load leave requests. Please try again.');
      setLoading(false);
    }
  };

  // Apply Filters
  useEffect(() => {
    let filtered = [...requests];

    // Tab filter
    if (activeTab !== 'all') {
      const tabStatus = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
      filtered = filterByStatus(filtered, tabStatus);
    }

    // Status dropdown filter
    if (statusFilter) {
      filtered = filterByStatus(filtered, statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req => 
        req.leaveType?.toLowerCase().includes(query) ||
        req.reason?.toLowerCase().includes(query) ||
        req.status?.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered = sortLeaveRequests(filtered, sortBy, sortOrder);

    setFilteredRequests(filtered);
  }, [requests, activeTab, statusFilter, searchQuery, sortBy, sortOrder]);

  // Handle Tab Change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle Cancel - REAL API CALL
  const handleCancel = async (request) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }

    try {
      setSubmitting(true);

      // ✅ REAL API CALL
      await leaveService.cancelRequest(request.leaveRequestId);

      // Refresh the list
      await fetchLeaveRequests();

      setSubmitting(false);
      alert('Leave request cancelled successfully!');

    } catch (error) {
      console.error('Error cancelling request:', error);
      alert('Failed to cancel request. Please try again.');
      setSubmitting(false);
    }
  };

  // Handle View Details
  const handleViewDetails = (request) => {
    console.log('View details:', request);
    // TODO: Open detailed view modal
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
            My Leave Requests
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your leave requests
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - PTO Balance & Stats */}
          <Grid item xs={12} md={3}>
            {/* PTO Balance */}
            {employee.employmentType === 'FullTime' && (
              <PTOBalanceCard
                balance={ptoBalance}
                loading={loadingBalance}
              />
            )}

            {/* Quick Stats */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Requests
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                      {stats.pending}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pending
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.dark' }}>
                      {stats.approved}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Approved
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.dark' }}>
                      {stats.rejected}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Rejected
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right Column - Requests List */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 3 }}>
              {/* Tabs */}
              <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="All" value="all" />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Pending
                      {stats.pending > 0 && (
                        <Chip label={stats.pending} size="small" color="warning" />
                      )}
                    </Box>
                  } 
                  value="pending" 
                />
                <Tab label="Approved" value="approved" />
                <Tab label="Rejected" value="rejected" />
                <Tab label="Cancelled" value="cancelled" />
              </Tabs>

              {/* Filters */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                  placeholder="Search..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{ flex: 1, minWidth: 250 }}
                />

                <TextField
                  select
                  size="small"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ minWidth: 150 }}
                  InputProps={{
                    startAdornment: <FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                >
                  {LEAVE_STATUS_OPTIONS.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchLeaveRequests}
                  disabled={loading}
                >
                  Refresh
                </Button>

                <Button
                  variant="contained"
                  onClick={() => navigate('/leave/request')}
                >
                  New Request
                </Button>
              </Box>

              {/* Loading State */}
              {loading && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Loading requests...
                  </Typography>
                </Box>
              )}

              {/* Error State */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Empty State */}
              {!loading && !error && filteredRequests.length === 0 && (
                <EmptyState
                  title="No leave requests found"
                  message={
                    activeTab === 'all'
                      ? "You haven't submitted any leave requests yet"
                      : `No ${activeTab} leave requests found`
                  }
                  actionLabel="Request Leave"
                  onAction={() => navigate('/leave/request')}
                />
              )}

              {/* Requests List */}
              {!loading && !error && filteredRequests.length > 0 && (
                <Box>
                  {filteredRequests.map(request => (
                    <LeaveRequestCard
                      key={request.leaveRequestId}
                      request={request}
                      viewMode="employee"
                      onCancel={handleCancel}
                      onView={handleViewDetails}
                    />
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default MyRequests;