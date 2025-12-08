// src/pages/leave/MyRequests.jsx
// My Leave Requests Page - View All Requests

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  EventAvailable as LeaveIcon,
  AddCircle as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Universal Components
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import SearchBar from '../../components/common/filters/SearchBar';
import FilterBar from '../../components/common/filters/FilterBar';
import { EmptyState, Loading } from '../../components/common';

// Leave Components
import { LeaveRequestCard, PTOBalanceCard } from './components';

// Services
import leaveService from '../../services/leaveService';

// Models
import {
  LEAVE_STATUS_OPTIONS,
  filterLeaveRequests,
  sortLeaveRequests,
  calculateLeaveStatistics,
  getInitialFilterState
} from './models/leaveModels';

const MyRequests = () => {
  const navigate = useNavigate();
  
  // State
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [ptoBalance, setPtoBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState(getInitialFilterState());
  
  // Cancel dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  
  // Success/error messages
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Current user
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const employee = JSON.parse(localStorage.getItem('employee'));
    setCurrentUser({ ...user, ...employee });
    
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, leaveRequests]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch requests, types, and balance in parallel
      const [requestsResponse, typesResponse, balanceResponse] = await Promise.all([
        leaveService.getMyRequests(),
        leaveService.getLeaveTypes(),
        leaveService.getMyBalance()
      ]);
      
      setLeaveRequests(requestsResponse);
      setFilteredRequests(requestsResponse);
      setLeaveTypes(typesResponse);
      setPtoBalance(balanceResponse);
      setLoadingBalance(false);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load leave requests');
      setLoading(false);
      setLoadingBalance(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchData();
      setSuccessMessage('Leave requests refreshed successfully');
      setShowSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = filterLeaveRequests(leaveRequests, filters);
    filtered = sortLeaveRequests(filtered, 'requestedAt', 'desc');
    setFilteredRequests(filtered);
  };

  const handleSearchChange = (value) => {
    setFilters({ ...filters, searchTerm: value });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const handleCancelClick = (leaveRequestId) => {
    setRequestToCancel(leaveRequestId);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    try {
      setCancelling(true);
      await leaveService.cancelRequest(requestToCancel);
      
      setSuccessMessage('Leave request cancelled successfully');
      setShowSuccess(true);
      setCancelDialogOpen(false);
      setRequestToCancel(null);
      
      // Refresh data
      await fetchData();
      
    } catch (err) {
      setError(err.message || 'Failed to cancel leave request');
    } finally {
      setCancelling(false);
    }
  };

  const handleCancelDialogClose = () => {
    if (!cancelling) {
      setCancelDialogOpen(false);
      setRequestToCancel(null);
    }
  };

  // Calculate statistics
  const stats = calculateLeaveStatistics(leaveRequests);

  // Leave type options for filter
  const leaveTypeOptions = [
    { value: '', label: 'All Leave Types' },
    ...leaveTypes.map(type => ({ value: type.typeName, label: type.typeName }))
  ];

  if (loading) {
    return <Loading message="Loading your leave requests..." />;
  }

  return (
    <Layout>
      <PageHeader
        icon={<LeaveIcon />}
        title="My Leave Requests"
        subtitle="View and manage your leave requests"
        chips={[
          { label: `${stats.total} Total`, color: '#667eea' },
          { label: `${stats.pending} Pending`, color: '#FDB94E' },
          { label: `${stats.approved} Approved`, color: '#4caf50' }
        ]}
        actions={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{ borderColor: '#667eea', color: '#667eea' }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/leave/request')}
              sx={{
                backgroundColor: '#667eea',
                '&:hover': { backgroundColor: '#5568d3' }
              }}
            >
              New Request
            </Button>
          </Box>
        }
      />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column - Requests */}
        <Grid item xs={12} md={8}>
          {/* Search and Filters */}
          <Box sx={{ mb: 3 }}>
            <SearchBar
              value={filters.searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by reason..."
            />
            
            <FilterBar
              filters={[
                {
                  type: 'select',
                  label: 'Status',
                  value: filters.statusFilter,
                  onChange: (value) => handleFilterChange('statusFilter', value),
                  options: LEAVE_STATUS_OPTIONS
                },
                {
                  type: 'select',
                  label: 'Leave Type',
                  value: filters.leaveTypeFilter,
                  onChange: (value) => handleFilterChange('leaveTypeFilter', value),
                  options: leaveTypeOptions
                }
              ]}
            />
          </Box>

          {/* Requests List */}
          {filteredRequests.length === 0 ? (
            <EmptyState
              icon={<LeaveIcon sx={{ fontSize: 80 }} />}
              title="No Leave Requests Found"
              description={
                filters.searchTerm || filters.statusFilter || filters.leaveTypeFilter
                  ? "No requests match your current filters. Try adjusting your search criteria."
                  : "You haven't submitted any leave requests yet. Click 'New Request' to get started."
              }
              action={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/leave/request')}
                  sx={{
                    backgroundColor: '#667eea',
                    '&:hover': { backgroundColor: '#5568d3' }
                  }}
                >
                  Submit First Request
                </Button>
              }
            />
          ) : (
            <Grid container spacing={2}>
              {filteredRequests.map((request) => (
                <Grid item xs={12} key={request.leaveRequestId}>
                  <LeaveRequestCard
                    request={request}
                    onCancel={handleCancelClick}
                    showEmployee={false}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Results Summary */}
          {filteredRequests.length > 0 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredRequests.length} of {stats.total} requests
              </Typography>
            </Box>
          )}
        </Grid>

        {/* Right Column - PTO Balance & Stats */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            {/* PTO Balance Card */}
            <PTOBalanceCard 
              balance={ptoBalance} 
              loading={loadingBalance}
            />

            {/* Quick Stats */}
            {stats.total > 0 && (
              <Box sx={{ mt: 3, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Quick Stats
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#FDB94E' }}>
                        {stats.pending}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Pending
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50' }}>
                        {stats.approved}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Approved
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336' }}>
                        {stats.rejected}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Rejected
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                        {stats.approvedDays}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Days Approved
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancel Leave Request</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this leave request? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCancelDialogClose} 
            disabled={cancelling}
            sx={{ color: '#667eea' }}
          >
            No, Keep It
          </Button>
          <Button
            onClick={handleCancelConfirm}
            disabled={cancelling}
            startIcon={cancelling ? <CircularProgress size={20} /> : null}
            sx={{ 
              backgroundColor: '#f44336',
              color: 'white',
              '&:hover': { backgroundColor: '#d32f2f' }
            }}
          >
            {cancelling ? 'Cancelling...' : 'Yes, Cancel Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default MyRequests;