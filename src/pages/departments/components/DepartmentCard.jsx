// src/pages/departments/components/DepartmentCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Groups as GroupsIcon
} from '@mui/icons-material';
import {
  getDepartmentIcon,
  getDepartmentColor,
  formatEmployeeCount,
  getDepartmentSummary
} from '../models/departmentModels';

const DepartmentCard = ({ department, onClick }) => {
  const departmentColor = getDepartmentColor(department.departmentName);
  const iconName = getDepartmentIcon(department.departmentName);

  // Icon mapping
  const iconMap = {
    'local_hospital': <PeopleIcon />,
    'event': <GroupsIcon />,
    'people': <PeopleIcon />,
    'computer': <PersonIcon />,
    'account_balance': <GroupsIcon />,
    'work': <PeopleIcon />,
    'business': <GroupsIcon />
  };

  const IconComponent = iconMap[iconName] || <GroupsIcon />;

  return (
    <Card
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
          '& .arrow-icon': {
            transform: 'translateX(4px)'
          }
        }
      }}
      onClick={onClick}
    >
      {/* Color Header Bar */}
      <Box
        sx={{
          height: 8,
          background: `linear-gradient(90deg, ${departmentColor} 0%, ${departmentColor}dd 100%)`
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Department Icon & Name */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              backgroundColor: `${departmentColor}20`,
              color: departmentColor,
              mr: 2
            }}
          >
            {IconComponent}
          </Avatar>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                color: '#2c3e50',
                mb: 0.5,
                lineHeight: 1.3
              }}
            >
              {department.departmentName}
            </Typography>
            <Chip
              label={department.departmentCode}
              size="small"
              sx={{
                backgroundColor: `${departmentColor}15`,
                color: departmentColor,
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 24
              }}
            />
          </Box>

          <IconButton
            size="small"
            className="arrow-icon"
            sx={{
              transition: 'transform 0.3s ease',
              color: departmentColor
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>

        {/* Description */}
        {department.description && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              mb: 3,
              minHeight: 40,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {department.description}
          </Typography>
        )}

        {/* Employee Statistics */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            mb: 2
          }}
        >
          {/* Total Employees */}
          <Box
            sx={{
              flex: 1,
              minWidth: 100,
              p: 2,
              backgroundColor: '#f8f9fa',
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ color: '#667eea' }}
            >
              {department.employeeCount || 0}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Total
            </Typography>
          </Box>

          {/* Admin Staff */}
          <Box
            sx={{
              flex: 1,
              minWidth: 100,
              p: 2,
              backgroundColor: '#f8f9fa',
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ color: '#6AB4A8' }}
            >
              {department.adminStaffCount || 0}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Admin
            </Typography>
          </Box>

          {/* Field Staff */}
          <Box
            sx={{
              flex: 1,
              minWidth: 100,
              p: 2,
              backgroundColor: '#f8f9fa',
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ color: '#FDB94E' }}
            >
              {department.fieldStaffCount || 0}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Field
            </Typography>
          </Box>
        </Box>

        {/* Department Head */}
        {department.departmentHead && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              backgroundColor: '#f8f9fa',
              borderRadius: 2,
              mt: 2
            }}
          >
            <PersonIcon sx={{ color: '#667eea', mr: 1, fontSize: 20 }} />
            <Box>
              <Typography variant="caption" color="textSecondary" display="block">
                Department Head
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ color: '#2c3e50' }}>
                {department.departmentHead}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Status Badge */}
        <Box sx={{ mt: 2 }}>
          <Chip
            label={department.isActive ? 'Active' : 'Inactive'}
            size="small"
            sx={{
              backgroundColor: department.isActive ? '#e8f5e9' : '#ffebee',
              color: department.isActive ? '#2e7d32' : '#c62828',
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default DepartmentCard;