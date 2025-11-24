// src/pages/attendance/AttendanceSchedule.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import {
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import Loading from '../../components/common/feedback/Loading';
import { ShiftInfoCard, AttendanceCalendar } from './components';
import attendanceService from '../../services/attendanceService';
import { getMonthStartEnd, formatDateForInput } from './models/attendanceModels';

const AttendanceSchedule = () => {
  const [loading, setLoading] = useState(true);
  const [myShift, setMyShift] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const { startDate, endDate } = getMonthStartEnd(currentDate);
      const startDateStr = formatDateForInput(startDate);
      const endDateStr = formatDateForInput(endDate);

      const [shiftData, attendanceData] = await Promise.all([
        attendanceService.getMyShift(),
        attendanceService.getMyAttendance(startDateStr, endDateStr)
      ]);

      setMyShift(shiftData.hasShift ? shiftData.shift : null);
      setAttendance(attendanceData.attendance || []);
    } catch (err) {
      const errorMsg = err.message || 'Failed to load schedule';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  if (loading && !myShift) {
    return (
      <Layout>
        <Loading message="Loading schedule..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Attendance Schedule"
        subtitle="View your shift schedule and attendance calendar"
        icon={ScheduleIcon}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* My Shift Info */}
      {myShift && <ShiftInfoCard shift={myShift} />}

      {!myShift && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No shift assigned. Please contact your administrator to assign a shift to your profile.
        </Alert>
      )}

      {/* Calendar */}
      <Card>
        <CardContent>
          <AttendanceCalendar
            attendanceData={attendance}
            currentDate={currentDate}
            onDateChange={handleDateChange}
          />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AttendanceSchedule;
