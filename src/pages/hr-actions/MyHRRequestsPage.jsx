// src/pages/hr-actions/MyHRRequestsPage.jsx
// COMPLETE VERSION - All 8 Action Types + Approved/Rejected Tabs

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  AttachMoney as MoneyIcon,
  SwapHoriz as TransferIcon,
  TrendingUp as PromotionIcon,
  ToggleOn as StatusIcon,
  PersonOutline as PersonIcon,
  HealthAndSafety as InsuranceIcon,
  AccountBalance as PayrollIcon,
  BeachAccess as LeaveIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  HourglassEmpty as PendingIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Universal Components
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import { Loading } from '../../components/common';

// Services
import hrActionService from '../../services/hrActionService';

// Models
import { formatDate, formatCurrency, getStatusColor } from './models/hrActionModels';

const MyHRRequestsPage = () => {
  const navigate = useNavigate();
  
  // State
  const [activeTab, setActiveTab] = useState(0); // 0=Pending, 1=Approved, 2=Rejected
  const [activeTypeTab, setActiveTypeTab] = useState(0); // 0=All, 1-8=Action types
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Tab definitions
  const statusTabs = [
    { label: 'Pending', value: 'Pending', icon: <PendingIcon /> },
    { label: 'Approved', value: 'Approved', icon: <ApprovedIcon /> },
    { label: 'Rejected', value: 'Rejected', icon: <RejectedIcon /> }
  ];

  const actionTypeTabs = [
    { label: 'All Requests', value: 'All', icon: null },
    { label: 'Rate Change', value: 'Rate Change', icon: <MoneyIcon /> },
    { label: 'Transfer', value: 'Transfer', icon: <TransferIcon /> },
    { label: 'Promotion', value: 'Promotion', icon: <PromotionIcon /> },
    { label: 'Status Change', value: 'Status Change', icon: <StatusIcon /> },
    { label: 'Personal Info', value: 'Personal Info Change', icon: <PersonIcon /> },
    { label: 'Insurance', value: 'Insurance Change', icon: <InsuranceIcon /> },
    { label: 'Payroll', value: 'Payroll Deduction', icon: <PayrollIcon /> },
    { label: 'Leave', value: 'Leave of Absence', icon: <LeaveIcon /> }
  ];

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const data = await hrActionService.getMyRequests();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTypeTabChange = (event, newValue) => {
    setActiveTypeTab(newValue);
  };

  const handleViewDetails = (requestId) => {
    navigate(`/hr-actions/request/${requestId}`);
  };

  // Filter requests by status and action type
  const getFilteredRequests = () => {
    let filtered = requests;

    // Filter by status (Pending/Approved/Rejected)
    const currentStatus = statusTabs[activeTab].value;
    filtered = filtered.filter(req => req.status === currentStatus);

    // Filter by action type
    if (activeTypeTab > 0) {
      const selectedType = actionTypeTabs[activeTypeTab].value;
      filtered = filtered.filter(req => req.actionType === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(req =>
        req.requestNumber?.toLowerCase().includes(search) ||
        req.actionType?.toLowerCase().includes(search) ||
        req.reason?.toLowerCase().includes(search)
      );
    }

    return filtered;
  };

  const getRequestSummary = (request) => {
    const { actionType, oldRate, newRate, oldJobTitle, newJobTitle, newLocation } = request;
    
    if (actionType === 'Rate Change' && oldRate && newRate) {
      return `${formatCurrency(oldRate)} → ${formatCurrency(newRate)}`;
    }
    
    if (actionType === 'Promotion' && oldJobTitle && newJobTitle) {
      return `${oldJobTitle} → ${newJobTitle}`;
    }
    
    if (actionType === 'Transfer' && newLocation) {
      return `Transfer to ${newLocation}`;
    }
    
    return request.reason?.substring(0, 50) + '...' || 'No details';
  };

  const filteredRequests = getFilteredRequests();

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading your requests..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        icon={PendingIcon}
        title="My HR Action Requests"
        subtitle="View and track your submitted HR action requests"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        {/* STATUS TABS (Pending/Approved/Rejected) */}
        <Tabs
          value={activeTab}
          onChange={handleStatusTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontSize: '1rem',
              fontWeight: 600,
              minHeight: 64
            }
          }}
        >
          {statusTabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              iconPosition="start"
              label={`${tab.label} (${requests.filter(r => r.status === tab.value).length})`}
              sx={{
                '&.Mui-selected': {
                  color: tab.value === 'Pending' ? 'warning.main' : 
                         tab.value === 'Approved' ? 'success.main' : 'error.main'
                }
              }}
            />
          ))}
        </Tabs>

        {/* ACTION TYPE TABS (All/Rate Change/Transfer/etc) */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f5f5f5' }}>
          <Tabs
            value={activeTypeTab}
            onChange={handleTypeTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontSize: '0.9rem',
                minHeight: 48
              }
            }}
          >
            {actionTypeTabs.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                iconPosition="start"
                label={tab.label}
              />
            ))}
          </Tabs>
        </Box>

        {/* SEARCH BAR */}
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by request number or employee name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              style: { fontSize: '1rem', height: '48px' }
            }}
          />
        </Box>
      </Paper>

      {/* REQUESTS LIST */}
      {filteredRequests.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                margin: '0 auto',
                bgcolor: '#f5f5f5',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PendingIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
            </Box>
          </Box>
          <Typography variant="h6" gutterBottom>
            No {statusTabs[activeTab].label} Requests
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeTypeTab > 0 
              ? `No ${actionTypeTabs[activeTypeTab].label.toLowerCase()} requests with status "${statusTabs[activeTab].label}"`
              : `There are no ${statusTabs[activeTab].label.toLowerCase()} requests at the moment.`
            }
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredRequests.map((request) => (
            <Paper
              key={request.requestId}
              sx={{
                p: 3,
                '&:hover': {
                  boxShadow: 4,
                  cursor: 'pointer'
                },
                transition: 'box-shadow 0.3s'
              }}
              onClick={() => handleViewDetails(request.requestId)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  {/* Request Number & Action Type */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="h6" component="span">
                      {request.requestNumber}
                    </Typography>
                    <Chip
                      label={request.actionType}
                      size="small"
                      sx={{
                        bgcolor: '#667eea',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                    <Chip
                      label={request.status}
                      size="small"
                      color={getStatusColor(request.status)}
                    />
                  </Box>

                  {/* Request Summary */}
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    {getRequestSummary(request)}
                  </Typography>

                  {/* Dates */}
                  <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Requested On
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(request.requestDate)}
                      </Typography>
                    </Box>
                    {request.effectiveDate && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Effective Date
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(request.effectiveDate)}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Rejection Reason (if rejected) */}
                  {request.status === 'Rejected' && request.rejectionReason && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      <Typography variant="body2" fontWeight={600}>
                        Rejection Reason:
                      </Typography>
                      <Typography variant="body2">
                        {request.rejectionReason}
                      </Typography>
                    </Alert>
                  )}
                </Box>

                {/* View Button */}
                <Tooltip title="View Details">
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(request.requestId);
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Layout>
  );
};

export default MyHRRequestsPage;