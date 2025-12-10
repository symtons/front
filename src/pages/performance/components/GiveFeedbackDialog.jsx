// src/pages/performance/components/GiveFeedbackDialog.jsx
/**
 * Give Feedback Dialog
 * Dialog for submitting feedback to colleagues
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
  Divider,
  FormControlLabel,
  Checkbox,
  Autocomplete
} from '@mui/material';
import {
  Close as CloseIcon,
  Feedback as FeedbackIcon
} from '@mui/icons-material';
import { FEEDBACK_TYPES, validateFeedback } from '../models/performanceModels';
import { employeeService } from '../../../services/employeeService';

const GiveFeedbackDialog = ({ open, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    toEmployeeId: null,
    feedbackType: 'Positive',
    content: '',
    isAnonymous: false
  });

  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset form when dialog opens
      setFormData({
        toEmployeeId: null,
        feedbackType: 'Positive',
        content: '',
        isAnonymous: false
      });
      setErrors({});
      fetchEmployees();
    }
  }, [open]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await employeeService.getAllEmployees({
        page: 1,
        pageSize: 1000,
        status: 'Active'
      });
      setEmployees(response.data || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleEmployeeChange = (event, value) => {
    setFormData(prev => ({ ...prev, toEmployeeId: value?.employeeId || null }));
    if (errors.toEmployeeId) {
      setErrors(prev => ({ ...prev, toEmployeeId: null }));
    }
  };

  const handleCheckboxChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.checked }));
  };

  const handleSubmit = () => {
    const validationErrors = validateFeedback(formData);
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
            <FeedbackIcon sx={{ color: '#f59e42', fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Give Feedback
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
          <Autocomplete
            options={employees}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName} - ${option.jobTitle}`}
            loading={loadingEmployees}
            onChange={handleEmployeeChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Employee"
                placeholder="Search by name..."
                error={!!errors.toEmployeeId}
                helperText={errors.toEmployeeId}
                required
              />
            )}
          />

          <TextField
            fullWidth
            select
            label="Feedback Type"
            value={formData.feedbackType}
            onChange={handleChange('feedbackType')}
            required
          >
            {Object.values(FEEDBACK_TYPES).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            multiline
            rows={5}
            label="Your Feedback"
            placeholder="Share your thoughts, appreciation, or constructive feedback..."
            value={formData.content}
            onChange={handleChange('content')}
            error={!!errors.content}
            helperText={errors.content}
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isAnonymous}
                onChange={handleCheckboxChange('isAnonymous')}
                sx={{
                  color: '#f59e42',
                  '&.Mui-checked': {
                    color: '#f59e42'
                  }
                }}
              />
            }
            label="Submit anonymously"
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
            backgroundColor: '#f59e42',
            '&:hover': { backgroundColor: '#e08c31' },
            px: 4
          }}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GiveFeedbackDialog;