import React from 'react';
import { Navigate } from 'react-router-dom';

// Import components
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import EmployeeDirectory from '../pages/employees/EmployeeDirectory';
import AddEmployee from '../pages/employees/AddEmployee';
import ViewEmployee from '../pages/employees/ViewEmployee';

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
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
  {
    path: '/employees/add',
    element: <AddEmployee />,
  },
  ,
  {
    path: '/employees/:id',        // ← ADD THIS
    element: <ViewEmployee />,     // ← ADD THIS
  },
  // Add these when you create the pages:
  // {
  //   path: '/employees/:id',
  //   element: <EmployeeDetails />,
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