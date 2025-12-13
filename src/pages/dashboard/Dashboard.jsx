// src/pages/dashboard/Dashboard.jsx
/**
 * Dashboard Router Component
 * Detects user role and renders appropriate dashboard
 */

import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { authService } from '../../services/authService';
import AdminDashboard from './AdminDashboard';
import ExecutiveDashboard from './ExecutiveDashboard';
import DirectorDashboard from './DirectorDashboard';
import CoordinatorDashboard from './CoordinatorDashboard';
import ManagerDashboard from './ManagerDashboard';
import EmployeeDashboard from './EmployeeDashboard';

const Dashboard = () => {
  const user = authService.getCurrentUser();
  const employee = JSON.parse(localStorage.getItem('employee') || '{}');

  // Combine user data
  const currentUser = {
    ...user,
    ...employee,
    employeeId: employee.employeeId || user.employeeId,
    departmentId: employee.departmentId || user.departmentId,
    departmentName: employee.departmentName || user.departmentName,
    roleLevel: user.roleLevel,
  };

  // Loading state
  if (!currentUser || !currentUser.roleLevel) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  // Route to appropriate dashboard based on role level
  switch (currentUser.roleLevel) {
    case 1: // Admin
      return <AdminDashboard user={currentUser} />;
    
    case 2: // Executive
      return <ExecutiveDashboard user={currentUser} />;
    
    case 3: // Director
      return <DirectorDashboard user={currentUser} />;
    
    case 4: // Coordinator
      return <CoordinatorDashboard user={currentUser} />;
    
    case 5: // Manager (Field Operator Manager)
      return <ManagerDashboard user={currentUser} />;
    
    case 6: // Employee / Field Operator
    default:
      return <EmployeeDashboard user={currentUser} />;
  }
};

export default Dashboard;