import React from 'react';
import { Box, Paper, IconButton, Tooltip } from '@mui/material';
import { FilterList as FilterIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const FilterBar = ({ 
  children, 
  onClear, 
  onRefresh,
  showClearButton = true,
  showRefreshButton = true
}) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        {children}
        
        {showClearButton && onClear && (
          <Tooltip title="Clear Filters">
            <IconButton onClick={onClear} color="primary">
              <FilterIcon />
            </IconButton>
          </Tooltip>
        )}

        {showRefreshButton && onRefresh && (
          <Tooltip title="Refresh">
            <IconButton onClick={onRefresh} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Paper>
  );
};

export default FilterBar;