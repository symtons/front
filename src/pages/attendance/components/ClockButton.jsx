// src/pages/attendance/components/ClockButton.jsx
import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Login as ClockInIcon, Logout as ClockOutIcon } from '@mui/icons-material';

const ClockButton = ({ type = 'in', loading = false, onClick, disabled = false }) => {
  const isClockIn = type === 'in';

  const gradient = isClockIn
    ? 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)'
    : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';

  const hoverGradient = isClockIn
    ? 'linear-gradient(135deg, #43cea2 20%, #185a9d 120%)'
    : 'linear-gradient(135deg, #f093fb 20%, #f5576c 120%)';

  return (
    <Button
      variant="contained"
      size="large"
      startIcon={loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : (isClockIn ? <ClockInIcon /> : <ClockOutIcon />)}
      onClick={onClick}
      disabled={disabled || loading}
      sx={{
        px: 8,
        py: 2,
        fontSize: '1.25rem',
        fontWeight: 600,
        background: gradient,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: hoverGradient,
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.2)'
        },
        '&:active': {
          transform: 'translateY(0px)'
        },
        '&:disabled': {
          background: '#e0e0e0',
          color: '#9e9e9e'
        }
      }}
    >
      {loading ? 'Processing...' : (isClockIn ? 'Clock In' : 'Clock Out')}
    </Button>
  );
};

export default ClockButton;
