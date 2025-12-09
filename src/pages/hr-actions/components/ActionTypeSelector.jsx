// src/pages/hr-actions/components/ActionTypeSelector.jsx
// Select HR Action Type - 8 Cards

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  SwapHoriz as TransferIcon,
  TrendingUp as PromotionIcon,
  ToggleOn as StatusIcon,
  PersonOutline as PersonIcon,
  HealthAndSafety as InsuranceIcon,
  AccountBalance as PayrollIcon,
  BeachAccess as LeaveIcon
} from '@mui/icons-material';

const ACTION_TYPE_CARDS = [
  {
    id: 1,
    name: 'Rate Change',
    description: 'Change employee salary or hourly rate',
    icon: MoneyIcon,
    color: '#667eea',
    emoji: '💰'
  },
  {
    id: 2,
    name: 'Transfer',
    description: 'Transfer to new department or location',
    icon: TransferIcon,
    color: '#6AB4A8',
    emoji: '🔄'
  },
  {
    id: 3,
    name: 'Promotion',
    description: 'Promote to new job title with salary increase',
    icon: PromotionIcon,
    color: '#4caf50',
    emoji: '📈'
  },
  {
    id: 4,
    name: 'Status Change',
    description: 'Change employment status or marital status',
    icon: StatusIcon,
    color: '#5B8FCC',
    emoji: '📊'
  },
  {
    id: 5,
    name: 'Personal Info Change',
    description: 'Update name, address, phone, or email',
    icon: PersonIcon,
    color: '#FDB94E',
    emoji: '📝'
  },
  {
    id: 6,
    name: 'Insurance Change',
    description: 'Modify health, dental, or retirement benefits',
    icon: InsuranceIcon,
    color: '#764ba2',
    emoji: '💼'
  },
  {
    id: 7,
    name: 'Payroll Deduction',
    description: 'Add or modify payroll deductions',
    icon: PayrollIcon,
    color: '#f59e42',
    emoji: '💵'
  },
  {
    id: 8,
    name: 'Leave of Absence',
    description: 'Request extended leave (FMLA, medical, etc.)',
    icon: LeaveIcon,
    color: '#34495e',
    emoji: '🏖️'
  }
];

const ActionTypeSelector = ({ onSelect, selectedTypeId }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Select Action Type
      </Typography>
      
      <Grid container spacing={2}>
        {ACTION_TYPE_CARDS.map((actionType) => {
          const Icon = actionType.icon;
          const isSelected = selectedTypeId === actionType.id;
          
          return (
            <Grid item xs={12} sm={6} md={3} key={actionType.id}>
              <Card
                sx={{
                  height: '100%',
                  border: isSelected ? `3px solid ${actionType.color}` : '1px solid #e0e0e0',
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-4px)',
                    borderColor: actionType.color
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => onSelect(actionType)}
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ 
                    textAlign: 'center', 
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 180
                  }}>
                    {/* Icon Circle */}
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        bgcolor: isSelected ? actionType.color : `${actionType.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        transition: 'all 0.2s'
                      }}
                    >
                      <Typography variant="h3" sx={{ fontSize: '2rem' }}>
                        {actionType.emoji}
                      </Typography>
                    </Box>

                    {/* Title */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1, 
                        fontWeight: 700,
                        color: isSelected ? actionType.color : 'text.primary'
                      }}
                    >
                      {actionType.name}
                    </Typography>

                    {/* Description */}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        lineHeight: 1.4
                      }}
                    >
                      {actionType.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ActionTypeSelector;