// src/pages/employees/AddEmployee.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Save as SaveIcon,
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import api from '../../services/authService';

// Import from models
import {
  getInitialEmployeeRegistrationData,
  GENDER_OPTIONS,
  EMPLOYEE_TYPE_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  prepareEmployeeDataForAPI
} from './models';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [managers, setManagers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize form data using model
  const [formData, setFormData] = useState(getInitialEmployeeRegistrationData());

  useEffect(() => {
    fetchCurrentUser();
    fetchDepartments();
    fetchRoles();
    fetchManagers();
  }, []);

  // Auto-set benefits eligibility based on employee type
  useEffect(() => {
    if (formData.employeeType === 'FieldStaff') {
      setFormData(prev => ({
        ...prev,
        isEligibleForPTO: false,
        ptoBalance: 0,
        isEligibleForInsurance: false
      }));
    } else if (formData.employeeType === 'AdminStaff') {
      setFormData(prev => ({
        ...prev,
        isEligibleForPTO: true,
        isEligibleForInsurance: true
      }));
    }
  }, [formData.employeeType]);

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

  const fetchRoles = async () => {
    try {
      const response = await api.get('/Auth/Roles');
      setRoles(response.data);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await api.get('/Employee/Directory', {
        params: { pageSize: 100 }
      });
      setManagers(response.data.employees || []);
    } catch (err) {
      console.error('Error fetching managers:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Use model helper to prepare data for API
      const apiData = prepareEmployeeDataForAPI(formData);
      
      await api.post('/Employee/Register', apiData);
      
      setSuccess('Employee added successfully!');
      setTimeout(() => {
        navigate('/employees/list');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Build chips for PageHeader
  const headerChips = currentUser ? [
    { icon: <PersonIcon />, label: currentUser.email },
    { icon: <BadgeIcon />, label: currentUser.role?.roleName || 'User' }
  ] : [];

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Page Header */}
        <PageHeader
          icon={PersonAddIcon}
          title="Add New Employee"
          subtitle="Register a new employee in the system"
          chips={headerChips}
          actionButton={{
            label: 'Back to Directory',
            icon: <PersonIcon />,
            onClick: () => navigate('/employees/list')
          }}
          backgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />

        {/* Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Form */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            {/* Account Information */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
              Account Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="roleId"
                    value={formData.roleId}
                    onChange={handleChange}
                    label="Role"
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.roleId} value={role.roleId}>
                        {role.roleName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>

            {/* Personal Information */}
            <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: 600, color: '#2c3e50' }}>
              Personal Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label="Gender"
                  >
                    {GENDER_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Personal Email"
                  name="personalEmail"
                  type="email"
                  value={formData.personalEmail}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            {/* Employment Information */}
            <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: 600, color: '#2c3e50' }}>
              Employment Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee Code"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Employee Type</InputLabel>
                  <Select
                    name="employeeType"
                    value={formData.employeeType}
                    onChange={handleChange}
                    label="Employee Type"
                  >
                    {EMPLOYEE_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                    label="Department"
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.departmentId} value={dept.departmentId}>
                        {dept.departmentName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Hire Date"
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Manager</InputLabel>
                  <Select
                    name="managerId"
                    value={formData.managerId}
                    onChange={handleChange}
                    label="Manager"
                  >
                    <MenuItem value="">None</MenuItem>
                    {managers.map((mgr) => (
                      <MenuItem key={mgr.employeeId} value={mgr.employeeId}>
                        {mgr.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Submit Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/employees/list')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #5568d3 0%, #6a3f8f 100%)',
                  }
                }}
              >
                {loading ? 'Saving...' : 'Add Employee'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default AddEmployee;