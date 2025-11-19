// src/pages/leave/ApproveRequests.jsx
// Page for managers to approve/reject leave requests

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

import { LeaveRequestCard, ApprovalActionButtons } from './components';
import { EmptyState } from '../../components/common';
import {
  filterByStatus,
  sortLeaveRequests,
  calculateLeaveStats,
  LEAVE_STATUS_OPTIONS
} from '../leave/models/leaveModels';

/**
 * ApproveRequests Page
 * 
 * Manager/Admin view for reviewing leave requests:
 * - View all pending requests
 * - Filter by status, employee
 * - Approve/reject requests with reason
 * - View request history
 */

const ApproveRequests = () => {

  // Current user (manager/admin)
  const [currentUser, setCurrentUser] = useState({
    userId: 2,
    userName: 'Jane Smith',
    role: 'HR Manager',
    roleLevel: 3 // For approval workflow
  });

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

  // Load Leave Requests
  useEffect(() => {
    fetchLeaveRequests();
    fetchEmployees();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const response = await leaveService.getPendingRequests(currentUser.roleLevel);
      
      // Mock data - requests from multiple employees
      setTimeout(() => {
        const mockRequests = [
          {
            leaveRequestId: 101,
            employeeId: 1,
            employeeName: 'John Doe',
            department: 'IT',
            leaveTypeId: 1,
            leaveTypeName: 'PTO',
            startDate: '2025-12-20',
            endDate: '2025-12-24',
            totalDays: 5,
            reason: 'Holiday vacation with family',
            status: 'Pending',
            requestedAt: '2025-11-15T10:00:00Z',
            isPaidLeave: true,
            approverName: null,
            approvedAt: null,
            rejectionReason: null
          },
          {
            leaveRequestId: 102,
            employeeId: 3,
            employeeName: 'Alice Johnson',
            department: 'HR',
            leaveTypeId: 2,
            leaveTypeName: 'Sick Leave',
            startDate: '2025-11-22',
            endDate: '2025-11-23',
            totalDays: 2,
            reason: 'Medical procedure',
            status: 'Pending',
            requestedAt: '2025-11-18T14:30:00Z',
            isPaidLeave: true,
            approverName: null,
            approvedAt: null,
            rejectionReason: null
          },
          {
            leaveRequestId: 103,
            employeeId: 5,
            employeeName: 'Bob Wilson',
            department: 'Finance',
            leaveTypeId: 1,
            leaveTypeName: 'PTO',
            startDate: '2025-12-01',
            endDate: '2025-12-03',
            totalDays: 3,
            reason: 'Personal matters',
            status: 'Pending',
            requestedAt: '2025-11-17T09:00:00Z',
            isPaidLeave: true,
            approverName: null,
            approvedAt: null,
            rejectionReason: null
          },
          {
            leaveRequestId: 104,
            employeeId: 1,
            employeeName: 'John Doe',
            department: 'IT',
            leaveTypeId: 2,
            leaveTypeName: 'Sick Leave',
            startDate: '2025-11-10',
            endDate: '2025-11-11',
            totalDays: 2,
            reason: 'Medical appointment',
            status: 'Approved',
            requestedAt: '2025-11-08T09:30:00Z',
            isPaidLeave: true,
            approverName: 'Jane Smith',
            approvedAt: '2025-11-08T14:20:00Z',
            rejectionReason: null
          },
          {
            leaveRequestId: 105,
            employeeId: 3,
            employeeName: 'Alice Johnson',
            department: 'HR',
            leaveTypeId: 1,
            leaveTypeName: 'PTO',
            startDate: '2025-10-15',
            endDate: '2025-10-16',
            totalDays: 2,
            reason: 'Personal matters',
            status: 'Rejected',
            requestedAt: '2025-10-10T11:00:00Z',
            isPaidLeave: true,
            approverName: 'Jane Smith',
            approvedAt: '2025-10-11T10:00:00Z',
            rejectionReason: 'Insufficient staffing during this period. Please reschedule.'
          }
        ];

        setRequests(mockRequests);
        setFilteredRequests(mockRequests.filter(r => r.status === 'Pending'));
        setStats(calculateLeaveStats(mockRequests));
        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setError('Failed to load leave requests. Please try again.');
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    // TODO: Fetch employees list for filter
    // Mock data
    setEmployees([
      { employeeId: 1, employeeName: 'John Doe', department: 'IT' },
      { employeeId: 3, employeeName: 'Alice Johnson', department: 'HR' },
      { employeeId: 5, employeeName: 'Bob Wilson', department: 'Finance' }
    ]);
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
        req.employeeName.toLowerCase().includes(query) ||
        req.leaveTypeName.toLowerCase().includes(query) ||
        req.reason?.toLowerCase().includes(query) ||
        req.department?.toLowerCase().includes(query)
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

  // Handle Approve
  const handleApprove = async (request) => {
    try {
      setSubmitting(true);

      // TODO: Replace with actual API call
      // await leaveService.approveRequest(request.leaveRequestId, currentUser.userId);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update local state
      setRequests(prev => 
        prev.map(req => 
          req.leaveRequestId === request.leaveRequestId
            ? { 
                ...req, 
                status: 'Approved',
                approverName: currentUser.userName,
                approvedAt: new Date().toISOString()
              }
            : req
        )
      );

      setSubmitting(false);
      alert('Leave request approved successfully!');

    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request. Please try again.');
      setSubmitting(false);
    }
  };

  // Handle Reject
  const handleReject = async (request, rejectionReason) => {
    try {
      setSubmitting(true);

      // TODO: Replace with actual API call
      // await leaveService.rejectRequest(request.leaveRequestId, currentUser.userId, rejectionReason);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update local state
      setRequests(prev => 
        prev.map(req => 
          req.leaveRequestId === request.leaveRequestId
            ? { 
                ...req, 
                status: 'Rejected',
                approverName: currentUser.userName,
                approvedAt: new Date().toISOString(),
                rejectionReason: rejectionReason
              }
            : req
        )
      );

      setSubmitting(false);
      alert('Leave request rejected.');

    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
      setSubmitting(false);
    }
  };

  // Handle View Details
  const handleViewDetails = (request) => {
    // TODO: Open detailed view modal
    console.log('View details:', request);
  };

  return (
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
  );
};

export default ApproveRequests;