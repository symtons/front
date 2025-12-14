// src/pages/dashboard/CoordinatorDashboard.jsx
/**
 * Coordinator Dashboard (Program Coordinator)
 * Program management and team coordination - DATABASE DRIVEN
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import WelcomeHeader from './components/WelcomeHeader';
import StatCard from './components/StatCard';
import dashboardService from '../../services/dashboardService';
import { formatDate, getStatusColor, getStatusIcon, getMetric } from './models/dashboardModels';

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
        title="Coordinator Dashboard"
        subtitle="Program Management & Team Coordination"
      />

      {/* Welcome Section */}
      <WelcomeHeader 
        name={user.firstName}
        role="Program Coordinator"
        subtitle={user.departmentName}
      />

      {/* Stat Cards Row - ALL FROM DATABASE */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Team Size"
            value={getMetric(metrics, 'TeamSize', 0)}
            type="number"
            subtitle="Direct Reports"
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
            color="#6AB4A8"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="On Leave Today"
            value={getMetric(metrics, 'OnLeaveToday', 0)}
            type="number"
            subtitle="Team Members"
            icon="🏖️"
            color="#FDB94E"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open Reviews"
            value={getMetric(metrics, 'OpenPerformanceReviews', 0)}
            type="number"
            subtitle="This Period"
            icon="⭐"
            color="#5B8FCC"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Department Overview */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                📊 Department Overview
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {metrics.DepartmentName || 'N/A'}
                  </Typography>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Team Members
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {getMetric(metrics, 'TeamSize', 0)}
                  </Typography>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Available Today
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#6AB4A8' }}>
                    {getMetric(metrics, 'TeamSize', 0) - getMetric(metrics, 'OnLeaveToday', 0)}
                  </Typography>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Avg Team Rating
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {getMetric(metrics, 'TeamAvgRating', 0).toFixed(1)} ⭐
                  </Typography>
                </Box>
              </Box>

              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ mt: 3 }}
                onClick={() => navigate(`/employees?department=${user.departmentId}`)}
              >
                View Full Team →
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications & Alerts */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                🔔 Notifications & Alerts
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {getMetric(metrics, 'PendingLeaveRequests', 0) > 0 && (
                  <Alert severity="warning">
                    <Typography variant="body2">
                      <strong>⚠️ Pending Approvals</strong><br />
                      {getMetric(metrics, 'PendingLeaveRequests', 0)} leave requests awaiting your approval
                      <Button 
                        size="small" 
                        sx={{ ml: 1 }}
                        onClick={() => navigate('/leave/approve')}
                      >
                        Review →
                      </Button>
                    </Typography>
                  </Alert>
                )}

                {getMetric(metrics, 'OpenPerformanceReviews', 0) > 0 && (
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>📝 Performance Reviews</strong><br />
                      {getMetric(metrics, 'OpenPerformanceReviews', 0)} reviews pending this period
                    </Typography>
                  </Alert>
                )}

                {getMetric(metrics, 'OnLeaveToday', 0) > 0 && (
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>🏖️ Team Absences</strong><br />
                      {getMetric(metrics, 'OnLeaveToday', 0)} team member{getMetric(metrics, 'OnLeaveToday', 0) > 1 ? 's are' : ' is'} on leave today
                    </Typography>
                  </Alert>
                )}

                {getMetric(metrics, 'TeamAvgRating', 0) >= 4.5 && (
                  <Alert severity="success">
                    <Typography variant="body2">
                      <strong>✅ Excellent Performance</strong><br />
                      Your team maintains a {getMetric(metrics, 'TeamAvgRating', 0).toFixed(1)} average rating
                    </Typography>
                  </Alert>
                )}

                {/* Show when everything is good */}
                {getMetric(metrics, 'PendingLeaveRequests', 0) === 0 && 
                 getMetric(metrics, 'OpenPerformanceReviews', 0) === 0 && (
                  <Alert severity="success">
                    <Typography variant="body2">
                      <strong>✅ All Clear</strong><br />
                      No pending actions - everything is up to date!
                    </Typography>
                  </Alert>
                )}
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
                    onClick={() => navigate('/leave/approve')}
                  >
                    ✅ Approvals
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
                    onClick={() => navigate('/profile')}
                  >
                    👤 My Profile
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