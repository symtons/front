// ApplicationDetailDialog with debugging and better N/A handling
import React, { useState, useEffect } from 'react';
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

  // Debug logging
  useEffect(() => {
    console.log('=== ApplicationDetailDialog ===');
    console.log('open:', open);
    console.log('application:', application);
  }, [open, application]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleClose = () => {
    setActiveTab(0);
    onClose();
  };

  // If no application, don't render
  if (!application) {
    console.log('No application provided to dialog');
    return null;
  }

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
            {application.fullName || `${application.firstName || ''} ${application.lastName || ''}`.trim() || 'Applicant'} 
            {' - '}
            {application.positionAppliedFor || application.position1 || 'Position Not Specified'}
          </Typography>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Status Chips */}
      <Box sx={{ px: 3, pt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
        <Chip
          label={application.approvalStatus || 'Pending'}
          color={
            application.approvalStatus === 'Approved' ? 'success' :
            application.approvalStatus === 'Rejected' ? 'error' : 'warning'
          }
          size="small"
        />
        <Typography variant="body2" color="text.secondary">
          Application ID: {application.applicationId || 'N/A'}
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
        {application.approvalStatus === 'Pending' && (
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

// Helper function to safely get value
const getValue = (value) => value || 'Not Provided';

// Tabs
const PersonalTab = ({ app }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>Personal Information</Typography>
    <Table size="small">
      <TableBody>
        <Row label="Full Name" value={app.fullName || `${app.firstName || ''} ${app.middleName || ''} ${app.lastName || ''}`.trim()} />
        <Row label="Email" value={app.email} />
        <Row label="Phone" value={app.phoneNumber} />
        <Row label="Cell" value={app.cellNumber} />
        <Row label="Address" value={app.homeAddress} />
        <Row label="City" value={app.city} />
        <Row label="State" value={app.state} />
        <Row label="Zip" value={app.zipCode} />
        <Row label="SSN" value={app.socialSecurityNumber ? '***-**-' + app.socialSecurityNumber.slice(-4) : 'Not Provided'} />
        <Row label="Driver's License" value={app.driversLicenseNumber} />
        <Row label="License State" value={app.driversLicenseState} />
      </TableBody>
    </Table>
    <Divider sx={{ my: 3 }} />
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>Emergency Contact</Typography>
    <Table size="small">
      <TableBody>
        <Row label="Name" value={app.emergencyContactPerson} />
        <Row label="Relationship" value={app.emergencyContactRelationship} />
        <Row label="Address" value={app.emergencyContactAddress} />
        <Row label="Phone" value={app.emergencyContactPhone} />
      </TableBody>
    </Table>
  </Box>
);

const PositionTab = ({ app }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>Position Details</Typography>
    <Table size="small">
      <TableBody>
        <Row label="Position 1" value={app.position1 || app.positionAppliedFor} />
        <Row label="Position 2" value={app.position2} />
        <Row label="Salary Desired" value={app.salaryDesired} />
        <Row label="Employment Type" value={app.employmentSought} />
        <Row label="Start Date" value={app.availableStartDate} />
      </TableBody>
    </Table>
  </Box>
);

const EducationTab = ({ app }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>Education</Typography>
    <Box sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>High School</Typography>
      <Table size="small">
        <TableBody>
          <Row label="Name" value={app.highSchoolName} />
          <Row label="Location" value={app.highSchoolLocation} />
          <Row label="Graduated" value={app.highSchoolGraduated ? 'Yes' : 'No'} />
        </TableBody>
      </Table>
    </Box>
    <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>College</Typography>
      <Table size="small">
        <TableBody>
          <Row label="Name" value={app.collegeName} />
          <Row label="Location" value={app.collegeLocation} />
          <Row label="Degree" value={app.collegeDegree} />
          <Row label="Graduated" value={app.collegeGraduated ? 'Yes' : 'No'} />
        </TableBody>
      </Table>
    </Box>
  </Box>
);

const LicensesTab = ({ app }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>Licenses & Certifications</Typography>
    <Table size="small">
      <TableBody>
        <Row label="RN License" value={app.rnLicense} />
        <Row label="LPN License" value={app.lpnLicense} />
        <Row label="CPR Certified" value={app.cprCertification} />
        <Row label="First Aid" value={app.firstAidCertification} />
        <Row label="Other" value={app.otherCertifications} />
      </TableBody>
    </Table>
  </Box>
);

const ReferencesTab = ({ app }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>References</Typography>
    {[1, 2, 3].map(num => (
      <Box key={num} sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Reference {num}</Typography>
        <Table size="small">
          <TableBody>
            <Row label="Name" value={app[`reference${num}Name`]} />
            <Row label="Company" value={app[`reference${num}Company`]} />
            <Row label="Title" value={app[`reference${num}Title`]} />
            <Row label="Phone" value={app[`reference${num}Phone`]} />
          </TableBody>
        </Table>
      </Box>
    ))}
  </Box>
);

const EmploymentTab = ({ app }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>Employment History</Typography>
    {[1, 2, 3].map(num => app[`employer${num}Name`] && (
      <Box key={num} sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Employer {num}</Typography>
        <Table size="small">
          <TableBody>
            <Row label="Company" value={app[`employer${num}Name`]} />
            <Row label="Job Title" value={app[`employer${num}JobTitle`]} />
            <Row label="Supervisor" value={app[`employer${num}Supervisor`]} />
            <Row label="Phone" value={app[`employer${num}Phone`]} />
            <Row label="Reason for Leaving" value={app[`employer${num}ReasonForLeaving`]} />
          </TableBody>
        </Table>
      </Box>
    ))}
  </Box>
);

const NotesTab = ({ app }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>Review Notes</Typography>
    {app.reviewNotes ? (
      <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{app.reviewNotes}</Typography>
      </Box>
    ) : (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        No review notes yet
      </Typography>
    )}
  </Box>
);

const Row = ({ label, value }) => (
  <TableRow>
    <TableCell sx={{ fontWeight: 600, width: '35%', border: 'none', py: 1 }}>{label}</TableCell>
    <TableCell sx={{ border: 'none', py: 1 }}>{getValue(value)}</TableCell>
  </TableRow>
);

export default ApplicationDetailDialog;