// src/pages/employees/EditEmployeeModal.jsx
// COMPLETE VERSION - ALL FIELDS from Employees table
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
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import {
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import CustomModal from '../../components/common/feedback/CustomModal';
import { employeeService } from '../../services/employeeService';

const EditEmployeeModal = ({ open, onClose, employee, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Initialize form data when employee changes
  useEffect(() => {
    console.log('📋 Employee data received:', employee);
    
    if (employee && open) {
      setFormData({
        // Personal Information
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        middleName: employee.middleName || '',
        dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split('T')[0] : '',
        gender: employee.gender || '',
        maritalStatus: employee.maritalStatus || '',
        
        // Contact Information
        phoneNumber: employee.phoneNumber || '',
        personalEmail: employee.personalEmail || '',
        address: employee.address || '',
        city: employee.city || '',
        state: employee.state || '',
        zipCode: employee.zipCode || '',
        country: employee.country || 'USA',
        
        // Emergency Contact
        emergencyContactName: employee.emergencyContactName || '',
        emergencyContactPhone: employee.emergencyContactPhone || '',
        emergencyContactRelationship: employee.emergencyContactRelationship || '',
        
        // Employment Details
        departmentId: employee.department?.departmentId || employee.departmentId || null,
        managerId: employee.manager?.employeeId || employee.managerId || null,
        jobTitle: employee.jobTitle || '',
        employeeType: employee.employeeType || 'AdminStaff',
        employmentStatus: employee.employmentStatus || 'Active',
        employmentType: employee.employmentType || 'Full-Time',
        hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
        terminationDate: employee.terminationDate ? employee.terminationDate.split('T')[0] : '',
        salary: employee.salary || '',
        payFrequency: employee.payFrequency || '',
        workHoursCategory: employee.workHoursCategory || '',
        
        // Banking Information
        bankName: employee.bankName || '',
        bankAccountNumber: employee.bankAccountNumber || '',
        bankRoutingNumber: employee.bankRoutingNumber || '',
        
        // License Information
        ssn: employee.ssn || '',
        driversLicenseNumber: employee.driversLicenseNumber || '',
        driversLicenseState: employee.driversLicenseState || '',
        driversLicenseExpiration: employee.driversLicenseExpiration ? employee.driversLicenseExpiration.split('T')[0] : '',
        nursingLicenseNumber: employee.nursingLicenseNumber || '',
        nursingLicenseState: employee.nursingLicenseState || '',
        nursingLicenseExpiration: employee.nursingLicenseExpiration ? employee.nursingLicenseExpiration.split('T')[0] : '',
        
        // Benefits Eligibility
        isEligibleForPTO: employee.isEligibleForPTO || false,
        ptoBalance: employee.ptoBalance || 0,
        isEligibleForInsurance: employee.isEligibleForInsurance || false,
        isEligibleForDental: employee.isEligibleForDental || false,
        isEligibleForVision: employee.isEligibleForVision || false,
        isEligibleForLife: employee.isEligibleForLife || false,
        isEligibleFor403B: employee.isEligibleFor403B || false,
        
        // Termination (if applicable)
        terminationReason: employee.terminationReason || '',
        terminationType: employee.terminationType || '',
        isEligibleForRehire: employee.isEligibleForRehire || false
      });
      
      console.log('✅ Form data initialized');
    }
  }, [employee, open]);

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
      
      console.log('💾 Saving employee...', formData);
      
      // Prepare data for API
      const requestData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth || null,
        hireDate: formData.hireDate || null,
        terminationDate: formData.terminationDate || null,
        driversLicenseExpiration: formData.driversLicenseExpiration || null,
        nursingLicenseExpiration: formData.nursingLicenseExpiration || null,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
        managerId: formData.managerId ? parseInt(formData.managerId) : null,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        ptoBalance: formData.ptoBalance ? parseFloat(formData.ptoBalance) : 0
      };

      await employeeService.updateEmployee(employee.employeeId, requestData);
      
      console.log('✅ Employee updated successfully');
      onSuccess && onSuccess('Employee updated successfully!');
      onClose();
    } catch (err) {
      console.error('❌ Error updating employee:', err);
      setError(err.message || 'Failed to update employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      setActiveTab(0);
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
      maxWidth="lg"
      actions={modalActions}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabs for organized sections */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="Personal" />
        <Tab label="Contact" />
        <Tab label="Employment" />
        <Tab label="Banking" />
        <Tab label="Licenses" />
        <Tab label="Benefits" />
      </Tabs>

      {/* TAB 1: Personal Information */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
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
        </Grid>
      )}

      {/* TAB 2: Contact Information */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
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

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} color="primary">
              Emergency Contact
            </Typography>
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
        </Grid>
      )}

      {/* TAB 3: Employment Details */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
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
              label="Employment Status"
              name="employmentStatus"
              value={formData.employmentStatus || ''}
              onChange={handleChange}
              disabled={loading}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="OnLeave">On Leave</MenuItem>
              <MenuItem value="Terminated">Terminated</MenuItem>
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
              label="Hire Date"
              name="hireDate"
              type="date"
              value={formData.hireDate || ''}
              onChange={handleChange}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Termination Date"
              name="terminationDate"
              type="date"
              value={formData.terminationDate || ''}
              onChange={handleChange}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
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

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Pay Frequency"
              name="payFrequency"
              value={formData.payFrequency || ''}
              onChange={handleChange}
              disabled={loading}
            >
              <MenuItem value="">Select Frequency</MenuItem>
              <MenuItem value="Hourly">Hourly</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
              <MenuItem value="Bi-Weekly">Bi-Weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Work Hours Category"
              name="workHoursCategory"
              value={formData.workHoursCategory || ''}
              onChange={handleChange}
              disabled={loading}
            >
              <MenuItem value="">Select Category</MenuItem>
              <MenuItem value="Full-Time">Full-Time</MenuItem>
              <MenuItem value="Part-Time">Part-Time</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      )}

      {/* TAB 4: Banking Information */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Banking information is sensitive. Only update if necessary.
            </Alert>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bank Name"
              name="bankName"
              value={formData.bankName || ''}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Bank Account Number"
              name="bankAccountNumber"
              value={formData.bankAccountNumber || ''}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Bank Routing Number"
              name="bankRoutingNumber"
              value={formData.bankRoutingNumber || ''}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
        </Grid>
      )}

      {/* TAB 5: License Information */}
      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" fontWeight={600}>
              Identification
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="SSN"
              name="ssn"
              value={formData.ssn || ''}
              onChange={handleChange}
              disabled={loading}
              placeholder="XXX-XX-XXXX"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ mt: 2 }}>
              Driver's License
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Driver's License Number"
              name="driversLicenseNumber"
              value={formData.driversLicenseNumber || ''}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="License State"
              name="driversLicenseState"
              value={formData.driversLicenseState || ''}
              onChange={handleChange}
              disabled={loading}
              placeholder="TN"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="License Expiration"
              name="driversLicenseExpiration"
              type="date"
              value={formData.driversLicenseExpiration || ''}
              onChange={handleChange}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary" fontWeight={600} sx={{ mt: 2 }}>
              Nursing License
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Nursing License Number"
              name="nursingLicenseNumber"
              value={formData.nursingLicenseNumber || ''}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="License State"
              name="nursingLicenseState"
              value={formData.nursingLicenseState || ''}
              onChange={handleChange}
              disabled={loading}
              placeholder="TN"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="License Expiration"
              name="nursingLicenseExpiration"
              type="date"
              value={formData.nursingLicenseExpiration || ''}
              onChange={handleChange}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      )}

      {/* TAB 6: Benefits Eligibility */}
      {activeTab === 5 && (
        <Grid container spacing={3}>
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
            <TextField
              fullWidth
              label="PTO Balance (Days)"
              name="ptoBalance"
              type="number"
              value={formData.ptoBalance || 0}
              onChange={handleChange}
              disabled={loading}
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

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isEligibleForLife || false}
                  onChange={handleChange}
                  name="isEligibleForLife"
                  disabled={loading}
                />
              }
              label="Eligible for Life Insurance"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isEligibleFor403B || false}
                  onChange={handleChange}
                  name="isEligibleFor403B"
                  disabled={loading}
                />
              }
              label="Eligible for 403(b)"
            />
          </Grid>
        </Grid>
      )}
    </CustomModal>
  );
};

export default EditEmployeeModal;