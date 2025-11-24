// src/pages/performance/components/CreateGoalDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  AddTask as AddIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import {
  GOAL_CATEGORY_OPTIONS,
  GOAL_PRIORITY_OPTIONS,
  validateGoal,
  formatDateForInput
} from '../models/performanceModels';

/**
 * CreateGoalDialog Component
 *
 * Dialog for creating a new goal
 *
 * Props:
 * - open: boolean
 * - onClose: function
 * - onConfirm: function (receives goal data)
 * - loading: boolean
 */

const CreateGoalDialog = ({
  open,
  onClose,
  onConfirm,
  loading = false
}) => {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Performance',
    priority: 'Medium',
    startDate: today,
    dueDate: ''
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // Handle confirm
  const handleConfirm = () => {
    // Validate form
    const validation = validateGoal(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onConfirm(formData);
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Performance',
      priority: 'Medium',
      startDate: today,
      dueDate: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? null : handleCancel}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          bgcolor: 'primary.light',
          color: 'primary.dark',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <AddIcon /> Create New Goal
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) to track your performance and development.
        </Alert>

        <Grid container spacing={2}>
          {/* Title */}
          <Grid item xs={12}>
            <TextField
              label="Goal Title *"
              fullWidth
              value={formData.title}
              onChange={handleChange('title')}
              error={Boolean(errors.title)}
              helperText={errors.title || 'Enter a clear and concise goal title'}
              placeholder="Example: Improve customer satisfaction score"
              disabled={loading}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange('description')}
              error={Boolean(errors.description)}
              helperText={errors.description || 'Provide details about this goal and how it will be measured'}
              placeholder="Example: Achieve a customer satisfaction score of 90% or higher through improved response times and service quality"
              disabled={loading}
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category *</InputLabel>
              <Select
                value={formData.category}
                onChange={handleChange('category')}
                label="Category *"
                disabled={loading}
              >
                {GOAL_CATEGORY_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Priority */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Priority *</InputLabel>
              <Select
                value={formData.priority}
                onChange={handleChange('priority')}
                label="Priority *"
                disabled={loading}
              >
                {GOAL_PRIORITY_OPTIONS.slice(1).map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Start Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Date *"
              type="date"
              fullWidth
              value={formData.startDate}
              onChange={handleChange('startDate')}
              error={Boolean(errors.startDate)}
              helperText={errors.startDate}
              InputLabelProps={{ shrink: true }}
              disabled={loading}
            />
          </Grid>

          {/* Due Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Due Date *"
              type="date"
              fullWidth
              value={formData.dueDate}
              onChange={handleChange('dueDate')}
              error={Boolean(errors.dueDate)}
              helperText={errors.dueDate}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: formData.startDate }}
              disabled={loading}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={loading || !formData.title.trim()}
          startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
        >
          {loading ? 'Creating...' : 'Create Goal'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGoalDialog;
