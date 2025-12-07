import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Alert
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Assignment as OnboardingIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import DataTable from '../../components/common/tables/DataTable';
import Loading from '../../components/common/feedback/Loading';
import onboardingService from '../../services/onboardingService';

const OnboardingMonitor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOnboardingEmployees();
  }, []);

  const fetchOnboardingEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await onboardingService.getOnboardingMonitor();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load onboarding monitor');
    } finally {
      setLoading(false);
    }
  };

  const handleViewEmployee = (employee) => {
    navigate(`/onboarding/employee/${employee.employeeId}`);
  };

  const handleRefresh = () => {
    fetchOnboardingEmployees();
  };

  // Define columns using DataTable format (not MUI DataGrid format)
  const columns = [
    {
      id: 'fullName',
      label: 'Employee',
      minWidth: 200,
      render: (row) => (
        <Typography variant="body2" fontWeight={600}>
          {row.fullName}
        </Typography>
      )
    },
    {
      id: 'employeeCode',
      label: 'Employee ID',
      minWidth: 130
    },
    {
      id: 'department',
      label: 'Department',
      minWidth: 150
    },
    {
      id: 'jobTitle',
      label: 'Position',
      minWidth: 150
    },
    {
      id: 'hireDate',
      label: 'Hire Date',
      minWidth: 120,
      render: (row) => (
        <Typography variant="body2">
          {row.hireDate ? new Date(row.hireDate).toLocaleDateString() : '-'}
        </Typography>
      )
    },
    {
      id: 'daysSinceHire',
      label: 'Days',
      minWidth: 80,
      render: (row) => (
        <Chip
          label={row.daysSinceHire}
          size="small"
          color={row.daysSinceHire > 7 ? 'error' : 'default'}
        />
      )
    },
    {
      id: 'progressPercentage',
      label: 'Progress',
      minWidth: 150,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={row.progressPercentage || 0}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: row.progressPercentage === 100 ? '#4caf50' : '#f59e42',
                  borderRadius: 4
                }
              }}
            />
          </Box>
          <Typography variant="caption" fontWeight={600}>
            {Math.round(row.progressPercentage || 0)}%
          </Typography>
        </Box>
      )
    },
    {
      id: 'completedTasks',
      label: 'Tasks',
      minWidth: 100,
      render: (row) => (
        <Typography variant="body2">
          {row.completedTasks}/{row.totalTasks}
        </Typography>
      )
    },
    {
      id: 'onboardingStatus',
      label: 'Status',
      minWidth: 130,
      render: (row) => (
        <Chip
          label={row.onboardingStatus}
          size="small"
          color={
            row.onboardingStatus === 'Completed' ? 'success' :
            row.onboardingStatus === 'InProgress' ? 'warning' :
            'default'
          }
        />
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      sortable: false,
      render: (row) => (
        <Button
          size="small"
          variant="outlined"
          startIcon={<ViewIcon />}
          onClick={() => handleViewEmployee(row)}
          sx={{ 
            textTransform: 'none',
            borderColor: '#f59e42',
            color: '#f59e42',
            '&:hover': {
              borderColor: '#e08a2e',
              backgroundColor: 'rgba(245, 158, 66, 0.1)'
            }
          }}
        >
          View
        </Button>
      )
    }
  ];

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading onboarding monitor..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Onboarding Monitor"
        subtitle="Monitor and manage employee onboarding progress"
        icon={OnboardingIcon}
        actions={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              borderColor: '#f59e42',
              color: '#f59e42',
              '&:hover': {
                borderColor: '#e08a2e',
                backgroundColor: 'rgba(245, 158, 66, 0.1)'
              }
            }}
          >
            Refresh
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {employees.length === 0 ? (
        <Alert severity="info">
          No employees currently in onboarding
        </Alert>
      ) : (
        <DataTable
          data={employees}
          columns={columns}
          loading={loading}
          page={0}
          rowsPerPage={employees.length}
          totalCount={employees.length}
          emptyMessage="No employees currently in onboarding"
          onRowClick={handleViewEmployee}
        />
      )}
    </Layout>
  );
};

export default OnboardingMonitor;