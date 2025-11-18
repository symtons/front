import React from 'react';
import { Navigate } from 'react-router-dom';

// Auth Pages
import Login from '../pages/auth/Login';

// Dashboard Pages
import Dashboard from '../pages/dashboard/Dashboard';

// Employee Pages
import EmployeeDirectory from '../pages/employees/EmployeeDirectory';
// import EmployeeDetails from '../pages/employees/EmployeeDetails';
// import EmployeeForm from '../pages/employees/EmployeeForm';

// Auth Helper
import { authService } from '../services/authService';

// Protected Route Wrapper
export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/**
 * Routes Configuration
 * 
 * Structure:
 * - Public Routes: Login, Register, etc.
 * - Dashboard Routes: Role-based dashboards
 * - Module Routes: Organized by feature (Employees, Attendance, Leave, etc.)
 */

// Public Routes
export const publicRoutes = [
  {
    path: '/login',
    element: <Login />,
  },
];

// Dashboard Routes (Role-based)
export const dashboardRoutes = [
  {
    path: '/admin/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/executive/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/director/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/programcoordinator/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/fieldoperatormanager/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/fieldoperator/dashboard',
    element: <Dashboard />,
  },
];

// Employee Management Routes
export const employeeRoutes = [
  {
    path: '/employees',
    element: <EmployeeDirectory />,
  },
  {
    path: '/employees/list',
    element: <EmployeeDirectory />,
  },
  // Add these when you create the pages:
  // {
  //   path: '/employees/:id',
  //   element: <EmployeeDetails />,
  // },
  // {
  //   path: '/employees/add',
  //   element: <EmployeeForm />,
  // },
  // {
  //   path: '/employees/edit/:id',
  //   element: <EmployeeForm />,
  // },
];

// Attendance Routes (to be added later)
export const attendanceRoutes = [
  // {
  //   path: '/attendance',
  //   element: <AttendanceList />,
  // },
  // {
  //   path: '/attendance/clock-in',
  //   element: <ClockIn />,
  // },
];

// Leave Management Routes (to be added later)
export const leaveRoutes = [
  // {
  //   path: '/leave',
  //   element: <LeaveList />,
  // },
  // {
  //   path: '/leave/request',
  //   element: <LeaveRequest />,
  // },
];

// Settings Routes (to be added later)
export const settingsRoutes = [
  // {
  //   path: '/settings/profile',
  //   element: <Profile />,
  // },
  // {
  //   path: '/settings/users',
  //   element: <UserManagement />,
  // },
];

// Redirect Routes
export const redirectRoutes = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
];

// Combine all routes
export const allRoutes = [
  ...publicRoutes,
  ...dashboardRoutes,
  ...employeeRoutes,
  ...attendanceRoutes,
  ...leaveRoutes,
  ...settingsRoutes,
  ...redirectRoutes,
];

// Export individual route groups for flexibility
export default allRoutes;