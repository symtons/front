import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Avatar,
  CircularProgress,
  Alert,
  Button,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  HealthAndSafety as HealthIcon,
  PersonAdd as PersonAddIcon,
  Assessment as AssessmentIcon,
  Approval as ApprovalIcon
} from '@mui/icons-material';
import { dashboardService } from '../../services/dashboardService';
import { authService } from '../../services/authService';
import Layout from '../../components/common/layout/Layout';

const Dashboard = () => {
  const user = authService.getCurrentUser();
  const employee = JSON.parse(localStorage.getItem('employee') || '{}');

  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activitiesData, actionsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivities(),
        dashboardService.getQuickActions(),
      ]);

      setStats(statsData);
      setActivities(activitiesData);
      setQuickActions(actionsData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatColor = (index) => {
    const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b'];
    return colors[index % colors.length];
  };

  const getStatIcon = (index) => {
    const icons = [
      <PeopleIcon />,
      <AssignmentIcon />,
      <ScheduleIcon />,
      <HealthIcon />
    ];
    return icons[index % icons.length];
  };

  const getActionIcon = (index) => {
    const icons = [
      <PersonAddIcon />,
      <AssessmentIcon />,
      <ApprovalIcon />,
      <HealthIcon />
    ];
    return icons[index % icons.length];
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        <Button variant="contained" onClick={loadDashboardData}>
          Retry
        </Button>
      </Layout>
    );
  }

  const statCards = [
    { 
      label: 'TOTAL EMPLOYEES', 
      value: stats?.totalEmployees || 0, 
      subtitle: 'Active employees',
      color: '#667eea'
    },
    { 
      label: 'PENDING APPROVALS', 
      value: stats?.pendingApprovals || 0, 
      subtitle: 'Needs attention',
      color: '#f093fb'
    },
    { 
      label: 'ACTIVE SHIFTS', 
      value: stats?.activeShifts || 0, 
      subtitle: 'Currently running',
      color: '#4facfe'
    },
    { 
      label: 'SYSTEM HEALTH', 
      value: stats?.systemHealth || '100%', 
      subtitle: 'System operational',
      color: '#43e97b'
    },
  ];

  return (
    <Layout>
      {/* Header Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5, color: '#2c3e50' }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening at TPA today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {statCards.map((stat, index) => (
          <Box key={index} sx={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px' }}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                color: 'white',
                height: '100%',
                transition: 'transform 0.2s',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      backgroundColor: stat.color,
                      width: 56,
                      height: 56,
                      mr: 2
                    }}
                  >
                    {getStatIcon(index)}
                  </Avatar>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '13px', letterSpacing: '0.5px' }}>
                  {stat.label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                  • {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Quick Actions & Recent Activities */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {/* Quick Actions */}
        <Box sx={{ flex: '1 1 58%', minWidth: '400px' }}>
          <Paper sx={{ p: 3, height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#2c3e50' }}>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Frequently used tools and shortcuts
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {quickActions.map((action, index) => (
                <Box key={action.id} sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: '1px solid #e0e0e0',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      borderRadius: '8px',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        borderColor: getStatColor(index),
                      }
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                      <Avatar 
                        sx={{ 
                          backgroundColor: getStatColor(index),
                          mr: 2,
                          width: 48,
                          height: 48
                        }}
                      >
                        {getActionIcon(index)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '14px', color: '#2c3e50' }}>
                          {action.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {action.description}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Recent Activities */}
        <Box sx={{ flex: '1 1 38%', minWidth: '300px' }}>
          <Paper sx={{ p: 3, height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '12px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                  Recent Activities
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Latest system activities
                </Typography>
              </Box>
              <Button size="small" sx={{ color: '#f59e42', fontWeight: 600, textTransform: 'none' }}>
                View All
              </Button>
            </Box>

            <Box>
              {activities.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent activities
                  </Typography>
                </Box>
              ) : (
                activities.slice(0, 5).map((activity, idx) => (
                  <Box 
                    key={activity.id}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      mb: 2,
                      pb: 2,
                      borderBottom: idx < Math.min(activities.length - 1, 4) ? '1px solid #f0f0f0' : 'none'
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        backgroundColor: '#667eea',
                        width: 40,
                        height: 40,
                        mr: 2,
                        fontSize: '16px',
                        fontWeight: 600
                      }}
                    >
                      {activity.user?.charAt(0)?.toUpperCase() || 'A'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mr: 1, color: '#2c3e50' }}>
                          {activity.user}
                        </Typography>
                        <Chip 
                          label={activity.action}
                          size="small" 
                          sx={{ 
                            height: 20,
                            fontSize: '10px',
                            fontWeight: 600,
                            backgroundColor: activity.status === 'Success' ? '#43e97b' : '#f093fb',
                            color: 'white'
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#95a5a6' }}>
                        {formatTimestamp(activity.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Layout>
  );
};

export default Dashboard;