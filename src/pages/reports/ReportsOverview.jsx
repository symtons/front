// src/features/reports/pages/ReportsOverview.jsx
import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { Layout, PageHeader } from '../../components/common';
import StatCard from './components/StatCard';
import { getReportsOverview } from '../../services/reportsApi';

const ReportsOverview = () => {
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
        <Box sx={{ p: 3 }}>
          <PageHeader title="Reports & Analytics" subtitle="Overview Dashboard" />
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
      <PageHeader 
        title="Reports & Analytics" 
        subtitle={`Overview Dashboard - ${overview?.canViewAllData ? 'All Departments' : 'Your Department'}`}
      />

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Employees"
            value={overview?.totalEmployees || 0}
            icon={PeopleIcon}
            color="#667eea"
            subtitle="Active workforce"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Departments"
            value={overview?.totalDepartments || 0}
            icon={BusinessIcon}
            color="#6AB4A8"
            subtitle={overview?.canViewAllData ? "All departments" : "Your department"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Leave Days (YTD)"
            value={overview?.activeLeaveDays || 0}
            icon={EventBusyIcon}
            color="#FDB94E"
            subtitle="Approved leave days this year"
          />
        </Grid>
      </Grid>

      {/* Quick Links */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderTop: '4px solid #667eea' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#667eea', fontWeight: 'bold' }}>
              Workforce Reports
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              View employee summaries, headcount analysis, and turnover data
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => window.location.href = '/reports/workforce'}
              >
                • Employee Summary
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => window.location.href = '/reports/workforce'}
              >
                • Headcount by Department
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => window.location.href = '/reports/workforce'}
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
              Analyze compensation data and salary distributions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => window.location.href = '/reports/payroll'}
              >
                • Payroll by Department
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => window.location.href = '/reports/payroll'}
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
              Track leave requests and PTO balances
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => window.location.href = '/reports/leave'}
              >
                • Leave Summary
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => window.location.href = '/reports/leave'}
              >
                • Usage by Department
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => window.location.href = '/reports/leave'}
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
                onClick={() => window.location.href = '/reports/performance'}
              >
                • Performance Reviews
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => window.location.href = '/reports/recruitment'}
              >
                • Job Applications
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => window.location.href = '/reports/hr-actions'}
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