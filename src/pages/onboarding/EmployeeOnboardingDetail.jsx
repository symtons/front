// src/pages/onboarding/EmployeeOnboardingDetail.jsx
/**
 * Employee Onboarding Detail Page - UPDATED
 * HR view of individual employee's onboarding progress
 * Now uses universal ProgressCard from common components
 */

import React, { useState, useEffect } from 'react';
import { Box, Button, Alert } from '@mui/material';
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, PageHeader, Loading, ProgressCard } from '../../components/common'; // ✨ Using universal components
import EmployeeInfoCard from './components/EmployeeInfoCard';
import TasksByCategory from './components/TasksByCategory';
import onboardingService from '../../services/onboardingService';
import { calculateStats } from './models/onboardingModels';

const EmployeeOnboardingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchEmployeeDetails();
    }
  }, [id]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await onboardingService.getEmployeeTasks(parseInt(id));
      
      setEmployee(data.employee || null);
      setTasks(data.tasks || []);
      
      const calculatedStats = calculateStats(data.tasks || []);
      setStats(calculatedStats);
    } catch (err) {
      setError(err.message || 'Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading employee onboarding details..." />
      </Layout>
    );
  }

  if (!employee) {
    return (
      <Layout>
        <Alert severity="error">Employee not found</Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title={`${employee.fullName}'s Onboarding`}
        subtitle={`${employee.jobTitle || 'Field Operator'}${employee.department ? ` • ${employee.department}` : ''}`}
        icon={<PersonIcon />}
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={() => navigate('/onboarding/monitor')}
              sx={{ textTransform: 'none' }}
            >
              Back to Monitor
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchEmployeeDetails}
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
          </Box>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Employee Info Card */}
      <EmployeeInfoCard employee={employee} />

      {/* ✨ Using universal ProgressCard */}
      <ProgressCard
        title="Onboarding Progress"
        percentage={stats.progressPercentage || 0}
        progressLabel={`${stats.completedTasks || 0} of ${stats.totalTasks || 0} tasks completed`}
        completionMessage="🎉 Onboarding Complete!"
        completionSubMessage="This employee has completed all onboarding tasks."
      />

      {/* Tasks by Category */}
      <TasksByCategory tasks={tasks} onTaskClick={null} />
    </Layout>
  );
};

export default EmployeeOnboardingDetail;