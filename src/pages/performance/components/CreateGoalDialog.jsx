// src/pages/performance/components/CreateGoalDialog.jsx
/**
 * Create Goal Dialog
 * Simple dialog for creating new goals
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
  Divider,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Flag as GoalIcon
} from '@mui/icons-material';
import { validateGoal } from '../models/performanceModels';

const CreateGoalDialog = ({ open, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      // Reset form when dialog opens
      setFormData({
        title: '',
        description: '',
        dueDate: ''
      });
      setErrors({});
    }
  }, [open]);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateGoal(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
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
            <GoalIcon sx={{ color: '#6AB4A8', fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Create New Goal
            </Typography>
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            fullWidth
            label="Goal Title"
            placeholder="e.g., Complete AWS Certification"
            value={formData.title}
            onChange={handleChange('title')}
            error={!!errors.title}
            helperText={errors.title}
            required
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            placeholder="Describe your goal and how you plan to achieve it..."
            value={formData.description}
            onChange={handleChange('description')}
          />

          <TextField
            fullWidth
            type="date"
            label="Due Date"
            value={formData.dueDate}
            onChange={handleChange('dueDate')}
            error={!!errors.dueDate}
            helperText={errors.dueDate || 'Target completion date'}
            required
            InputLabelProps={{ shrink: true }}
          />
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
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            backgroundColor: '#6AB4A8',
            '&:hover': { backgroundColor: '#559089' },
            px: 4
          }}
        >
          {loading ? 'Creating...' : 'Create Goal'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGoalDialog;