import React from 'react';
import { Chip } from '@mui/material';

const StatusChip = ({ status, colorMap, label }) => {
  const defaultColorMap = {
    'Active': 'success',
    'Inactive': 'default',
    'Pending': 'warning',
    'Approved': 'success',
    'Rejected': 'error',
    'OnLeave': 'warning',
    'Terminated': 'error',
    'Completed': 'success',
    'InProgress': 'info',
  };

  const colors = colorMap || defaultColorMap;
  const color = colors[status] || 'default';
  const displayLabel = label || status;

  return (
    <Chip
      label={displayLabel}
      color={color}
      size="small"
      sx={{ fontWeight: 500 }}
    />
  );
};

export default StatusChip;