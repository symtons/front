import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Typography,
  Box,
  Divider
} from '@mui/material';
import { authService } from '../../../services/authService';
import onboardingService from '../../../services/onboardingService';

const HireDialog = ({ open, onClose, application, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    email: '',
    employeeCode: '',
    departmentId: '',
    jobTitle: '',
    employeeType: 'AdminStaff',
    employmentType: 'Full-Time',
    roleId: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: '',
    managerId: ''
  });

  // Load departments and roles when dialog opens
  useEffect(() => {
    if (open && application) {
      // Pre-fill email from application
      setFormData(prev => ({
        ...prev,
        email: application.email || '',
        employeeCode: generateEmployeeCode()
      }));

      loadDropdownData();
    }
  }, [open, application]);

  const loadDropdownData = async () => {
    try {
      const [deptResponse, roleResponse] = await Promise.all([
        authService.getDepartments?.() || fetch('https://localhost:7144/api/Auth/Departments', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(r => r.json()),
        authService.getRoles?.() || fetch('https://localhost:7144/api/Auth/Roles', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(r => r.json())
      ]);

      setDepartments(Array.isArray(deptResponse) ? deptResponse : []);
      setRoles(Array.isArray(roleResponse) ? roleResponse : []);
    } catch (err) {
      console.error('Failed to load dropdown data:', err);
    }
  };

  const generateEmployeeCode = () => {
    const prefix = 'EMP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}${timestamp}${random}`;
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
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.email || !formData.employeeCode || !formData.departmentId ||
          !formData.jobTitle || !formData.roleId || !formData.hireDate) {
        throw new Error('Please fill in all required fields');
      }

      const hireData = {
        email: formData.email,
        employeeCode: formData.employeeCode,
        departmentId: parseInt(formData.departmentId),
        jobTitle: formData.jobTitle,
        employeeType: formData.employeeType,
        employmentType: formData.employmentType || 'Full-Time',
        roleId: parseInt(formData.roleId),
        hireDate: formData.hireDate,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        managerId: formData.managerId ? parseInt(formData.managerId) : null
      };

      const result = await onboardingService.hireCandidate(application.applicationId, hireData);

      if (onSuccess) {
        onSuccess(result);
      }

      onClose();
    } catch (err) {
      setError(err.message || 'Failed to hire candidate');
    } finally {
      setLoading(false);
    }
  };

  if (!application) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ backgroundColor: '#f59e42', color: 'white', fontWeight: 600 }}>
        Hire Candidate - {application.firstName} {application.lastName}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Fill in the employment details to create an account and initiate onboarding
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  helperText="Will be used for login"
                />
              </Grid>

              {/* Employee Code */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Employee Code"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleChange}
                  helperText="Unique identifier"
                />
              </Grid>

              {/* Department */}
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

              {/* Job Title */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Job Title"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
              </Grid>

              {/* Employee Type */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Employee Type</InputLabel>
                  <Select
                    name="employeeType"
                    value={formData.employeeType}
                    onChange={handleChange}
                    label="Employee Type"
                  >
                    <MenuItem value="AdminStaff">Admin Staff (Eligible for PTO & Insurance)</MenuItem>
                    <MenuItem value="FieldStaff">Field Staff</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Employment Type */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Employment Type</InputLabel>
                  <Select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    label="Employment Type"
                  >
                    <MenuItem value="Full-Time">Full-Time</MenuItem>
                    <MenuItem value="Part-Time">Part-Time</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Role */}
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

              {/* Hire Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Hire Date"
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Salary */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Salary (Optional)"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <Typography>$</Typography>
                  }}
                  helperText="Annual salary"
                />
              </Grid>

              {/* Manager (Optional) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Manager ID (Optional)"
                  name="managerId"
                  type="number"
                  value={formData.managerId}
                  onChange={handleChange}
                  helperText="Leave blank if no direct manager"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight={600}>What happens next:</Typography>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                <li>User account will be created with temporary password</li>
                <li>Employee record will be linked to the job application</li>
                <li>Onboarding tasks will be automatically assigned</li>
                <li>Welcome email will be queued with login credentials</li>
                <li>Candidate can log in and complete onboarding tasks</li>
              </ul>
            </Alert>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#f59e42',
              '&:hover': { backgroundColor: '#e08a2e' }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Hire Candidate'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default HireDialog;
