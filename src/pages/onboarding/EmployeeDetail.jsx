import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Grid,
  Button,
  Chip,
  Alert,
  Paper,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  CheckCircle as VerifyIcon,
  EventAvailable as ExtendIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import Loading from '../../components/common/feedback/Loading';
import InfoCard from '../../components/common/display/InfoCard';
import onboardingService from '../../services/onboardingService';

const EmployeeDetail = () => {
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
      setStats({
        totalTasks: data.totalTasks || 0,
        completedTasks: data.completedTasks || 0,
        pendingTasks: data.pendingTasks || 0,
        progressPercentage: data.progressPercentage || 0
      });
    } catch (err) {
      setError(err.message || 'Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTask = async (taskId) => {
    try {
      await onboardingService.verifyTask(taskId, {
        isVerified: true,
        verificationNotes: 'Verified by HR'
      });
      await fetchEmployeeDetails();
    } catch (err) {
      setError(err.message || 'Failed to verify task');
    }
  };

  const getTasksByCategory = () => {
    const categories = {};
    tasks.forEach(task => {
      const category = task.taskCategory || 'Other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(task);
    });
    return categories;
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

  const tasksByCategory = getTasksByCategory();

  return (
    <Layout>
      <PageHeader
        title={`${employee.fullName}'s Onboarding`}
        subtitle={`${employee.jobTitle} - ${employee.department}`}
        icon={<PersonIcon />}
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={() => navigate('/onboarding/monitor')}
            >
              Back to Monitor
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchEmployeeDetails}
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

      {/* Employee Info & Progress */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Progress Overview
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ flex: 1, mr: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={stats.progressPercentage}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: stats.progressPercentage === 100 ? 'success.main' : '#f59e42'
                    }
                  }}
                />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                {Math.round(stats.progressPercentage)}%
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {stats.completedTasks} of {stats.totalTasks} tasks completed ({stats.pendingTasks} pending)
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">Employee ID</Typography>
                <Typography variant="body2" fontWeight={600}>{employee.employeeCode}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">Email</Typography>
                <Typography variant="body2" fontWeight={600}>{employee.email}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">Hire Date</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : '-'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Chip
                  label={employee.onboardingStatus}
                  size="small"
                  color={employee.onboardingStatus === 'Completed' ? 'success' : 'warning'}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <InfoCard
            icon={<PersonIcon />}
            title="Account Status"
            data={[
              { label: 'Account', value: employee.accountStatus, bold: true },
              { label: 'Onboarding', value: employee.onboardingStatus },
              { label: 'Employment', value: employee.employmentStatus }
            ]}
            color="purple"
            elevated={true}
          />
        </Grid>
      </Grid>

      {/* Tasks by Category */}
      {Object.keys(tasksByCategory).map(category => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {category}
            <Chip
              label={`${tasksByCategory[category].filter(t => t.status === 'Completed').length}/${tasksByCategory[category].length}`}
              size="small"
              color={tasksByCategory[category].every(t => t.status === 'Completed') ? 'success' : 'default'}
              sx={{ ml: 2 }}
            />
          </Typography>

          <Grid container spacing={2}>
            {tasksByCategory[category].map(task => (
              <Grid item xs={12} key={task.onboardingTaskId}>
                <Card
                  sx={{
                    border: task.isOverdue ? '2px solid' : '1px solid',
                    borderColor: task.isOverdue ? 'error.main' : 'divider'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {task.taskName}
                          {task.isRequired && (
                            <Chip label="Required" size="small" color="error" sx={{ ml: 1 }} />
                          )}
                        </Typography>

                        {task.taskDescription && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {task.taskDescription}
                          </Typography>
                        )}

                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={task.status}
                            size="small"
                            color={
                              task.status === 'Completed' ? 'success' :
                              task.isOverdue ? 'error' : 'warning'
                            }
                          />
                          <Chip
                            label={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                            size="small"
                            variant="outlined"
                          />
                          {task.taskType && (
                            <Chip label={task.taskType} size="small" variant="outlined" />
                          )}
                          {task.isVerified && (
                            <Chip label="✓ Verified" size="small" color="success" />
                          )}
                        </Box>

                        {task.status === 'Completed' && (
                          <>
                            <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                              Completed on {new Date(task.completedDate).toLocaleDateString()}
                            </Typography>
                            {task.documentOriginalName && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                File: {task.documentOriginalName}
                              </Typography>
                            )}
                            {task.submittedData && (
                              <Box sx={{ mt: 1, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography variant="caption" color="text.secondary">Submitted Data:</Typography>
                                <Typography variant="body2">{task.submittedData}</Typography>
                              </Box>
                            )}
                            {task.notes && (
                              <Box sx={{ mt: 1, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography variant="caption" color="text.secondary">Notes:</Typography>
                                <Typography variant="body2">{task.notes}</Typography>
                              </Box>
                            )}
                          </>
                        )}
                      </Box>

                      {/* Actions */}
                      {task.status === 'Completed' && !task.isVerified && (
                        <Box>
                          <Tooltip title="Verify Task">
                            <IconButton
                              color="success"
                              onClick={() => handleVerifyTask(task.onboardingTaskId)}
                            >
                              <VerifyIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Layout>
  );
};

export default EmployeeDetail;
