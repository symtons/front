// src/pages/dashboard/Dashboard.jsx
/**
 * Dashboard Router Component - FIXED FOR ONBOARDING
 * Detects user role and renders appropriate dashboard
 * Redirects employees with incomplete onboarding to their tasks page
 */

import React, { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import AdminDashboard from './AdminDashboard';
import ExecutiveDashboard from './ExecutiveDashboard';
import DirectorDashboard from './DirectorDashboard';
import CoordinatorDashboard from './CoordinatorDashboard';
import ManagerDashboard from './ManagerDashboard';
import EmployeeDashboard from './EmployeeDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
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
    onboardingStatus: user.onboardingStatus || employee.onboardingStatus,
  };

  // ✅ FIX: Check if onboarding is required and redirect
  useEffect(() => {
    // Only check for Field Operators (roleLevel 6)
    if (currentUser.roleLevel === 6) {
      const onboardingStatus = currentUser.onboardingStatus;
      
      // If onboarding is not completed, redirect to tasks page
      if (onboardingStatus !== 'Completed') {
        console.log('Onboarding not complete, redirecting to tasks page');
        navigate('/onboarding/my-tasks');
        return;
      }
    }
  }, [currentUser.roleLevel, currentUser.onboardingStatus, navigate]);

  // Loading state
  if (!currentUser || !currentUser.roleLevel) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  // ✅ FIX: Don't render dashboard if onboarding is incomplete
  if (currentUser.roleLevel === 6 && currentUser.onboardingStatus !== 'Completed') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
        <p style={{ marginLeft: '1rem' }}>Redirecting to onboarding tasks...</p>
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