// src/pages/dashboard/components/WelcomeHeader.jsx
/**
 * WelcomeHeader Component
 * Displays personalized greeting and current date/time
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { getGreeting } from '../models/dashboardModels';

const WelcomeHeader = ({ name, role, subtitle }) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Update time every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ' • ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 700,
          color: 'text.primary',
          mb: 1
        }}
      >
        {getGreeting()}, {name}! 👋
      </Typography>
      
      {role && (
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {role}
        </Typography>
      )}
      
      {subtitle && (
        <Typography 
          variant="body2" 
          color="text.secondary"
        >
          {subtitle}
        </Typography>
      )}
      
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ mt: 1 }}
      >
        {formatDateTime(currentTime)}
      </Typography>
    </Box>
  );
};

export default WelcomeHeader;