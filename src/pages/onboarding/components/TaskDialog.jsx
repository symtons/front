// src/pages/onboarding/components/TaskDialog.jsx
/**
 * Task Dialog Component - UPDATED
 * Now uses universal FileUploadSection from common components
 * Modal dialog for completing onboarding tasks
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Alert,
  Typography,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CompleteIcon
} from '@mui/icons-material';
import FileUploadSection from '../../../components/common/inputs/FileUploadSection'; // ✨ Using universal component
import { TASK_TYPES, validateTaskCompletion } from '../models/onboardingModels';

const TaskDialog = ({ task, open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    submittedData: '',
    notes: '',
    acknowledged: false
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!task) return null;

  const handleSubmit = async () => {
    setError('');

    const submitData = {
      submittedData: formData.submittedData,
      notes: formData.notes,
      acknowledged: formData.acknowledged,
      file: selectedFile
    };

    const validation = validateTaskCompletion(task, submitData);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(task, submitData);
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to submit task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ submittedData: '', notes: '', acknowledged: false });
    setSelectedFile(null);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={!submitting ? handleClose : undefined} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#f59e42', color: 'white', py: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {task.taskName}
          </Typography>
          <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ mt: 2 }}>
        {task.instructionText && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {task.instructionText}
          </Alert>
        )}

        {task.taskDescription && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {task.taskDescription}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Input Type */}
        {task.taskType === TASK_TYPES.INPUT && (
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Enter Required Information
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={formData.submittedData}
              onChange={(e) => setFormData({ ...formData, submittedData: e.target.value })}
              placeholder="Enter your response here..."
              sx={{ mb: 2 }}
            />
          </Box>
        )}

        {/* Acknowledgment Type */}
        {task.taskType === TASK_TYPES.ACKNOWLEDGMENT && (
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.acknowledged}
                  onChange={(e) => setFormData({ ...formData, acknowledged: e.target.checked })}
                  sx={{ color: '#667eea', '&.Mui-checked': { color: '#667eea' } }}
                />
              }
              label={
                <Typography variant="body2">
                  I acknowledge that I have read and understood this requirement
                </Typography>
              }
            />
          </Box>
        )}

        {/* Upload Type - ✨ Using universal FileUploadSection */}
        {task.taskType === TASK_TYPES.UPLOAD && (
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Upload Document
            </Typography>
            <FileUploadSection
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
              onRemove={() => setSelectedFile(null)}
              accept={task.requiredFileTypes?.split(',').map(t => `.${t.trim()}`).join(',')}
              maxSize={10}
              label="Click to upload or drag and drop"
              helperText={task.requiredFileTypes ? `Allowed types: ${task.requiredFileTypes}` : undefined}
              showPreview={true}
            />
          </Box>
        )}

        {/* Notes (Optional for all types) */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Additional Notes (Optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any additional comments..."
          />
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={submitting} sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} /> : <CompleteIcon />}
          sx={{
            backgroundColor: '#f59e42',
            '&:hover': { backgroundColor: '#e08a2e' },
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          {submitting ? 'Submitting...' : task.taskType === TASK_TYPES.UPLOAD ? 'Upload' : 'Complete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;