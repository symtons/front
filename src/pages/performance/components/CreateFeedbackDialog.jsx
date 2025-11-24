// src/pages/performance/components/CreateFeedbackDialog.jsx
import React, { useState, useEffect } from 'react';
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
  FormControlLabel,
  Checkbox,
  Autocomplete
} from '@mui/material';
import {
  Feedback as FeedbackIcon,
  Send as SendIcon
} from '@mui/icons-material';
import {
  FEEDBACK_TYPE_OPTIONS,
  validateFeedback
} from '../models/performanceModels';
import { employeeService } from '../../../services/employeeService';

/**
 * CreateFeedbackDialog Component
 *
 * Dialog for creating feedback for another employee
 *
 * Props:
 * - open: boolean
 * - onClose: function
 * - onConfirm: function (receives feedback data)
 * - loading: boolean
 */

const CreateFeedbackDialog = ({
  open,
  onClose,
  onConfirm,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    toEmployeeId: '',
    feedbackType: 'Positive',
    content: '',
    isAnonymous: false
  });

  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);

  // Load employees when dialog opens
  useEffect(() => {
    if (open) {
      loadEmployees();
    }
  }, [open]);

  // Load employees
  const loadEmployees = async () => {
    try {
      setEmployeesLoading(true);
      const response = await employeeService.getDirectory({ pageSize: 1000 });
      setEmployees(response.employees || []);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setEmployeesLoading(false);
    }
  };

  // Handle input change
  const handleChange = (field) => (event) => {
    const value = field === 'isAnonymous' ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [field]: value
    });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // Handle employee selection
  const handleEmployeeChange = (event, newValue) => {
    setFormData({
      ...formData,
      toEmployeeId: newValue ? newValue.employeeId : ''
    });
    if (errors.toEmployeeId) {
      setErrors({ ...errors, toEmployeeId: '' });
    }
  };

  // Handle confirm
  const handleConfirm = () => {
    // Validate form
    const validation = validateFeedback(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onConfirm(formData);
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      toEmployeeId: '',
      feedbackType: 'Positive',
      content: '',
      isAnonymous: false
    });
    setErrors({});
    onClose();
  };

  const selectedEmployee = employees.find(e => e.employeeId === formData.toEmployeeId);

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
        <FeedbackIcon /> Give Feedback
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Provide constructive feedback to help your colleagues grow and improve. You can choose to submit feedback anonymously.
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Employee Selection */}
          <Autocomplete
            options={employees}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName} - ${option.jobTitle || 'N/A'}`}
            value={selectedEmployee || null}
            onChange={handleEmployeeChange}
            loading={employeesLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Employee *"
                error={Boolean(errors.toEmployeeId)}
                helperText={errors.toEmployeeId || 'Choose the employee you want to give feedback to'}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {employeesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
            disabled={loading || employeesLoading}
          />

          {/* Feedback Type */}
          <FormControl fullWidth>
            <InputLabel>Feedback Type *</InputLabel>
            <Select
              value={formData.feedbackType}
              onChange={handleChange('feedbackType')}
              label="Feedback Type *"
              disabled={loading}
            >
              {FEEDBACK_TYPE_OPTIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Feedback Content */}
          <TextField
            label="Feedback *"
            fullWidth
            multiline
            rows={6}
            value={formData.content}
            onChange={handleChange('content')}
            error={Boolean(errors.content)}
            helperText={
              errors.content ||
              'Provide specific, actionable feedback (minimum 10 characters)'
            }
            placeholder={
              formData.feedbackType === 'Positive'
                ? "Example: Great job on the project presentation! Your clear communication and attention to detail really impressed the client."
                : formData.feedbackType === 'Constructive'
                  ? "Example: I noticed the reports were submitted late. Consider setting earlier internal deadlines to allow time for review."
                  : "Example: Your collaboration on the team project helped us meet our deadline. Keep up the good work!"
            }
            disabled={loading}
          />

          {/* Anonymous Option */}
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isAnonymous}
                onChange={handleChange('isAnonymous')}
                disabled={loading}
              />
            }
            label="Submit anonymously (your name will not be shown to the recipient)"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={loading || !formData.toEmployeeId || !formData.content.trim()}
          startIcon={loading ? <CircularProgress size={16} /> : <SendIcon />}
        >
          {loading ? 'Sending...' : 'Send Feedback'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFeedbackDialog;
