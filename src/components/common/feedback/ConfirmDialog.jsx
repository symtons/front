// src/components/common/feedback/ConfirmDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  variant = 'info',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  const getIconAndColor = () => {
    switch (variant) {
      case 'success':
        return { icon: <SuccessIcon />, color: 'success.light', textColor: 'success.dark' };
      case 'error':
        return { icon: <ErrorIcon />, color: 'error.light', textColor: 'error.dark' };
      case 'warning':
        return { icon: <WarningIcon />, color: 'warning.light', textColor: 'warning.dark' };
      case 'info':
      default:
        return { icon: <InfoIcon />, color: 'info.light', textColor: 'info.dark' };
    }
  };

  const { icon, color, textColor } = getIconAndColor();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: color,
          color: textColor,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        {icon} {title}
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>{cancelText}</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={variant === 'error' ? 'error' : variant === 'success' ? 'success' : 'primary'}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;