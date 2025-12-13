// src/pages/dashboard/CoordinatorDashboard.jsx
/**
 * Coordinator Dashboard (Program Coordinator)
 * Program management and team coordination
 */

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  Alert,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import WelcomeHeader from './components/WelcomeHeader';
import StatCard from './components/StatCard';
import dashboardService from '../../services/dashboardService';
import { formatDate, getMetric } from './models/dashboardModels';

const CoordinatorDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Extract data
  const metrics = dashboardData?.metrics || {};

  // Load dashboard data
  useEffect(() => {
    if (user.employeeId) {
      loadDashboardData();
    }
  }, [user.employeeId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await dashboardService.getCoordinatorDashboard(user.employeeId);
      setDashboardData(data);
    } catch (err) {
      console.error('Error loading coordinator dashboard:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mock data (replace with actual API data)
  const tasks = [
    { id: 1, title: 'Review Q4 Program Goals', priority: 'high', due: '2024-12-15', completed: false },
    { id: 2, title: 'Update Client Service Plans', priority: 'high', due: '2024-12-14', completed: false },
    { id: 3, title: 'Approve Timesheet Submissions', priority: 'medium', due: '2024-12-16', completed: false },
    { id: 4, title: 'Coordinate Team Meeting', priority: 'medium', due: '2024-12-13', completed: true },
    { id: 5, title: 'Submit Monthly Report', priority: 'low', due: '2024-12-20', completed: false },
  ];

  const teamMembers = [
    { id: 1, name: 'Alice Johnson', status: 'Active', tasksComplete: 8, totalTasks: 10 },
    { id: 2, name: 'Bob Smith', status: 'Active', tasksComplete: 10, totalTasks: 10 },
    { id: 3, name: 'Carol Davis', status: 'On Leave', tasksComplete: 5, totalTasks: 8 },
    { id: 4, name: 'David Brown', status: 'Active', tasksComplete: 7, totalTasks: 10 },
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FDB94E';
      case 'low': return '#6AB4A8';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={48} />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={loadDashboardData}>
          Retry
        </Button>
      </Layout>
    );
  }

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(0) : 0;

  return (
    <Layout>
      <PageHeader 
        title="Coordinator Dashboard"
        subtitle="Program Management & Team Coordination"
      />

      {/* Welcome Section */}
      <WelcomeHeader 
        name={user.firstName}
        role="Program Coordinator"
        subtitle={user.departmentName}
      />

      {/* Stat Cards Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Team Size"
            value={getMetric(metrics, 'TeamSize', teamMembers.length)}
            type="number"
            subtitle="Direct Reports"
            icon="👥"
            color="#667eea"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Projects"
            value={5}
            type="number"
            subtitle="In Progress"
            icon="📁"
            color="#6AB4A8"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tasks Complete"
            value={`${completedTasks}/${totalTasks}`}
            type="text"
            subtitle={`${taskCompletionRate}% Complete`}
            icon="✅"
            color="#FDB94E"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Reviews"
            value={3}
            type="number"
            subtitle="This Week"
            icon="⭐"
            color="#5B8FCC"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* My Tasks & Approvals */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                📋 My Tasks & Approvals
              </Typography>

              <List sx={{ py: 0 }}>
                {tasks.map((task, index) => (
                  <React.Fragment key={task.id}>
                    <ListItem 
                      sx={{ 
                        px: 0,
                        opacity: task.completed ? 0.6 : 1,
                        textDecoration: task.completed ? 'line-through' : 'none'
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                              {task.completed ? '✅' : '⏳'} {task.title}
                            </Typography>
                            <Chip 
                              label={task.priority}
                              size="small"
                              sx={{ 
                                bgcolor: getPriorityColor(task.priority) + '20',
                                color: getPriorityColor(task.priority),
                                fontWeight: 600,
                                textTransform: 'capitalize'
                              }}
                            />
                          </Box>
                        }
                        secondary={`Due: ${formatDate(task.due)}`}
                      />
                    </ListItem>
                    {index < tasks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/tasks')}
              >
                View All Tasks →
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Overview */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                👥 Team Overview
              </Typography>

              <List sx={{ py: 0 }}>
                {teamMembers.map((member, index) => (
                  <React.Fragment key={member.id}>
                    <ListItem sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {member.name}
                          </Typography>
                          <Chip 
                            label={member.status}
                            size="small"
                            sx={{ 
                              mt: 0.5,
                              bgcolor: member.status === 'Active' ? '#6AB4A820' : '#FDB94E20',
                              color: member.status === 'Active' ? '#6AB4A8' : '#FDB94E',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {member.tasksComplete}/{member.totalTasks} tasks
                        </Typography>
                      </Box>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={(member.tasksComplete / member.totalTasks) * 100}
                          sx={{ 
                            height: 8, 
                            borderRadius: 1,
                            bgcolor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#667eea'
                            }
                          }}
                        />
                      </Box>
                    </ListItem>
                    {index < teamMembers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => navigate(`/employees?department=${user.departmentId}`)}
              >
                View Full Team →
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* This Week's Schedule */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                📅 This Week's Schedule
              </Typography>

              <List sx={{ py: 0 }}>
                {[
                  { day: 'Today', event: 'Team Meeting', time: '2:00 PM', type: 'meeting' },
                  { day: 'Wednesday', event: 'Client Review Session', time: '10:00 AM', type: 'client' },
                  { day: 'Thursday', event: 'Performance Reviews Due', time: 'All Day', type: 'deadline' },
                  { day: 'Friday', event: 'Department Sync', time: '3:00 PM', type: 'meeting' },
                ].map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.type === 'meeting' ? '📅' : item.type === 'client' ? '👥' : '⏰'} {item.event}
                          </Typography>
                        }
                        secondary={`${item.day} • ${item.time}`}
                      />
                    </ListItem>
                    {index < 3 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/calendar')}
              >
                View Full Calendar →
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications & Updates */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                🔔 Notifications & Updates
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Alert severity="warning">
                  <Typography variant="body2">
                    <strong>⚠️ Action Required</strong><br />
                    2 performance reviews due by end of week
                  </Typography>
                </Alert>

                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>📝 New Task</strong><br />
                    Monthly program report assigned - due Dec 20
                  </Typography>
                </Alert>

                <Alert severity="success">
                  <Typography variant="body2">
                    <strong>✅ Milestone Achieved</strong><br />
                    Client satisfaction scores improved 15% this quarter
                  </Typography>
                </Alert>

                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>📊 Report Available</strong><br />
                    Q3 program metrics ready for review
                  </Typography>
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                🚀 Quick Actions
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={3}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate(`/employees?department=${user.departmentId}`)}
                  >
                    👥 My Team
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/reports')}
                  >
                    📊 Reports
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/leave/request')}
                  >
                    🏖️ Request Leave
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/calendar')}
                  >
                    📅 Schedule
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/performance')}
                  >
                    ⭐ Reviews
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/leave/approvals')}
                  >
                    ✅ Approvals
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default CoordinatorDashboard;