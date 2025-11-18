// src/components/common/layout/PageHeader.jsx
import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';

/**
 * PageHeader Component
 * Reusable header that displays at the top of each page with contextual information
 * Updated with TPA brand colors
 */
const PageHeader = ({
  icon: IconComponent,
  title,
  subtitle,
  chips = [],
  actionButton,
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

          {/* Action Button */}
          {actionButton && (
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

        {/* Info Chips */}
        {chips && chips.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {chips.map((chip, index) => (
              <Chip
                key={index}
                icon={chip.icon}
                label={chip.label}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  py: 2.5,
                  px: 1,
                  '& .MuiChip-icon': {
                    color: '#FDB94E' // TPA yellow/gold for icons
                  }
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Decorative Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          zIndex: 0
        }}
      />

      {/* Error Message Below Header */}
      {error && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#f44336'
            }}
          />
          <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>
            {error}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;