// src/pages/profile/MyProfile.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Avatar,
  Typography,
  Paper
} from '@mui/material';
import {
  Person as PersonIcon,
  ContactPage as ContactIcon,
  Work as WorkIcon,
  AccountBalance as BankIcon,
  Security as SecurityIcon,
  CardGiftcard as BenefitsIcon
} from '@mui/icons-material';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import { InfoDisplayTab, EditableFormTab, FormTab } from '../../components/common/tabs';
import profileService from '../../services/profileService';
import {
  overviewTabConfig,
  personalInfoTabConfig,
  employmentTabConfig,
  bankingTabConfig,
  securityTabConfig,
  benefitsTabConfig
} from './config/profileTabsConfig';
import {
  validatePasswordChangeForm,
  getInitials
} from './models/profileModels';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // Load profile data
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch profile data
      const profileData = await profileService.getMe();
      
      // Fetch banking data separately (optional)
      try {
        const bankingData = await profileService.getBanking();
        profileData.banking = bankingData;
      } catch (bankingError) {
        // Banking might not exist, that's okay
        profileData.banking = null;
      }
      
      setProfile(profileData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSuccessMessage(''); // Clear success message on tab change
  };

  // Handle save for editable sections
  const handleSave = async (saveKey, formData) => {
    try {
      setError('');
      
      switch (saveKey) {
        case 'contact':
          await profileService.updateContact(formData);
          setSuccessMessage('Contact information updated successfully!');
          break;
          
        case 'emergency':
          await profileService.updateEmergencyContact(formData);
          setSuccessMessage('Emergency contact updated successfully!');
          break;
          
        case 'banking':
          await profileService.updateBanking(formData);
          setSuccessMessage('Banking information updated successfully! Verification may take 1-2 business days.');
          break;
          
        default:
          throw new Error('Unknown save operation');
      }
      
      // Reload profile to get updated data
      await loadProfile();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
      
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw to let the component handle it
    }
  };

  // Handle password change
  const handlePasswordChange = async (formData) => {
    try {
      setError('');
      
      await profileService.changePassword(formData);
      
      setSuccessMessage('Password changed successfully!');
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
      
      return {
        message: 'Password changed successfully!',
        resetForm: true
      };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Check if user is admin staff (for benefits tab)
  const isAdminStaff = () => {
    return profile?.employeeType === 'Admin Staff';
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress sx={{ color: '#5B8FCC' }} />
        </Box>
      </Layout>
    );
  }

  // Error state
  if (error && !profile) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Box>
      </Layout>
    );
  }

  // Get user initials for avatar
  const initials = profile ? getInitials(profile.firstName, profile.lastName) : '??';

  return (
    <Layout>
      {/* Page Header */}
      <PageHeader
        icon={PersonIcon}
        title="My Profile"
        subtitle="View and manage your personal information"
      />

      {/* Success Message */}
      {successMessage && (
        <Box sx={{ px: 3, pt: 3 }}>
          <Alert severity="success" onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Box sx={{ px: 3, pt: successMessage ? 1 : 3 }}>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Profile Header Card */}
      <Box sx={{ px: 3, pt: successMessage || error ? 2 : 3 }}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #5B8FCC 0%, #4A73A6 100%)',
            color: 'white',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Avatar */}
            <Avatar
              sx={{
                width: 80,
                height: 80,
                fontSize: '2rem',
                fontWeight: 600,
                bgcolor: '#FDB94E', // TPA Golden
                color: '#333'
              }}
            >
              {initials}
            </Avatar>

            {/* User Info */}
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
                {profile?.firstName} {profile?.middleName ? `${profile.middleName} ` : ''}{profile?.lastName}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 0.5 }}>
                {profile?.jobTitle}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                {profile?.departmentName} • {profile?.employeeCode}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 3, pt: 3 }}>
        <Paper elevation={1}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 64,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500
              },
              '& .Mui-selected': {
                color: '#5B8FCC' // TPA Blue
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#5B8FCC' // TPA Blue
              }
            }}
          >
            <Tab icon={<PersonIcon />} label="Overview" iconPosition="start" />
            <Tab icon={<ContactIcon />} label="Personal Info" iconPosition="start" />
            <Tab icon={<WorkIcon />} label="Employment" iconPosition="start" />
            <Tab icon={<BankIcon />} label="Banking" iconPosition="start" />
            <Tab icon={<SecurityIcon />} label="Security" iconPosition="start" />
            {isAdminStaff() && (
              <Tab icon={<BenefitsIcon />} label="Benefits" iconPosition="start" />
            )}
          </Tabs>

          {/* Tab Panels */}
          <Box>
            {/* Overview Tab */}
            {activeTab === 0 && (
              <InfoDisplayTab
                sections={overviewTabConfig.sections}
                data={profile}
              />
            )}

            {/* Personal Info Tab */}
            {activeTab === 1 && (
              <EditableFormTab
                sections={personalInfoTabConfig.sections}
                data={profile}
                onSave={handleSave}
                canEdit={true}
              />
            )}

            {/* Employment Tab */}
            {activeTab === 2 && (
              <InfoDisplayTab
                sections={employmentTabConfig.sections}
                data={profile}
              />
            )}

            {/* Banking Tab */}
            {activeTab === 3 && (
              <EditableFormTab
                sections={bankingTabConfig.sections}
                data={profile}
                onSave={handleSave}
                canEdit={true}
              />
            )}

            {/* Security Tab */}
            {activeTab === 4 && (
              <FormTab
                title={securityTabConfig.title}
                description={securityTabConfig.description}
                fields={securityTabConfig.fields}
                onSubmit={handlePasswordChange}
                submitButtonText={securityTabConfig.submitButtonText}
                validate={validatePasswordChangeForm}
              />
            )}

            {/* Benefits Tab (Admin Staff Only) */}
            {activeTab === 5 && isAdminStaff() && (
              <InfoDisplayTab
                sections={benefitsTabConfig.sections}
                data={profile}
              />
            )}
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default MyProfile;