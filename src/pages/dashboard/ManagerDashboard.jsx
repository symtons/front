// src/pages/dashboard/ManagerDashboard.jsx
/**
 * Manager Dashboard (Field Operator Manager)
 * Field operations and team scheduling overview - DATABASE DRIVEN
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
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import WelcomeHeader from './components/WelcomeHeader';
import StatCard from './components/StatCard';
import dashboardService from '../../services/dashboardService';
import { getMetric, formatDate } from './models/dashboardModels';

const ManagerDashboard = ({ user }) => {
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
      
      const data = await dashboardService.getManagerDashboard(user.employeeId);
      setDashboardData(data);
    } catch (err) {
      console.error('Error loading manager dashboard:', err);
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
        title="Manager Dashboard"
        subtitle={`${metrics.DepartmentName || 'Department'} Field Operations`}
      />

      {/* Welcome Section */}
      <WelcomeHeader 
        name={user.firstName}
        role={`Field Operator Manager - ${metrics.DepartmentName || 'Department'}`}
      />

      {/* Stat Cards Row - ALL FROM DATABASE */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Team"
            value={getMetric(metrics, 'TotalTeamMembers', 0)}
            type="number"
            subtitle="Field Operators"
            icon="👥"
            color="#667eea"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Available Today"
            value={getMetric(metrics, 'TotalTeamMembers', 0) - getMetric(metrics, 'OnLeaveToday', 0)}
            type="number"
            subtitle="Active Workers"
            icon="🟢"
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
            title="Pending Requests"
            value={getMetric(metrics, 'PendingLeaveRequests', 0)}
            type="number"
            subtitle="Awaiting Approval"
            icon="⏳"
            color="#5B8FCC"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Team Status Overview */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                📊 Team Status Overview
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Field Operators
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {getMetric(metrics, 'TotalTeamMembers', 0)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Available for Assignment
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#6AB4A8' }}>
                    {getMetric(metrics, 'TotalTeamMembers', 0) - getMetric(metrics, 'OnLeaveToday', 0)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Coverage Rate
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {getMetric(metrics, 'TotalTeamMembers', 0) > 0 
                      ? ((getMetric(metrics, 'TotalTeamMembers', 0) - getMetric(metrics, 'OnLeaveToday', 0)) / getMetric(metrics, 'TotalTeamMembers', 1) * 100).toFixed(0)
                      : 0}%
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Average Team Rating
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
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
                📋 View Full Team Roster
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts & Notifications */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                🚨 Alerts & Notifications
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Coverage Alert */}
                {getMetric(metrics, 'OnLeaveToday', 0) > (getMetric(metrics, 'TotalTeamMembers', 0) * 0.3) && (
                  <Alert severity="warning">
                    <Typography variant="body2">
                      <strong>⚠️ Low Coverage Alert</strong><br />
                      {getMetric(metrics, 'OnLeaveToday', 0)} team members on leave today - consider backup staffing
                    </Typography>
                  </Alert>
                )}

                {/* Pending Approvals */}
                {getMetric(metrics, 'PendingLeaveRequests', 0) > 0 && (
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>📝 Pending Approvals</strong><br />
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

                {/* Good Performance */}
                {getMetric(metrics, 'TeamAvgRating', 0) >= 4.5 && (
                  <Alert severity="success">
                    <Typography variant="body2">
                      <strong>✅ Excellent Team Performance</strong><br />
                      Team maintains {getMetric(metrics, 'TeamAvgRating', 0).toFixed(1)} average rating
                    </Typography>
                  </Alert>
                )}

                {/* All Clear */}
                {getMetric(metrics, 'PendingLeaveRequests', 0) === 0 && 
                 getMetric(metrics, 'OnLeaveToday', 0) === 0 && (
                  <Alert severity="success">
                    <Typography variant="body2">
                      <strong>✅ Full Team Available</strong><br />
                      All field operators are available for assignment today
                    </Typography>
                  </Alert>
                )}

                {/* Information */}
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>ℹ️ Tip</strong><br />
                    Use the Team Roster to view detailed availability and schedules
                  </Typography>
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Access to Common Tasks */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                📋 Field Operations Management
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        👥 Team Roster
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        View and manage field operator assignments
                      </Typography>
                      <Button 
                        fullWidth 
                        variant="contained"
                        onClick={() => navigate(`/employees?department=${user.departmentId}`)}
                      >
                        View Roster →
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        ✅ Leave Approvals
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Review and approve time-off requests
                      </Typography>
                      <Button 
                        fullWidth 
                        variant="contained"
                        onClick={() => navigate('/leave/approve')}
                      >
                        {getMetric(metrics, 'PendingLeaveRequests', 0) > 0 
                          ? `Review ${getMetric(metrics, 'PendingLeaveRequests', 0)} Request${getMetric(metrics, 'PendingLeaveRequests', 0) > 1 ? 's' : ''}`
                          : 'View Approvals'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        📊 Reports
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        View team performance and metrics
                      </Typography>
                      <Button 
                        fullWidth 
                        variant="contained"
                        onClick={() => navigate('/reports')}
                      >
                        View Reports →
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
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
                    👥 Team Roster
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/leave/approve')}
                  >
                    ✅ Approve Leave
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/attendance')}
                  >
                    ⏰ Attendance
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
                    onClick={() => navigate('/performance')}
                  >
                    ⭐ Performance
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

export default ManagerDashboard;