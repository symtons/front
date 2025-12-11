// src/pages/reports/components/StatCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = '#667eea',
  trend = null, // { value: 5, direction: 'up' }
  subtitle = null
}) => {
  return (
    <Card sx={{ height: '100%', borderTop: `4px solid ${color}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Icon Box */}
          <Box
            sx={{
              backgroundColor: `${color}1A`, // Add 10% opacity
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {Icon && <Icon sx={{ fontSize: 32, color }} />}
          </Box>
        </Box>

        {/* Optional Trend Indicator */}
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {trend.direction === 'up' ? (
              <TrendingUpIcon sx={{ fontSize: 16, color: '#4caf50', mr: 0.5 }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 16, color: '#f44336', mr: 0.5 }} />
            )}
            <Typography 
              variant="caption" 
              sx={{ 
                color: trend.direction === 'up' ? '#4caf50' : '#f44336',
                fontWeight: 600
              }}
            >
              {trend.value}%
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ ml: 0.5 }}>
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;