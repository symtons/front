// src/pages/leave/MyRequests.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  EventAvailable as LeaveIcon,
  AddCircle as AddIcon,
  Person as PersonIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Universal Components
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import SearchBar from '../../components/common/filters/SearchBar';
import FilterBar from '../../components/common/filters/FilterBar';
import { EmptyState } from '../../components/common';

// Leave-Specific Components
import { LeaveRequestCard, PTOBalanceCard } from './components';

// Services
import leaveService from '../../services/leaveService';

// Models
import {
  LEAVE_STATUS,
  LEAVE_STATUS_OPTIONS
} from './models/leaveModels';

const MyRequests = () => {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('');
  
  // Leave types list
  const [leaveTypes, setLeaveTypes] = useState([]);
  
  // Current user info
  const [currentUser, setCurrentUser] = useState(null);
  
  // PTO Balance
  const [ptoBalance, setPtoBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  
  // Success message
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch current user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const employee = JSON.parse(localStorage.getItem('employee'));
    setCurrentUser({ ...user, ...employee });
  }, []);

  // Fetch PTO Balance
  useEffect(() => {
    fetchPTOBalance();
  }, []);

  // Fetch leave types
  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  // Fetch leave requests
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, leaveTypeFilter, leaveRequests]);

  const fetchPTOBalance = async () => {
    try {
      setLoadingBalance(true);
      const response = await leaveService.getMyBalance();
      setPtoBalance(response);
    } catch (err) {
      console.error('Error fetching PTO balance:', err);
    } finally {
      setLoadingBalance(false);
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      const response = await leaveService.getLeaveTypes();
      setLeaveTypes(response);
    } catch (err) {
      console.error('Error fetching leave types:', err);
    }
  };

  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await leaveService.getMyRequests();
      let data = Array.isArray(response) ? response : [];
      
      // Sort by requested date (newest first)
      data.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
      
      setLeaveRequests(data);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      setError(err.message || 'Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leaveRequests];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(req => {
        const leaveTypeName = (req.leaveType || '').toLowerCase();
        const reason = (req.reason || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return leaveTypeName.includes(search) || reason.includes(search);
      });
    }
    
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(req => req.status === statusFilter);
    }
    
    // Filter by leave type
    if (leaveTypeFilter) {
      filtered = filtered.filter(req => req.leaveType === leaveTypeFilter);
    }
    
    setFilteredRequests(filtered);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setLeaveTypeFilter('');
  };

  const handleViewRequest = (leaveRequestId) => {
    console.log('View request:', leaveRequestId);
    // TODO: Navigate to view details page or open modal
  };

  const handleCancelRequest = async (leaveRequestId) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }

    try {
      await leaveService.cancelRequest(leaveRequestId);
      setSuccessMessage('Leave request cancelled successfully');
      setShowSuccess(true);
      fetchLeaveRequests();
    } catch (err) {
      console.error('Error cancelling request:', err);
      setError(err.message || 'Failed to cancel leave request');
    }
  };

  const handleRequestLeave = () => {
    navigate('/leave/request');
  };

  // Header chips
  const headerChips = currentUser ? [
    { icon: <PersonIcon />, label: currentUser.email },
    { icon: <BadgeIcon />, label: currentUser.role?.roleName || currentUser.role || 'User' }
  ] : [];

  // Filter options
  const filterOptions = [
    {
      id: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: (e) => setStatusFilter(e.target.value),
      options: [
        { value: '', label: 'All Statuses' },
        ...LEAVE_STATUS_OPTIONS.filter(opt => opt.value !== '')
      ]
    },
    {
      id: 'leaveType',
      label: 'Leave Type',
      value: leaveTypeFilter,
      onChange: (e) => setLeaveTypeFilter(e.target.value),
      options: [
        { value: '', label: 'All Types' },
        ...leaveTypes.map(type => ({
          value: type.typeName,
          label: type.typeName
        }))
      ]
    }
  ];

  // Calculate stats
  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === LEAVE_STATUS.PENDING).length,
    approved: leaveRequests.filter(r => r.status === LEAVE_STATUS.APPROVED).length,
    rejected: leaveRequests.filter(r => r.status === LEAVE_STATUS.REJECTED).length
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Page Header */}
        <PageHeader
          icon={LeaveIcon}
          title="My Leave Requests"
          subtitle="View and manage your leave requests"
          chips={headerChips}
          actionButton={{
            label: 'Request Leave',
            icon: <AddIcon />,
            onClick: handleRequestLeave
          }}
          backgroundColor="linear-gradient(135deg, #6AB4A8 0%, #559089 100%)"
        />

        {/* PTO Balance Card - Full Width on Top */}
        <Box sx={{ mb: 3 }}>
          <PTOBalanceCard
            balance={ptoBalance}
            loading={loadingBalance}
            onRequestLeave={handleRequestLeave}
          />
        </Box>

        {/* Statistics Cards Row */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Total Requests */}
          <Grid item xs={6} sm={6} md={3}>
            <Box sx={{
              p: 2.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
              textAlign: 'center'
            }}>
              <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500, display: 'block', mb: 1 }}>
                Total Requests
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.total}
              </Typography>
            </Box>
          </Grid>

          {/* Pending */}
          <Grid item xs={6} sm={6} md={3}>
            <Box sx={{
              p: 2.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(240, 147, 251, 0.2)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
              textAlign: 'center'
            }}>
              <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500, display: 'block', mb: 1 }}>
                Pending
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.pending}
              </Typography>
            </Box>
          </Grid>

          {/* Approved */}
          <Grid item xs={6} sm={6} md={3}>
            <Box sx={{
              p: 2.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(79, 172, 254, 0.2)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
              textAlign: 'center'
            }}>
              <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500, display: 'block', mb: 1 }}>
                Approved
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.approved}
              </Typography>
            </Box>
          </Grid>

          {/* Rejected */}
          <Grid item xs={6} sm={6} md={3}>
            <Box sx={{
              p: 2.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(250, 112, 154, 0.2)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
              textAlign: 'center'
            }}>
              <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500, display: 'block', mb: 1 }}>
                Rejected
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.rejected}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Box sx={{ mb: 3 }}>
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by leave type or reason..."
          />
          <FilterBar
            filters={filterOptions}
            onClearFilters={handleClearFilters}
          />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Section Header */}
        <Box sx={{ 
          mb: 2, 
          pb: 1, 
          borderBottom: '2px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
              Leave Requests
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {loading ? 'Loading...' : `${filteredRequests.length} ${filteredRequests.length === 1 ? 'request' : 'requests'} found`}
            </Typography>
          </Box>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Leave Request Cards (using Leave component) */}
        {!loading && filteredRequests.length > 0 && (
          <Grid container spacing={2}>
            {filteredRequests.map((request) => (
              <Grid item xs={12} key={request.leaveRequestId}>
                <LeaveRequestCard
                  request={{
                    leaveRequestId: request.leaveRequestId,
                    leaveTypeName: request.leaveType,
                    startDate: request.startDate,
                    endDate: request.endDate,
                    totalDays: request.totalDays,
                    reason: request.reason,
                    status: request.status,
                    requestedAt: request.requestedAt,
                    approverName: request.approvedBy,
                    approvedAt: request.approvedAt,
                    rejectionReason: request.rejectionReason
                  }}
                  viewMode="employee"
                  onCancel={request.canCancel ? () => handleCancelRequest(request.leaveRequestId) : null}
                  onView={() => handleViewRequest(request.leaveRequestId)}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State (using universal component) */}
        {!loading && filteredRequests.length === 0 && (
          <EmptyState
            icon={LeaveIcon}
            title="No Leave Requests Found"
            description={
              searchTerm || statusFilter || leaveTypeFilter
                ? "Try adjusting your filters to see more results"
                : "You haven't submitted any leave requests yet"
            }
            actionButton={
              !searchTerm && !statusFilter && !leaveTypeFilter
                ? {
                    label: 'Request Leave',
                    onClick: handleRequestLeave
                  }
                : undefined
            }
          />
        )}

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setShowSuccess(false)} 
            severity="success" 
            sx={{ width: '100%' }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default MyRequests;