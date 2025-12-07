import React, { useState, useEffect } from 'react';
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
  Avatar,
  CircularProgress,
  Collapse
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
  ManageAccounts as ManageAccountsIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  EventAvailable as EventAvailableIcon,
  Description as DescriptionIcon,
  Analytics as AnalyticsIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
// At the top of Sidebar.jsx, add this import:
import api from '../../../services/authService';
import { authService } from '../../../services/authService';

const drawerWidth = 240;

// Icon mapping based on MenuIcon field from database
const iconMap = {
  'dashboard': <DashboardIcon />,
  'people': <PeopleIcon />,
  'business': <BusinessIcon />,
  'schedule': <ScheduleIcon />,
  'event_available': <EventAvailableIcon />,
  'description': <DescriptionIcon />,
  'analytics': <AnalyticsIcon />,
  'settings': <SettingsIcon />,
  'person': <PersonIcon />,
  'help': <HelpIcon />,
  'manage_accounts': <ManageAccountsIcon />,
  'event_note': <EventNoteIcon />,
  'assessment': <AssessmentIcon />,
  'assignment': <AssignmentIcon />,
};

const Sidebar = ({ user, employee }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  
  // ✅ NEW: Onboarding restriction states
  const [onboardingRequired, setOnboardingRequired] = useState(false);
  const [onboardingMessage, setOnboardingMessage] = useState('');

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      
      // Use the centralized api instance - it already has baseURL and token
      const response = await api.get('/Menu/MyMenus');

      // ✅ NEW: Check if onboarding is required
      if (response.data.onboardingRequired) {
        setOnboardingRequired(true);
        setOnboardingMessage(response.data.message || 'Complete onboarding to access all features');
        setMenuItems(response.data.menus || []);
      } else {
        setOnboardingRequired(false);
        setMenuItems(response.data.menus || response.data || []);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      // Fallback to basic menu if API fails
      setMenuItems([
        {
          menuId: 1,
          menuTitle: 'Dashboard',
          menuIcon: 'dashboard',
          menuUrl: `/${user?.role?.toLowerCase()}/dashboard`,
          subMenus: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (menu) => {
    // If menu has submenus, toggle open/close
    if (menu.subMenus && menu.subMenus.length > 0) {
      setOpenMenus(prev => ({
        ...prev,
        [menu.menuId]: !prev[menu.menuId]
      }));
    } else if (menu.menuUrl) {
      // Navigate to the menu URL
      navigate(menu.menuUrl);
    }
  };

  const renderMenuItem = (item, isSubMenu = false) => {
    const hasSubMenus = item.subMenus && item.subMenus.length > 0;
    const isOpen = openMenus[item.menuId];
    const isActive = location.pathname === item.menuUrl;

    return (
      <React.Fragment key={item.menuId}>
        <ListItem disablePadding sx={{ mb: 0.5, pl: isSubMenu ? 2 : 0 }}>
          <ListItemButton
            selected={isActive}
            onClick={() => handleMenuClick(item)}
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
              {iconMap[item.menuIcon] || <DashboardIcon />}
            </ListItemIcon>
            <ListItemText 
              primary={item.menuTitle}
              primaryTypographyProps={{
                fontSize: isSubMenu ? '13px' : '14px',
                fontWeight: isSubMenu ? 400 : 500
              }}
            />
            {hasSubMenus && (
              isOpen ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />
            )}
          </ListItemButton>
        </ListItem>

        {/* Render submenus with collapse animation */}
        {hasSubMenus && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subMenus.map(subItem => renderMenuItem(subItem, true))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const bottomItems = [
    { text: 'My Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Help & Support', icon: <HelpIcon />, path: '/help' },
  ];

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
      {/* Logo Section */}
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

      {/* ✅ NEW: Onboarding Warning (only shows if onboarding required) */}
      {onboardingRequired && (
        <Box sx={{ 
          mx: 2, 
          my: 1.5, 
          p: 1.5, 
          backgroundColor: '#f59e42', 
          borderRadius: '8px',
          border: '2px solid #e08a2e'
        }}>
          <Typography variant="caption" sx={{ 
            color: 'white', 
            fontWeight: 600,
            display: 'block',
            textAlign: 'center',
            fontSize: '11px'
          }}>
            ⚠️ {onboardingMessage}
          </Typography>
        </Box>
      )}

      {/* Main Menu - ONLY MENUS CHANGE BASED ON ONBOARDING */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={30} sx={{ color: 'white' }} />
        </Box>
      ) : (
        <List sx={{ px: 1, flexGrow: 1, overflowY: 'auto' }}>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      )}

      {/* Bottom Items */}
      <Box sx={{ mt: 'auto' }}>
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
      </Box>
    </Drawer>
  );
};

export default Sidebar;