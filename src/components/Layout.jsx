import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import { authService } from '../services/authService';

const Layout = ({ children }) => {
  const user = authService.getCurrentUser();
  const employee = JSON.parse(localStorage.getItem('employee') || '{}');

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Header */}
      <Header user={user} employee={employee} />

      {/* Sidebar */}
      <Sidebar user={user} employee={employee} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: '72px',
          pl: 0,  // Reduced left padding
          pr: 2,
          pb: 2,
          backgroundColor: '#ecf0f1',
          minHeight: '100vh',
          marginLeft: '240px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;