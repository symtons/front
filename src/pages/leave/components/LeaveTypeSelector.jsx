// src/pages/leave/components/LeaveTypeSelector.jsx
// Visual Leave Type Selection Component

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Radio,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  getLeaveTypeColor,
  getLeaveTypeIcon,
  deductsPTO
} from '../models/leaveModels';

/**
 * LeaveTypeSelector Component
 * 
 * Visual selector for leave types with color-coded cards
 * Shows PTO deduction indicator
 * Filters based on employee eligibility
 * 
 * Props:
 * - leaveTypes: Array of leave type objects from API
 * - selectedTypeId: Currently selected leave type ID
 * - onChange: Function called when selection changes
 * - employeeType: 'Admin Staff' | 'Field Staff'
 * - loading: boolean
 * - error: string
 * - disabled: boolean
 */

const LeaveTypeSelector = ({
  leaveTypes = [],
  selectedTypeId,
  onChange,
  employeeType = 'Admin Staff',
  loading = false,
  error = null,
  disabled = false
}) => {

  // Filter leave types based on employee eligibility
  const eligibleLeaveTypes = leaveTypes.filter(type => {
    // Field Staff can't use PTO
    if (employeeType === 'Field Staff' && type.isPaidLeave) {
      return false;
    }
    // Only show active types
    return type.isActive;
  });

  // Handle selection
  const handleSelect = (typeId) => {
    if (!disabled) {
      onChange(typeId);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading leave types...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  // No leave types available
  if (eligibleLeaveTypes.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        {employeeType === 'Field Staff' 
          ? 'No leave types available. Field Staff positions have limited leave options.'
          : 'No leave types are currently available.'
        }
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Select Leave Type
      </Typography>

      {/* Leave Type Cards Grid */}
      <Grid container spacing={2}>
        {eligibleLeaveTypes.map((leaveType) => {
          const isSelected = selectedTypeId === leaveType.leaveTypeId;
          const typeColor = getLeaveTypeColor(leaveType.typeName);
          const typeIcon = getLeaveTypeIcon(leaveType.typeName);
          const usesPTO = deductsPTO(leaveType.typeName);

          return (
            <Grid item xs={12} sm={6} md={4} key={leaveType.leaveTypeId}>
              <Card
                onClick={() => handleSelect(leaveType.leaveTypeId)}
                sx={{
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  border: isSelected ? `3px solid ${typeColor}` : '2px solid #e0e0e0',
                  bgcolor: isSelected ? `${typeColor}15` : 'white',
                  opacity: disabled ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                  '&:hover': disabled ? {} : {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                    borderColor: typeColor
                  },
                  position: 'relative',
                  minHeight: 160
                }}
              >
                {/* Radio Button */}
                <Radio
                  checked={isSelected}
                  value={leaveType.leaveTypeId}
                  disabled={disabled}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    '&.Mui-checked': {
                      color: typeColor
                    }
                  }}
                />

                <CardContent sx={{ pt: 2 }}>
                  {/* Icon and Name */}
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography 
                      sx={{ 
                        fontSize: '2.5rem',
                        mb: 1,
                        display: 'block'
                      }}
                    >
                      {typeIcon}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: isSelected ? typeColor : 'text.primary',
                        mb: 0.5
                      }}
                    >
                      {leaveType.typeName}
                    </Typography>
                  </Box>

                  {/* Description */}
                  {leaveType.description && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: 'block',
                        textAlign: 'center',
                        mb: 1.5,
                        minHeight: 32
                      }}
                    >
                      {leaveType.description}
                    </Typography>
                  )}

                  {/* Badges */}
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {/* PTO Badge */}
                    {leaveType.isPaidLeave && (
                      <Chip
                        label={usesPTO ? 'Uses PTO' : 'Paid'}
                        size="small"
                        sx={{
                          bgcolor: isSelected ? typeColor : `${typeColor}30`,
                          color: isSelected ? 'white' : typeColor,
                          fontWeight: 600,
                          fontSize: '0.65rem'
                        }}
                      />
                    )}

                    {/* Unpaid Badge */}
                    {!leaveType.isPaidLeave && (
                      <Chip
                        label="Unpaid"
                        size="small"
                        sx={{
                          bgcolor: '#95a5a6',
                          color: 'white',
                          fontSize: '0.65rem'
                        }}
                      />
                    )}

                    {/* Max Days Badge */}
                    {leaveType.maxDaysPerYear && (
                      <Chip
                        label={`Max: ${leaveType.maxDaysPerYear} days/year`}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: typeColor,
                          color: typeColor,
                          fontSize: '0.65rem'
                        }}
                      />
                    )}

                    {/* Approval Required Badge */}
                    {leaveType.requiresApproval && (
                      <Chip
                        label="Requires Approval"
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.65rem'
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Helper Text */}
      {employeeType === 'Field Staff' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="caption">
            <strong>Note:</strong> As Field Staff, you can only request unpaid leave types. 
            PTO (Paid Time Off) is not available for your position.
          </Typography>
        </Alert>
      )}

      {selectedTypeId && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="caption" color="info.dark">
            ℹ️ <strong>Selected:</strong> {eligibleLeaveTypes.find(t => t.leaveTypeId === selectedTypeId)?.typeName}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LeaveTypeSelector;