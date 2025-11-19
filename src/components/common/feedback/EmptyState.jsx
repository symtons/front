// src/components/common/feedback/EmptyState.jsx
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import {
  Inbox as InboxIcon,
  SearchOff as SearchIcon,
  ErrorOutline as ErrorIcon,
  Info as InfoIcon,
  FolderOpen as FolderIcon
} from '@mui/icons-material';

/**
 * Universal EmptyState Component
 * Displays friendly message when no data is available
 * 
 * @param {string} icon - Icon type (inbox, search, error, info, folder, custom)
 * @param {ReactNode} customIcon - Custom icon component
 * @param {string} title - Main title
 * @param {string} message - Description message
 * @param {Object} actionButton - Action button config: { label, onClick, icon, color }
 * @param {string} variant - Display variant (default, paper, minimal)
 * @param {Object} sx - Custom styling
 */
const EmptyState = ({
  icon = 'inbox',
  customIcon,
  title = 'No Data Available',
  message = 'There is nothing to display at the moment.',
  actionButton,
  variant = 'default',
  sx = {}
}) => {
  // Get icon component
  const getIcon = () => {
    if (customIcon) {
      return customIcon;
    }

    const iconProps = {
      sx: {
        fontSize: 80,
        color: '#cbd5e0',
        mb: 2
      }
    };

    switch (icon) {
      case 'search':
        return <SearchIcon {...iconProps} />;
      case 'error':
        return <ErrorIcon {...iconProps} />;
      case 'info':
        return <InfoIcon {...iconProps} />;
      case 'folder':
        return <FolderIcon {...iconProps} />;
      case 'inbox':
      default:
        return <InboxIcon {...iconProps} />;
    }
  };

  // Content component
  const Content = () => (
    <Box
      sx={{
        textAlign: 'center',
        py: 6,
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
        ...sx
      }}
    >
      {/* Icon */}
      {getIcon()}

      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: '#2c3e50',
          mb: 1
        }}
      >
        {title}
      </Typography>

      {/* Message */}
      <Typography
        variant="body2"
        sx={{
          color: '#718096',
          maxWidth: 400,
          mb: actionButton ? 3 : 0
        }}
      >
        {message}
      </Typography>

      {/* Action Button */}
      {actionButton && (
        <Button
          variant="contained"
          onClick={actionButton.onClick}
          startIcon={actionButton.icon}
          sx={{
            backgroundColor: actionButton.color || '#5B8FCC',
            color: '#fff',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            '&:hover': {
              backgroundColor: actionButton.color || '#5B8FCC',
              filter: 'brightness(0.9)'
            }
          }}
        >
          {actionButton.label}
        </Button>
      )}
    </Box>
  );

  // Render based on variant
  if (variant === 'paper') {
    return (
      <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
        <Content />
      </Paper>
    );
  }

  if (variant === 'minimal') {
    return (
      <Box sx={{ py: 4, px: 2 }}>
        <Content />
      </Box>
    );
  }

  // Default variant
  return <Content />;
};

export default EmptyState;