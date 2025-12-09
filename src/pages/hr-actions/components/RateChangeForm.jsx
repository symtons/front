// src/pages/hr-actions/components/RateChangeForm.jsx
// Rate Change Form Fields

import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Grid,
  InputAdornment
} from '@mui/material';
import { RATE_TYPE_OPTIONS, formatCurrency } from '../models/hrActionModels';

const RateChangeForm = ({ 
  formData, 
  onChange, 
  errors,
  currentEmployee 
}) => {
  
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        Rate Change Details
      </Typography>

      <Grid container spacing={3}>
        {/* Current Rate (Read-only) */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Current Rate/Salary"
            value={formatCurrency(currentEmployee?.salary || formData.oldRate)}
            disabled
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
          />
        </Grid>

        {/* Current Rate Type (Read-only) */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Current Rate Type"
            value={currentEmployee?.payFrequency || formData.oldRateType || 'N/A'}
            disabled
          />
        </Grid>

        {/* New Rate */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="New Rate/Salary"
            type="number"
            value={formData.newRate || ''}
            onChange={(e) => handleChange('newRate', parseFloat(e.target.value))}
            error={!!errors.newRate}
            helperText={errors.newRate}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
          />
        </Grid>

        {/* New Rate Type */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            select
            label="New Rate Type"
            value={formData.newRateType || ''}
            onChange={(e) => handleChange('newRateType', e.target.value)}
            error={!!errors.newRateType}
            helperText={errors.newRateType}
          >
            {RATE_TYPE_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Premium/Incentive (Optional) */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Premium/Incentive (Optional)"
            value={formData.premiumIncentive || ''}
            onChange={(e) => handleChange('premiumIncentive', e.target.value)}
            placeholder="e.g., Shift differential, performance bonus"
          />
        </Grid>

        {/* Effective Date */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            type="date"
            label="Effective Date"
            value={formData.effectiveDate || ''}
            onChange={(e) => handleChange('effectiveDate', e.target.value)}
            error={!!errors.effectiveDate}
            helperText={errors.effectiveDate}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Reason */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            multiline
            rows={4}
            label="Reason for Rate Change"
            value={formData.reason || ''}
            onChange={(e) => handleChange('reason', e.target.value)}
            error={!!errors.reason}
            helperText={errors.reason || 'Minimum 10 characters'}
            placeholder="Provide detailed reason for the rate change (e.g., annual review, promotion, market adjustment)"
          />
        </Grid>

        {/* Notes (Optional) */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Additional Notes (Optional)"
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Any additional information or comments"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RateChangeForm;