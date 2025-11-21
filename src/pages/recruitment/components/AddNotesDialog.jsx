// src/pages/recruitment/components/AddNotesDialog.jsx
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
  Typography,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import {
  NoteAdd as NotesIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { validateNotes } from '../models/applicationReviewModels';

/**
 * AddNotesDialog Component
 * 
 * Dialog for adding review notes to an application
 * Shows existing notes history
 * 
 * Props:
 * - open: boolean
 * - onClose: function
 * - onConfirm: function (receives notes)
 * - application: application object (with reviewNotes field)
 * - loading: boolean
 */

const AddNotesDialog = ({
  open,
  onClose,
  onConfirm,
  application,
  loading = false
}) => {
  const [notes, setNotes] = useState('');
  const [notesError, setNotesError] = useState('');

  // Handle notes change
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    setNotesError('');
  };

  // Handle confirm
  const handleConfirm = () => {
    // Validate notes
    const validation = validateNotes(notes);
    
    if (!validation.isValid) {
      setNotesError(validation.error);
      return;
    }

    onConfirm(notes.trim());
  };

  // Handle cancel
  const handleCancel = () => {
    setNotes('');
    setNotesError('');
    onClose();
  };

  // Parse existing notes (format: [timestamp] notes)
  const parseExistingNotes = () => {
    if (!application?.reviewNotes) return [];
    
    // Split by double newline to separate notes
    const noteEntries = application.reviewNotes.split('\n\n');
    return noteEntries.map(entry => {
      // Extract timestamp and note text
      const match = entry.match(/^\[(.*?)\]\s*(.*)$/);
      if (match) {
        return {
          timestamp: match[1],
          text: match[2]
        };
      }
      return {
        timestamp: '',
        text: entry
      };
    });
  };

  const existingNotes = parseExistingNotes();

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
        <NotesIcon /> Add Review Notes
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Add internal notes about this application. These notes are only visible
          to HR staff and will not be shared with the applicant.
        </Alert>

        {/* Application Details */}
        <Box
          sx={{
            bgcolor: 'grey.100',
            p: 2,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.300',
            mb: 2
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 1 }}
          >
            Application Details:
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Name:</strong> {application?.fullName}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Position:</strong> {application?.positionAppliedFor}
          </Typography>
          <Typography variant="body2">
            <strong>Submitted:</strong> {application?.submittedAtFormatted}
          </Typography>
        </Box>

        {/* Existing Notes History */}
        {existingNotes.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600, color: '#555' }}
            >
              Previous Notes:
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                maxHeight: 200,
                overflowY: 'auto',
                bgcolor: '#fafafa'
              }}
            >
              {existingNotes.map((note, index) => (
                <Box key={index} sx={{ mb: index < existingNotes.length - 1 ? 2 : 0 }}>
                  <Typography variant="caption" color="text.secondary">
                    {note.timestamp}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {note.text}
                  </Typography>
                  {index < existingNotes.length - 1 && (
                    <Divider sx={{ mt: 2 }} />
                  )}
                </Box>
              ))}
            </Paper>
          </Box>
        )}

        {/* New Note Input */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: 600, color: '#555' }}
          >
            Add New Note:
          </Typography>
          <TextField
            label="Review Notes *"
            multiline
            rows={4}
            fullWidth
            value={notes}
            onChange={handleNotesChange}
            error={Boolean(notesError)}
            helperText={
              notesError ||
              'Add your review notes or comments about this application (minimum 5 characters)'
            }
            placeholder="Example: Candidate has strong qualifications. Scheduled for phone interview on [date]."
            disabled={loading}
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
          disabled={loading || !notes.trim()}
          startIcon={loading ? <CircularProgress size={16} /> : <NotesIcon />}
        >
          {loading ? 'Adding...' : 'Add Note'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNotesDialog;