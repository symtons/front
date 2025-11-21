// src/pages/recruitment/components/BackgroundQuestionsSection.jsx
/**
 * BackgroundQuestionsSection Component - Step 3
 * 
 * Background and eligibility questions including:
 * - Prior TPA history
 * - Citizenship status
 * - Criminal history
 * - Abuse registry status
 * - Healthcare license issues
 */

import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const BackgroundQuestionsSection = ({ formData, onChange, errors = {} }) => {
  
  const handleChange = (e) => {
    onChange(e);
  };

  const handleRadioChange = (name, value) => {
    onChange({
      target: {
        name: name,
        value: value === 'true'
      }
    });
  };

  // Handle crime details
  const addCrimeDetail = () => {
    const currentDetails = formData.crimeDetails || [];
    onChange({
      target: {
        name: 'crimeDetails',
        value: [...currentDetails, { date: '', charge: '', statusOrOutcome: '' }]
      }
    });
  };

  const removeCrimeDetail = (index) => {
    const currentDetails = formData.crimeDetails || [];
    onChange({
      target: {
        name: 'crimeDetails',
        value: currentDetails.filter((_, i) => i !== index)
      }
    });
  };

  const updateCrimeDetail = (index, field, value) => {
    const currentDetails = [...(formData.crimeDetails || [])];
    currentDetails[index] = {
      ...currentDetails[index],
      [field]: value
    };
    onChange({
      target: {
        name: 'crimeDetails',
        value: currentDetails
      }
    });
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
        Background & Eligibility Questions
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Please answer all questions truthfully. These questions help us ensure compliance with 
        legal requirements and maintain a safe environment.
      </Alert>

      <Grid container spacing={3}>
        {/* TPA History */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              TPA Employment History
            </Typography>

            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <FormLabel component="legend">
                Have you ever applied for a position with TPA, Inc. before? *
              </FormLabel>
              <RadioGroup
                row
                value={formData.previouslyAppliedToTPA === null ? '' : formData.previouslyAppliedToTPA.toString()}
                onChange={(e) => handleRadioChange('previouslyAppliedToTPA', e.target.value)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
              {errors.previouslyAppliedToTPA && (
                <Typography variant="caption" color="error">{errors.previouslyAppliedToTPA}</Typography>
              )}
            </FormControl>

            {formData.previouslyAppliedToTPA && (
              <TextField
                fullWidth
                label="If yes, when?"
                name="previouslyAppliedWhen"
                value={formData.previouslyAppliedWhen || ''}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            )}

            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <FormLabel component="legend">
                Have you ever worked for TPA, Inc. before? *
              </FormLabel>
              <RadioGroup
                row
                value={formData.previouslyWorkedForTPA === null ? '' : formData.previouslyWorkedForTPA.toString()}
                onChange={(e) => handleRadioChange('previouslyWorkedForTPA', e.target.value)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
              {errors.previouslyWorkedForTPA && (
                <Typography variant="caption" color="error">{errors.previouslyWorkedForTPA}</Typography>
              )}
            </FormControl>

            {formData.previouslyWorkedForTPA && (
              <TextField
                fullWidth
                label="If yes, when?"
                name="previouslyWorkedWhen"
                value={formData.previouslyWorkedWhen || ''}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            )}

            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">
                Do you have any family members employed by TPA, Inc.? *
              </FormLabel>
              <RadioGroup
                row
                value={formData.familyMembersAtTPA === null ? '' : formData.familyMembersAtTPA.toString()}
                onChange={(e) => handleRadioChange('familyMembersAtTPA', e.target.value)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
              {errors.familyMembersAtTPA && (
                <Typography variant="caption" color="error">{errors.familyMembersAtTPA}</Typography>
              )}
            </FormControl>

            {formData.familyMembersAtTPA && (
              <TextField
                fullWidth
                label="If yes, who?"
                name="familyMembersWho"
                value={formData.familyMembersWho || ''}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
            )}
          </Paper>
        </Grid>

        {/* Citizenship & Work Authorization */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Citizenship & Work Authorization
            </Typography>

            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <FormLabel component="legend">
                Are you a U.S. citizen or Permanent Resident? *
              </FormLabel>
              <RadioGroup
                row
                value={formData.usCitizenOrResident === null ? '' : formData.usCitizenOrResident.toString()}
                onChange={(e) => handleRadioChange('usCitizenOrResident', e.target.value)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
              {errors.usCitizenOrResident && (
                <Typography variant="caption" color="error">{errors.usCitizenOrResident}</Typography>
              )}
            </FormControl>

            {formData.usCitizenOrResident === false && (
              <TextField
                fullWidth
                label="Alien # (if no)"
                name="alienNumber"
                value={formData.alienNumber || ''}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            )}

            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <FormLabel component="legend">
                Or otherwise legally entitled to work in the U.S.A.? *
              </FormLabel>
              <RadioGroup
                row
                value={formData.legallyEntitledToWork === null ? '' : formData.legallyEntitledToWork.toString()}
                onChange={(e) => handleRadioChange('legallyEntitledToWork', e.target.value)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
              {errors.legallyEntitledToWork && (
                <Typography variant="caption" color="error">{errors.legallyEntitledToWork}</Typography>
              )}
            </FormControl>

            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">
                Are you 18 years or older? *
              </FormLabel>
              <RadioGroup
                row
                value={formData.eighteenOrOlder === null ? '' : formData.eighteenOrOlder.toString()}
                onChange={(e) => handleRadioChange('eighteenOrOlder', e.target.value)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
              {errors.eighteenOrOlder && (
                <Typography variant="caption" color="error">{errors.eighteenOrOlder}</Typography>
              )}
            </FormControl>
          </Paper>
        </Grid>

        {/* Military Service & Criminal History */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Military Service & Criminal History
            </Typography>

            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <FormLabel component="legend">
                Have you ever served in the U.S. Armed Forces? *
              </FormLabel>
              <RadioGroup
                row
                value={formData.servedInArmedForces === null ? '' : formData.servedInArmedForces.toString()}
                onChange={(e) => handleRadioChange('servedInArmedForces', e.target.value)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
              {errors.servedInArmedForces && (
                <Typography variant="caption" color="error">{errors.servedInArmedForces}</Typography>
              )}
            </FormControl>

            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <FormLabel component="legend">
                Have you ever been convicted of a crime (i.e. misdemeanor or felony)? *
              </FormLabel>
              <RadioGroup
                row
                value={formData.convictedOfCrime === null ? '' : formData.convictedOfCrime.toString()}
                onChange={(e) => handleRadioChange('convictedOfCrime', e.target.value)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
              {errors.convictedOfCrime && (
                <Typography variant="caption" color="error">{errors.convictedOfCrime}</Typography>
              )}
            </FormControl>

            {formData.convictedOfCrime && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  If yes, please give details including dates, charges, and dispositions:
                </Typography>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Charge</TableCell>
                        <TableCell>Status or Outcome</TableCell>
                        <TableCell width={50}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(formData.crimeDetails || []).map((detail, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              fullWidth
                              type="date"
                              value={detail.date || ''}
                              onChange={(e) => updateCrimeDetail(index, 'date', e.target.value)}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              value={detail.charge || ''}
                              onChange={(e) => updateCrimeDetail(index, 'charge', e.target.value)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              value={detail.statusOrOutcome || ''}
                              onChange={(e) => updateCrimeDetail(index, 'statusOrOutcome', e.target.value)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeCrimeDetail(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Button
                  startIcon={<AddIcon />}
                  onClick={addCrimeDetail}
                  sx={{ mt: 1 }}
                >
                  Add Entry
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Abuse Registry & Healthcare License */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Abuse Registry & Professional License Status
            </Typography>

            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <FormLabel component="legend">
                Does your name appear on an abuse registry? *
              </FormLabel>
              <RadioGroup
                row
                value={formData.nameOnAbuseRegistry === null ? '' : formData.nameOnAbuseRegistry.toString()}
                onChange={(e) => handleRadioChange('nameOnAbuseRegistry', e.target.value)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
              {errors.nameOnAbuseRegistry && (
                <Typography variant="caption" color="error">{errors.nameOnAbuseRegistry}</Typography>
              )}
            </FormControl>

            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <FormLabel component="legend">
                Have you ever been found guilty abusing, neglecting, or mistreating individuals? *
              </FormLabel>
              <RadioGroup
                row
                value={formData.foundGuiltyOfAbuse === null ? '' : formData.foundGuiltyOfAbuse.toString()}
                onChange={(e) => handleRadioChange('foundGuiltyOfAbuse', e.target.value)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
              {errors.foundGuiltyOfAbuse && (
                <Typography variant="caption" color="error">{errors.foundGuiltyOfAbuse}</Typography>
              )}
            </FormControl>

            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">
                Has your license and/or certification in any health care profession ever been revoked, 
                suspended, limited, or placed on probation or discipline in any state? *
              </FormLabel>
              <RadioGroup
                row
                value={formData.healthcareLicenseIssues === null ? '' : formData.healthcareLicenseIssues.toString()}
                onChange={(e) => handleRadioChange('healthcareLicenseIssues', e.target.value)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
              {errors.healthcareLicenseIssues && (
                <Typography variant="caption" color="error">{errors.healthcareLicenseIssues}</Typography>
              )}
            </FormControl>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default BackgroundQuestionsSection;