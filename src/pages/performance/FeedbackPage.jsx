// src/pages/performance/FeedbackPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Divider,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Feedback as FeedbackIcon,
  Inbox as InboxIcon,
  Send as SendIcon,
  CheckCircle as ReadIcon
} from '@mui/icons-material';
import PageHeader from '../../components/common/layout/PageHeader';
import CreateFeedbackDialog from './components/CreateFeedbackDialog';
import performanceService from '../../services/performanceService';
import {
  getFeedbackTypeColor,
  formatDateTime
} from './models/performanceModels';

const FeedbackPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [receivedFeedback, setReceivedFeedback] = useState([]);
  const [givenFeedback, setGivenFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Load feedback on mount
  useEffect(() => {
    loadFeedback();
    loadStatistics();
  }, []);

  // Load feedback
  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError('');

      const [receivedResponse, givenResponse] = await Promise.all([
        performanceService.getReceivedFeedback(),
        performanceService.getGivenFeedback()
      ]);

      setReceivedFeedback(receivedResponse.feedback || []);
      setGivenFeedback(givenResponse.feedback || []);
    } catch (err) {
      setError(err.message || 'Failed to load feedback');
      console.error('Failed to load feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStatistics = async () => {
    try {
      const response = await performanceService.getFeedbackStatistics();
      setStats(response);
    } catch (err) {
      console.error('Failed to load statistics:', err);
    }
  };

  // Handle create feedback
  const handleCreateFeedback = async (feedbackData) => {
    try {
      setCreateLoading(true);
      await performanceService.createFeedback(feedbackData);
      setCreateDialogOpen(false);
      await loadFeedback();
      await loadStatistics();
    } catch (err) {
      setError(err.message || 'Failed to submit feedback');
      console.error('Failed to submit feedback:', err);
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle mark as read
  const handleMarkAsRead = async (feedbackId) => {
    try {
      await performanceService.markFeedbackAsRead(feedbackId);
      await loadFeedback();
      await loadStatistics();
    } catch (err) {
      setError(err.message || 'Failed to mark feedback as read');
      console.error('Failed to mark feedback as read:', err);
    }
  };

  const renderFeedbackList = (feedbackList, isReceived = true) => {
    if (feedbackList.length === 0) {
      return (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <FeedbackIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {isReceived ? 'No Feedback Received' : 'No Feedback Given'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {isReceived
                ? 'You have not received any feedback yet.'
                : 'You have not given any feedback yet. Consider providing feedback to your colleagues.'}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <List sx={{ bgcolor: 'background.paper' }}>
        {feedbackList.map((feedback, index) => (
          <React.Fragment key={feedback.feedbackId}>
            <ListItem
              alignItems="flex-start"
              sx={{
                bgcolor: !feedback.isRead && isReceived ? 'action.hover' : 'transparent',
                '&:hover': { bgcolor: 'action.selected' }
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {isReceived
                        ? `From: ${feedback.fromEmployeeName}`
                        : `To: ${feedback.toEmployeeName}`}
                    </Typography>
                    <Chip
                      label={feedback.feedbackType}
                      size="small"
                      color={getFeedbackTypeColor(feedback.feedbackType)}
                    />
                    {!feedback.isRead && isReceived && (
                      <Chip label="Unread" size="small" color="primary" />
                    )}
                  </Box>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ display: 'block', mt: 1, mb: 1, whiteSpace: 'pre-wrap' }}
                    >
                      {feedback.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(feedback.createdAt)}
                    </Typography>
                  </>
                }
              />
              {!feedback.isRead && isReceived && (
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={() => handleMarkAsRead(feedback.feedbackId)}
                  title="Mark as read"
                >
                  <ReadIcon />
                </IconButton>
              )}
            </ListItem>
            {index < feedbackList.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        title="Feedback"
        subtitle="Give and receive continuous feedback to support growth and development"
      />

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      Received
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {stats.received.total}
                    </Typography>
                  </Box>
                  <InboxIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      Unread
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                      {stats.received.unread}
                    </Typography>
                  </Box>
                  <InboxIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      Given
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {stats.given.total}
                    </Typography>
                  </Box>
                  <SendIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      Positive
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {stats.received.positive}
                    </Typography>
                  </Box>
                  <FeedbackIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Actions */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Give Feedback
        </Button>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => { loadFeedback(); loadStatistics(); }}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InboxIcon />
                Received
                {stats && stats.received.unread > 0 && (
                  <Chip
                    label={stats.received.unread}
                    size="small"
                    color="primary"
                    sx={{ height: 20, minWidth: 20 }}
                  />
                )}
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SendIcon />
                Given
              </Box>
            }
          />
        </Tabs>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Feedback Lists */}
      {!loading && (
        <>
          {activeTab === 0 && renderFeedbackList(receivedFeedback, true)}
          {activeTab === 1 && renderFeedbackList(givenFeedback, false)}
        </>
      )}

      {/* Create Feedback Dialog */}
      <CreateFeedbackDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onConfirm={handleCreateFeedback}
        loading={createLoading}
      />
    </Container>
  );
};

export default FeedbackPage;
