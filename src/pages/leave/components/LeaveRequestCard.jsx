// src/pages/leave/components/LeaveRequestCard.jsx
// Individual Leave Request Display Card

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Avatar,
  Grid
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Description as ReasonIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon
} from '@mui/icons-material';
import {
  formatDateRange,
  formatRelativeTime,
  getStatusVariant,
  getStatusIcon,
  getLeaveTypeColor,
  getLeaveTypeIcon
} from '../models/leaveModels';

/**
 * LeaveRequestCard Component
 * 
 * Displays a single leave request with all details
 * Supports different views: employee view, manager view
 * 
 * Props:
 * - request: Leave request object
 * - viewMode: 'employee' | 'manager' | 'admin'
 * - onCancel: Function to cancel request
 * - onEdit: Function to edit request
 * - onView: Function to view details
 * - onApprove: Function to approve (manager/admin only)
 * - onReject: Function to reject (manager/admin only)
 * - showEmployee: Show employee name (for manager view)
 */

const LeaveRequestCard = ({
  request,
  viewMode = 'employee',
  onCancel,
  onEdit,
  onView,
  onApprove,
  onReject,
  showEmployee = false
}) => {

  const {
    leaveRequestId,
    employeeName,
    leaveTypeName,
    startDate,
    endDate,
    totalDays,
    reason,
    status,
    requestedAt,
    approverName,
    approvedAt,
    rejectionReason
  } = request;

  const statusColor = getStatusVariant(status);
  const leaveTypeColor = getLeaveTypeColor(leaveTypeName);
  const statusEmoji = getStatusIcon(status);
  const leaveTypeEmoji = getLeaveTypeIcon(leaveTypeName);

  // Can cancel if status is Pending
  const canCancel = status === 'Pending' && onCancel;
  
  // Can edit if status is Pending
  const canEdit = status === 'Pending' && onEdit;

  // Show approval buttons for manager/admin view on pending requests
  const showApprovalButtons = viewMode !== 'employee' && status === 'Pending';

  return (
    <Card sx={{ 
      mb: 2,
      border: status === 'Pending' ? '2px solid #ff9800' : '1px solid #e0e0e0',
      '&:hover': {
        boxShadow: 3,
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease'
      }
    }}>
      <CardContent>
        {/* Header Row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          {/* Leave Type Badge */}
          <Avatar sx={{ 
            bgcolor: leaveTypeColor,
            width: 48,
            height: 48,
            mr: 2,
            fontSize: '1.5rem'
          }}>
            {leaveTypeEmoji}
          </Avatar>

          {/* Title and Status */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {leaveTypeName}
              </Typography>
              <Chip 
                label={`${statusEmoji} ${status}`}
                color={statusColor}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            
            {/* Employee Name (Manager View) */}
            {showEmployee && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {employeeName}
                </Typography>
              </Box>
            )}

            {/* Request Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Requested {formatRelativeTime(requestedAt)}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {onView && (
              <Tooltip title="View Details">
                <IconButton size="small" onClick={() => onView(request)}>
                  <ViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            {canEdit && (
              <Tooltip title="Edit Request">
                <IconButton size="small" onClick={() => onEdit(request)} color="primary">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            {canCancel && (
              <Tooltip title="Cancel Request">
                <IconButton size="small" onClick={() => onCancel(request)} color="error">
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Date Range and Duration */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Leave Period
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {formatDateRange(startDate, endDate)}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ 
              textAlign: { xs: 'left', sm: 'right' },
              bgcolor: 'primary.light',
              p: 1,
              borderRadius: 1
            }}>
              <Typography variant="body2" color="primary.dark" sx={{ fontSize: '0.75rem' }}>
                Duration
              </Typography>
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                {totalDays} {totalDays === 1 ? 'Day' : 'Days'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Reason */}
        {reason && (
          <Box sx={{ 
            bgcolor: 'grey.50',
            p: 1.5,
            borderRadius: 1,
            mb: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <ReasonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Reason
              </Typography>
            </Box>
            <Typography variant="body2">
              {reason}
            </Typography>
          </Box>
        )}

        {/* Approval Status Details */}
        {(status === 'Approved' || status === 'Rejected') && (
          <Box sx={{ 
            bgcolor: status === 'Approved' ? 'success.light' : 'error.light',
            p: 1.5,
            borderRadius: 1,
            mb: 2
          }}>
            <Typography variant="caption" sx={{ 
              color: status === 'Approved' ? 'success.dark' : 'error.dark',
              fontWeight: 600 
            }}>
              {status === 'Approved' ? '✓ Approved' : '✗ Rejected'} by {approverName}
            </Typography>
            {approvedAt && (
              <Typography variant="caption" sx={{ 
                color: status === 'Approved' ? 'success.dark' : 'error.dark',
                display: 'block',
                mt: 0.5
              }}>
                on {formatRelativeTime(approvedAt)}
              </Typography>
            )}
            {rejectionReason && (
              <Typography variant="body2" sx={{ mt: 1, color: 'error.dark' }}>
                <strong>Reason:</strong> {rejectionReason}
              </Typography>
            )}
          </Box>
        )}

        {/* Approval Action Buttons (Manager/Admin View) */}
        {showApprovalButtons && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Approve Request">
                <IconButton 
                  onClick={() => onApprove(request)}
                  sx={{ 
                    flex: 1,
                    bgcolor: 'success.light',
                    color: 'success.dark',
                    '&:hover': { bgcolor: 'success.main', color: 'white' },
                    borderRadius: 2,
                    py: 1
                  }}
                >
                  <ApproveIcon sx={{ mr: 1 }} />
                  <Typography variant="button">Approve</Typography>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Reject Request">
                <IconButton 
                  onClick={() => onReject(request)}
                  sx={{ 
                    flex: 1,
                    bgcolor: 'error.light',
                    color: 'error.dark',
                    '&:hover': { bgcolor: 'error.main', color: 'white' },
                    borderRadius: 2,
                    py: 1
                  }}
                >
                  <RejectIcon sx={{ mr: 1 }} />
                  <Typography variant="button">Reject</Typography>
                </IconButton>
              </Tooltip>
            </Box>
          </>
        )}

        {/* Request ID (Small footer) */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'right' }}>
          Request #LR-{String(leaveRequestId).padStart(5, '0')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestCard;