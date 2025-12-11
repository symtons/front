// src/components/common/layout/PageHeader.jsx
import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';

/**
 * PageHeader Component
 * Reusable header that displays at the top of each page with contextual information
 * Updated with TPA brand colors
 * 
 * FIXED: Added support for 'actions' prop (plural) to allow multiple action buttons
 */
const PageHeader = ({
  icon: IconComponent,
  title,
  subtitle,
  chips = [],
  actionButton,  // Legacy support - single button object with {onClick, icon, label}
  actions,       // NEW - accepts React element with multiple buttons
  backgroundColor = 'linear-gradient(135deg, #5B8FCC 0%, #4A73A6 100%)', // TPA Blue gradient
  error
}) => {
  return (
    <Box
      sx={{
        background: backgroundColor,
        borderRadius: 2,
        p: 4,
        mb: 3,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Header Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Title Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {IconComponent && (
              <Box
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 2,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconComponent sx={{ fontSize: 32, color: '#fff' }} />
              </Box>
            )}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  mb: subtitle ? 0.5 : 0
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1rem'
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Action Area - NEW: Support both single actionButton and multiple actions */}
          {actions && (
            <Box>
              {actions}
            </Box>
          )}
          
          {/* Legacy Action Button Support - kept for backward compatibility */}
          {!actions && actionButton && (
            <Button
              variant="contained"
              onClick={actionButton.onClick}
              startIcon={actionButton.icon}
              sx={{
                backgroundColor: '#6AB4A8', // TPA teal/green
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                boxShadow: '0 2px 8px rgba(106, 180, 168, 0.3)',
                '&:hover': {
                  backgroundColor: '#559089', // Darker teal
                  boxShadow: '0 4px 12px rgba(106, 180, 168, 0.4)',
                }
              }}
            >
              {actionButton.label}
            </Button>
          )}
        </Box>

        {/* Chips */}
        {chips && chips.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            {chips.map((chip, index) => (
              <Chip
                key={index}
                icon={chip.icon}
                label={chip.label}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '& .MuiChip-icon': {
                    color: '#fff'
                  }
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Decorative Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.5
        }}
      />
    </Box>
  );
};

export default PageHeader;