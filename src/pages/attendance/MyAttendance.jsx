// src/pages/attendance/MyAttendance.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
  TextField,
  MenuItem
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon
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
  calculateAttendanceStats,
  getDateRangeForFilter,
  DATE_RANGE_OPTIONS
} from './models/attendanceModels';

const MyAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
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
      fetchAttendance();
    }
  }, [startDate, endDate]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await attendanceService.getMyAttendance(startDate, endDate);
      setAttendance(data.attendance || []);

      // Calculate stats
      const calculatedStats = calculateAttendanceStats(data.attendance || []);
      setStats(calculatedStats);
    } catch (err) {
      const errorMsg = err.message || 'Failed to load attendance';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    if (range !== 'custom') {
      const dateRange = getDateRangeForFilter(range);
      setStartDate(dateRange.startDate);
      setEndDate(dateRange.endDate);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Table columns configuration
  const columns = [
    {
      id: 'attendanceDate',
      label: 'Date',
      minWidth: 150,
      sortable: true,
      render: (row) => (
        <Typography variant="body2" fontWeight={500}>
          {formatDate(row.attendanceDate)}
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
            HalfDay: 'secondary',
            Holiday: 'default'
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
      label: 'Working Hours',
      minWidth: 120,
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
          label={`${row.lateMinutes} min`}
          colorMap={{ default: 'warning' }}
        />
      ) : (
        <Typography variant="body2" color="text.secondary">-</Typography>
      )
    },
    {
      id: 'remarks',
      label: 'Remarks',
      minWidth: 200,
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.remarks || '-'}
        </Typography>
      )
    }
  ];

  const paginatedData = attendance.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading && attendance.length === 0) {
    return (
      <Layout>
        <Loading message="Loading attendance records..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="My Attendance"
        subtitle="View your attendance history and statistics"
        icon={CalendarIcon}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <TextField
              select
              label="Date Range"
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              size="small"
              sx={{ minWidth: 200 }}
            >
              {DATE_RANGE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {dateRange === 'custom' && (
              <>
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </>
            )}

            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchAttendance}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {stats && (
        <Box sx={{ mb: 3 }}>
          <AttendanceStatsCards stats={stats} />
        </Box>
      )}

      {/* Attendance Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Attendance Records
          </Typography>

          <DataTable
            columns={columns}
            data={paginatedData}
            loading={loading}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={attendance.length}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            emptyMessage="No attendance records found for the selected period"
          />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default MyAttendance;
