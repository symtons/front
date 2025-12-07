// src/pages/departments/DepartmentDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import Loading from '../../components/common/feedback/Loading';
import DataTable from '../../components/common/tables/DataTable';
import departmentService from '../../services/departmentService';
import { getDepartmentColor, getDepartmentIcon } from './models/departmentModels';

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // User permissions
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const canEdit = user.role === 'Admin' || user.role === 'Executive';

  // Fetch department details on mount
  useEffect(() => {
    if (id) {
      fetchDepartmentDetails();
      fetchDepartmentEmployees();
    }
  }, [id]);

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchDepartmentDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await departmentService.getDepartmentById(id);
      setDepartment(data);
    } catch (err) {
      console.error('Error fetching department details:', err);
      setError(err.message || 'Failed to load department details');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentEmployees = async () => {
    try {
      const data = await departmentService.getDepartmentEmployees(id);
      setEmployees(data.employees || []);
    } catch (err) {
      console.error('Error fetching department employees:', err);
    }
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleBack = () => {
    navigate('/departments');
  };

  const handleEdit = () => {
    navigate(`/departments/manage/${id}`);
  };

  const handleViewEmployee = (employeeId) => {
    navigate(`/employees/${employeeId}`);
  };

  // ============================================
  // TABLE CONFIGURATION
  // ============================================

  const columns = [
    {
      id: 'employeeCode',
      label: 'Employee Code',
      minWidth: 120
    },
    {
      id: 'fullName',
      label: 'Name',
      minWidth: 180,
      render: (row) => (
        <Typography variant="body2" fontWeight={600}>
          {row.fullName}
        </Typography>
      )
    },
    {
      id: 'jobTitle',
      label: 'Job Title',
      minWidth: 150
    },
    {
      id: 'role',
      label: 'Role',
      minWidth: 120,
      render: (row) => (
        <Chip
          label={row.role}
          size="small"
          sx={{
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
            fontWeight: 600
          }}
        />
      )
    },
    {
      id: 'employeeType',
      label: 'Type',
      minWidth: 120,
      render: (row) => (
        <Chip
          label={row.employeeType === 'AdminStaff' ? 'Admin Staff' : 'Field Staff'}
          size="small"
          variant={row.employeeType === 'AdminStaff' ? 'filled' : 'outlined'}
          sx={{
            backgroundColor: row.employeeType === 'AdminStaff' ? '#6AB4A8' : 'transparent',
            color: row.employeeType === 'AdminStaff' ? 'white' : '#FDB94E',
            borderColor: '#FDB94E'
          }}
        />
      )
    },
    {
      id: 'employmentStatus',
      label: 'Status',
      minWidth: 100,
      align: 'center',
      render: (row) => (
        <Chip
          label={row.employmentStatus}
          size="small"
          sx={{
            backgroundColor: row.employmentStatus === 'Active' ? '#e8f5e9' : '#fff3cd',
            color: row.employmentStatus === 'Active' ? '#2e7d32' : '#856404',
            fontWeight: 600
          }}
        />
      )
    }
  ];

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading department details..." />
      </Layout>
    );
  }

  if (!department) {
    return (
      <Layout>
        <Alert severity="error">Department not found</Alert>
      </Layout>
    );
  }

  const departmentColor = getDepartmentColor(department.departmentName);

  return (
    <Layout>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{
          mb: 2,
          color: '#667eea',
          '&:hover': {
            backgroundColor: 'rgba(102, 126, 234, 0.04)'
          }
        }}
      >
        Back to Departments
      </Button>

      <PageHeader
        icon={BusinessIcon}
        title={department.departmentName}
        subtitle={department.description || 'Department Details'}
        chips={[
          <Chip
            key="code"
            label={department.departmentCode}
            sx={{
              backgroundColor: `${departmentColor}20`,
              color: departmentColor,
              fontWeight: 600
            }}
          />,
          <Chip
            key="status"
            label={department.isActive ? 'Active' : 'Inactive'}
            sx={{
              backgroundColor: department.isActive ? '#e8f5e9' : '#ffebee',
              color: department.isActive ? '#2e7d32' : '#c62828',
              fontWeight: 600
            }}
          />
        ]}
        actions={
          canEdit && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                backgroundColor: '#667eea',
                '&:hover': {
                  backgroundColor: '#5568d3'
                }
              }}
            >
              Edit Department
            </Button>
          )
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Statistics Summary Bar - Recruitment Style */}
      <Box 
        sx={{ 
          mb: 3, 
          p: 3, 
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea' }}>
            {department.totalEmployees || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Employees
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#6AB4A8' }}>
            {department.adminStaffCount || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Admin Staff
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#FDB94E' }}>
            {department.fieldStaffCount || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Field Staff
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#4caf50' }}>
            {department.activeEmployees || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Active
          </Typography>
        </Box>
      </Box>

      {/* Department Head Info */}
      {department.director && (
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#2c3e50' }}>
            Department Head
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1, color: '#667eea' }} />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Name
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {department.director.fullName}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1, color: '#667eea' }} />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {department.director.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 1, color: '#667eea' }} />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {department.director.phoneNumber || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Employees Table */}
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#2c3e50' }}>
            Department Employees ({employees.length})
          </Typography>
        </Box>
        <DataTable
          data={employees}
          columns={columns}
          loading={false}
          page={0}
          rowsPerPage={employees.length}
          totalCount={employees.length}
          emptyMessage="No employees in this department"
          onRowClick={(row) => handleViewEmployee(row.employeeId)}
        />
      </Paper>
    </Layout>
  );
};

export default DepartmentDetail;