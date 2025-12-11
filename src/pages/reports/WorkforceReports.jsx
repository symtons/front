// src/pages/reports/WorkforceReports.jsx
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
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import DataTable from '../../components/common/tables/DataTable';
import StatCard from './components/StatCard';
import {
  getWorkforceSummary,
  getHeadcountByDepartment,
  getTurnoverAnalysis
} from '../../services/reportsApi';
import { exportToCSV, printReport, formatDate } from './helpers/reportsHelpers';
import { TPA_COLORS } from './models/reportsModels';

const WorkforceReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // Data states
  const [workforceSummary, setWorkforceSummary] = useState([]);
  const [headcountData, setHeadcountData] = useState([]);
  const [turnoverData, setTurnoverData] = useState([]);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filter states
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    loadData();
  }, [selectedDepartment]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = selectedDepartment ? { departmentId: selectedDepartment } : {};

      const [summaryRes, headcountRes, turnoverRes] = await Promise.all([
        getWorkforceSummary(params),
        getHeadcountByDepartment(),
        getTurnoverAnalysis()
      ]);

      setWorkforceSummary(summaryRes.data || []);
      setHeadcountData(headcountRes.data || []);
      setTurnoverData(turnoverRes.data || []);

      // Extract unique departments
      const depts = [...new Set(summaryRes.data?.map(e => e.departmentName) || [])];
      setDepartments(depts);

    } catch (err) {
      console.error('Error loading workforce data:', err);
      setError(err.response?.data?.message || 'Failed to load workforce reports');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0); // Reset pagination when switching tabs
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
        data = workforceSummary;
        filename = 'workforce_summary';
        break;
      case 1:
        data = headcountData;
        filename = 'headcount_by_department';
        break;
      case 2:
        data = turnoverData;
        filename = 'turnover_analysis';
        break;
      default:
        break;
    }

    exportToCSV(data, filename);
  };

  const handlePrint = () => {
    printReport('workforce-report-content');
  };

  if (error) {
    return (
      <Layout>
        <PageHeader title="Workforce Reports" subtitle="Employee Data & Analytics" />
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Layout>
    );
  }

  // Calculate statistics
  const totalEmployees = workforceSummary.length;
  const activeEmployees = workforceSummary.filter(e => e.employmentStatus === 'Active').length;
  const totalDepartments = departments.length;

  // Define columns for Employee Summary table
  const employeeColumns = [
    {
      id: 'employeeCode',
      label: 'Employee Code',
      minWidth: 130
    },
    {
      id: 'fullName',
      label: 'Name',
      minWidth: 180,
      render: (row) => `${row.firstName} ${row.lastName}`
    },
    {
      id: 'departmentName',
      label: 'Department',
      minWidth: 150
    },
    {
      id: 'jobTitle',
      label: 'Job Title',
      minWidth: 170
    },
    {
      id: 'employeeType',
      label: 'Employee Type',
      minWidth: 130
    },
    {
      id: 'employmentStatus',
      label: 'Status',
      minWidth: 100
    },
    {
      id: 'hireDate',
      label: 'Hire Date',
      minWidth: 120,
      render: (row) => formatDate(row.hireDate)
    }
  ];

  // Define columns for Headcount table
  const headcountColumns = [
    {
      id: 'departmentName',
      label: 'Department',
      minWidth: 200
    },
    {
      id: 'employeeCount',
      label: 'Employee Count',
      minWidth: 150,
      align: 'right'
    }
  ];

  // Define columns for Turnover table
  const turnoverColumns = [
    {
      id: 'year',
      label: 'Year',
      minWidth: 100
    },
    {
      id: 'hiredCount',
      label: 'Hired',
      minWidth: 100,
      align: 'right'
    },
    {
      id: 'terminatedCount',
      label: 'Terminated',
      minWidth: 120,
      align: 'right'
    },
    {
      id: 'turnoverRate',
      label: 'Turnover Rate',
      minWidth: 130,
      align: 'right',
      render: (row) => `${row.turnoverRate}%`
    }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Workforce Reports" 
        subtitle="Employee Data & Analytics"
        icon={PeopleIcon}
      />
      
      <Box sx={{ p: 3 }} id="workforce-report-content">
        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total Employees"
              value={totalEmployees}
              icon={PeopleIcon}
              color={TPA_COLORS.primary}
              subtitle="All employees"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatCard
              title="Active Employees"
              value={activeEmployees}
              icon={TrendingUpIcon}
              color={TPA_COLORS.success}
              subtitle="Currently employed"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatCard
              title="Departments"
              value={totalDepartments}
              icon={BusinessIcon}
              color={TPA_COLORS.info}
              subtitle="Active departments"
            />
          </Grid>
        </Grid>

        {/* Actions Bar */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Department</InputLabel>
            <Select
              value={selectedDepartment}
              label="Filter by Department"
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <MenuItem value="">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
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
            <Tab label="Employee Summary" />
            <Tab label="Headcount by Department" />
            <Tab label="Turnover Analysis" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Employee Summary
            </Typography>
            <DataTable
              columns={employeeColumns}
              data={workforceSummary}
              loading={loading}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={workforceSummary.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              emptyMessage="No employees found"
            />
          </Box>
        )}

        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Headcount by Department
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={headcountData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="departmentName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="employeeCount" fill={TPA_COLORS.primary} name="Employee Count" />
              </BarChart>
            </ResponsiveContainer>

            <Box sx={{ mt: 3 }}>
              <DataTable
                columns={headcountColumns}
                data={headcountData}
                loading={loading}
                emptyMessage="No department data available"
              />
            </Box>
          </Paper>
        )}

        {activeTab === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Turnover Analysis
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={turnoverData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="hiredCount" stroke={TPA_COLORS.success} name="Hired" />
                <Line type="monotone" dataKey="terminatedCount" stroke={TPA_COLORS.error} name="Terminated" />
                <Line type="monotone" dataKey="turnoverRate" stroke={TPA_COLORS.warning} name="Turnover Rate %" />
              </LineChart>
            </ResponsiveContainer>

            <Box sx={{ mt: 3 }}>
              <DataTable
                columns={turnoverColumns}
                data={turnoverData}
                loading={loading}
                emptyMessage="No turnover data available"
              />
            </Box>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default WorkforceReports;