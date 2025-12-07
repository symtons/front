// src/pages/onboarding/components/TasksByCategory.jsx
/**
 * Tasks By Category Component
 * Groups and displays tasks by their category
 */

import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import {
  Person as PersonIcon,
  Computer as ComputerIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  Folder as FolderIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import TaskCard from './TaskCard';
import { groupTasksByCategory } from '../models/onboardingModels';

const TasksByCategory = ({ tasks, onTaskClick }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="body1" color="text.secondary">
          No tasks available
        </Typography>
      </Box>
    );
  }

  const tasksByCategory = groupTasksByCategory(tasks);
  
  const getCategoryIcon = (category) => {
    const iconProps = { sx: { color: '#667eea', mr: 1 } };
    
    if (category.includes('Personal')) return <PersonIcon {...iconProps} />;
    if (category.includes('IT') || category.includes('System')) return <ComputerIcon {...iconProps} />;
    if (category.includes('HR') || category.includes('Polic')) return <DescriptionIcon {...iconProps} />;
    if (category.includes('Training')) return <SchoolIcon {...iconProps} />;
    if (category.includes('Documentation')) return <FolderIcon {...iconProps} />;
    return <AssignmentIcon {...iconProps} />;
  };

  return (
    <Box>
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

          {/* Task Cards Grid */}
          <Grid container spacing={2}>
            {categoryTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.onboardingTaskId}>
                <TaskCard task={task} onClick={onTaskClick} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default TasksByCategory;