// src/pages/dashboard/components/StatCard.jsx
/**
 * StatCard Component
 * Reusable card for displaying dashboard metrics
 */

import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { formatNumber, formatCurrency, formatPercentage } from '../models/dashboardModels';

const StatCard = ({ 
  title, 
  value, 
  type = 'number',
  subtitle, 
  icon, 
  color = '#667eea',
  loading = false,
  trend
}) => {
  
  // Format value based on type
  const formatValue = (val) => {
    if (val === null || val === undefined) return '0';
    
    switch (type) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val);
      case 'number':
        return formatNumber(val);
      default:
        return val;
    }
  };

  // Get trend color
  const getTrendColor = (direction) => {
    if (direction === 'up') return '#6AB4A8'; // Green
    if (direction === 'down') return '#F44336'; // Red
    return '#757575'; // Gray
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        borderTop: `4px solid ${color}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        }
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          {icon && (
            <Typography variant="h5" sx={{ opacity: 0.7 }}>
              {icon}
            </Typography>
          )}
        </Box>

        {/* Value */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                mb: 1
              }}
            >
              {formatValue(value)}
            </Typography>

            {/* Subtitle */}
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}

            {/* Trend Indicator */}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: getTrendColor(trend.direction),
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  {trend.direction === 'up' && '↑'}
                  {trend.direction === 'down' && '↓'}
                  {trend.direction === 'stable' && '→'}
                  {trend.value}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                  {trend.label || ''}
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;