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
  Grid
} from '@mui/material';
import {
  EventAvailable as PTOIcon,
  TrendingUp as EarnedIcon,
  TrendingDown as UsedIcon,
  Schedule as PendingIcon
} from '@mui/icons-material';

/**
 * PTOBalanceCard Component
 * 
 * Displays employee's PTO balance with visual progress bar
 * Shows: Total, Available, Used, Pending breakdown
 * 
 * Props:
 * - balance: { total, available, used, pending, accrualRate }
 * - loading: boolean
 * - employeeType: 'Admin Staff' | 'Field Staff'
 */

const PTOBalanceCard = ({ balance, loading = false, employeeType = 'Admin Staff' }) => {
  
  // Field Staff don't have PTO
  if (employeeType === 'Field Staff') {
    return (
      <Card sx={{ 
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        border: '2px solid #e0e0e0'
      }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <PTOIcon sx={{ fontSize: 48, color: '#9e9e9e', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              PTO Not Applicable
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Field Staff positions are not eligible for PTO benefits
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body1" color="text.secondary">
              Loading PTO balance...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Default values if balance not provided
  const {
    total = 0,
    available = 0,
    used = 0,
    pending = 0,
    accrualRate = 0
  } = balance || {};

  // Calculate percentages
  const usedPercentage = total > 0 ? (used / total) * 100 : 0;
  const pendingPercentage = total > 0 ? (pending / total) * 100 : 0;
  const availablePercentage = total > 0 ? (available / total) * 100 : 0;

  // Determine color based on available balance
  const getBalanceColor = () => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return '#2e7d32'; // Green
    if (percentage > 25) return '#ff9800'; // Orange
    return '#d32f2f'; // Red
  };

  const balanceColor = getBalanceColor();

  return (
    <Card sx={{ 
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      border: '2px solid #2196f3'
    }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PTOIcon sx={{ fontSize: 32, color: '#1976d2', mr: 1.5 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1565c0' }}>
              PTO Balance
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Paid Time Off Available
            </Typography>
          </Box>
          <Chip 
            label={`${available} Days`}
            sx={{ 
              bgcolor: balanceColor,
              color: 'white',
              fontWeight: 600,
              fontSize: '0.9rem',
              px: 1
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Main Balance Display */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Available
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: balanceColor }}>
              {available.toFixed(1)}
              <Typography component="span" variant="body1" color="text.secondary">
                {' '}/ {total} days
              </Typography>
            </Typography>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ position: 'relative', mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={100}
              sx={{ 
                height: 24,
                borderRadius: 2,
                bgcolor: '#e0e0e0'
              }}
            />
            <LinearProgress 
              variant="determinate" 
              value={usedPercentage + pendingPercentage}
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 24,
                borderRadius: 2,
                bgcolor: 'transparent',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#ff9800'
                }
              }}
            />
            <LinearProgress 
              variant="determinate" 
              value={usedPercentage}
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 24,
                borderRadius: 2,
                bgcolor: 'transparent',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#f44336'
                }
              }}
            />
            
            {/* Progress Labels */}
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'white' }}>
                {availablePercentage.toFixed(0)}% Available
              </Typography>
            </Box>
          </Box>

          {/* Legend */}
          <Box sx={{ display: 'flex', gap: 2, mt: 1.5, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: balanceColor, borderRadius: 1 }} />
              <Typography variant="caption">Available</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: '#ff9800', borderRadius: 1 }} />
              <Typography variant="caption">Pending</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: '#f44336', borderRadius: 1 }} />
              <Typography variant="caption">Used</Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Breakdown Stats */}
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <EarnedIcon sx={{ fontSize: 20, color: '#2196f3', mb: 0.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1565c0' }}>
                {total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Earned
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <UsedIcon sx={{ fontSize: 20, color: '#f44336', mb: 0.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#d32f2f' }}>
                {used.toFixed(1)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Used
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <PendingIcon sx={{ fontSize: 20, color: '#ff9800', mb: 0.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#f57c00' }}>
                {pending.toFixed(1)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pending
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Accrual Rate Info */}
        {accrualRate > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ 
              bgcolor: 'rgba(25, 118, 210, 0.08)',
              borderRadius: 1,
              p: 1.5,
              textAlign: 'center'
            }}>
              <Typography variant="caption" color="text.secondary">
                Accrual Rate
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1565c0', mt: 0.5 }}>
                {accrualRate} days per month
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PTOBalanceCard;