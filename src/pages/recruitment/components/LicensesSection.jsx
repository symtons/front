// src/pages/recruitment/components/LicensesSection.jsx
/**
 * LicensesSection Component - Step 5
 * 
 * Professional licenses, certifications, and DIDD training
 * Includes table for tracking license details with state, ID, and expiration
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  VerifiedUser as LicenseIcon
} from '@mui/icons-material';
import { US_STATES } from '../models/jobApplicationModels';

const LicensesSection = ({ formData, onChange, errors = {} }) => {
  
  const handleChange = (e) => {
    onChange(e);
  };

  // Add license/certification entry
  const addLicenseEntry = () => {
    const currentLicenses = formData.licensesAndCertifications || [];
    onChange({
      target: {
        name: 'licensesAndCertifications',
        value: [
          ...currentLicenses,
          {
            type: '',
            state: '',
            idNumber: '',
            expirationDate: ''
          }
        ]
      }
    });
  };

  // Remove license entry
  const removeLicenseEntry = (index) => {
    const currentLicenses = formData.licensesAndCertifications || [];
    onChange({
      target: {
        name: 'licensesAndCertifications',
        value: currentLicenses.filter((_, i) => i !== index)
      }
    });
  };

  // Update specific license entry
  const updateLicenseEntry = (index, field, value) => {
    const currentLicenses = [...(formData.licensesAndCertifications || [])];
    currentLicenses[index] = {
      ...currentLicenses[index],
      [field]: value
    };
    onChange({
      target: {
        name: 'licensesAndCertifications',
        value: currentLicenses
      }
    });
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
        Licenses & Certifications
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Please list all professional licenses and certifications you hold. 
        Include license type, issuing state, identification number, and expiration date.
      </Alert>

      <Grid container spacing={3}>
        {/* Licenses and Certifications */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Special Skills, Training, Certifications, and/or Licensures
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={addLicenseEntry}
                variant="outlined"
                size="small"
              >
                Add License
              </Button>
            </Box>

            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              List fields of work for which you are licensed, registered, or certified. 
              Please include numbers, dates, and sources of issuance.
            </Typography>

            {(!formData.licensesAndCertifications || formData.licensesAndCertifications.length === 0) ? (
              <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                <LicenseIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  No licenses or certifications added yet. Click "Add License" to begin.
                </Typography>
              </Box>
            ) : (
              <Box>
                {formData.licensesAndCertifications.map((license, index) => (
                  <Accordion key={index} defaultExpanded={index === 0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <LicenseIcon sx={{ mr: 1, color: '#6AB4A8' }} />
                        <Typography sx={{ fontWeight: 500 }}>
                          {license.type || `License/Certification ${index + 1}`}
                          {license.state && ` - ${license.state}`}
                          {license.expirationDate && ` (Expires: ${new Date(license.expirationDate).toLocaleDateString()})`}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {/* Type of License/Certificate */}
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Type of License/Certificate"
                            value={license.type || ''}
                            onChange={(e) => updateLicenseEntry(index, 'type', e.target.value)}
                            placeholder="e.g., RN, CNA, CPR, First Aid, etc."
                          />
                        </Grid>

                        {/* State */}
                        <Grid item xs={12} sm={4}>
                          <TextField
                            select
                            fullWidth
                            label="State"
                            value={license.state || ''}
                            onChange={(e) => updateLicenseEntry(index, 'state', e.target.value)}
                          >
                            <MenuItem value="">Select State</MenuItem>
                            {US_STATES.filter(s => s.value).map(state => (
                              <MenuItem key={state.value} value={state.value}>
                                {state.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>

                        {/* ID Number */}
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="ID Number"
                            value={license.idNumber || ''}
                            onChange={(e) => updateLicenseEntry(index, 'idNumber', e.target.value)}
                            placeholder="License/Certificate ID"
                          />
                        </Grid>

                        {/* Expiration Date */}
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Expiration Date"
                            type="date"
                            value={license.expirationDate || ''}
                            onChange={(e) => updateLicenseEntry(index, 'expirationDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>

                        {/* Remove Button */}
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              startIcon={<DeleteIcon />}
                              onClick={() => removeLicenseEntry(index)}
                              color="error"
                              size="small"
                            >
                              Remove License
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* DIDD Training */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Dept. of Intellectual and Developmental Disabilities (DIDD) Training
            </Typography>
            
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Please list any DIDD training classes you have completed:
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="DIDD Training/Classes"
              name="diddTrainingClasses"
              value={formData.diddTrainingClasses || ''}
              onChange={handleChange}
              placeholder="List all DIDD-related training courses, dates completed, and certification details"
            />
          </Paper>
        </Grid>

        {/* Important Note */}
        <Grid item xs={12}>
          <Alert severity="warning">
            <Typography variant="body2">
              <strong>Important:</strong> Copies of all licenses and certifications may be required 
              during the hiring process. Please ensure all information is accurate and current.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </>
  );
};

export default LicensesSection;