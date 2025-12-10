// src/pages/performance/MyReviews.jsx
/**
 * My Reviews Page
 * Shows employee's own performance reviews
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
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Assessment as ReviewIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import Loading from '../../components/common/feedback/Loading';
import EmptyState from '../../components/common/feedback/EmptyState';
import ReviewDetailsDialog from './components/ReviewDetailsDialog';
import performanceService from '../../services/performanceService';
import {
  formatDate,
  formatScore,
  getRatingColor,
  getRankBadge,
  getReviewStatusColor,
  transformReviewForDisplay
} from './models/performanceModels';

const MyReviews = () => {
  // Data states
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await performanceService.getMyReviews();
      const transformedReviews = (data.reviews || []).map(transformReviewForDisplay);
      setReviews(transformedReviews);

    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message || 'Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (review) => {
    try {
      const data = await performanceService.getReviewDetails(review.employeeReviewId);
      setSelectedReview(data);
      setDetailsDialogOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to load review details');
    }
  };

  const handleRefresh = () => {
    fetchReviews();
  };

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading your reviews..." />
      </Layout>
    );
  }

  // Calculate statistics
  const completedReviews = reviews.filter(r => r.status === 'Completed');
  const pendingReviews = reviews.filter(r => r.status !== 'Completed');
  const averageScore = completedReviews.length > 0
    ? (completedReviews.reduce((sum, r) => sum + (r.finalScore || 0), 0) / completedReviews.length).toFixed(1)
    : 0;

  return (
    <Layout>
      <PageHeader
        title="My Performance Reviews"
        subtitle="View your completed and pending performance reviews"
        icon={ReviewIcon}
        actions={
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              backgroundColor: '#667eea',
              '&:hover': { backgroundColor: '#5568d3' }
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
            {reviews.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Reviews
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#6AB4A8' }}>
            {completedReviews.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completed
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#FDB94E' }}>
            {pendingReviews.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            In Progress
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: getRatingColor(averageScore) }}>
            {averageScore}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Average Score
          </Typography>
        </Box>
      </Box>

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="No Reviews Yet"
          message="Your performance reviews will appear here once created."
        />
      ) : (
        <Grid container spacing={3}>
          {reviews.map((review) => {
            const statusColors = getReviewStatusColor(review.status);
            const isCompleted = review.status === 'Completed';
            const rankBadge = review.companyWideRank ? getRankBadge(review.companyWideRank) : null;

            return (
              <Grid item xs={12} sm={6} lg={4} key={review.employeeReviewId}>
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
                  {/* Card Header */}
                  <Box
                    sx={{
                      p: 2.5,
                      backgroundColor: isCompleted ? '#E8F5E9' : '#FFF4E5',
                      borderBottom: '1px solid #e0e0e0'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {review.periodName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {review.periodType} Review
                        </Typography>
                      </Box>
                      <Chip
                        label={review.statusFormatted}
                        size="small"
                        sx={{
                          backgroundColor: statusColors.bg,
                          color: statusColors.color,
                          fontWeight: 600,
                          border: `1px solid ${statusColors.border}`
                        }}
                      />
                    </Box>

                    {isCompleted && review.finalScore !== null && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 2,
                          backgroundColor: '#fff',
                          borderRadius: 2,
                          mt: 2
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography
                            variant="h2"
                            sx={{
                              fontWeight: 700,
                              color: getRatingColor(review.finalScore),
                              mb: 0.5
                            }}
                          >
                            {formatScore(review.finalScore)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Overall Score
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>

                  {/* Card Content */}
                  <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Review Period
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {formatDate(review.startDate)} - {formatDate(review.endDate)}
                      </Typography>
                    </Box>

                    {!isCompleted && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Rating Progress
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {review.progressLabel}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={review.progressPercent}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#FDB94E',
                              borderRadius: 4
                            }
                          }}
                        />
                      </Box>
                    )}

                    {isCompleted && (
                      <>
                        {rankBadge && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Company Rank
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h4">{rankBadge.emoji}</Typography>
                              <Chip
                                label={rankBadge.label}
                                size="small"
                                sx={{
                                  backgroundColor: rankBadge.color + '20',
                                  color: rankBadge.color,
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                          </Box>
                        )}

                        {review.departmentRank && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Department Rank
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              #{review.departmentRank}
                            </Typography>
                          </Box>
                        )}

                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Completed
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {review.completedAtFormatted}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </CardContent>

                  {/* Card Actions */}
                  <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ViewIcon />}
                      onClick={() => handleViewDetails(review)}
                      sx={{
                        backgroundColor: '#667eea',
                        '&:hover': { backgroundColor: '#5568d3' }
                      }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Review Details Dialog */}
      <ReviewDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        review={selectedReview}
      />
    </Layout>
  );
};

export default MyReviews;