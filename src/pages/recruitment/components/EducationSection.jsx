// src/pages/recruitment/components/EducationSection.jsx
/**
 * EducationSection Component - Step 4
 * 
 * Education history including:
 * - Elementary School
 * - High School
 * - Undergraduate College/University
 * - Graduate/Professional
 * - Special skills, knowledge, and abilities
 */

import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  Alert,
  Box,
  Paper,
  Button,
  IconButton,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { EDUCATION_LEVELS } from '../models/jobApplicationModels';

const EducationSection = ({ formData, onChange, errors = {} }) => {
  
  const handleChange = (e) => {
    onChange(e);
  };

  // Add education entry
  const addEducationEntry = () => {
    const currentHistory = formData.educationHistory || [];
    onChange({
      target: {
        name: 'educationHistory',
        value: [
          ...currentHistory,
          {
            level: '',
            schoolName: '',
            location: '',
            yearsCompleted: '',
            hasDiploma: null,
            majorMinor: '',
            specializedTraining: ''
          }
        ]
      }
    });
  };

  // Remove education entry
  const removeEducationEntry = (index) => {
    const currentHistory = formData.educationHistory || [];
    onChange({
      target: {
        name: 'educationHistory',
        value: currentHistory.filter((_, i) => i !== index)
      }
    });
  };

  // Update specific education entry
  const updateEducationEntry = (index, field, value) => {
    const currentHistory = [...(formData.educationHistory || [])];
    currentHistory[index] = {
      ...currentHistory[index],
      [field]: value
    };
    onChange({
      target: {
        name: 'educationHistory',
        value: currentHistory
      }
    });
  };

  const getLevelLabel = (level) => {
    const found = EDUCATION_LEVELS.find(l => l.value === level);
    return found ? found.label : 'Education Entry';
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
        Education
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Please provide details about your educational background. Include all relevant education 
        from elementary school through professional/graduate studies.
      </Alert>

      <Grid container spacing={3}>
        {/* Education History */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Education History
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={addEducationEntry}
              variant="outlined"
              size="small"
            >
              Add Education
            </Button>
          </Box>

          {(!formData.educationHistory || formData.educationHistory.length === 0) ? (
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
              <SchoolIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
              <Typography variant="body2" color="textSecondary">
                No education entries added yet. Click "Add Education" to begin.
              </Typography>
            </Paper>
          ) : (
            <Box>
              {formData.educationHistory.map((education, index) => (
                <Accordion key={index} defaultExpanded={index === 0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <SchoolIcon sx={{ mr: 1, color: '#667eea' }} />
                      <Typography sx={{ fontWeight: 500 }}>
                        {education.level ? getLevelLabel(education.level) : `Education Entry ${index + 1}`}
                        {education.schoolName && ` - ${education.schoolName}`}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {/* Education Level */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          fullWidth
                          label="Education Level"
                          value={education.level || ''}
                          onChange={(e) => updateEducationEntry(index, 'level', e.target.value)}
                          SelectProps={{ native: true }}
                        >
                          <option value="">Select Level</option>
                          {EDUCATION_LEVELS.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </TextField>
                      </Grid>

                      {/* Years Completed */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Years Completed"
                          value={education.yearsCompleted || ''}
                          onChange={(e) => updateEducationEntry(index, 'yearsCompleted', e.target.value)}
                          placeholder="e.g., 4 years, 1-3, etc."
                        />
                      </Grid>

                      {/* School Name */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="School Name"
                          value={education.schoolName || ''}
                          onChange={(e) => updateEducationEntry(index, 'schoolName', e.target.value)}
                        />
                      </Grid>

                      {/* Location */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Location (City, State)"
                          value={education.location || ''}
                          onChange={(e) => updateEducationEntry(index, 'location', e.target.value)}
                          placeholder="e.g., Nashville, TN"
                        />
                      </Grid>

                      {/* Diploma/Degree */}
                      <Grid item xs={12}>
                        <FormControl component="fieldset">
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Did you receive a Diploma/Degree?
                          </Typography>
                          <RadioGroup
                            row
                            value={education.hasDiploma === null ? '' : education.hasDiploma.toString()}
                            onChange={(e) => updateEducationEntry(index, 'hasDiploma', e.target.value === 'true')}
                          >
                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                            <FormControlLabel value="false" control={<Radio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>

                      {/* Major/Minor */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Major/Minor"
                          value={education.majorMinor || ''}
                          onChange={(e) => updateEducationEntry(index, 'majorMinor', e.target.value)}
                          placeholder="e.g., Computer Science, Business Administration"
                        />
                      </Grid>

                      {/* Specialized Training */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Describe any specialized training or skills"
                          value={education.specializedTraining || ''}
                          onChange={(e) => updateEducationEntry(index, 'specializedTraining', e.target.value)}
                          placeholder="Any specialized training or skills obtained at this institution"
                        />
                      </Grid>

                      {/* Remove Button */}
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            startIcon={<DeleteIcon />}
                            onClick={() => removeEducationEntry(index)}
                            color="error"
                            size="small"
                          >
                            Remove Entry
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Grid>

        {/* Special Skills, Knowledge, and Abilities */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Special Skills, Knowledge, and Abilities
            </Typography>
            
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Please describe special knowledge, skills, and abilities you wish to be considered. 
              Include equipment or machines you operate, computer software, languages, laboratory techniques, etc. 
              If applying for secretarial/typist positions, please indicate typing speed (WPM).
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Special Skills & Knowledge"
              name="specialSkillsKnowledge"
              value={formData.specialSkillsKnowledge || ''}
              onChange={handleChange}
              placeholder="Describe your special skills, equipment operation, computer proficiency, languages spoken, etc."
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Typing Speed (WPM)"
              name="typingSpeedWPM"
              type="number"
              value={formData.typingSpeedWPM || ''}
              onChange={handleChange}
              placeholder="Words per minute (if applicable)"
              InputProps={{
                endAdornment: 'WPM'
              }}
            />
          </Paper>
        </Grid>

        {/* Helper Text */}
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Education information helps us understand your qualifications 
              and may be verified during the background check process. Please be accurate and complete.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </>
  );
};

export default EducationSection;