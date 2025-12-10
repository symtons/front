// src/pages/performance/MyRatings.jsx
/**
 * My Ratings Page
 * Shows employees I need to rate with card-based layout
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Alert,
  Chip,
  Avatar,
  Divider,
  Tab,
  Tabs,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  RateReview as RateIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  StarRate as StarIcon
} from '@mui/icons-material';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import SearchBar from '../../components/common/filters/SearchBar';
import Loading from '../../components/common/feedback/Loading';
import EmptyState from '../../components/common/feedback/EmptyState';
import SubmitRatingDialog from './components/SubmitRatingDialog';
import performanceService from '../../services/performanceService';
import {
  formatDate,
  getDaysUntilLabel,
  isOverdue,
  calculateRatingStats,
  transformRatingAssignmentForDisplay
} from './models/performanceModels';

const MyRatings = () => {
  // Data states
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Tab state
  const [activeTab, setActiveTab] = useState(0); // 0=All, 1=Pending, 2=Completed

  // Dialog states
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await performanceService.getMyRatings();
      const transformedAssignments = (data.assignments || []).map(transformRatingAssignmentForDisplay);
      
      setAssignments(transformedAssignments);
      
      // Calculate stats
      const calculatedStats = calculateRatingStats(transformedAssignments);
      setStats(calculatedStats);

    } catch (err) {
      console.error('Error fetching ratings:', err);
      setError(err.message || 'Failed to load ratings');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRateClick = (assignment) => {
    setSelectedAssignment(assignment);
    setRatingDialogOpen(true);
  };

  const handleSubmitRating = async (ratingData) => {
    try {
      setSubmitting(true);
      await performanceService.submitRating(ratingData);
      
      setRatingDialogOpen(false);
      setSelectedAssignment(null);
      setSuccessMessage('Rating submitted successfully!');
      
      // Refresh data
      fetchAssignments();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefresh = () => {
    fetchAssignments();
  };

  // Filter assignments based on active tab and search
  const getFilteredAssignments = () => {
    let filtered = assignments;

    // Filter by tab
    switch (activeTab) {
      case 1: // Pending
        filtered = filtered.filter(a => !a.isCompleted);
        break;
      case 2: // Completed
        filtered = filtered.filter(a => a.isCompleted);
        break;
      default: // All
        break;
    }

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a =>
        a.employee?.employeeName?.toLowerCase().includes(term) ||
        a.employee?.jobTitle?.toLowerCase().includes(term) ||
        a.employee?.departmentName?.toLowerCase().includes(term) ||
        a.raterRole?.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading ratings..." />
      </Layout>
    );
  }

  const filteredAssignments = getFilteredAssignments();

  return (
    <Layout>
      <PageHeader
        title="My Ratings"
        subtitle="Complete performance ratings for your team members"
        icon={RateIcon}
        actions={
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              backgroundColor: '#FDB94E',
              '&:hover': { backgroundColor: '#f59e42' }
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

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* Statistics Summary */}
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
            {stats.total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Assignments
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#FDB94E' }}>
            {stats.pending}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pending
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#6AB4A8' }}>
            {stats.completed}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completed
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea' }}>
            {stats.completionRate}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completion Rate
          </Typography>
        </Box>
      </Box>

      {/* Progress Bar */}
      {stats.total > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Overall Progress
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {stats.completed} / {stats.total} completed
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={stats.completionRate}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#6AB4A8',
                borderRadius: 5
              }
            }}
          />
        </Box>
      )}

      {/* Tabs */}
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
              <Badge badgeContent={stats.total} color="primary">
                All Ratings
              </Badge>
            }
          />
          <Tab
            label={
              <Badge
                badgeContent={stats.pending}
                sx={{ '& .MuiBadge-badge': { backgroundColor: '#FDB94E' } }}
              >
                Pending
              </Badge>
            }
          />
          <Tab
            label={
              <Badge
                badgeContent={stats.completed}
                sx={{ '& .MuiBadge-badge': { backgroundColor: '#6AB4A8' } }}
              >
                Completed
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
          placeholder="Search by name, job title, or department..."
        />
      </Box>

      {/* Assignments Grid */}
      {filteredAssignments.length === 0 ? (
        <EmptyState
          icon="search"
          title="No Ratings Found"
          message={
            searchTerm
              ? "No ratings match your search criteria."
              : activeTab === 1
              ? "You have no pending ratings. Great job!"
              : activeTab === 2
              ? "You haven't completed any ratings yet."
              : "No rating assignments available."
          }
          actionButton={
            searchTerm
              ? {
                  label: 'Clear Search',
                  onClick: () => setSearchTerm('')
                }
              : null
          }
        />
      ) : (
        <Grid container spacing={3}>
          {filteredAssignments.map((assignment) => {
            const isCompleted = assignment.isCompleted;
            const overdueFlag = assignment.isOverdue && !isCompleted;

            return (
              <Grid item xs={12} sm={6} lg={4} key={assignment.assignmentId}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    border: overdueFlag ? '2px solid #f44336' : 'none',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  {/* Card Header */}
                  <Box
                    sx={{
                      p: 2.5,
                      backgroundColor: isCompleted ? '#E8F5E9' : '#f8f9fa',
                      borderBottom: '1px solid #e0e0e0'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            backgroundColor: isCompleted ? '#6AB4A8' : '#667eea',
                            fontSize: '1.25rem',
                            fontWeight: 700
                          }}
                        >
                          {assignment.employee?.employeeName?.charAt(0) || 'E'}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                            {assignment.employee?.employeeName || 'Unknown'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <WorkIcon sx={{ fontSize: 14, color: '#6AB4A8' }} />
                            <Typography variant="body2" color="text.secondary">
                              {assignment.employee?.jobTitle || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {isCompleted ? (
                        <CompletedIcon sx={{ color: '#6AB4A8', fontSize: 32 }} />
                      ) : (
                        <PendingIcon sx={{ color: '#FDB94E', fontSize: 32 }} />
                      )}
                    </Box>
                  </Box>

                  {/* Card Content */}
                  <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Department
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {assignment.employee?.departmentName || 'N/A'}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Your Role
                      </Typography>
                      <Chip
                        label={assignment.raterRole}
                        size="small"
                        sx={{
                          backgroundColor: '#E3F2FD',
                          color: '#667eea',
                          fontWeight: 600
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Review Period
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {assignment.employee?.periodName || 'N/A'}
                      </Typography>
                    </Box>

                    {!isCompleted && (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CalendarIcon sx={{ fontSize: 16, color: overdueFlag ? '#f44336' : '#FDB94E' }} />
                          <Typography
                            variant="body2"
                            color={overdueFlag ? 'error' : 'text.secondary'}
                            fontWeight={overdueFlag ? 600 : 400}
                          >
                            {assignment.deadlineLabel}
                          </Typography>
                        </Box>
                        {overdueFlag && (
                          <Alert severity="error" sx={{ py: 0.5 }}>
                            This rating is overdue!
                          </Alert>
                        )}
                      </Box>
                    )}

                    {isCompleted && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Completed
                        </Typography>
                        <Typography variant="body1" fontWeight={600} color="success.main">
                          {formatDate(assignment.completedAt)}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  {/* Card Actions */}
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    {!isCompleted ? (
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<StarIcon />}
                        onClick={() => handleRateClick(assignment)}
                        sx={{
                          backgroundColor: overdueFlag ? '#f44336' : '#FDB94E',
                          '&:hover': {
                            backgroundColor: overdueFlag ? '#d32f2f' : '#f59e42'
                          }
                        }}
                      >
                        Rate Now
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<CompletedIcon />}
                        disabled
                        sx={{
                          borderColor: '#6AB4A8',
                          color: '#6AB4A8'
                        }}
                      >
                        Completed
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Submit Rating Dialog */}
      <SubmitRatingDialog
        open={ratingDialogOpen}
        onClose={() => setRatingDialogOpen(false)}
        onSubmit={handleSubmitRating}
        assignment={selectedAssignment}
        loading={submitting}
      />
    </Layout>
  );
};

export default MyRatings;