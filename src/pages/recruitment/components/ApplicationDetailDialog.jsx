// src/pages/recruitment/components/ApplicationDetailDialog.jsx
// FIXED VERSION - Handles both camelCase and PascalCase API responses

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Chip,
  Button,
  Divider,
  IconButton
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  NoteAdd as NotesIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const ApplicationDetailDialog = ({ open, onClose, application, onApprove, onReject, onAddNotes }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleClose = () => {
    setActiveTab(0);
    onClose();
  };

  if (!application) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '80vh',
          maxHeight: '90vh'
        }
      }}
    >
      {/* Dialog Header */}
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0',
        pb: 2
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Application Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getField(application, 'fullName') || 
             `${getField(application, 'firstName')} ${getField(application, 'lastName')}`.trim() || 
             'Applicant'} 
            {' - '}
            {getField(application, 'positionAppliedFor') || getField(application, 'position1') || 'Position Not Specified'}
          </Typography>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Status Chips */}
      <Box sx={{ px: 3, pt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
        <Chip
          label={getField(application, 'approvalStatus') || 'Pending'}
          color={
            getField(application, 'approvalStatus') === 'Approved' ? 'success' :
            getField(application, 'approvalStatus') === 'Rejected' ? 'error' : 'warning'
          }
          size="small"
        />
        <Typography variant="body2" color="text.secondary">
          Application ID: {getField(application, 'applicationId') || 'N/A'}
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .Mui-selected': { color: '#667eea' },
            '& .MuiTabs-indicator': { backgroundColor: '#667eea' }
          }}
        >
          <Tab label="Personal" />
          <Tab label="Position" />
          <Tab label="Education" />
          <Tab label="Licenses" />
          <Tab label="References" />
          <Tab label="Employment" />
          <Tab label="Notes" />
        </Tabs>
      </Box>

      {/* Dialog Content */}
      <DialogContent sx={{ p: 3 }}>
        {activeTab === 0 && <PersonalTab app={application} />}
        {activeTab === 1 && <PositionTab app={application} />}
        {activeTab === 2 && <EducationTab app={application} />}
        {activeTab === 3 && <LicensesTab app={application} />}
        {activeTab === 4 && <ReferencesTab app={application} />}
        {activeTab === 5 && <EmploymentTab app={application} />}
        {activeTab === 6 && <NotesTab app={application} />}
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={handleClose} startIcon={<CloseIcon />}>
          Close
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button
          variant="outlined"
          startIcon={<NotesIcon />}
          onClick={() => { handleClose(); onAddNotes(application); }}
          sx={{ color: '#FDB94E', borderColor: '#FDB94E' }}
        >
          Add Notes
        </Button>
        {getField(application, 'approvalStatus') === 'Pending' && (
          <>
            <Button
              variant="contained"
              startIcon={<RejectIcon />}
              onClick={() => { handleClose(); onReject(application); }}
              sx={{ backgroundColor: '#f44336', '&:hover': { backgroundColor: '#d32f2f' } }}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              startIcon={<ApproveIcon />}
              onClick={() => { handleClose(); onApprove(application); }}
              sx={{ backgroundColor: '#6AB4A8', '&:hover': { backgroundColor: '#559089' } }}
            >
              Approve
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get field value - tries both camelCase and PascalCase
 * @param {Object} obj - Object to get field from
 * @param {string} fieldName - Field name in camelCase
 * @returns {any} Field value or null
 */
const getField = (obj, fieldName) => {
  if (!obj) return null;
  
  // Try camelCase first (e.g., "phoneNumber")
  if (obj[fieldName] !== undefined && obj[fieldName] !== null) {
    return obj[fieldName];
  }
  
  // Try PascalCase (e.g., "PhoneNumber")
  const pascalCase = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  if (obj[pascalCase] !== undefined && obj[pascalCase] !== null) {
    return obj[pascalCase];
  }
  
  return null;
};

/**
 * Get value or "Not Provided"
 */
const getValue = (value) => value || 'Not Provided';

/**
 * Table Row Component
 */
const Row = ({ label, value }) => (
  <TableRow>
    <TableCell sx={{ fontWeight: 600, width: '30%', borderBottom: '1px solid #f0f0f0' }}>
      {label}
    </TableCell>
    <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
      {getValue(value)}
    </TableCell>
  </TableRow>
);

// ============================================
// TAB COMPONENTS
// ============================================

const PersonalTab = ({ app }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>
      Personal Information
    </Typography>
    <Table size="small">
      <TableBody>
        <Row 
          label="Full Name" 
          value={getField(app, 'fullName') || 
                 `${getField(app, 'firstName') || ''} ${getField(app, 'middleName') || ''} ${getField(app, 'lastName') || ''}`.trim()} 
        />
        <Row label="Email" value={getField(app, 'email')} />
        <Row label="Phone" value={getField(app, 'phoneNumber')} />
        <Row label="Cell" value={getField(app, 'cellNumber')} />
        <Row label="Address" value={getField(app, 'address') || getField(app, 'homeAddress')} />
        <Row label="City" value={getField(app, 'city')} />
        <Row label="State" value={getField(app, 'state')} />
        <Row label="Zip" value={getField(app, 'zipCode') || getField(app, 'zip')} />
        <Row 
          label="SSN" 
          value={getField(app, 'socialSecurityNumber') ? 
                '***-**-' + getField(app, 'socialSecurityNumber').slice(-4) : 
                'Not Provided'} 
        />
        <Row label="Driver's License" value={getField(app, 'driversLicenseNumber')} />
        <Row label="License State" value={getField(app, 'driversLicenseState')} />
      </TableBody>
    </Table>
    
    <Divider sx={{ my: 3 }} />
    
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>
      Emergency Contact
    </Typography>
    <Table size="small">
      <TableBody>
        <Row label="Name" value={getField(app, 'emergencyContactPerson')} />
        <Row label="Relationship" value={getField(app, 'emergencyContactRelationship')} />
        <Row label="Address" value={getField(app, 'emergencyContactAddress')} />
        <Row label="Phone" value={getField(app, 'emergencyContactPhone')} />
      </TableBody>
    </Table>
  </Box>
);

const PositionTab = ({ app }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>
      Position Details
    </Typography>
    <Table size="small">
      <TableBody>
        <Row label="Position 1" value={getField(app, 'position1') || getField(app, 'positionAppliedFor')} />
        <Row label="Position 2" value={getField(app, 'position2')} />
        <Row label="Salary Desired" value={getField(app, 'salaryDesired') || getField(app, 'desiredSalary')} />
        <Row label="Salary Type" value={getField(app, 'salaryType')} />
        <Row label="Employment Type" value={getField(app, 'employmentSought')} />
        <Row label="Start Date" value={getField(app, 'availableStartDate') || getField(app, 'expectedStartDate')} />
        <Row label="Desired Locations" value={getField(app, 'desiredLocations')} />
        <Row label="Shift Preferences" value={getField(app, 'shiftPreferences')} />
        <Row label="Days Available" value={getField(app, 'daysAvailable')} />
      </TableBody>
    </Table>
  </Box>
);

const EducationTab = ({ app }) => {
  // Try to parse education data if it's JSON
  let educationData = null;
  const educationField = getField(app, 'education');
  if (educationField && typeof educationField === 'string') {
    try {
      educationData = JSON.parse(educationField);
    } catch (e) {
      // Not JSON, use as is
    }
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>
        Education
      </Typography>
      
      <Box sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Elementary School
        </Typography>
        <Table size="small">
          <TableBody>
            <Row label="School Name" value={getField(app, 'elementarySchool')} />
            <Row label="Years Completed" value={getField(app, 'elementaryYearsCompleted')} />
            <Row label="Diploma" value={getField(app, 'elementaryDiploma') ? 'Yes' : 'No'} />
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          High School
        </Typography>
        <Table size="small">
          <TableBody>
            <Row label="School Name" value={getField(app, 'highSchool')} />
            <Row label="Years Completed" value={getField(app, 'highSchoolYearsCompleted')} />
            <Row label="Diploma" value={getField(app, 'highSchoolDiploma') ? 'Yes' : 'No'} />
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Undergraduate
        </Typography>
        <Table size="small">
          <TableBody>
            <Row label="School Name" value={getField(app, 'undergraduateSchool')} />
            <Row label="Years Completed" value={getField(app, 'undergraduateYearsCompleted')} />
            <Row label="Degree" value={getField(app, 'undergraduateDegree') ? 'Yes' : 'No'} />
            <Row label="Skills/Major" value={getField(app, 'undergraduateSkills')} />
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Graduate School
        </Typography>
        <Table size="small">
          <TableBody>
            <Row label="School Name" value={getField(app, 'graduateSchool')} />
            <Row label="Years Completed" value={getField(app, 'graduateYearsCompleted')} />
            <Row label="Degree" value={getField(app, 'graduateDegree') ? 'Yes' : 'No'} />
            <Row label="Skills/Major" value={getField(app, 'graduateSkills')} />
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Row label="Special Knowledge/Skills" value={getField(app, 'specialKnowledge')} />
      </Box>
    </Box>
  );
};

const LicensesTab = ({ app }) => {
  // Try to parse licenses if JSON
  let licenses = [];
  const licensesField = getField(app, 'licenses');
  if (licensesField) {
    if (typeof licensesField === 'string') {
      try {
        licenses = JSON.parse(licensesField);
      } catch (e) {
        // Not JSON
      }
    } else if (Array.isArray(licensesField)) {
      licenses = licensesField;
    }
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>
        Licenses & Certifications
      </Typography>
      
      {licenses && licenses.length > 0 ? (
        licenses.map((license, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              License {index + 1}
            </Typography>
            <Table size="small">
              <TableBody>
                <Row label="License Type" value={license.licenseType || license.LicenseType} />
                <Row label="State" value={license.state || license.State} />
                <Row label="Number" value={license.number || license.Number} />
                <Row label="Expiration" value={license.expirationDate || license.ExpirationDate} />
              </TableBody>
            </Table>
          </Box>
        ))
      ) : (
        <Typography color="text.secondary">No licenses or certifications provided</Typography>
      )}

      <Divider sx={{ my: 3 }} />
      
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
        DIDD Training Classes
      </Typography>
      <Typography>
        {getValue(getField(app, 'diddTrainingClasses'))}
      </Typography>
    </Box>
  );
};

const ReferencesTab = ({ app }) => {
  // Try to parse references if JSON
  let references = [];
  const referencesField = getField(app, 'references');
  if (referencesField) {
    if (typeof referencesField === 'string') {
      try {
        references = JSON.parse(referencesField);
      } catch (e) {
        // Not JSON
      }
    } else if (Array.isArray(referencesField)) {
      references = referencesField;
    }
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>
        Professional References
      </Typography>
      
      {references && references.length > 0 ? (
        references.map((ref, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Reference {index + 1}
            </Typography>
            <Table size="small">
              <TableBody>
                <Row label="Name" value={`${ref.firstName || ref.FirstName || ''} ${ref.lastName || ref.LastName || ''}`.trim()} />
                <Row label="Phone" value={ref.phoneNumber || ref.PhoneNumber} />
                <Row label="Email" value={ref.email || ref.Email} />
                <Row label="Years Known" value={ref.yearsKnown || ref.YearsKnown} />
              </TableBody>
            </Table>
          </Box>
        ))
      ) : (
        <Typography color="text.secondary">No references provided</Typography>
      )}
    </Box>
  );
};

const EmploymentTab = ({ app }) => {
  // Try to parse employment history if JSON
  let employmentHistory = [];
  const employmentField = getField(app, 'employmentHistory');
  if (employmentField) {
    if (typeof employmentField === 'string') {
      try {
        employmentHistory = JSON.parse(employmentField);
      } catch (e) {
        // Not JSON
      }
    } else if (Array.isArray(employmentField)) {
      employmentHistory = employmentField;
    }
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>
        Employment History
      </Typography>
      
      {employmentHistory && employmentHistory.length > 0 ? (
        employmentHistory.map((job, index) => (
          <Box key={index} sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Position {index + 1}
            </Typography>
            <Table size="small">
              <TableBody>
                <Row label="Employer" value={job.employer || job.Employer} />
                <Row label="Job Title" value={job.jobTitle || job.JobTitle} />
                <Row label="Supervisor" value={job.supervisor || job.Supervisor} />
                <Row label="Address" value={job.address || job.Address} />
                <Row label="Phone" value={job.telephoneNumber || job.TelephoneNumber} />
                <Row label="From" value={job.employedFrom || job.EmployedFrom} />
                <Row label="To" value={job.employedTo || job.EmployedTo} />
                <Row label="Starting Pay" value={job.startingPay || job.StartingPay} />
                <Row label="Final Pay" value={job.finalPay || job.FinalPay} />
                <Row label="Work Performed" value={job.workPerformed || job.WorkPerformed} />
                <Row label="Reason for Leaving" value={job.reasonForLeaving || job.ReasonForLeaving} />
              </TableBody>
            </Table>
          </Box>
        ))
      ) : (
        <Typography color="text.secondary">No employment history provided</Typography>
      )}
    </Box>
  );
};

const NotesTab = ({ app }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>
      Review Notes
    </Typography>
    <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1, minHeight: 200 }}>
      <Typography sx={{ whiteSpace: 'pre-wrap' }}>
        {getField(app, 'reviewNotes') || 'No notes added yet.'}
      </Typography>
    </Box>
  </Box>
);

export default ApplicationDetailDialog;