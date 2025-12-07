// src/components/common/display/StatsCards.jsx
/**
 * Universal StatsCards Component
 * Reusable statistics cards for dashboards
 * Can be used for: HR metrics, leave statistics, performance KPIs, etc.
 * 
 * @param {Array} stats - Array of stat objects:
 *   {
 *     label: string,
 *     value: string|number,
 *     icon: ReactNode,
 *     color: string (TPA color name or hex),
 *     trend: { value: number, isPositive: boolean, label: string } (optional)
 *   }
 * @param {number} columns - Number of columns for grid (default: auto based on count)
 * @param {Object} sx - Additional Material-UI sx props
 */

import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

const StatsCards = ({ stats = [], columns, sx = {} }) => {
  // TPA Brand Colors
  const colorPalette = {
    purple: '#667eea',
    teal: '#6AB4A8',
    orange: '#f59e42',
    blue: '#5B8FCC',
    green: '#4caf50',
    red: '#f44336',
    yellow: '#FDB94E',
    gray: '#546E7A'
  };

  const getColor = (colorName) => {
    return colorPalette[colorName?.toLowerCase()] || colorName || '#667eea';
  };

  const getGridColumns = () => {
    if (columns) return 12 / columns;
    const count = stats.length;
    if (count <= 2) return 6;
    if (count === 3) return 4;
    if (count === 4) return 3;
    return 3; // Default to 4 per row for 5+
  };

  if (!stats || stats.length === 0) return null;

  return (
    <Grid container spacing={2} sx={{ mb: 3, ...sx }}>
      {stats.map((stat, index) => {
        const color = getColor(stat.color);
        
        return (
          <Grid item xs={12} sm={6} md={getGridColumns()} key={index}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2.5, 
                borderRadius: 2,
                height: '100%',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                {stat.icon && (
                  <Box
                    sx={{
                      backgroundColor: `${color}15`,
                      borderRadius: 2,
                      p: 1,
                      mr: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {React.cloneElement(stat.icon, {
                      sx: { color, fontSize: 28 }
                    })}
                  </Box>
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    display="block" 
                    sx={{ mb: 0.5, fontWeight: 500 }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 600, 
                      color,
                      lineHeight: 1.2
                    }}
                  >
                    {stat.value}
                  </Typography>
                  
                  {/* Optional Trend Indicator */}
                  {stat.trend && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {stat.trend.isPositive ? (
                        <TrendingUpIcon sx={{ fontSize: 16, color: '#4caf50', mr: 0.5 }} />
                      ) : (
                        <TrendingDownIcon sx={{ fontSize: 16, color: '#f44336', mr: 0.5 }} />
                      )}
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: stat.trend.isPositive ? '#4caf50' : '#f44336',
                          fontWeight: 600
                        }}
                      >
                        {stat.trend.value}%
                      </Typography>
                      {stat.trend.label && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ ml: 0.5 }}
                        >
                          {stat.trend.label}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatsCards;

/**
 * Usage Examples:
 * 
 * // Onboarding Statistics
 * import { People, TrendingUp, Warning } from '@mui/icons-material';
 * 
 * <StatsCards
 *   stats={[
 *     {
 *       label: 'Total in Onboarding',
 *       value: 15,
 *       icon: <People />,
 *       color: 'orange'
 *     },
 *     {
 *       label: 'Average Progress',
 *       value: '67%',
 *       icon: <TrendingUp />,
 *       color: 'green',
 *       trend: { value: 12, isPositive: true, label: 'vs last month' }
 *     },
 *     {
 *       label: 'Overdue Tasks',
 *       value: 8,
 *       icon: <Warning />,
 *       color: 'red'
 *     }
 *   ]}
 * />
 * 
 * // Leave Statistics
 * import { EventAvailable, Schedule, CheckCircle } from '@mui/icons-material';
 * 
 * <StatsCards
 *   stats={[
 *     {
 *       label: 'Pending Requests',
 *       value: 12,
 *       icon: <Schedule />,
 *       color: 'orange'
 *     },
 *     {
 *       label: 'Approved This Month',
 *       value: 45,
 *       icon: <CheckCircle />,
 *       color: 'green'
 *     },
 *     {
 *       label: 'Available PTO Days',
 *       value: 18.5,
 *       icon: <EventAvailable />,
 *       color: 'teal'
 *     }
 *   ]}
 *   columns={3}
 * />
 * 
 * // Performance KPIs
 * <StatsCards
 *   stats={[
 *     {
 *       label: 'Reviews Completed',
 *       value: '85%',
 *       icon: <Assessment />,
 *       color: '#667eea',
 *       trend: { value: 5, isPositive: true, label: 'from last quarter' }
 *     },
 *     {
 *       label: 'Average Rating',
 *       value: 4.2,
 *       icon: <Star />,
 *       color: '#FDB94E'
 *     }
 *   ]}
 * />
 */