// src/pages/reports/RecruitmentReports.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  Assignment as ApplicationIcon,
  TrendingUp as TrendingUpIcon,
  Accessibility as HireIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, FunnelChart, Funnel, LabelList } from 'recharts';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import StatCard from './components/StatCard';
import {
  getApplicationSummary,
  getHiringFunnel
} from '../../services/reportsApi';
import { exportToCSV, printReport } from './helpers/reportsHelpers';
import { TPA_COLORS } from './models/reportsModels';

const RecruitmentReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const [applications, setApplications] = useState([]);
  const [hiringFunnel, setHiringFunnel] = useState([]);
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years] = useState([2023, 2024, 2025]);

  useEffect(() => {
    loadData();
  }, [selectedYear]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [appsRes, funnelRes] = await Promise.all([
        getApplicationSummary( selectedYear ),
        getHiringFunnel( selectedYear )
      ]);

      setApplications(appsRes.data || []);
      setHiringFunnel(funnelRes.data || []);

    } catch (err) {
      console.error('Error loading recruitment data:', err);
      setError(err.response?.data?.message || 'Failed to load recruitment reports');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleExport = () => {
    const data = activeTab === 0 ? applications : hiringFunnel;
    const filename = activeTab === 0 ? 'applications_summary' : 'hiring_funnel';
    exportToCSV(data, filename);
  };

  const handlePrint = () => {
    printReport('recruitment-report-content');
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <PageHeader title="Recruitment Reports" subtitle="Application & Hiring Analytics" />
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Layout>
    );
  }

  // Calculate statistics
  const totalApplications = applications.length;
  const approvedApps = applications.filter(a => a.status === 'Approved').length;
  const conversionRate = totalApplications > 0 ? ((approvedApps / totalApplications) * 100).toFixed(1) : 0;

  return (
    <Layout>
      <PageHeader 
        title="Recruitment Reports" 
        subtitle="Application & Hiring Analytics"
        icon={ApplicationIcon}
      />
      
      <Box sx={{ p: 3 }} id="recruitment-report-content">
        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total Applications"
              value={totalApplications}
              icon={ApplicationIcon}
              color={TPA_COLORS.primary}
              subtitle={`Year ${selectedYear}`}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatCard
              title="Approved"
              value={approvedApps}
              icon={TrendingUpIcon}
              color={TPA_COLORS.success}
              subtitle="Successfully hired"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatCard
              title="Conversion Rate"
              value={`${conversionRate}%`}
              icon={HireIcon}
              color={TPA_COLORS.warning}
              subtitle="Approval to hire"
            />
          </Grid>
        </Grid>

        {/* Actions Bar */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Print
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Application Summary" />
            <Tab label="Hiring Funnel" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Application Summary ({selectedYear})
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Month</strong></TableCell>
                    <TableCell align="right"><strong>Received</strong></TableCell>
                    <TableCell align="right"><strong>Under Review</strong></TableCell>
                    <TableCell align="right"><strong>Approved</strong></TableCell>
                    <TableCell align="right"><strong>Rejected</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.month}>
                      <TableCell>{app.monthName}</TableCell>
                      <TableCell align="right">{app.totalApplications}</TableCell>
                      <TableCell align="right">{app.underReview}</TableCell>
                      <TableCell align="right">{app.approved}</TableCell>
                      <TableCell align="right">{app.rejected}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Hiring Funnel ({selectedYear})
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={hiringFunnel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill={TPA_COLORS.primary} name="Applicants">
                  <LabelList dataKey="count" position="right" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <Box sx={{ mt: 3 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Stage</strong></TableCell>
                      <TableCell align="right"><strong>Count</strong></TableCell>
                      <TableCell align="right"><strong>Conversion Rate</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {hiringFunnel.map((stage, index) => (
                      <TableRow key={stage.stage}>
                        <TableCell>{stage.stage}</TableCell>
                        <TableCell align="right">{stage.count}</TableCell>
                        <TableCell align="right">
                          {index === 0 
                            ? '100%' 
                            : `${((stage.count / hiringFunnel[0].count) * 100).toFixed(1)}%`
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default RecruitmentReports;