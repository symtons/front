// src/pages/recruitment/components/ApplicationFormHeader.jsx
/**
 * ApplicationFormHeader Component
 * 
 * Branded header for the public job application page
 * Similar to Login page header but horizontal layout
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Work as JobIcon } from '@mui/icons-material';

const ApplicationFormHeader = ({ 
  title = "Job Application",
  subtitle = "Join our team at Tennessee Personal Assistance"
}) => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        p: 4,
        borderRadius: '16px 16px 0 0',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}
    >
      {/* Background Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          zIndex: 0
        }}
      />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Logo Container */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '50%',
            width: 80,
            height: 80,
            mb: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          <JobIcon sx={{ fontSize: 40, color: '#667eea' }} />
        </Box>

        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: '1.75rem', sm: '2.5rem' }
          }}
        >
          {title}
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h6"
          sx={{
            opacity: 0.95,
            fontWeight: 400,
            maxWidth: 600,
            margin: '0 auto',
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          {subtitle}
        </Typography>

        {/* Divider Line */}
        <Box
          sx={{
            width: 60,
            height: 3,
            backgroundColor: '#FDB94E',
            margin: '16px auto 0',
            borderRadius: 2
          }}
        />
      </Box>
    </Box>
  );
};

export default ApplicationFormHeader;