// src/pages/dashboard/ManagerDashboard.jsx
/**
 * Manager Dashboard (Field Operator Manager)
 * Field operations and team scheduling overview
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
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import WelcomeHeader from './components/WelcomeHeader';
import StatCard from './components/StatCard';
import dashboardService from '../../services/dashboardService';
import { getMetric } from './models/dashboardModels';

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

  // Mock field staff data (replace with actual data from API)
  const fieldStaff = [
    { id: 1, name: 'John Smith', shift: '7:00 AM - 3:00 PM', location: 'Client Home - 123 Main St', status: 'clocked-in' },
    { id: 2, name: 'Jane Doe', shift: '8:00 AM - 4:00 PM', location: 'Client Home - 456 Oak Ave', status: 'clocked-in' },
    { id: 3, name: 'Bob Johnson', shift: '9:00 AM - 5:00 PM', location: 'Client Home - 789 Pine Rd', status: 'scheduled' },
    { id: 4, name: 'Sarah Williams', shift: '7:00 AM - 3:00 PM', location: 'Client Home - 321 Elm St', status: 'on-break' },
    { id: 5, name: 'Mike Brown', shift: '10:00 AM - 6:00 PM', location: 'Client Home - 654 Maple Dr', status: 'scheduled' },
    { id: 6, name: 'Lisa Davis', shift: '8:00 AM - 4:00 PM', location: 'Client Home - 987 Cedar Ln', status: 'clocked-in' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'clocked-in': return '#6AB4A8';
      case 'on-break': return '#FDB94E';
      case 'scheduled': return '#667eea';
      default: return '#757575';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'clocked-in': return 'On Duty';
      case 'on-break': return 'On Break';
      case 'scheduled': return 'Scheduled';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'clocked-in': return '🟢';
      case 'on-break': return '🟡';
      case 'scheduled': return '🔵';
      default: return '⚪';
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

      {/* Stat Cards Row */}
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
            title="On Duty Today"
            value={fieldStaff.filter(s => s.status === 'clocked-in').length}
            type="number"
            subtitle="Currently Working"
            icon="🟢"
            color="#6AB4A8"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Scheduled Tomorrow"
            value={7}
            type="number"
            subtitle="Upcoming Shifts"
            icon="📅"
            color="#FDB94E"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="On Leave"
            value={getMetric(metrics, 'OnLeaveToday', 0)}
            type="number"
            subtitle="Today"
            icon="🏖️"
            color="#5B8FCC"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Live Field Staff Status */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  📍 Live Field Staff Status
                </Typography>
                <Button size="small" onClick={loadDashboardData}>
                  🔄 Refresh
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width="50">Status</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Shift Time</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell align="center">Clock Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fieldStaff.map((staff) => (
                      <TableRow key={staff.id} hover>
                        <TableCell>
                          <Typography variant="h6">
                            {getStatusIcon(staff.status)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {staff.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{staff.shift}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {staff.location}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={getStatusLabel(staff.status)}
                            size="small"
                            sx={{ 
                              bgcolor: getStatusColor(staff.status) + '20',
                              color: getStatusColor(staff.status),
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
                <Alert severity="warning">
                  <Typography variant="body2">
                    <strong>⚠️ Coverage Needed</strong><br />
                    Tomorrow 7:00 AM shift needs 1 more operator
                  </Typography>
                </Alert>

                {getMetric(metrics, 'PendingLeaveRequests', 0) > 0 && (
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>📝 Pending Approvals</strong><br />
                      {getMetric(metrics, 'PendingLeaveRequests', 0)} leave requests awaiting your approval
                      <Button size="small" sx={{ ml: 1 }} onClick={() => navigate('/leave/approvals')}>
                        Review →
                      </Button>
                    </Typography>
                  </Alert>
                )}

                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>🔄 Shift Swap Request</strong><br />
                    John Smith requested to swap Friday shift with Jane Doe
                  </Typography>
                </Alert>

                <Alert severity="success">
                  <Typography variant="body2">
                    <strong>✅ Perfect Attendance</strong><br />
                    Sarah Williams - 30 days no absences
                  </Typography>
                </Alert>
              </Box>
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

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell align="right">Scheduled</TableCell>
                      <TableCell align="right">Required</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { day: 'Monday', scheduled: 8, required: 8, status: 'full' },
                      { day: 'Tuesday', scheduled: 7, required: 8, status: 'short' },
                      { day: 'Wednesday', scheduled: 8, required: 8, status: 'full' },
                      { day: 'Thursday', scheduled: 8, required: 8, status: 'full' },
                      { day: 'Friday', scheduled: 6, required: 8, status: 'critical' },
                    ].map((day) => (
                      <TableRow key={day.day}>
                        <TableCell sx={{ fontWeight: 600 }}>{day.day}</TableCell>
                        <TableCell align="right">{day.scheduled}</TableCell>
                        <TableCell align="right">{day.required}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={
                              day.status === 'full' ? 'Fully Staffed' :
                              day.status === 'short' ? 'Short 1' :
                              'Critical'
                            }
                            size="small"
                            sx={{ 
                              bgcolor: 
                                day.status === 'full' ? '#6AB4A820' :
                                day.status === 'short' ? '#FDB94E20' :
                                '#F4433620',
                              color: 
                                day.status === 'full' ? '#6AB4A8' :
                                day.status === 'short' ? '#FDB94E' :
                                '#F44336',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/schedule')}
              >
                📅 View Full Schedule
              </Button>
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
                    onClick={() => navigate('/schedule')}
                  >
                    📅 Manage Schedule
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/leave/approvals')}
                  >
                    ✅ Approve Requests
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/attendance')}
                  >
                    ⏰ Clock In/Out
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
                    onClick={() => navigate(`/employees?department=${user.departmentId}`)}
                  >
                    👥 My Team
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