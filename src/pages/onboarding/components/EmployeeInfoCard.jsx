// src/pages/onboarding/components/EmployeeInfoCard.jsx
/**
 * Employee Info Card Component
 * Displays employee information in a card format
 */

import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Chip } from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { getOnboardingStatusColor } from '../models/onboardingModels';

const EmployeeInfoCard = ({ employee }) => {
  if (!employee) return null;

  const statusColors = getOnboardingStatusColor(employee.onboardingStatus);

  const getInitials = () => {
    if (!employee.fullName) return '?';
    const names = employee.fullName.split(' ');
    return names.map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              backgroundColor: '#667eea',
              fontSize: '1.5rem',
              fontWeight: 600,
              mr: 2
            }}
          >
            {getInitials()}
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              {employee.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {employee.jobTitle || 'Field Operator'}
              {employee.department && ` • ${employee.department}`}
            </Typography>
            <Chip
              label={employee.onboardingStatus}
              size="small"
              sx={{
                backgroundColor: statusColors.bg,
                color: statusColors.color,
                fontWeight: 600,
                border: `1px solid ${statusColors.border}`
              }}
            />
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <BadgeIcon sx={{ fontSize: 18, color: '#666', mr: 1 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Employee ID
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {employee.employeeCode}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <EmailIcon sx={{ fontSize: 18, color: '#666', mr: 1 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Email
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {employee.email}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <CalendarIcon sx={{ fontSize: 18, color: '#666', mr: 1 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Hire Date
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatDate(employee.hireDate)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <WorkIcon sx={{ fontSize: 18, color: '#666', mr: 1 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Employment Status
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {employee.employmentStatus || 'Active'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EmployeeInfoCard;