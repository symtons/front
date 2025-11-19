// src/pages/profile/config/profileTabsConfig.js
import React from 'react';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  ContactEmergency as EmergencyIcon,
  AccountBalance as BankIcon,
  Security as SecurityIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  EventAvailable as EventIcon,
  AccountBalance as AccountBalanceIcon,
  EventAvailable as EventAvailableIcon
} from '@mui/icons-material';
import { Alert } from '@mui/material';
import {
  RELATIONSHIP_OPTIONS,
  ACCOUNT_TYPE_OPTIONS,
  formatPhoneNumber,
  formatDate,
  formatCurrency,
  formatFullName,
  maskAccountNumber,
  getEmploymentStatusChipProps,
  getEmployeeTypeChipProps
} from '../models/profileModels';

// ============================================
// OVERVIEW TAB CONFIGURATION
// ============================================

export const overviewTabConfig = {
  sections: [
    {
      title: 'Personal Information',
      icon: <PersonIcon />,
      iconColor: '#FDB94E', // TPA Golden
      fullWidth: false,
      fields: [
        {
          label: 'Full Name',
          getValue: (data) => formatFullName(data.firstName, data.middleName, data.lastName),
          icon: <PersonIcon />
        },
        {
          label: 'Employee Code',
          getValue: (data) => data.employeeCode,
          icon: <BadgeIcon />
        },
        {
          label: 'Email',
          getValue: (data) => data.personalEmail,
          icon: <EmailIcon />
        },
        {
          label: 'Phone',
          getValue: (data) => formatPhoneNumber(data.phoneNumber),
          icon: <PhoneIcon />
        }
      ]
    },
    {
      title: 'Employment Information',
      icon: <WorkIcon />,
      iconColor: '#5B8FCC', // TPA Blue
      fullWidth: false,
      fields: [
        {
          label: 'Department',
          getValue: (data) => data.departmentName,
          icon: <BusinessIcon />
        },
        {
          label: 'Job Title',
          getValue: (data) => data.jobTitle,
          icon: <WorkIcon />
        },
        {
          label: 'Employee Type',
          getValue: (data) => data.employeeType,
          type: 'chip',
          format: (value) => {
            const props = getEmployeeTypeChipProps(value);
            return props;
          }
        },
        {
          label: 'Employment Status',
          getValue: (data) => data.employmentStatus,
          type: 'chip',
          format: (value) => {
            const props = getEmploymentStatusChipProps(value);
            return props;
          }
        },
        {
          label: 'Hire Date',
          getValue: (data) => formatDate(data.hireDate),
          icon: <CalendarIcon />
        }
      ]
    },
    {
      title: 'Emergency Contact',
      icon: <EmergencyIcon />,
      iconColor: '#F44336', // Red for emergency
      fullWidth: true,
      fields: [
        {
          label: 'Name',
          getValue: (data) => data.emergencyContactName,
          icon: <PersonIcon />
        },
        {
          label: 'Phone',
          getValue: (data) => formatPhoneNumber(data.emergencyContactPhone),
          icon: <PhoneIcon />
        },
        {
          label: 'Relationship',
          getValue: (data) => data.emergencyContactRelationship,
          icon: <EmergencyIcon />
        }
      ]
    }
  ]
};

// ============================================
// PERSONAL INFO TAB CONFIGURATION
// ============================================

export const personalInfoTabConfig = {
  sections: [
    {
      key: 'contact',
      title: 'Contact Information',
      icon: <PhoneIcon />,
      iconColor: '#6AB4A8', // TPA Teal
      fullWidth: false,
      displayFields: [
        {
          label: 'Personal Email',
          getValue: (data) => data.personalEmail,
          icon: <EmailIcon />
        },
        {
          label: 'Phone Number',
          getValue: (data) => formatPhoneNumber(data.phoneNumber),
          icon: <PhoneIcon />
        },
        {
          label: 'Address',
          getValue: (data) => data.address,
          icon: <LocationIcon />
        },
        {
          label: 'City',
          getValue: (data) => data.city
        },
        {
          label: 'State',
          getValue: (data) => data.state
        },
        {
          label: 'Zip Code',
          getValue: (data) => data.zipCode
        }
      ],
      editConfig: {
        modalTitle: 'Edit Contact Information',
        saveKey: 'contact',
        fields: [
          {
            name: 'personalEmail',
            label: 'Personal Email',
            type: 'email',
            required: true,
            fullWidth: true,
            getValue: (data) => data.personalEmail
          },
          {
            name: 'phoneNumber',
            label: 'Phone Number',
            type: 'tel',
            required: true,
            fullWidth: true,
            placeholder: 'XXX-XXX-XXXX',
            getValue: (data) => data.phoneNumber
          },
          {
            name: 'address',
            label: 'Address',
            type: 'text',
            fullWidth: true,
            getValue: (data) => data.address
          },
          {
            name: 'city',
            label: 'City',
            type: 'text',
            fullWidth: false,
            getValue: (data) => data.city
          },
          {
            name: 'state',
            label: 'State',
            type: 'text',
            fullWidth: false,
            getValue: (data) => data.state
          },
          {
            name: 'zipCode',
            label: 'Zip Code',
            type: 'text',
            fullWidth: false,
            placeholder: 'XXXXX',
            getValue: (data) => data.zipCode
          }
        ]
      }
    },
    {
      key: 'emergency',
      title: 'Emergency Contact',
      icon: <EmergencyIcon />,
      iconColor: '#F44336', // Red
      fullWidth: false,
      displayFields: [
        {
          label: 'Contact Name',
          getValue: (data) => data.emergencyContactName,
          icon: <PersonIcon />
        },
        {
          label: 'Contact Phone',
          getValue: (data) => formatPhoneNumber(data.emergencyContactPhone),
          icon: <PhoneIcon />
        },
        {
          label: 'Relationship',
          getValue: (data) => data.emergencyContactRelationship,
          icon: <EmergencyIcon />
        }
      ],
      editConfig: {
        modalTitle: 'Edit Emergency Contact',
        saveKey: 'emergency',
        fields: [
          {
            name: 'emergencyContactName',
            label: 'Contact Name',
            type: 'text',
            required: true,
            fullWidth: true,
            getValue: (data) => data.emergencyContactName
          },
          {
            name: 'emergencyContactPhone',
            label: 'Contact Phone',
            type: 'tel',
            required: true,
            fullWidth: true,
            placeholder: 'XXX-XXX-XXXX',
            getValue: (data) => data.emergencyContactPhone
          },
          {
            name: 'emergencyContactRelationship',
            label: 'Relationship',
            type: 'select',
            required: true,
            fullWidth: true,
            options: RELATIONSHIP_OPTIONS,
            getValue: (data) => data.emergencyContactRelationship
          }
        ]
      }
    }
  ]
};

// ============================================
// EMPLOYMENT TAB CONFIGURATION (Read-Only)
// ============================================

export const employmentTabConfig = {
  sections: [
    {
      title: 'Employment Details',
      icon: <WorkIcon />,
      iconColor: '#5B8FCC', // TPA Blue
      fullWidth: false,
      fields: [
        {
          label: 'Employee Code',
          getValue: (data) => data.employeeCode,
          icon: <BadgeIcon />
        },
        {
          label: 'Department',
          getValue: (data) => data.departmentName,
          icon: <BusinessIcon />
        },
        {
          label: 'Job Title',
          getValue: (data) => data.jobTitle,
          icon: <WorkIcon />
        },
        {
          label: 'Reports To',
          getValue: (data) => data.reportsToName || 'N/A',
          icon: <PersonIcon />
        },
        {
          label: 'Employee Type',
          getValue: (data) => data.employeeType,
          type: 'chip',
          format: (value) => getEmployeeTypeChipProps(value)
        },
        {
          label: 'Employment Status',
          getValue: (data) => data.employmentStatus,
          type: 'chip',
          format: (value) => getEmploymentStatusChipProps(value)
        }
      ]
    },
    {
      title: 'Dates',
      icon: <CalendarIcon />,
      iconColor: '#FDB94E', // TPA Golden
      fullWidth: false,
      fields: [
        {
          label: 'Hire Date',
          getValue: (data) => formatDate(data.hireDate),
          icon: <CalendarIcon />
        },
        {
          label: 'Termination Date',
          getValue: (data) => data.terminationDate ? formatDate(data.terminationDate) : 'N/A',
          icon: <CalendarIcon />
        }
      ]
    }
  ]
};

// ============================================
// BANKING TAB CONFIGURATION
// ============================================

export const bankingTabConfig = {
  sections: [
    {
      key: 'banking',
      title: 'Direct Deposit Information',
      icon: <BankIcon />,
      iconColor: '#4CAF50', // Green
      fullWidth: true,
      displayFields: [
        {
          label: 'Bank Name',
          getValue: (data) => data.banking?.bankName || 'Not set up',
          icon: <BankIcon />
        },
        {
          label: 'Account Type',
          getValue: (data) => data.banking?.accountType || 'N/A',
          icon: <AccountBalanceIcon />
        },
        {
          label: 'Routing Number',
          getValue: (data) => data.banking?.routingNumber || 'N/A',
          icon: <BadgeIcon />
        },
        {
          label: 'Account Number',
          getValue: (data) => data.banking?.accountNumber ? maskAccountNumber(data.banking.accountNumber) : 'N/A',
          icon: <SecurityIcon />,
          type: 'masked'
        },
        {
          label: 'Verification Status',
          getValue: (data) => data.banking?.isVerified ? 'Verified' : 'Pending Verification',
          type: 'chip',
          chipColor: (data) => data.banking?.isVerified ? '#4CAF50' : '#FF9800',
          chipTextColor: '#FFF'
        }
      ],
      editConfig: {
        modalTitle: 'Update Direct Deposit',
        saveKey: 'banking',
        fields: [
          {
            name: 'bankName',
            label: 'Bank Name',
            type: 'text',
            required: true,
            fullWidth: true,
            getValue: (data) => data.banking?.bankName || ''
          },
          {
            name: 'accountType',
            label: 'Account Type',
            type: 'select',
            required: true,
            fullWidth: true,
            options: ACCOUNT_TYPE_OPTIONS,
            getValue: (data) => data.banking?.accountType || ''
          },
          {
            name: 'routingNumber',
            label: 'Routing Number',
            type: 'text',
            required: true,
            fullWidth: true,
            placeholder: '9 digits',
            helperText: 'Must be 9 digits',
            getValue: (data) => ''
          },
          {
            name: 'accountNumber',
            label: 'Account Number',
            type: 'text',
            required: true,
            fullWidth: true,
            placeholder: 'Account number',
            helperText: 'Between 4-17 digits',
            getValue: (data) => ''
          },
          {
            name: 'confirmAccountNumber',
            label: 'Confirm Account Number',
            type: 'text',
            required: true,
            fullWidth: true,
            placeholder: 'Re-enter account number',
            getValue: (data) => ''
          }
        ]
      },
      customContent: (data) => {
        if (!data.banking) {
          return (
            <Alert severity="info" sx={{ mt: 2 }}>
              You haven't set up direct deposit yet. Click Edit to add your banking information.
            </Alert>
          );
        }
        if (!data.banking.isVerified) {
          return (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Your banking information is pending verification. This typically takes 1-2 business days.
            </Alert>
          );
        }
        return null;
      }
    }
  ]
};

// ============================================
// SECURITY TAB CONFIGURATION (Form Only)
// ============================================

export const securityTabConfig = {
  title: 'Change Password',
  description: 'Update your account password. Your password must be at least 8 characters and include uppercase, lowercase, and numbers.',
  fields: [
    {
      name: 'currentPassword',
      label: 'Current Password',
      type: 'password',
      required: true,
      fullWidth: true
    },
    {
      name: 'newPassword',
      label: 'New Password',
      type: 'password',
      required: true,
      fullWidth: true,
      helperText: 'At least 8 characters, 1 uppercase, 1 lowercase, 1 number'
    },
    {
      name: 'confirmPassword',
      label: 'Confirm New Password',
      type: 'password',
      required: true,
      fullWidth: true
    }
  ],
  submitButtonText: 'Change Password'
};

// ============================================
// BENEFITS TAB CONFIGURATION (Read-Only)
// For Admin Staff Only
// ============================================

export const benefitsTabConfig = {
  sections: [
    {
      title: 'PTO Information',
      icon: <EventIcon />,
      iconColor: '#2196F3', // Blue
      fullWidth: false,
      fields: [
        {
          label: 'Annual PTO Days',
          getValue: (data) => data.annualPtoDays || 'N/A',
          icon: <EventAvailableIcon />
        },
        {
          label: 'PTO Days Used',
          getValue: (data) => data.ptoDaysUsed || '0',
          icon: <CalendarIcon />
        },
        {
          label: 'PTO Days Remaining',
          getValue: (data) => {
            const annual = data.annualPtoDays || 0;
            const used = data.ptoDaysUsed || 0;
            return annual - used;
          },
          icon: <EventAvailableIcon />
        }
      ]
    },
    {
      title: 'Compensation',
      icon: <MoneyIcon />,
      iconColor: '#4CAF50', // Green
      fullWidth: false,
      fields: [
        {
          label: 'Salary',
          getValue: (data) => data.salary ? formatCurrency(data.salary) : 'N/A',
          icon: <MoneyIcon />
        }
      ]
    }
  ]
};

export default {
  overviewTabConfig,
  personalInfoTabConfig,
  employmentTabConfig,
  bankingTabConfig,
  securityTabConfig,
  benefitsTabConfig
};