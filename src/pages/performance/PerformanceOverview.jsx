// src/pages/performance/PerformanceOverview.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Button,
  Paper
} from '@mui/material';
import {
  TrendingUp as GoalsIcon,
  Feedback as FeedbackIcon,
  Star as ReviewIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/layout/PageHeader';
import performanceService from '../../services/performanceService';

const PerformanceOverview = () => {
  const navigate = useNavigate();
  const [goalStats, setGoalStats] = useState(null);
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load all statistics on mount
  useEffect(() => {
    loadAllStats();
  }, []);

  // Load all statistics
  const loadAllStats = async () => {
    try {
      setLoading(true);
      setError('');

      const [goalsResponse, feedbackResponse, reviewResponse] = await Promise.all([
        performanceService.getGoalStatistics(),
        performanceService.getFeedbackStatistics(),
        performanceService.getPerformanceSummary()
      ]);

      setGoalStats(goalsResponse);
      setFeedbackStats(feedbackResponse);
      setReviewSummary(reviewResponse);
    } catch (err) {
      setError(err.message || 'Failed to load performance data');
      console.error('Failed to load statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        title="Performance Overview"
        subtitle="Track your goals, reviews, and feedback all in one place"
      />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Statistics */}
      {!loading && (
        <Grid container spacing={3}>
          {/* Goals Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GoalsIcon color="primary" sx={{ fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Goals
                  </Typography>
                </Box>
                <Button
                  endIcon={<ArrowIcon />}
                  onClick={() => navigate('/performance/goals')}
                >
                  View All
                </Button>
              </Box>

              {goalStats && (
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="text.secondary" variant="caption">
                          Total Goals
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                          {goalStats.totalGoals}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="text.secondary" variant="caption">
                          Completed
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                          {goalStats.completedGoals}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="text.secondary" variant="caption">
                          In Progress
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'info.main' }}>
                          {goalStats.inProgressGoals}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="text.secondary" variant="caption">
                          Overdue
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'error.main' }}>
                          {goalStats.overdueGoals}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* Reviews Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReviewIcon color="primary" sx={{ fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Performance Reviews
                  </Typography>
                </Box>
              </Box>

              {reviewSummary && (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="text.secondary" variant="caption">
                          Total Reviews
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                          {reviewSummary.totalReviews}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="text.secondary" variant="caption">
                          Completed
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                          {reviewSummary.completedReviews}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="text.secondary" variant="caption">
                          Pending
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                          {reviewSummary.pendingReviews}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="text.secondary" variant="caption">
                          Average Rating
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {reviewSummary.averageRating}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* Feedback Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FeedbackIcon color="primary" sx={{ fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Feedback
                  </Typography>
                </Box>
                <Button
                  endIcon={<ArrowIcon />}
                  onClick={() => navigate('/performance/feedback')}
                >
                  View All
                </Button>
              </Box>

              {feedbackStats && (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="text.secondary" variant="caption">
                          Received
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                          {feedbackStats.received.total}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="text.secondary" variant="caption">
                          Unread
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                          {feedbackStats.received.unread}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="text.secondary" variant="caption">
                          Given
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                          {feedbackStats.given.total}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="text.secondary" variant="caption">
                          Positive
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                          {feedbackStats.received.positive}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default PerformanceOverview;
