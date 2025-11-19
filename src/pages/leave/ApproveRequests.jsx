// src/pages/leave/ApproveRequests.jsx
// Page for managers to approve/reject leave requests - CONNECTED TO API

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
  Refresh as RefreshIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import { LeaveRequestCard, ApprovalActionButtons } from './components';
import { EmptyState } from '../../components/common';
import {
  filterByStatus,
  sortLeaveRequests,
  calculateLeaveStats,
  LEAVE_STATUS_OPTIONS
} from './models/leaveModels';
import leaveService from '../../services/leaveService';
import { authService } from '../../services/authService';

const ApproveRequests = () => {
  const navigate = useNavigate();

  // Get current user
  const [currentUser, setCurrentUser] = useState(null);
  const [employee, setEmployee] = useState(null);

  // Leave Requests
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [activeTab, setActiveTab] = useState('pending');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
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

  // Employees list for filter
  const [employees, setEmployees] = useState([]);

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

      // ✅ REAL API CALL - Get pending approvals for this manager
      const response = await leaveService.getPendingRequests();
      
      setRequests(response.requests || response);
      setFilteredRequests(response.requests || response);
      setStats(calculateLeaveStats(response.requests || response));
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

    // Employee filter
    if (employeeFilter) {
      filtered = filtered.filter(req => req.employeeId === parseInt(employeeFilter));
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req => 
        req.employeeName?.toLowerCase().includes(query) ||
        req.employee?.firstName?.toLowerCase().includes(query) ||
        req.employee?.lastName?.toLowerCase().includes(query) ||
        req.leaveType?.toLowerCase().includes(query) ||
        req.reason?.toLowerCase().includes(query) ||
        req.department?.departmentName?.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered = sortLeaveRequests(filtered, sortBy, sortOrder);

    setFilteredRequests(filtered);
  }, [requests, activeTab, statusFilter, employeeFilter, searchQuery, sortBy, sortOrder]);

  // Handle Tab Change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle Approve - REAL API CALL
  const handleApprove = async (request) => {
    if (!window.confirm(`Approve leave request for ${request.employeeName || request.employee?.firstName}?`)) {
      return;
    }

    try {
      setSubmitting(true);

      // ✅ REAL API CALL
      await leaveService.approveRequest(request.leaveRequestId);

      // Refresh the list
      await fetchLeaveRequests();

      setSubmitting(false);
      alert('Leave request approved successfully!');

    } catch (error) {
      console.error('Error approving request:', error);
      alert(error.message || 'Failed to approve request. Please try again.');
      setSubmitting(false);
    }
  };

  // Handle Reject - REAL API CALL
  const handleReject = async (request, rejectionReason) => {
    try {
      setSubmitting(true);

      // ✅ REAL API CALL
      await leaveService.rejectRequest(request.leaveRequestId, rejectionReason);

      // Refresh the list
      await fetchLeaveRequests();

      setSubmitting(false);
      alert('Leave request rejected.');

    } catch (error) {
      console.error('Error rejecting request:', error);
      alert(error.message || 'Failed to reject request. Please try again.');
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
            Leave Request Approvals
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review and approve leave requests from your team
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - Stats & Filters */}
          <Grid item xs={12} md={3}>
            {/* Quick Stats */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                      {stats.pending}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pending Approval
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.dark' }}>
                      {stats.approved}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Approved
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
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

            {/* Employee Filter */}
            {employees.length > 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Filter by Employee
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                >
                  <MenuItem value="">All Employees</MenuItem>
                  {employees.map(emp => (
                    <MenuItem key={emp.employeeId} value={emp.employeeId}>
                      {emp.employeeName} ({emp.department})
                    </MenuItem>
                  ))}
                </TextField>
              </Paper>
            )}
          </Grid>

          {/* Right Column - Requests List */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 3 }}>
              {/* Tabs */}
              <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
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
                <Tab label="All" value="all" />
                <Tab label="Approved" value="approved" />
                <Tab label="Rejected" value="rejected" />
              </Tabs>

              {/* Filters */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                  placeholder="Search by employee, type, reason..."
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
                    activeTab === 'pending'
                      ? "There are no pending leave requests to review"
                      : `No ${activeTab === 'all' ? '' : activeTab} leave requests found`
                  }
                />
              )}

              {/* Requests List */}
              {!loading && !error && filteredRequests.length > 0 && (
                <Box>
                  {filteredRequests.map(request => (
                    <LeaveRequestCard
                      key={request.leaveRequestId}
                      request={request}
                      viewMode="manager"
                      showEmployee={true}
                      onApprove={handleApprove}
                      onReject={handleReject}
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

export default ApproveRequests;