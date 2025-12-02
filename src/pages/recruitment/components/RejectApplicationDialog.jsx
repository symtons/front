// CORRECTED: RejectApplicationDialog with proper import
// Location: src/pages/recruitment/components/RejectApplicationDialog.jsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CancelIcon from '@mui/icons-material/Cancel';
import { validateRejectReason } from '../models/applicationReviewModels';
import applicationReviewService from '../../../services/applicationReviewService';  // ✅ FIXED IMPORT

const RejectApplicationDialog = ({ 
  open, 
  onClose, 
  application,
  onRejectSuccess
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReasonChange = (e) => {
    const value = e.target.value;
    setRejectionReason(value);
    
    if (reasonError && value.trim()) {
      setReasonError('');
    }
  };

  const handleCancel = () => {
    if (!loading) {
      setRejectionReason('');
      setReasonError('');
      onClose();
    }
  };

  const handleConfirm = async () => {
    // Validate reason
    const validation = validateRejectReason(rejectionReason);
    if (!validation.isValid) {
      setReasonError(validation.error);
      return;
    }

    setLoading(true);
    setReasonError('');

    try {
      // ✅ CORRECT: Use applicationReviewService.rejectApplication
      await applicationReviewService.rejectApplication(
        application.applicationId, 
        rejectionReason
      );
      
      // Success! Call the success callback to refresh the dashboard
      if (onRejectSuccess) {
        onRejectSuccess();
      }
      
      // Reset and close
      setRejectionReason('');
      onClose();
      
    } catch (error) {
      console.error('Error rejecting application:', error);
      setReasonError(
        error.message || 'Failed to reject application. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!application) return null;

  return (
    <Dialog
      open={open}
      onClose={loading ? null : handleCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          bgcolor: 'error.light',
          color: 'error.dark',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <WarningIcon /> Reject Application
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          You are about to reject this application. Please provide a clear reason
          for the applicant.
        </Alert>

        <Box
          sx={{
            bgcolor: 'grey.100',
            p: 2,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.300',
            mb: 2
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 1 }}
          >
            Application Details:
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Name:</strong> {application?.fullName || 'N/A'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Position:</strong> {application?.positionAppliedFor || 'N/A'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Email:</strong> {application?.email || 'N/A'}
          </Typography>
          <Typography variant="body2">
            <strong>Submitted:</strong> {application?.submittedAtFormatted || 'N/A'}
          </Typography>
        </Box>

        <TextField
          label="Reason for Rejection *"
          multiline
          rows={4}
          fullWidth
          value={rejectionReason}
          onChange={handleReasonChange}
          error={Boolean(reasonError)}
          helperText={
            reasonError ||
            'Provide a clear, professional explanation for the rejection (minimum 10 characters)'
          }
          placeholder="Example: Thank you for your interest. While your qualifications are impressive, we have decided to move forward with other candidates whose experience more closely aligns with our current needs."
          disabled={loading}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading || !rejectionReason.trim()}
          startIcon={loading ? <CircularProgress size={16} /> : <CancelIcon />}
        >
          {loading ? 'Rejecting...' : 'Confirm Rejection'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectApplicationDialog;