// src/pages/reports/ReportsOverview.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import StatCard from './components/StatCard';
import { getReportsOverview } from '../../services/reportsApi';

const ReportsOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReportsOverview();
      setOverview(response.data);
    } catch (err) {
      console.error('Error loading overview:', err);
      setError(err.response?.data?.message || 'Failed to load reports overview');
    } finally {
      setLoading(false);
    }
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
        <PageHeader title="Reports & Analytics" subtitle="Overview Dashboard" />
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Layout>
    );
  }

  const userRole = overview?.userRole || 'User';
  const roleSubtitle = (userRole === 'Admin' || userRole === 'Executive') 
    ? 'All Departments' 
    : 'Your Department';

  return (
    <Layout>
      <PageHeader 
        title="Reports & Analytics" 
        subtitle={`Overview Dashboard - ${roleSubtitle}`}
      />
      
      <Box sx={{ p: 3 }}>
        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total Employees"
              value={overview?.totalEmployees || 0}
              icon={PeopleIcon}
              color="#667eea"
              subtitle={roleSubtitle}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatCard
              title="Departments"
              value={overview?.totalDepartments || 0}
              icon={BusinessIcon}
              color="#6AB4A8"
              subtitle="Active departments"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatCard
              title="Leave Days (YTD)"
              value={overview?.activeLeaveDays || 0}
              icon={EventBusyIcon}
              color="#FDB94E"
              subtitle="Current year total"
            />
          </Grid>
        </Grid>

        {/* Quick Links */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Quick Access Reports
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderTop: '4px solid #667eea' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#667eea', fontWeight: 'bold' }}>
                Workforce Reports
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                View employee data, headcount, and turnover analysis
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/reports/workforce')}
                >
                  • Employee Summary
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/reports/workforce')}
                >
                  • Headcount by Department
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/reports/workforce')}
                >
                  • Turnover Analysis
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderTop: '4px solid #6AB4A8' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#6AB4A8', fontWeight: 'bold' }}>
                Payroll Reports
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Access salary information and compensation data
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/reports/payroll')}
                >
                  • Payroll by Department
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/reports/payroll')}
                >
                  • Salary by Role
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderTop: '4px solid #FDB94E' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#FDB94E', fontWeight: 'bold' }}>
                Leave & Attendance
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Monitor leave usage and attendance patterns
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/reports/leave')}
                >
                  • Leave Summary
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/reports/leave')}
                >
                  • Leave by Department
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/reports/leave')}
                >
                  • PTO Balances
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderTop: '4px solid #f56565' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#f56565', fontWeight: 'bold' }}>
                Performance & Recruitment
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Review performance data and hiring metrics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/reports/performance')}
                >
                  • Performance Reviews
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/reports/recruitment')}
                >
                  • Job Applications
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/reports/hr-actions')}
                >
                  • HR Action Requests
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default ReportsOverview;