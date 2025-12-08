// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  ProtectedRoute,
  publicRoutes,
  dashboardRoutes,
  employeeRoutes,
  departmentRoutes,
  leaveRoutes,
  recruitmentRoutes,
  onboardingRoutes,
  attendanceRoutes,
  timesheetRoutes,
  performanceRoutes,
  redirectRoutes,
  profileRoutes,
} from './routes';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes (No authentication required) */}
          {publicRoutes.map((route, index) => (
            <Route key={`public-${index}`} path={route.path} element={route.element} />
          ))}

          {/* Protected Dashboard Routes */}
          {dashboardRoutes.map((route, index) => (
            <Route
              key={`dashboard-${index}`}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          ))}
          {/* Protected Timesheet Routes */}
          {timesheetRoutes.map((route, index) => (
            <Route
              key={`timesheet-${index}`}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          ))}

          {/* Protected Profile Routes */}
          {profileRoutes.map((route, index) => (
            <Route
              key={`profile-${index}`}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          ))}

          {/* Protected Employee Routes */}
          {employeeRoutes.map((route, index) => (
            <Route
              key={`employee-${index}`}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          ))}

          {/* Protected Department Routes */}
          {departmentRoutes.map((route, index) => (
            <Route
              key={`department-${index}`}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          ))}

          {/* Protected Leave Routes */}
          {leaveRoutes.map((route, index) => (
            <Route
              key={`leave-${index}`}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          ))}

          {/* Protected Recruitment Routes */}
          {recruitmentRoutes.map((route, index) => (
            <Route
              key={`recruitment-${index}`}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          ))}

          {/* Protected Onboarding Routes */}
          {onboardingRoutes.map((route, index) => (
            <Route
              key={`onboarding-${index}`}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          ))}

          {/* Protected Attendance Routes */}
          {attendanceRoutes.map((route, index) => (
            <Route
              key={`attendance-${index}`}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          ))}

          {/* Protected Performance Routes */}
          {performanceRoutes.map((route, index) => (
            <Route
              key={`performance-${index}`}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          ))}

          {/* Redirect Routes (catch-all and home) */}
          {redirectRoutes.map((route, index) => (
            <Route key={`redirect-${index}`} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;