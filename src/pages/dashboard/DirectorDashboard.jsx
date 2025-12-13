// src/pages/dashboard/DirectorDashboard.jsx
/**
 * Director Dashboard
 * Department-specific overview for directors
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
  IconButton
} from '@mui/material';
import { 
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import WelcomeHeader from './components/WelcomeHeader';
import StatCard from './components/StatCard';
import dashboardService from '../../services/dashboardService';
import { 
  formatDate,
  getStatusIcon,
  getMetric 
} from './models/dashboardModels';

const DirectorDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Extract data
  const metrics = dashboardData?.metrics || {};
  const approvals = dashboardData?.approvals || [];
  const team = dashboardData?.team || [];

  // Load dashboard data
  useEffect(() => {
    if (user.departmentId) {
      loadDashboardData();
    }
  }, [user.departmentId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await dashboardService.getDirectorDashboard(user.departmentId);
      setDashboardData(data);
    } catch (err) {
      console.error('Error loading director dashboard:', err);
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
        title="Director Dashboard"
        subtitle={`${metrics.DepartmentName || 'Department'} Management`}
      />

      {/* Welcome Section */}
      <WelcomeHeader 
        name={user.firstName}
        role={`Director - ${metrics.DepartmentName || 'Department'}`}
      />

      {/* Stat Cards Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Team Size"
            value={getMetric(metrics, 'TeamSize', 0)}
            type="number"
            subtitle={`${getMetric(metrics, 'ActiveMembers', 0)} Active`}
            icon="👥"
            color="#667eea"
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
            title="Team Avg Rating"
            value={getMetric(metrics, 'TeamAvgRating', 0).toFixed(1)}
            type="text"
            subtitle="Performance"
            icon="⭐"
            color="#6AB4A8"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Approvals"
            value={getMetric(metrics, 'PendingLeaveApprovals', 0)}
            type="number"
            subtitle="Require Action"
            icon="⏳"
            color="#5B8FCC"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Pending Approvals */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                🔔 Pending My Approval
              </Typography>

              {approvals.length === 0 ? (
                <Alert severity="success" sx={{ mt: 2 }}>
                  No pending approvals - you're all caught up! ✅
                </Alert>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Dates</TableCell>
                        <TableCell align="right">Days</TableCell>
                        <TableCell>Requested</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {approvals.slice(0, 5).map((request) => (
                        <TableRow key={request.LeaveRequestId}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {request.FirstName} {request.LastName}
                            </Typography>
                          </TableCell>
                          <TableCell>{request.LeaveType}</TableCell>
                          <TableCell>
                            {formatDate(request.StartDate)} - {formatDate(request.EndDate)}
                          </TableCell>
                          <TableCell align="right">{request.TotalDays}</TableCell>
                          <TableCell>{formatDate(request.RequestedAt)}</TableCell>
                          <TableCell align="center">
                            <IconButton 
                              size="small" 
                              sx={{ color: '#6AB4A8' }}
                              onClick={() => navigate(`/leave/review/${request.LeaveRequestId}`)}
                            >
                              <ApproveIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ color: '#F44336' }}
                              onClick={() => navigate(`/leave/review/${request.LeaveRequestId}`)}
                            >
                              <RejectIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {approvals.length > 5 && (
                <Button 
                  fullWidth 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/leave/approvals')}
                >
                  View All {approvals.length} Approvals →
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                📊 Department Stats
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Team Attendance
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {((getMetric(metrics, 'TeamSize', 1) - getMetric(metrics, 'OnLeaveToday', 0)) / getMetric(metrics, 'TeamSize', 1) * 100).toFixed(0)}%
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Reviews Due This Week
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {getMetric(metrics, 'ReviewsDueThisWeek', 0)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Open Positions
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {getMetric(metrics, 'OpenPositions', 0)}
                  </Typography>
                </Box>

                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/reports')}
                >
                  📈 View Department Reports
                </Button>

                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate(`/employees?department=${user.departmentId}`)}
                >
                  👥 View Team Directory
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Status */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                👥 My Team Status
              </Typography>

              {team.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No team members found
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Job Title</TableCell>
                        <TableCell>Tenure</TableCell>
                        <TableCell align="center">Rating</TableCell>
                        <TableCell>Current Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {team.slice(0, 10).map((member) => (
                        <TableRow 
                          key={member.EmployeeId}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/employees/${member.EmployeeId}`)}
                        >
                          <TableCell>
                            <Typography variant="h6">
                              {getStatusIcon(member.CurrentStatus)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {member.FirstName} {member.LastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {member.EmployeeCode}
                            </Typography>
                          </TableCell>
                          <TableCell>{member.JobTitle}</TableCell>
                          <TableCell>{member.YearsOfService} years</TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={member.LatestRating ? member.LatestRating.toFixed(1) : 'N/A'}
                              size="small"
                              sx={{ 
                                bgcolor: '#6AB4A820',
                                color: '#6AB4A8',
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={member.CurrentStatus}
                              size="small"
                              sx={{ 
                                bgcolor: member.CurrentStatus === 'Available' ? '#6AB4A820' : '#FDB94E20',
                                color: member.CurrentStatus === 'Available' ? '#6AB4A8' : '#FDB94E',
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {team.length > 10 && (
                <Button 
                  fullWidth 
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/employees?department=${user.departmentId}`)}
                >
                  View All {team.length} Team Members →
                </Button>
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
                    onClick={() => navigate('/leave/approvals')}
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default DirectorDashboard;