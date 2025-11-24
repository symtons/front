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

  const columns = [
    {
      field: 'fullName',
      headerName: 'Employee',
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'employeeCode',
      headerName: 'Employee ID',
      width: 130
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 150
    },
    {
      field: 'jobTitle',
      headerName: 'Position',
      width: 150
    },
    {
      field: 'hireDate',
      headerName: 'Hire Date',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleDateString() : '-'}
        </Typography>
      )
    },
    {
      field: 'daysSinceHire',
      headerName: 'Days',
      width: 80,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value > 7 ? 'warning' : 'default'}
        />
      )
    },
    {
      field: 'progressPercentage',
      headerName: 'Progress',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={params.value || 0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: params.value === 100 ? 'success.main' : '#f59e42'
                  }
                }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 40 }}>
              {Math.round(params.value || 0)}%
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'completedTasks',
      headerName: 'Tasks',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.completedTasks}/{params.row.totalTasks}
        </Typography>
      )
    },
    {
      field: 'overdueTasks',
      headerName: 'Overdue',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value || 0}
          size="small"
          color={params.value > 0 ? 'error' : 'default'}
        />
      )
    },
    {
      field: 'onboardingStatus',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === 'Completed' ? 'success' :
            params.value === 'InProgress' ? 'warning' :
            'default'
          }
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          startIcon={<ViewIcon />}
          onClick={() => handleViewEmployee(params.row)}
          sx={{ textTransform: 'none' }}
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
        icon={<OnboardingIcon />}
        actions={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
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
        <Box sx={{ height: 600 }}>
          <DataTable
            rows={employees}
            columns={columns}
            getRowId={(row) => row.employeeId}
            loading={loading}
          />
        </Box>
      )}
    </Layout>
  );
};

export default OnboardingMonitor;
