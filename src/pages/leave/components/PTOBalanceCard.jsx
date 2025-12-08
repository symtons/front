// src/pages/leave/components/PTOBalanceCard.jsx
// PTO Balance Display Card with Visual Progress

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Divider,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  EventAvailable as PTOIcon,
  TrendingUp as EarnedIcon,
  TrendingDown as UsedIcon,
  CheckCircle as AvailableIcon
} from '@mui/icons-material';
import { 
  calculatePTOUsagePercentage, 
  getPTOStatus 
} from '../models/leaveModels';

/**
 * PTOBalanceCard Component
 * 
 * Displays employee's PTO balance with visual progress bar
 * Shows: Total, Available, Used breakdown
 * 
 * Props:
 * - balance: { totalPTODays, usedPTODays, remainingPTODays, isEligible }
 * - loading: boolean
 * - error: string
 */

const PTOBalanceCard = ({ balance, loading = false, error = null }) => {
  
  // Loading state
  if (loading) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={40} sx={{ color: '#667eea' }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading PTO balance...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card elevation={2} sx={{ border: '2px solid #f44336' }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <PTOIcon sx={{ fontSize: 48, color: '#f44336', mb: 2 }} />
            <Typography variant="h6" color="error">
              Error Loading Balance
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {error}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Not eligible (hourly employee)
  if (balance && !balance.isEligible) {
    return (
      <Card 
        elevation={2}
        sx={{ 
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          border: '2px solid #e0e0e0'
        }}
      >
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <PTOIcon sx={{ fontSize: 48, color: '#9e9e9e', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              PTO Not Applicable
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {balance.message || 'Hourly employees are not eligible for PTO benefits'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // No balance data
  if (!balance) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body1" color="text.secondary">
              No PTO balance information available
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Extract balance data
  const {
    totalPTODays = 0,
    usedPTODays = 0,
    remainingPTODays = 0,
    year = new Date().getFullYear()
  } = balance;

  // Calculate percentages
  const usedPercentage = calculatePTOUsagePercentage(usedPTODays, totalPTODays);
  const remainingPercentage = 100 - usedPercentage;
  const ptoStatus = getPTOStatus(remainingPTODays, totalPTODays);

  return (
    <Card 
      elevation={2}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PTOIcon sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              PTO Balance {year}
            </Typography>
          </Box>
          <Chip
            label={ptoStatus.label}
            sx={{
              backgroundColor: ptoStatus.color,
              color: 'white',
              fontWeight: 600
            }}
          />
        </Box>

        {/* Main Balance Display */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
            {remainingPTODays}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            days remaining
          </Typography>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <LinearProgress
            variant="determinate"
            value={remainingPercentage}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'white',
                borderRadius: 6
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Used: {usedPercentage}%
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Available: {remainingPercentage}%
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />

        {/* Breakdown Grid */}
        <Grid container spacing={2}>
          {/* Total PTO */}
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <EarnedIcon sx={{ fontSize: 24, mb: 0.5, opacity: 0.8 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {totalPTODays}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Total
              </Typography>
            </Box>
          </Grid>

          {/* Used PTO */}
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <UsedIcon sx={{ fontSize: 24, mb: 0.5, opacity: 0.8 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {usedPTODays}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Used
              </Typography>
            </Box>
          </Grid>

          {/* Available PTO */}
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <AvailableIcon sx={{ fontSize: 24, mb: 0.5, opacity: 0.8 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {remainingPTODays}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Available
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Accrual Info (if available) */}
        {balance.accrualRate && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              ℹ️ You accrue {balance.accrualRate} days per month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PTOBalanceCard;