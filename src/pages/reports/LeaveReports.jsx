// src/pages/reports/LeaveReports.jsx
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
  EventBusy as LeaveIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import DataTable from '../../components/common/tables/DataTable';
import StatCard from './components/StatCard';
import {
  getLeaveSummary,
  getLeaveUsageByDepartment,
  getPTOBalances
} from '../../services/reportsApi';
import { exportToCSV, printReport, formatDate } from './helpers/reportsHelpers';
import { TPA_COLORS } from './models/reportsModels';

const LeaveReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [leaveByDept, setLeaveByDept] = useState([]);
  const [ptoBalances, setPtoBalances] = useState([]);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filter states
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('all'); // 'all' or 1-12
  const [years] = useState([2023, 2024, 2025]);
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
  }, [selectedYear, selectedMonth]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryRes, deptRes, ptoRes] = await Promise.all([
        getLeaveSummary(selectedYear),
        getLeaveUsageByDepartment(),
        getPTOBalances()
      ]);

      // Extract data from nested response objects
      const leaveData = summaryRes.data?.leave || [];
      
      // Apply month filter on frontend if selected
      const filteredLeaveData = selectedMonth === 'all' 
        ? leaveData 
        : leaveData.filter(leave => leave.LeaveMonth === selectedMonth);

      setLeaveSummary(filteredLeaveData);
      setLeaveByDept(deptRes.data?.usage || []);
      setPtoBalances(ptoRes.data?.balances || []);

    } catch (err) {
      console.error('Error loading leave data:', err);
      setError(err.response?.data?.message || 'Failed to load leave reports');
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
        data = leaveSummary;
        filename = `leave_summary_${selectedYear}${selectedMonth !== 'all' ? `_${selectedMonth}` : ''}`;
        break;
      case 1:
        data = leaveByDept;
        filename = 'leave_by_department';
        break;
      case 2:
        data = ptoBalances;
        filename = 'pto_balances';
        break;
      default:
        break;
    }

    exportToCSV(data, filename);
  };

  const handlePrint = () => {
    printReport('leave-report-content');
  };

  if (error) {
    return (
      <Layout>
        <PageHeader title="Leave Reports" subtitle="Leave & Attendance Analytics" />
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Layout>
    );
  }

  // Calculate statistics
  const totalLeaveDays = leaveSummary.reduce((sum, leave) => sum + (leave.TotalDays || 0), 0);
  const approvedRequests = leaveSummary.filter(l => l.Status === 'Approved').length;
  const pendingRequests = leaveSummary.filter(l => l.Status === 'Pending').length;
  const avgPTOBalance = ptoBalances.length > 0
    ? ptoBalances.reduce((sum, emp) => sum + (emp.PTOBalance || 0), 0) / ptoBalances.length
    : 0;

  // Get month name for display
  const getMonthName = () => {
    if (selectedMonth === 'all') return 'All Months';
    return months.find(m => m.value === selectedMonth)?.label || '';
  };

  // Define columns for Leave Summary table
  const leaveSummaryColumns = [
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
      id: 'LeaveType',
      label: 'Leave Type',
      minWidth: 130
    },
    {
      id: 'StartDate',
      label: 'Start Date',
      minWidth: 120,
      render: (row) => formatDate(row.StartDate)
    },
    {
      id: 'EndDate',
      label: 'End Date',
      minWidth: 120,
      render: (row) => formatDate(row.EndDate)
    },
    {
      id: 'TotalDays',
      label: 'Days',
      minWidth: 80,
      align: 'right'
    },
    {
      id: 'Status',
      label: 'Status',
      minWidth: 100
    }
  ];

  // Define columns for Leave Usage table
  const leaveUsageColumns = [
    {
      id: 'DepartmentName',
      label: 'Department',
      minWidth: 200
    },
    {
      id: 'LeaveType',
      label: 'Leave Type',
      minWidth: 150
    },
    {
      id: 'TotalDaysUsed',
      label: 'Total Days',
      minWidth: 120,
      align: 'right'
    },
    {
      id: 'AvgDaysPerRequest',
      label: 'Avg Days/Request',
      minWidth: 140,
      align: 'right',
      render: (row) => row.AvgDaysPerRequest?.toFixed(1)
    }
  ];

  // Define columns for PTO Balances table
  const ptoBalanceColumns = [
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
      id: 'PTOBalance',
      label: 'PTO Balance',
      minWidth: 120,
      align: 'right'
    },
    {
      id: 'PTOUsedThisYear',
      label: 'Used This Year',
      minWidth: 140,
      align: 'right'
    }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Leave Reports" 
        subtitle="Leave & Attendance Analytics"
        icon={LeaveIcon}
      />
      
      <Box sx={{ p: 3 }} id="leave-report-content">
        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Leave Days"
              value={totalLeaveDays}
              icon={CalendarIcon}
              color={TPA_COLORS.primary}
              subtitle={selectedMonth === 'all' ? `Year ${selectedYear}` : `${getMonthName()} ${selectedYear}`}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <StatCard
              title="Approved Requests"
              value={approvedRequests}
              icon={TrendingUpIcon}
              color={TPA_COLORS.success}
              subtitle="In selected period"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              title="Pending Requests"
              value={pendingRequests}
              icon={LeaveIcon}
              color={TPA_COLORS.warning}
              subtitle="Awaiting approval"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <StatCard
              title="Avg PTO Balance"
              value={avgPTOBalance.toFixed(1)}
              icon={LeaveIcon}
              color={TPA_COLORS.info}
              subtitle="Days remaining"
            />
          </Grid>
        </Grid>

        {/* Actions Bar */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 120 }}>
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

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={(e) => setSelectedMonth(e.target.value)}
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
            <Tab label="Leave Summary" />
            <Tab label="Usage by Department" />
            <Tab label="PTO Balances" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Leave Summary - {selectedMonth === 'all' ? selectedYear : `${getMonthName()} ${selectedYear}`}
            </Typography>
            <DataTable
              columns={leaveSummaryColumns}
              data={leaveSummary}
              loading={loading}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={leaveSummary.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              emptyMessage="No leave requests found"
            />
          </Box>
        )}

        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Leave Usage by Department
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={leaveByDept}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="DepartmentName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="TotalDaysUsed" fill={TPA_COLORS.primary} name="Total Leave Days" />
                <Bar dataKey="AvgDaysPerRequest" fill={TPA_COLORS.secondary} name="Avg Days/Request" />
              </BarChart>
            </ResponsiveContainer>

            <Box sx={{ mt: 3 }}>
              <DataTable
                columns={leaveUsageColumns}
                data={leaveByDept}
                loading={loading}
                emptyMessage="No department data available"
              />
            </Box>
          </Paper>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              PTO Balances
            </Typography>
            <DataTable
              columns={ptoBalanceColumns}
              data={ptoBalances}
              loading={loading}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={ptoBalances.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              emptyMessage="No PTO balance data available"
            />
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default LeaveReports;