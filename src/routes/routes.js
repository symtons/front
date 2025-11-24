// src/routes/routes.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import JobApplicationForm from '../pages/recruitment/JobApplicationForm';
import { ApplicationReviewDashboard } from '../pages/recruitment';

// Import components
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import EmployeeDirectory from '../pages/employees/EmployeeDirectory';
import AddEmployee from '../pages/employees/AddEmployee';
import ViewEmployee from '../pages/employees/ViewEmployee';
import MyProfile from '../pages/profile/MyProfile';
import {
  RequestLeave,
  MyRequests,
  ApproveRequests,
  LeaveCalendar
} from '../pages/leave';
import {
  MyTasks,
  OnboardingMonitor,
  EmployeeDetail
} from '../pages/onboarding';
import {
  ClockInOut,
  MyAttendance,
  AttendanceReports,
  AttendanceSchedule
} from '../pages/attendance';
import PerformanceOverview from '../pages/performance/PerformanceOverview';
import GoalsPage from '../pages/performance/GoalsPage';
import FeedbackPage from '../pages/performance/FeedbackPage';

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
  {
    path: '/apply',
    element: <JobApplicationForm />,
  },
];

export const profileRoutes = [
  {
    path: '/profile',
    element: <MyProfile />,
  },
  {
    path: '/settings/profile',
    element: <MyProfile />,
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
  {
    path: '/employees/:id',
    element: <ViewEmployee />,
  },
];

// Leave Management Routes
export const leaveRoutes = [
  {
    path: '/leave/request',
    element: <RequestLeave />,
  },
  {
    path: '/leave/my-requests',
    element: <MyRequests />,
  },
  {
    path: '/leave/approve',
    element: <ApproveRequests />,
  },
  {
    path: '/leave/calendar',
    element: <LeaveCalendar />,
  },
];

// Recruitment Routes
export const recruitmentRoutes = [
  {
    path: '/recruitment/applications',
    element: <ApplicationReviewDashboard />,
  },
];

// Onboarding Routes
export const onboardingRoutes = [
  {
    path: '/onboarding/my-tasks',
    element: <MyTasks />,
  },
  {
    path: '/onboarding/monitor',
    element: <OnboardingMonitor />,
  },
  {
    path: '/onboarding/employee/:id',
    element: <EmployeeDetail />,
  },
];

// Attendance Routes
export const attendanceRoutes = [
  {
    path: '/attendance/clock',
    element: <ClockInOut />,
  },
  {
    path: '/attendance/my-attendance',
    element: <MyAttendance />,
  },
  {
    path: '/attendance/schedule',
    element: <AttendanceSchedule />,
  },
  {
    path: '/attendance/reports',
    element: <AttendanceReports />,
  },
];

// Performance Management Routes
export const performanceRoutes = [
  {
    path: '/performance',
    element: <PerformanceOverview />,
  },
  {
    path: '/performance/overview',
    element: <PerformanceOverview />,
  },
  {
    path: '/performance/goals',
    element: <GoalsPage />,
  },
  {
    path: '/performance/feedback',
    element: <FeedbackPage />,
  },
];

// Settings Routes (to be added later)
export const settingsRoutes = [];

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
  ...leaveRoutes,
  ...recruitmentRoutes,
  ...onboardingRoutes,
  ...attendanceRoutes,
  ...performanceRoutes,
  ...settingsRoutes,
  ...profileRoutes,
  ...redirectRoutes,
];

// Export individual route groups for flexibility
export default allRoutes;