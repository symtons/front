// src/pages/dashboard/EmployeeDashboard.jsx
/**
 * Employee Dashboard
 * Personal dashboard for field operators and staff
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import WelcomeHeader from './components/WelcomeHeader';
import StatCard from './components/StatCard';
import dashboardService from '../../services/dashboardService';
import { 
  formatDate, 
  getStatusColor, 
  getStatusIcon,
  getMetric 
} from './models/dashboardModels';

const EmployeeDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Extract data
  const metrics = dashboardData?.metrics || {};
  const leaveRequests = dashboardData?.requests || [];
  const upcomingEvents = dashboardData?.events || [];

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, [user.employeeId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await dashboardService.getEmployeeDashboard(user.employeeId);
      setDashboardData(data);
    } catch (err) {
      console.error('Error loading employee dashboard:', err);
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
        title="My Dashboard"
        subtitle="Your personal workspace"
      />

      {/* Welcome Section */}
      <WelcomeHeader 
        name={user.firstName}
        role={metrics.JobTitle || user.jobTitle}
        subtitle={metrics.DepartmentName || user.departmentName}
      />

      {/* Stat Cards Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="PTO Days"
            value={getMetric(metrics, 'PTODaysAvailable', 0)}
            type="number"
            subtitle="Available"
            icon="🏖️"
            color="#667eea"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sick Days"
            value={getMetric(metrics, 'SickDaysAvailable', 0)}
            type="number"
            subtitle="Available"
            icon="🤒"
            color="#6AB4A8"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Personal Days"
            value={getMetric(metrics, 'PersonalDaysAvailable', 0)}
            type="number"
            subtitle="Available"
            icon="📅"
            color="#FDB94E"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="My Rating"
            value={getMetric(metrics, 'LatestPerformanceRating', 'N/A')}
            type="text"
            subtitle="Last Review"
            icon="⭐"
            color="#5B8FCC"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* My Schedule Today */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                📅 My Schedule Today
              </Typography>
              
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  7:00 AM - 3:00 PM
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Client Home - 123 Main St
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    bgcolor: '#6AB4A8',
                    '&:hover': { bgcolor: '#5a9d91' }
                  }}
                >
                  ⏰ CLOCK IN
                </Button>
              </Box>
              
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Upcoming Shifts:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Tomorrow - 7:00 AM - 3:00 PM
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Friday - 7:00 AM - 3:00 PM
                </Typography>
              </Box>
              
              <Button 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={() => navigate('/schedule')}
              >
                View Full Schedule →
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* My Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                🔔 My Notifications
              </Typography>
              
              {leaveRequests.filter(req => req.Status === 'Approved').length > 0 && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Leave Request Approved</strong><br />
                    Your PTO request has been approved!
                  </Typography>
                </Alert>
              )}
              
              {metrics.UpcomingReviewDate && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Performance Review Scheduled</strong><br />
                    Your review is scheduled for {formatDate(metrics.UpcomingReviewDate)}
                  </Typography>
                </Alert>
              )}
              
              <Alert severity="warning">
                <Typography variant="body2">
                  <strong>Action Required</strong><br />
                  Please update your emergency contact information
                  <Button size="small" sx={{ ml: 1 }}>Update Now →</Button>
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* My Leave Requests */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  📝 My Leave Requests
                </Typography>
                <Button 
                  variant="contained"
                  onClick={() => navigate('/leave/request')}
                  sx={{ 
                    bgcolor: '#667eea',
                    '&:hover': { bgcolor: '#5568d3' }
                  }}
                >
                  🏖️ Request Leave
                </Button>
              </Box>
              
              {leaveRequests.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No leave requests found
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Dates</TableCell>
                        <TableCell align="right">Days</TableCell>
                        <TableCell>Submitted</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaveRequests.slice(0, 5).map((request) => (
                        <TableRow key={request.LeaveRequestId}>
                          <TableCell>
                            <Chip 
                              label={request.Status}
                              icon={<span>{getStatusIcon(request.Status)}</span>}
                              size="small"
                              sx={{ 
                                bgcolor: getStatusColor(request.Status) + '20',
                                color: getStatusColor(request.Status),
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell>{request.LeaveType}</TableCell>
                          <TableCell>
                            {formatDate(request.StartDate)} - {formatDate(request.EndDate)}
                          </TableCell>
                          <TableCell align="right">{request.TotalDays}</TableCell>
                          <TableCell>{formatDate(request.RequestedAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                🎉 Upcoming Events
              </Typography>
              
              {upcomingEvents.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No upcoming events
                </Typography>
              ) : (
                <Box>
                  {upcomingEvents.map((event, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        mb: 1,
                        bgcolor: '#f5f5f5',
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="h5">
                        {event.EventType === 'Birthday' ? '🎂' : '🎉'}
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {event.EventType}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(event.EventDate)}
                          {event.YearsCount && ` • ${event.YearsCount} years`}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                🚀 Quick Actions
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/leave/request')}
                  >
                    🏖️ Request Leave
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/payroll/paystubs')}
                  >
                    💰 View Paystubs
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/profile')}
                  >
                    👤 My Profile
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/employees')}
                  >
                    👥 Directory
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

export default EmployeeDashboard;