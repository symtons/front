// src/pages/onboarding/models/onboardingModels.js
/**
 * Onboarding Models
 * Data structures, validation, formatting, and business logic
 * Following the pattern from recruitment/models/jobApplicationModels.js
 */

// ========================================
// CONSTANTS & ENUMS
// ========================================

export const TASK_TYPES = {
  INPUT: 'Input',
  ACKNOWLEDGMENT: 'Acknowledgment',
  UPLOAD: 'Upload'
};

export const TASK_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed',
  OVERDUE: 'Overdue'
};

export const ONBOARDING_STATUS = {
  NOT_STARTED: 'NotStarted',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed'
};

export const TASK_CATEGORIES = {
  PERSONAL_INFO: 'Personal Information',
  IT_SYSTEMS: 'IT & Systems Access',
  HR_POLICIES: 'HR & Policies',
  TRAINING: 'Training & Development',
  DOCUMENTATION: 'Documentation'
};

// ========================================
// COLOR SCHEMES (TPA Brand Colors)
// ========================================

export const getTaskStatusColor = (status, isOverdue = false) => {
  if (isOverdue && status !== TASK_STATUS.COMPLETED) {
    return {
      bg: '#f8d7da',
      color: '#721c24',
      border: '#f5c6cb'
    };
  }

  switch (status) {
    case TASK_STATUS.COMPLETED:
      return {
        bg: '#d4edda',
        color: '#155724',
        border: '#c3e6cb'
      };
    case TASK_STATUS.IN_PROGRESS:
      return {
        bg: '#fff3cd',
        color: '#856404',
        border: '#ffeaa7'
      };
    case TASK_STATUS.PENDING:
    default:
      return {
        bg: '#e7f3ff',
        color: '#004085',
        border: '#b8daff'
      };
  }
};

export const getOnboardingStatusColor = (status) => {
  switch (status) {
    case ONBOARDING_STATUS.COMPLETED:
      return {
        bg: '#d4edda',
        color: '#155724',
        border: '#c3e6cb'
      };
    case ONBOARDING_STATUS.IN_PROGRESS:
      return {
        bg: '#fff3cd',
        color: '#856404',
        border: '#ffeaa7'
      };
    case ONBOARDING_STATUS.NOT_STARTED:
    default:
      return {
        bg: '#e7f3ff',
        color: '#004085',
        border: '#b8daff'
      };
  }
};

// ========================================
// DATA TRANSFORMATION
// ========================================

export const groupTasksByCategory = (tasks) => {
  if (!Array.isArray(tasks)) return {};
  
  return tasks.reduce((acc, task) => {
    const category = task.taskCategory || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {});
};

export const calculateStats = (tasks) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      overdueTasks: 0,
      progressPercentage: 0
    };
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length;
  const overdueTasks = tasks.filter(t => isTaskOverdue(t)).length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  return {
    totalTasks,
    completedTasks,
    pendingTasks: totalTasks - completedTasks,
    overdueTasks,
    progressPercentage
  };
};

export const calculateAverageProgress = (employees) => {
  if (!Array.isArray(employees) || employees.length === 0) return 0;
  
  const totalProgress = employees.reduce((sum, emp) => sum + (emp.progressPercentage || 0), 0);
  return Math.round(totalProgress / employees.length);
};

export const calculateTotalOverdue = (employees) => {
  if (!Array.isArray(employees) || employees.length === 0) return 0;
  
  return employees.reduce((sum, emp) => sum + (emp.overdueTasks || 0), 0);
};

// ========================================
// VALIDATION & CHECKS
// ========================================

export const isTaskOverdue = (task) => {
  if (!task || task.status === TASK_STATUS.COMPLETED) return false;
  
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return dueDate < today;
};

export const canCompleteTask = (task) => {
  return task && task.status !== TASK_STATUS.COMPLETED;
};

export const validateTaskCompletion = (task, data) => {
  const errors = [];

  if (!task) {
    errors.push('Task not found');
    return { isValid: false, errors };
  }

  switch (task.taskType) {
    case TASK_TYPES.INPUT:
      if (!data.submittedData || data.submittedData.trim() === '') {
        errors.push('Please provide the required information');
      }
      break;

    case TASK_TYPES.ACKNOWLEDGMENT:
      if (!data.acknowledged) {
        errors.push('Please acknowledge to continue');
      }
      break;

    case TASK_TYPES.UPLOAD:
      if (!data.file) {
        errors.push('Please select a file to upload');
      } else {
        if (task.requiredFileTypes) {
          const allowedTypes = task.requiredFileTypes.split(',').map(t => t.trim().toLowerCase());
          const fileExtension = data.file.name.split('.').pop().toLowerCase();
          
          if (!allowedTypes.includes(fileExtension)) {
            errors.push(`Invalid file type. Allowed types: ${task.requiredFileTypes}`);
          }
        }
        
        const maxSize = 10 * 1024 * 1024;
        if (data.file.size > maxSize) {
          errors.push('File size exceeds 10MB limit');
        }
      }
      break;

    default:
      errors.push('Invalid task type');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// ========================================
// FORMATTING
// ========================================

export const formatDueDate = (date) => {
  if (!date) return '-';
  
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatCompletedDate = (date) => {
  if (!date) return '-';
  
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return 0;
  
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const getDueDateLabel = (task) => {
  if (!task || !task.dueDate) return 'No due date';
  
  if (task.status === TASK_STATUS.COMPLETED) {
    return `Completed ${formatCompletedDate(task.completedDate)}`;
  }
  
  const daysUntil = getDaysUntilDue(task.dueDate);
  
  if (daysUntil < 0) {
    return `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''}`;
  } else if (daysUntil === 0) {
    return 'Due today';
  } else if (daysUntil === 1) {
    return 'Due tomorrow';
  } else if (daysUntil <= 3) {
    return `Due in ${daysUntil} days`;
  } else {
    return `Due ${formatDueDate(task.dueDate)}`;
  }
};

// ========================================
// FILTERING & SORTING
// ========================================

export const filterEmployeesByStatus = (employees, status) => {
  if (!Array.isArray(employees)) return [];
  if (status === 'All') return employees;
  
  return employees.filter(emp => emp.onboardingStatus === status);
};

export const searchEmployees = (employees, searchTerm) => {
  if (!Array.isArray(employees)) return [];
  if (!searchTerm || searchTerm.trim() === '') return employees;
  
  const term = searchTerm.toLowerCase().trim();
  
  return employees.filter(emp => 
    (emp.fullName || '').toLowerCase().includes(term) ||
    (emp.employeeCode || '').toLowerCase().includes(term) ||
    (emp.email || '').toLowerCase().includes(term)
  );
};

export const sortTasksByDueDate = (tasks, order = 'asc') => {
  if (!Array.isArray(tasks)) return [];
  
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
};

// ========================================
// UI HELPERS
// ========================================

export const getCategoryIcon = (category) => {
  switch (category) {
    case TASK_CATEGORIES.PERSONAL_INFO:
      return 'Person';
    case TASK_CATEGORIES.IT_SYSTEMS:
      return 'Computer';
    case TASK_CATEGORIES.HR_POLICIES:
      return 'Description';
    case TASK_CATEGORIES.TRAINING:
      return 'School';
    case TASK_CATEGORIES.DOCUMENTATION:
      return 'Folder';
    default:
      return 'Assignment';
  }
};

export const getTaskTypeIcon = (taskType) => {
  switch (taskType) {
    case TASK_TYPES.INPUT:
      return 'Edit';
    case TASK_TYPES.ACKNOWLEDGMENT:
      return 'CheckCircle';
    case TASK_TYPES.UPLOAD:
      return 'Upload';
    default:
      return 'Assignment';
  }
};

export const getProgressColor = (percentage) => {
  if (percentage === 100) return '#4caf50';
  if (percentage >= 67) return '#6AB4A8';
  if (percentage >= 33) return '#f59e42';
  return '#667eea';
};