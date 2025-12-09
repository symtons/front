// src/pages/hr-actions/components/HRActionCard.jsx
// Display HR Action Request Card

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  Divider
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

import {
  getActionTypeColor,
  getStatusColor,
  getActionTypeIcon,
  formatCurrency,
  formatDate,
  getTimeAgo,
  getRequestSummary
} from '../models/hrActionModels';

const HRActionCard = ({ 
  request, 
  showActions = false,
  showEmployee = false,
  onView,
  onApprove,
  onReject 
}) => {

  const actionColor = getActionTypeColor(request.actionType);
  const statusColor = getStatusColor(request.status);
  const icon = getActionTypeIcon(request.actionType);

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontSize: '1.5rem' }}>
              {icon}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {request.requestNumber}
            </Typography>
          </Box>
          <Chip 
            label={request.status} 
            color={statusColor}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Action Type */}
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 1, 
            fontWeight: 700,
            color: actionColor
          }}
        >
          {request.actionType}
        </Typography>

        {/* Employee Info (if showEmployee) */}
        {showEmployee && request.employee && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {request.employee.fullName}
            </Typography>
            {request.employee.department && (
              <>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>•</Typography>
                <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {request.employee.department}
                </Typography>
              </>
            )}
          </Box>
        )}

        {/* Summary */}
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 2, 
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          {getRequestSummary(request)}
        </Typography>

        {/* Effective Date */}
        {request.effectiveDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Effective: {formatDate(request.effectiveDate)}
            </Typography>
          </Box>
        )}

        {/* Reason */}
        {request.reason && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Reason:
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {request.reason.length > 100 
                ? request.reason.substring(0, 100) + '...'
                : request.reason
              }
            </Typography>
          </Box>
        )}

        {/* Rejection Reason (if rejected) */}
        {request.status === 'Rejected' && request.rejectionReason && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: '#ffebee', borderRadius: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'error.main' }}>
              Rejection Reason:
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: 'error.dark' }}>
              {request.rejectionReason}
            </Typography>
          </Box>
        )}

        {/* Submitted Info */}
        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
          Submitted {getTimeAgo(request.requestDate)}
        </Typography>
      </CardContent>

      <Divider />

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 1.5 }}>
        {showActions && request.status === 'Pending' ? (
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<ViewIcon />}
              onClick={() => onView && onView(request)}
            >
              View
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="small"
              color="success"
              startIcon={<ApproveIcon />}
              onClick={() => onApprove && onApprove(request)}
            >
              Approve
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              color="error"
              startIcon={<RejectIcon />}
              onClick={() => onReject && onReject(request)}
            >
              Reject
            </Button>
          </Box>
        ) : (
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<ViewIcon />}
            onClick={() => onView && onView(request)}
          >
            View Details
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default HRActionCard;