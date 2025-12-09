// src/pages/hr-actions/components/InsuranceForm.jsx
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
  HealthAndSafety as InsuranceIcon,
  AttachMoney as MoneyIcon,
  Favorite as HealthIcon,
  Savings as RetirementIcon
} from '@mui/icons-material';

const InsuranceForm = ({ formData, onChange, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value
    });
  };

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 4, fontSize: '1rem' }}>
        Select the benefits you want to enroll in, change, or cancel. Leave blank for no change.
      </Alert>

      {/* HEALTH INSURANCE */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#667eea', mb: 3 }}>
          <HealthIcon /> Health Insurance
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="healthInsuranceChange"
              label="Health Insurance Action *"
              select
              value={formData.healthInsuranceChange || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.healthInsuranceChange}
              helperText={errors.healthInsuranceChange || 'Select an action'}
              SelectProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            >
              <MenuItem value="" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                No Change
              </MenuItem>
              <MenuItem value="Enroll" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Enroll
              </MenuItem>
              <MenuItem value="Change" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Change Plan
              </MenuItem>
              <MenuItem value="Cancel" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Cancel Coverage
              </MenuItem>
            </TextField>
          </Grid>

          {formData.healthInsuranceChange && formData.healthInsuranceChange !== 'Cancel' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="healthInsurancePlan"
                  label="Health Insurance Plan"
                  select
                  value={formData.healthInsurancePlan || ''}
                  onChange={handleChange}
                  fullWidth
                  SelectProps={{
                    style: { fontSize: '1.2rem', height: '60px' }
                  }}
                >
                  <MenuItem value="Individual" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                    Individual
                  </MenuItem>
                  <MenuItem value="Family" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                    Family (Employee + Spouse/Children)
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="healthInsuranceDeduction"
                  label="Monthly Deduction"
                  type="number"
                  value={formData.healthInsuranceDeduction || ''}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon color="primary" />
                      </InputAdornment>
                    ),
                    style: { fontSize: '1.2rem', height: '60px' }
                  }}
                  placeholder="0.00"
                />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* DENTAL INSURANCE */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6AB4A8', mb: 3 }}>
          <InsuranceIcon /> Dental Insurance
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="dentalInsuranceChange"
              label="Dental Insurance Action"
              select
              value={formData.dentalInsuranceChange || ''}
              onChange={handleChange}
              fullWidth
              SelectProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            >
              <MenuItem value="" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                No Change
              </MenuItem>
              <MenuItem value="Enroll" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Enroll
              </MenuItem>
              <MenuItem value="Change" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Change Plan
              </MenuItem>
              <MenuItem value="Cancel" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Cancel Coverage
              </MenuItem>
            </TextField>
          </Grid>

          {formData.dentalInsuranceChange && formData.dentalInsuranceChange !== 'Cancel' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="dentalInsurancePlan"
                  label="Dental Insurance Plan"
                  select
                  value={formData.dentalInsurancePlan || ''}
                  onChange={handleChange}
                  fullWidth
                  SelectProps={{
                    style: { fontSize: '1.2rem', height: '60px' }
                  }}
                >
                  <MenuItem value="Individual" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                    Individual
                  </MenuItem>
                  <MenuItem value="Family" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                    Family
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="dentalInsuranceDeduction"
                  label="Monthly Deduction"
                  type="number"
                  value={formData.dentalInsuranceDeduction || ''}
                  onChange={handleChange}
                  fullWidth
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
            </>
          )}
        </Grid>
      </Paper>

      {/* 403(b) RETIREMENT */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#FDB94E', mb: 3 }}>
          <RetirementIcon /> 403(b) Retirement Plan
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="retirement403bEnroll"
              label="403(b) Action"
              select
              value={formData.retirement403bEnroll || ''}
              onChange={handleChange}
              fullWidth
              SelectProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            >
              <MenuItem value="" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                No Change
              </MenuItem>
              <MenuItem value="Enroll" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Enroll
              </MenuItem>
              <MenuItem value="Change" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Change Contribution
              </MenuItem>
              <MenuItem value="Cancel" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Stop Contributions
              </MenuItem>
            </TextField>
          </Grid>

          {formData.retirement403bEnroll && formData.retirement403bEnroll !== 'Cancel' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="retirement403bDeduction"
                  label="Contribution Amount"
                  type="number"
                  value={formData.retirement403bDeduction || ''}
                  onChange={handleChange}
                  fullWidth
                  helperText="Per paycheck or percentage"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon sx={{ color: '#FDB94E' }} />
                      </InputAdornment>
                    ),
                    style: { fontSize: '1.2rem', height: '60px' }
                  }}
                  placeholder="0.00"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="retirement403bType"
                  label="Contribution Type"
                  select
                  value={formData.retirement403bType || 'Percentage'}
                  onChange={handleChange}
                  fullWidth
                  SelectProps={{
                    style: { fontSize: '1.2rem', height: '60px' }
                  }}
                >
                  <MenuItem value="Percentage" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                    Percentage (%)
                  </MenuItem>
                  <MenuItem value="Fixed" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                    Fixed Amount ($)
                  </MenuItem>
                </TextField>
              </Grid>
            </>
          )}

          <Grid item xs={12} sm={6}>
            <TextField
              name="insuranceEffectiveDate"
              label="Effective Date *"
              type="date"
              value={formData.insuranceEffectiveDate || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.insuranceEffectiveDate}
              helperText={errors.insuranceEffectiveDate || 'When should these changes take effect?'}
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
              label="Reason for Insurance Changes *"
              multiline
              rows={6}
              value={formData.reason || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.reason}
              helperText={errors.reason || 'Minimum 10 characters - explain the reason for these benefit changes'}
              placeholder="Explain the reason for these insurance/benefit changes (e.g., life event, marriage, birth, new hire enrollment)"
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
              placeholder="Any additional information about these benefit changes"
              InputProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Alert severity="warning" sx={{ fontSize: '1rem' }}>
        <strong>Important:</strong> Some insurance changes require qualifying life events (marriage, birth, etc.) and may need supporting documentation.
      </Alert>
    </Box>
  );
};

export default InsuranceForm;