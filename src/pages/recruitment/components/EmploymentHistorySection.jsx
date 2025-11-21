// src/pages/recruitment/components/EmploymentHistorySection.jsx
/**
 * EmploymentHistorySection Component - Step 7
 * 
 * Employment experience starting with present or last job
 * Includes military service and volunteer activities
 * Detailed employer information with dates, supervisor, pay, etc.
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { US_STATES } from '../models/jobApplicationModels';

const EmploymentHistorySection = ({ formData, onChange, errors = {} }) => {
  
  // Add employment entry
  const addEmploymentEntry = () => {
    const currentHistory = formData.employmentHistory || [];
    onChange({
      target: {
        name: 'employmentHistory',
        value: [
          ...currentHistory,
          {
            employer: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            telephoneNumber: '',
            jobTitle: '',
            supervisor: '',
            employedFrom: '',
            employedTo: '',
            startingPay: '',
            finalPay: '',
            workPerformed: '',
            stillEmployed: null,
            reasonForLeaving: '',
            eligibleForRehire: null
          }
        ]
      }
    });
  };

  // Remove employment entry
  const removeEmploymentEntry = (index) => {
    const currentHistory = formData.employmentHistory || [];
    onChange({
      target: {
        name: 'employmentHistory',
        value: currentHistory.filter((_, i) => i !== index)
      }
    });
  };

  // Update specific employment entry
  const updateEmploymentEntry = (index, field, value) => {
    const currentHistory = [...(formData.employmentHistory || [])];
    currentHistory[index] = {
      ...currentHistory[index],
      [field]: value
    };
    onChange({
      target: {
        name: 'employmentHistory',
        value: currentHistory
      }
    });
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
        Employment Experience
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Start with your present or last job. Include any job-related military service assignments 
          and volunteer activities that have given you experience related to your job. 
          Please explain any extended lapses between employments.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Employment History */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Employment History
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={addEmploymentEntry}
              variant="outlined"
              size="small"
            >
              Add Employer
            </Button>
          </Box>

          {(!formData.employmentHistory || formData.employmentHistory.length === 0) ? (
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
              <WorkIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
              <Typography variant="body2" color="textSecondary">
                No employment history added yet. Click "Add Employer" to begin.
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Please list at least your most recent 3 employers
              </Typography>
            </Paper>
          ) : (
            <Box>
              {formData.employmentHistory.map((employment, index) => (
                <Accordion key={index} defaultExpanded={index === 0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <WorkIcon sx={{ mr: 1, color: '#667eea' }} />
                      <Typography sx={{ fontWeight: 500 }}>
                        {employment.employer || `Employer ${index + 1}`}
                        {employment.jobTitle && ` - ${employment.jobTitle}`}
                        {employment.employedFrom && employment.employedTo && 
                          ` (${employment.employedFrom} to ${employment.employedTo})`}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {/* Employer Name */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#555' }}>
                          Employer Information
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Employer Name"
                          value={employment.employer || ''}
                          onChange={(e) => updateEmploymentEntry(index, 'employer', e.target.value)}
                          placeholder="Company/Organization name"
                        />
                      </Grid>

                      {/* Address */}
                      <Grid item xs={12} sm={8}>
                        <TextField
                          fullWidth
                          label="Address"
                          value={employment.address || ''}
                          onChange={(e) => updateEmploymentEntry(index, 'address', e.target.value)}
                          placeholder="Street address"
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Telephone Number(s)"
                          value={employment.telephoneNumber || ''}
                          onChange={(e) => updateEmploymentEntry(index, 'telephoneNumber', e.target.value)}
                          placeholder="(XXX) XXX-XXXX"
                        />
                      </Grid>

                      <Grid item xs={12} sm={5}>
                        <TextField
                          fullWidth
                          label="City"
                          value={employment.city || ''}
                          onChange={(e) => updateEmploymentEntry(index, 'city', e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <TextField
                          select
                          fullWidth
                          label="State"
                          value={employment.state || ''}
                          onChange={(e) => updateEmploymentEntry(index, 'state', e.target.value)}
                        >
                          <MenuItem value="">Select</MenuItem>
                          {US_STATES.filter(s => s.value).map(state => (
                            <MenuItem key={state.value} value={state.value}>
                              {state.value}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Zip Code"
                          value={employment.zipCode || ''}
                          onChange={(e) => updateEmploymentEntry(index, 'zipCode', e.target.value)}
                        />
                      </Grid>

                      {/* Job Details */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600, color: '#555' }}>
                          Position Details
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Job Title"
                          value={employment.jobTitle || ''}
                          onChange={(e) => updateEmploymentEntry(index, 'jobTitle', e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Supervisor"
                          value={employment.supervisor || ''}
                          onChange={(e) => updateEmploymentEntry(index, 'supervisor', e.target.value)}
                        />
                      </Grid>

                      {/* Dates Employed */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Employed From"
                          type="date"
                          value={employment.employedFrom || ''}
                          onChange={(e) => updateEmploymentEntry(index, 'employedFrom', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Employed To"
                          type="date"
                          value={employment.employedTo || ''}
                          onChange={(e) => updateEmploymentEntry(index, 'employedTo', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          disabled={employment.stillEmployed === true}
                        />
                      </Grid>

                      {/* Pay Rates */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mt: 1, mb: 1, fontWeight: 600, color: '#555' }}>
                          Hourly Rate of Pay
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Starting Pay"
                          type="number"
                          value={employment.startingPay || ''}
                          onChange={(e) => updateEmploymentEntry(index, 'startingPay', e.target.value)}
                          InputProps={{
                            startAdornment: '$',
                            endAdornment: '/hr'
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Final Pay"
                          type="number"
                          value={employment.finalPay || ''}
                          onChange={(e) => updateEmploymentEntry(index, 'finalPay', e.target.value)}
                          InputProps={{
                            startAdornment: '$',
                            endAdornment: '/hr'
                          }}
                        />
                      </Grid>

                      {/* Work Performed */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Title/Work Performed"
                          value={employment.workPerformed || ''}
                          onChange={(e) => updateEmploymentEntry(index, 'workPerformed', e.target.value)}
                          placeholder="Describe your responsibilities and duties"
                        />
                      </Grid>

                      {/* Still Employed */}
                      <Grid item xs={12}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">
                            Are you still employed?
                          </FormLabel>
                          <RadioGroup
                            row
                            value={employment.stillEmployed === null ? '' : employment.stillEmployed.toString()}
                            onChange={(e) => updateEmploymentEntry(index, 'stillEmployed', e.target.value === 'true')}
                          >
                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                            <FormControlLabel value="false" control={<Radio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>

                      {/* Reason for Leaving */}
                      {employment.stillEmployed === false && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Reason for Leaving"
                            value={employment.reasonForLeaving || ''}
                            onChange={(e) => updateEmploymentEntry(index, 'reasonForLeaving', e.target.value)}
                          />
                        </Grid>
                      )}

                      {/* Eligible for Rehire */}
                      <Grid item xs={12}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">
                            Eligible for Rehire?
                          </FormLabel>
                          <RadioGroup
                            row
                            value={employment.eligibleForRehire === null ? '' : employment.eligibleForRehire.toString()}
                            onChange={(e) => updateEmploymentEntry(index, 'eligibleForRehire', e.target.value === 'true')}
                          >
                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                            <FormControlLabel value="false" control={<Radio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>

                      {/* Remove Button */}
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Button
                            startIcon={<DeleteIcon />}
                            onClick={() => removeEmploymentEntry(index)}
                            color="error"
                            size="small"
                          >
                            Remove Employer
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

        {/* Note */}
        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Note:</strong> Please provide at least your 3 most recent employers. 
              If you need to add more, click "Add Employer" button above.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </>
  );
};

export default EmploymentHistorySection;