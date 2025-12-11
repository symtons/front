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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
  
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [periods] = useState(['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4']);

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = selectedPeriod ? { periodId: selectedPeriod } : {};

      const [summaryRes, deptRes, goalsRes] = await Promise.all([
        getPerformanceSummary(params),
        getPerformanceByDepartment(params),
        getGoalCompletion()
      ]);

      setPerformanceSummary(summaryRes.data || []);
      setPerformanceByDept(deptRes.data || []);
      setGoalCompletion(goalsRes.data || []);

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

  // Calculate statistics
  const avgRating = performanceSummary.length > 0
    ? performanceSummary.reduce((sum, p) => sum + (p.averageRating || 0), 0) / performanceSummary.length
    : 0;
  const completedReviews = performanceSummary.filter(p => p.status === 'Completed').length;
  const goalCompletionRate = goalCompletion.length > 0
    ? goalCompletion.reduce((sum, g) => sum + (g.completionRate || 0), 0) / goalCompletion.length
    : 0;

  const COLORS = [TPA_COLORS.success, TPA_COLORS.primary, TPA_COLORS.warning, TPA_COLORS.error, TPA_COLORS.info];

  // Define columns for Performance Summary table
  const performanceSummaryColumns = [
    {
      id: 'employeeName',
      label: 'Employee',
      minWidth: 180
    },
    {
      id: 'departmentName',
      label: 'Department',
      minWidth: 150
    },
    {
      id: 'reviewPeriod',
      label: 'Review Period',
      minWidth: 130
    },
    {
      id: 'selfRating',
      label: 'Self Rating',
      minWidth: 110,
      align: 'right',
      render: (row) => row.selfRating?.toFixed(1)
    },
    {
      id: 'managerRating',
      label: 'Manager Rating',
      minWidth: 140,
      align: 'right',
      render: (row) => row.managerRating?.toFixed(1)
    },
    {
      id: 'averageRating',
      label: 'Average',
      minWidth: 100,
      align: 'right',
      render: (row) => row.averageRating?.toFixed(1)
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100
    }
  ];

  // Define columns for Performance by Department table
  const perfDeptColumns = [
    {
      id: 'departmentName',
      label: 'Department',
      minWidth: 200
    },
    {
      id: 'reviewCount',
      label: 'Reviews',
      minWidth: 100,
      align: 'right'
    },
    {
      id: 'averageRating',
      label: 'Avg Rating',
      minWidth: 120,
      align: 'right',
      render: (row) => row.averageRating?.toFixed(2)
    },
    {
      id: 'completionRate',
      label: 'Completion %',
      minWidth: 130,
      align: 'right',
      render: (row) => `${row.completionRate?.toFixed(1)}%`
    }
  ];

  // Define columns for Goal Completion table
  const goalCompletionColumns = [
    {
      id: 'departmentName',
      label: 'Department',
      minWidth: 200
    },
    {
      id: 'totalGoals',
      label: 'Total Goals',
      minWidth: 120,
      align: 'right'
    },
    {
      id: 'completedGoals',
      label: 'Completed',
      minWidth: 120,
      align: 'right'
    },
    {
      id: 'completionRate',
      label: 'Rate',
      minWidth: 100,
      align: 'right',
      render: (row) => `${row.completionRate?.toFixed(1)}%`
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
          <Grid item xs={12} md={4}>
            <StatCard
              title="Average Rating"
              value={avgRating.toFixed(2)}
              icon={PerformanceIcon}
              color={TPA_COLORS.primary}
              subtitle="Out of 5.0"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatCard
              title="Completed Reviews"
              value={completedReviews}
              icon={TrendingUpIcon}
              color={TPA_COLORS.success}
              subtitle="This period"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatCard
              title="Goal Completion"
              value={`${goalCompletionRate.toFixed(1)}%`}
              icon={GoalIcon}
              color={TPA_COLORS.warning}
              subtitle="Average completion"
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
              <MenuItem value="">All Periods</MenuItem>
              {periods.map((period) => (
                <MenuItem key={period} value={period}>{period}</MenuItem>
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
                <XAxis dataKey="departmentName" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="averageRating" fill={TPA_COLORS.primary} name="Average Rating" />
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
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Goal Completion
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={goalCompletion}
                      dataKey="completedGoals"
                      nameKey="departmentName"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label
                    >
                      {goalCompletion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <DataTable
                  columns={goalCompletionColumns}
                  data={goalCompletion}
                  loading={loading}
                  emptyMessage="No goal data available"
                />
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default PerformanceReports;