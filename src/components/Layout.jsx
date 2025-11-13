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
          p: 2,
          pl: 0,  // Left padding - reduce this to bring content closer
          pr: 2,  // Right padding
          pt: '72px',
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