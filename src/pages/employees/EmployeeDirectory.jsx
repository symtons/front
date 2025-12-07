// src/pages/employees/EmployeeDirectory.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  IconButton,
  Tooltip,
  Snackbar
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import SearchBar from '../../components/common/filters/SearchBar';
import FilterBar from '../../components/common/filters/FilterBar';
import DataTable from '../../components/common/tables/DataTable';
import StatusChip from '../../components/common/display/StatusChip';
import UserAvatar from '../../components/common/display/UserAvatar';
import EditEmployeeModal from './EditEmployeeModal';
import { employeeService } from '../../services/employeeService';
import api from '../../services/authService';

// Import from models
import {
  EMPLOYEE_TYPE_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  getEmployeeTypeLabel,
  getEmploymentStatusLabel
} from './models';

const EmployeeDirectory = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Departments list
  const [departments, setDepartments] = useState([]);
  
  // Current user info
  const [currentUser, setCurrentUser] = useState(null);
  
  // User permissions
  const [canEdit, setCanEdit] = useState(false);
  const [canCreate, setCanCreate] = useState(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCurrentUser();
    fetchDepartments();
    checkPermissions();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [page, rowsPerPage, searchTerm, departmentFilter, employeeTypeFilter, statusFilter]);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/Auth/Me');
      setCurrentUser(response.data);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/Department/All');
      setDepartments(response.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const checkPermissions = async () => {
    try {
      const response = await api.get('/Menu/MyMenus');
      
      const findMenu = (menus) => {
        for (const menu of menus) {
          if (menu.menuName === 'employees' && menu.subMenus) {
            const employeeListMenu = menu.subMenus.find(
              sub => sub.menuName === 'employees-list' || sub.menuUrl === '/employees/list'
            );
            if (employeeListMenu) return employeeListMenu;
          }
          
          if (menu.menuName === 'employees-list' || menu.menuUrl === '/employees/list') {
            return menu;
          }
          
          if (menu.subMenus && menu.subMenus.length > 0) {
            const found = findMenu(menu.subMenus);
            if (found) return found;
          }
        }
        return null;
      };
      
      const employeeMenu = findMenu(response.data);
      
      if (employeeMenu) {
        setCanEdit(employeeMenu.canEdit || false);
        setCanCreate(employeeMenu.canCreate || false);
      }
    } catch (err) {
      console.error('Error checking permissions:', err);
      setCanEdit(false);
      setCanCreate(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {
        pageNumber: page + 1,  // ✅ Backend expects 1-based (1, 2, 3...)
        pageSize: rowsPerPage,
        search: searchTerm || undefined,
        departmentId: departmentFilter || undefined,
        employeeType: employeeTypeFilter || undefined,
        employmentStatus: statusFilter || undefined,
      };

      const response = await employeeService.getDirectory(params);
      setEmployees(response.employees || []);
      setTotalCount(response.totalCount || 0);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load employees');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setEmployeeTypeFilter('');
    setStatusFilter('');
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleViewEmployee = (employeeId) => {
    navigate(`/employees/${employeeId}`);
  };

  const handleEditEmployee = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setEditModalOpen(true);
  };

  const handleEditSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    fetchEmployees();
  };

  // Build chips for PageHeader
  const headerChips = currentUser ? [
    { icon: <PersonIcon />, label: currentUser.email },
    { icon: <BadgeIcon />, label: currentUser.role?.roleName || 'User' }
  ] : [];

  // Define table columns
  const columns = [
    {
      id: 'employee',
      label: 'Employee',
      minWidth: 250,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <UserAvatar 
            firstName={row.firstName}
            lastName={row.lastName}
            size={40}
          />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {row.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.personalEmail}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      id: 'employeeCode',
      label: 'Employee Code',
      minWidth: 130,
      render: (row) => (
        <Typography variant="body2">{row.employeeCode}</Typography>
      )
    },
    {
      id: 'department',
      label: 'Department',
      minWidth: 150,
      render: (row) => (
        <Typography variant="body2">
          {row.department?.departmentName || 'N/A'}
        </Typography>
      )
    },
    {
      id: 'jobTitle',
      label: 'Job Title',
      minWidth: 150,
      render: (row) => (
        <Typography variant="body2">{row.jobTitle || 'N/A'}</Typography>
      )
    },
    {
      id: 'employeeType',
      label: 'Type',
      minWidth: 120,
      align: 'center',
      render: (row) => (
        <StatusChip
          status={row.employeeType}
          label={getEmployeeTypeLabel(row.employeeType)}
          variant={row.employeeType === 'AdminStaff' ? 'primary' : 'secondary'}
        />
      )
    },
    {
      id: 'employmentStatus',
      label: 'Status',
      minWidth: 120,
      align: 'center',
      render: (row) => (
        <StatusChip
          status={row.employmentStatus}
          label={getEmploymentStatusLabel(row.employmentStatus)}
          variant={
            row.employmentStatus === 'Active' ? 'success' :
            row.employmentStatus === 'OnLeave' ? 'warning' : 'error'
          }
        />
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleViewEmployee(row.employeeId)}
              sx={{ color: '#667eea' }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {canEdit && (
            <Tooltip title="Edit Employee">
              <IconButton
                size="small"
                onClick={() => handleEditEmployee(row.employeeId)}
                sx={{ color: '#f093fb' }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ];

  // Filter options for FilterBar
  const filterOptions = [
    {
      id: 'department',
      label: 'Department',
      value: departmentFilter,
      onChange: (e) => {
        setDepartmentFilter(e.target.value);
        setPage(0);
      },
      options: [
        { value: '', label: 'All Departments' },
        ...departments.map(dept => ({
          value: dept.departmentId.toString(),
          label: dept.departmentName
        }))
      ]
    },
    {
      id: 'employeeType',
      label: 'Employee Type',
      value: employeeTypeFilter,
      onChange: (e) => {
        setEmployeeTypeFilter(e.target.value);
        setPage(0);
      },
      options: [
        { value: '', label: 'All Types' },
        ...EMPLOYEE_TYPE_OPTIONS
      ]
    },
    {
      id: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: (e) => {
        setStatusFilter(e.target.value);
        setPage(0);
      },
      options: [
        { value: '', label: 'All Statuses' },
        ...EMPLOYMENT_STATUS_OPTIONS
      ]
    }
  ];

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Page Header */}
        <PageHeader
          icon={PeopleIcon}
          title="Employee Directory"
          subtitle="Search and manage employee information across the organization"
          chips={headerChips}
          actionButton={canCreate ? {
            label: 'Add Employee',
            icon: <PersonAddIcon />,
            onClick: () => navigate('/employees/add')
          } : undefined}
          backgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />

        {/* Search and Filters */}
        <Box sx={{ mb: 3 }}>
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search employees by name, code, or email..."
          />
          <FilterBar
            filters={filterOptions}
            onClearFilters={handleClearFilters}
          />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={employees}
          loading={loading}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          emptyMessage="No employees found"
        />

        {/* Edit Employee Modal */}
        <EditEmployeeModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          employeeId={selectedEmployeeId}
          onSuccess={handleEditSuccess}
        />

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setShowSuccess(false)} 
            severity="success" 
            sx={{ width: '100%' }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default EmployeeDirectory;