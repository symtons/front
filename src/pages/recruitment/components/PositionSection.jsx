// src/pages/recruitment/components/PositionSection.jsx
/**
 * PositionSection Component - Step 2
 * 
 * Position applied for, salary, availability, location, shifts, and days
 * Matches TPA paper application form
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
  RadioGroup,
  Radio,
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

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
        Position & Availability
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Please specify the position(s) you're applying for and your availability preferences.
      </Alert>

      <Grid container spacing={3}>
        {/* Positions Applied For */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Position(s) Applied For
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Position 1"
            name="position1"
            value={formData.position1 || ''}
            onChange={handleChange}
            required
            error={!!errors.position1}
            helperText={errors.position1}
            placeholder="Primary position of interest"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Position 2 (Optional)"
            name="position2"
            value={formData.position2 || ''}
            onChange={handleChange}
            placeholder="Secondary position of interest"
          />
        </Grid>

        {/* Salary and Employment Type */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, mt: 2 }}>
            Compensation & Employment Type
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4}>
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
            InputProps={{
              startAdornment: '$'
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
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

        <Grid item xs={12} sm={4}>
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

        {/* Employment Type */}
        <Grid item xs={12}>
          <FormControl component="fieldset" error={!!errors.employmentSought}>
            <FormLabel component="legend" sx={{ fontWeight: 600, color: '#333' }}>
              Employment Sought <span style={{ color: '#f44336' }}>*</span>
            </FormLabel>
            <RadioGroup
              row
              name="employmentSought"
              value={formData.employmentSought || ''}
              onChange={handleChange}
            >
              <FormControlLabel value="FullTime" control={<Radio />} label="Full Time" />
              <FormControlLabel value="PartTime" control={<Radio />} label="Part Time" />
              <FormControlLabel value="Temporary" control={<Radio />} label="Temporary" />
            </RadioGroup>
            {errors.employmentSought && (
              <Typography variant="caption" color="error">
                {errors.employmentSought}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Desired Location to Work */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <FormControl component="fieldset" error={!!errors.desiredLocations} fullWidth>
              <FormLabel component="legend" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                Desired Location to Work <span style={{ color: '#f44336' }}>*</span>
              </FormLabel>
              <FormGroup row>
                {LOCATION_OPTIONS.map(location => (
                  <FormControlLabel
                    key={location.value}
                    control={
                      <Checkbox
                        checked={(formData.desiredLocations || []).includes(location.value)}
                        onChange={() => handleCheckboxChange('desiredLocations', location.value)}
                      />
                    }
                    label={location.label}
                  />
                ))}
              </FormGroup>
              {(formData.desiredLocations || []).includes('Other') && (
                <TextField
                  fullWidth
                  label="Other Location"
                  name="desiredLocationOther"
                  value={formData.desiredLocationOther || ''}
                  onChange={handleChange}
                  sx={{ mt: 2 }}
                  placeholder="Please specify"
                />
              )}
              {errors.desiredLocations && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.desiredLocations}
                </Typography>
              )}
            </FormControl>
          </Paper>
        </Grid>

        {/* Shift Sought */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <FormControl component="fieldset" error={!!errors.shiftPreferences} fullWidth>
              <FormLabel component="legend" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                Shift Sought <span style={{ color: '#f44336' }}>*</span>
              </FormLabel>
              <FormGroup row>
                {SHIFT_OPTIONS.map(shift => (
                  <FormControlLabel
                    key={shift.value}
                    control={
                      <Checkbox
                        checked={(formData.shiftPreferences || []).includes(shift.value)}
                        onChange={() => handleCheckboxChange('shiftPreferences', shift.value)}
                      />
                    }
                    label={shift.label}
                  />
                ))}
              </FormGroup>
              {errors.shiftPreferences && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.shiftPreferences}
                </Typography>
              )}
            </FormControl>
          </Paper>
        </Grid>

        {/* Days Available */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <FormControl component="fieldset" error={!!errors.daysAvailable} fullWidth>
              <FormLabel component="legend" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                Days Available <span style={{ color: '#f44336' }}>*</span>
              </FormLabel>
              <FormGroup row>
                {DAYS_OF_WEEK.map(day => (
                  <FormControlLabel
                    key={day.value}
                    control={
                      <Checkbox
                        checked={(formData.daysAvailable || []).includes(day.value)}
                        onChange={() => handleCheckboxChange('daysAvailable', day.value)}
                      />
                    }
                    label={day.label}
                  />
                ))}
              </FormGroup>
              {errors.daysAvailable && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.daysAvailable}
                </Typography>
              )}
            </FormControl>
          </Paper>
        </Grid>

        {/* Important Note */}
        <Grid item xs={12}>
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              *Assignment of days, shifts, and hours are based on company needs without guaranteed permanency
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </>
  );
};

export default PositionSection;