import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  ProtectedRoute,
  publicRoutes,
  dashboardRoutes,
  employeeRoutes,
  redirectRoutes,
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

          {/* Protected Employee Routes */}
          {employeeRoutes.map((route, index) => (
            <Route
              key={`employee-${index}`}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          ))}

          {/* Add more route groups here as you build them */}
          {/* Example: */}
          {/* {attendanceRoutes.map((route, index) => (
            <Route
              key={`attendance-${index}`}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          ))} */}

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