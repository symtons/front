// src/components/common/display/InfoCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Button,
  IconButton,
  Chip
} from '@mui/material';
import {
  Info as InfoIcon,
  KeyboardArrowRight as ArrowIcon
} from '@mui/icons-material';

/**
 * Universal InfoCard Component
 * Reusable card for displaying information with icon, title, and data
 * 
 * @param {ReactNode} icon - Icon component
 * @param {string} title - Card title
 * @param {string} subtitle - Optional subtitle
 * @param {Array} data - Array of data items: [{ label, value, color, bold, icon }]
 * @param {Object} actionButton - Action button config: { label, onClick, icon, color }
 * @param {string} color - Card accent color (TPA colors: blue, teal, gold)
 * @param {ReactNode} children - Custom content
 * @param {boolean} elevated - Show elevation/shadow
 * @param {ReactNode} headerAction - Action in header (icon button, chip, etc.)
 * @param {Object} sx - Custom styling
 */
const InfoCard = ({
  icon: IconComponent,
  title,
  subtitle,
  data = [],
  actionButton,
  color = 'blue',
  children,
  elevated = true,
  headerAction,
  sx = {}
}) => {
  // Color palette (TPA brand colors)
  const colors = {
    blue: {
      main: '#5B8FCC',
      light: '#E8F4F8',
      border: '#B3E0ED'
    },
    teal: {
      main: '#6AB4A8',
      light: '#E8F5F3',
      border: '#B3DED7'
    },
    gold: {
      main: '#FDB94E',
      light: '#FFF4E6',
      border: '#FFE0B3'
    },
    gray: {
      main: '#34495e',
      light: '#ecf0f1',
      border: '#bdc3c7'
    }
  };

  const selectedColor = colors[color] || colors.blue;

  return (
    <Card
      elevation={elevated ? 3 : 0}
      sx={{
        borderRadius: 2,
        border: elevated ? 'none' : `1px solid ${selectedColor.border}`,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': elevated ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
        } : {},
        ...sx
      }}
    >
      {/* Header */}
      {(title || IconComponent) && (
        <>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${selectedColor.main} 0%, ${selectedColor.main}dd 100%)`,
              color: '#fff',
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {IconComponent && (
                <Box
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 1.5,
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconComponent sx={{ fontSize: 28 }} />
                </Box>
              )}
              <Box>
                {title && (
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: subtitle ? 0.5 : 0 }}>
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Header Action (e.g., icon button, chip) */}
            {headerAction && (
              <Box>{headerAction}</Box>
            )}
          </Box>
        </>
      )}

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Data Items */}
        {data.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.map((item, index) => (
              <Box key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  {/* Label */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.icon && (
                      <Box sx={{ color: item.color || 'text.secondary' }}>
                        {item.icon}
                      </Box>
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>

                  {/* Value */}
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: item.bold ? 600 : 400,
                      color: item.color || '#2c3e50',
                      fontSize: item.bold ? '1.1rem' : '1rem'
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>

                {/* Divider between items (except last) */}
                {index < data.length - 1 && (
                  <Divider sx={{ mt: 2 }} />
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Custom Children Content */}
        {children}
      </CardContent>

      {/* Action Button */}
      {actionButton && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={actionButton.onClick}
              startIcon={actionButton.icon}
              sx={{
                backgroundColor: selectedColor.main,
                color: '#fff',
                fontWeight: 600,
                py: 1.5,
                '&:hover': {
                  backgroundColor: selectedColor.main,
                  filter: 'brightness(0.9)'
                }
              }}
            >
              {actionButton.label}
            </Button>
          </Box>
        </>
      )}
    </Card>
  );
};

export default InfoCard;