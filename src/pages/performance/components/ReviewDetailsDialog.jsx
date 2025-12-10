// src/pages/performance/components/ReviewDetailsDialog.jsx
/**
 * Review Details Dialog
 * Shows complete review with all ratings
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Divider,
  Chip,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Star as StarIcon,
  TrendingUp as TrendIcon,
  Download as DownloadIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { formatDate, formatScore, getRatingColor, getRankBadge } from '../models/performanceModels';

const ReviewDetailsDialog = ({ open, onClose, review }) => {
  if (!review) return null;

  const { review: reviewData, ratings } = review;
  const rankBadge = reviewData.companyWideRank ? getRankBadge(reviewData.companyWideRank) : null;

  const categoryLabels = {
    qualityOfWork: 'Quality of Work',
    punctuality: 'Punctuality',
    teamwork: 'Teamwork',
    initiative: 'Initiative',
    reliability: 'Reliability',
    communication: 'Communication',
    problemSolving: 'Problem Solving',
    leadership: 'Leadership',
    teamManagement: 'Team Management'
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <StarIcon sx={{ color: '#667eea', fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Performance Review Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {reviewData.periodName}
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={onClose}
            sx={{ minWidth: 'auto', color: '#666' }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {/* Overall Score */}
        <Card elevation={0} sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Overall Score
                  </Typography>
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 700,
                      color: getRatingColor(reviewData.finalScore),
                      mb: 1
                    }}
                  >
                    {formatScore(reviewData.finalScore)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={reviewData.finalScore}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getRatingColor(reviewData.finalScore),
                        borderRadius: 6
                      }
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Review Period:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatDate(reviewData.startDate)} - {formatDate(reviewData.endDate)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Completed:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatDate(reviewData.completedAt)}
                    </Typography>
                  </Box>

                  {rankBadge && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Company Rank:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">{rankBadge.emoji}</Typography>
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

                  {reviewData.departmentRank && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Department Rank:
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        #{reviewData.departmentRank}
                      </Typography>
                    </Box>
                  )}

                  {reviewData.roleRank && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Role Rank:
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        #{reviewData.roleRank}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Ratings Breakdown */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Ratings Breakdown
        </Typography>

        {ratings && ratings.length > 0 ? (
          <Box sx={{ mb: 3 }}>
            {ratings.map((rating, index) => (
              <Card key={rating.ratingId} elevation={1} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ color: '#667eea' }} />
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {rating.raterName || 'Anonymous Rater'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {rating.raterRole}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={`${rating.overallRating}/100`}
                      sx={{
                        backgroundColor: getRatingColor(rating.overallRating) + '20',
                        color: getRatingColor(rating.overallRating),
                        fontWeight: 700,
                        fontSize: '1rem',
                        px: 2,
                        py: 2.5
                      }}
                    />
                  </Box>

                  {/* Category Ratings */}
                  {(rating.qualityOfWork || rating.punctuality || rating.teamwork) && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
                        Category Ratings:
                      </Typography>
                      <Grid container spacing={1.5}>
                        {Object.entries(categoryLabels).map(([key, label]) => {
                          if (rating[key] !== null && rating[key] !== undefined) {
                            return (
                              <Grid item xs={6} sm={4} key={key}>
                                <Box
                                  sx={{
                                    p: 1.5,
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: 1,
                                    textAlign: 'center'
                                  }}
                                >
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                    {label}
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 700,
                                      color: getRatingColor(rating[key])
                                    }}
                                  >
                                    {rating[key]}
                                  </Typography>
                                </Box>
                              </Grid>
                            );
                          }
                          return null;
                        })}
                      </Grid>
                    </>
                  )}

                  {/* Comments */}
                  {rating.comments && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                        Comments:
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          p: 2,
                          backgroundColor: '#f8f9fa',
                          borderRadius: 1,
                          fontStyle: 'italic'
                        }}
                      >
                        "{rating.comments}"
                      </Typography>
                    </>
                  )}

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                    Submitted: {formatDate(rating.submittedAt)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No detailed ratings available
            </Typography>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5 }}>
        <Button
          startIcon={<DownloadIcon />}
          sx={{ color: '#667eea' }}
          disabled
        >
          Download PDF
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            backgroundColor: '#667eea',
            '&:hover': { backgroundColor: '#5568d3' }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDetailsDialog;