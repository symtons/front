// src/pages/performance/components/CreatePeriodDialog.jsx
/**
 * Create Period Dialog
 * Executive creates new review period
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  MenuItem,
  Alert,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { PERIOD_TYPES } from '../models/performanceModels';
import performanceService from '../../../services/performanceService';

const CreatePeriodDialog = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    periodName: '',
    periodType: 'Quarterly',
    startDate: '',
    endDate: '',
    ratingDeadline: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      // Reset form when dialog opens
      setFormData({
        periodName: '',
        periodType: 'Quarterly',
        startDate: '',
        endDate: '',
        ratingDeadline: ''
      });
      setErrors({});
      setError('');
    }
  }, [open]);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.periodName.trim()) {
      newErrors.periodName = 'Period name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.ratingDeadline) {
      newErrors.ratingDeadline = 'Rating deadline is required';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.endDate && formData.ratingDeadline) {
      if (new Date(formData.ratingDeadline) < new Date(formData.endDate)) {
        newErrors.ratingDeadline = 'Deadline must be on or after end date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setError('');

      const result = await performanceService.createPeriod(formData);

      // Success
      onSuccess(result);
      onClose();
    } catch (err) {
      console.error('Error creating period:', err);
      setError(err.message || 'Failed to create review period');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarIcon sx={{ color: '#667eea', fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Create Review Period
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Initiate a new performance review cycle
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={onClose}
            sx={{ minWidth: 'auto', color: '#666' }}
            disabled={loading}
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Period Name */}
          <TextField
            fullWidth
            label="Period Name"
            placeholder="e.g., Q1 2025 Performance Review"
            value={formData.periodName}
            onChange={handleChange('periodName')}
            error={!!errors.periodName}
            helperText={errors.periodName}
            required
          />

          {/* Period Type */}
          <TextField
            fullWidth
            select
            label="Period Type"
            value={formData.periodType}
            onChange={handleChange('periodType')}
            required
          >
            {Object.values(PERIOD_TYPES).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          {/* Start Date */}
          <TextField
            fullWidth
            type="date"
            label="Review Period Start Date"
            value={formData.startDate}
            onChange={handleChange('startDate')}
            error={!!errors.startDate}
            helperText={errors.startDate || 'Beginning of the review period'}
            required
            InputLabelProps={{ shrink: true }}
          />

          {/* End Date */}
          <TextField
            fullWidth
            type="date"
            label="Review Period End Date"
            value={formData.endDate}
            onChange={handleChange('endDate')}
            error={!!errors.endDate}
            helperText={errors.endDate || 'End of the review period'}
            required
            InputLabelProps={{ shrink: true }}
          />

          {/* Rating Deadline */}
          <TextField
            fullWidth
            type="date"
            label="Rating Deadline"
            value={formData.ratingDeadline}
            onChange={handleChange('ratingDeadline')}
            error={!!errors.ratingDeadline}
            helperText={errors.ratingDeadline || 'Date by which all ratings must be completed'}
            required
            InputLabelProps={{ shrink: true }}
          />

          <Alert severity="info">
            Creating this period will:
            <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
              <li>Include all active employees</li>
              <li>Automatically assign raters based on hierarchy</li>
              <li>Send notifications to all assigned raters</li>
            </ul>
          </Alert>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ color: '#666' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            backgroundColor: '#667eea',
            '&:hover': { backgroundColor: '#5568d3' },
            px: 4
          }}
        >
          {loading ? 'Creating...' : 'Create Period'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePeriodDialog;