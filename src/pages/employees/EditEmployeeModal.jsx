// src/pages/employees/EditEmployeeModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Button,
  Typography,
  Divider
} from '@mui/material';
import {
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import CustomModal from '../../components/common/feedback/CustomModal';
import { employeeService } from '../../services/employeeService';

const EditEmployeeModal = ({ open, onClose, employeeId, employee, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form data when employee changes
  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        middleName: employee.middleName || '',
        dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split('T')[0] : '',
        gender: employee.gender || '',
        maritalStatus: employee.maritalStatus || '',
        
        phoneNumber: employee.phoneNumber || '',
        personalEmail: employee.personalEmail || '',
        address: employee.address || '',
        city: employee.city || '',
        state: employee.state || '',
        zipCode: employee.zipCode || '',
        country: employee.country || 'USA',
        
        emergencyContactName: employee.emergencyContactName || '',
        emergencyContactPhone: employee.emergencyContactPhone || '',
        emergencyContactRelationship: employee.emergencyContactRelationship || '',
        
        departmentId: employee.department?.departmentId || null,
        managerId: employee.manager?.employeeId || null,
        jobTitle: employee.jobTitle || '',
        employeeType: employee.employeeType || 'AdminStaff',
        employmentType: employee.employmentType || 'Full-Time',
        payFrequency: employee.payFrequency || '',
        salary: employee.salary || '',
        
        ssn: employee.ssn || '',
        driversLicenseNumber: employee.driversLicenseNumber || '',
        driversLicenseState: employee.driversLicenseState || '',
        driversLicenseExpiration: employee.driversLicenseExpiration ? employee.driversLicenseExpiration.split('T')[0] : '',
        nursingLicenseNumber: employee.nursingLicenseNumber || '',
        nursingLicenseState: employee.nursingLicenseState || '',
        nursingLicenseExpiration: employee.nursingLicenseExpiration ? employee.nursingLicenseExpiration.split('T')[0] : '',
        
        isEligibleForPTO: employee.isEligibleForPTO || false,
        ptoBalance: employee.ptoBalance || 0,
        isEligibleForInsurance: employee.isEligibleForInsurance || false,
        isEligibleForDental: employee.isEligibleForDental || false,
        isEligibleForVision: employee.isEligibleForVision || false,
        isEligibleForLife: employee.isEligibleForLife || false,
        isEligibleFor403B: employee.isEligibleFor403B || false
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Prepare data for API
      const requestData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth || null,
        driversLicenseExpiration: formData.driversLicenseExpiration || null,
        nursingLicenseExpiration: formData.nursingLicenseExpiration || null,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
        managerId: formData.managerId ? parseInt(formData.managerId) : null,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        ptoBalance: formData.ptoBalance ? parseFloat(formData.ptoBalance) : 0
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
        disabled={loading}
        variant="contained"
        startIcon={<SaveIcon />}
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
      maxWidth="md"
      actions={modalActions}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={600} color="primary">
            Personal Information
          </Typography>
          <Divider sx={{ mt: 1, mb: 2 }} />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="First Name"
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="Last Name"
            name="lastName"
            value={formData.lastName || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Middle Name"
            name="middleName"
            value={formData.middleName || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth || ''}
            onChange={handleChange}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            label="Gender"
            name="gender"
            value={formData.gender || ''}
            onChange={handleChange}
            disabled={loading}
          >
            <MenuItem value="">Select Gender</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            label="Marital Status"
            name="maritalStatus"
            value={formData.maritalStatus || ''}
            onChange={handleChange}
            disabled={loading}
          >
            <MenuItem value="">Select Status</MenuItem>
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Married">Married</MenuItem>
            <MenuItem value="Divorced">Divorced</MenuItem>
            <MenuItem value="Widowed">Widowed</MenuItem>
          </TextField>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mt: 2 }}>
            Contact Information
          </Typography>
          <Divider sx={{ mt: 1, mb: 2 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber || ''}
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
            value={formData.personalEmail || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={formData.state || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Zip Code"
            name="zipCode"
            value={formData.zipCode || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>

        {/* Emergency Contact */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mt: 2 }}>
            Emergency Contact
          </Typography>
          <Divider sx={{ mt: 1, mb: 2 }} />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Emergency Contact Name"
            name="emergencyContactName"
            value={formData.emergencyContactName || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Emergency Contact Phone"
            name="emergencyContactPhone"
            value={formData.emergencyContactPhone || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Relationship"
            name="emergencyContactRelationship"
            value={formData.emergencyContactRelationship || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>

        {/* Employment Details */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mt: 2 }}>
            Employment Details
          </Typography>
          <Divider sx={{ mt: 1, mb: 2 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Job Title"
            name="jobTitle"
            value={formData.jobTitle || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            required
            label="Employee Type"
            name="employeeType"
            value={formData.employeeType || ''}
            onChange={handleChange}
            disabled={loading}
          >
            <MenuItem value="AdminStaff">Admin Staff</MenuItem>
            <MenuItem value="FieldStaff">Field Staff</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            required
            label="Employment Type"
            name="employmentType"
            value={formData.employmentType || ''}
            onChange={handleChange}
            disabled={loading}
          >
            <MenuItem value="Full-Time">Full-Time</MenuItem>
            <MenuItem value="Part-Time">Part-Time</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Salary"
            name="salary"
            type="number"
            value={formData.salary || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>

        {/* Benefits */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mt: 2 }}>
            Benefits Eligibility
          </Typography>
          <Divider sx={{ mt: 1, mb: 2 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isEligibleForPTO || false}
                onChange={handleChange}
                name="isEligibleForPTO"
                disabled={loading}
              />
            }
            label="Eligible for PTO"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isEligibleForInsurance || false}
                onChange={handleChange}
                name="isEligibleForInsurance"
                disabled={loading}
              />
            }
            label="Eligible for Health Insurance"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isEligibleForDental || false}
                onChange={handleChange}
                name="isEligibleForDental"
                disabled={loading}
              />
            }
            label="Eligible for Dental"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isEligibleForVision || false}
                onChange={handleChange}
                name="isEligibleForVision"
                disabled={loading}
              />
            }
            label="Eligible for Vision"
          />
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default EditEmployeeModal;