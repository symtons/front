// src/pages/dashboard/AdminDashboard.jsx
/**
 * Admin Dashboard
 * System-wide overview for administrators
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
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import WelcomeHeader from './components/WelcomeHeader';
import StatCard from './components/StatCard';
import dashboardService from '../../services/dashboardService';
import { 
  formatDate,
  getRelativeTime,
  getActivityIcon,
  getMetric 
} from './models/dashboardModels';

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Extract data
  const metrics = dashboardData?.metrics || {};
  const departments = dashboardData?.departments || [];
  const activity = dashboardData?.activity || [];

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await dashboardService.getAdminDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
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

  return (
    <Layout>
      <PageHeader 
        title="Admin Dashboard"
        subtitle="System-wide overview and management"
      />

      {/* Welcome Section */}
      <WelcomeHeader 
        name={user.firstName}
        role="System Administrator"
      />

      {/* Stat Cards Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Employees"
            value={getMetric(metrics, 'TotalEmployees', 0)}
            type="number"
            subtitle={`${getMetric(metrics, 'ActiveEmployees', 0)} Active`}
            icon="👥"
            color="#667eea"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Approvals"
            value={getMetric(metrics, 'PendingLeaveRequests', 0)}
            type="number"
            subtitle="Leave Requests"
            icon="⏳"
            color="#FDB94E"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Applications"
            value={getMetric(metrics, 'NewApplicationsThisWeek', 0)}
            type="number"
            subtitle="This Week"
            icon="📝"
            color="#6AB4A8"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="HR Actions"
            value={getMetric(metrics, 'PendingHRActions', 0)}
            type="number"
            subtitle="Open Items"
            icon="📋"
            color="#5B8FCC"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Requires Attention */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                🔔 Requires Attention
              </Typography>

              <List sx={{ py: 0 }}>
                {getMetric(metrics, 'PendingLeaveRequests', 0) > 0 && (
                  <>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              ⚠️ {getMetric(metrics, 'PendingLeaveRequests', 0)} Leave Requests
                            </Typography>
                            <Button 
                              size="small" 
                              onClick={() => navigate('/leave')}
                            >
                              Review →
                            </Button>
                          </Box>
                        }
                        secondary="Pending Approval"
                      />
                    </ListItem>
                    <Divider />
                  </>
                )}

                {getMetric(metrics, 'PendingHRActions', 0) > 0 && (
                  <>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              ⚠️ {getMetric(metrics, 'PendingHRActions', 0)} HR Action Forms
                            </Typography>
                            <Button 
                              size="small"
                              onClick={() => navigate('/hr-actions')}
                            >
                              Review →
                            </Button>
                          </Box>
                        }
                        secondary="Awaiting Review"
                      />
                    </ListItem>
                    <Divider />
                  </>
                )}

                {getMetric(metrics, 'OpenPerformanceReviews', 0) > 0 && (
                  <>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              ℹ️ {getMetric(metrics, 'OpenPerformanceReviews', 0)} Performance Reviews
                            </Typography>
                            <Button 
                              size="small"
                              onClick={() => navigate('/performance')}
                            >
                              View →
                            </Button>
                          </Box>
                        }
                        secondary="In Progress"
                      />
                    </ListItem>
                    <Divider />
                  </>
                )}

                {getMetric(metrics, 'NewApplicationsThisWeek', 0) > 0 && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ℹ️ {getMetric(metrics, 'NewApplicationsThisWeek', 0)} Job Applications
                          </Typography>
                          <Button 
                            size="small"
                            onClick={() => navigate('/recruitment')}
                          >
                            Review →
                          </Button>
                        </Box>
                      }
                      secondary="New This Week"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Department Overview */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                📈 Department Overview
              </Typography>

              {departments.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No department data available
                </Typography>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="DepartmentName" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="EmployeeCount" fill="#667eea" name="Total" />
                    <Bar dataKey="ActiveCount" fill="#6AB4A8" name="Active" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Chip 
                  label={`Total Departments: ${departments.length}`}
                  size="small"
                  sx={{ bgcolor: '#667eea20', color: '#667eea', fontWeight: 600 }}
                />
                <Chip 
                  label={`Total Headcount: ${getMetric(metrics, 'TotalEmployees', 0)}`}
                  size="small"
                  sx={{ bgcolor: '#6AB4A820', color: '#6AB4A8', fontWeight: 600 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  📝 Recent System Activity
                </Typography>
                <Button size="small" onClick={loadDashboardData}>
                  🔄 Refresh
                </Button>
              </Box>

              {activity.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No recent activity
                </Typography>
              ) : (
                <List sx={{ py: 0 }}>
                  {activity.slice(0, 10).map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ px: 0, py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <Typography variant="h6">
                            {getActivityIcon(item.ActivityType)}
                          </Typography>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.EmployeeName} - {item.ActivityType}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.Details}
                            </Typography>
                          </Box>
                          <Chip 
                            label={item.Status}
                            size="small"
                            sx={{ 
                              bgcolor: item.Status === 'Pending' ? '#FDB94E20' : '#6AB4A820',
                              color: item.Status === 'Pending' ? '#FDB94E' : '#6AB4A8',
                              fontWeight: 600
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, textAlign: 'right' }}>
                            {getRelativeTime(item.ActivityDate)}
                          </Typography>
                        </Box>
                      </ListItem>
                      {index < activity.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
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
                <Grid item xs={6} sm={4} md={2}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/reports')}
                  >
                    📊 Reports
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/employees')}
                  >
                    👥 Directory
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/settings')}
                  >
                    ⚙️ Settings
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/roles')}
                  >
                    🔐 Roles
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/departments')}
                  >
                    🏢 Departments
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/announcements')}
                  >
                    📧 Announce
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

export default AdminDashboard;