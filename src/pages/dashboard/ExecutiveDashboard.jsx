// src/pages/dashboard/ExecutiveDashboard.jsx
/**
 * Executive Dashboard
 * High-level KPIs and strategic overview for executives
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
  Chip,
  Divider
} from '@mui/material';
import { 
  TrendingUp as TrendUpIcon,
  TrendingDown as TrendDownIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import WelcomeHeader from './components/WelcomeHeader';
import StatCard from './components/StatCard';
import dashboardService from '../../services/dashboardService';
import { 
  formatCurrency,
  formatPercentage,
  getMetric,
  calculatePercentageChange
} from './models/dashboardModels';

const ExecutiveDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Extract data
  const metrics = dashboardData?.metrics || {};
  const headcountTrend = dashboardData?.trend || [];
  const departmentPerformance = dashboardData?.performance || [];

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await dashboardService.getExecutiveDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Error loading executive dashboard:', err);
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

  // Calculate trends
  const headcountChange = headcountTrend.length >= 2 
    ? calculatePercentageChange(
        headcountTrend[headcountTrend.length - 1]?.Headcount,
        headcountTrend[0]?.Headcount
      )
    : 0;

  return (
    <Layout>
      <PageHeader 
        title="Executive Dashboard"
        subtitle="Strategic Overview & Key Performance Indicators"
      />

      {/* Welcome Section */}
      <WelcomeHeader 
        name={user.firstName}
        role="Executive Leadership"
      />

      {/* KPI Stat Cards Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Payroll"
            value={getMetric(metrics, 'TotalPayroll', 0)}
            type="currency"
            subtitle="Annual Spend"
            icon="💰"
            color="#667eea"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Headcount"
            value={getMetric(metrics, 'TotalHeadcount', 0)}
            type="number"
            subtitle={`${getMetric(metrics, 'HiresMTD', 0)} hires MTD`}
            icon="👥"
            color="#6AB4A8"
            trend={{
              direction: headcountChange > 0 ? 'up' : headcountChange < 0 ? 'down' : 'stable',
              value: formatPercentage(Math.abs(headcountChange)),
              label: '6-month'
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Performance"
            value={getMetric(metrics, 'AvgRatingThisQuarter', 0).toFixed(1)}
            type="text"
            subtitle="This Quarter"
            icon="⭐"
            color="#FDB94E"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Turnover Rate"
            value={formatPercentage(getMetric(metrics, 'TurnoverRateYTD', 0))}
            type="text"
            subtitle="Year to Date"
            icon="📊"
            color="#5B8FCC"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Headcount Trend */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                📈 Headcount Trend (6 Months)
              </Typography>

              {headcountTrend.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No trend data available
                </Typography>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={headcountTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="Period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="Headcount" 
                        stroke="#667eea" 
                        strokeWidth={3}
                        name="Total Headcount"
                      />
                    </LineChart>
                  </ResponsiveContainer>

                  <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Chip 
                      icon={headcountChange > 0 ? <TrendUpIcon /> : <TrendDownIcon />}
                      label={`${formatPercentage(Math.abs(headcountChange))} ${headcountChange > 0 ? 'Growth' : 'Decline'}`}
                      size="small"
                      sx={{ 
                        bgcolor: headcountChange > 0 ? '#6AB4A820' : '#F4433620',
                        color: headcountChange > 0 ? '#6AB4A8' : '#F44336',
                        fontWeight: 600 
                      }}
                    />
                    <Chip 
                      label={`Current: ${headcountTrend[headcountTrend.length - 1]?.Headcount || 0}`}
                      size="small"
                      sx={{ bgcolor: '#667eea20', color: '#667eea', fontWeight: 600 }}
                    />
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Workforce Metrics */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                👔 Workforce Metrics
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Departments
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {getMetric(metrics, 'TotalDepartments', 0)}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Active Employees
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {((getMetric(metrics, 'TotalHeadcount', 0) - 0) / getMetric(metrics, 'TotalHeadcount', 1) * 100).toFixed(0)}%
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    New Hires MTD
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#6AB4A8' }}>
                    +{getMetric(metrics, 'HiresMTD', 0)}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Avg Salary
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {formatCurrency(getMetric(metrics, 'AvgSalary', 0))}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Department Performance Comparison */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                🏢 Department Performance Overview
              </Typography>

              {departmentPerformance.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No department data available
                </Typography>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={departmentPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="DepartmentName" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        yAxisId="left"
                        dataKey="EmployeeCount" 
                        fill="#667eea" 
                        name="Headcount"
                      />
                      <Bar 
                        yAxisId="right"
                        dataKey="AvgPerformanceRating" 
                        fill="#6AB4A8" 
                        name="Avg Rating"
                      />
                    </BarChart>
                  </ResponsiveContainer>

                  <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {departmentPerformance.map((dept, index) => (
                      <Chip 
                        key={index}
                        label={`${dept.DepartmentName}: ${dept.EmployeeCount} • ${dept.AvgPerformanceRating?.toFixed(1) || 'N/A'}★`}
                        size="small"
                        sx={{ bgcolor: '#f5f5f5' }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Insights */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                ⭐ Performance Insights
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Review Completion Rate
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {formatPercentage(getMetric(metrics, 'ReviewCompletionRate', 0))}
                  </Typography>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Avg Rating (All)
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {getMetric(metrics, 'AvgRatingThisQuarter', 0).toFixed(1)} / 5.0
                  </Typography>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Top Performers
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#6AB4A8' }}>
                    12
                  </Typography>
                </Box>

                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/performance/reports')}
                >
                  📊 View Performance Reports
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Strategic Alerts */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                🚨 Strategic Alerts
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {getMetric(metrics, 'TurnoverRateYTD', 0) > 10 && (
                  <Alert severity="warning">
                    <Typography variant="body2">
                      <strong>High Turnover Rate</strong><br />
                      Nursing department turnover ({formatPercentage(15)}) is above target threshold
                    </Typography>
                  </Alert>
                )}

                {getMetric(metrics, 'HiresMTD', 0) > 5 && (
                  <Alert severity="success">
                    <Typography variant="body2">
                      <strong>Strong Recruitment</strong><br />
                      {getMetric(metrics, 'HiresMTD', 0)} new hires this month - exceeding targets
                    </Typography>
                  </Alert>
                )}

                {getMetric(metrics, 'ReviewCompletionRate', 0) < 90 && (
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>Review Completion</strong><br />
                      {formatPercentage(100 - getMetric(metrics, 'ReviewCompletionRate', 0))} of reviews still pending
                    </Typography>
                  </Alert>
                )}

                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Budget Optimization</strong><br />
                    Review recruitment spend - potential savings identified
                  </Typography>
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Executive Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                🎯 Executive Actions
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={2}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/reports')}
                  >
                    📊 Full Reports
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/reports/budget')}
                  >
                    💰 Budget
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/reports/strategic')}
                  >
                    🎯 Strategy
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/employees')}
                  >
                    👥 Workforce
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/reports/board')}
                  >
                    📋 Board Report
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Button 
                    fullWidth 
                    variant="outlined"
                    onClick={() => navigate('/reports/kpi')}
                  >
                    📈 KPI Tracking
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

export default ExecutiveDashboard;