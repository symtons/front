// src/pages/recruitment/components/RejectApplicationDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  Cancel as RejectIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { validateRejectReason } from '../models/applicationReviewModels';

const RejectApplicationDialog = ({
  open,
  onClose,
  onConfirm,
  application,
  loading = false
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const handleReasonChange = (e) => {
    setRejectionReason(e.target.value);
    setReasonError('');
  };

  const handleConfirm = () => {
    const validation = validateRejectReason(rejectionReason);
    
    if (!validation.isValid) {
      setReasonError(validation.error);
      return;
    }

    onConfirm(rejectionReason.trim());
  };

  const handleCancel = () => {
    setRejectionReason('');
    setReasonError('');
    onClose();
  };

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
            <strong>Name:</strong> {application?.fullName}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Position:</strong> {application?.positionAppliedFor}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Email:</strong> {application?.email}
          </Typography>
          <Typography variant="body2">
            <strong>Submitted:</strong> {application?.submittedAtFormatted}
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
          startIcon={loading ? <CircularProgress size={16} /> : <RejectIcon />}
        >
          {loading ? 'Rejecting...' : 'Confirm Rejection'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectApplicationDialog;