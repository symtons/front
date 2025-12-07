// src/pages/departments/DepartmentList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Business as BusinessIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import Loading from '../../components/common/feedback/Loading';
import DepartmentCard from './components/DepartmentCard';
import departmentService from '../../services/departmentService';
import {
  filterDepartments,
  filterDepartmentsByStatus,
  sortDepartmentsByName,
  sortDepartmentsByEmployeeCount
} from './models/departmentModels';

const DepartmentList = () => {
  const navigate = useNavigate();
  
  // State
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [sortBy, setSortBy] = useState('name');
  
  // User permissions
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const canManage = user.role === 'Admin' || user.role === 'Executive';

  // Fetch departments on mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Apply filters whenever data or filters change
  useEffect(() => {
    applyFilters();
  }, [departments, searchQuery, statusFilter, sortBy]);

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(err.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FILTERING & SORTING
  // ============================================

  const applyFilters = () => {
    let filtered = [...departments];

    // Apply search filter
    filtered = filterDepartments(filtered, searchQuery);

    // Apply status filter
    filtered = filterDepartmentsByStatus(filtered, statusFilter);

    // Apply sorting
    if (sortBy === 'name') {
      filtered = sortDepartmentsByName(filtered, 'asc');
    } else if (sortBy === 'employeeCount') {
      filtered = sortDepartmentsByEmployeeCount(filtered, 'desc');
    }

    setFilteredDepartments(filtered);
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleRefresh = () => {
    fetchDepartments();
  };

  const handleViewDepartment = (departmentId) => {
    navigate(`/departments/${departmentId}`);
  };

  const handleManageDepartments = () => {
    navigate('/departments/manage');
  };

  const handleCreateDepartment = () => {
    navigate('/departments/manage/new');
  };

  // ============================================
  // STATISTICS
  // ============================================

  const totalEmployees = departments.reduce((sum, dept) => sum + (dept.employeeCount || 0), 0);
  const totalAdminStaff = departments.reduce((sum, dept) => sum + (dept.adminStaffCount || 0), 0);
  const totalFieldStaff = departments.reduce((sum, dept) => sum + (dept.fieldStaffCount || 0), 0);

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading departments..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        icon={BusinessIcon}
        title="Departments"
        subtitle="Manage organizational departments and view employee distribution"
        actions={
          canManage && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateDepartment}
              sx={{
                backgroundColor: '#667eea',
                '&:hover': {
                  backgroundColor: '#5568d3'
                }
              }}
            >
              Create Department
            </Button>
          )
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Statistics Summary Bar - Recruitment Style */}
      <Box 
        sx={{ 
          mb: 3, 
          p: 3, 
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea' }}>
            {departments.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Departments
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#6AB4A8' }}>
            {totalEmployees}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Employees
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#FDB94E' }}>
            {totalAdminStaff}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Admin Staff
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#5B8FCC' }}>
            {totalFieldStaff}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Field Staff
          </Typography>
        </Box>
      </Box>

      {/* Filters Bar */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Search */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search departments..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#667eea' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Status Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Status"
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Sort By */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value="name">Department Name</MenuItem>
                <MenuItem value="employeeCount">Employee Count</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Refresh Button */}
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  borderColor: '#5568d3',
                  backgroundColor: 'rgba(102, 126, 234, 0.04)'
                }
              }}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Department Cards Grid */}
      {filteredDepartments.length === 0 ? (
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <BusinessIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No departments found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'There are no departments to display'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredDepartments.map((department) => (
            <Grid item xs={12} sm={6} md={4} key={department.departmentId}>
              <DepartmentCard
                department={department}
                onClick={() => handleViewDepartment(department.departmentId)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  );
};

export default DepartmentList;