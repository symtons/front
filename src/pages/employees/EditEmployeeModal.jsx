// src/pages/employees/EditEmployeeModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Divider,
  Button
} from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import CustomModal from '../../components/common/feedback/CustomModal';
import { employeeService } from '../../services/employeeService';
import api from '../../services/authService';

const EditEmployeeModal = ({ open, onClose, employeeId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingEmployee, setFetchingEmployee] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    personalEmail: '',
    address: '',
    
    city: '',
    state: '',
    zipCode: '',
    employeeCode: '',
    employeeType: '',
    departmentId: '',
    jobTitle: '',
    hireDate: '',
    managerId: '',
    employmentStatus: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: ''
  });

  useEffect(() => {
    if (open && employeeId) {
      fetchDepartments();
      fetchManagers();
      fetchEmployeeDetails();
    }
  }, [open, employeeId]);

  const fetchEmployeeDetails = async () => {
    try {
      setFetchingEmployee(true);
      const employee = await employeeService.getEmployeeById(employeeId);
      
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        dateOfBirth: formatDate(employee.dateOfBirth),
        gender: employee.gender || '',
        phoneNumber: employee.phoneNumber || '',
        personalEmail: employee.personalEmail || '',
        address: employee.address || '',
        
        city: employee.city || '',
        state: employee.state || '',
        zipCode: employee.zipCode || '',
        employeeCode: employee.employeeCode || '',
        employeeType: employee.employeeType || '',
        departmentId: employee.departmentId || '',
        jobTitle: employee.jobTitle || '',
        hireDate: formatDate(employee.hireDate),
        managerId: employee.managerId || '',
        employmentStatus: employee.employmentStatus || '',
        emergencyContactName: employee.emergencyContactName || '',
        emergencyContactRelationship: employee.emergencyContactRelationship || '',
        emergencyContactPhone: employee.emergencyContactPhone || ''
      });
    } catch (err) {
      setError(err.message || 'Failed to load employee details');
    } finally {
      setFetchingEmployee(false);
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const requestData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
        hireDate: formData.hireDate ? new Date(formData.hireDate).toISOString() : null,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
        managerId: formData.managerId ? parseInt(formData.managerId) : null
      };

      await employeeService.updateEmployee(employeeId, requestData);
      
      onSuccess && onSuccess('Employee updated successfully!');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      onClose();
    }
  };

  const modalActions = (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
      <Button
        onClick={handleClose}
        disabled={loading}
        variant="outlined"
        startIcon={<CloseIcon />}
      >
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        disabled={loading || fetchingEmployee}
        variant="contained"
        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
        sx={{
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #5568d3 0%, #6a3f8f 100%)',
          }
        }}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </Box>
  );

  return (
    <CustomModal
      open={open}
      onClose={handleClose}
      title="Edit Employee"
      subtitle="Update employee information"
      size="lg"
      actions={modalActions}
    >
      {fetchingEmployee ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Personal Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            Personal Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading}
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
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Gender"
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
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
                disabled={loading}
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
                disabled={loading}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Address */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            Address
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Zip Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Employment Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
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
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required disabled={loading}>
                <InputLabel>Employee Type</InputLabel>
                <Select
                  name="employeeType"
                  value={formData.employeeType}
                  onChange={handleChange}
                  label="Employee Type"
                >
                  <MenuItem value="AdminStaff">Admin Staff</MenuItem>
                  <MenuItem value="FieldStaff">Field Staff</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Department</InputLabel>
                <Select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  label="Department"
                >
                  <MenuItem value="">Select Department</MenuItem>
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
                disabled={loading}
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
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Manager</InputLabel>
                <Select
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleChange}
                  label="Manager"
                >
                  <MenuItem value="">No Manager</MenuItem>
                  {managers.map((mgr) => (
                    <MenuItem key={mgr.employeeId} value={mgr.employeeId}>
                      {mgr.fullName} ({mgr.employeeCode})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Employment Status</InputLabel>
                <Select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  label="Employment Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="OnLeave">On Leave</MenuItem>
                  <MenuItem value="Terminated">Terminated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Emergency Contact */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            Emergency Contact
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Name"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Relationship"
                name="emergencyContactRelationship"
                value={formData.emergencyContactRelationship}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Phone"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </CustomModal>
  );
};

export default EditEmployeeModal;