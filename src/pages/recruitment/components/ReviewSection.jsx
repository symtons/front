// src/pages/recruitment/components/ReviewSection.jsx
/**
 * ReviewSection Component
 * 
 * Step 4 of job application form - Review & Submit
 * Shows all entered information for final review before submission
 */

import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Divider,
  Button,
  FormControlLabel,
  Checkbox,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  School as EducationIcon,
  Description as DocumentIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import {
  formatPhoneNumber,
  formatCurrency,
  formatDate,
  formatFullName,
  getEmployeeTypeLabel,
  getEducationLevelLabel
} from '../models/jobApplicationModels';

const ReviewSection = ({ 
  formData, 
  resumeFile,
  coverLetterFile,
  certificationFiles,
  onEditStep,
  agreedToTerms,
  onAgreeToTerms,
  errors = {}
}) => {
  // Helper to display value or "Not provided"
  const displayValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return <span style={{ color: '#999', fontStyle: 'italic' }}>Not provided</span>;
    }
    return value;
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
        Review Your Application
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Please review all information carefully before submitting. You can edit any section by clicking the Edit button.
      </Alert>

      <Grid container spacing={3}>
        {/* Personal Information Section */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ color: '#667eea', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Personal Information
                  </Typography>
                </Box>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => onEditStep(0)}
                  sx={{ color: '#6AB4A8' }}
                >
                  Edit
                </Button>
              </Box>

              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: '30%', border: 0 }}>
                      Full Name
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {formatFullName(formData.firstName, formData.middleName, formData.lastName)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Date of Birth
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {formData.dateOfBirth ? formatDate(formData.dateOfBirth) : displayValue(null)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Gender
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {displayValue(formData.gender)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Phone Number
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {formData.phoneNumber ? formatPhoneNumber(formData.phoneNumber) : displayValue(null)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {displayValue(formData.email)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Address
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {formData.address && formData.city && formData.state ? (
                        <>
                          {formData.address}<br />
                          {formData.city}, {formData.state} {formData.zipCode}
                        </>
                      ) : displayValue(null)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Position & Preferences Section */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WorkIcon sx={{ color: '#667eea', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Position & Preferences
                  </Typography>
                </Box>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => onEditStep(1)}
                  sx={{ color: '#6AB4A8' }}
                >
                  Edit
                </Button>
              </Box>

              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: '30%', border: 0 }}>
                      Position Applied For
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {displayValue(formData.positionAppliedFor)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Department Preference
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {displayValue(formData.departmentPreference)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Employee Type
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {formData.preferredEmployeeType ? (
                        <Chip 
                          label={getEmployeeTypeLabel(formData.preferredEmployeeType)}
                          color={formData.preferredEmployeeType === 'AdminStaff' ? 'primary' : 'secondary'}
                          size="small"
                        />
                      ) : displayValue(null)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Expected Start Date
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {formData.expectedStartDate ? formatDate(formData.expectedStartDate) : displayValue(null)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Desired Salary
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {formData.desiredSalary ? formatCurrency(formData.desiredSalary) : displayValue(null)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Years of Experience
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {formData.yearsOfExperience ? `${formData.yearsOfExperience} years` : displayValue(null)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Education Level
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {formData.educationLevel ? getEducationLevelLabel(formData.educationLevel) : displayValue(null)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Certifications
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {displayValue(formData.certifications)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Skills
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {displayValue(formData.skills)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Availability
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {displayValue(formData.availabilityType)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Willing to Relocate
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {formData.willingToRelocate ? 'Yes' : 'No'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Documents Section */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DocumentIcon sx={{ color: '#667eea', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Documents
                  </Typography>
                </Box>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => onEditStep(2)}
                  sx={{ color: '#6AB4A8' }}
                >
                  Edit
                </Button>
              </Box>

              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: '30%', border: 0 }}>
                      Resume
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {resumeFile ? (
                        <Chip
                          icon={<DocumentIcon />}
                          label={`${resumeFile.name} (${(resumeFile.size / 1024 / 1024).toFixed(2)} MB)`}
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip label="Not uploaded" color="error" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Cover Letter
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {coverLetterFile ? (
                        <Chip
                          icon={<DocumentIcon />}
                          label={`${coverLetterFile.name} (${(coverLetterFile.size / 1024 / 1024).toFixed(2)} MB)`}
                          color="success"
                          size="small"
                        />
                      ) : displayValue(null)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Certifications
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {certificationFiles && certificationFiles.length > 0 ? (
                        <Chip
                          icon={<DocumentIcon />}
                          label={`${certificationFiles[0].name} (${(certificationFiles[0].size / 1024 / 1024).toFixed(2)} MB)`}
                          color="success"
                          size="small"
                        />
                      ) : displayValue(null)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, border: 0 }}>
                      Additional Notes
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      {displayValue(formData.additionalNotes)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Terms and Conditions */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ backgroundColor: '#f9f9f9' }}>
            <CardContent>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToTerms}
                    onChange={(e) => onAgreeToTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I certify that all information provided in this application is true and complete to the best of my knowledge. 
                    I understand that any false information or omission may disqualify me from further consideration for employment 
                    and may result in dismissal if discovered at a later date.
                  </Typography>
                }
              />
              {errors.terms && (
                <Typography variant="caption" sx={{ color: '#d32f2f', display: 'block', mt: 1 }}>
                  {errors.terms}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ReviewSection;