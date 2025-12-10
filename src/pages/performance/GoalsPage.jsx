// src/pages/performance/GoalsPage.jsx
/**
 * Goals Page
 * Simple page for managing personal goals
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
  LinearProgress,
  IconButton,
  Slider,
  Chip
} from '@mui/material';
import {
  Flag as GoalIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CompleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import Loading from '../../components/common/feedback/Loading';
import EmptyState from '../../components/common/feedback/EmptyState';
import CreateGoalDialog from './components/CreateGoalDialog';
import performanceService from '../../services/performanceService';
import {
  formatDate,
  getGoalStatusColor,
  transformGoalForDisplay
} from './models/performanceModels';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Progress editing
  const [editingProgress, setEditingProgress] = useState({});

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await performanceService.getMyGoals();
      const transformedGoals = (data.goals || []).map(transformGoalForDisplay);
      setGoals(transformedGoals);

    } catch (err) {
      console.error('Error fetching goals:', err);
      setError(err.message || 'Failed to load goals');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (goalData) => {
    try {
      setCreating(true);
      await performanceService.createGoal(goalData);
      
      setCreateDialogOpen(false);
      setSuccessMessage('Goal created successfully!');
      fetchGoals();
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to create goal');
    } finally {
      setCreating(false);
    }
  };

  const handleProgressChange = (goalId) => (event, value) => {
    setEditingProgress(prev => ({ ...prev, [goalId]: value }));
  };

  const handleUpdateProgress = async (goalId) => {
    try {
      const progress = editingProgress[goalId];
      await performanceService.updateProgress(goalId, progress);
      
      setSuccessMessage('Progress updated!');
      fetchGoals();
      setEditingProgress(prev => {
        const newState = { ...prev };
        delete newState[goalId];
        return newState;
      });
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to update progress');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;

    try {
      await performanceService.deleteGoal(goalId);
      setSuccessMessage('Goal deleted successfully!');
      fetchGoals();
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to delete goal');
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading goals..." />
      </Layout>
    );
  }

  const activeGoals = goals.filter(g => g.status === 'Active');
  const completedGoals = goals.filter(g => g.status === 'Completed');

  return (
    <Layout>
      <PageHeader
        title="My Goals"
        subtitle="Track your professional development goals"
        icon={GoalIcon}
        actions={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                backgroundColor: '#6AB4A8',
                '&:hover': { backgroundColor: '#559089' }
              }}
            >
              Create Goal
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchGoals}
              sx={{ borderColor: '#6AB4A8', color: '#6AB4A8' }}
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

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Active Goals ({activeGoals.length})
          </Typography>
          <Grid container spacing={3}>
            {activeGoals.map((goal) => {
              const statusColors = getGoalStatusColor(goal.status);
              const currentProgress = editingProgress[goal.goalId] ?? goal.progress;

              return (
                <Grid item xs={12} md={6} key={goal.goalId}>
                  <Card
                    elevation={2}
                    sx={{
                      borderRadius: 2,
                      border: goal.isOverdue ? '2px solid #f44336' : 'none'
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                          {goal.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteGoal(goal.goalId)}
                          sx={{ color: '#f44336' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>

                      {goal.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {goal.description}
                        </Typography>
                      )}

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {currentProgress}%
                          </Typography>
                        </Box>
                        <Slider
                          value={currentProgress}
                          onChange={handleProgressChange(goal.goalId)}
                          min={0}
                          max={100}
                          step={5}
                          sx={{
                            color: '#6AB4A8',
                            mb: 1
                          }}
                        />
                        {editingProgress[goal.goalId] !== undefined && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleUpdateProgress(goal.goalId)}
                            sx={{
                              backgroundColor: '#6AB4A8',
                              '&:hover': { backgroundColor: '#559089' }
                            }}
                          >
                            Save Progress
                          </Button>
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                          variant="body2"
                          color={goal.isOverdue ? 'error' : 'text.secondary'}
                          fontWeight={goal.isOverdue ? 600 : 400}
                        >
                          Due: {goal.dueDateFormatted} • {goal.daysUntilLabel}
                        </Typography>
                        <Chip
                          label={goal.status}
                          size="small"
                          sx={{
                            backgroundColor: statusColors.bg,
                            color: statusColors.color,
                            fontWeight: 600
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Completed Goals ({completedGoals.length})
          </Typography>
          <Grid container spacing={3}>
            {completedGoals.map((goal) => (
              <Grid item xs={12} md={6} key={goal.goalId}>
                <Card
                  elevation={1}
                  sx={{
                    borderRadius: 2,
                    opacity: 0.8
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                      <CompleteIcon sx={{ color: '#6AB4A8', fontSize: 28 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {goal.title}
                        </Typography>
                        {goal.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {goal.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Completed: {goal.updatedAtFormatted}
                      </Typography>
                      <Chip
                        label="100%"
                        size="small"
                        sx={{
                          backgroundColor: '#E8F5E9',
                          color: '#6AB4A8',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <EmptyState
          icon="folder"
          title="No Goals Yet"
          message="Create your first goal to start tracking your progress"
          actionButton={{
            label: 'Create Goal',
            onClick: () => setCreateDialogOpen(true)
          }}
        />
      )}

      {/* Create Goal Dialog */}
      <CreateGoalDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateGoal}
        loading={creating}
      />
    </Layout>
  );
};

export default GoalsPage;