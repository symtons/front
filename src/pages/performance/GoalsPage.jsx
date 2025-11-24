// src/pages/performance/GoalsPage.jsx
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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Assessment as StatsIcon
} from '@mui/icons-material';
import PageHeader from '../../components/common/layout/PageHeader';
import GoalCard from './components/GoalCard';
import CreateGoalDialog from './components/CreateGoalDialog';
import performanceService from '../../services/performanceService';
import {
  GOAL_STATUS_OPTIONS,
  GOAL_CATEGORY_OPTIONS
} from './models/performanceModels';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Load goals on mount
  useEffect(() => {
    loadGoals();
    loadStatistics();
  }, []);

  // Load goals
  const loadGoals = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;

      const response = await performanceService.getMyGoals(params);
      setGoals(response.goals || []);
    } catch (err) {
      setError(err.message || 'Failed to load goals');
      console.error('Failed to load goals:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStatistics = async () => {
    try {
      const response = await performanceService.getGoalStatistics();
      setStats(response);
    } catch (err) {
      console.error('Failed to load statistics:', err);
    }
  };

  // Handle filter change
  const handleFilterChange = (filterType) => (event) => {
    if (filterType === 'status') {
      setStatusFilter(event.target.value);
    } else if (filterType === 'category') {
      setCategoryFilter(event.target.value);
    }
  };

  // Apply filters
  useEffect(() => {
    loadGoals();
  }, [statusFilter, categoryFilter]);

  // Handle create goal
  const handleCreateGoal = async (goalData) => {
    try {
      setCreateLoading(true);
      await performanceService.createGoal(goalData);
      setCreateDialogOpen(false);
      await loadGoals();
      await loadStatistics();
    } catch (err) {
      setError(err.message || 'Failed to create goal');
      console.error('Failed to create goal:', err);
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle view goal
  const handleViewGoal = (goal) => {
    // TODO: Open goal details dialog
    console.log('View goal:', goal);
  };

  // Handle delete goal
  const handleDeleteGoal = async (goal) => {
    if (!window.confirm(`Are you sure you want to delete the goal "${goal.title}"?`)) {
      return;
    }

    try {
      await performanceService.deleteGoal(goal.goalId);
      await loadGoals();
      await loadStatistics();
    } catch (err) {
      setError(err.message || 'Failed to delete goal');
      console.error('Failed to delete goal:', err);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <PageHeader
        title="My Goals"
        subtitle="Set and track your performance goals and development objectives"
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
                      Total Goals
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {stats.totalGoals}
                    </Typography>
                  </Box>
                  <StatsIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
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
                      Completed
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {stats.completedGoals}
                    </Typography>
                  </Box>
                  <StatsIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
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
                      In Progress
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'info.main' }}>
                      {stats.inProgressGoals}
                    </Typography>
                  </Box>
                  <StatsIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
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
                      Completion Rate
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {stats.completionRate}%
                    </Typography>
                  </Box>
                  <StatsIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Actions and Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Goal
        </Button>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => { loadGoals(); loadStatistics(); }}
          disabled={loading}
        >
          Refresh
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleFilterChange('status')}
            label="Status"
          >
            {GOAL_STATUS_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={handleFilterChange('category')}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {GOAL_CATEGORY_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

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

      {/* Goals Grid */}
      {!loading && goals.length > 0 && (
        <Grid container spacing={3}>
          {goals.map(goal => (
            <Grid item xs={12} md={6} lg={4} key={goal.goalId}>
              <GoalCard
                goal={goal}
                onView={handleViewGoal}
                onDelete={handleDeleteGoal}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {!loading && goals.length === 0 && (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <StatsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Goals Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {statusFilter || categoryFilter
                ? 'No goals match your current filters. Try adjusting them.'
                : 'Get started by creating your first goal to track your progress and development.'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Goal Dialog */}
      <CreateGoalDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onConfirm={handleCreateGoal}
        loading={createLoading}
      />
    </Container>
  );
};

export default GoalsPage;
