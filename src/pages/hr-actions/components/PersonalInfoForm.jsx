// src/pages/hr-actions/components/PersonalInfoForm.jsx
// PERFECT UI - Professional Layout

import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  Box,
  Alert,
  Paper
} from '@mui/material';
import {
  PersonOutline as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon
} from '@mui/icons-material';

const PersonalInfoForm = ({ formData, onChange, errors, currentEmployee }) => {
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
        Only fill in the fields you want to change. Leave others blank to keep current information.
      </Alert>

      {/* NAME INFORMATION */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#667eea', mb: 3 }}>
          <PersonIcon /> Name Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Current First Name"
              value={currentEmployee?.firstName || 'N/A'}
              fullWidth
              disabled
              variant="filled"
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Current Middle Name"
              value={currentEmployee?.middleName || 'N/A'}
              fullWidth
              disabled
              variant="filled"
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Current Last Name"
              value={currentEmployee?.lastName || 'N/A'}
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

      {/* NEW NAME */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6AB4A8', mb: 3 }}>
          <PersonIcon /> New Name (Leave blank if not changing)
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="newFirstName"
              label="New First Name"
              value={formData.newFirstName || ''}
              onChange={handleChange}
              fullWidth
              error={!!errors.newFirstName}
              helperText={errors.newFirstName || 'Leave blank if not changing'}
              placeholder="New first name"
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="newLastName"
              label="New Last Name"
              value={formData.newLastName || ''}
              onChange={handleChange}
              fullWidth
              error={!!errors.newLastName}
              helperText={errors.newLastName || 'Leave blank if not changing'}
              placeholder="New last name"
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ADDRESS INFORMATION */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#667eea', mb: 3 }}>
          <HomeIcon /> Current Address
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Current Address"
              value={currentEmployee?.address || 'N/A'}
              fullWidth
              disabled
              variant="filled"
              multiline
              rows={2}
              InputProps={{
                style: { fontSize: '1.2rem' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* NEW ADDRESS */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6AB4A8', mb: 3 }}>
          <HomeIcon /> New Address (Leave blank if not changing)
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="newAddress"
              label="New Street Address"
              value={formData.newAddress || ''}
              onChange={handleChange}
              fullWidth
              error={!!errors.newAddress}
              helperText={errors.newAddress || 'Leave blank if not changing'}
              placeholder="Street address"
              multiline
              rows={2}
              InputProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="newCity"
              label="City"
              value={formData.newCity || ''}
              onChange={handleChange}
              fullWidth
              placeholder="City"
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              name="newState"
              label="State"
              value={formData.newState || ''}
              onChange={handleChange}
              fullWidth
              placeholder="State"
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              name="newZipCode"
              label="ZIP Code"
              value={formData.newZipCode || ''}
              onChange={handleChange}
              fullWidth
              placeholder="ZIP"
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* CONTACT INFORMATION */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#667eea', mb: 3 }}>
          <PhoneIcon /> Current Contact
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Current Phone"
              value={currentEmployee?.phone || 'N/A'}
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
              label="Current Email"
              value={currentEmployee?.email || 'N/A'}
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

      {/* NEW CONTACT */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6AB4A8', mb: 3 }}>
          <PhoneIcon /> New Contact (Leave blank if not changing)
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="newPhone"
              label="New Phone"
              value={formData.newPhone || ''}
              onChange={handleChange}
              fullWidth
              error={!!errors.newPhone}
              helperText={errors.newPhone || 'Leave blank if not changing'}
              placeholder="(555) 123-4567"
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' },
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="newEmail"
              label="New Email"
              type="email"
              value={formData.newEmail || ''}
              onChange={handleChange}
              fullWidth
              error={!!errors.newEmail}
              helperText={errors.newEmail || 'Leave blank if not changing'}
              placeholder="employee@example.com"
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' },
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
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
              helperText={errors.effectiveDate || 'When should this change take effect?'}
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
              label="Reason for Change *"
              multiline
              rows={6}
              value={formData.reason || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.reason}
              helperText={errors.reason || 'Minimum 10 characters - explain the reason for this information update'}
              placeholder="Explain the reason for this personal information change (e.g., marriage, move, name change, contact update)"
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
              placeholder="Any additional information or documentation attached"
              InputProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Alert severity="warning" sx={{ fontSize: '1rem' }}>
        <strong>Important:</strong> Name changes may require supporting documentation (marriage certificate, court order, etc.). Please attach relevant documents.
      </Alert>
    </Box>
  );
};

export default PersonalInfoForm;