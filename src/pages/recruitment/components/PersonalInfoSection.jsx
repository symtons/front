// src/pages/recruitment/components/PersonalInfoSection.jsx
/**
 * PersonalInfoSection Component
 * 
 * Step 1 of job application form - Personal Information
 */

import React from 'react';
import { Grid, TextField, MenuItem, Typography } from '@mui/material';
import {
  GENDER_OPTIONS,
  STATE_OPTIONS,
  getMaxDateOfBirth
} from '../models/jobApplicationModels';

const PersonalInfoSection = ({ formData, onChange, errors = {} }) => {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
        Personal Information
      </Typography>

      <Grid container spacing={3}>
        {/* Name Fields */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Middle Name"
            name="middleName"
            value={formData.middleName}
            onChange={onChange}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
        </Grid>

        {/* Date of Birth and Gender */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Date of Birth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={onChange}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth || 'Must be at least 16 years old'}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              max: getMaxDateOfBirth()
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={onChange}
          >
            {GENDER_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            type="tel"
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={onChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber || '10 digits (e.g., 6155551234)'}
            placeholder="6155551234"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            type="email"
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={onChange}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>

        {/* Address */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address"
            name="address"
            value={formData.address}
            onChange={onChange}
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={onChange}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            label="State"
            name="state"
            value={formData.state}
            onChange={onChange}
          >
            {STATE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="ZIP Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={onChange}
            error={!!errors.zipCode}
            helperText={errors.zipCode}
            placeholder="12345"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default PersonalInfoSection;