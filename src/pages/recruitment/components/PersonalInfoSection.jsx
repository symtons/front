// src/pages/recruitment/components/PersonalInfoSection.jsx
/**
 * PersonalInfoSection Component - Step 1 (OUTSIDE GRID APPROACH)
 * 
 * SOLUTION: Put section headers OUTSIDE the Grid container
 * This bypasses Material-UI Grid's flex behavior entirely
 */

import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  MenuItem,
  Alert,
  Box
} from '@mui/material';
import { US_STATES } from '../models/jobApplicationModels';

const PersonalInfoSection = ({ formData, onChange, errors = {} }) => {
  
  const handleChange = (e) => {
    onChange(e);
  };

  // Section header component
  const SectionHeader = ({ children }) => (
    <Box
      sx={{
        py: 1.5,
        px: 2,
        backgroundColor: '#f0f4ff',
        borderRadius: 1,
        borderLeft: '4px solid #667eea',
        mb: 2,
        mt: 3
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#667eea', m: 0 }}>
        {children}
      </Typography>
    </Box>
  );

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
        Personal Information
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Please fill out this application completely. All information must be entered on the application form 
        to be considered for employment - even if resume is attached. Application will be kept on file for 90 days.
      </Alert>

      {/* APPLICATION DATE */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Application Date"
            name="applicationDate"
            type="date"
            value={formData.applicationDate || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
            error={!!errors.applicationDate}
            helperText={errors.applicationDate}
          />
        </Grid>
      </Grid>

      {/* NAME SECTION */}
      <SectionHeader>Name</SectionHeader>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName || ''}
            onChange={handleChange}
            required
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleChange}
            required
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Middle Name"
            name="middleName"
            value={formData.middleName || ''}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      {/* HOME ADDRESS SECTION */}
      <SectionHeader>Home Address</SectionHeader>
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <TextField
            fullWidth
            label="Street Address"
            name="homeAddress"
            value={formData.homeAddress || ''}
            onChange={handleChange}
            required
            error={!!errors.homeAddress}
            helperText={errors.homeAddress}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Apt/Unit #"
            name="aptNumber"
            value={formData.aptNumber || ''}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            required
            error={!!errors.city}
            helperText={errors.city}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="State"
            name="state"
            value={formData.state || ''}
            onChange={handleChange}
            required
            error={!!errors.state}
            helperText={errors.state}
          >
            {US_STATES.map(state => (
              <MenuItem key={state.value} value={state.value}>
                {state.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Zip Code"
            name="zipCode"
            value={formData.zipCode || ''}
            onChange={handleChange}
            required
            error={!!errors.zipCode}
            helperText={errors.zipCode}
          />
        </Grid>
      </Grid>

      {/* IDENTIFICATION SECTION */}
      <SectionHeader>Identification</SectionHeader>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Social Security Number"
            name="socialSecurityNumber"
            value={formData.socialSecurityNumber || ''}
            onChange={handleChange}
            placeholder="XXX-XX-XXXX"
            required
            error={!!errors.socialSecurityNumber}
            helperText={errors.socialSecurityNumber || 'Format: XXX-XX-XXXX'}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Driver's License #"
            name="driversLicenseNumber"
            value={formData.driversLicenseNumber || ''}
            onChange={handleChange}
            required
            error={!!errors.driversLicenseNumber}
            helperText={errors.driversLicenseNumber}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            select
            fullWidth
            label="State"
            name="driversLicenseState"
            value={formData.driversLicenseState || ''}
            onChange={handleChange}
            required
            error={!!errors.driversLicenseState}
            helperText={errors.driversLicenseState}
          >
            {US_STATES.map(state => (
              <MenuItem key={state.value} value={state.value}>
                {state.value}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* CONTACT INFORMATION SECTION */}
      <SectionHeader>Contact Information</SectionHeader>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber || ''}
            onChange={handleChange}
            placeholder="(XXX) XXX-XXXX"
            required
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Cell Number"
            name="cellNumber"
            value={formData.cellNumber || ''}
            onChange={handleChange}
            placeholder="(XXX) XXX-XXXX"
            error={!!errors.cellNumber}
            helperText={errors.cellNumber}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder=""
            
          />
        </Grid>
      </Grid>

      {/* EMERGENCY CONTACT SECTION */}
      <SectionHeader>Emergency Contact</SectionHeader>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Emergency Contact Person"
            name="emergencyContactPerson"
            value={formData.emergencyContactPerson || ''}
            onChange={handleChange}
            required
            error={!!errors.emergencyContactPerson}
            helperText={errors.emergencyContactPerson}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Relationship"
            name="emergencyContactRelationship"
            value={formData.emergencyContactRelationship || ''}
            onChange={handleChange}
            required
            error={!!errors.emergencyContactRelationship}
            helperText={errors.emergencyContactRelationship}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Emergency Contact Address"
            name="emergencyContactAddress"
            value={formData.emergencyContactAddress || ''}
            onChange={handleChange}
            placeholder="Full address"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Emergency Contact Phone"
            name="emergencyContactPhone"
            value={formData.emergencyContactPhone || ''}
            onChange={handleChange}
            placeholder="(XXX) XXX-XXXX"
            required
            error={!!errors.emergencyContactPhone}
            helperText={errors.emergencyContactPhone}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#666' }}>
          <strong>TPA, Inc. is an Equal Opportunity Employer</strong><br />
          Tennessee Law Prohibits Discrimination in Employment: It is illegal to discriminate against any person 
          because of race, color, creed, religion, sex, age, handicap, or national origin in recruitment, training, 
          hiring, discharge, promotion, or any condition, term or privilege of employment.
        </Typography>
      </Box>
    </>
  );
};

export default PersonalInfoSection;