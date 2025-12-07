// src/components/common/display/ProgressCard.jsx
/**
 * Universal ProgressCard Component
 * Reusable progress/completion indicator card
 * Can be used for: onboarding progress, training completion, goal tracking, etc.
 * 
 * @param {string} title - Card title (e.g., "Your Progress", "Training Completion")
 * @param {number} percentage - Progress percentage (0-100)
 * @param {string} progressLabel - Label for progress (e.g., "2 of 3 tasks completed")
 * @param {string} completionMessage - Message shown at 100% completion
 * @param {string} completionSubMessage - Sub-message shown at 100% completion
 * @param {Function} getProgressColor - Function to determine color based on percentage
 * @param {boolean} showPercentage - Show percentage number (default: true)
 * @param {Object} sx - Additional Material-UI sx props
 */

import React from 'react';
import { Box, Typography, Card, CardContent, LinearProgress } from '@mui/material';

const ProgressCard = ({
  title = 'Progress',
  percentage = 0,
  progressLabel = '',
  completionMessage = '🎉 Congratulations! You\'re all done!',
  completionSubMessage = '',
  getProgressColor,
  showPercentage = true,
  sx = {}
}) => {
  // Default color function
  const defaultGetProgressColor = (pct) => {
    if (pct === 100) return '#4caf50'; // Green
    if (pct >= 67) return '#6AB4A8';   // Teal
    if (pct >= 33) return '#f59e42';   // Orange
    return '#667eea';                   // Blue
  };

  const colorFunction = getProgressColor || defaultGetProgressColor;
  const progressColor = colorFunction(percentage);
  const isComplete = percentage === 100;

  return (
    <Card elevation={2} sx={{ borderRadius: 2, mb: 3, ...sx }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(percentage, 100)}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: progressColor,
                  transition: 'background-color 0.3s ease'
                }
              }}
            />
          </Box>
          {showPercentage && (
            <Typography 
              variant="h6" 
              fontWeight={600}
              sx={{ 
                color: isComplete ? '#4caf50' : 'text.primary',
                minWidth: 50,
                textAlign: 'right'
              }}
            >
              {Math.round(percentage)}%
            </Typography>
          )}
        </Box>
        
        {progressLabel && (
          <Typography variant="body2" color="text.secondary">
            {progressLabel}
          </Typography>
        )}

        {isComplete && completionMessage && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              backgroundColor: '#d4edda',
              borderRadius: 1,
              border: '1px solid #c3e6cb'
            }}
          >
            <Typography variant="body2" sx={{ color: '#155724', fontWeight: 600 }}>
              {completionMessage}
            </Typography>
            {completionSubMessage && (
              <Typography variant="caption" sx={{ color: '#155724' }}>
                {completionSubMessage}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressCard;

/**
 * Usage Examples:
 * 
 * // Onboarding Progress
 * <ProgressCard
 *   title="Your Onboarding Progress"
 *   percentage={67}
 *   progressLabel="2 of 3 tasks completed"
 *   completionMessage="🎉 Congratulations! Your onboarding is complete!"
 *   completionSubMessage="Your account will be activated shortly."
 * />
 * 
 * // Training Completion
 * <ProgressCard
 *   title="Training Progress"
 *   percentage={80}
 *   progressLabel="4 of 5 modules completed"
 *   completionMessage="🎓 Training complete! Certificate ready for download."
 * />
 * 
 * // Goal Tracking
 * <ProgressCard
 *   title="Q4 Goal Progress"
 *   percentage={45}
 *   progressLabel="On track to meet quarterly targets"
 *   showPercentage={true}
 * />
 * 
 * // Custom Colors
 * <ProgressCard
 *   title="Performance Review"
 *   percentage={90}
 *   progressLabel="9 of 10 sections completed"
 *   getProgressColor={(pct) => pct >= 80 ? '#1976d2' : '#f57c00'}
 * />
 */