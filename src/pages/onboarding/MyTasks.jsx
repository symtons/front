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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Divider,
  Paper
} from '@mui/material';
import {
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as PendingIcon,
  Error as OverdueIcon,
  UploadFile as UploadIcon,
  Description as DocIcon,
  Assignment as TaskIcon,
  Assignment,
  Description,
  School,
  Info
} from '@mui/icons-material';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import Loading from '../../components/common/feedback/Loading';
import onboardingService from '../../services/onboardingService';
import FileUploader from '../../components/common/inputs/FileUploader';

const MyTasks = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    progressPercentage: 0
  });
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form data for task completion
  const [formData, setFormData] = useState({
    submittedData: '',
    notes: '',
    acknowledged: false
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await onboardingService.getMyTasks();
      setTasks(data.tasks || []);
      setStats({
        totalTasks: data.totalTasks || 0,
        completedTasks: data.completedTasks || 0,
        pendingTasks: data.pendingTasks || 0,
        progressPercentage: data.progressPercentage || 0
      });
    } catch (err) {
      setError(err.message || 'Failed to load onboarding tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task) => {
    if (task.status === 'Completed') return; // Don't open completed tasks
    setSelectedTask(task);
    setFormData({
      submittedData: '',
      notes: '',
      acknowledged: false
    });
    setSelectedFile(null);
    setTaskDialogOpen(true);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleSubmitTask = async () => {
    try {
      setSubmitting(true);
      setError('');

      if (selectedTask.taskType === 'Upload') {
        // Upload file
        if (!selectedFile) {
          throw new Error('Please select a file to upload');
        }
        await onboardingService.uploadTaskDocument(selectedTask.onboardingTaskId, selectedFile);
      } else if (selectedTask.taskType === 'Acknowledgment') {
        // Submit acknowledgment
        if (!formData.acknowledged) {
          throw new Error('Please acknowledge to continue');
        }
        await onboardingService.completeTask(selectedTask.onboardingTaskId, {
          submittedData: 'Acknowledged',
          notes: formData.notes
        });
      } else {
        // Submit text/input data
        if (!formData.submittedData) {
          throw new Error('Please provide required information');
        }
        await onboardingService.completeTask(selectedTask.onboardingTaskId, {
          submittedData: formData.submittedData,
          notes: formData.notes
        });
      }

      setTaskDialogOpen(false);
      setSelectedTask(null);
      await fetchTasks(); // Refresh tasks
    } catch (err) {
      setError(err.message || 'Failed to submit task');
    } finally {
      setSubmitting(false);
    }
  };

  const getTaskIcon = (status, isOverdue) => {
    if (status === 'Completed') {
      return <CompletedIcon sx={{ color: 'success.main' }} />;
    }
    if (isOverdue) {
      return <OverdueIcon sx={{ color: 'error.main' }} />;
    }
    return <PendingIcon sx={{ color: 'warning.main' }} />;
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

  const categoryIcons = {
    'Document': <DocIcon />,
    'Form': <Assignment />,
    'Policy': <Description />,
    'Training': <School />,
    'Information': <Info />
  };

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading your onboarding tasks..." />
      </Layout>
    );
  }

  const tasksByCategory = getTasksByCategory();
  const isOnboardingComplete = stats.completedTasks === stats.totalTasks && stats.totalTasks > 0;

  return (
    <Layout>
      <PageHeader
        title="My Onboarding"
        subtitle="Complete your onboarding tasks to activate your account"
        icon={TaskIcon} 
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Progress Overview */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Your Progress
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
          <Typography variant="h6" fontWeight={600} color={stats.progressPercentage === 100 ? 'success.main' : 'text.primary'}>
            {Math.round(stats.progressPercentage)}%
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {stats.completedTasks} of {stats.totalTasks} tasks completed
        </Typography>

        {isOnboardingComplete && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body1" fontWeight={600}>
              🎉 Congratulations! Your onboarding is complete!
            </Typography>
            <Typography variant="body2">
              Your account will be activated shortly. You'll gain full access to the system once verified by HR.
            </Typography>
          </Alert>
        )}
      </Paper>

      {/* Tasks by Category */}
      {Object.keys(tasksByCategory).map(category => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            {categoryIcons[category] || <TaskIcon />}
            {category}
            <Chip
              label={`${tasksByCategory[category].filter(t => t.status === 'Completed').length}/${tasksByCategory[category].length}`}
              size="small"
              color={tasksByCategory[category].every(t => t.status === 'Completed') ? 'success' : 'default'}
            />
          </Typography>

          <Grid container spacing={2}>
            {tasksByCategory[category].map(task => (
              <Grid item xs={12} key={task.onboardingTaskId}>
                <Card
                  sx={{
                    cursor: task.status === 'Completed' ? 'default' : 'pointer',
                    border: task.isOverdue ? '2px solid' : '1px solid',
                    borderColor: task.isOverdue ? 'error.main' : 'divider',
                    '&:hover': task.status !== 'Completed' ? {
                      boxShadow: 3,
                      borderColor: '#f59e42'
                    } : {}
                  }}
                  onClick={() => handleTaskClick(task)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      {getTaskIcon(task.status, task.isOverdue)}

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
                        </Box>

                        {task.status === 'Completed' && task.completedDate && (
                          <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                            ✓ Completed on {new Date(task.completedDate).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>

                      {task.status !== 'Completed' && (
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: '#f59e42',
                            '&:hover': { backgroundColor: '#e08a2e' }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskClick(task);
                          }}
                        >
                          {task.taskType === 'Upload' ? 'Upload' : 'Complete'}
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Task Completion Dialog */}
      <Dialog
        open={taskDialogOpen}
        onClose={() => !submitting && setTaskDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedTask && (
          <>
            <DialogTitle sx={{ backgroundColor: '#f59e42', color: 'white' }}>
              {selectedTask.taskName}
            </DialogTitle>
            <DialogContent dividers sx={{ mt: 2 }}>
              {selectedTask.instructionText && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  {selectedTask.instructionText}
                </Alert>
              )}

              {selectedTask.taskDescription && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedTask.taskDescription}
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Upload Type */}
              {selectedTask.taskType === 'Upload' && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Upload Document
                  </Typography>
                  {selectedTask.requiredFileTypes && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      Allowed file types: {selectedTask.requiredFileTypes}
                    </Typography>
                  )}
                  <FileUploader
                    onFileSelect={handleFileSelect}
                    accept={selectedTask.requiredFileTypes?.split(',').map(t => `.${t.trim()}`).join(',')}
                    maxSize={10} // 10MB
                  />
                  {selectedFile && (
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                      Selected: {selectedFile.name}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Acknowledgment Type */}
              {selectedTask.taskType === 'Acknowledgment' && (
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.acknowledged}
                        onChange={(e) => setFormData({ ...formData, acknowledged: e.target.checked })}
                      />
                    }
                    label={<Typography variant="body2">I acknowledge that I have read and understood this requirement</Typography>}
                  />
                </Box>
              )}

              {/* Input/Text Type */}
              {selectedTask.taskType === 'Input' && (
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Response"
                    value={formData.submittedData}
                    onChange={(e) => setFormData({ ...formData, submittedData: e.target.value })}
                    placeholder="Enter your response here..."
                  />
                </Box>
              )}

              {/* Optional Notes */}
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Additional Notes (Optional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                sx={{ mt: 2 }}
                placeholder="Add any notes or comments..."
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setTaskDialogOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmitTask}
                disabled={submitting}
                sx={{
                  backgroundColor: '#f59e42',
                  '&:hover': { backgroundColor: '#e08a2e' }
                }}
              >
                {submitting ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Layout>
  );
};

export default MyTasks;
