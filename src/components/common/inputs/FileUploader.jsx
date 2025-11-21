// src/components/common/inputs/FileUploader.jsx
/**
 * FileUploader Component
 * 
 * Reusable drag-and-drop file upload component with validation
 * Features:
 * - Drag and drop support
 * - Click to browse
 * - File type validation
 * - File size validation
 * - Preview uploaded file
 * - Remove uploaded file
 */

import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Alert,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';

const FileUploader = ({
  label,
  helperText,
  required = false,
  acceptedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  maxSizeMB = 5,
  file,
  onChange,
  error = null,
  disabled = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const inputRef = useRef(null);

  // Get accepted file extensions for display
  const getAcceptedExtensions = () => {
    const extensions = [];
    if (acceptedFileTypes.includes('application/pdf')) extensions.push('.pdf');
    if (acceptedFileTypes.includes('application/msword')) extensions.push('.doc');
    if (acceptedFileTypes.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      extensions.push('.docx');
    }
    if (acceptedFileTypes.includes('image/jpeg')) extensions.push('.jpg, .jpeg');
    if (acceptedFileTypes.includes('image/png')) extensions.push('.png');
    return extensions.join(', ');
  };

  // Validate file
  const validateFile = (file) => {
    // Check file type
    if (!acceptedFileTypes.includes(file.type)) {
      return `Invalid file type. Please upload: ${getAcceptedExtensions()}`;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    setUploadError(null);

    // Validate file
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    // File is valid, pass it to parent
    onChange(selectedFile);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Handle remove file
  const handleRemove = () => {
    setUploadError(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Handle click to browse
  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Label */}
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#333' }}>
        {label} {required && <span style={{ color: '#d32f2f' }}>*</span>}
      </Typography>

      {/* Upload Area */}
      <Paper
        elevation={0}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        sx={{
          border: error || uploadError 
            ? '2px dashed #d32f2f' 
            : dragActive 
            ? '2px dashed #667eea' 
            : file 
            ? '2px solid #4caf50'
            : '2px dashed #bdc3c7',
          backgroundColor: dragActive 
            ? '#f0f4ff' 
            : file 
            ? '#f1f8f4'
            : '#fafafa',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: disabled ? 0.6 : 1,
          '&:hover': disabled ? {} : {
            backgroundColor: file ? '#e8f5e9' : '#f5f5f5',
            borderColor: file ? '#4caf50' : '#667eea'
          }
        }}
      >
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={acceptedFileTypes.join(',')}
          onChange={handleChange}
          disabled={disabled}
          style={{ display: 'none' }}
        />

        {/* Show uploaded file or upload prompt */}
        {file ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <SuccessIcon sx={{ fontSize: 40, color: '#4caf50', mr: 1 }} />
              <FileIcon sx={{ fontSize: 40, color: '#667eea' }} />
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', mb: 0.5 }}>
              {file.name}
            </Typography>
            <Chip 
              label={formatFileSize(file.size)} 
              size="small" 
              sx={{ 
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                fontWeight: 500
              }} 
            />
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                disabled={disabled}
                size="small"
              >
                Remove File
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <UploadIcon sx={{ fontSize: 48, color: dragActive ? '#667eea' : '#bdc3c7', mb: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', mb: 0.5 }}>
              {dragActive ? 'Drop file here' : 'Drag & drop file here'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
              or
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#667eea',
                '&:hover': { backgroundColor: '#5568d3' }
              }}
              disabled={disabled}
            >
              Browse Files
            </Button>
            <Typography variant="caption" sx={{ display: 'block', color: '#999', mt: 2 }}>
              Accepted: {getAcceptedExtensions()} • Max size: {maxSizeMB}MB
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Helper Text */}
      {helperText && !error && !uploadError && (
        <Typography variant="caption" sx={{ display: 'block', color: '#666', mt: 1 }}>
          {helperText}
        </Typography>
      )}

      {/* Error Messages */}
      {(error || uploadError) && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error || uploadError}
        </Alert>
      )}
    </Box>
  );
};

export default FileUploader;