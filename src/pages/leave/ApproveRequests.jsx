// src/pages/leave/ApproveRequests.jsx
// Approve Leave Requests Page - Directors/Executives/Admin

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
  DialogActions,
  TextField,
  Chip
} from '@mui/material';
import {
  AssignmentTurnedIn as ApproveIcon,
  Refresh as RefreshIcon,
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon
} from '@mui/icons-material';

// Universal Components
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import SearchBar from '../../components/common/filters/SearchBar';
import FilterBar from '../../components/common/filters/FilterBar';
import { EmptyState, Loading } from '../../components/common';

// Leave Components
import { LeaveRequestCard } from './components';

// Services
import leaveService from '../../services/leaveService';

// Models
import {
  filterLeaveRequests,
  sortLeaveRequests,
  getInitialFilterState
} from './models/leaveModels';

const ApproveRequests = () => {
  
  // State
  const [pendingRequests, setPendingRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState(getInitialFilterState());
  
  // Approval/Rejection dialogs
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  
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
  }, [filters, pendingRequests]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending approvals and leave types
      const [requestsResponse, typesResponse] = await Promise.all([
        leaveService.getPendingApprovals(),
        leaveService.getLeaveTypes()
      ]);
      
      setPendingRequests(requestsResponse.requests || []);
      setFilteredRequests(requestsResponse.requests || []);
      setLeaveTypes(typesResponse);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load pending approvals');
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchData();
      setSuccessMessage('Pending requests refreshed successfully');
      setShowSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = filterLeaveRequests(pendingRequests, filters);
    filtered = sortLeaveRequests(filtered, 'requestedAt', 'asc'); // Oldest first
    setFilteredRequests(filtered);
  };

  const handleSearchChange = (value) => {
    setFilters({ ...filters, searchTerm: value });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const handleApproveClick = (request) => {
    setSelectedRequest(request);
    setApprovalNotes('');
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };

  const handleApproveConfirm = async () => {
    try {
      setProcessing(true);
      await leaveService.approveRequest(selectedRequest.leaveRequestId, approvalNotes);
      
      setSuccessMessage(`Leave request approved for ${selectedRequest.employee.fullName}`);
      setShowSuccess(true);
      setApproveDialogOpen(false);
      setSelectedRequest(null);
      setApprovalNotes('');
      
      // Refresh data
      await fetchData();
      
    } catch (err) {
      setError(err.message || 'Failed to approve leave request');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      setError('Rejection reason is required');
      return;
    }

    try {
      setProcessing(true);
      await leaveService.rejectRequest(selectedRequest.leaveRequestId, rejectionReason);
      
      setSuccessMessage(`Leave request rejected for ${selectedRequest.employee.fullName}`);
      setShowSuccess(true);
      setRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason('');
      
      // Refresh data
      await fetchData();
      
    } catch (err) {
      setError(err.message || 'Failed to reject leave request');
    } finally {
      setProcessing(false);
    }
  };

  // Leave type options for filter
  const leaveTypeOptions = [
    { value: '', label: 'All Leave Types' },
    ...leaveTypes.map(type => ({ value: type.typeName, label: type.typeName }))
  ];

  // Department filter (if user has access to multiple departments)
  const departments = [...new Set(pendingRequests.map(r => r.employee?.department).filter(Boolean))];
  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...departments.map(dept => ({ value: dept, label: dept }))
  ];

  if (loading) {
    return <Loading message="Loading pending approvals..." />;
  }

  return (
    <Layout>
      <PageHeader
        icon={<ApproveIcon />}
        title="Approve Leave Requests"
        subtitle="Review and approve pending leave requests"
        chips={[
          { 
            label: `${pendingRequests.length} Pending`, 
            color: '#FDB94E',
            icon: '⏳'
          },
          { 
            label: currentUser?.roleName || 'Approver', 
            color: '#667eea' 
          }
        ]}
        actions={
          <Button
            variant="outlined"
            startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{ borderColor: '#667eea', color: '#667eea' }}
          >
            Refresh
          </Button>
        }
      />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <SearchBar
          value={filters.searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by employee name or reason..."
        />
        
        <FilterBar
          filters={[
            {
              type: 'select',
              label: 'Leave Type',
              value: filters.leaveTypeFilter,
              onChange: (value) => handleFilterChange('leaveTypeFilter', value),
              options: leaveTypeOptions
            },
            ...(departments.length > 1 ? [{
              type: 'select',
              label: 'Department',
              value: filters.departmentFilter || '',
              onChange: (value) => handleFilterChange('departmentFilter', value),
              options: departmentOptions
            }] : [])
          ]}
        />
      </Box>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={<ApproveIcon sx={{ fontSize: 80 }} />}
          title="No Pending Approvals"
          description={
            filters.searchTerm || filters.leaveTypeFilter
              ? "No requests match your current filters. Try adjusting your search criteria."
              : "There are no leave requests pending your approval at this time."
          }
        />
      ) : (
        <>
          <Grid container spacing={2}>
            {filteredRequests.map((request) => (
              <Grid item xs={12} md={6} lg={4} key={request.leaveRequestId}>
                <Box sx={{ position: 'relative' }}>
                  <LeaveRequestCard
                    request={request}
                    showEmployee={true}
                  />
                  
                  {/* Action Buttons Overlay */}
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      right: 16,
                      display: 'flex',
                      gap: 1
                    }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<AcceptIcon />}
                      onClick={() => handleApproveClick(request)}
                      sx={{
                        backgroundColor: '#4caf50',
                        '&:hover': { backgroundColor: '#45a049' }
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<RejectIcon />}
                      onClick={() => handleRejectClick(request)}
                      sx={{
                        borderColor: '#f44336',
                        color: '#f44336',
                        '&:hover': { 
                          borderColor: '#d32f2f',
                          backgroundColor: 'rgba(244, 67, 54, 0.05)'
                        }
                      }}
                    >
                      Reject
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Results Summary */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredRequests.length} of {pendingRequests.length} pending requests
            </Typography>
          </Box>
        </>
      )}

      {/* Approve Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => !processing && setApproveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Approve Leave Request</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Approve leave request for <strong>{selectedRequest.employee?.fullName}</strong>
              </Typography>
              
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Request Details
                </Typography>
                <Typography variant="body2">
                  <strong>Leave Type:</strong> {selectedRequest.leaveType}
                </Typography>
                <Typography variant="body2">
                  <strong>Dates:</strong> {new Date(selectedRequest.startDate).toLocaleDateString()} - {new Date(selectedRequest.endDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Total Days:</strong> {selectedRequest.totalDays}
                </Typography>
                {selectedRequest.reason && (
                  <Typography variant="body2">
                    <strong>Reason:</strong> {selectedRequest.reason}
                  </Typography>
                )}
              </Box>

              <TextField
                fullWidth
                label="Approval Notes (Optional)"
                multiline
                rows={3}
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Add any notes or comments for the employee..."
                inputProps={{ maxLength: 500 }}
                helperText={`${approvalNotes.length}/500 characters`}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setApproveDialogOpen(false)} 
            disabled={processing}
            sx={{ color: '#667eea' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApproveConfirm}
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : <AcceptIcon />}
            sx={{ 
              backgroundColor: '#4caf50',
              color: 'white',
              '&:hover': { backgroundColor: '#45a049' }
            }}
          >
            {processing ? 'Approving...' : 'Approve Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => !processing && setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Leave Request</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Reject leave request for <strong>{selectedRequest.employee?.fullName}</strong>
              </Typography>
              
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Request Details
                </Typography>
                <Typography variant="body2">
                  <strong>Leave Type:</strong> {selectedRequest.leaveType}
                </Typography>
                <Typography variant="body2">
                  <strong>Dates:</strong> {new Date(selectedRequest.startDate).toLocaleDateString()} - {new Date(selectedRequest.endDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Total Days:</strong> {selectedRequest.totalDays}
                </Typography>
              </Box>

              <Alert severity="warning" sx={{ mb: 2 }}>
                Please provide a clear reason for rejecting this request. The employee will see this message.
              </Alert>

              <TextField
                fullWidth
                required
                label="Rejection Reason"
                multiline
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this request is being rejected..."
                error={!rejectionReason.trim() && error}
                helperText={
                  !rejectionReason.trim() && error 
                    ? 'Rejection reason is required' 
                    : `${rejectionReason.length}/500 characters`
                }
                inputProps={{ maxLength: 500 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setRejectDialogOpen(false)} 
            disabled={processing}
            sx={{ color: '#667eea' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRejectConfirm}
            disabled={processing || !rejectionReason.trim()}
            startIcon={processing ? <CircularProgress size={20} /> : <RejectIcon />}
            sx={{ 
              backgroundColor: '#f44336',
              color: 'white',
              '&:hover': { backgroundColor: '#d32f2f' }
            }}
          >
            {processing ? 'Rejecting...' : 'Reject Request'}
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

export default ApproveRequests;