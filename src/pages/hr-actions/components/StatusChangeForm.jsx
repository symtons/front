// src/pages/hr-actions/components/StatusChangeForm.jsx
// PERFECT UI - Professional Layout

import React from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  Box,
  Alert,
  Paper
} from '@mui/material';
import {
  ToggleOn as StatusIcon,
  People as EmploymentIcon
} from '@mui/icons-material';

const StatusChangeForm = ({ formData, onChange, errors, currentEmployee }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value
    });
  };

  return (
    <Box>
      {/* CURRENT STATUS */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#667eea', mb: 3 }}>
          <EmploymentIcon /> Current Status
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Current Employment Type"
              value={currentEmployee?.employmentType || 'N/A'}
              fullWidth
              disabled
              variant="filled"
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Current Marital Status"
              value={currentEmployee?.maritalStatus || 'N/A'}
              fullWidth
              disabled
              variant="filled"
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* NEW STATUS */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6AB4A8', mb: 3 }}>
          <StatusIcon /> New Status Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="newEmploymentType"
              label="New Employment Type"
              select
              value={formData.newEmploymentType || ''}
              onChange={handleChange}
              fullWidth
              error={!!errors.newEmploymentType}
              helperText={errors.newEmploymentType || 'Select new employment type'}
              SelectProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            >
              <MenuItem value="" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                No Change
              </MenuItem>
              <MenuItem value="FT" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Full-Time (FT)
              </MenuItem>
              <MenuItem value="PT" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Part-Time (PT)
              </MenuItem>
              <MenuItem value="PRN" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                PRN (As Needed)
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="newMaritalStatus"
              label="New Marital Status"
              select
              value={formData.newMaritalStatus || ''}
              onChange={handleChange}
              fullWidth
              error={!!errors.newMaritalStatus}
              helperText={errors.newMaritalStatus || 'Select new marital status'}
              SelectProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            >
              <MenuItem value="" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                No Change
              </MenuItem>
              <MenuItem value="Single" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Single
              </MenuItem>
              <MenuItem value="Married" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Married
              </MenuItem>
              <MenuItem value="Divorced" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Divorced
              </MenuItem>
              <MenuItem value="Widowed" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Widowed
              </MenuItem>
              <MenuItem value="Separated" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Separated
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="newClassification"
              label="Pay Classification"
              select
              value={formData.newClassification || ''}
              onChange={handleChange}
              fullWidth
              SelectProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            >
              <MenuItem value="" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                No Change
              </MenuItem>
              <MenuItem value="Salary" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Salaried
              </MenuItem>
              <MenuItem value="Hourly" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Hourly
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="effectiveDate"
              label="Effective Date *"
              type="date"
              value={formData.effectiveDate || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.effectiveDate}
              helperText={errors.effectiveDate || 'Status change effective date'}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* JUSTIFICATION */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#5B8FCC' }}>
          📝 Justification
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="reason"
              label="Reason for Status Change *"
              multiline
              rows={6}
              value={formData.reason || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.reason}
              helperText={errors.reason || 'Minimum 10 characters - explain the reason for this status change'}
              placeholder="Explain the reason for this status change (e.g., change in work hours, marital status update, reclassification)"
              InputProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="notes"
              label="Additional Notes (Optional)"
              multiline
              rows={4}
              value={formData.notes || ''}
              onChange={handleChange}
              fullWidth
              placeholder="Any additional information relevant to this status change"
              InputProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Alert severity="info" sx={{ fontSize: '1rem' }}>
        <strong>Note:</strong> Status changes may affect benefits eligibility. HR will review the impact on PTO, insurance, and other benefits.
      </Alert>

      {!formData.newEmploymentType && !formData.newMaritalStatus && (
        <Alert severity="warning" sx={{ mt: 2, fontSize: '1rem' }}>
          Please select at least one status change (Employment Type or Marital Status).
        </Alert>
      )}
    </Box>
  );
};

export default StatusChangeForm;