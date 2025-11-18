// src/components/common/feedback/CustomModal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const CustomModal = ({ 
  open, 
  onClose, 
  title, 
  subtitle, 
  children, 
  actions,
  size = 'md',
  maxWidth
}) => {
  const sizeMap = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    full: 'xl'
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth || sizeMap[size] || 'md'}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: size === 'full' ? '90vh' : 'auto'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: '#2c3e50' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 3 }}>
        {children}
      </DialogContent>
      
      {actions && (
        <DialogActions sx={{ p: 2 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CustomModal;