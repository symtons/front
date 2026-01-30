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
  IconButton,
  Snackbar
} from '@mui/material';
import {
  Save as SaveIcon,
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import api from '../../services/authService';
import BulkImportModal from './BulkImportModal';

// Import from models
import {
  getInitialEmployeeRegistrationData,
  GENDER_OPTIONS,
  EMPLOYEE_TYPE_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
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
  
  // Bulk import state
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

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
      
      await api.post('/Auth/Register', apiData);
      
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
        {/* Page Header with Bulk Import Button Inside */}
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            p: 3,
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 2,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PersonAddIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                Add New Employee
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Create a new employee account and profile
              </Typography>
              {headerChips.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  {headerChips.map((chip, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.5
                      }}
                    >
                      {chip.icon && <Box sx={{ color: 'white', display: 'flex' }}>{chip.icon}</Box>}
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        {chip.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
          
          {/* Bulk Import Button - Inside Header */}
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setBulkImportOpen(true)}
            sx={{ 
              backgroundColor: 'white',
              color: '#667eea',
              fontWeight: 600,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Bulk Import
          </Button>
        </Box>

        {/* Form */}
        <Paper elevation={2} sx={{ p: 4, mt: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {/* Account Information */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
              Account Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
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
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
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
                  label="Address"
                  name="address"
                  value={formData.address}
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
                <FormControl fullWidth>
                  <InputLabel>Employment Type</InputLabel>
                  <Select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    label="Employment Type"
                  >
                    {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Employment Status</InputLabel>
                  <Select
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleChange}
                    label="Employment Status"
                  >
                    {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
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

      {/* Bulk Import Modal */}
      <BulkImportModal
        open={bulkImportOpen}
        onClose={() => setBulkImportOpen(false)}
        onSuccess={(message) => {
          setSuccessMessage(message);
          setShowSuccess(true);
          setBulkImportOpen(false);
        }}
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
    </Layout>
  );
};

export default AddEmployee;