// src/pages/onboarding/EmployeeOnboardingDetail.jsx
/**
 * Employee Onboarding Detail Page - HR VIEW
 * Read-only view for HR to monitor employee onboarding
 * Shows download links for uploads, displays submitted data
 */

import React, { useState, useEffect } from 'react';
import { Box, Button, Alert, Grid, Typography } from '@mui/material';
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Computer as ComputerIcon,
  School as SchoolIcon,
  Folder as FolderIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, PageHeader, Loading, ProgressCard } from '../../components/common';
import EmployeeInfoCard from './components/EmployeeInfoCard';
import HRTaskCard from './components/HRTaskCard';
import onboardingService from '../../services/onboardingService';
import { calculateStats, groupTasksByCategory } from './models/onboardingModels';

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

  const handleDownloadDocument = async (task) => {
    try {
      // Download document via API
      const response = await fetch(
        `https://localhost:7144/api/Onboarding/Task/${task.onboardingTaskId}/Download`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = task.documentOriginalName || 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download document: ' + err.message);
    }
  };

  const getCategoryIcon = (category) => {
    const iconProps = { sx: { color: '#667eea', mr: 1 } };
    
    if (category.includes('Personal')) return <PersonIcon {...iconProps} />;
    if (category.includes('IT') || category.includes('System')) return <ComputerIcon {...iconProps} />;
    if (category.includes('HR') || category.includes('Polic') || category.includes('Document')) return <DescriptionIcon {...iconProps} />;
    if (category.includes('Training')) return <SchoolIcon {...iconProps} />;
    if (category.includes('Documentation')) return <FolderIcon {...iconProps} />;
    return <AssignmentIcon {...iconProps} />;
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

  const tasksByCategory = groupTasksByCategory(tasks);

  return (
    <Layout>
      <PageHeader
        title={`${employee.fullName}'s Onboarding`}
        subtitle={`${employee.jobTitle || 'Field Operator'}${employee.department ? ` • ${employee.department}` : ''}`}
        icon={PersonIcon}
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

      {/* Progress Card */}
      <ProgressCard
        title="Onboarding Progress"
        percentage={stats.progressPercentage || 0}
        progressLabel={`${stats.completedTasks || 0} of ${stats.totalTasks || 0} tasks completed`}
        completionMessage="🎉 Onboarding Complete!"
        completionSubMessage="This employee has completed all onboarding tasks."
      />

      {/* Tasks by Category - HR VIEW (Read-Only) */}
      <Box sx={{ mt: 3 }}>
        {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
          <Box key={category} sx={{ mb: 4 }}>
            {/* Category Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {getCategoryIcon(category)}
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {category}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                ({categoryTasks.length} {categoryTasks.length === 1 ? 'task' : 'tasks'})
              </Typography>
            </Box>

            {/* Task Cards Grid - Using HR Task Card */}
            <Grid container spacing={2}>
              {categoryTasks.map((task) => (
                <Grid item xs={12} sm={6} md={4} key={task.onboardingTaskId}>
                  <HRTaskCard 
                    task={task} 
                    onDownload={handleDownloadDocument}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    </Layout>
  );
};

export default EmployeeOnboardingDetail;