// src/routes/routes.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import JobApplicationForm from '../pages/recruitment/JobApplicationForm';
import { ApplicationReviewDashboard } from '../pages/recruitment';

import { HRActionRequestForm, HRActionsReviewDashboard } from '../pages/hr-actions';
import MyHRRequestsPage from '../pages/hr-actions/MyHRRequestsPage';



import WorkforceReports from '../pages/reports/WorkforceReports';
import PayrollReports from '../pages/reports/PayrollReports';
import LeaveReports from '../pages/reports/LeaveReports';
import PerformanceReports from '../pages/reports/PerformanceReports';
import RecruitmentReports from '../pages/reports/RecruitmentReports';
import HRActionsReports from '../pages/reports/HRActionsReports';

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
  EmployeeOnboardingDetail 
} from '../pages/onboarding';
import {
  ClockInOut,
  MyAttendance,
  AttendanceReports,
  AttendanceSchedule
} from '../pages/attendance';


import MyTimesheets from '../pages/timesheets/MyTimesheets';
import ApproveTimesheets from '../pages/timesheets/ApproveTimesheets';


import ReportsOverview from '../pages/reports/ReportsOverview';


import {
  PerformanceOverview,
  MyRatings,
  MyReviews,
  Rankings,
  GoalsPage,
  FeedbackPage
} from '../pages/performance';
// Import Department components
import DepartmentList from '../pages/departments/DepartmentList';
import DepartmentDetail from '../pages/departments/DepartmentDetail';
import ManageDepartment from '../pages/departments/ManageDepartment';

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
 * - Module Routes: Organized by feature (Employees, Departments, Attendance, Leave, etc.)
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

export const dashboardRoutes = [
  {
    path: '/dashboard',
    element: <Dashboard />, // Smart router - detects role and shows appropriate dashboard
  },
  // Legacy routes redirect to unified dashboard
  {
    path: '/admin/dashboard',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/executive/dashboard',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/director/dashboard',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/programcoordinator/dashboard',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/fieldoperatormanager/dashboard',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/fieldoperator/dashboard',
    element: <Navigate to="/dashboard" replace />,
  },
];
export const timesheetRoutes = [
  {
    path: '/timesheets/my',
    element: <MyTimesheets />,
  },
  {
    path: '/timesheets/approve',
    element: <ApproveTimesheets />,
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

// Department Management Routes
export const departmentRoutes = [
  {
    path: '/departments',
    element: <DepartmentList />,
  },
  {
    path: '/departments/:id',
    element: <DepartmentDetail />,
  },
  {
    path: '/departments/manage',
    element: <ManageDepartment />,
  },
  {
    path: '/departments/manage/:id',
    element: <ManageDepartment />,
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
export const hrActionRoutes = [
  { path: '/hr-actions/request', element: <HRActionRequestForm /> },
  { path: '/hr-actions/review', element: <HRActionsReviewDashboard /> },
  { path: '/hr-actions/my-requests', element: <MyHRRequestsPage /> }
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
    element: <EmployeeOnboardingDetail/>,
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

// =============================================
// PERFORMANCE MANAGEMENT ROUTES
// =============================================
export const performanceRoutes = [
  {
    path: '/performance',
    element: <ProtectedRoute><PerformanceOverview /></ProtectedRoute>
  },
  {
    path: '/performance/my-ratings',
    element: <ProtectedRoute><MyRatings /></ProtectedRoute>
  },
  {
    path: '/performance/my-reviews',
    element: <ProtectedRoute><MyReviews /></ProtectedRoute>
  },
  {
    path: '/performance/rankings',
    element: <ProtectedRoute><Rankings /></ProtectedRoute>
  },
  {
    path: '/performance/goals',
    element: <ProtectedRoute><GoalsPage /></ProtectedRoute>
  },
  {
    path: '/performance/feedback',
    element: <ProtectedRoute><FeedbackPage /></ProtectedRoute>
  }
];
export const reportRoutes = [
  {
    path: '/reports',
    element: <ProtectedRoute><ReportsOverview /></ProtectedRoute>
  },
  {
    path: '/reports/workforce',
    element: <ProtectedRoute><WorkforceReports /></ProtectedRoute>
  },
  {
    path: '/reports/payroll',
    element: <ProtectedRoute><PayrollReports /></ProtectedRoute>
  },
  {
    path: '/reports/leave',
    element: <ProtectedRoute><LeaveReports /></ProtectedRoute>
  },
  {
    path: '/reports/performance',
    element: <ProtectedRoute><PerformanceReports /></ProtectedRoute>
  },
  {
    path: '/reports/recruitment',
    element: <ProtectedRoute><RecruitmentReports /></ProtectedRoute>
  },
  {
    path: '/reports/hr-actions',
    element: <ProtectedRoute><HRActionsReports /></ProtectedRoute>
  }
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
  ...departmentRoutes,
  ...leaveRoutes,
  ...recruitmentRoutes,
  ...onboardingRoutes,
  ...attendanceRoutes,
  ...performanceRoutes,
  ...settingsRoutes,
  ...profileRoutes,
  ...redirectRoutes,
  ...hrActionRoutes,  
  ...reportRoutes,
];

// Export individual route groups for flexibility
export default allRoutes;