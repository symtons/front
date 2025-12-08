// src/pages/leave/components/LeaveRequestCard.jsx
// Individual Leave Request Display Card

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Cancel as CancelIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  EventAvailable as DateIcon,
  Notes as ReasonIcon
} from '@mui/icons-material';
import {
  getStatusColor,
  getLeaveTypeColor,
  formatDateRange,
  formatDaysDisplay,
  getRelativeTime
} from '../models/leaveModels';

/**
 * LeaveRequestCard Component
 * 
 * Displays a single leave request with all details
 * Shows status, dates, approver info, and actions
 * 
 * Props:
 * - request: Leave request object
 * - onCancel: Function to cancel request
 * - onView: Function to view details
 * - showEmployee: Boolean - show employee info (for approver view)
 */

const LeaveRequestCard = ({ 
  request, 
  onCancel, 
  onView,
  showEmployee = false 
}) => {
  
  const statusColor = getStatusColor(request.status);
  const leaveTypeColor = getLeaveTypeColor(request.leaveType);
  
  const handleCancel = (e) => {
    e.stopPropagation();
    if (onCancel) {
      onCancel(request.leaveRequestId);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(request);
    }
  };

  return (
    <Card 
      elevation={2}
      sx={{
        cursor: onView ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': onView ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        } : {},
        borderLeft: `6px solid ${leaveTypeColor}`,
        position: 'relative'
      }}
      onClick={handleView}
    >
      <CardContent>
        {/* Header - Leave Type and Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={request.leaveType}
              size="small"
              sx={{
                backgroundColor: leaveTypeColor,
                color: 'white',
                fontWeight: 600
              }}
            />
            <Chip
              label={request.status}
              size="small"
              sx={{
                backgroundColor: statusColor,
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {request.canCancel && onCancel && (
              <Tooltip title="Cancel Request">
                <IconButton 
                  size="small" 
                  onClick={handleCancel}
                  sx={{ 
                    color: '#f44336',
                    '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                  }}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onView && (
              <Tooltip title="View Details">
                <IconButton size="small" sx={{ color: '#667eea' }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Employee Info (for approver view) */}
        {showEmployee && request.employee && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ color: '#667eea', mr: 1, fontSize: 20 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {request.employee.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {request.employee.jobTitle} • {request.employee.department}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
          </>
        )}

        {/* Dates */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DateIcon sx={{ color: '#6AB4A8', mr: 1, fontSize: 20 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Dates
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {formatDateRange(request.startDate, request.endDate)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDaysDisplay(request.totalDays)}
            </Typography>
          </Box>
        </Box>

        {/* Reason */}
        {request.reason && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <ReasonIcon sx={{ color: '#FDB94E', mr: 1, fontSize: 20, mt: 0.5 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Reason
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontStyle: 'italic',
                  color: 'text.primary'
                }}
              >
                "{request.reason}"
              </Typography>
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Footer Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Requested {getRelativeTime(request.requestedAt)}
          </Typography>
          
          {/* Approval Info */}
          {request.status === 'Approved' && request.approvedBy && (
            <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600 }}>
              ✓ Approved by {request.approvedBy}
            </Typography>
          )}
          
          {request.status === 'Rejected' && (
            <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 600 }}>
              ✗ Rejected
            </Typography>
          )}
          
          {request.status === 'Pending' && (
            <Typography variant="caption" sx={{ color: '#FDB94E', fontWeight: 600 }}>
              ⏳ Awaiting Approval
            </Typography>
          )}
        </Box>

        {/* Rejection Reason */}
        {request.status === 'Rejected' && request.rejectionReason && (
          <Box 
            sx={{ 
              mt: 2, 
              p: 1.5, 
              backgroundColor: '#ffebee',
              borderRadius: 1,
              borderLeft: '4px solid #f44336'
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Rejection Reason:
            </Typography>
            <Typography variant="caption" color="error">
              {request.rejectionReason}
            </Typography>
          </Box>
        )}

        {/* Approval Notes */}
        {request.status === 'Approved' && request.approvalNotes && (
          <Box 
            sx={{ 
              mt: 2, 
              p: 1.5, 
              backgroundColor: '#e8f5e9',
              borderRadius: 1,
              borderLeft: '4px solid #4caf50'
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Approval Notes:
            </Typography>
            <Typography variant="caption" sx={{ color: '#2e7d32' }}>
              {request.approvalNotes}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveRequestCard;