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
      <Header user={user} employee={employee} />
      <Sidebar user={user} employee={employee} />
      
      <Box
        component="main"
        className="dashboard-main"
        sx={{
          flexGrow: 1,
          marginLeft: '240px',
          backgroundColor: '#ecf0f1',
          minHeight: '100vh',
          paddingTop: '56px !important',
          paddingLeft: '8px !important',
          paddingRight: '16px !important',
          paddingBottom: '16px !important',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;