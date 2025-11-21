// src/pages/recruitment/components/ApplicationProgress.jsx
/**
 * ApplicationProgress Component
 * 
 * Step indicator/stepper for multi-step application form
 * Shows current progress through the application process
 */

import React from 'react';
import { Box, Stepper, Step, StepLabel, StepConnector } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  School as ExperienceIcon,
  CheckCircle as ReviewIcon
} from '@mui/icons-material';

// Custom styled connector
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: '#e0e0e0',
    borderTopWidth: 3
  },
  '&.Mui-active .MuiStepConnector-line': {
    borderColor: '#667eea'
  },
  '&.Mui-completed .MuiStepConnector-line': {
    borderColor: '#4caf50'
  }
}));

// Custom step icon
const CustomStepIcon = ({ active, completed, icon }) => {
  const icons = {
    1: <PersonIcon />,
    2: <WorkIcon />,
    3: <ExperienceIcon />,
    4: <ReviewIcon />
  };

  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: completed 
          ? '#4caf50' 
          : active 
          ? '#667eea' 
          : '#e0e0e0',
        color: '#fff',
        fontSize: 20,
        fontWeight: 600,
        transition: 'all 0.3s ease',
        boxShadow: active 
          ? '0 4px 12px rgba(102, 126, 234, 0.4)' 
          : completed
          ? '0 4px 12px rgba(76, 175, 80, 0.4)'
          : 'none'
      }}
    >
      {icons[icon]}
    </Box>
  );
};

const ApplicationProgress = ({ activeStep = 0, steps }) => {
  return (
    <Box sx={{ width: '100%', py: 3 }}>
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel 
        connector={<CustomConnector />}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={(props) => (
                <CustomStepIcon {...props} icon={index + 1} />
              )}
              sx={{
                '& .MuiStepLabel-label': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontWeight: activeStep === index ? 600 : 400,
                  color: activeStep === index 
                    ? '#667eea' 
                    : activeStep > index
                    ? '#4caf50'
                    : '#999',
                  mt: 1
                }
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default ApplicationProgress;