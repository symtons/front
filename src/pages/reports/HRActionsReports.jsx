// src/pages/reports/HRActionsReports.jsx
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
  Assignment as ActionIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import DataTable from '../../components/common/tables/DataTable';
import StatCard from './components/StatCard';
import {
  getHRActionsSummary,
  getHRActionsByType
} from '../../services/reportsApi';
import { exportToCSV, printReport } from './helpers/reportsHelpers';
import { TPA_COLORS } from './models/reportsModels';

const HRActionsReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const [actionsSummary, setActionsSummary] = useState([]);
  const [actionsByType, setActionsByType] = useState([]);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years] = useState([2023, 2024, 2025]);

  useEffect(() => {
    loadData();
  }, [selectedYear]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryRes, typeRes] = await Promise.all([
        getHRActionsSummary({ year: selectedYear }),
        getHRActionsByType({ year: selectedYear })
      ]);

      setActionsSummary(summaryRes.data || []);
      setActionsByType(typeRes.data || []);

    } catch (err) {
      console.error('Error loading HR actions data:', err);
      setError(err.response?.data?.message || 'Failed to load HR actions reports');
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
    const data = activeTab === 0 ? actionsSummary : actionsByType;
    const filename = activeTab === 0 ? 'hr_actions_summary' : 'hr_actions_by_type';
    exportToCSV(data, filename);
  };

  const handlePrint = () => {
    printReport('hr-actions-report-content');
  };

  if (error) {
    return (
      <Layout>
        <PageHeader title="HR Actions Reports" subtitle="HR Request Analytics" />
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Layout>
    );
  }

  // Calculate statistics
  const totalActions = actionsSummary.reduce((sum, a) => sum + (a.totalRequests || 0), 0);
  const completedActions = actionsSummary.reduce((sum, a) => sum + (a.completed || 0), 0);
  const avgProcessingDays = actionsSummary.length > 0
    ? actionsSummary.reduce((sum, a) => sum + (a.avgProcessingDays || 0), 0) / actionsSummary.length
    : 0;

  const COLORS = [TPA_COLORS.primary, TPA_COLORS.secondary, TPA_COLORS.success, TPA_COLORS.warning, TPA_COLORS.error, TPA_COLORS.info];

  // Define columns for HR Actions Summary table
  const actionsSummaryColumns = [
    {
      id: 'monthName',
      label: 'Month',
      minWidth: 120
    },
    {
      id: 'totalRequests',
      label: 'Total Requests',
      minWidth: 140,
      align: 'right'
    },
    {
      id: 'pending',
      label: 'Pending',
      minWidth: 100,
      align: 'right'
    },
    {
      id: 'completed',
      label: 'Completed',
      minWidth: 120,
      align: 'right'
    },
    {
      id: 'avgProcessingDays',
      label: 'Avg Days',
      minWidth: 100,
      align: 'right',
      render: (row) => row.avgProcessingDays?.toFixed(1)
    }
  ];

  // Define columns for HR Actions By Type table
  const actionsByTypeColumns = [
    {
      id: 'actionTypeName',
      label: 'Action Type',
      minWidth: 200
    },
    {
      id: 'totalRequests',
      label: 'Requests',
      minWidth: 110,
      align: 'right'
    },
    {
      id: 'completed',
      label: 'Completed',
      minWidth: 120,
      align: 'right'
    },
    {
      id: 'avgProcessingDays',
      label: 'Avg Days',
      minWidth: 100,
      align: 'right',
      render: (row) => row.avgProcessingDays?.toFixed(1)
    }
  ];

  return (
    <Layout>
      <PageHeader 
        title="HR Actions Reports" 
        subtitle="HR Request Analytics"
        icon={ActionIcon}
      />
      
      <Box sx={{ p: 3 }} id="hr-actions-report-content">
        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total Requests"
              value={totalActions}
              icon={ActionIcon}
              color={TPA_COLORS.primary}
              subtitle={`Year ${selectedYear}`}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatCard
              title="Completed"
              value={completedActions}
              icon={TrendingUpIcon}
              color={TPA_COLORS.success}
              subtitle="Processed requests"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatCard
              title="Avg Processing Time"
              value={`${avgProcessingDays.toFixed(1)} days`}
              icon={SpeedIcon}
              color={TPA_COLORS.warning}
              subtitle="Time to complete"
            />
          </Grid>
        </Grid>

        {/* Actions Bar */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
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
            <Tab label="Summary" />
            <Tab label="By Type" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              HR Actions Summary ({selectedYear})
            </Typography>
            <DataTable
              columns={actionsSummaryColumns}
              data={actionsSummary}
              loading={loading}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={actionsSummary.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              emptyMessage="No HR action data available"
            />
          </Box>
        )}

        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              HR Actions by Type ({selectedYear})
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={actionsByType}
                      dataKey="totalRequests"
                      nameKey="actionTypeName"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label
                    >
                      {actionsByType.map((entry, index) => (
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
                  columns={actionsByTypeColumns}
                  data={actionsByType}
                  loading={loading}
                  emptyMessage="No action type data available"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Processing Time Comparison
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={actionsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="actionTypeName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgProcessingDays" fill={TPA_COLORS.warning} name="Avg Processing Days" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default HRActionsReports;