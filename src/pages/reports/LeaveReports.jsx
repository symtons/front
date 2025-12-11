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
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years] = useState([2023, 2024, 2025]);

  useEffect(() => {
    loadData();
  }, [selectedYear]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryRes, deptRes, ptoRes] = await Promise.all([
        getLeaveSummary(selectedYear),
        getLeaveUsageByDepartment(),
        getPTOBalances()
      ]);

      setLeaveSummary(summaryRes.data || []);
      setLeaveByDept(deptRes.data || []);
      setPtoBalances(ptoRes.data || []);

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
        filename = 'leave_summary';
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
  const totalLeaveDays = leaveSummary.reduce((sum, leave) => sum + (leave.totalDays || 0), 0);
  const approvedRequests = leaveSummary.filter(l => l.status === 'Approved').length;
  const avgPTOBalance = ptoBalances.length > 0
    ? ptoBalances.reduce((sum, emp) => sum + (emp.remainingBalance || 0), 0) / ptoBalances.length
    : 0;

  // Define columns for Leave Summary table
  const leaveSummaryColumns = [
    {
      id: 'employeeName',
      label: 'Employee',
      minWidth: 180
    },
    {
      id: 'leaveType',
      label: 'Leave Type',
      minWidth: 130
    },
    {
      id: 'startDate',
      label: 'Start Date',
      minWidth: 120,
      render: (row) => formatDate(row.startDate)
    },
    {
      id: 'endDate',
      label: 'End Date',
      minWidth: 120,
      render: (row) => formatDate(row.endDate)
    },
    {
      id: 'totalDays',
      label: 'Days',
      minWidth: 80,
      align: 'right'
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100
    }
  ];

  // Define columns for Leave Usage table
  const leaveUsageColumns = [
    {
      id: 'departmentName',
      label: 'Department',
      minWidth: 200
    },
    {
      id: 'totalLeaveDays',
      label: 'Total Days',
      minWidth: 120,
      align: 'right'
    },
    {
      id: 'averageDaysPerEmployee',
      label: 'Avg Days/Employee',
      minWidth: 160,
      align: 'right',
      render: (row) => row.averageDaysPerEmployee?.toFixed(1)
    }
  ];

  // Define columns for PTO Balances table
  const ptoBalanceColumns = [
    {
      id: 'employeeCode',
      label: 'Employee Code',
      minWidth: 130
    },
    {
      id: 'employeeName',
      label: 'Employee Name',
      minWidth: 180
    },
    {
      id: 'departmentName',
      label: 'Department',
      minWidth: 150
    },
    {
      id: 'totalAllocation',
      label: 'Total Allocation',
      minWidth: 140,
      align: 'right'
    },
    {
      id: 'usedDays',
      label: 'Used',
      minWidth: 100,
      align: 'right'
    },
    {
      id: 'remainingBalance',
      label: 'Remaining',
      minWidth: 120,
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
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total Leave Days"
              value={totalLeaveDays}
              icon={CalendarIcon}
              color={TPA_COLORS.primary}
              subtitle={`Year ${selectedYear}`}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatCard
              title="Approved Requests"
              value={approvedRequests}
              icon={TrendingUpIcon}
              color={TPA_COLORS.success}
              subtitle="This year"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatCard
              title="Avg PTO Balance"
              value={avgPTOBalance.toFixed(1)}
              icon={LeaveIcon}
              color={TPA_COLORS.warning}
              subtitle="Days remaining"
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
            <Tab label="Leave Summary" />
            <Tab label="Usage by Department" />
            <Tab label="PTO Balances" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Leave Summary ({selectedYear})
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
                <XAxis dataKey="departmentName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalLeaveDays" fill={TPA_COLORS.primary} name="Total Leave Days" />
                <Bar dataKey="averageDaysPerEmployee" fill={TPA_COLORS.secondary} name="Avg Days/Employee" />
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