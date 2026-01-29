import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { bulkImportService } from '../../services/bulkImportService';

const BulkImportModal = ({ open, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(null);
      setResult(null);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const data = await bulkImportService.uploadFile(file);
      setPreview(data);
    } catch (err) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!preview) return;

    setLoading(true);
    setError('');

    try {
      const importData = {
        fileName: preview.fileName,
        rows: preview.rows
      };
      const data = await bulkImportService.importEmployees(importData);
      setResult(data);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(`Successfully imported ${data.successfulRecords} employees`);
      }
    } catch (err) {
      setError(err.message || 'Failed to import employees');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Bulk Employee Import</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Step 1: Upload */}
        {!preview && !result && (
          <Box textAlign="center" py={3}>
            <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Upload Excel File
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Select an Excel file (.xlsx) with employee data
            </Typography>

            <Button variant="contained" component="label" disabled={loading}>
              Choose File
              <input
                type="file"
                hidden
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
              />
            </Button>

            {file && (
              <Box mt={2}>
                <Typography variant="body2" gutterBottom>
                  Selected: {file.name}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={loading}
                  sx={{ mt: 1 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Upload & Preview'}
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* Step 2: Preview */}
        {preview && !result && (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Found {preview.totalRecords} employees. Review and click Import.
            </Alert>

            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Row</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Department</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {preview.rows.map((row) => (
                    <TableRow key={row.rowNumber}>
                      <TableCell>{row.rowNumber}</TableCell>
                      <TableCell>{row.firstName} {row.lastName}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.department}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Step 3: Results */}
        {result && (
          <Box textAlign="center" py={3}>
            <Typography variant="h6" gutterBottom>
              Import Complete
            </Typography>
            <Box display="flex" gap={2} justifyContent="center" mt={2}>
              <Chip
                icon={<CheckCircleIcon />}
                label={`Success: ${result.successfulRecords}`}
                color="success"
                variant="outlined"
              />
              <Chip
                icon={<ErrorIcon />}
                label={`Failed: ${result.failedRecords}`}
                color="error"
                variant="outlined"
              />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {!preview && !result && (
          <Button onClick={handleClose}>Cancel</Button>
        )}

        {preview && !result && (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleImport}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Import Employees'}
            </Button>
          </>
        )}

        {result && (
          <Button variant="contained" onClick={handleClose}>
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BulkImportModal;