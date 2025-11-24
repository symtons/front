// src/pages/recruitment/ApplicationReviewDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  IconButton,
  Tooltip,
  Snackbar,
  Grid
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  NoteAdd as NotesIcon,
  Description as ApplicationIcon,
  Refresh as RefreshIcon,
  PersonAdd as HireIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import SearchBar from '../../components/common/filters/SearchBar';
import FilterBar from '../../components/common/filters/FilterBar';
import DataTable from '../../components/common/tables/DataTable';
import StatusChip from '../../components/common/display/StatusChip';
import InfoCard from '../../components/common/display/InfoCard';
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
  STATUS_FILTER_OPTIONS,
  APPROVAL_FILTER_OPTIONS,
  getStatusColor,
  getApprovalStatusColor,
  formatApplicationDate,
  formatPhoneNumber,
  formatFullName,
  getTimeSinceSubmission,
  transformApplicationsForDisplay,
  prepareFilterParams
} from './models/applicationReviewModels';

const ApplicationReviewDashboard = () => {
  const navigate = useNavigate();
  
  // Data states
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [approvalStatusFilter, setApprovalStatusFilter] = useState('');
  
  // Statistics
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });
  
  // Current user info
  const [currentUser, setCurrentUser] = useState(null);
  
  // Selected application
  const [selectedApplication, setSelectedApplication] = useState(null);
  
  // Dialog states
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [hireDialogOpen, setHireDialogOpen] = useState(false);
  
  // Loading states for actions
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [addingNotes, setAddingNotes] = useState(false);
  
  // Success message
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch current user
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    fetchApplications();
    fetchStatistics();
  }, [page, rowsPerPage, searchTerm, statusFilter, approvalStatusFilter]);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/Auth/Me');
      setCurrentUser(response.data);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = prepareFilterParams({
        page: page + 1,
        pageSize: rowsPerPage,
        searchTerm,
        status: statusFilter,
        approvalStatus: approvalStatusFilter
      });

      const response = await applicationReviewService.getAllApplications(params);
      const transformedApps = transformApplicationsForDisplay(response.applications || []);
      setApplications(transformedApps);
      setTotalCount(response.totalCount || 0);
      setError('');
    } catch (err) {
      console.error('Error fetching applications:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load applications';
      const statusCode = err.response?.status;

      if (statusCode === 401) {
        setError('Unauthorized: Please log in with Admin, Executive, or HR Manager role');
      } else if (statusCode === 403) {
        setError('Access Denied: You need Admin, Executive, or HR Manager role to view applications');
      } else {
        setError(`Error ${statusCode || ''}: ${errorMsg}`);
      }
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleFilterChange = (filterName, value) => {
    if (filterName === 'status') {
      setStatusFilter(value);
    } else if (filterName === 'approvalStatus') {
      setApprovalStatusFilter(value);
    }
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setApprovalStatusFilter('');
    setPage(0);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // ============================================
  // DIALOG HANDLERS
  // ============================================

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setDetailDialogOpen(true);
  };

  const handleApproveClick = (application) => {
    setSelectedApplication(application);
    setApproveDialogOpen(true);
  };

  const handleApproveConfirm = async () => {
    try {
      setApproving(true);
      await applicationReviewService.updateApprovalStatus(
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

  // Build chips for PageHeader
  const headerChips = currentUser
    ? [
        { icon: ApplicationIcon, label: currentUser.role }
      ]
    : [];

  // Define table columns
  const columns = [
    {
      field: 'fullName',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'positionAppliedFor',
      headerName: 'Position',
      width: 200
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone',
      width: 140
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (params) => (
        <StatusChip
          label={params.value}
          variant={getStatusColor(params.value)}
          size="small"
        />
      )
    },
    {
      field: 'approvalStatus',
      headerName: 'Approval',
      width: 120,
      renderCell: (params) => (
        <StatusChip
          label={params.value}
          variant={getApprovalStatusColor(params.value)}
          size="small"
        />
      )
    },
    {
      field: 'submittedAtFormatted',
      headerName: 'Submitted',
      width: 130
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleViewApplication(params.row)}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Approve">
            <IconButton
              size="small"
              color="success"
              onClick={() => handleApproveClick(params.row)}
              disabled={params.row.approvalStatus !== APPROVAL_STATUS.PENDING}
            >
              <ApproveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleRejectClick(params.row)}
              disabled={params.row.approvalStatus !== APPROVAL_STATUS.PENDING}
            >
              <RejectIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Notes">
            <IconButton
              size="small"
              onClick={() => handleAddNotesClick(params.row)}
            >
              <NotesIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hire Candidate">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleHireClick(params.row)}
              disabled={params.row.approvalStatus === 'Hired'}
            >
              <HireIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  if (loading && applications.length === 0) {
    return (
      <Layout>
        <Loading message="Loading applications..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Application Review"
        subtitle="Review and manage job applications"
        icon={ApplicationIcon}
        chips={headerChips}
        actions={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <InfoCard
            icon={ApplicationIcon}
            title="Total Applications"
            data={[
              { label: 'Count', value: stats.totalApplications, bold: true }
            ]}
            color="blue"
            elevated={true}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <InfoCard
            icon={ApplicationIcon}
            title="Pending Review"
            data={[
              { label: 'Count', value: stats.pendingApplications, bold: true }
            ]}
            color="gold"
            elevated={true}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <InfoCard
            icon={ApproveIcon}
            title="Approved"
            data={[
              { label: 'Count', value: stats.approvedApplications, bold: true }
            ]}
            color="teal"
            elevated={true}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <InfoCard
            icon={RejectIcon}
            title="Rejected"
            data={[
              { label: 'Count', value: stats.rejectedApplications, bold: true }
            ]}
            color="gray"
            elevated={true}
            sx={{ width: '100%' }}
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name, email, or phone..."
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <FilterBar
          filters={[
            {
              name: 'status',
              label: 'Status',
              value: statusFilter,
              options: STATUS_FILTER_OPTIONS
            },
            {
              name: 'approvalStatus',
              label: 'Approval',
              value: approvalStatusFilter,
              options: APPROVAL_FILTER_OPTIONS
            }
          ]}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearFilters}
        />
      </Box>

      {/* Data Table */}
      {applications.length === 0 && !loading ? (
        <EmptyState
          icon="search"
          title="No Applications Found"
          message="No applications match your search criteria."
          actionButton={{
            label: 'Clear Filters',
            onClick: handleClearFilters
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          rows={applications}
          loading={loading}
          totalCount={totalCount}
          page={page}
          pageSize={rowsPerPage}
          onPageChange={handleChangePage}
          onPageSizeChange={handleChangeRowsPerPage}
        />
      )}

      {/* Application Detail Dialog */}
      <ApplicationDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        applicationId={selectedApplication?.applicationId}
        onApprove={handleApproveClick}
        onReject={handleRejectClick}
        onAddNotes={handleAddNotesClick}
      />

      {/* Approve Confirmation Dialog */}
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

      {/* Reject Dialog */}
      <RejectApplicationDialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        onConfirm={handleRejectConfirm}
        application={selectedApplication}
        loading={rejecting}
      />

      {/* Add Notes Dialog */}
      <AddNotesDialog
        open={notesDialogOpen}
        onClose={() => setNotesDialogOpen(false)}
        onConfirm={handleAddNotesConfirm}
        application={selectedApplication}
        loading={addingNotes}
      />

      {/* Hire Dialog */}
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
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default ApplicationReviewDashboard;