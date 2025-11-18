import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import SearchBar from '../../components/common/filters/SearchBar';
import FilterBar from '../../components/common/filters/FilterBar';
import DataTable from '../../components/common/tables/DataTable';
import StatusChip from '../../components/common/display/StatusChip';
import UserAvatar from '../../components/common/display/UserAvatar';
import { employeeService } from '../../services/employeeService';
import api from '../../services/authService';

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
  
  // User permissions
  const [canEdit, setCanEdit] = useState(false);
  const [canCreate, setCanCreate] = useState(false);

  useEffect(() => {
    fetchDepartments();
    checkPermissions();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [page, rowsPerPage, searchTerm, departmentFilter, employeeTypeFilter, statusFilter]);

  const checkPermissions = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role;
    
    if (role === 'Admin' || role === 'Executive' || role === 'Director') {
      setCanEdit(true);
    }
    
    if (role === 'Admin' || role === 'Executive') {
      setCanCreate(true);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/Auth/Departments');
      setDepartments(response.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        search: searchTerm || undefined,
        departmentId: departmentFilter || undefined,
        employeeType: employeeTypeFilter || undefined,
        employmentStatus: statusFilter || undefined
      };

      const data = await employeeService.getDirectory(params);
      
      setEmployees(data.employees);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setEmployeeTypeFilter('');
    setStatusFilter('');
    setPage(0);
  };

  const handleViewEmployee = (employeeId) => {
    navigate(`/employees/${employeeId}`);
  };

  const handleEditEmployee = (employeeId) => {
    navigate(`/employees/edit/${employeeId}`);
  };

  // Define table columns
  const columns = [
    {
      id: 'employee',
      label: 'Employee',
      minWidth: 250,
      sortable: true,
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
      sortable: true,
      render: (row) => (
        <Typography variant="body2">{row.employeeCode}</Typography>
      )
    },
    {
      id: 'department',
      label: 'Department',
      minWidth: 150,
      sortable: true,
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
          label={row.employeeType === 'AdminStaff' ? 'Admin Staff' : 'Field Staff'}
          colorMap={{
            'AdminStaff': 'primary',
            'FieldStaff': 'secondary'
          }}
        />
      )
    },
    {
      id: 'employmentStatus',
      label: 'Status',
      minWidth: 100,
      align: 'center',
      sortable: true,
      render: (row) => (
        <StatusChip status={row.employmentStatus} />
      )
    },
    {
      id: 'phoneNumber',
      label: 'Contact',
      minWidth: 130,
      render: (row) => (
        <Typography variant="body2">{row.phoneNumber || 'N/A'}</Typography>
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleViewEmployee(row.employeeId);
              }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {canEdit && (
            <Tooltip title="Edit Employee">
              <IconButton
                size="small"
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditEmployee(row.employeeId);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ];

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#2c3e50' }}>
              Employee Directory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and manage employee information
            </Typography>
          </Box>
          {canCreate && (
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
              onClick={() => navigate('/employees/add')}
            >
              Add Employee
            </Button>
          )}
        </Box>

        {/* Filters */}
        <FilterBar 
          onClear={handleClearFilters} 
          onRefresh={fetchEmployees}
        >
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search employees..."
          />
          
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              label="Department"
            >
              <MenuItem value="">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.departmentId} value={dept.departmentId}>
                  {dept.departmentName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Employee Type</InputLabel>
            <Select
              value={employeeTypeFilter}
              onChange={(e) => setEmployeeTypeFilter(e.target.value)}
              label="Employee Type"
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="AdminStaff">Admin Staff</MenuItem>
              <MenuItem value="FieldStaff">Field Staff</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="OnLeave">On Leave</MenuItem>
              <MenuItem value="Terminated">Terminated</MenuItem>
            </Select>
          </FormControl>
        </FilterBar>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Universal DataTable */}
        <DataTable
          columns={columns}
          data={employees}
          loading={loading}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onRowClick={(row) => handleViewEmployee(row.employeeId)}
          emptyMessage="No employees found"
        />
      </Box>
    </Layout>
  );
};

export default EmployeeDirectory;