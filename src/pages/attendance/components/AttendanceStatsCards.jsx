// src/pages/attendance/components/AttendanceStatsCards.jsx
import React from 'react';
import { Grid } from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  AccessTime as LateIcon,
  EventBusy as LeaveIcon,
  PieChart as RateIcon,
  Schedule as HoursIcon
} from '@mui/icons-material';
import InfoCard from '../../../components/common/display/InfoCard';

const AttendanceStatsCards = ({ stats, variant = 'full' }) => {
  if (!stats) return null;

  const cardsConfig = [
    {
      icon: CalendarIcon,
      title: 'Total Days',
      data: [{ label: 'Days', value: stats.totalDays || 0, bold: true }],
      color: 'blue'
    },
    {
      icon: PresentIcon,
      title: 'Present',
      data: [{ label: 'Days', value: stats.presentDays || 0, bold: true }],
      color: 'teal'
    },
    {
      icon: AbsentIcon,
      title: 'Absent',
      data: [{ label: 'Days', value: stats.absentDays || 0, bold: true }],
      color: 'red'
    },
    {
      icon: LateIcon,
      title: 'Late',
      data: [{ label: 'Days', value: stats.lateDays || 0, bold: true }],
      color: 'gold'
    },
    {
      icon: LeaveIcon,
      title: 'On Leave',
      data: [{ label: 'Days', value: stats.leaveDays || 0, bold: true }],
      color: 'blue'
    },
    {
      icon: RateIcon,
      title: 'Attendance Rate',
      data: [{
        label: 'Rate',
        value: stats.attendanceRate ? `${stats.attendanceRate}%` : '0%',
        bold: true
      }],
      color: 'purple'
    },
    {
      icon: HoursIcon,
      title: 'Total Hours',
      data: [{
        label: 'Hours',
        value: Math.round(stats.totalHours || 0),
        bold: true
      }],
      color: 'blue'
    },
    {
      icon: HoursIcon,
      title: 'Avg Hours/Day',
      data: [{
        label: 'Hours',
        value: stats.averageHoursPerDay || '0',
        bold: true
      }],
      color: 'gold'
    }
  ];

  // Compact variant shows only key metrics
  const compactCards = [
    cardsConfig[0], // Total Days
    cardsConfig[1], // Present
    cardsConfig[3], // Late
    cardsConfig[6]  // Total Hours
  ];

  const displayCards = variant === 'compact' ? compactCards : cardsConfig;

  return (
    <Grid container spacing={3}>
      {displayCards.map((card, index) => (
        <Grid key={index} item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <InfoCard
            icon={card.icon}
            title={card.title}
            data={card.data}
            color={card.color}
            elevated={true}
            sx={{ width: '100%' }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default AttendanceStatsCards;
