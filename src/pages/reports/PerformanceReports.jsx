// src/pages/reports/PerformanceReports.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  Assessment as PerformanceIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as GoalIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import DataTable from '../../components/common/tables/DataTable';
import StatCard from './components/StatCard';
import {
  getPerformanceSummary,
  getPerformanceByDepartment,
  getGoalCompletion
} from '../../services/reportsApi';
import { exportToCSV, printReport } from './helpers/reportsHelpers';
import { TPA_COLORS } from './models/reportsModels';

const PerformanceReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const [performanceSummary, setPerformanceSummary] = useState([]);
  const [performanceByDept, setPerformanceByDept] = useState([]);
  const [goalCompletion, setGoalCompletion] = useState([]);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [periods] = useState([
    { value: 'all', label: 'All Periods' },
    { value: 1, label: 'Period 1' },
    { value: 2, label: 'Period 2' },
    { value: 3, label: 'Period 3' },
    { value: 4, label: 'Period 4' }
  ]);

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const periodParam = selectedPeriod === 'all' ? null : selectedPeriod;

      const [summaryRes, deptRes, goalsRes] = await Promise.all([
        getPerformanceSummary(periodParam),
        getPerformanceByDepartment(periodParam),
        getGoalCompletion()
      ]);

      // ✅ FIXED: Extract data from nested response objects
      setPerformanceSummary(summaryRes.data?.reviews || []);
      setPerformanceByDept(deptRes.data?.performance || []);
      setGoalCompletion(goalsRes.data?.goals || []);

    } catch (err) {
      console.error('Error loading performance data:', err);
      setError(err.response?.data?.message || 'Failed to load performance reports');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExport = () => {
    let data = [];
    let filename = '';

    switch (activeTab) {
      case 0:
        data = performanceSummary;
        filename = 'performance_summary';
        break;
      case 1:
        data = performanceByDept;
        filename = 'performance_by_department';
        break;
      case 2:
        data = goalCompletion;
        filename = 'goal_completion';
        break;
      default:
        break;
    }

    exportToCSV(data, filename);
  };

  const handlePrint = () => {
    printReport('performance-report-content');
  };

  if (error) {
    return (
      <Layout>
        <PageHeader title="Performance Reports" subtitle="Performance & Goal Analytics" />
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Layout>
    );
  }

  // Calculate statistics - ✅ FIXED: Using PascalCase field names
  const avgRating = performanceSummary.length > 0
    ? performanceSummary.reduce((sum, p) => sum + (p.OverallRating || 0), 0) / performanceSummary.length
    : 0;
  const completedReviews = performanceSummary.filter(p => p.Status === 'Completed').length;
  const totalReviews = performanceSummary.length;
  const avgGoalProgress = goalCompletion.length > 0
    ? goalCompletion.reduce((sum, g) => sum + (g.AvgProgress || 0), 0) / goalCompletion.length
    : 0;

  // Define columns for Performance Summary table
  const performanceSummaryColumns = [
    {
      id: 'FirstName',
      label: 'First Name',
      minWidth: 120
    },
    {
      id: 'LastName',
      label: 'Last Name',
      minWidth: 120
    },
    {
      id: 'DepartmentName',
      label: 'Department',
      minWidth: 150
    },
    {
      id: 'PeriodName',
      label: 'Period',
      minWidth: 130
    },
    {
      id: 'OverallRating',
      label: 'Overall Rating',
      minWidth: 130,
      align: 'right',
      render: (row) => row.OverallRating?.toFixed(2)
    },
    {
      id: 'Status',
      label: 'Status',
      minWidth: 100
    },
    {
      id: 'CompanyWideRank',
      label: 'Company Rank',
      minWidth: 130,
      align: 'right'
    }
  ];

  // Define columns for Performance by Department table
  const perfDeptColumns = [
    {
      id: 'DepartmentName',
      label: 'Department',
      minWidth: 200
    },
    {
      id: 'TotalReviews',
      label: 'Total Reviews',
      minWidth: 130,
      align: 'right'
    },
    {
      id: 'AvgRating',
      label: 'Avg Rating',
      minWidth: 120,
      align: 'right',
      render: (row) => row.AvgRating?.toFixed(2)
    },
    {
      id: 'CompletedReviews',
      label: 'Completed',
      minWidth: 120,
      align: 'right'
    },
    {
      id: 'InProgressReviews',
      label: 'In Progress',
      minWidth: 130,
      align: 'right'
    }
  ];

  // Define columns for Goal Completion table
  const goalCompletionColumns = [
    {
      id: 'FirstName',
      label: 'First Name',
      minWidth: 120
    },
    {
      id: 'LastName',
      label: 'Last Name',
      minWidth: 120
    },
    {
      id: 'DepartmentName',
      label: 'Department',
      minWidth: 150
    },
    {
      id: 'TotalGoals',
      label: 'Total Goals',
      minWidth: 120,
      align: 'right'
    },
    {
      id: 'CompletedGoals',
      label: 'Completed',
      minWidth: 120,
      align: 'right'
    },
    {
      id: 'ActiveGoals',
      label: 'Active',
      minWidth: 100,
      align: 'right'
    },
    {
      id: 'AvgProgress',
      label: 'Avg Progress %',
      minWidth: 140,
      align: 'right',
      render: (row) => `${row.AvgProgress?.toFixed(1)}%`
    }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Performance Reports" 
        subtitle="Performance & Goal Analytics"
        icon={PerformanceIcon}
      />
      
      <Box sx={{ p: 3 }} id="performance-report-content">
        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Average Rating"
              value={avgRating.toFixed(2)}
              icon={TrendingUpIcon}
              color={TPA_COLORS.primary}
              subtitle="Overall performance"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <StatCard
              title="Completed Reviews"
              value={completedReviews}
              icon={PerformanceIcon}
              color={TPA_COLORS.success}
              subtitle={`Out of ${totalReviews}`}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              title="In Progress"
              value={totalReviews - completedReviews}
              icon={PerformanceIcon}
              color={TPA_COLORS.warning}
              subtitle="Pending reviews"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <StatCard
              title="Avg Goal Progress"
              value={`${avgGoalProgress.toFixed(1)}%`}
              icon={GoalIcon}
              color={TPA_COLORS.info}
              subtitle="Goal completion"
            />
          </Grid>
        </Grid>

        {/* Actions Bar */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Review Period</InputLabel>
            <Select
              value={selectedPeriod}
              label="Review Period"
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periods.map((period) => (
                <MenuItem key={period.value} value={period.value}>
                  {period.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Print
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Performance Summary" />
            <Tab label="By Department" />
            <Tab label="Goal Completion" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Performance Summary
            </Typography>
            <DataTable
              columns={performanceSummaryColumns}
              data={performanceSummary}
              loading={loading}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={performanceSummary.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              emptyMessage="No performance reviews found"
            />
          </Box>
        )}

        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Performance by Department
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={performanceByDept}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="DepartmentName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="AvgRating" fill={TPA_COLORS.primary} name="Avg Rating" />
                <Bar dataKey="CompletedReviews" fill={TPA_COLORS.success} name="Completed" />
              </BarChart>
            </ResponsiveContainer>

            <Box sx={{ mt: 3 }}>
              <DataTable
                columns={perfDeptColumns}
                data={performanceByDept}
                loading={loading}
                emptyMessage="No department data available"
              />
            </Box>
          </Paper>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Goal Completion Summary
            </Typography>
            <DataTable
              columns={goalCompletionColumns}
              data={goalCompletion}
              loading={loading}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={goalCompletion.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              emptyMessage="No goal data available"
            />
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default PerformanceReports;