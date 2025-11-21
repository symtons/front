// src/pages/recruitment/components/PositionSection.jsx
/**
 * PositionSection Component
 * 
 * Step 2 of job application form - Position & Preferences
 */

import React from 'react';
import { 
  Grid, 
  TextField, 
  MenuItem, 
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox
} from '@mui/material';
import {
  EMPLOYEE_TYPE_OPTIONS,
  DEPARTMENT_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  AVAILABILITY_OPTIONS,
  HOW_HEARD_OPTIONS,
  getTodayString
} from '../models/jobApplicationModels';

const PositionSection = ({ formData, onChange, errors = {} }) => {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
        Position & Preferences
      </Typography>

      <Grid container spacing={3}>
        {/* Position Applied For */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Position Applying For"
            name="positionAppliedFor"
            value={formData.positionAppliedFor}
            onChange={onChange}
            error={!!errors.positionAppliedFor}
            helperText={errors.positionAppliedFor || 'e.g., Field Operator, HR Coordinator'}
            placeholder="Field Operator"
          />
        </Grid>

        {/* Department Preference */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Department Preference"
            name="departmentPreference"
            value={formData.departmentPreference}
            onChange={onChange}
          >
            {DEPARTMENT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Employee Type Preference */}
        <Grid item xs={12}>
          <FormControl component="fieldset" required error={!!errors.preferredEmployeeType}>
            <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>
              Employee Type Preference *
            </FormLabel>
            <RadioGroup
              row
              name="preferredEmployeeType"
              value={formData.preferredEmployeeType}
              onChange={onChange}
            >
              <FormControlLabel
                value="AdminStaff"
                control={<Radio />}
                label="Admin Staff (Office-based, eligible for full benefits)"
              />
              <FormControlLabel
                value="FieldStaff"
                control={<Radio />}
                label="Field Staff (On-site support)"
              />
            </RadioGroup>
            {errors.preferredEmployeeType && (
              <Typography variant="caption" sx={{ color: '#d32f2f', mt: 0.5 }}>
                {errors.preferredEmployeeType}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Expected Start Date and Desired Salary */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Expected Start Date"
            name="expectedStartDate"
            value={formData.expectedStartDate}
            onChange={onChange}
            error={!!errors.expectedStartDate}
            helperText={errors.expectedStartDate}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: getTodayString()
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Desired Salary (Annual)"
            name="desiredSalary"
            value={formData.desiredSalary}
            onChange={onChange}
            error={!!errors.desiredSalary}
            helperText={errors.desiredSalary}
            InputProps={{
              startAdornment: <span style={{ marginRight: 4 }}>$</span>
            }}
            placeholder="50000"
          />
        </Grid>

        {/* Years of Experience and Education Level */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Years of Experience"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={onChange}
            error={!!errors.yearsOfExperience}
            helperText={errors.yearsOfExperience}
            inputProps={{ min: 0, max: 50 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Education Level"
            name="educationLevel"
            value={formData.educationLevel}
            onChange={onChange}
          >
            {EDUCATION_LEVEL_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Certifications */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Certifications"
            name="certifications"
            value={formData.certifications}
            onChange={onChange}
            helperText="List any relevant certifications (comma-separated)"
            placeholder="CPR, First Aid, CNA"
          />
        </Grid>

        {/* Previous Employer */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Previous/Current Employer"
            name="previousEmployer"
            value={formData.previousEmployer}
            onChange={onChange}
            placeholder="Company Name"
          />
        </Grid>

        {/* Skills */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Skills & Qualifications"
            name="skills"
            value={formData.skills}
            onChange={onChange}
            helperText="Describe your relevant skills and qualifications"
            placeholder="Patient care, scheduling, communication..."
          />
        </Grid>

        {/* Availability Type */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Availability"
            name="availabilityType"
            value={formData.availabilityType}
            onChange={onChange}
          >
            {AVAILABILITY_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* How Did You Hear */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="How did you hear about us?"
            name="howDidYouHear"
            value={formData.howDidYouHear}
            onChange={onChange}
          >
            {HOW_HEARD_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Willing to Relocate */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="willingToRelocate"
                checked={formData.willingToRelocate}
                onChange={(e) => onChange({
                  target: {
                    name: 'willingToRelocate',
                    value: e.target.checked
                  }
                })}
              />
            }
            label="I am willing to relocate if necessary"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default PositionSection;