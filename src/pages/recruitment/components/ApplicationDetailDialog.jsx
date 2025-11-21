// src/pages/recruitment/components/ApplicationDetailDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  NoteAdd as NotesIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import CustomModal from '../../../components/common/feedback/CustomModal';
import StatusChip from '../../../components/common/display/StatusChip';
import applicationReviewService from '../../../services/applicationReviewService';
import {
  getStatusColor,
  getApprovalStatusColor,
  formatApplicationDate,
  formatPhoneNumber,
  formatFullName,
  formatAddress
} from '../models/applicationReviewModels';

/**
 * ApplicationDetailDialog Component
 * 
 * Full application details with tabs
 * 
 * Props:
 * - open: boolean
 * - onClose: function
 * - applicationId: number
 * - onApprove: function
 * - onReject: function
 * - onAddNotes: function
 */

const ApplicationDetailDialog = ({
  open,
  onClose,
  applicationId,
  onApprove,
  onReject,
  onAddNotes
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && applicationId) {
      fetchApplicationDetails();
    }
  }, [open, applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const data = await applicationReviewService.getApplicationById(applicationId);
      setApplication(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleClose = () => {
    setActiveTab(0);
    setApplication(null);
    onClose();
  };

  // Action buttons for modal
  const modalActions = application && (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button onClick={handleClose} startIcon={<CloseIcon />}>
        Close
      </Button>
      <Button
        variant="outlined"
        startIcon={<NotesIcon />}
        onClick={() => onAddNotes(application)}
      >
        Add Notes
      </Button>
      <Button
        variant="contained"
        color="error"
        startIcon={<RejectIcon />}
        onClick={() => onReject(application)}
        disabled={application.approvalStatus !== 'Pending'}
      >
        Reject
      </Button>
      <Button
        variant="contained"
        color="success"
        startIcon={<ApproveIcon />}
        onClick={() => onApprove(application)}
        disabled={application.approvalStatus !== 'Pending'}
      >
        Approve
      </Button>
    </Box>
  );

  return (
    <CustomModal
      open={open}
      onClose={handleClose}
      title="Application Details"
      subtitle={
        application
          ? `${formatFullName(
              application.firstName,
              application.middleName,
              application.lastName
            )} - ${application.position1 || 'N/A'}`
          : ''
      }
      size="full"
      actions={modalActions}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : application ? (
        <>
          {/* Status Header */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <StatusChip
              label={application.status || 'Submitted'}
              variant={getStatusColor(application.status)}
            />
            <StatusChip
              label={application.approvalStatus || 'Pending'}
              variant={getApprovalStatusColor(application.approvalStatus)}
            />
            <Typography variant="body2" color="text.secondary">
              Submitted: {formatApplicationDate(application.submissionDate || application.applicationDate)}
            </Typography>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Personal Info" />
              <Tab label="Position & Background" />
              <Tab label="Education" />
              <Tab label="References" />
              <Tab label="Employment History" />
              <Tab label="Authorizations" />
              <Tab label="Review Notes" />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          {activeTab === 0 && <PersonalInfoTab application={application} />}
          {activeTab === 1 && <PositionBackgroundTab application={application} />}
          {activeTab === 2 && <EducationTab application={application} />}
          {activeTab === 3 && <ReferencesTab application={application} />}
          {activeTab === 4 && <EmploymentHistoryTab application={application} />}
          {activeTab === 5 && <AuthorizationsTab application={application} />}
          {activeTab === 6 && <ReviewNotesTab application={application} />}
        </>
      ) : null}
    </CustomModal>
  );
};

// ============================================
// TAB COMPONENTS
// ============================================

const PersonalInfoTab = ({ application }) => (
  <Box>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Full Name</TableCell>
          <TableCell>
            {formatFullName(application.firstName, application.middleName, application.lastName)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Date of Birth</TableCell>
          <TableCell>{formatApplicationDate(application.dateOfBirth)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Gender</TableCell>
          <TableCell>{application.gender || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Phone Numbers</TableCell>
          <TableCell>
            Cell: {formatPhoneNumber(application.cellPhone)}
            <br />
            Home: {formatPhoneNumber(application.homePhone)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
          <TableCell>{application.email || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Address</TableCell>
          <TableCell>{formatAddress(application)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Box>
);

const PositionBackgroundTab = ({ application }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      Position Applied For
    </Typography>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Primary Position</TableCell>
          <TableCell>{application.position1 || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Secondary Position</TableCell>
          <TableCell>{application.position2 || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Desired Salary</TableCell>
          <TableCell>{application.desiredSalary || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Available Start Date</TableCell>
          <TableCell>{formatApplicationDate(application.availableStartDate)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <Divider sx={{ my: 3 }} />

    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      Background Questions
    </Typography>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Legally Authorized to Work in US</TableCell>
          <TableCell>
            <Chip
              label={application.legallyAuthorizedToWork ? 'Yes' : 'No'}
              color={application.legallyAuthorizedToWork ? 'success' : 'error'}
              size="small"
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Over 18 Years Old</TableCell>
          <TableCell>
            <Chip
              label={application.over18 ? 'Yes' : 'No'}
              color={application.over18 ? 'success' : 'error'}
              size="small"
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Valid Driver License</TableCell>
          <TableCell>
            <Chip
              label={application.hasDriverLicense ? 'Yes' : 'No'}
              color={application.hasDriverLicense ? 'success' : 'default'}
              size="small"
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Felony Conviction</TableCell>
          <TableCell>
            <Chip
              label={application.hasFelonyConviction ? 'Yes' : 'No'}
              color={application.hasFelonyConviction ? 'warning' : 'success'}
              size="small"
            />
            {application.felonyDetails && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {application.felonyDetails}
              </Typography>
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Box>
);

const EducationTab = ({ application }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      Education
    </Typography>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Highest Education Level</TableCell>
          <TableCell>{application.educationLevel || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>High School</TableCell>
          <TableCell>{application.highSchoolName || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>College/University</TableCell>
          <TableCell>{application.collegeName || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Degree</TableCell>
          <TableCell>{application.degree || 'N/A'}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Box>
);

const ReferencesTab = ({ application }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      Professional References
    </Typography>
    <Alert severity="info" sx={{ mb: 2 }}>
      Reference information is stored in the database
    </Alert>
  </Box>
);

const EmploymentHistoryTab = ({ application }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      Employment History
    </Typography>
    <Alert severity="info" sx={{ mb: 2 }}>
      Employment history is stored in the database
    </Alert>
  </Box>
);

const AuthorizationsTab = ({ application }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      Authorizations & Consents
    </Typography>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Background Check Authorization</TableCell>
          <TableCell>
            <Chip
              label={application.backgroundCheckConsent ? 'Authorized' : 'Not Authorized'}
              color={application.backgroundCheckConsent ? 'success' : 'default'}
              size="small"
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>DIDD Authorization</TableCell>
          <TableCell>
            <Chip
              label={application.diddAuthorizationConsent ? 'Authorized' : 'Not Authorized'}
              color={application.diddAuthorizationConsent ? 'success' : 'default'}
              size="small"
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Signature</TableCell>
          <TableCell>{application.electronicSignature || 'N/A'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Signature Date</TableCell>
          <TableCell>{formatApplicationDate(application.signatureDate)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Box>
);

const ReviewNotesTab = ({ application }) => {
  const parseNotes = () => {
    if (!application.reviewNotes) return [];
    return application.reviewNotes.split('\n\n').map((note, index) => {
      const match = note.match(/^\[(.*?)\]\s*(.*)$/);
      if (match) {
        return { timestamp: match[1], text: match[2], id: index };
      }
      return { timestamp: '', text: note, id: index };
    });
  };

  const notes = parseNotes();

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Review Notes
      </Typography>
      {notes.length === 0 ? (
        <Alert severity="info">No review notes yet</Alert>
      ) : (
        notes.map((note) => (
          <Box
            key={note.id}
            sx={{
              mb: 2,
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.300'
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {note.timestamp}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {note.text}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ApplicationDetailDialog;