// src/pages/performance/models/performanceModels.js
/**
 * Performance Management Models & Utilities
 * Data transformation, formatting, and constants
 */

// =============================================
// CONSTANTS
// =============================================

export const PERIOD_TYPES = {
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  ANNUAL: 'Annual'
};

export const REVIEW_STATUS = {
  OPEN: 'Open',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed'
};

export const GOAL_STATUS = {
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

export const FEEDBACK_TYPES = {
  POSITIVE: 'Positive',
  CONSTRUCTIVE: 'Constructive',
  GENERAL: 'General'
};

// =============================================
// COLOR HELPERS
// =============================================

export const getReviewStatusColor = (status) => {
  switch (status) {
    case REVIEW_STATUS.OPEN:
      return { bg: '#FFF4E5', color: '#FDB94E', border: '#FDB94E' };
    case REVIEW_STATUS.IN_PROGRESS:
      return { bg: '#E3F2FD', color: '#667eea', border: '#667eea' };
    case REVIEW_STATUS.COMPLETED:
      return { bg: '#E8F5E9', color: '#6AB4A8', border: '#6AB4A8' };
    default:
      return { bg: '#F5F5F5', color: '#666', border: '#666' };
  }
};

export const getGoalStatusColor = (status) => {
  switch (status) {
    case GOAL_STATUS.ACTIVE:
      return { bg: '#E3F2FD', color: '#667eea', border: '#667eea' };
    case GOAL_STATUS.COMPLETED:
      return { bg: '#E8F5E9', color: '#6AB4A8', border: '#6AB4A8' };
    case GOAL_STATUS.CANCELLED:
      return { bg: '#FFEBEE', color: '#f44336', border: '#f44336' };
    default:
      return { bg: '#F5F5F5', color: '#666', border: '#666' };
  }
};

export const getFeedbackTypeColor = (type) => {
  switch (type) {
    case FEEDBACK_TYPES.POSITIVE:
      return { bg: '#E8F5E9', color: '#6AB4A8', border: '#6AB4A8' };
    case FEEDBACK_TYPES.CONSTRUCTIVE:
      return { bg: '#FFF4E5', color: '#FDB94E', border: '#FDB94E' };
    case FEEDBACK_TYPES.GENERAL:
      return { bg: '#E3F2FD', color: '#667eea', border: '#667eea' };
    default:
      return { bg: '#F5F5F5', color: '#666', border: '#666' };
  }
};

export const getRatingColor = (rating) => {
  if (rating >= 90) return '#6AB4A8'; // Excellent
  if (rating >= 80) return '#667eea'; // Very Good
  if (rating >= 70) return '#FDB94E'; // Good
  if (rating >= 60) return '#f59e42'; // Fair
  return '#f44336'; // Needs Improvement
};

export const getRankBadge = (rank) => {
  if (rank === 1) return { emoji: '🥇', color: '#FFD700', label: '1st Place' };
  if (rank === 2) return { emoji: '🥈', color: '#C0C0C0', label: '2nd Place' };
  if (rank === 3) return { emoji: '🥉', color: '#CD7F32', label: '3rd Place' };
  return { emoji: '', color: '#666', label: `#${rank}` };
};

// =============================================
// FORMATTING HELPERS
// =============================================

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatScore = (score) => {
  if (score === null || score === undefined) return 'N/A';
  return `${parseFloat(score).toFixed(1)}/100`;
};

export const formatProgress = (progress) => {
  if (progress === null || progress === undefined) return '0%';
  return `${Math.round(progress)}%`;
};

export const getDaysUntil = (dateString) => {
  if (!dateString) return null;
  const now = new Date();
  const target = new Date(dateString);
  const diff = target - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
};

export const getDaysUntilLabel = (dateString) => {
  const days = getDaysUntil(dateString);
  if (days === null) return 'N/A';
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `${days} days left`;
};

export const isOverdue = (dateString) => {
  const days = getDaysUntil(dateString);
  return days !== null && days < 0;
};

// =============================================
// DATA TRANSFORMATION
// =============================================

export const transformReviewForDisplay = (review) => {
  if (!review) return null;
  
  return {
    ...review,
    statusFormatted: review.status?.replace(/([A-Z])/g, ' $1').trim(),
    finalScoreFormatted: formatScore(review.finalScore),
    completedAtFormatted: formatDateTime(review.completedAt),
    progressLabel: `${review.completedRatings || 0}/${review.totalRaters || 0}`,
    progressPercent: review.totalRaters > 0 
      ? Math.round((review.completedRatings / review.totalRaters) * 100) 
      : 0
  };
};

export const transformRatingAssignmentForDisplay = (assignment) => {
  if (!assignment) return null;
  
  return {
    ...assignment,
    deadlineLabel: assignment.employee?.ratingDeadline 
      ? getDaysUntilLabel(assignment.employee.ratingDeadline)
      : 'No deadline',
    isOverdue: assignment.employee?.ratingDeadline 
      ? isOverdue(assignment.employee.ratingDeadline)
      : false
  };
};

export const transformGoalForDisplay = (goal) => {
  if (!goal) return null;
  
  return {
    ...goal,
    dueDateFormatted: formatDate(goal.dueDate),
    progressFormatted: formatProgress(goal.progress),
    daysUntilDue: getDaysUntil(goal.dueDate),
    daysUntilLabel: getDaysUntilLabel(goal.dueDate),
    isOverdue: isOverdue(goal.dueDate) && goal.status === GOAL_STATUS.ACTIVE,
    createdAtFormatted: formatDateTime(goal.createdAt),
    updatedAtFormatted: formatDateTime(goal.updatedAt)
  };
};

export const transformFeedbackForDisplay = (feedback) => {
  if (!feedback) return null;
  
  return {
    ...feedback,
    createdAtFormatted: formatDateTime(feedback.createdAt),
    timeAgo: getTimeAgo(feedback.createdAt)
  };
};

// =============================================
// STATISTICS CALCULATIONS
// =============================================

export const calculateRatingStats = (assignments = []) => {
  const total = assignments.length;
  const completed = assignments.filter(a => a.isCompleted).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return {
    total,
    completed,
    pending,
    completionRate
  };
};

export const calculateGoalStats = (goals = []) => {
  const total = goals.length;
  const active = goals.filter(g => g.status === GOAL_STATUS.ACTIVE).length;
  const completed = goals.filter(g => g.status === GOAL_STATUS.COMPLETED).length;
  const cancelled = goals.filter(g => g.status === GOAL_STATUS.CANCELLED).length;
  const avgProgress = total > 0
    ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / total)
    : 0;
  
  return {
    total,
    active,
    completed,
    cancelled,
    avgProgress
  };
};

export const calculateFeedbackStats = (feedback = []) => {
  const total = feedback.length;
  const unread = feedback.filter(f => !f.isRead).length;
  const positive = feedback.filter(f => f.feedbackType === FEEDBACK_TYPES.POSITIVE).length;
  const constructive = feedback.filter(f => f.feedbackType === FEEDBACK_TYPES.CONSTRUCTIVE).length;
  const general = feedback.filter(f => f.feedbackType === FEEDBACK_TYPES.GENERAL).length;
  
  return {
    total,
    unread,
    positive,
    constructive,
    general
  };
};

// =============================================
// TIME AGO HELPER
// =============================================

export const getTimeAgo = (dateString) => {
  if (!dateString) return 'N/A';
  
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return formatDate(dateString);
};

// =============================================
// VALIDATION
// =============================================

export const validateRating = (rating) => {
  if (rating === null || rating === undefined) return 'Rating is required';
  if (rating < 0 || rating > 100) return 'Rating must be between 0 and 100';
  return null;
};

export const validateGoal = (goal) => {
  const errors = {};
  
  if (!goal.title || goal.title.trim() === '') {
    errors.title = 'Title is required';
  }
  
  if (!goal.dueDate) {
    errors.dueDate = 'Due date is required';
  } else {
    const dueDate = new Date(goal.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      errors.dueDate = 'Due date must be in the future';
    }
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateFeedback = (feedback) => {
  const errors = {};
  
  if (!feedback.toEmployeeId) {
    errors.toEmployeeId = 'Please select an employee';
  }
  
  if (!feedback.feedbackType) {
    errors.feedbackType = 'Feedback type is required';
  }
  
  if (!feedback.content || feedback.content.trim() === '') {
    errors.content = 'Feedback content is required';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};