// src/pages/performance/FeedbackPage.jsx
/**
 * Feedback Page
 * View received and given feedback
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
  Tabs,
  Tab,
  Badge,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import {
  Feedback as FeedbackIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  CheckCircle as ReadIcon,
  MailOutline as UnreadIcon,
  Send as SendIcon,
  Inbox as InboxIcon
} from '@mui/icons-material';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import Loading from '../../components/common/feedback/Loading';
import EmptyState from '../../components/common/feedback/EmptyState';
import GiveFeedbackDialog from './components/GiveFeedbackDialog';
import performanceService from '../../services/performanceService';
import {
  formatDate,
  getFeedbackTypeColor,
  transformFeedbackForDisplay,
  calculateFeedbackStats
} from './models/performanceModels';

const FeedbackPage = () => {
  // Data states
  const [receivedFeedback, setReceivedFeedback] = useState([]);
  const [givenFeedback, setGivenFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Tab state
  const [activeTab, setActiveTab] = useState(0); // 0=Received, 1=Given

  // Dialog states
  const [giveFeedbackDialogOpen, setGiveFeedbackDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    positive: 0,
    constructive: 0,
    general: 0
  });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError('');

      const [receivedData, givenData] = await Promise.all([
        performanceService.getReceivedFeedback(),
        performanceService.getGivenFeedback()
      ]);

      const transformedReceived = (receivedData.feedback || []).map(transformFeedbackForDisplay);
      const transformedGiven = (givenData.feedback || []).map(transformFeedbackForDisplay);

      setReceivedFeedback(transformedReceived);
      setGivenFeedback(transformedGiven);

      // Calculate stats
      const calculatedStats = calculateFeedbackStats(transformedReceived);
      setStats(calculatedStats);

    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError(err.message || 'Failed to load feedback');
      setReceivedFeedback([]);
      setGivenFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleGiveFeedback = async (feedbackData) => {
    try {
      setSubmitting(true);
      await performanceService.giveFeedback(feedbackData);

      setGiveFeedbackDialogOpen(false);
      setSuccessMessage('Feedback submitted successfully!');
      fetchFeedback();

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsRead = async (feedbackId) => {
    try {
      await performanceService.markFeedbackAsRead(feedbackId);
      fetchFeedback();
    } catch (err) {
      setError(err.message || 'Failed to mark as read');
    }
  };

  const handleRefresh = () => {
    fetchFeedback();
  };

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading feedback..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Feedback"
        subtitle="Give and receive feedback from colleagues"
        icon={FeedbackIcon}
        actions={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setGiveFeedbackDialogOpen(true)}
              sx={{
                backgroundColor: '#f59e42',
                '&:hover': { backgroundColor: '#e08c31' }
              }}
            >
              Give Feedback
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{ borderColor: '#f59e42', color: '#f59e42' }}
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
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e42' }}>
            {stats.total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Received
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea' }}>
            {stats.unread}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Unread
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#6AB4A8' }}>
            {stats.positive}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Positive
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#FDB94E' }}>
            {stats.constructive}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Constructive
          </Typography>
        </Box>
      </Box>

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
              color: '#f59e42'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#f59e42',
              height: 3
            }
          }}
        >
          <Tab
            icon={<InboxIcon />}
            iconPosition="start"
            label={
              <Badge badgeContent={stats.unread} color="error">
                <Box sx={{ ml: 1 }}>Received Feedback</Box>
              </Badge>
            }
          />
          <Tab
            icon={<SendIcon />}
            iconPosition="start"
            label={`Given Feedback (${givenFeedback.length})`}
          />
        </Tabs>
      </Box>

      {/* Received Feedback Tab */}
      {activeTab === 0 && (
        <>
          {receivedFeedback.length === 0 ? (
            <EmptyState
              icon="inbox"
              title="No Feedback Received"
              message="Feedback from your colleagues will appear here."
            />
          ) : (
            <Grid container spacing={3}>
              {receivedFeedback.map((feedback) => {
                const typeColors = getFeedbackTypeColor(feedback.feedbackType);

                return (
                  <Grid item xs={12} md={6} key={feedback.feedbackId}>
                    <Card
                      elevation={feedback.isRead ? 1 : 3}
                      sx={{
                        borderRadius: 2,
                        border: feedback.isRead ? 'none' : '2px solid #667eea',
                        opacity: feedback.isRead ? 0.9 : 1,
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4
                        }
                      }}
                    >
                      <CardContent>
                        {/* Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              {!feedback.isRead && (
                                <UnreadIcon sx={{ fontSize: 16, color: '#667eea' }} />
                              )}
                              <Typography variant="body1" fontWeight={600}>
                                {feedback.fromName}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {feedback.timeAgo}
                            </Typography>
                          </Box>
                          <Chip
                            label={feedback.feedbackType}
                            size="small"
                            sx={{
                              backgroundColor: typeColors.bg,
                              color: typeColors.color,
                              fontWeight: 600,
                              border: `1px solid ${typeColors.border}`
                            }}
                          />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Content */}
                        <Typography
                          variant="body2"
                          sx={{
                            p: 2,
                            backgroundColor: '#f8f9fa',
                            borderRadius: 1,
                            fontStyle: 'italic',
                            minHeight: 80
                          }}
                        >
                          "{feedback.content}"
                        </Typography>

                        {/* Actions */}
                        {!feedback.isRead && (
                          <Box sx={{ mt: 2, textAlign: 'right' }}>
                            <Button
                              size="small"
                              startIcon={<ReadIcon />}
                              onClick={() => handleMarkAsRead(feedback.feedbackId)}
                              sx={{
                                color: '#6AB4A8',
                                '&:hover': { backgroundColor: 'rgba(106, 180, 168, 0.1)' }
                              }}
                            >
                              Mark as Read
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </>
      )}

      {/* Given Feedback Tab */}
      {activeTab === 1 && (
        <>
          {givenFeedback.length === 0 ? (
            <EmptyState
              icon="folder"
              title="No Feedback Given"
              message="Feedback you give to others will appear here."
              actionButton={{
                label: 'Give Feedback',
                onClick: () => setGiveFeedbackDialogOpen(true)
              }}
            />
          ) : (
            <Grid container spacing={3}>
              {givenFeedback.map((feedback) => {
                const typeColors = getFeedbackTypeColor(feedback.feedbackType);

                return (
                  <Grid item xs={12} md={6} key={feedback.feedbackId}>
                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                      <CardContent>
                        {/* Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight={600}>
                              To: {feedback.toName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {feedback.timeAgo}
                            </Typography>
                          </Box>
                          <Chip
                            label={feedback.feedbackType}
                            size="small"
                            sx={{
                              backgroundColor: typeColors.bg,
                              color: typeColors.color,
                              fontWeight: 600,
                              border: `1px solid ${typeColors.border}`
                            }}
                          />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Content */}
                        <Typography
                          variant="body2"
                          sx={{
                            p: 2,
                            backgroundColor: '#f8f9fa',
                            borderRadius: 1,
                            fontStyle: 'italic',
                            minHeight: 80
                          }}
                        >
                          "{feedback.content}"
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </>
      )}

      {/* Give Feedback Dialog */}
      <GiveFeedbackDialog
        open={giveFeedbackDialogOpen}
        onClose={() => setGiveFeedbackDialogOpen(false)}
        onSubmit={handleGiveFeedback}
        loading={submitting}
      />
    </Layout>
  );
};

export default FeedbackPage;