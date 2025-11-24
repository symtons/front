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
  // Color palette (TPA brand colors - enhanced gradients)
  const colors = {
    blue: {
      main: '#4A90E2',
      secondary: '#357ABD',
      light: '#E3F2FD',
      border: '#90CAF9',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    teal: {
      main: '#26A69A',
      secondary: '#00897B',
      light: '#E0F2F1',
      border: '#80CBC4',
      gradient: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)'
    },
    gold: {
      main: '#FFA726',
      secondary: '#FB8C00',
      light: '#FFF3E0',
      border: '#FFB74D',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    gray: {
      main: '#546E7A',
      secondary: '#37474F',
      light: '#ECEFF1',
      border: '#90A4AE',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
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
              background: selectedColor.gradient,
              color: '#fff',
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)',
                pointerEvents: 'none'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, position: 'relative', zIndex: 1 }}>
              {IconComponent && (
                <Box
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <IconComponent sx={{ fontSize: 32 }} />
                </Box>
              )}
              <Box>
                {title && (
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: subtitle ? 0.5 : 0, fontSize: '1.15rem' }}>
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography variant="body2" sx={{ opacity: 0.95, fontSize: '0.875rem' }}>
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Header Action (e.g., icon button, chip) */}
            {headerAction && (
              <Box sx={{ position: 'relative', zIndex: 1 }}>{headerAction}</Box>
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
                      fontWeight: item.bold ? 700 : 400,
                      color: item.color || selectedColor.main,
                      fontSize: item.bold ? '2rem' : '1rem',
                      lineHeight: 1
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