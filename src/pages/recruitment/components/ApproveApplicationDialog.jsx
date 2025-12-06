// Simple Approve Dialog Component
// Location: src/pages/recruitment/components/ApproveApplicationDialog.jsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import applicationReviewService from '../../../services/applicationReviewService';

const ApproveApplicationDialog = ({ open, onClose, application, onApproveSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate the email that will be created
  const generateEmail = () => {
    if (!application) return '';
    const firstName = application.firstName?.trim().toLowerCase() || '';
    const lastInitial = application.lastName?.trim().toLowerCase().charAt(0) || 'x';
    return `${firstName}${lastInitial}@tennesseepersonalassistance.org`;
  };

  const handleApprove = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await applicationReviewService.approveApplication(application.applicationId);
      
      console.log('Approval response:', response);
      
      // Call success callback
      if (onApproveSuccess) {
        onApproveSuccess();
      }
      
      onClose();
    } catch (err) {
      console.error('Error approving application:', err);
      setError(err.message || 'Failed to approve application');
    } finally {
      setLoading(false);
    }
  };

  if (!application) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CheckCircleIcon sx={{ color: '#6AB4A8' }} />
          <span>Approve Application</span>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to approve this application?
          </Typography>

          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Applicant Details
            </Typography>
            <Typography variant="body2">
              <strong>Name:</strong> {application.firstName} {application.lastName}
            </Typography>
            <Typography variant="body2">
              <strong>Position:</strong> {application.positionAppliedFor || 'N/A'}
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>A user account will be created with:</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              • Email: {generateEmail()}
            </Typography>
            <Typography variant="body2">
              • Role: Field Operator
            </Typography>
            <Typography variant="body2">
              • Default Password: (system generated)
            </Typography>
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ color: 'text.secondary' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleApprove}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: '#6AB4A8',
            '&:hover': { bgcolor: '#5a9d91' }
          }}
          startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
        >
          {loading ? 'Approving...' : 'Approve Application'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApproveApplicationDialog;