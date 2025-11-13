import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  Divider,
  Avatar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  Assessment as AssessmentIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Help as HelpIcon,
  ManageAccounts as ManageAccountsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = ({ user, employee }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define menu items based on role
  const getMenuItems = () => {
    const userRole = user?.role;

    // Common items for all users
    const commonItems = [
      { 
        text: 'Dashboard', 
        icon: <DashboardIcon />, 
        path: `/${userRole?.toLowerCase()}/dashboard` 
      },
    ];

    // Admin and HR Manager items
    if (userRole === 'Admin' || userRole === 'HRManager') {
      return [
        ...commonItems,
        { text: 'Employee Management', icon: <PeopleIcon />, path: '/employees' },
        { text: 'Leave Management', icon: <EventNoteIcon />, path: '/leave' },
        { text: 'Reports & Analytics', icon: <AssessmentIcon />, path: '/reports' },
        { text: 'Onboarding', icon: <AssignmentIcon />, path: '/onboarding' },
      ];
    }

    // Employee items
    return [
      ...commonItems,
      { text: 'My Profile', icon: <PersonIcon />, path: '/profile' },
      { text: 'Leave Requests', icon: <EventNoteIcon />, path: '/leave' },
      { text: 'Time & Attendance', icon: <AssessmentIcon />, path: '/attendance' },
    ];
  };

  const adminItems = [
    { text: 'User Management', icon: <ManageAccountsIcon />, path: '/users' },
    { text: 'System Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const bottomItems = [
    { text: 'My Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Help & Support', icon: <HelpIcon />, path: '/help' },
  ];

  const menuItems = getMenuItems();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#2c3e50',
          color: 'white',
          border: 'none',
        },
      }}
    >
      {/* Logo Section - FIXED */}
      <Box 
        sx={{ 
          p: 3, 
          textAlign: 'center', 
          backgroundColor: '#f59e42',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '120px'
        }}
      >
        <Box
          sx={{
            width: '100px',
            height: '100px',
            backgroundColor: 'white',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px'
          }}
        >
          <img 
            src="/logo.png" 
            alt="TPA Logo" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain' 
            }}
          />
        </Box>
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Avatar 
          sx={{ 
            width: 60, 
            height: 60, 
            margin: '0 auto',
            backgroundColor: '#667eea',
            fontSize: '20px',
            fontWeight: 600
          }}
        >
          {employee?.firstName?.charAt(0)}{employee?.lastName?.charAt(0)}
        </Avatar>
        <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
          {employee?.firstName} {employee?.lastName}
        </Typography>
        <Typography variant="caption" sx={{ color: '#95a5a6' }}>
          {user?.role}
        </Typography>
      </Box>

      <Divider sx={{ backgroundColor: '#34495e' }} />

      {/* Main Menu */}
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: '8px',
                '&.Mui-selected': {
                  backgroundColor: '#f59e42',
                  '&:hover': {
                    backgroundColor: '#e08a2e',
                  },
                },
                '&:hover': {
                  backgroundColor: '#34495e',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: 500
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Admin Section */}
      {user?.role === 'Admin' && (
        <>
          <Divider sx={{ backgroundColor: '#34495e', mt: 2 }} />
          <Typography 
            variant="caption" 
            sx={{ px: 2, pt: 2, pb: 1, color: '#95a5a6', fontWeight: 600, fontSize: '11px' }}
          >
            ADMINISTRATION
          </Typography>
          <List sx={{ px: 1 }}>
            {adminItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: '8px',
                    '&.Mui-selected': {
                      backgroundColor: '#f59e42',
                    },
                    '&:hover': {
                      backgroundColor: '#34495e',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: 500
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* Bottom Items */}
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ backgroundColor: '#34495e' }} />
      <List sx={{ px: 1, pb: 2 }}>
        {bottomItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#34495e',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: 500
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Version */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: '#7f8c8d', fontSize: '11px' }}>
          TPA HR System v1.0
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;