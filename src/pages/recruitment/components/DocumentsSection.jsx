// src/pages/recruitment/components/DocumentsSection.jsx
/**
 * DocumentsSection Component
 * 
 * Step 3 of job application form - Document Upload
 * Handles resume, cover letter, and certification uploads with drag-and-drop support
 */

import React, { useRef } from 'react';
import {
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Chip
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  AttachFile as FileIcon,
  Delete as DeleteIcon,
  Description as DocumentIcon
} from '@mui/icons-material';

const DocumentsSection = ({
  formData,
  onChange,
  resumeFile,
  onResumeChange,
  coverLetterFile,
  onCoverLetterChange,
  certificationFiles,
  onCertificationFilesChange,
  errors = {}
}) => {
  const resumeInputRef = useRef(null);
  const coverLetterInputRef = useRef(null);
  const certificationInputRef = useRef(null);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle resume file selection
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onResumeChange(file);
    }
  };

  // Handle cover letter file selection
  const handleCoverLetterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onCoverLetterChange(file);
    }
  };

  // Handle certification files selection (multiple)
  const handleCertificationChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onCertificationFilesChange([...certificationFiles, ...files]);
    }
  };

  // Remove certification file
  const removeCertificationFile = (index) => {
    const newFiles = certificationFiles.filter((_, i) => i !== index);
    onCertificationFilesChange(newFiles);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (type === 'resume') {
        onResumeChange(files[0]);
      } else if (type === 'coverLetter') {
        onCoverLetterChange(files[0]);
      } else if (type === 'certifications') {
        onCertificationFilesChange([...certificationFiles, ...files]);
      }
    }
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
        Upload Documents
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Please upload your resume (required). Cover letter and certifications are optional but recommended.
        Accepted formats: PDF, DOC, DOCX (Max 5MB per file)
      </Alert>

      <Grid container spacing={3}>
        {/* Resume Upload - REQUIRED */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Resume / CV <span style={{ color: '#f44336' }}>*</span>
          </Typography>

          {!resumeFile ? (
            <Paper
              variant="outlined"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'resume')}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                border: errors.resume ? '2px dashed #f44336' : '2px dashed #ddd',
                backgroundColor: '#fafafa',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                  borderColor: errors.resume ? '#f44336' : '#667eea'
                }
              }}
              onClick={() => resumeInputRef.current?.click()}
            >
              <UploadIcon sx={{ fontSize: 48, color: errors.resume ? '#f44336' : '#667eea', mb: 1 }} />
              <Typography variant="body1" sx={{ mb: 1 }}>
                Click to upload or drag and drop
              </Typography>
              <Typography variant="body2" color="textSecondary">
                PDF, DOC, DOCX (Max 5MB)
              </Typography>
              <input
                ref={resumeInputRef}
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
              />
            </Paper>
          ) : (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FileIcon color="primary" />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {resumeFile.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatFileSize(resumeFile.size)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  color="error"
                  onClick={() => {
                    onResumeChange(null);
                    if (resumeInputRef.current) resumeInputRef.current.value = '';
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          )}
          {errors.resume && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {errors.resume}
            </Typography>
          )}
        </Grid>

        {/* Cover Letter Upload - OPTIONAL */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Cover Letter <Chip label="Optional" size="small" sx={{ ml: 1 }} />
          </Typography>

          {!coverLetterFile ? (
            <Paper
              variant="outlined"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'coverLetter')}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                border: '2px dashed #ddd',
                backgroundColor: '#fafafa',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                  borderColor: '#667eea'
                }
              }}
              onClick={() => coverLetterInputRef.current?.click()}
            >
              <DocumentIcon sx={{ fontSize: 48, color: '#667eea', mb: 1 }} />
              <Typography variant="body1" sx={{ mb: 1 }}>
                Click to upload or drag and drop
              </Typography>
              <Typography variant="body2" color="textSecondary">
                PDF, DOC, DOCX (Max 5MB)
              </Typography>
              <input
                ref={coverLetterInputRef}
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleCoverLetterChange}
              />
            </Paper>
          ) : (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FileIcon color="primary" />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {coverLetterFile.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatFileSize(coverLetterFile.size)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  color="error"
                  onClick={() => {
                    onCoverLetterChange(null);
                    if (coverLetterInputRef.current) coverLetterInputRef.current.value = '';
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          )}
          {errors.coverLetter && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {errors.coverLetter}
            </Typography>
          )}
        </Grid>

        {/* Certifications Upload - OPTIONAL (Multiple files) */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Certifications <Chip label="Optional" size="small" sx={{ ml: 1 }} />
          </Typography>

          <Paper
            variant="outlined"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'certifications')}
            sx={{
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              border: '2px dashed #ddd',
              backgroundColor: '#fafafa',
              '&:hover': {
                backgroundColor: '#f0f0f0',
                borderColor: '#667eea'
              }
            }}
            onClick={() => certificationInputRef.current?.click()}
          >
            <DocumentIcon sx={{ fontSize: 48, color: '#6AB4A8', mb: 1 }} />
            <Typography variant="body1" sx={{ mb: 1 }}>
              Click to upload or drag and drop
            </Typography>
            <Typography variant="body2" color="textSecondary">
              PDF files only (Max 5MB per file) - You can select multiple files
            </Typography>
            <input
              ref={certificationInputRef}
              type="file"
              hidden
              multiple
              accept=".pdf"
              onChange={handleCertificationChange}
            />
          </Paper>

          {/* List of uploaded certification files */}
          {certificationFiles.length > 0 && (
            <List sx={{ mt: 2 }}>
              {certificationFiles.map((file, index) => (
                <ListItem
                  key={index}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: '#fafafa'
                  }}
                >
                  <FileIcon color="primary" sx={{ mr: 2 }} />
                  <ListItemText
                    primary={file.name}
                    secondary={formatFileSize(file.size)}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => removeCertificationFile(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}

          {errors.certifications && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {errors.certifications}
            </Typography>
          )}
        </Grid>

        {/* Additional Notes */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Additional Information
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            If you have any additional information you'd like to share about your application, 
            please provide it below.
          </Typography>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes || ''}
            onChange={onChange}
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              fontFamily: 'Roboto, sans-serif',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
            }}
            placeholder="Any additional information you'd like us to know..."
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DocumentsSection;