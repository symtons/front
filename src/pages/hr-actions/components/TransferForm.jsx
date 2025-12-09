// src/pages/hr-actions/components/TransferForm.jsx
// PERFECT UI - Professional Layout

import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  Box,
  Alert,
  Paper
} from '@mui/material';
import {
  Business as DepartmentIcon,
  SwapHoriz as TransferIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import api from '../../../services/authService';

const TransferForm = ({ formData, onChange, errors, currentEmployee }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/Auth/Departments');
      setDepartments(response.data || []);
    } catch (err) {
      console.error('Error loading departments:', err);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value
    });
  };

  return (
    <Box>
      {/* CURRENT INFORMATION */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#667eea', mb: 3 }}>
          <DepartmentIcon /> Current Information
        </Typography>
        
        <Grid container spacing={3}>
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

          <Grid item xs={12} sm={6}>
            <TextField
              label="Current Location"
              value={currentEmployee?.location || 'N/A'}
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
              label="Current Supervisor"
              value={currentEmployee?.supervisor || 'N/A'}
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
              label="Current Classification"
              value={currentEmployee?.employmentType || 'N/A'}
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

      {/* NEW TRANSFER DETAILS */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6AB4A8', mb: 3 }}>
          <TransferIcon /> New Transfer Details
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="newDepartmentId"
              label="New Department *"
              select
              value={formData.newDepartmentId || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.newDepartmentId}
              helperText={errors.newDepartmentId || 'Select the department to transfer to'}
              disabled={loading}
              SelectProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            >
              {departments.map((dept) => (
                <MenuItem 
                  key={dept.departmentId} 
                  value={dept.departmentId}
                  style={{ fontSize: '1.2rem', padding: '12px 16px' }}
                >
                  {dept.departmentName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="newLocation"
              label="New Location"
              value={formData.newLocation || ''}
              onChange={handleChange}
              fullWidth
              placeholder="Enter new work location (optional)"
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' },
                startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="newSupervisor"
              label="New Supervisor"
              value={formData.newSupervisor || ''}
              onChange={handleChange}
              fullWidth
              placeholder="Enter new supervisor name (optional)"
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="newClassification"
              label="Classification"
              select
              value={formData.newClassification || currentEmployee?.employmentType || 'FT'}
              onChange={handleChange}
              fullWidth
              SelectProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            >
              <MenuItem value="FT" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Full-Time (FT)
              </MenuItem>
              <MenuItem value="PT" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Part-Time (PT)
              </MenuItem>
              <MenuItem value="PRN" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                PRN
              </MenuItem>
            </TextField>
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
              helperText={errors.effectiveDate || 'Transfer effective date'}
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
              label="Reason for Transfer *"
              multiline
              rows={6}
              value={formData.reason || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.reason}
              helperText={errors.reason || 'Minimum 10 characters - explain the reason for this transfer'}
              placeholder="Explain the reason for this transfer (e.g., departmental needs, employee request, organizational restructuring)"
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
              rows={4}
              value={formData.notes || ''}
              onChange={handleChange}
              fullWidth
              placeholder="Any additional information relevant to this transfer"
              InputProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Alert severity="info" sx={{ fontSize: '1rem' }}>
        <strong>Note:</strong> Department transfers require HR approval. The employee will be notified once the transfer is processed.
      </Alert>
    </Box>
  );
};

export default TransferForm;