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
  Assignment as HRActionIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckIcon
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
import { exportToCSV, printReport, formatDate } from './helpers/reportsHelpers';
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

      const [actionsRes, typeRes] = await Promise.all([
        getHRActionsSummary(selectedYear),
        getHRActionsByType(selectedYear)
      ]);

      // ✅ FIXED: Extract data from nested response objects
      setActionsSummary(actionsRes.data?.hrActions || []);
      setActionsByType(typeRes.data?.actionTypes || []);

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
    let data = [];
    let filename = '';

    switch (activeTab) {
      case 0:
        data = actionsSummary;
        filename = `hr_actions_summary_${selectedYear}`;
        break;
      case 1:
        data = actionsByType;
        filename = `hr_actions_by_type_${selectedYear}`;
        break;
      default:
        break;
    }

    exportToCSV(data, filename);
  };

  const handlePrint = () => {
    printReport('hr-actions-report-content');
  };

  if (error) {
    return (
      <Layout>
        <PageHeader title="HR Actions Reports" subtitle="HR Action Request Analytics" />
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Layout>
    );
  }

  // Calculate statistics - ✅ FIXED: Using PascalCase field names
  const totalRequests = actionsSummary.length;
  const approvedRequests = actionsSummary.filter(a => a.Status === 'Approved').length;
  const pendingRequests = actionsSummary.filter(a => a.Status === 'Pending').length;
  const avgProcessingDays = actionsSummary.length > 0
    ? actionsSummary.reduce((sum, a) => sum + (a.ProcessingDays || 0), 0) / actionsSummary.length
    : 0;

  const COLORS = [TPA_COLORS.success, TPA_COLORS.primary, TPA_COLORS.warning, TPA_COLORS.error, TPA_COLORS.info];

  // Define columns for HR Actions Summary table
  const actionsSummaryColumns = [
    {
      id: 'RequestNumber',
      label: 'Request #',
      minWidth: 120
    },
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
      id: 'ActionType',
      label: 'Action Type',
      minWidth: 150
    },
    {
      id: 'Status',
      label: 'Status',
      minWidth: 120
    },
    {
      id: 'SubmittedDate',
      label: 'Submitted',
      minWidth: 130,
      render: (row) => formatDate(row.SubmittedDate)
    },
    {
      id: 'ProcessingDays',
      label: 'Processing Days',
      minWidth: 140,
      align: 'right',
      render: (row) => row.ProcessingDays != null ? row.ProcessingDays : 'Pending'
    }
  ];

  // Define columns for Actions By Type table
  const actionsByTypeColumns = [
    {
      id: 'ActionType',
      label: 'Action Type',
      minWidth: 200
    },
    {
      id: 'TotalRequests',
      label: 'Total Requests',
      minWidth: 140,
      align: 'right'
    },
    {
      id: 'PendingRequests',
      label: 'Pending',
      minWidth: 120,
      align: 'right'
    },
    {
      id: 'ApprovedRequests',
      label: 'Approved',
      minWidth: 120,
      align: 'right'
    },
    {
      id: 'AvgProcessingDays',
      label: 'Avg Processing Days',
      minWidth: 160,
      align: 'right',
      render: (row) => row.AvgProcessingDays != null ? row.AvgProcessingDays.toFixed(1) : 'N/A'
    }
  ];

  return (
    <Layout>
      <PageHeader 
        title="HR Actions Reports" 
        subtitle="HR Action Request Analytics"
        icon={HRActionIcon}
      />
      
      <Box sx={{ p: 3 }} id="hr-actions-report-content">
        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Requests"
              value={totalRequests}
              icon={HRActionIcon}
              color={TPA_COLORS.primary}
              subtitle={`Year ${selectedYear}`}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <StatCard
              title="Approved"
              value={approvedRequests}
              icon={CheckIcon}
              color={TPA_COLORS.success}
              subtitle="Completed requests"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              title="Pending"
              value={pendingRequests}
              icon={TrendingUpIcon}
              color={TPA_COLORS.warning}
              subtitle="Awaiting approval"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <StatCard
              title="Avg Processing Time"
              value={`${avgProcessingDays.toFixed(1)} days`}
              icon={TrendingUpIcon}
              color={TPA_COLORS.info}
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
            <Tab label="All Requests" />
            <Tab label="By Action Type" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              HR Action Requests - {selectedYear}
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
              emptyMessage="No HR action requests found"
            />
          </Box>
        )}

        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              HR Actions by Type - {selectedYear}
            </Typography>
            
            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={actionsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ActionType" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="TotalRequests" fill={TPA_COLORS.primary} name="Total" />
                <Bar dataKey="ApprovedRequests" fill={TPA_COLORS.success} name="Approved" />
                <Bar dataKey="PendingRequests" fill={TPA_COLORS.warning} name="Pending" />
              </BarChart>
            </ResponsiveContainer>

            {/* Pie Chart */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={actionsByType}
                    dataKey="TotalRequests"
                    nameKey="ActionType"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
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
            </Box>

            {/* Table */}
            <Box sx={{ mt: 3 }}>
              <DataTable
                columns={actionsByTypeColumns}
                data={actionsByType}
                loading={loading}
                emptyMessage="No action type data available"
              />
            </Box>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default HRActionsReports;