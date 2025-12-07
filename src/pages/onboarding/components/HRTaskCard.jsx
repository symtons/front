// src/pages/onboarding/components/HRTaskCard.jsx
/**
 * HR Task Card Component
 * Read-only view for HR to see employee task submissions
 * Shows download links for uploads, view-only for text inputs
 */

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import {
  CheckCircle as CompletedIcon,
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Assignment as TaskIcon,
  CloudUpload as UploadIcon,
  Edit as InputIcon,
  CheckBox as AcknowledgeIcon
} from '@mui/icons-material';
import StatusChip from '../../../components/common/display/StatusChip';
import { getDueDateLabel, isTaskOverdue, TASK_TYPES, getTaskStatusColor } from '../models/onboardingModels';

const HRTaskCard = ({ task, onDownload }) => {
  if (!task) return null;

  const overdue = isTaskOverdue(task);
  const isCompleted = task.status === 'Completed';
  const statusColors = getTaskStatusColor(task.status, overdue);
  
  const getTaskIcon = () => {
    switch (task.taskType) {
      case TASK_TYPES.INPUT:
        return <InputIcon sx={{ color: isCompleted ? '#4caf50' : '#667eea', fontSize: 28 }} />;
      case TASK_TYPES.ACKNOWLEDGMENT:
        return <AcknowledgeIcon sx={{ color: isCompleted ? '#4caf50' : '#667eea', fontSize: 28 }} />;
      case TASK_TYPES.UPLOAD:
        return <UploadIcon sx={{ color: isCompleted ? '#4caf50' : '#667eea', fontSize: 28 }} />;
      default:
        return <TaskIcon sx={{ color: '#667eea', fontSize: 28 }} />;
    }
  };

  const handleDownloadClick = () => {
    if (onDownload) {
      onDownload(task);
    }
  };

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        border: overdue ? '2px solid #f44336' : isCompleted ? '2px solid #4caf50' : '1px solid #e0e0e0',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        {/* Header: Icon + Title + Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
            {getTaskIcon()}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 0.5 }}>
                {task.taskName}
              </Typography>
              {task.taskDescription && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 1 }}>
                  {task.taskDescription}
                </Typography>
              )}
            </Box>
          </Box>
          <StatusChip 
            status={overdue ? 'Overdue' : isCompleted ? 'Completed' : 'Pending'}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Task Details */}
        <Box sx={{ mb: 2 }}>
          {/* Task Type */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
              Type:
            </Typography>
            <Chip 
              label={task.taskType} 
              size="small" 
              sx={{ 
                height: 20, 
                fontSize: '0.7rem',
                backgroundColor: '#e3f2fd',
                color: '#1976d2'
              }} 
            />
          </Box>

          {/* Due Date */}
          {task.dueDate && (
            <Typography variant="caption" color="text.secondary" display="block">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Typography>
          )}

          {/* Completion Date */}
          {isCompleted && task.completedDate && (
            <Typography variant="caption" color="success.main" display="block">
              ✓ Completed: {new Date(task.completedDate).toLocaleDateString()}
            </Typography>
          )}
        </Box>

        {/* UPLOAD TYPE - Show Download Button */}
        {task.taskType === TASK_TYPES.UPLOAD && isCompleted && task.documentPath && (
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#f1f8f4', 
            borderRadius: 2,
            border: '1px solid #c8e6c9'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Uploaded File:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                  📄 {task.documentOriginalName || 'Document'}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadClick}
                sx={{
                  backgroundColor: '#4caf50',
                  '&:hover': { backgroundColor: '#45a049' }
                }}
              >
                Download
              </Button>
            </Box>
          </Box>
        )}

        {/* UPLOAD TYPE - Pending */}
        {task.taskType === TASK_TYPES.UPLOAD && !isCompleted && (
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#fff3e0', 
            borderRadius: 2,
            border: '1px solid #ffe0b2',
            textAlign: 'center'
          }}>
            <Typography variant="caption" color="text.secondary">
              ⏳ Awaiting employee upload
            </Typography>
          </Box>
        )}

        {/* TEXT INPUT TYPE - Show Submitted Data */}
        {task.taskType === TASK_TYPES.INPUT && isCompleted && task.submittedData && (
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#e8f5e9', 
            borderRadius: 2,
            border: '1px solid #c8e6c9'
          }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              Submitted Response:
            </Typography>
            <Typography variant="body2" sx={{ 
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: '#2e7d32',
              fontFamily: 'monospace',
              fontSize: '0.85rem'
            }}>
              {task.submittedData}
            </Typography>
          </Box>
        )}

        {/* ACKNOWLEDGMENT TYPE - Show Status */}
        {task.taskType === TASK_TYPES.ACKNOWLEDGMENT && isCompleted && (
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#e8f5e9', 
            borderRadius: 2,
            border: '1px solid #c8e6c9',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600 }}>
              Employee has acknowledged
            </Typography>
          </Box>
        )}

        {/* Notes */}
        {task.notes && (
          <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              Notes:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
              {task.notes}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default HRTaskCard;