// src/pages/attendance/components/ShiftInfoCard.jsx
import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { Schedule as ScheduleIcon } from '@mui/icons-material';
import { transformShiftForDisplay } from '../models/attendanceModels';

const ShiftInfoCard = ({ shift, variant = 'default' }) => {
  if (!shift) return null;

  const shiftDisplay = transformShiftForDisplay(shift);

  if (variant === 'compact') {
    return (
      <Card sx={{ background: '#f5f5f5' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <ScheduleIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              {shiftDisplay.shiftName}
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Start Time
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {shiftDisplay.startTime}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography variant="body2" color="text.secondary">
                End Time
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {shiftDisplay.endTime}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Working Hours
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {shiftDisplay.workingHoursDisplay}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        mb: 3
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ScheduleIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {shiftDisplay.shiftName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Your Current Shift
            </Typography>
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 0.5 }}>
                Start Time
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {shiftDisplay.startTime}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 0.5 }}>
                End Time
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {shiftDisplay.endTime}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 0.5 }}>
                Working Hours
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {shiftDisplay.workingHoursDisplay}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 0.5 }}>
                Grace Period
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {shiftDisplay.graceDisplay}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ShiftInfoCard;
