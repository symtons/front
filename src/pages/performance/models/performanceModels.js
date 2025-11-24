// src/pages/performance/models/performanceModels.js

// =============================================
// CONSTANTS
// =============================================

export const REVIEW_STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'UnderReview',
  COMPLETED: 'Completed'
};

export const REVIEW_TYPE = {
  ANNUAL: 'Annual',
  QUARTERLY: 'Quarterly',
  MID_YEAR: 'Mid-Year'
};

export const GOAL_STATUS = {
  NOT_STARTED: 'NotStarted',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

export const GOAL_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
};

export const GOAL_CATEGORY = {
  PROFESSIONAL_DEVELOPMENT: 'Professional Development',
  PERFORMANCE: 'Performance',
  PROJECT: 'Project',
  CUSTOM: 'Custom'
};

export const FEEDBACK_TYPE = {
  POSITIVE: 'Positive',
  CONSTRUCTIVE: 'Constructive',
  GENERAL: 'General'
};

export const RATING_SCALE = {
  1: 'Needs Improvement',
  2: 'Below Expectations',
  3: 'Meets Expectations',
  4: 'Exceeds Expectations',
  5: 'Outstanding'
};

// =============================================
// STATUS COLORS
// =============================================

export const getReviewStatusColor = (status) => {
  const colorMap = {
    [REVIEW_STATUS.DRAFT]: 'default',
    [REVIEW_STATUS.SUBMITTED]: 'info',
    [REVIEW_STATUS.UNDER_REVIEW]: 'warning',
    [REVIEW_STATUS.COMPLETED]: 'success'
  };
  return colorMap[status] || 'default';
};

export const getGoalStatusColor = (status) => {
  const colorMap = {
    [GOAL_STATUS.NOT_STARTED]: 'default',
    [GOAL_STATUS.IN_PROGRESS]: 'info',
    [GOAL_STATUS.COMPLETED]: 'success',
    [GOAL_STATUS.CANCELLED]: 'error'
  };
  return colorMap[status] || 'default';
};

export const getGoalPriorityColor = (priority) => {
  const colorMap = {
    [GOAL_PRIORITY.LOW]: 'default',
    [GOAL_PRIORITY.MEDIUM]: 'info',
    [GOAL_PRIORITY.HIGH]: 'error'
  };
  return colorMap[priority] || 'default';
};

export const getFeedbackTypeColor = (type) => {
  const colorMap = {
    [FEEDBACK_TYPE.POSITIVE]: 'success',
    [FEEDBACK_TYPE.CONSTRUCTIVE]: 'warning',
    [FEEDBACK_TYPE.GENERAL]: 'info'
  };
  return colorMap[type] || 'default';
};

export const getRatingColor = (rating) => {
  if (rating >= 4.5) return 'success';
  if (rating >= 3.5) return 'info';
  if (rating >= 2.5) return 'warning';
  return 'error';
};

// =============================================
// FILTER OPTIONS
// =============================================

export const REVIEW_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: REVIEW_STATUS.DRAFT, label: 'Draft' },
  { value: REVIEW_STATUS.SUBMITTED, label: 'Submitted' },
  { value: REVIEW_STATUS.UNDER_REVIEW, label: 'Under Review' },
  { value: REVIEW_STATUS.COMPLETED, label: 'Completed' }
];

export const GOAL_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: GOAL_STATUS.NOT_STARTED, label: 'Not Started' },
  { value: GOAL_STATUS.IN_PROGRESS, label: 'In Progress' },
  { value: GOAL_STATUS.COMPLETED, label: 'Completed' },
  { value: GOAL_STATUS.CANCELLED, label: 'Cancelled' }
];

export const GOAL_PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: GOAL_PRIORITY.LOW, label: 'Low' },
  { value: GOAL_PRIORITY.MEDIUM, label: 'Medium' },
  { value: GOAL_PRIORITY.HIGH, label: 'High' }
];

export const GOAL_CATEGORY_OPTIONS = [
  { value: GOAL_CATEGORY.PROFESSIONAL_DEVELOPMENT, label: 'Professional Development' },
  { value: GOAL_CATEGORY.PERFORMANCE, label: 'Performance' },
  { value: GOAL_CATEGORY.PROJECT, label: 'Project' },
  { value: GOAL_CATEGORY.CUSTOM, label: 'Custom' }
];

export const FEEDBACK_TYPE_OPTIONS = [
  { value: FEEDBACK_TYPE.POSITIVE, label: 'Positive' },
  { value: FEEDBACK_TYPE.CONSTRUCTIVE, label: 'Constructive' },
  { value: FEEDBACK_TYPE.GENERAL, label: 'General' }
];

export const RATING_OPTIONS = [
  { value: 1, label: '1 - Needs Improvement' },
  { value: 2, label: '2 - Below Expectations' },
  { value: 3, label: '3 - Meets Expectations' },
  { value: 4, label: '4 - Exceeds Expectations' },
  { value: 5, label: '5 - Outstanding' }
];

// =============================================
// FORMATTING HELPERS
// =============================================

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export const formatRating = (rating) => {
  if (!rating && rating !== 0) return '-';
  return rating.toFixed(1);
};

export const formatProgress = (progress) => {
  if (!progress && progress !== 0) return '0%';
  return `${progress}%`;
};

export const formatReviewStatus = (status) => {
  const statusMap = {
    [REVIEW_STATUS.DRAFT]: 'Draft',
    [REVIEW_STATUS.SUBMITTED]: 'Submitted',
    [REVIEW_STATUS.UNDER_REVIEW]: 'Under Review',
    [REVIEW_STATUS.COMPLETED]: 'Completed'
  };
  return statusMap[status] || status;
};

export const formatGoalStatus = (status) => {
  const statusMap = {
    [GOAL_STATUS.NOT_STARTED]: 'Not Started',
    [GOAL_STATUS.IN_PROGRESS]: 'In Progress',
    [GOAL_STATUS.COMPLETED]: 'Completed',
    [GOAL_STATUS.CANCELLED]: 'Cancelled'
  };
  return statusMap[status] || status;
};

// =============================================
// CALCULATION HELPERS
// =============================================

export const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const total = ratings.reduce((sum, rating) => sum + (rating.managerRating || rating.selfRating || 0), 0);
  return (total / ratings.length).toFixed(1);
};

export const calculateGoalProgress = (updates) => {
  if (!updates || updates.length === 0) return 0;
  const latestUpdate = updates.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate))[0];
  return latestUpdate?.progress || 0;
};

export const isGoalOverdue = (dueDate, status) => {
  if (status === GOAL_STATUS.COMPLETED || status === GOAL_STATUS.CANCELLED) return false;
  const today = new Date();
  const due = new Date(dueDate);
  return due < today;
};

export const getDaysUntilDue = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getGoalCompletionPercentage = (goals) => {
  if (!goals || goals.length === 0) return 0;
  const completed = goals.filter(g => g.status === GOAL_STATUS.COMPLETED).length;
  return Math.round((completed / goals.length) * 100);
};

// =============================================
// VALIDATION HELPERS
// =============================================

export const validateReviewRating = (rating) => {
  const errors = {};

  if (!rating.competencyName) {
    errors.competencyName = 'Competency name is required';
  }

  if (rating.selfRating && (rating.selfRating < 1 || rating.selfRating > 5)) {
    errors.selfRating = 'Rating must be between 1 and 5';
  }

  if (rating.managerRating && (rating.managerRating < 1 || rating.managerRating > 5)) {
    errors.managerRating = 'Rating must be between 1 and 5';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateGoal = (goal) => {
  const errors = {};

  if (!goal.title?.trim()) {
    errors.title = 'Goal title is required';
  }

  if (!goal.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (!goal.dueDate) {
    errors.dueDate = 'Due date is required';
  }

  if (goal.startDate && goal.dueDate) {
    const start = new Date(goal.startDate);
    const end = new Date(goal.dueDate);
    if (end <= start) {
      errors.dueDate = 'Due date must be after start date';
    }
  }

  if (goal.progress && (goal.progress < 0 || goal.progress > 100)) {
    errors.progress = 'Progress must be between 0 and 100';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateFeedback = (feedback) => {
  const errors = {};

  if (!feedback.toEmployeeId) {
    errors.toEmployeeId = 'Recipient is required';
  }

  if (!feedback.feedbackType) {
    errors.feedbackType = 'Feedback type is required';
  }

  if (!feedback.content?.trim()) {
    errors.content = 'Feedback content is required';
  } else if (feedback.content.trim().length < 10) {
    errors.content = 'Feedback must be at least 10 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// =============================================
// DATA TRANSFORMATION HELPERS
// =============================================

export const transformReviewForDisplay = (review) => {
  return {
    ...review,
    reviewDateFormatted: formatDate(review.reviewDate),
    dueDateFormatted: formatDate(review.dueDate),
    overallRatingFormatted: formatRating(review.overallRating),
    statusFormatted: formatReviewStatus(review.status),
    statusColor: getReviewStatusColor(review.status)
  };
};

export const transformGoalForDisplay = (goal) => {
  return {
    ...goal,
    startDateFormatted: formatDate(goal.startDate),
    dueDateFormatted: formatDate(goal.dueDate),
    progressFormatted: formatProgress(goal.progress),
    statusFormatted: formatGoalStatus(goal.status),
    statusColor: getGoalStatusColor(goal.status),
    priorityColor: getGoalPriorityColor(goal.priority),
    isOverdue: isGoalOverdue(goal.dueDate, goal.status),
    daysUntilDue: getDaysUntilDue(goal.dueDate)
  };
};

export const transformFeedbackForDisplay = (feedback) => {
  return {
    ...feedback,
    createdAtFormatted: formatDateTime(feedback.createdAt),
    typeColor: getFeedbackTypeColor(feedback.feedbackType)
  };
};

// =============================================
// STATISTICS HELPERS
// =============================================

export const calculatePerformanceStats = (reviews = []) => {
  const stats = {
    totalReviews: reviews.length,
    completedReviews: 0,
    pendingReviews: 0,
    averageRating: 0,
    highestRating: 0,
    lowestRating: 5
  };

  const ratings = [];

  reviews.forEach(review => {
    if (review.status === REVIEW_STATUS.COMPLETED) {
      stats.completedReviews++;
      if (review.overallRating) {
        ratings.push(review.overallRating);
        stats.highestRating = Math.max(stats.highestRating, review.overallRating);
        stats.lowestRating = Math.min(stats.lowestRating, review.overallRating);
      }
    } else {
      stats.pendingReviews++;
    }
  });

  if (ratings.length > 0) {
    stats.averageRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  }

  return stats;
};

export const calculateGoalStats = (goals = []) => {
  const stats = {
    totalGoals: goals.length,
    completedGoals: 0,
    inProgressGoals: 0,
    notStartedGoals: 0,
    overdueGoals: 0,
    averageProgress: 0,
    completionRate: 0
  };

  let totalProgress = 0;

  goals.forEach(goal => {
    totalProgress += goal.progress || 0;

    switch (goal.status) {
      case GOAL_STATUS.COMPLETED:
        stats.completedGoals++;
        break;
      case GOAL_STATUS.IN_PROGRESS:
        stats.inProgressGoals++;
        break;
      case GOAL_STATUS.NOT_STARTED:
        stats.notStartedGoals++;
        break;
      default:
        break;
    }

    if (isGoalOverdue(goal.dueDate, goal.status)) {
      stats.overdueGoals++;
    }
  });

  if (goals.length > 0) {
    stats.averageProgress = Math.round(totalProgress / goals.length);
    stats.completionRate = Math.round((stats.completedGoals / goals.length) * 100);
  }

  return stats;
};

export const calculateFeedbackStats = (feedback = []) => {
  const stats = {
    totalFeedback: feedback.length,
    positiveFeedback: 0,
    constructiveFeedback: 0,
    generalFeedback: 0,
    unreadFeedback: 0
  };

  feedback.forEach(item => {
    if (!item.isRead) stats.unreadFeedback++;

    switch (item.feedbackType) {
      case FEEDBACK_TYPE.POSITIVE:
        stats.positiveFeedback++;
        break;
      case FEEDBACK_TYPE.CONSTRUCTIVE:
        stats.constructiveFeedback++;
        break;
      case FEEDBACK_TYPE.GENERAL:
        stats.generalFeedback++;
        break;
      default:
        break;
    }
  });

  return stats;
};

// =============================================
// INITIAL FORM DATA
// =============================================

export const getInitialGoalFormData = () => ({
  title: '',
  description: '',
  category: GOAL_CATEGORY.PERFORMANCE,
  priority: GOAL_PRIORITY.MEDIUM,
  startDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  progress: 0,
  status: GOAL_STATUS.NOT_STARTED
});

export const getInitialFeedbackFormData = () => ({
  toEmployeeId: '',
  feedbackType: FEEDBACK_TYPE.POSITIVE,
  content: '',
  isAnonymous: false
});

export const getInitialReviewFormData = () => ({
  selfAssessment: '',
  strengths: '',
  areasForImprovement: '',
  goals: ''
});

// =============================================
// EXPORT ALL
// =============================================

export default {
  // Constants
  REVIEW_STATUS,
  REVIEW_TYPE,
  GOAL_STATUS,
  GOAL_PRIORITY,
  GOAL_CATEGORY,
  FEEDBACK_TYPE,
  RATING_SCALE,

  // Status colors
  getReviewStatusColor,
  getGoalStatusColor,
  getGoalPriorityColor,
  getFeedbackTypeColor,
  getRatingColor,

  // Filter options
  REVIEW_STATUS_OPTIONS,
  GOAL_STATUS_OPTIONS,
  GOAL_PRIORITY_OPTIONS,
  GOAL_CATEGORY_OPTIONS,
  FEEDBACK_TYPE_OPTIONS,
  RATING_OPTIONS,

  // Formatting
  formatDate,
  formatDateTime,
  formatDateForInput,
  formatRating,
  formatProgress,
  formatReviewStatus,
  formatGoalStatus,

  // Calculations
  calculateAverageRating,
  calculateGoalProgress,
  isGoalOverdue,
  getDaysUntilDue,
  getGoalCompletionPercentage,

  // Validation
  validateReviewRating,
  validateGoal,
  validateFeedback,

  // Transformation
  transformReviewForDisplay,
  transformGoalForDisplay,
  transformFeedbackForDisplay,

  // Statistics
  calculatePerformanceStats,
  calculateGoalStats,
  calculateFeedbackStats,

  // Initial form data
  getInitialGoalFormData,
  getInitialFeedbackFormData,
  getInitialReviewFormData
};
