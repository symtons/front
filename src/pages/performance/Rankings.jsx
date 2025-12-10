// src/pages/performance/Rankings.jsx
/**
 * Rankings Page (Executive View)
 * View company-wide, department, and role-based rankings
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  TextField,
  MenuItem,
  Grid,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Star as StarIcon,
  TrendingUp as TrendIcon
} from '@mui/icons-material';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import Loading from '../../components/common/feedback/Loading';
import EmptyState from '../../components/common/feedback/EmptyState';
import performanceService from '../../services/performanceService';
import {
  formatDate,
  formatScore,
  getRatingColor,
  getRankBadge
} from './models/performanceModels';

const Rankings = () => {
  // Data states
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [periods, setPeriods] = useState([]);
  const [filterType, setFilterType] = useState('all'); // all, department, role

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // In a real implementation, fetch available periods from API
    // For now, we'll handle this when we have period data
    fetchRankings();
  }, [selectedPeriod]);

  const fetchRankings = async () => {
    if (!selectedPeriod) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data = await performanceService.getRankings(selectedPeriod, filterType);
      setRankings(data.rankings || []);

    } catch (err) {
      console.error('Error fetching rankings:', err);
      setError(err.message || 'Failed to load rankings');
      setRankings([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const types = ['all', 'department', 'role'];
    setFilterType(types[newValue]);
  };

  const handleRefresh = () => {
    fetchRankings();
  };

  if (loading && !selectedPeriod) {
    return (
      <Layout>
        <Loading message="Loading rankings..." />
      </Layout>
    );
  }

  // Group rankings by department
  const rankingsByDepartment = rankings.reduce((acc, ranking) => {
    const dept = ranking.departmentName || 'Unknown';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(ranking);
    return acc;
  }, {});

  // Group rankings by role
  const rankingsByRole = rankings.reduce((acc, ranking) => {
    const role = ranking.jobTitle || 'Unknown';
    if (!acc[role]) acc[role] = [];
    acc[role].push(ranking);
    return acc;
  }, {});

  return (
    <Layout>
      <PageHeader
        title="Performance Rankings"
        subtitle="View top performers across the organization"
        icon={TrophyIcon}
        actions={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              disabled
              sx={{ borderColor: '#667eea', color: '#667eea' }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{
                backgroundColor: '#667eea',
                '&:hover': { backgroundColor: '#5568d3' }
              }}
            >
              Refresh
            </Button>
          </Box>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Period Selection */}
      <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Select Review Period
          </Typography>
          <TextField
            fullWidth
            select
            label="Review Period"
            value={selectedPeriod}
            onChange={handlePeriodChange}
            placeholder="Select a period to view rankings"
          >
            <MenuItem value="">-- Select Period --</MenuItem>
            {/* In real implementation, map through periods fetched from API */}
            <MenuItem value="1">Q1 2025 Performance Review</MenuItem>
            <MenuItem value="2">Q4 2024 Performance Review</MenuItem>
            <MenuItem value="3">Q3 2024 Performance Review</MenuItem>
          </TextField>
        </CardContent>
      </Card>

      {!selectedPeriod ? (
        <EmptyState
          icon="info"
          title="Select a Review Period"
          message="Choose a review period from the dropdown above to view rankings."
        />
      ) : (
        <>
          {/* Tabs */}
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  minHeight: 60
                },
                '& .Mui-selected': {
                  color: '#667eea'
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#667eea',
                  height: 3
                }
              }}
            >
              <Tab label="Company-Wide" />
              <Tab label="By Department" />
              <Tab label="By Role" />
            </Tabs>
          </Box>

          {loading ? (
            <Loading message="Loading rankings..." />
          ) : rankings.length === 0 ? (
            <EmptyState
              icon="inbox"
              title="No Rankings Available"
              message="No completed reviews found for this period."
            />
          ) : (
            <>
              {/* Company-Wide Tab */}
              {activeTab === 0 && (
                <>
                  {/* Top 3 Performers */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {rankings.slice(0, 3).map((ranking, index) => {
                      const badge = getRankBadge(index + 1);

                      return (
                        <Grid item xs={12} md={4} key={ranking.employeeReviewId}>
                          <Card
                            elevation={3}
                            sx={{
                              borderRadius: 2,
                              textAlign: 'center',
                              border: `2px solid ${badge.color}`,
                              backgroundColor: badge.color + '05'
                            }}
                          >
                            <CardContent>
                              <Typography variant="h2" sx={{ mb: 1 }}>
                                {badge.emoji}
                              </Typography>
                              <Avatar
                                sx={{
                                  width: 80,
                                  height: 80,
                                  margin: '0 auto',
                                  backgroundColor: '#667eea',
                                  fontSize: '2rem',
                                  fontWeight: 700,
                                  mb: 2
                                }}
                              >
                                {ranking.employeeName?.charAt(0)}
                              </Avatar>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {ranking.employeeName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {ranking.jobTitle}
                              </Typography>
                              <Typography
                                variant="h4"
                                sx={{
                                  fontWeight: 700,
                                  color: getRatingColor(ranking.finalScore),
                                  mb: 1
                                }}
                              >
                                {formatScore(ranking.finalScore)}
                              </Typography>
                              <Chip
                                label={badge.label}
                                sx={{
                                  backgroundColor: badge.color + '30',
                                  color: badge.color,
                                  fontWeight: 600,
                                  fontSize: '1rem',
                                  px: 2,
                                  py: 2.5
                                }}
                              />
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>

                  {/* Full Rankings Table */}
                  <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                    <Table>
                      <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Rank</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Job Title</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rankings.map((ranking) => {
                          const badge = getRankBadge(ranking.companyWideRank);

                          return (
                            <TableRow
                              key={ranking.employeeReviewId}
                              sx={{
                                '&:hover': { backgroundColor: '#f8f9fa' }
                              }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {badge.emoji && <Typography variant="h6">{badge.emoji}</Typography>}
                                  <Typography fontWeight={600}>
                                    #{ranking.companyWideRank}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Avatar
                                    sx={{
                                      width: 36,
                                      height: 36,
                                      backgroundColor: '#667eea',
                                      fontSize: '0.9rem',
                                      fontWeight: 600
                                    }}
                                  >
                                    {ranking.employeeName?.charAt(0)}
                                  </Avatar>
                                  <Typography fontWeight={600}>
                                    {ranking.employeeName}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>{ranking.jobTitle}</TableCell>
                              <TableCell>{ranking.departmentName}</TableCell>
                              <TableCell>
                                <Chip
                                  label={formatScore(ranking.finalScore)}
                                  sx={{
                                    backgroundColor: getRatingColor(ranking.finalScore) + '20',
                                    color: getRatingColor(ranking.finalScore),
                                    fontWeight: 700
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}

              {/* By Department Tab */}
              {activeTab === 1 && (
                <Box>
                  {Object.entries(rankingsByDepartment).map(([department, deptRankings]) => (
                    <Card key={department} elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          {department}
                        </Typography>
                        <TableContainer>
                          <Table>
                            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Rank</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Job Title</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Score</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {deptRankings
                                .sort((a, b) => (a.departmentRank || 0) - (b.departmentRank || 0))
                                .map((ranking) => (
                                  <TableRow key={ranking.employeeReviewId}>
                                    <TableCell>
                                      <Typography fontWeight={600}>
                                        #{ranking.departmentRank}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar
                                          sx={{
                                            width: 32,
                                            height: 32,
                                            backgroundColor: '#667eea',
                                            fontSize: '0.85rem',
                                            fontWeight: 600
                                          }}
                                        >
                                          {ranking.employeeName?.charAt(0)}
                                        </Avatar>
                                        <Typography fontWeight={600}>
                                          {ranking.employeeName}
                                        </Typography>
                                      </Box>
                                    </TableCell>
                                    <TableCell>{ranking.jobTitle}</TableCell>
                                    <TableCell>
                                      <Chip
                                        label={formatScore(ranking.finalScore)}
                                        size="small"
                                        sx={{
                                          backgroundColor: getRatingColor(ranking.finalScore) + '20',
                                          color: getRatingColor(ranking.finalScore),
                                          fontWeight: 700
                                        }}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              {/* By Role Tab */}
              {activeTab === 2 && (
                <Box>
                  {Object.entries(rankingsByRole).map(([role, roleRankings]) => (
                    <Card key={role} elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          {role}
                        </Typography>
                        <TableContainer>
                          <Table>
                            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Rank</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Score</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {roleRankings
                                .sort((a, b) => (a.roleRank || 0) - (b.roleRank || 0))
                                .map((ranking) => (
                                  <TableRow key={ranking.employeeReviewId}>
                                    <TableCell>
                                      <Typography fontWeight={600}>
                                        #{ranking.roleRank}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar
                                          sx={{
                                            width: 32,
                                            height: 32,
                                            backgroundColor: '#667eea',
                                            fontSize: '0.85rem',
                                            fontWeight: 600
                                          }}
                                        >
                                          {ranking.employeeName?.charAt(0)}
                                        </Avatar>
                                        <Typography fontWeight={600}>
                                          {ranking.employeeName}
                                        </Typography>
                                      </Box>
                                    </TableCell>
                                    <TableCell>{ranking.departmentName}</TableCell>
                                    <TableCell>
                                      <Chip
                                        label={formatScore(ranking.finalScore)}
                                        size="small"
                                        sx={{
                                          backgroundColor: getRatingColor(ranking.finalScore) + '20',
                                          color: getRatingColor(ranking.finalScore),
                                          fontWeight: 700
                                        }}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default Rankings;