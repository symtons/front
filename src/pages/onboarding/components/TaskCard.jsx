// src/pages/onboarding/components/TaskCard.jsx
/**
 * Task Card Component - UPDATED
 * Now uses universal StatusChip from common components
 * Displays individual onboarding task with status, due date, and action button
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Button,
  Chip
} from '@mui/material';
import {
  CheckCircle as CompletedIcon,
  Edit as InputIcon,
  CheckBox as AcknowledgeIcon,
  CloudUpload as UploadIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import StatusChip from '../../../components/common/display/StatusChip'; // ✨ Using universal component
import { getDueDateLabel, isTaskOverdue, TASK_TYPES, getTaskStatusColor } from '../models/onboardingModels';

const TaskCard = ({ task, onClick }) => {
  if (!task) return null;

  const overdue = isTaskOverdue(task);
  const isCompleted = task.status === 'Completed';
  const statusColors = getTaskStatusColor(task.status, overdue); // Get colors from model
  
  const getTaskIcon = () => {
    if (isCompleted) {
      return <CompletedIcon sx={{ color: '#4caf50', fontSize: 28 }} />;
    }
    
    switch (task.taskType) {
      case TASK_TYPES.INPUT:
        return <InputIcon sx={{ color: '#667eea', fontSize: 28 }} />;
      case TASK_TYPES.ACKNOWLEDGMENT:
        return <AcknowledgeIcon sx={{ color: '#667eea', fontSize: 28 }} />;
      case TASK_TYPES.UPLOAD:
        return <UploadIcon sx={{ color: '#667eea', fontSize: 28 }} />;
      default:
        return null;
    }
  };

  const getButtonText = () => {
    if (isCompleted) return 'View';
    if (task.taskType === TASK_TYPES.UPLOAD) return 'Upload';
    return 'Complete';
  };

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        transition: 'all 0.2s ease',
        cursor: isCompleted ? 'default' : 'pointer',
        opacity: isCompleted ? 0.8 : 1,
        '&:hover': isCompleted ? {} : {
          transform: 'translateY(-2px)',
          boxShadow: 4
        },
        border: overdue ? '2px solid #f44336' : '1px solid #e0e0e0'
      }}
      onClick={() => !isCompleted && onClick && onClick(task)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
            {getTaskIcon()}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 0.5 }}>
                {task.taskName}
              </Typography>
              {task.taskDescription && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  {task.taskDescription}
                </Typography>
              )}
            </Box>
          </Box>
          {/* ✨ Using universal StatusChip */}
          <StatusChip 
            status={overdue ? 'Overdue' : task.status}
            colorScheme={statusColors}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <TimeIcon sx={{ fontSize: 16, color: overdue ? '#f44336' : '#666' }} />
          <Typography
            variant="caption"
            sx={{
              color: overdue ? '#f44336' : '#666',
              fontWeight: overdue ? 600 : 400
            }}
          >
            {getDueDateLabel(task)}
          </Typography>
          
          {task.taskType && (
            <Chip
              label={task.taskType}
              size="small"
              variant="outlined"
              sx={{ ml: 'auto', fontSize: '0.7rem' }}
            />
          )}
        </Box>
      </CardContent>

      {!isCompleted && (
        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(task);
            }}
            sx={{
              backgroundColor: overdue ? '#f44336' : '#f59e42',
              '&:hover': {
                backgroundColor: overdue ? '#d32f2f' : '#e08a2e'
              },
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {getButtonText()}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default TaskCard;