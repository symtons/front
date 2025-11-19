// src/pages/leave/components/ApprovalActionButtons.jsx
// Approval/Rejection Action Buttons with Confirmation

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

/**
 * ApprovalActionButtons Component
 * 
 * Provides Approve/Reject buttons with confirmation dialogs
 * Handles rejection reason input
 * Shows loading states
 * 
 * Props:
 * - request: Leave request object
 * - onApprove: Function to approve request
 * - onReject: Function to reject request (receives rejectionReason)
 * - loading: boolean
 * - disabled: boolean
 * - layout: 'horizontal' | 'vertical' | 'compact'
 */

const ApprovalActionButtons = ({
  request,
  onApprove,
  onReject,
  loading = false,
  disabled = false,
  layout = 'horizontal'
}) => {

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  // Handle Approve Click
  const handleApproveClick = () => {
    setApproveDialogOpen(true);
  };

  // Confirm Approve
  const handleApproveConfirm = () => {
    setApproveDialogOpen(false);
    onApprove(request);
  };

  // Handle Reject Click
  const handleRejectClick = () => {
    setRejectDialogOpen(true);
    setRejectionReason('');
    setReasonError('');
  };

  // Confirm Reject
  const handleRejectConfirm = () => {
    // Validate rejection reason
    if (!rejectionReason.trim()) {
      setReasonError('Please provide a reason for rejection');
      return;
    }

    if (rejectionReason.trim().length < 10) {
      setReasonError('Please provide a more detailed reason (at least 10 characters)');
      return;
    }

    setRejectDialogOpen(false);
    onReject(request, rejectionReason.trim());
    setRejectionReason('');
  };

  // Cancel dialogs
  const handleCancel = () => {
    setApproveDialogOpen(false);
    setRejectDialogOpen(false);
    setRejectionReason('');
    setReasonError('');
  };

  // Button styling based on layout
  const getButtonProps = (action) => {
    const baseProps = {
      disabled: disabled || loading,
      variant: 'contained',
      size: layout === 'compact' ? 'small' : 'medium',
      startIcon: loading ? <CircularProgress size={16} /> : null
    };

    if (action === 'approve') {
      return {
        ...baseProps,
        color: 'success',
        startIcon: loading ? <CircularProgress size={16} /> : <ApproveIcon />,
      };
    }

    return {
      ...baseProps,
      color: 'error',
      startIcon: loading ? <CircularProgress size={16} /> : <RejectIcon />,
    };
  };

  // Layout styles
  const getContainerStyle = () => {
    switch (layout) {
      case 'vertical':
        return { display: 'flex', flexDirection: 'column', gap: 1, width: '100%' };
      case 'compact':
        return { display: 'flex', gap: 0.5 };
      default: // horizontal
        return { display: 'flex', gap: 1.5 };
    }
  };

  return (
    <>
      {/* Action Buttons */}
      <Box sx={getContainerStyle()}>
        <Button
          {...getButtonProps('approve')}
          onClick={handleApproveClick}
          sx={{ flex: layout === 'vertical' ? 1 : undefined }}
        >
          {layout === 'compact' ? 'Approve' : 'Approve Request'}
        </Button>

        <Button
          {...getButtonProps('reject')}
          onClick={handleRejectClick}
          sx={{ flex: layout === 'vertical' ? 1 : undefined }}
        >
          {layout === 'compact' ? 'Reject' : 'Reject Request'}
        </Button>
      </Box>

      {/* Approve Confirmation Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'success.light', 
          color: 'success.dark',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <ApproveIcon /> Approve Leave Request
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            You are about to approve this leave request. This action will:
          </Alert>
          
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Grant approval for the leave period
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Update the leave calendar
            </Typography>
            {request.isPaidLeave && (
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Deduct {request.totalDays} days from PTO balance
              </Typography>
            )}
            <Typography component="li" variant="body2">
              Send notification to the employee
            </Typography>
          </Box>

          <Box sx={{ 
            bgcolor: 'grey.100', 
            p: 2, 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.300'
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Request Details:
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Employee:</strong> {request.employeeName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Type:</strong> {request.leaveTypeName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Duration:</strong> {request.totalDays} days
            </Typography>
            <Typography variant="body2">
              <strong>Period:</strong> {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleApproveConfirm}
            variant="contained"
            color="success"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <ApproveIcon />}
          >
            {loading ? 'Approving...' : 'Confirm Approval'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'error.light', 
          color: 'error.dark',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <WarningIcon /> Reject Leave Request
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            You are about to reject this leave request. Please provide a clear reason for the employee.
          </Alert>

          <Box sx={{ 
            bgcolor: 'grey.100', 
            p: 2, 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.300',
            mb: 2
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Request Details:
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Employee:</strong> {request.employeeName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Type:</strong> {request.leaveTypeName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Duration:</strong> {request.totalDays} days
            </Typography>
            <Typography variant="body2">
              <strong>Period:</strong> {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
            </Typography>
          </Box>

          <TextField
            label="Reason for Rejection *"
            multiline
            rows={4}
            fullWidth
            value={rejectionReason}
            onChange={(e) => {
              setRejectionReason(e.target.value);
              setReasonError('');
            }}
            error={Boolean(reasonError)}
            helperText={reasonError || 'Provide a clear, professional explanation for the rejection (minimum 10 characters)'}
            placeholder="Example: Due to staffing requirements during this period, we cannot approve this leave. Please consider rescheduling to a less busy time."
            disabled={loading}
          />
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleRejectConfirm}
            variant="contained"
            color="error"
            disabled={loading || !rejectionReason.trim()}
            startIcon={loading ? <CircularProgress size={16} /> : <RejectIcon />}
          >
            {loading ? 'Rejecting...' : 'Confirm Rejection'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApprovalActionButtons;