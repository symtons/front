// src/pages/recruitment/ApplicationReviewDashboard.jsx
/**
 * Application Review Dashboard - COMPLETELY NEW LAYOUT
 * Card-based design with modern, visual approach
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  IconButton,
  Tooltip,
  Snackbar,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Divider,
  Tab,
  Tabs,
  Badge
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  NoteAdd as NotesIcon,
  Description as ApplicationIcon,
  Refresh as RefreshIcon,
  PersonAdd as HireIcon,
  AccessTime as TimeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import SearchBar from '../../components/common/filters/SearchBar';
import Loading from '../../components/common/feedback/Loading';
import EmptyState from '../../components/common/feedback/EmptyState';
import ConfirmDialog from '../../components/common/feedback/ConfirmDialog';
import applicationReviewService from '../../services/applicationReviewService';
import api from '../../services/authService';

// Import dialog components
import ApplicationDetailDialog from './components/ApplicationDetailDialog';
import RejectApplicationDialog from './components/RejectApplicationDialog';
import AddNotesDialog from './components/AddNotesDialog';
import HireDialog from './components/HireDialog';

// Import from models
import {
  APPLICATION_STATUS,
  APPROVAL_STATUS,
  getStatusColor,
  getApprovalStatusColor,
  formatApplicationDate,
  formatPhoneNumber,
  formatFullName,
  transformApplicationsForDisplay,
  prepareFilterParams
} from './models/applicationReviewModels';

const ApplicationReviewDashboard = () => {
  const navigate = useNavigate();
  
  // Data states
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Tab filter state
  const [activeTab, setActiveTab] = useState(0); // 0=All, 1=Pending, 2=Approved, 3=Rejected
  
  // Statistics
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });
  
  // Dialog states
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [hireDialogOpen, setHireDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  
  // Loading states
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [addingNotes, setAddingNotes] = useState(false);
  
  // Success states
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchApplications();
    fetchStatistics();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationReviewService.getAllApplications({});
      const transformedApps = transformApplicationsForDisplay(response.applications || []);
      setApplications(transformedApps);
      setError('');
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const data = await applicationReviewService.getStatistics();
      setStats(data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter applications based on active tab and search
  const getFilteredApplications = () => {
    let filtered = applications;
    
    // Filter by tab
    switch (activeTab) {
      case 1: // Pending
        filtered = filtered.filter(app => app.approvalStatus === 'Pending');
        break;
      case 2: // Approved
        filtered = filtered.filter(app => app.approvalStatus === 'Approved');
        break;
      case 3: // Rejected
        filtered = filtered.filter(app => app.approvalStatus === 'Rejected');
        break;
      default: // All
        break;
    }
    
    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.fullName?.toLowerCase().includes(term) ||
        app.email?.toLowerCase().includes(term) ||
        app.phoneNumber?.includes(term) ||
        app.positionAppliedFor?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  // Dialog handlers
  // const handleViewApplication = (application) => {
  //   setSelectedApplication(application);
  //   setDetailDialogOpen(true);
  // };
  const handleViewApplication = async (application) => {
  try {
    // ✅ FIX: Fetch FULL application data from API
    console.log('Fetching full application data for ID:', application.applicationId);
    
    const fullApplicationData = await applicationReviewService.getApplicationById(application.applicationId);
    
    console.log('Full application data received:', fullApplicationData);
    
    // Set the FULL data (not the transformed/limited data)
    setSelectedApplication(fullApplicationData);
    setDetailDialogOpen(true);
  } catch (err) {
    console.error('Error fetching application details:', err);
    setError('Failed to load application details');
  }
};

  const handleApproveClick = (application) => {
    setSelectedApplication(application);
    setApproveDialogOpen(true);
  };

  const handleApproveConfirm = async () => {
    try {
      setApproving(true);
      await applicationReviewService.approveApplication(
        selectedApplication.applicationId,
        APPROVAL_STATUS.APPROVED
      );
      setApproveDialogOpen(false);
      setSelectedApplication(null);
      setSuccessMessage('Application approved successfully');
      setShowSuccess(true);
      fetchApplications();
      fetchStatistics();
    } catch (err) {
      setError(err.message || 'Failed to approve application');
    } finally {
      setApproving(false);
    }
  };

  const handleRejectClick = (application) => {
    setSelectedApplication(application);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async (rejectionReason) => {
    try {
      setRejecting(true);
      await applicationReviewService.rejectApplication(
        selectedApplication.applicationId,
        rejectionReason
      );
      setRejectDialogOpen(false);
      setSelectedApplication(null);
      setSuccessMessage('Application rejected successfully');
      setShowSuccess(true);
      fetchApplications();
      fetchStatistics();
    } catch (err) {
      setError(err.message || 'Failed to reject application');
    } finally {
      setRejecting(false);
    }
  };

  const handleAddNotesClick = (application) => {
    setSelectedApplication(application);
    setNotesDialogOpen(true);
  };

  const handleAddNotesConfirm = async (notes) => {
    try {
      setAddingNotes(true);
      await applicationReviewService.addNotes(
        selectedApplication.applicationId,
        notes
      );
      setNotesDialogOpen(false);
      setSelectedApplication(null);
      setSuccessMessage('Notes added successfully');
      setShowSuccess(true);
      fetchApplications();
    } catch (err) {
      setError(err.message || 'Failed to add notes');
    } finally {
      setAddingNotes(false);
    }
  };

  const handleRefresh = () => {
    fetchApplications();
    fetchStatistics();
  };

  const handleHireClick = (application) => {
    setSelectedApplication(application);
    setHireDialogOpen(true);
  };

  const handleHireSuccess = (result) => {
    setSuccessMessage(`Candidate hired successfully! Employee ID: ${result.employeeCode}`);
    setShowSuccess(true);
    fetchApplications();
    fetchStatistics();
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'Pending':
        return { bg: '#FFF4E5', color: '#FDB94E', border: '#FDB94E' };
      case 'Approved':
        return { bg: '#E8F5E9', color: '#6AB4A8', border: '#6AB4A8' };
      case 'Rejected':
        return { bg: '#FFEBEE', color: '#f44336', border: '#f44336' };
      default:
        return { bg: '#F5F5F5', color: '#666', border: '#666' };
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading applications..." />
      </Layout>
    );
  }

  const filteredApplications = getFilteredApplications();

  return (
    <Layout>
      <PageHeader
        title="Job Applications"
        subtitle="Review and manage candidate applications"
        icon={ApplicationIcon}
        actions={
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              backgroundColor: '#6AB4A8',
              '&:hover': { backgroundColor: '#559089' }
            }}
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

      {/* Statistics Summary Bar */}
      <Box 
        sx={{ 
          mb: 3, 
          p: 3, 
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea' }}>
            {stats.totalApplications}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Applications
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#FDB94E' }}>
            {stats.pendingApplications}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pending Review
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#6AB4A8' }}>
            {stats.approvedApplications}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Approved
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#9E9E9E' }}>
            {stats.rejectedApplications}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rejected
          </Typography>
        </Box>
      </Box>

      {/* Tabs for filtering */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              minHeight: 60
            },
            '& .Mui-selected': {
              color: '#667eea'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#667eea',
              height: 3
            }
          }}
        >
          <Tab 
            label={
              <Badge badgeContent={stats.totalApplications} color="primary">
                All Applications
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={stats.pendingApplications} sx={{ '& .MuiBadge-badge': { backgroundColor: '#FDB94E' } }}>
                Pending
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={stats.approvedApplications} sx={{ '& .MuiBadge-badge': { backgroundColor: '#6AB4A8' } }}>
                Approved
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={stats.rejectedApplications} sx={{ '& .MuiBadge-badge': { backgroundColor: '#9E9E9E' } }}>
                Rejected
              </Badge>
            } 
          />
        </Tabs>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name, email, phone, or position..."
        />
      </Box>

      {/* Applications Grid - Card Layout */}
      {filteredApplications.length === 0 ? (
        <EmptyState
          icon="search"
          title="No Applications Found"
          message={searchTerm ? "No applications match your search criteria." : "No applications in this category."}
          actionButton={searchTerm ? {
            label: 'Clear Search',
            onClick: () => setSearchTerm('')
          } : null}
        />
      ) : (
        <Grid container spacing={3}>
          {filteredApplications.map((application) => {
            const statusColors = getStatusChipColor(application.approvalStatus);
            
            return (
              <Grid item xs={12} sm={6} lg={4} key={application.applicationId}>
                <Card 
                  elevation={3}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  {/* Card Header with Avatar and Status */}
                  <Box 
                    sx={{ 
                      p: 2.5, 
                      backgroundColor: '#f8f9fa',
                      borderBottom: '1px solid #e0e0e0'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            backgroundColor: '#667eea',
                            fontSize: '1.25rem',
                            fontWeight: 700
                          }}
                        >
                          {application.fullName?.charAt(0) || 'A'}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                            {application.fullName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <WorkIcon sx={{ fontSize: 14, color: '#6AB4A8' }} />
                            <Typography variant="body2" color="text.secondary">
                              {application.positionAppliedFor}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Chip
                        label={application.approvalStatus}
                        size="small"
                        sx={{
                          backgroundColor: statusColors.bg,
                          color: statusColors.color,
                          fontWeight: 600,
                          border: `1px solid ${statusColors.border}`
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Card Content */}
                  <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                    {/* Contact Information */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <EmailIcon sx={{ fontSize: 16, color: '#667eea' }} />
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          {application.email || 'No email provided'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: '#667eea' }} />
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          {application.phoneNumber || 'No phone provided'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon sx={{ fontSize: 16, color: '#667eea' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          Applied: {application.submittedAtFormatted}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  {/* Card Actions */}
                  <CardActions sx={{ p: 2, pt: 0, gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => handleViewApplication(application)}
                      sx={{ 
                        color: '#667eea',
                        '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' }
                      }}
                    >
                      View
                    </Button>
                    
                    {application.approvalStatus === 'Pending' && (
                      <>
                        <Button
                          size="small"
                          startIcon={<ApproveIcon />}
                          onClick={() => handleApproveClick(application)}
                          sx={{ 
                            color: '#6AB4A8',
                            '&:hover': { backgroundColor: 'rgba(106, 180, 168, 0.1)' }
                          }}
                        >
                          Approve
                        </Button>
                        
                        <Button
                          size="small"
                          startIcon={<RejectIcon />}
                          onClick={() => handleRejectClick(application)}
                          sx={{ 
                            color: '#f44336',
                            '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    
                    <Button
                      size="small"
                      startIcon={<NotesIcon />}
                      onClick={() => handleAddNotesClick(application)}
                      sx={{ 
                        color: '#FDB94E',
                        '&:hover': { backgroundColor: 'rgba(253, 185, 78, 0.1)' }
                      }}
                    >
                      Notes
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Dialogs */}
      <ApplicationDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        application={selectedApplication}
        onApprove={handleApproveClick}
        onReject={handleRejectClick}
        onAddNotes={handleAddNotesClick}
      />

      <ConfirmDialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        onConfirm={handleApproveConfirm}
        title="Approve Application?"
        message={`Are you sure you want to approve the application from ${selectedApplication?.fullName}?`}
        variant="success"
        confirmText="Approve"
        cancelText="Cancel"
      />

      <RejectApplicationDialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        onConfirm={handleRejectConfirm}
        application={selectedApplication}
        loading={rejecting}
      />

      <AddNotesDialog
        open={notesDialogOpen}
        onClose={() => setNotesDialogOpen(false)}
        onConfirm={handleAddNotesConfirm}
        application={selectedApplication}
        loading={addingNotes}
      />

      <HireDialog
        open={hireDialogOpen}
        onClose={() => setHireDialogOpen(false)}
        application={selectedApplication}
        onSuccess={handleHireSuccess}
      />

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
    </Layout>
  );
};

export default ApplicationReviewDashboard;