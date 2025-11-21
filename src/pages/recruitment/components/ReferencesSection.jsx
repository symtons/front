// src/pages/recruitment/components/ReferencesSection.jsx
/**
 * ReferencesSection Component - Step 6
 * 
 * Three professional references
 * At least one must have known applicant for 5+ years
 */

import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  Alert,
  Box,
  Paper,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon
} from '@mui/icons-material';

const ReferencesSection = ({ formData, onChange, errors = {} }) => {
  
  const updateReference = (index, field, value) => {
    const currentReferences = [...(formData.references || [])];
    currentReferences[index] = {
      ...currentReferences[index],
      [field]: value
    };
    onChange({
      target: {
        name: 'references',
        value: currentReferences
      }
    });
  };

  const getErrorKey = (index, field) => {
    return `reference${index + 1}${field.charAt(0).toUpperCase() + field.slice(1)}`;
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
        Professional References
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          To further process your application, please provide three (3) personal references who can 
          provide professional reference about your character, ability, and suitability for the position 
          you have applied for.
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          *At least one (1) personal reference must have known you for at least 5 years
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Reference 1 */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 3, backgroundColor: '#f9f9f9' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1, color: '#667eea', fontSize: 28 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Professional Reference #1 
                <span style={{ color: '#f44336', marginLeft: '4px' }}>*</span>
                <Typography variant="caption" display="block" color="textSecondary">
                  Must have known you for at least 5 years
                </Typography>
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.references[0]?.firstName || ''}
                  onChange={(e) => updateReference(0, 'firstName', e.target.value)}
                  required
                  error={!!errors.reference1FirstName}
                  helperText={errors.reference1FirstName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.references[0]?.lastName || ''}
                  onChange={(e) => updateReference(0, 'lastName', e.target.value)}
                  required
                  error={!!errors.reference1LastName}
                  helperText={errors.reference1LastName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.references[0]?.phoneNumber || ''}
                  onChange={(e) => updateReference(0, 'phoneNumber', e.target.value)}
                  placeholder="(XXX) XXX-XXXX"
                  required
                  error={!!errors.reference1PhoneNumber}
                  helperText={errors.reference1PhoneNumber}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.references[0]?.email || ''}
                  onChange={(e) => updateReference(0, 'email', e.target.value)}
                  error={!!errors.reference1Email}
                  helperText={errors.reference1Email}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="How many years have you known this person?"
                  type="number"
                  value={formData.references[0]?.yearsKnown || ''}
                  onChange={(e) => updateReference(0, 'yearsKnown', e.target.value)}
                  required
                  error={!!errors.reference1YearsKnown}
                  helperText={errors.reference1YearsKnown || 'Minimum 5 years required for first reference'}
                  InputProps={{
                    endAdornment: 'years'
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Reference 2 */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1, color: '#6AB4A8', fontSize: 28 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Professional Reference #2 (Optional)
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.references[1]?.firstName || ''}
                  onChange={(e) => updateReference(1, 'firstName', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.references[1]?.lastName || ''}
                  onChange={(e) => updateReference(1, 'lastName', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.references[1]?.phoneNumber || ''}
                  onChange={(e) => updateReference(1, 'phoneNumber', e.target.value)}
                  placeholder="(XXX) XXX-XXXX"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.references[1]?.email || ''}
                  onChange={(e) => updateReference(1, 'email', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="How many years have you known this person?"
                  type="number"
                  value={formData.references[1]?.yearsKnown || ''}
                  onChange={(e) => updateReference(1, 'yearsKnown', e.target.value)}
                  InputProps={{
                    endAdornment: 'years'
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Reference 3 */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1, color: '#FDB94E', fontSize: 28 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Professional Reference #3 (Optional)
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.references[2]?.firstName || ''}
                  onChange={(e) => updateReference(2, 'firstName', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.references[2]?.lastName || ''}
                  onChange={(e) => updateReference(2, 'lastName', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.references[2]?.phoneNumber || ''}
                  onChange={(e) => updateReference(2, 'phoneNumber', e.target.value)}
                  placeholder="(XXX) XXX-XXXX"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.references[2]?.email || ''}
                  onChange={(e) => updateReference(2, 'email', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="How many years have you known this person?"
                  type="number"
                  value={formData.references[2]?.yearsKnown || ''}
                  onChange={(e) => updateReference(2, 'yearsKnown', e.target.value)}
                  InputProps={{
                    endAdornment: 'years'
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Note */}
        <Grid item xs={12}>
          <Alert severity="warning">
            <Typography variant="body2">
              <strong>Note:</strong> References may be contacted during the hiring process. 
              Please ensure you have permission from your references before listing them.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </>
  );
};

export default ReferencesSection;