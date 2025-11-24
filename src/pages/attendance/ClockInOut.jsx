// src/pages/attendance/ClockInOut.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  Snackbar,
  Chip,
  Divider
} from '@mui/material';
import {
  AccessTime as ClockIcon,
  Schedule as ScheduleIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import InfoCard from '../../components/common/display/InfoCard';
import Loading from '../../components/common/feedback/Loading';
import { ShiftInfoCard, ClockButton } from './components';
import attendanceService from '../../services/attendanceService';
import { formatTime, formatDate, calculateDuration } from './models/attendanceModels';

const ClockInOut = () => {
  const [loading, setLoading] = useState(true);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [myShift, setMyShift] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statusData, shiftData] = await Promise.all([
        attendanceService.getCurrentStatus(),
        attendanceService.getMyShift()
      ]);

      setIsClockedIn(statusData.isClockedIn);
      setCurrentEntry(statusData.timeEntry || null);
      setMyShift(shiftData.hasShift ? shiftData.shift : null);
    } catch (err) {
      const errorMsg = err.message || 'Failed to load data';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      setActionLoading(true);
      setError('');

      // Get location (optional)
      let location = null;
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000
            });
          });
          location = `${position.coords.latitude}, ${position.coords.longitude}`;
        } catch (err) {
          console.log('Location access denied or unavailable');
        }
      }

      const result = await attendanceService.clockIn(location);
      setSuccess(result.message || 'Clocked in successfully!');
      await fetchData();
    } catch (err) {
      const errorMsg = err.message || 'Failed to clock in';
      setError(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setActionLoading(true);
      setError('');

      // Get location (optional)
      let location = null;
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000
            });
          });
          location = `${position.coords.latitude}, ${position.coords.longitude}`;
        } catch (err) {
          console.log('Location access denied or unavailable');
        }
      }

      const result = await attendanceService.clockOut(location, myShift?.breakDuration || 0);
      setSuccess(result.message || 'Clocked out successfully!');
      await fetchData();
    } catch (err) {
      const errorMsg = err.message || 'Failed to clock out';
      setError(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading clock in/out..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Clock In/Out"
        subtitle="Track your working hours"
        icon={ClockIcon}
        chips={[
          { label: formatDate(currentTime), icon: TodayIcon }
        ]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Current Time Card */}
      <Card
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 1, letterSpacing: 2 }}>
            {formatTime(currentTime)}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <InfoCard
            icon={ClockIcon}
            title="Current Status"
            data={[
              {
                label: 'Status',
                value: isClockedIn ? 'Clocked In' : 'Clocked Out',
                bold: true,
                color: isClockedIn ? '#43cea2' : '#f44336'
              }
            ]}
            color={isClockedIn ? 'teal' : 'gray'}
            elevated={true}
            sx={{ width: '100%' }}
          />
        </Grid>

        {isClockedIn && currentEntry && (
          <>
            <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
              <InfoCard
                icon={ScheduleIcon}
                title="Clock In Time"
                data={[
                  {
                    label: 'Time',
                    value: formatTime(currentEntry.clockInTime),
                    bold: true
                  }
                ]}
                color="blue"
                elevated={true}
                sx={{ width: '100%' }}
              />
            </Grid>

            <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
              <InfoCard
                icon={ClockIcon}
                title="Duration"
                data={[
                  {
                    label: 'Hours',
                    value: calculateDuration(currentEntry.clockInTime),
                    bold: true
                  }
                ]}
                color="gold"
                elevated={true}
                sx={{ width: '100%' }}
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* Shift Information */}
      {myShift && <ShiftInfoCard shift={myShift} />}

      {!myShift && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No shift assigned. Please contact your administrator to assign a shift to your profile.
        </Alert>
      )}

      <Divider sx={{ my: 4 }} />

      {/* Clock In/Out Action */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          py: 4
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {isClockedIn ? 'Ready to clock out?' : 'Ready to start your day?'}
        </Typography>

        <ClockButton
          type={isClockedIn ? 'out' : 'in'}
          loading={actionLoading}
          onClick={isClockedIn ? handleClockOut : handleClockIn}
          disabled={!myShift}
        />

        {isClockedIn && currentEntry && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Chip
              icon={<ClockIcon />}
              label={`Working for ${calculateDuration(currentEntry.clockInTime)}`}
              color="primary"
              variant="outlined"
              sx={{ fontSize: '0.9rem', py: 2, px: 1 }}
            />
          </Box>
        )}
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={Boolean(success)}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" variant="filled">
          {success}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default ClockInOut;
