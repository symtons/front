// src/pages/hr-actions/components/PromotionForm.jsx
// PERFECT UI - Professional Layout

import React from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  Box,
  Alert,
  InputAdornment,
  Paper
} from '@mui/material';
import {
  TrendingUp as PromotionIcon,
  AttachMoney as MoneyIcon,
  WorkOutline as JobIcon
} from '@mui/icons-material';

const PromotionForm = ({ formData, onChange, errors, currentEmployee }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value
    });
  };

  return (
    <Box>
      {/* CURRENT POSITION */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#667eea', mb: 3 }}>
          <JobIcon /> Current Position
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Current Job Title"
              value={currentEmployee?.jobTitle || 'N/A'}
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
              label="Current Salary/Rate"
              value={currentEmployee?.salary ? `$${currentEmployee.salary.toLocaleString()}` : 'N/A'}
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
              label="Current Pay Type"
              value={currentEmployee?.payFrequency || 'N/A'}
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
              label="Current Department"
              value={currentEmployee?.department || 'N/A'}
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

      {/* NEW PROMOTION DETAILS */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6AB4A8', mb: 3 }}>
          <PromotionIcon /> New Promotion Details
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="newJobTitle"
              label="New Job Title *"
              value={formData.newJobTitle || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.newJobTitle}
              helperText={errors.newJobTitle || 'Enter the new job title'}
              placeholder="e.g., Senior Nurse, Program Director"
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="newRate"
              label="New Salary/Rate *"
              type="number"
              value={formData.newRate || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.newRate}
              helperText={errors.newRate || 'Enter the new salary or hourly rate'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon color="success" />
                  </InputAdornment>
                ),
                style: { fontSize: '1.2rem', height: '60px' }
              }}
              placeholder="0.00"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="newRateType"
              label="New Pay Type *"
              select
              value={formData.newRateType || currentEmployee?.payFrequency || 'Salary'}
              onChange={handleChange}
              fullWidth
              required
              SelectProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            >
              <MenuItem value="Salary" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Salary (Annual)
              </MenuItem>
              <MenuItem value="Hourly" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Hourly
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="newDepartment"
              label="New Department (if changing)"
              value={formData.newDepartment || ''}
              onChange={handleChange}
              fullWidth
              placeholder="Leave blank if staying in same department"
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
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
              helperText={errors.effectiveDate || 'Promotion effective date'}
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
              label="Reason for Promotion *"
              multiline
              rows={6}
              value={formData.reason || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.reason}
              helperText={errors.reason || 'Minimum 10 characters - explain the justification for this promotion'}
              placeholder="Explain the reason for this promotion (e.g., performance excellence, additional responsibilities, career advancement)"
              InputProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="newResponsibilities"
              label="New Responsibilities"
              multiline
              rows={4}
              value={formData.newResponsibilities || ''}
              onChange={handleChange}
              fullWidth
              placeholder="Describe any new responsibilities or duties that come with this position"
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
              rows={3}
              value={formData.notes || ''}
              onChange={handleChange}
              fullWidth
              placeholder="Any additional information relevant to this promotion"
              InputProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Alert severity="info" sx={{ fontSize: '1rem' }}>
        <strong>Note:</strong> Promotions require approval from both HR and Finance departments due to salary changes.
      </Alert>
    </Box>
  );
};

export default PromotionForm;