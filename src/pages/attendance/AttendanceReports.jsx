// src/pages/attendance/AttendanceReports.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
  TextField,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Assessment as ReportIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import DataTable from '../../components/common/tables/DataTable';
import StatusChip from '../../components/common/display/StatusChip';
import Loading from '../../components/common/feedback/Loading';
import { AttendanceStatsCards } from './components';
import attendanceService from '../../services/attendanceService';
import {
  formatDate,
  formatTime,
  formatHours,
  getAttendanceStatusColor,
  getDateRangeForFilter,
  REPORT_TYPE_OPTIONS,
  DATE_RANGE_OPTIONS
} from './models/attendanceModels';

const AttendanceReports = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [dailyReport, setDailyReport] = useState([]);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    // Initialize date range
    const range = getDateRangeForFilter('month');
    setStartDate(range.startDate);
    setEndDate(range.endDate);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchReports();
    }
  }, [startDate, endDate, reportType]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');

      if (reportType === 'summary') {
        const data = await attendanceService.getAttendanceSummary(startDate, endDate);
        setReportData(data);
      } else if (reportType === 'daily') {
        const today = new Date().toISOString().split('T')[0];
        const data = await attendanceService.getDailyReport(today);
        setDailyReport(data.report || []);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to load reports';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    if (range !== 'custom') {
      const dateRangeData = getDateRangeForFilter(range);
      setStartDate(dateRangeData.startDate);
      setEndDate(dateRangeData.endDate);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Daily Report Columns
  const dailyColumns = [
    {
      id: 'employeeName',
      label: 'Employee',
      minWidth: 180,
      render: (row) => (
        <Typography variant="body2" fontWeight={500}>
          {row.employeeName}
        </Typography>
      )
    },
    {
      id: 'department',
      label: 'Department',
      minWidth: 150,
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.department || '-'}
        </Typography>
      )
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      render: (row) => (
        <StatusChip
          status={row.status}
          colorMap={{
            Present: 'success',
            Absent: 'error',
            Late: 'warning',
            Leave: 'info',
            HalfDay: 'secondary'
          }}
        />
      )
    },
    {
      id: 'clockInTime',
      label: 'Clock In',
      minWidth: 100,
      render: (row) => (
        <Typography variant="body2">
          {formatTime(row.clockInTime)}
        </Typography>
      )
    },
    {
      id: 'clockOutTime',
      label: 'Clock Out',
      minWidth: 100,
      render: (row) => (
        <Typography variant="body2">
          {formatTime(row.clockOutTime)}
        </Typography>
      )
    },
    {
      id: 'workingHours',
      label: 'Hours',
      minWidth: 100,
      render: (row) => (
        <Typography variant="body2" fontWeight={500}>
          {row.workingHours ? `${formatHours(row.workingHours)} hrs` : '-'}
        </Typography>
      )
    },
    {
      id: 'isLate',
      label: 'Late',
      minWidth: 100,
      render: (row) => row.isLate ? (
        <StatusChip
          label={`${row.lateMinutes || 0} min`}
          colorMap={{ default: 'warning' }}
        />
      ) : (
        <Typography variant="body2" color="text.secondary">-</Typography>
      )
    }
  ];

  // Employee Summary Columns
  const summaryColumns = [
    {
      id: 'employeeName',
      label: 'Employee',
      minWidth: 180,
      render: (row) => (
        <Typography variant="body2" fontWeight={500}>
          {row.employeeName}
        </Typography>
      )
    },
    {
      id: 'presentDays',
      label: 'Present',
      minWidth: 90,
      render: (row) => (
        <Typography variant="body2" align="center">
          {row.presentDays || 0}
        </Typography>
      )
    },
    {
      id: 'absentDays',
      label: 'Absent',
      minWidth: 90,
      render: (row) => (
        <Typography variant="body2" align="center" color="error">
          {row.absentDays || 0}
        </Typography>
      )
    },
    {
      id: 'lateDays',
      label: 'Late',
      minWidth: 90,
      render: (row) => (
        <Typography variant="body2" align="center" color="warning.main">
          {row.lateDays || 0}
        </Typography>
      )
    },
    {
      id: 'leaveDays',
      label: 'Leave',
      minWidth: 90,
      render: (row) => (
        <Typography variant="body2" align="center">
          {row.leaveDays || 0}
        </Typography>
      )
    },
    {
      id: 'totalHours',
      label: 'Total Hours',
      minWidth: 120,
      render: (row) => (
        <Typography variant="body2" fontWeight={500}>
          {row.totalHours ? formatHours(row.totalHours) : '0'}
        </Typography>
      )
    },
    {
      id: 'attendanceRate',
      label: 'Attendance Rate',
      minWidth: 140,
      render: (row) => {
        const rate = row.attendanceRate || 0;
        return (
          <StatusChip
            label={`${rate.toFixed(1)}%`}
            colorMap={{
              default: rate >= 90 ? 'success' : rate >= 75 ? 'warning' : 'error'
            }}
          />
        );
      }
    }
  ];

  const currentData = reportType === 'daily' ? dailyReport : (reportData?.employeeSummary || []);
  const currentColumns = reportType === 'daily' ? dailyColumns : summaryColumns;

  const paginatedData = currentData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading && !reportData && dailyReport.length === 0) {
    return (
      <Layout>
        <Loading message="Loading reports..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Attendance Reports"
        subtitle="View comprehensive attendance statistics and reports"
        icon={ReportIcon}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Report Type"
                value={reportType}
                onChange={(e) => {
                  setReportType(e.target.value);
                  setPage(0);
                }}
                size="small"
              >
                {REPORT_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {reportType === 'summary' && (
              <>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Date Range"
                    value={dateRange}
                    onChange={(e) => handleDateRangeChange(e.target.value)}
                    size="small"
                  >
                    {DATE_RANGE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {dateRange === 'custom' && (
                  <>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                      />
                    </Grid>
                  </>
                )}
              </>
            )}

            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={fetchReports}
                disabled={loading}
                fullWidth
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      {reportType === 'summary' && reportData && (
        <Box sx={{ mb: 3 }}>
          <AttendanceStatsCards stats={reportData} />
        </Box>
      )}

      {/* Report Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              {reportType === 'daily'
                ? `Daily Report - ${formatDate(new Date())}`
                : 'Employee Summary'}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="small"
            >
              Export
            </Button>
          </Box>

          <DataTable
            columns={currentColumns}
            data={paginatedData}
            loading={loading}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={currentData.length}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            emptyMessage={`No ${reportType} data available`}
          />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AttendanceReports;
