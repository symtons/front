// src/pages/performance/PerformanceOverview.jsx
/**
 * Performance Overview Dashboard
 * Main landing page showing summary of reviews, ratings, goals, and feedback
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Assessment as PerformanceIcon,
  RateReview as RateIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as GoalIcon,
  Feedback as FeedbackIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  Schedule as ClockIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import StatsCards from '../../components/common/display/StatsCards';
import StatusChip from '../../components/common/display/StatusChip';
import Loading from '../../components/common/feedback/Loading';
import EmptyState from '../../components/common/feedback/EmptyState';
import CreatePeriodDialog from './components/CreatePeriodDialog';
import performanceService from '../../services/performanceService';
import {
  formatDate,
  formatScore,
  getRatingColor,
  getRankBadge,
  getReviewStatusColor,
  calculateRatingStats,
  calculateGoalStats,
  calculateFeedbackStats,
  transformReviewForDisplay,
  transformGoalForDisplay
} from './models/performanceModels';

const PerformanceOverview = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const isExecutive = userRole === 'Admin' || userRole === 'Executive';

  // Data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myReviews, setMyReviews] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [myGoals, setMyGoals] = useState([]);
  const [myFeedback, setMyFeedback] = useState([]);

  // Dialog states
  const [createPeriodDialogOpen, setCreatePeriodDialogOpen] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    reviews: { total: 0, completed: 0, pending: 0 },
    ratings: { total: 0, completed: 0, pending: 0, completionRate: 0 },
    goals: { total: 0, active: 0, completed: 0, avgProgress: 0 },
    feedback: { total: 0, unread: 0, positive: 0 }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all data in parallel
      const [reviewsData, ratingsData, goalsData, feedbackData] = await Promise.all([
        performanceService.getMyReviews().catch(() => ({ reviews: [] })),
        performanceService.getMyRatings().catch(() => ({ assignments: [] })),
        performanceService.getMyGoals().catch(() => ({ goals: [] })),
        performanceService.getReceivedFeedback().catch(() => ({ feedback: [] }))
      ]);

      setMyReviews(reviewsData.reviews || []);
      setMyRatings(ratingsData.assignments || []);
      setMyGoals(goalsData.goals || []);
      setMyFeedback(feedbackData.feedback || []);

      // Calculate statistics
      const reviewStats = {
        total: reviewsData.reviews?.length || 0,
        completed: reviewsData.reviews?.filter(r => r.status === 'Completed').length || 0,
        pending: reviewsData.reviews?.filter(r => r.status !== 'Completed').length || 0
      };

      const ratingStats = calculateRatingStats(ratingsData.assignments || []);
      const goalStats = calculateGoalStats(goalsData.goals || []);
      const feedbackStats = calculateFeedbackStats(feedbackData.feedback || []);

      setStats({
        reviews: reviewStats,
        ratings: ratingStats,
        goals: goalStats,
        feedback: feedbackStats
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleCreatePeriodSuccess = () => {
    setCreatePeriodDialogOpen(false);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading performance overview..." />
      </Layout>
    );
  }

  // Latest completed review
  const latestReview = myReviews
    .filter(r => r.status === 'Completed')
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];

  // Pending ratings
  const pendingRatings = myRatings.filter(r => !r.isCompleted);

  // Active goals
  const activeGoals = myGoals.filter(g => g.status === 'Active');

  // Recent feedback
  const recentFeedback = myFeedback
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <Layout>
      <PageHeader
        title="Performance Management"
        subtitle="Track your performance, ratings, goals, and feedback"
        icon={PerformanceIcon}
        actions={
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isExecutive && (
              <Button
                variant="contained"
                startIcon={<RateIcon />}
                onClick={() => setCreatePeriodDialogOpen(true)}
                sx={{
                  backgroundColor: '#667eea',
                  '&:hover': { backgroundColor: '#5568d3' }
                }}
              >
                Create Review Period
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{ borderColor: '#667eea', color: '#667eea' }}
            >
              Refresh
            </Button>
          </Box>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <StatsCards
        stats={[
          {
            label: 'My Reviews',
            value: stats.reviews.completed,
            icon: <PerformanceIcon />,
            color: '#667eea',
            trend: stats.reviews.pending > 0 ? {
              value: stats.reviews.pending,
              label: 'pending'
            } : null
          },
          {
            label: 'Ratings to Complete',
            value: stats.ratings.pending,
            icon: <RateIcon />,
            color: '#FDB94E',
            trend: {
              value: stats.ratings.completionRate,
              label: `${stats.ratings.completionRate}% complete`,
              isPositive: stats.ratings.completionRate > 50
            }
          },
          {
            label: 'Active Goals',
            value: stats.goals.active,
            icon: <GoalIcon />,
            color: '#6AB4A8',
            trend: {
              value: stats.goals.avgProgress,
              label: `${stats.goals.avgProgress}% avg progress`,
              isPositive: stats.goals.avgProgress > 50
            }
          },
          {
            label: 'Unread Feedback',
            value: stats.feedback.unread,
            icon: <FeedbackIcon />,
            color: '#f59e42'
          }
        ]}
      />

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          
          {/* Latest Performance Review */}
          <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrophyIcon sx={{ color: '#667eea', fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Latest Performance Review
                  </Typography>
                </Box>
                <Button
                  endIcon={<ArrowIcon />}
                  onClick={() => navigate('/performance/my-reviews')}
                  sx={{ color: '#667eea' }}
                >
                  View All
                </Button>
              </Box>

              {latestReview ? (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: 2,
                        textAlign: 'center' 
                      }}>
                        <Typography variant="h3" sx={{ 
                          fontWeight: 700, 
                          color: getRatingColor(latestReview.finalScore),
                          mb: 0.5
                        }}>
                          {formatScore(latestReview.finalScore)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Overall Score
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Period:
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {latestReview.periodName}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Completed:
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {formatDate(latestReview.completedAt)}
                          </Typography>
                        </Box>
                        {latestReview.companyWideRank && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Company Rank:
                            </Typography>
                            <Chip
                              label={getRankBadge(latestReview.companyWideRank).label}
                              size="small"
                              sx={{ 
                                fontWeight: 600,
                                backgroundColor: getRankBadge(latestReview.companyWideRank).color + '20',
                                color: getRankBadge(latestReview.companyWideRank).color
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate('/performance/my-reviews')}
                      sx={{ borderColor: '#667eea', color: '#667eea' }}
                    >
                      View Full Review
                    </Button>
                  </Box>
                </Box>
              ) : (
                <EmptyState
                  icon="info"
                  title="No Reviews Yet"
                  message="You don't have any completed performance reviews."
                  variant="minimal"
                />
              )}
            </CardContent>
          </Card>

          {/* Pending Ratings to Complete */}
          <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RateIcon sx={{ color: '#FDB94E', fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Ratings to Complete
                  </Typography>
                  {stats.ratings.pending > 0 && (
                    <Chip
                      label={stats.ratings.pending}
                      size="small"
                      sx={{ 
                        backgroundColor: '#FFF4E5', 
                        color: '#FDB94E',
                        fontWeight: 600
                      }}
                    />
                  )}
                </Box>
                <Button
                  endIcon={<ArrowIcon />}
                  onClick={() => navigate('/performance/my-ratings')}
                  sx={{ color: '#FDB94E' }}
                >
                  View All
                </Button>
              </Box>

              {pendingRatings.length > 0 ? (
                <Box>
                  {pendingRatings.slice(0, 3).map((rating, index) => (
                    <Box
                      key={rating.assignmentId}
                      sx={{
                        p: 2,
                        mb: index < 2 ? 2 : 0,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {rating.employee?.employeeName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {rating.employee?.jobTitle} • {rating.raterRole}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <ClockIcon sx={{ fontSize: 14, color: '#FDB94E' }} />
                          <Typography variant="caption" color="text.secondary">
                            Deadline: {formatDate(rating.employee?.ratingDeadline)}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate('/performance/my-ratings')}
                        sx={{
                          backgroundColor: '#FDB94E',
                          '&:hover': { backgroundColor: '#f59e42' }
                        }}
                      >
                        Rate Now
                      </Button>
                    </Box>
                  ))}

                  {pendingRatings.length > 3 && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        +{pendingRatings.length - 3} more pending
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <EmptyState
                  icon="info"
                  title="All Caught Up!"
                  message="You have no pending ratings to complete."
                  variant="minimal"
                />
              )}
            </CardContent>
          </Card>

          {/* Active Goals */}
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GoalIcon sx={{ color: '#6AB4A8', fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Active Goals
                  </Typography>
                </Box>
                <Button
                  endIcon={<ArrowIcon />}
                  onClick={() => navigate('/performance/goals')}
                  sx={{ color: '#6AB4A8' }}
                >
                  View All
                </Button>
              </Box>

              {activeGoals.length > 0 ? (
                <Box>
                  {activeGoals.slice(0, 3).map((goal) => {
                    const transformed = transformGoalForDisplay(goal);
                    return (
                      <Box
                        key={goal.goalId}
                        sx={{
                          p: 2,
                          mb: 2,
                          backgroundColor: '#f8f9fa',
                          borderRadius: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="body1" fontWeight={600}>
                            {goal.title}
                          </Typography>
                          <Chip
                            label={`${goal.progress}%`}
                            size="small"
                            sx={{
                              backgroundColor: '#E8F5E9',
                              color: '#6AB4A8',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={goal.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#6AB4A8',
                              borderRadius: 4
                            }
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          Due: {transformed.dueDateFormatted} • {transformed.daysUntilLabel}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <EmptyState
                  icon="info"
                  title="No Active Goals"
                  message="Create goals to track your progress."
                  variant="minimal"
                  actionButton={{
                    label: 'Create Goal',
                    onClick: () => navigate('/performance/goals')
                  }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          
          {/* Recent Feedback */}
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FeedbackIcon sx={{ color: '#f59e42', fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Feedback
                  </Typography>
                  {stats.feedback.unread > 0 && (
                    <Chip
                      label={stats.feedback.unread}
                      size="small"
                      sx={{
                        backgroundColor: '#FFF4E5',
                        color: '#f59e42',
                        fontWeight: 600
                      }}
                    />
                  )}
                </Box>
              </Box>

              {recentFeedback.length > 0 ? (
                <Box>
                  {recentFeedback.map((feedback, index) => (
                    <Box key={feedback.feedbackId}>
                      <Box sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {feedback.fromName}
                          </Typography>
                          <StatusChip
                            status={feedback.feedbackType}
                            size="small"
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {feedback.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {formatDate(feedback.createdAt)}
                        </Typography>
                      </Box>
                      {index < recentFeedback.length - 1 && <Divider />}
                    </Box>
                  ))}

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/performance/feedback')}
                    sx={{ mt: 2, borderColor: '#f59e42', color: '#f59e42' }}
                  >
                    View All Feedback
                  </Button>
                </Box>
              ) : (
                <EmptyState
                  icon="info"
                  title="No Feedback Yet"
                  message="Feedback from colleagues will appear here."
                  variant="minimal"
                />
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card elevation={2} sx={{ mt: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PerformanceIcon />}
                  onClick={() => navigate('/performance/my-reviews')}
                  sx={{ justifyContent: 'flex-start', borderColor: '#667eea', color: '#667eea' }}
                >
                  View My Reviews
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<RateIcon />}
                  onClick={() => navigate('/performance/my-ratings')}
                  sx={{ justifyContent: 'flex-start', borderColor: '#FDB94E', color: '#FDB94E' }}
                >
                  Complete Ratings
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoalIcon />}
                  onClick={() => navigate('/performance/goals')}
                  sx={{ justifyContent: 'flex-start', borderColor: '#6AB4A8', color: '#6AB4A8' }}
                >
                  Manage Goals
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FeedbackIcon />}
                  onClick={() => navigate('/performance/feedback')}
                  sx={{ justifyContent: 'flex-start', borderColor: '#f59e42', color: '#f59e42' }}
                >
                  View Feedback
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialogs */}
      {isExecutive && (
        <CreatePeriodDialog
          open={createPeriodDialogOpen}
          onClose={() => setCreatePeriodDialogOpen(false)}
          onSuccess={handleCreatePeriodSuccess}
        />
      )}
    </Layout>
  );
};

export default PerformanceOverview;