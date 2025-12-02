// src/pages/recruitment/components/PositionSection.jsx
/**
 * PositionSection Component - Step 2 (FINAL CLEAN LAYOUT)
 * 
 * CRITICAL FIX - Section headers with prominent styling:
 * - Full-width background-colored boxes
 * - Clear visual separation
 * - Professional checkbox groupings
 */

import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  Box,
  Paper
} from '@mui/material';
import {
  EMPLOYMENT_TYPE_OPTIONS,
  SALARY_TYPE_OPTIONS,
  LOCATION_OPTIONS,
  SHIFT_OPTIONS,
  DAYS_OF_WEEK
} from '../models/jobApplicationModels';

const PositionSection = ({ formData, onChange, errors = {} }) => {
  
  const handleChange = (e) => {
    onChange(e);
  };

  const handleCheckboxChange = (fieldName, value) => {
    const currentValues = formData[fieldName] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onChange({
      target: {
        name: fieldName,
        value: newValues
      }
    });
  };

  // Section header style
  const sectionHeaderStyle = {
    py: 1,
    px: 2,
    backgroundColor: '#f0f4ff',
    borderRadius: 1,
    borderLeft: '4px solid #667eea',
    mb: 2
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
        Position & Availability
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Please specify the position(s) you're applying for and your availability preferences.
      </Alert>

      <Grid container spacing={3}>
        
        {/* POSITIONS APPLIED FOR */}
        <Grid item xs={12}>
          <Box sx={sectionHeaderStyle}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#667eea', m: 0 }}>
              Position(s) Applied For
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Position 1 (Primary)"
            name="position1"
            value={formData.position1 || ''}
            onChange={handleChange}
            required
            error={!!errors.position1}
            helperText={errors.position1 || 'Primary position of interest'}
            placeholder="e.g., Registered Nurse, Caregiver, etc."
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Position 2 (Optional)"
            name="position2"
            value={formData.position2 || ''}
            onChange={handleChange}
            placeholder="Secondary position of interest"
          />
        </Grid>

        {/* COMPENSATION & EMPLOYMENT */}
        <Grid item xs={12}>
          <Box sx={sectionHeaderStyle}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#667eea', m: 0 }}>
              Compensation & Employment Type
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Salary Desired"
            name="salaryDesired"
            type="number"
            value={formData.salaryDesired || ''}
            onChange={handleChange}
            required
            error={!!errors.salaryDesired}
            helperText={errors.salaryDesired}
            placeholder="Enter amount"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="Salary Type"
            name="salaryType"
            value={formData.salaryType || ''}
            onChange={handleChange}
            required
            error={!!errors.salaryType}
            helperText={errors.salaryType}
          >
            {SALARY_TYPE_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="Employment Type"
            name="employmentSought"
            value={formData.employmentSought || ''}
            onChange={handleChange}
            required
            error={!!errors.employmentSought}
            helperText={errors.employmentSought}
          >
            {EMPLOYMENT_TYPE_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Available Start Date"
            name="availableStartDate"
            type="date"
            value={formData.availableStartDate || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
            error={!!errors.availableStartDate}
            helperText={errors.availableStartDate}
          />
        </Grid>
        <Grid item xs={12} md={6} />

        {/* LOCATION PREFERENCES */}
        <Grid item xs={12}>
          <Box sx={sectionHeaderStyle}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#667eea', m: 0 }}>
              Location Preferences
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <FormControl component="fieldset" fullWidth error={!!errors.desiredLocations}>
              <FormLabel 
                component="legend" 
                sx={{ mb: 1.5, fontWeight: 500, color: 'text.primary' }}
              >
                Select Desired Locations (check all that apply)
              </FormLabel>
              <FormGroup row>
                {LOCATION_OPTIONS.map(location => (
                  <FormControlLabel
                    key={location.value}
                    control={
                      <Checkbox
                        checked={(formData.desiredLocations || []).includes(location.value)}
                        onChange={() => handleCheckboxChange('desiredLocations', location.value)}
                        sx={{ color: errors.desiredLocations ? 'error.main' : 'primary.main' }}
                      />
                    }
                    label={location.label}
                    sx={{ minWidth: '160px', mb: 0.5 }}
                  />
                ))}
              </FormGroup>
              {errors.desiredLocations && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.desiredLocations}
                </Typography>
              )}
            </FormControl>

            {(formData.desiredLocations || []).includes('Other') && (
              <TextField
                fullWidth
                label="Please Specify Other Location"
                name="desiredLocationOther"
                value={formData.desiredLocationOther || ''}
                onChange={handleChange}
                sx={{ mt: 2 }}
                required={formData.desiredLocations?.includes('Other')}
                error={!!errors.desiredLocationOther}
                helperText={errors.desiredLocationOther}
              />
            )}
          </Paper>
        </Grid>

        {/* SHIFT PREFERENCES */}
        <Grid item xs={12}>
          <Box sx={sectionHeaderStyle}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#667eea', m: 0 }}>
              Shift Preferences
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <FormControl component="fieldset" fullWidth error={!!errors.shiftPreferences}>
              <FormLabel 
                component="legend" 
                sx={{ mb: 1.5, fontWeight: 500, color: 'text.primary' }}
              >
                Select Preferred Shifts (check all that apply)
              </FormLabel>
              <FormGroup row>
                {SHIFT_OPTIONS.map(shift => (
                  <FormControlLabel
                    key={shift.value}
                    control={
                      <Checkbox
                        checked={(formData.shiftPreferences || []).includes(shift.value)}
                        onChange={() => handleCheckboxChange('shiftPreferences', shift.value)}
                        sx={{ color: errors.shiftPreferences ? 'error.main' : 'primary.main' }}
                      />
                    }
                    label={shift.label}
                    sx={{ minWidth: '180px', mb: 0.5 }}
                  />
                ))}
              </FormGroup>
              {errors.shiftPreferences && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.shiftPreferences}
                </Typography>
              )}
            </FormControl>
          </Paper>
        </Grid>

        {/* DAYS AVAILABLE */}
        <Grid item xs={12}>
          <Box sx={sectionHeaderStyle}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#667eea', m: 0 }}>
              Days Available to Work
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <FormControl component="fieldset" fullWidth error={!!errors.daysAvailable}>
              <FormLabel 
                component="legend" 
                sx={{ mb: 1.5, fontWeight: 500, color: 'text.primary' }}
              >
                Select All Days You Can Work
              </FormLabel>
              <FormGroup row>
                {DAYS_OF_WEEK.map(day => (
                  <FormControlLabel
                    key={day.value}
                    control={
                      <Checkbox
                        checked={(formData.daysAvailable || []).includes(day.value)}
                        onChange={() => handleCheckboxChange('daysAvailable', day.value)}
                        sx={{ color: errors.daysAvailable ? 'error.main' : 'primary.main' }}
                      />
                    }
                    label={day.label}
                    sx={{ minWidth: '110px', mb: 0.5 }}
                  />
                ))}
              </FormGroup>
              {errors.daysAvailable && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.daysAvailable}
                </Typography>
              )}
            </FormControl>
          </Paper>
        </Grid>

      </Grid>
    </>
  );
};

export default PositionSection;