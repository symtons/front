// src/pages/reports/RecruitmentReports.jsx
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
  PersonAdd as RecruitmentIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import DataTable from '../../components/common/tables/DataTable';
import StatCard from './components/StatCard';
import {
  getApplicationSummary,
  getHiringFunnel
} from '../../services/reportsApi';
import { exportToCSV, printReport, formatDate } from './helpers/reportsHelpers';
import { TPA_COLORS } from './models/reportsModels';

const RecruitmentReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const [applications, setApplications] = useState([]);
  const [funnel, setFunnel] = useState([]);
  
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

      const [appsRes, funnelRes] = await Promise.all([
        getApplicationSummary(selectedYear),
        getHiringFunnel(selectedYear)
      ]);

      // ✅ FIXED: Extract data from nested response objects
      setApplications(appsRes.data?.applications || []);
      setFunnel(funnelRes.data?.funnel || []);

    } catch (err) {
      console.error('Error loading recruitment data:', err);
      setError(err.response?.data?.message || 'Failed to load recruitment reports');
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
        data = applications;
        filename = `applications_${selectedYear}`;
        break;
      case 1:
        data = funnel;
        filename = `hiring_funnel_${selectedYear}`;
        break;
      default:
        break;
    }

    exportToCSV(data, filename);
  };

  const handlePrint = () => {
    printReport('recruitment-report-content');
  };

  if (error) {
    return (
      <Layout>
        <PageHeader title="Recruitment Reports" subtitle="Application & Hiring Analytics" />
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Layout>
    );
  }

  // Calculate statistics - ✅ FIXED: Using PascalCase field names
  const totalApplications = applications.length;
  const approvedApplications = applications.filter(a => a.ApprovalStatus === 'Approved').length;
  const pendingApplications = applications.filter(a => a.ApprovalStatus === 'Pending').length;
  const avgDaysToReview = applications.length > 0
    ? applications.reduce((sum, a) => sum + (a.DaysToReview || 0), 0) / applications.length
    : 0;

  const COLORS = [TPA_COLORS.success, TPA_COLORS.primary, TPA_COLORS.warning, TPA_COLORS.error, TPA_COLORS.info];

  // Define columns for Applications table
  const applicationColumns = [
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
      id: 'Email',
      label: 'Email',
      minWidth: 200
    },
    {
      id: 'PhoneNumber',
      label: 'Phone',
      minWidth: 130
    },
    {
      id: 'Position1',
      label: 'Position',
      minWidth: 150
    },
    {
      id: 'ApprovalStatus',
      label: 'Status',
      minWidth: 120
    },
    {
      id: 'SubmittedAt',
      label: 'Submitted',
      minWidth: 130,
      render: (row) => formatDate(row.SubmittedAt)
    },
    {
      id: 'DaysToReview',
      label: 'Days to Review',
      minWidth: 140,
      align: 'right',
      render: (row) => row.DaysToReview != null ? row.DaysToReview : 'Pending'
    }
  ];

  // Define columns for Hiring Funnel table
  const funnelColumns = [
    {
      id: 'ApprovalStatus',
      label: 'Status',
      minWidth: 200
    },
    {
      id: 'ApplicationCount',
      label: 'Application Count',
      minWidth: 150,
      align: 'right'
    },
    {
      id: 'AvgDaysToReview',
      label: 'Avg Days to Review',
      minWidth: 160,
      align: 'right',
      render: (row) => row.AvgDaysToReview != null ? row.AvgDaysToReview.toFixed(1) : 'N/A'
    }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Recruitment Reports" 
        subtitle="Application & Hiring Analytics"
        icon={RecruitmentIcon}
      />
      
      <Box sx={{ p: 3 }} id="recruitment-report-content">
        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Applications"
              value={totalApplications}
              icon={RecruitmentIcon}
              color={TPA_COLORS.primary}
              subtitle={`Year ${selectedYear}`}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <StatCard
              title="Approved"
              value={approvedApplications}
              icon={CheckIcon}
              color={TPA_COLORS.success}
              subtitle="Applications accepted"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              title="Pending Review"
              value={pendingApplications}
              icon={TrendingUpIcon}
              color={TPA_COLORS.warning}
              subtitle="Awaiting decision"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <StatCard
              title="Avg Review Time"
              value={`${avgDaysToReview.toFixed(1)} days`}
              icon={TrendingUpIcon}
              color={TPA_COLORS.info}
              subtitle="Time to decision"
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
            <Tab label="Applications" />
            <Tab label="Hiring Funnel" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Applications - {selectedYear}
            </Typography>
            <DataTable
              columns={applicationColumns}
              data={applications}
              loading={loading}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={applications.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              emptyMessage="No applications found"
            />
          </Box>
        )}

        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Hiring Funnel - {selectedYear}
            </Typography>
            
            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={funnel}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ApprovalStatus" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ApplicationCount" fill={TPA_COLORS.primary} name="Applications" />
              </BarChart>
            </ResponsiveContainer>

            {/* Pie Chart */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={funnel}
                    dataKey="ApplicationCount"
                    nameKey="ApprovalStatus"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {funnel.map((entry, index) => (
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
                columns={funnelColumns}
                data={funnel}
                loading={loading}
                emptyMessage="No funnel data available"
              />
            </Box>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default RecruitmentReports;