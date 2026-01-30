// src/pages/employees/ViewEmployee.jsx
// FIXED VERSION: Better alignment + proper Edit permission check + NEW BULK IMPORT FIELDS
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  ContactEmergency as EmergencyIcon,
  Info as InfoIcon,
  LocalHospital as LocalHospitalIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import EditEmployeeModal from './EditEmployeeModal';
import { employeeService } from '../../services/employeeService';
import api from '../../services/authService';

// Import from models
import {
  getEmployeeTypeLabel,
  getEmploymentStatusLabel,
  formatEmployeeName
} from './models';

const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  
  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCurrentUser();
    fetchEmployee();
    checkPermissions();
  }, [id]);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/Auth/Me');
      setCurrentUser(response.data);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployeeById(id);
      setEmployee(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  const checkPermissions = async () => {
    try {
      const response = await api.get('/Menu/MyMenus');
      
      const findMenu = (menus) => {
        for (const menu of menus) {
          if (menu.menuName === 'employees' && menu.subMenus) {
            const employeeListMenu = menu.subMenus.find(
              sub => sub.menuName === 'employees-list' || sub.menuUrl === '/employees/list'
            );
            if (employeeListMenu) return employeeListMenu;
          }
          
          if (menu.menuName === 'employees-list' || menu.menuUrl === '/employees/list') {
            return menu;
          }
          
          if (menu.subMenus && menu.subMenus.length > 0) {
            const found = findMenu(menu.subMenus);
            if (found) return found;
          }
        }
        return null;
      };
      
      const employeeMenu = findMenu(response.data);
      if (employeeMenu) {
        setCanEdit(employeeMenu.canEdit || false);
        console.log('Edit permission:', employeeMenu.canEdit);
      }
    } catch (err) {
      console.error('Error checking permissions:', err);
      setCanEdit(false);
    }
  };

  const handleEditClick = () => {
    if (canEdit) {
      setEditModalOpen(true);
    } else {
      alert('You do not have permission to edit employees');
    }
  };

  const handleEditSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setEditModalOpen(false);
    fetchEmployee();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Build chips for PageHeader
  const headerChips = employee ? [
    { icon: <BadgeIcon />, label: employee.employeeCode },
    { icon: <BusinessIcon />, label: employee.department?.departmentName || 'No Department' },
    { icon: <WorkIcon />, label: getEmployeeTypeLabel(employee.employeeType) }
  ] : [];

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} sx={{ color: '#5B8FCC' }} />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/employees/list')}
            variant="outlined"
          >
            Back to Directory
          </Button>
        </Box>
      </Layout>
    );
  }

  if (!employee) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="warning">Employee not found</Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {showSuccess && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }} 
            onClose={() => setShowSuccess(false)}
          >
            {successMessage}
          </Alert>
        )}

        <PageHeader
          icon={PersonIcon}
          title={formatEmployeeName(employee)}
          subtitle={employee.jobTitle || 'Employee Profile'}
          chips={headerChips}
          actionButton={{
            label: 'Back to Directory',
            icon: <ArrowBackIcon />,
            onClick: () => navigate('/employees/list')
          }}
          backgroundColor="linear-gradient(135deg, #5B8FCC 0%, #4A73A6 100%)"
        />

        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ color: '#5B8FCC', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                    Personal Information
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 500, color: 'text.secondary', width: '40%', border: 'none' }}>
                        First Name
                      </TableCell>
                      <TableCell sx={{ border: 'none' }}>{employee.firstName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 500, color: 'text.secondary', border: 'none' }}>
                        Last Name
                      </TableCell>
                      <TableCell sx={{ border: 'none' }}>{employee.lastName}</TableCell>
                    </TableRow>
                    {employee.middleName && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500, color: 'text.secondary', border: 'none' }}>
                          Middle Name
                        </TableCell>
                        <TableCell sx={{ border: 'none' }}>{employee.middleName}</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell sx={{ fontWeight: 500, color: 'text.secondary', border: 'none' }}>
                        Date of Birth
                      </TableCell>
                      <TableCell sx={{ border: 'none' }}>{formatDate(employee.dateOfBirth)}</TableCell>
                    </TableRow>
                    {employee.gender && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500, color: 'text.secondary', border: 'none' }}>
                          Gender
                        </TableCell>
                        <TableCell sx={{ border: 'none' }}>{employee.gender}</TableCell>
                      </TableRow>
                    )}
                    {employee.maritalStatus && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500, color: 'text.secondary', border: 'none' }}>
                          Marital Status
                        </TableCell>
                        <TableCell sx={{ border: 'none' }}>{employee.maritalStatus}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ color: '#5B8FCC', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                    Contact Information
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Table size="small">
                  <TableBody>
                    {employee.phoneNumber && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500, color: 'text.secondary', width: '40%', border: 'none' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PhoneIcon fontSize="small" sx={{ color: '#6AB4A8' }} />
                            Phone Number
                          </Box>
                        </TableCell>
                        <TableCell sx={{ border: 'none' }}>{employee.phoneNumber}</TableCell>
                      </TableRow>
                    )}
                    {employee.personalEmail && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500, color: 'text.secondary', border: 'none' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EmailIcon fontSize="small" sx={{ color: '#6AB4A8' }} />
                            Personal Email
                          </Box>
                        </TableCell>
                        <TableCell sx={{ border: 'none' }}>{employee.personalEmail}</TableCell>
                      </TableRow>
                    )}
                    {employee.address && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500, color: 'text.secondary', border: 'none' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationIcon fontSize="small" sx={{ color: '#6AB4A8' }} />
                            Address
                          </Box>
                        </TableCell>
                        <TableCell sx={{ border: 'none' }}>
                          {employee.address}
                          {employee.city && `, ${employee.city}`}
                          {employee.state && `, ${employee.state}`}
                          {employee.zipCode && ` ${employee.zipCode}`}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          {/* Employment Information */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon sx={{ color: '#5B8FCC', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                    Employment Information
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: 3,
                  p: 2,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 1
                }}>
                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      Employee Code
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                      {employee.employeeCode}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      Employee Type
                    </Typography>
                    <Chip
                      label={getEmployeeTypeLabel(employee.employeeType)}
                      size="small"
                      sx={{
                        backgroundColor: employee.employeeType === 'AdminStaff' ? '#5B8FCC' : '#6AB4A8',
                        color: '#fff',
                        fontWeight: 600
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      Department
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                      {employee.department?.departmentName || 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      Job Title
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                      {employee.jobTitle || 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      Employment Status
                    </Typography>
                    <Chip
                      label={getEmploymentStatusLabel(employee.employmentStatus)}
                      size="small"
                      sx={{
                        backgroundColor: 
                          employee.employmentStatus === 'Active' ? '#4CAF50' :
                          employee.employmentStatus === 'OnLeave' ? '#FF9800' : '#F44336',
                        color: '#fff',
                        fontWeight: 600
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      Hire Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                      {formatDate(employee.hireDate)}
                    </Typography>
                  </Box>

                  {employee.manager && (
                    <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Manager
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                        {employee.manager.managerName}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Information - NEW */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InfoIcon sx={{ color: '#5B8FCC', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                    Additional Information
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Table size="small">
                  <TableBody>
                    {employee.ssnLast4 && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500, color: 'text.secondary', width: '50%', border: 'none' }}>
                          SSN (Last 4)
                        </TableCell>
                        <TableCell sx={{ border: 'none' }}>***-**-{employee.ssnLast4}</TableCell>
                      </TableRow>
                    )}

                    {employee.workHoursCategory && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500, color: 'text.secondary', border: 'none' }}>
                          Work Hours
                        </TableCell>
                        <TableCell sx={{ border: 'none' }}>{employee.workHoursCategory}</TableCell>
                      </TableRow>
                    )}

                    {employee.driversLicenseExpiration && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500, color: 'text.secondary', border: 'none' }}>
                          Driver's License Exp.
                        </TableCell>
                        <TableCell sx={{ border: 'none' }}>
                          {formatDate(employee.driversLicenseExpiration)}
                        </TableCell>
                      </TableRow>
                    )}

                    {employee.nursingLicenseExpiration && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500, color: 'text.secondary', border: 'none' }}>
                          Nursing License Exp.
                        </TableCell>
                        <TableCell sx={{ border: 'none' }}>
                          {formatDate(employee.nursingLicenseExpiration)}
                        </TableCell>
                      </TableRow>
                    )}

                    {!employee.ssnLast4 && !employee.workHoursCategory && 
                     !employee.driversLicenseExpiration && !employee.nursingLicenseExpiration && (
                      <TableRow>
                        <TableCell colSpan={2} sx={{ border: 'none', textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            No additional information available
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          {/* Benefits Eligibility - NEW */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalHospitalIcon sx={{ color: '#5B8FCC', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                    Benefits Eligibility
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {employee.isEligibleForInsurance && (
                    <Chip
                      label="Health Insurance"
                      color="success"
                      variant="outlined"
                      icon={<CheckCircleIcon />}
                    />
                  )}
                  {employee.isEligibleForDental && (
                    <Chip
                      label="Dental"
                      color="success"
                      variant="outlined"
                      icon={<CheckCircleIcon />}
                    />
                  )}
                  {employee.isEligibleForVision && (
                    <Chip
                      label="Vision"
                      color="success"
                      variant="outlined"
                      icon={<CheckCircleIcon />}
                    />
                  )}
                  {employee.isEligibleForLife && (
                    <Chip
                      label="Life Insurance"
                      color="success"
                      variant="outlined"
                      icon={<CheckCircleIcon />}
                    />
                  )}
                  {employee.isEligibleFor403B && (
                    <Chip
                      label="403(b) Retirement"
                      color="success"
                      variant="outlined"
                      icon={<CheckCircleIcon />}
                    />
                  )}
                  {employee.isEligibleForPTO && (
                    <Chip
                      label={`PTO (${employee.ptoBalance || 0} days)`}
                      color="success"
                      variant="outlined"
                      icon={<CheckCircleIcon />}
                    />
                  )}
                </Box>

                {!employee.isEligibleForInsurance && 
                 !employee.isEligibleForDental && 
                 !employee.isEligibleForVision &&
                 !employee.isEligibleForLife && 
                 !employee.isEligibleFor403B && 
                 !employee.isEligibleForPTO && (
                  <Typography variant="body2" color="text.secondary">
                    No benefits currently assigned
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Emergency Contact */}
          {(employee.emergencyContactName || employee.emergencyContactPhone) && (
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmergencyIcon sx={{ color: '#5B8FCC', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                      Emergency Contact
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Table size="small">
                    <TableBody>
                      {employee.emergencyContactName && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 500, color: 'text.secondary', width: '40%', border: 'none' }}>
                            Contact Name
                          </TableCell>
                          <TableCell sx={{ border: 'none' }}>{employee.emergencyContactName}</TableCell>
                        </TableRow>
                      )}
                      {employee.emergencyContactRelationship && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 500, color: 'text.secondary', border: 'none' }}>
                            Relationship
                          </TableCell>
                          <TableCell sx={{ border: 'none' }}>{employee.emergencyContactRelationship}</TableCell>
                        </TableRow>
                      )}
                      {employee.emergencyContactPhone && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 500, color: 'text.secondary', border: 'none' }}>
                            Phone Number
                          </TableCell>
                          <TableCell sx={{ border: 'none' }}>{employee.emergencyContactPhone}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Benefits Information */}
          {employee.employeeType === 'AdminStaff' && (
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarIcon sx={{ color: '#5B8FCC', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                      Benefits & PTO
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500, color: 'text.secondary', width: '40%', border: 'none' }}>
                          PTO Eligible
                        </TableCell>
                        <TableCell sx={{ border: 'none' }}>
                          {employee.isEligibleForPTO ? 'Yes' : 'No'}
                        </TableCell>
                      </TableRow>
                      {employee.isEligibleForPTO && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 500, color: 'text.secondary', border: 'none' }}>
                            PTO Balance
                          </TableCell>
                          <TableCell sx={{ border: 'none' }}>
                            {employee.ptoBalance} days
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500, color: 'text.secondary', border: 'none' }}>
                          Insurance Eligible
                        </TableCell>
                        <TableCell sx={{ border: 'none' }}>
                          {employee.isEligibleForInsurance ? 'Yes' : 'No'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/employees/list')}
          >
            Back to Directory
          </Button>
          {canEdit && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEditClick}
              sx={{
                background: 'linear-gradient(90deg, #6AB4A8 0%, #559089 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #559089 0%, #4A7C76 100%)',
                }
              }}
            >
              Edit Employee
            </Button>
          )}
        </Box>

        <EditEmployeeModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          employeeId={id}
          onSuccess={handleEditSuccess}
        />
      </Box>
    </Layout>
  );
};

export default ViewEmployee;