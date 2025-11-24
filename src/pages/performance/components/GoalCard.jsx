// src/pages/performance/components/GoalCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  TrendingUp as ProgressIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import {
  getGoalStatusColor,
  getGoalPriorityColor,
  formatDate,
  formatProgress,
  isGoalOverdue,
  getDaysUntilDue
} from '../models/performanceModels';

/**
 * GoalCard Component
 *
 * Displays a goal card with status, progress, and actions
 *
 * Props:
 * - goal: goal object
 * - onView: function to view goal details
 * - onEdit: function to edit goal (optional)
 * - onDelete: function to delete goal (optional)
 * - showActions: boolean to show/hide action buttons
 */

const GoalCard = ({ goal, onView, onEdit, onDelete, showActions = true }) => {
  const overdue = isGoalOverdue(goal.dueDate, goal.status);
  const daysUntilDue = getDaysUntilDue(goal.dueDate);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: overdue ? '1px solid' : 'none',
        borderColor: overdue ? 'error.main' : 'transparent',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header with Title and Priority */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, flex: 1, mr: 1 }}>
            {goal.title}
          </Typography>
          <Chip
            label={goal.priority}
            size="small"
            color={getGoalPriorityColor(goal.priority)}
            sx={{ fontWeight: 500 }}
          />
        </Box>

        {/* Description */}
        {goal.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {goal.description}
          </Typography>
        )}

        {/* Category and Status */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {goal.category && (
            <Chip
              label={goal.category}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          )}
          <Chip
            label={goal.status}
            size="small"
            color={getGoalStatusColor(goal.status)}
            sx={{ fontWeight: 500 }}
          />
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ProgressIcon fontSize="small" /> Progress
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {formatProgress(goal.progress)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={goal.progress || 0}
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 1,
                bgcolor: goal.progress >= 100 ? 'success.main' : goal.progress >= 50 ? 'info.main' : 'warning.main'
              }
            }}
          />
        </Box>

        {/* Dates */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarIcon fontSize="small" />
            {formatDate(goal.startDate)} - {formatDate(goal.dueDate)}
          </Typography>
        </Box>

        {/* Overdue/Days Until Due Warning */}
        {overdue ? (
          <Chip
            label="Overdue"
            size="small"
            color="error"
            sx={{ fontWeight: 600 }}
          />
        ) : daysUntilDue <= 7 && daysUntilDue > 0 && goal.status !== 'Completed' && (
          <Chip
            label={`${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''} remaining`}
            size="small"
            color="warning"
            sx={{ fontWeight: 500 }}
          />
        )}

        {/* Created By */}
        {goal.createdBy && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Created by: {goal.createdBy}
          </Typography>
        )}

        {/* Update Count */}
        {goal.updateCount !== undefined && goal.updateCount > 0 && (
          <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5 }}>
            {goal.updateCount} update{goal.updateCount !== 1 ? 's' : ''}
          </Typography>
        )}
      </CardContent>

      {/* Actions */}
      {showActions && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            px: 2,
            pb: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 1
          }}
        >
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onView(goal)}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>

          {onEdit && (
            <Tooltip title="Edit Goal">
              <IconButton
                size="small"
                color="primary"
                onClick={() => onEdit(goal)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}

          {onDelete && (
            <Tooltip title="Delete Goal">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(goal)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
    </Card>
  );
};

export default GoalCard;
