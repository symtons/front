// src/pages/hr-actions/HRActionsReviewDashboard.jsx
// HR Actions Review Dashboard - HR/Executive Reviews Requests

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  Grid,
  Tabs,
  Tab,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Assignment as HRIcon,
  Refresh as RefreshIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon
} from '@mui/icons-material';

// Universal Components
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import SearchBar from '../../components/common/filters/SearchBar';
import { EmptyState, Loading } from '../../components/common';

// HR Actions Components
import HRActionCard from './components/HRActionCard';

// Services
import hrActionService from '../../services/hrActionService';

// Models
import {
  filterRequests,
  getInitialFilterState
} from './models/hrActionModels';

const HRActionsReviewDashboard = () => {
  
  // State
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState(getInitialFilterState());
  const [selectedTab, setSelectedTab] = useState('all');
  
  // Dialog states
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvalComments, setApprovalComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Success states
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load requests
  useEffect(() => {
    fetchRequests();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [requests, filters, selectedTab]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await hrActionService.getPendingReview();
      setRequests(data.requests || data || []);
    } catch (err) {
      setError(err.message || 'Failed to load requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...requests];
    
    // Filter by tab (action type)
    if (selectedTab !== 'all') {
      filtered = filtered.filter(req => req.actionType === selectedTab);
    }
    
    // Apply other filters
    filtered = filterRequests(filtered, filters);
    
    setFilteredRequests(filtered);
  };

  const handleSearchChange = (searchTerm) => {
    setFilters({ ...filters, searchTerm });
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Approve handlers
  const handleApproveClick = (request) => {
    setSelectedRequest(request);
    setApprovalComments('');
    setApproveDialogOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!selectedRequest) return;
    
    try {
      setProcessing(true);
      await hrActionService.approveRequest(selectedRequest.requestId, approvalComments);
      
      setSuccessMessage(`Request ${selectedRequest.requestNumber} approved successfully!`);
      setShowSuccess(true);
      setApproveDialogOpen(false);
      
      // Refresh list
      await fetchRequests();
    } catch (err) {
      setError(err.message || 'Failed to approve request');
    } finally {
      setProcessing(false);
    }
  };

  // Reject handlers
  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedRequest) return;
    
    if (!rejectionReason.trim() || rejectionReason.trim().length < 10) {
      setError('Please provide a detailed rejection reason (minimum 10 characters)');
      return;
    }
    
    try {
      setProcessing(true);
      await hrActionService.rejectRequest(selectedRequest.requestId, rejectionReason);
      
      setSuccessMessage(`Request ${selectedRequest.requestNumber} rejected.`);
      setShowSuccess(true);
      setRejectDialogOpen(false);
      
      // Refresh list
      await fetchRequests();
    } catch (err) {
      setError(err.message || 'Failed to reject request');
    } finally {
      setProcessing(false);
    }
  };

  const handleViewDetails = (request) => {
    // TODO: Open detail dialog or navigate to detail page
    console.log('View request details:', request);
  };

  // Get counts for tabs
  const getCounts = () => {
    return {
      all: requests.length,
      'Rate Change': requests.filter(r => r.actionType === 'Rate Change').length,
      'Transfer': requests.filter(r => r.actionType === 'Transfer').length,
      'Promotion': requests.filter(r => r.actionType === 'Promotion').length,
      'Status Change': requests.filter(r => r.actionType === 'Status Change').length,
      'Personal Info Change': requests.filter(r => r.actionType === 'Personal Info Change').length,
    };
  };

  const counts = getCounts();

  if (loading) return <Loading message="Loading HR action requests..." />;

  return (
    <Layout>
      <PageHeader
        icon={HRIcon}
        title="HR Actions Review"
        subtitle="Review and approve pending HR action requests"
        action={
          <Button
            variant="outlined"
            startIcon={refreshing ? <RefreshIcon className="spin" /> : <RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            Refresh
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Tabs Filter */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            label={<Badge badgeContent={counts.all} color="primary">All</Badge>} 
            value="all" 
          />
          <Tab 
            label={<Badge badgeContent={counts['Rate Change']} color="primary">Rate Change</Badge>} 
            value="Rate Change" 
          />
          <Tab 
            label={<Badge badgeContent={counts['Transfer']} color="primary">Transfer</Badge>} 
            value="Transfer" 
          />
          <Tab 
            label={<Badge badgeContent={counts['Promotion']} color="primary">Promotion</Badge>} 
            value="Promotion" 
          />
          <Tab 
            label={<Badge badgeContent={counts['Status Change']} color="primary">Status</Badge>} 
            value="Status Change" 
          />
          <Tab 
            label={<Badge badgeContent={counts['Personal Info Change']} color="primary">Personal Info</Badge>} 
            value="Personal Info Change" 
          />
        </Tabs>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <SearchBar
          value={filters.searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by request number, employee name..."
        />
      </Box>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={<HRIcon sx={{ fontSize: 80 }} />}
          title="No Pending Requests"
          description={
            filters.searchTerm
              ? "No requests match your search criteria."
              : "There are no pending HR action requests at this time."
          }
        />
      ) : (
        <Grid container spacing={3}>
          {filteredRequests.map((request) => (
            <Grid item xs={12} md={6} lg={4} key={request.requestId}>
              <HRActionCard
                request={request}
                showActions={true}
                showEmployee={true}
                onView={handleViewDetails}
                onApprove={handleApproveClick}
                onReject={handleRejectClick}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Approve HR Action Request
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Are you sure you want to approve this request?
              </Typography>
              <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Request: {selectedRequest.requestNumber}
                </Typography>
                <Typography variant="body2">
                  Type: {selectedRequest.actionType}
                </Typography>
                <Typography variant="body2">
                  Employee: {selectedRequest.employee?.fullName}
                </Typography>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Approval Comments (Optional)"
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                placeholder="Add any comments or notes..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={handleApproveConfirm}
            disabled={processing}
            startIcon={processing ? null : <ApproveIcon />}
          >
            {processing ? 'Approving...' : 'Approve Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Reject HR Action Request
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Please provide a reason for rejecting this request:
              </Typography>
              <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Request: {selectedRequest.requestNumber}
                </Typography>
                <Typography variant="body2">
                  Type: {selectedRequest.actionType}
                </Typography>
                <Typography variant="body2">
                  Employee: {selectedRequest.employee?.fullName}
                </Typography>
              </Box>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Rejection Reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide detailed reason for rejection (minimum 10 characters)"
                error={rejectionReason.length > 0 && rejectionReason.length < 10}
                helperText={rejectionReason.length > 0 && rejectionReason.length < 10 ? 'Minimum 10 characters required' : ''}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleRejectConfirm}
            disabled={processing || !rejectionReason.trim() || rejectionReason.length < 10}
            startIcon={processing ? null : <RejectIcon />}
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

export default HRActionsReviewDashboard;