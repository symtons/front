// src/pages/performance/components/SubmitRatingDialog.jsx
/**
 * Submit Rating Dialog
 * Form for submitting performance ratings
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
  Slider,
  Grid,
  Divider,
  Alert,
  Chip,
  Avatar
} from '@mui/material';
import {
  Star as StarIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { validateRating } from '../models/performanceModels';

const SubmitRatingDialog = ({ open, onClose, onSubmit, assignment, loading }) => {
  const [formData, setFormData] = useState({
    overallRating: 75,
    qualityOfWork: null,
    punctuality: null,
    teamwork: null,
    initiative: null,
    reliability: null,
    communication: null,
    problemSolving: null,
    leadership: null,
    teamManagement: null,
    comments: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && assignment) {
      // Reset form when dialog opens
      setFormData({
        overallRating: 75,
        qualityOfWork: null,
        punctuality: null,
        teamwork: null,
        initiative: null,
        reliability: null,
        communication: null,
        problemSolving: null,
        leadership: null,
        teamManagement: null,
        comments: ''
      });
      setErrors({});
    }
  }, [open, assignment]);

  const handleSliderChange = (field) => (event, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleCommentsChange = (e) => {
    setFormData(prev => ({ ...prev, comments: e.target.value }));
  };

  const handleSubmit = () => {
    // Validate
    const overallError = validateRating(formData.overallRating);
    if (overallError) {
      setErrors({ overallRating: overallError });
      return;
    }

    // Prepare data
    const ratingData = {
      employeeReviewId: assignment.employeeReviewId,
      overallRating: formData.overallRating,
      qualityOfWork: formData.qualityOfWork,
      punctuality: formData.punctuality,
      teamwork: formData.teamwork,
      initiative: formData.initiative,
      reliability: formData.reliability,
      communication: formData.communication,
      problemSolving: formData.problemSolving,
      leadership: formData.leadership,
      teamManagement: formData.teamManagement,
      comments: formData.comments || null
    };

    onSubmit(ratingData);
  };

  const getRatingColor = (value) => {
    if (value >= 90) return '#6AB4A8'; // Excellent
    if (value >= 80) return '#667eea'; // Very Good
    if (value >= 70) return '#FDB94E'; // Good
    if (value >= 60) return '#f59e42'; // Fair
    return '#f44336'; // Needs Improvement
  };

  const getRatingLabel = (value) => {
    if (value >= 90) return 'Excellent';
    if (value >= 80) return 'Very Good';
    if (value >= 70) return 'Good';
    if (value >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  if (!assignment) return null;

  const categoryRatings = [
    { field: 'qualityOfWork', label: 'Quality of Work', icon: '🎯' },
    { field: 'punctuality', label: 'Punctuality', icon: '⏰' },
    { field: 'teamwork', label: 'Teamwork', icon: '🤝' },
    { field: 'initiative', label: 'Initiative', icon: '🚀' },
    { field: 'reliability', label: 'Reliability', icon: '✅' },
    { field: 'communication', label: 'Communication', icon: '💬' },
    { field: 'problemSolving', label: 'Problem Solving', icon: '🧩' },
    { field: 'leadership', label: 'Leadership', icon: '👑' },
    { field: 'teamManagement', label: 'Team Management', icon: '👥' }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <StarIcon sx={{ color: '#FDB94E', fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Rate Employee Performance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {assignment.employee?.periodName}
              </Typography>
            </Box>
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
        {/* Employee Info */}
        <Box
          sx={{
            p: 2,
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              backgroundColor: '#667eea',
              fontSize: '1.5rem',
              fontWeight: 700
            }}
          >
            {assignment.employee?.employeeName?.charAt(0) || 'E'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {assignment.employee?.employeeName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <WorkIcon sx={{ fontSize: 16, color: '#6AB4A8' }} />
              <Typography variant="body2" color="text.secondary">
                {assignment.employee?.jobTitle} • {assignment.employee?.departmentName}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={assignment.raterRole}
            sx={{
              backgroundColor: '#E3F2FD',
              color: '#667eea',
              fontWeight: 600
            }}
          />
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          Provide an honest assessment of the employee's performance. Your ratings are confidential.
        </Alert>

        {/* Overall Rating */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Overall Rating (Required)
          </Typography>
          <Box
            sx={{
              p: 3,
              backgroundColor: '#f8f9fa',
              borderRadius: 2,
              border: errors.overallRating ? '2px solid #f44336' : 'none'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: getRatingColor(formData.overallRating),
                  mb: 1
                }}
              >
                {formData.overallRating}
              </Typography>
              <Chip
                label={getRatingLabel(formData.overallRating)}
                sx={{
                  backgroundColor: getRatingColor(formData.overallRating) + '20',
                  color: getRatingColor(formData.overallRating),
                  fontWeight: 600,
                  fontSize: '1rem',
                  px: 2,
                  py: 2.5
                }}
              />
            </Box>
            <Slider
              value={formData.overallRating}
              onChange={handleSliderChange('overallRating')}
              min={0}
              max={100}
              step={5}
              marks={[
                { value: 0, label: '0' },
                { value: 50, label: '50' },
                { value: 100, label: '100' }
              ]}
              sx={{
                color: getRatingColor(formData.overallRating),
                '& .MuiSlider-thumb': {
                  width: 24,
                  height: 24
                },
                '& .MuiSlider-track': {
                  height: 8
                },
                '& .MuiSlider-rail': {
                  height: 8,
                  backgroundColor: '#e0e0e0'
                }
              }}
            />
            {errors.overallRating && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {errors.overallRating}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Category Ratings */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Category Breakdown (Optional)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Provide detailed ratings for specific performance areas
          </Typography>

          <Grid container spacing={3}>
            {categoryRatings.map((category) => (
              <Grid item xs={12} sm={6} key={category.field}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h6">{category.icon}</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {category.label}
                    </Typography>
                  </Box>
                  {formData[category.field] !== null && (
                    <Typography
                      variant="h6"
                      sx={{
                        color: getRatingColor(formData[category.field]),
                        fontWeight: 700,
                        mb: 1
                      }}
                    >
                      {formData[category.field]}
                    </Typography>
                  )}
                  <Slider
                    value={formData[category.field] || 50}
                    onChange={handleSliderChange(category.field)}
                    min={0}
                    max={100}
                    step={5}
                    sx={{
                      color: formData[category.field]
                        ? getRatingColor(formData[category.field])
                        : '#667eea'
                    }}
                  />
                  {formData[category.field] === null && (
                    <Typography variant="caption" color="text.secondary">
                      Drag to set rating
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Comments */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Comments (Optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Provide additional feedback or comments about this employee's performance..."
            value={formData.comments}
            onChange={handleCommentsChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f8f9fa'
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Your comments will be shared with the employee
          </Typography>
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
            backgroundColor: '#FDB94E',
            '&:hover': { backgroundColor: '#f59e42' },
            px: 4
          }}
        >
          {loading ? 'Submitting...' : 'Submit Rating'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitRatingDialog;