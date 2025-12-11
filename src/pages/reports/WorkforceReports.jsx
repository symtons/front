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
  People as WorkforceIcon,
  TrendingUp as TrendingUpIcon,
  Business as DepartmentIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  
  const [workforceSummary, setWorkforceSummary] = useState([]);
  const [headcount, setHeadcount] = useState([]);
  const [turnover, setTurnover] = useState([]);
  const [filteredTurnover, setFilteredTurnover] = useState([]);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filter states
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  
  const [years] = useState([
    { value: 'all', label: 'All Years' },
    { value: 2023, label: '2023' },
    { value: 2024, label: '2024' },
    { value: 2025, label: '2025' }
  ]);

  const [months] = useState([
    { value: 'all', label: 'All Months' },
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ]);

  useEffect(() => {
    loadData();
  }, [selectedYear]);

  // Apply month filter when data or month selection changes
  useEffect(() => {
    applyMonthFilter();
  }, [turnover, selectedMonth]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const yearParam = selectedYear === 'all' ? null : selectedYear;

      const [summaryRes, headcountRes, turnoverRes] = await Promise.all([
        getWorkforceSummary(null),
        getHeadcountByDepartment(),
        getTurnoverAnalysis(yearParam)
      ]);

      // ✅ FIXED: Extract data from nested response objects
      setWorkforceSummary(summaryRes.data?.employees || []);
      setHeadcount(headcountRes.data?.departments || []);
      setTurnover(turnoverRes.data?.turnover || []);

    } catch (err) {
      console.error('Error loading workforce data:', err);
      setError(err.response?.data?.message || 'Failed to load workforce reports');
    } finally {
      setLoading(false);
    }
  };

  const applyMonthFilter = () => {
    if (selectedMonth === 'all') {
      setFilteredTurnover(turnover);
    } else {
      const filtered = turnover.filter(t => t.TerminationMonth === selectedMonth);
      setFilteredTurnover(filtered);
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

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setSelectedMonth('all'); // Reset month when year changes
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setPage(0); // Reset to first page
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
        data = headcount;
        filename = 'headcount_by_department';
        break;
      case 2:
        data = filteredTurnover;
        filename = `turnover_analysis${selectedYear !== 'all' ? `_${selectedYear}` : ''}${selectedMonth !== 'all' ? `_${selectedMonth}` : ''}`;
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
        <PageHeader title="Workforce Reports" subtitle="Employee & Headcount Analytics" />
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Layout>
    );
  }

  // Calculate statistics - ✅ BULLETPROOF: Safe calculations with error handling
  let totalEmployees = 0;
  let activeEmployees = 0;
  let avgYearsOfService = 0;
  let turnoverCount = 0;

  try {
    totalEmployees = Array.isArray(workforceSummary) 
      ? workforceSummary.filter(e => e && e.IsActive === true).length 
      : 0;
      
    activeEmployees = Array.isArray(workforceSummary)
      ? workforceSummary.filter(e => e && e.EmploymentStatus === 'Active').length
      : 0;
    
    const validYears = Array.isArray(workforceSummary)
      ? workforceSummary
          .filter(e => e && e.YearsOfService != null && !isNaN(e.YearsOfService))
          .map(e => parseFloat(e.YearsOfService))
      : [];
    
    avgYearsOfService = validYears.length > 0
      ? validYears.reduce((sum, val) => sum + val, 0) / validYears.length
      : 0;
    
    turnoverCount = Array.isArray(filteredTurnover) ? filteredTurnover.length : 0;
  } catch (err) {
    console.error('Error calculating workforce statistics:', err);
    // Keep default values of 0
  }

  // Get display label for selected period
  const getPeriodLabel = () => {
    if (selectedYear === 'all' && selectedMonth === 'all') {
      return 'All time';
    }
    if (selectedYear !== 'all' && selectedMonth === 'all') {
      return `Year ${selectedYear}`;
    }
    const monthLabel = months.find(m => m.value === selectedMonth)?.label || '';
    if (selectedYear === 'all') {
      return monthLabel;
    }
    return `${monthLabel} ${selectedYear}`;
  };

  // Define columns for Workforce Summary table
  const workforceSummaryColumns = [
    {
      id: 'EmployeeCode',
      label: 'Employee Code',
      minWidth: 130
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
      id: 'JobTitle',
      label: 'Job Title',
      minWidth: 150
    },
    {
      id: 'EmploymentStatus',
      label: 'Status',
      minWidth: 120
    },
    {
      id: 'HireDate',
      label: 'Hire Date',
      minWidth: 120,
      render: (row) => formatDate(row.HireDate)
    },
    {
      id: 'YearsOfService',
      label: 'Years of Service',
      minWidth: 140,
      align: 'right',
      render: (row) => row.YearsOfService != null ? parseFloat(row.YearsOfService).toFixed(1) : 'N/A'
    }
  ];

  // Define columns for Headcount table
  const headcountColumns = [
    {
      id: 'DepartmentName',
      label: 'Department',
      minWidth: 200
    },
    {
      id: 'TotalEmployees',
      label: 'Total Employees',
      minWidth: 150,
      align: 'right'
    },
    {
      id: 'AdminStaffCount',
      label: 'Admin Staff',
      minWidth: 130,
      align: 'right'
    },
    {
      id: 'FieldStaffCount',
      label: 'Field Staff',
      minWidth: 130,
      align: 'right'
    },
    {
      id: 'ActiveEmployees',
      label: 'Active',
      minWidth: 100,
      align: 'right'
    }
  ];

  // Define columns for Turnover table
  const turnoverColumns = [
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
      id: 'JobTitle',
      label: 'Job Title',
      minWidth: 150
    },
    {
      id: 'HireDate',
      label: 'Hire Date',
      minWidth: 120,
      render: (row) => formatDate(row.HireDate)
    },
    {
      id: 'TerminationDate',
      label: 'Termination Date',
      minWidth: 150,
      render: (row) => formatDate(row.TerminationDate)
    },
    {
      id: 'MonthsEmployed',
      label: 'Months Employed',
      minWidth: 150,
      align: 'right'
    }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Workforce Reports" 
        subtitle="Employee & Headcount Analytics"
        icon={WorkforceIcon}
      />
      
      <Box sx={{ p: 3 }} id="workforce-report-content">
        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Employees"
              value={totalEmployees}
              icon={WorkforceIcon}
              color={TPA_COLORS.primary}
              subtitle="Active headcount"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <StatCard
              title="Active Status"
              value={activeEmployees}
              icon={TrendingUpIcon}
              color={TPA_COLORS.success}
              subtitle="Currently working"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              title="Avg Years of Service"
              value={avgYearsOfService.toFixed(1)}
              icon={DepartmentIcon}
              color={TPA_COLORS.info}
              subtitle="Employee tenure"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <StatCard
              title="Turnover"
              value={turnoverCount}
              icon={TrendingUpIcon}
              color={TPA_COLORS.warning}
              subtitle={getPeriodLabel()}
            />
          </Grid>
        </Grid>

        {/* Actions Bar */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 130 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={handleYearChange}
              >
                {years.map((year) => (
                  <MenuItem key={year.value} value={year.value}>
                    {year.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={handleMonthChange}
              >
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

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
            <Tab label="Workforce Summary" />
            <Tab label="Headcount by Department" />
            <Tab label="Turnover Analysis" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Workforce Summary
            </Typography>
            <DataTable
              columns={workforceSummaryColumns}
              data={workforceSummary}
              loading={loading}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={workforceSummary.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              emptyMessage="No employee data found"
            />
          </Box>
        )}

        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Headcount by Department
            </Typography>
            
            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={headcount}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="DepartmentName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="TotalEmployees" fill={TPA_COLORS.primary} name="Total" />
                <Bar dataKey="AdminStaffCount" fill={TPA_COLORS.secondary} name="Admin Staff" />
                <Bar dataKey="FieldStaffCount" fill={TPA_COLORS.success} name="Field Staff" />
              </BarChart>
            </ResponsiveContainer>

            {/* Table */}
            <Box sx={{ mt: 3 }}>
              <DataTable
                columns={headcountColumns}
                data={headcount}
                loading={loading}
                emptyMessage="No headcount data available"
              />
            </Box>
          </Paper>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Turnover Analysis - {getPeriodLabel()}
            </Typography>
            <DataTable
              columns={turnoverColumns}
              data={filteredTurnover}
              loading={loading}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={filteredTurnover.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              emptyMessage="No turnover data found"
            />
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default WorkforceReports;