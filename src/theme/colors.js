// src/theme/colors.js
// TPA Brand Colors - Extracted from logo and design system

export const TPA_COLORS = {
  // Primary Brand Colors
  primary: {
    main: '#5B8FCC',      // Main blue from header
    light: '#7BA8D9',     // Lighter shade
    dark: '#4A73A6',      // Darker shade
    gradient: 'linear-gradient(135deg, #5B8FCC 0%, #4A73A6 100%)'
  },
  
  // Secondary/Accent Colors
  secondary: {
    main: '#6AB4A8',      // Teal/green accent
    light: '#8AC7BE',     // Lighter teal
    dark: '#559089',      // Darker teal
    gradient: 'linear-gradient(135deg, #6AB4A8 0%, #559089 100%)'
  },
  
  // Accent Colors
  accent: {
    yellow: '#FDB94E',    // Icon yellow/gold
    orange: '#FF9A56',    // Warm orange
    purple: '#8B7EC8',    // Soft purple
  },
  
  // Functional Colors
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3'
  },
  
  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    gray100: '#F5F7FA',
    gray200: '#E4E7EB',
    gray300: '#CBD2D9',
    gray400: '#9AA5B1',
    gray500: '#7B8794',
    gray600: '#616E7C',
    gray700: '#52606D',
    gray800: '#3E4C59',
    gray900: '#323F4B',
    black: '#1F2933'
  }
};

// Pre-defined gradient combinations
export const TPA_GRADIENTS = {
  primary: 'linear-gradient(135deg, #5B8FCC 0%, #4A73A6 100%)',
  secondary: 'linear-gradient(135deg, #6AB4A8 0%, #559089 100%)',
  accent: 'linear-gradient(135deg, #FDB94E 0%, #FF9A56 100%)',
  purple: 'linear-gradient(135deg, #8B7EC8 0%, #7366BD 100%)',
  
  // Module-specific gradients
  employees: 'linear-gradient(135deg, #5B8FCC 0%, #4A73A6 100%)',
  leave: 'linear-gradient(135deg, #6AB4A8 0%, #559089 100%)',
  attendance: 'linear-gradient(135deg, #8B7EC8 0%, #7366BD 100%)',
  reports: 'linear-gradient(135deg, #FDB94E 0%, #FF9A56 100%)',
};

export default TPA_COLORS;