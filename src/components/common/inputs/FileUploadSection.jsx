// src/components/common/inputs/FileUploadSection.jsx
/**
 * Universal FileUploadSection Component
 * Reusable drag-and-drop file upload component
 * Can be used for: documents, images, forms, attachments, etc.
 * 
 * @param {Function} onFileSelect - Callback when file is selected
 * @param {string} accept - Accepted file types (e.g., ".pdf,.doc,.docx")
 * @param {number} maxSize - Max file size in MB (default: 10)
 * @param {string} label - Upload area label (default: "Click to upload or drag and drop")
 * @param {string} helperText - Helper text shown below upload area
 * @param {boolean} showPreview - Show selected file preview (default: true)
 * @param {File} selectedFile - Currently selected file (controlled)
 * @param {Function} onRemove - Callback to remove file
 * @param {boolean} disabled - Disable upload (default: false)
 * @param {Object} sx - Additional Material-UI sx props
 */

import React, { useState } from 'react';
import { Box, Typography, Button, Paper, IconButton } from '@mui/material';
import {
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const FileUploadSection = ({
  onFileSelect,
  accept = '',
  maxSize = 10,
  label = 'Click to upload or drag and drop',
  helperText = '',
  showPreview = true,
  selectedFile = null,
  onRemove,
  disabled = false,
  sx = {}
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [localFile, setLocalFile] = useState(null);

  const displayFile = selectedFile || localFile;

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

  const validateFile = (file) => {
    setError('');

    if (!file) {
      setError('No file selected');
      return false;
    }

    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return false;
    }

    // Check file type if accept is specified
    if (accept) {
      const allowedExtensions = accept
        .split(',')
        .map(ext => ext.trim().toLowerCase().replace('.', ''));
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (!allowedExtensions.includes(fileExtension)) {
        setError(`Invalid file type. Allowed types: ${accept}`);
        return false;
      }
    }

    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setLocalFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (disabled) return;
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setLocalFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleRemoveFile = () => {
    setLocalFile(null);
    setError('');
    if (onRemove) {
      onRemove();
    } else {
      onFileSelect(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Box sx={{ ...sx }}>
      {!displayFile ? (
        <Paper
          elevation={0}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{
            border: dragActive 
              ? '2px dashed #667eea' 
              : error 
                ? '2px dashed #f44336'
                : '2px dashed #cbd5e0',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            backgroundColor: dragActive 
              ? '#f0f4ff' 
              : disabled 
                ? '#f5f5f5'
                : '#f7fafc',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.6 : 1,
            '&:hover': disabled ? {} : {
              borderColor: '#667eea',
              backgroundColor: '#f0f4ff'
            }
          }}
        >
          <input
            type="file"
            id="file-upload-input"
            accept={accept}
            onChange={handleChange}
            disabled={disabled}
            style={{ display: 'none' }}
          />
          
          <label 
            htmlFor="file-upload-input" 
            style={{ 
              cursor: disabled ? 'not-allowed' : 'pointer', 
              display: 'block' 
            }}
          >
            <UploadIcon sx={{ fontSize: 48, color: '#667eea', mb: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {helperText || (
                <>
                  {accept ? `Supported formats: ${accept}` : 'Any file type'}
                  {' • '}
                  Max size: {maxSize}MB
                </>
              )}
            </Typography>
          </label>
        </Paper>
      ) : (
        showPreview && (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #e0e0e0',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FileIcon sx={{ color: '#667eea', fontSize: 28 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {displayFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(displayFile.size)}
                </Typography>
              </Box>
            </Box>
            {!disabled && (
              <IconButton 
                size="small" 
                onClick={handleRemoveFile}
                sx={{ color: '#f44336' }}
              >
                <ClearIcon />
              </IconButton>
            )}
          </Paper>
        )
      )}

      {error && (
        <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploadSection;

/**
 * Usage Examples:
 * 
 * // Onboarding Document Upload
 * <FileUploadSection
 *   onFileSelect={handleFileSelect}
 *   accept=".pdf,.doc,.docx"
 *   maxSize={10}
 *   label="Upload your document"
 *   helperText="Please upload required identification documents"
 * />
 * 
 * // Image Upload
 * <FileUploadSection
 *   onFileSelect={handleImageSelect}
 *   accept=".jpg,.jpeg,.png"
 *   maxSize={5}
 *   label="Upload profile picture"
 * />
 * 
 * // Controlled Component
 * <FileUploadSection
 *   selectedFile={file}
 *   onFileSelect={setFile}
 *   onRemove={() => setFile(null)}
 *   accept=".xlsx,.csv"
 *   maxSize={20}
 * />
 */