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
  Info,
  InsertDriveFile
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
    if (task.status === 'Completed') return;
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
        if (!selectedFile) {
          throw new Error('Please select a file to upload');
        }
        await onboardingService.uploadTaskDocument(selectedTask.onboardingTaskId, selectedFile);
      } else if (selectedTask.taskType === 'Acknowledgment') {
        if (!formData.acknowledged) {
          throw new Error('Please acknowledge to continue');
        }
        await onboardingService.completeTask(selectedTask.onboardingTaskId, {
          submittedData: 'Acknowledged',
          notes: formData.notes
        });
      } else {
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
      await fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to submit task');
    } finally {
      setSubmitting(false);
    }
  };

  const getTaskIcon = (status, isOverdue) => {
    if (status === 'Completed') {
      return <CompletedIcon sx={{ fontSize: 24 }} />;
    }
    if (isOverdue) {
      return <OverdueIcon sx={{ fontSize: 24 }} />;
    }
    return <PendingIcon sx={{ fontSize: 24 }} />;
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
    'Document': <InsertDriveFile sx={{ fontSize: 28 }} />,
    'Form': <Assignment sx={{ fontSize: 28 }} />,
    'Policy': <Description sx={{ fontSize: 28 }} />,
    'Training': <School sx={{ fontSize: 28 }} />,
    'Information': <Info sx={{ fontSize: 28 }} />,
    'Personal Information': <Info sx={{ fontSize: 28 }} />,
    'IT & Systems Access': <Description sx={{ fontSize: 28 }} />
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
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={700} sx={{ color: '#2c3e50' }}>
          Your Progress
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ flex: 1, mr: 3 }}>
            <LinearProgress
              variant="determinate"
              value={stats.progressPercentage}
              sx={{
                height: 14,
                borderRadius: 7,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: stats.progressPercentage === 100 ? '#4caf50' : '#f59e42',
                  borderRadius: 7,
                  boxShadow: stats.progressPercentage === 100 ? 
                    '0 0 10px rgba(76, 175, 80, 0.5)' : 
                    '0 0 10px rgba(245, 158, 66, 0.5)'
                }
              }}
            />
          </Box>
          <Typography variant="h5" fontWeight={700} color={stats.progressPercentage === 100 ? 'success.main' : '#f59e42'}>
            {Math.round(stats.progressPercentage)}%
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {stats.completedTasks} of {stats.totalTasks} tasks completed
        </Typography>

        {isOnboardingComplete && (
          <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
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
        <Box key={category} sx={{ mb: 5 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 3,
            pb: 2,
            borderBottom: '2px solid #f0f0f0'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: '#667eea',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}>
              {categoryIcons[category] || <TaskIcon sx={{ fontSize: 28 }} />}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#2c3e50' }}>
                {category}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {tasksByCategory[category].length} {tasksByCategory[category].length === 1 ? 'task' : 'tasks'}
              </Typography>
            </Box>
            <Chip
              label={`${tasksByCategory[category].filter(t => t.status === 'Completed').length}/${tasksByCategory[category].length} Complete`}
              size="medium"
              sx={{
                backgroundColor: tasksByCategory[category].every(t => t.status === 'Completed') ? '#4caf50' : '#e3f2fd',
                color: tasksByCategory[category].every(t => t.status === 'Completed') ? '#fff' : '#1976d2',
                fontWeight: 600,
                fontSize: '0.875rem',
                height: 32,
                px: 2
              }}
            />
          </Box>

          <Grid container spacing={3}>
            {tasksByCategory[category].map(task => (
              <Grid item xs={12} md={6} key={task.onboardingTaskId}>
                <Card
                  elevation={2}
                  sx={{
                    cursor: task.status === 'Completed' ? 'default' : 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid',
                    borderColor: task.isOverdue ? '#f44336' : 
                                 task.status === 'Completed' ? '#4caf50' : '#e0e0e0',
                    borderRadius: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: task.status === 'Completed' ? '#f1f8f4' : '#fff',
                    '&:hover': task.status !== 'Completed' ? {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      borderColor: '#f59e42',
                      transform: 'translateY(-4px)'
                    } : {},
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': task.status === 'Completed' ? {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      backgroundColor: '#4caf50'
                    } : {}
                  }}
                  onClick={() => handleTaskClick(task)}
                >
                  <CardContent sx={{ 
                    p: 3, 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    '&:last-child': { pb: 3 }
                  }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box sx={{ 
                        flexShrink: 0, 
                        width: 40, 
                        height: 40,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: task.status === 'Completed' ? '#e8f5e9' :
                                         task.isOverdue ? '#ffebee' : '#fff3e0'
                      }}>
                        {getTaskIcon(task.status, task.isOverdue)}
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontSize: '1rem',
                              fontWeight: 600,
                              lineHeight: 1.4,
                              flex: 1
                            }}
                          >
                            {task.taskName}
                          </Typography>
                          {task.isRequired && (
                            <Chip 
                              label="Required" 
                              size="small" 
                              sx={{ 
                                backgroundColor: '#ffebee',
                                color: '#c62828',
                                fontWeight: 600,
                                height: 22,
                                fontSize: '0.7rem',
                                '& .MuiChip-label': {
                                  px: 1
                                }
                              }} 
                            />
                          )}
                        </Box>

                        {task.taskDescription && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 2,
                              lineHeight: 1.6,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {task.taskDescription}
                          </Typography>
                        )}

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          <Chip
                            label={task.status}
                            size="small"
                            sx={{
                              backgroundColor: 
                                task.status === 'Completed' ? '#4caf50' :
                                task.isOverdue ? '#f44336' : '#ff9800',
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              height: 24
                            }}
                          />
                          <Chip
                            label={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderColor: '#ccc',
                              fontSize: '0.75rem',
                              height: 24
                            }}
                          />
                          {task.taskType && (
                            <Chip 
                              label={task.taskType} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                borderColor: '#ccc',
                                fontSize: '0.75rem',
                                height: 24
                              }}
                            />
                          )}
                        </Box>

                        {task.status === 'Completed' && task.completedDate && (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 0.5,
                            color: 'success.main',
                            mt: 'auto'
                          }}>
                            <CompletedIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption" fontWeight={500}>
                              Completed on {new Date(task.completedDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {task.status !== 'Completed' && (
                      <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #f0f0f0' }}>
                        <Button
                          fullWidth
                          variant="contained"
                          size="medium"
                          startIcon={task.taskType === 'Upload' ? <UploadIcon /> : null}
                          sx={{
                            backgroundColor: '#f59e42',
                            '&:hover': { 
                              backgroundColor: '#e08a2e',
                              transform: 'scale(1.02)'
                            },
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.2,
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(245, 158, 66, 0.3)',
                            transition: 'all 0.2s'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskClick(task);
                          }}
                        >
                          {task.taskType === 'Upload' ? 'Upload Document' : 
                           task.taskType === 'Acknowledgment' ? 'Acknowledge' :
                           'Complete Task'}
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Task Dialog - keeping existing dialog code */}
      <Dialog
        open={taskDialogOpen}
        onClose={() => !submitting && setTaskDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedTask && (
          <>
            <DialogTitle sx={{ backgroundColor: '#f59e42', color: 'white', fontWeight: 600 }}>
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

              {selectedTask.taskType === 'Upload' && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Upload Document
                  </Typography>
                  {selectedTask.requiredFileTypes && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      Allowed file types: {selectedTask.requiredFileTypes}
                    </Typography>
                  )}
                  <FileUploader
                    onChange={handleFileSelect}
                    file={selectedFile}
                    accept={selectedTask.requiredFileTypes?.split(',').map(t => `.${t.trim()}`).join(',')}
                    maxSize={10}
                  />
                  {selectedFile && (
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                      Selected: {selectedFile.name}
                    </Typography>
                  )}
                </Box>
              )}

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