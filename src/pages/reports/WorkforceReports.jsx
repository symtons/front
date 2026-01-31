// src/pages/reports/WorkforceReports.jsx
// UPDATED WITH LICENSE COMPLIANCE TAB
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  People as WorkforceIcon,
  TrendingUp as TrendingUpIcon,
  Business as DepartmentIcon,
  VerifiedUser as LicenseIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import DataTable from '../../components/common/tables/DataTable';
import StatCard from './components/StatCard';
import {
  getWorkforceSummary,
  getHeadcountByDepartment,
  getTurnoverAnalysis,
  getLicenseCompliance
} from '../../services/reportsApi';
import { exportToCSV, printReport, formatDate } from './helpers/reportsHelpers';
import { TPA_COLORS } from './models/reportsModels';

const WorkforceReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const [workforceSummary, setWorkforceSummary] = useState([]);
  const [headcount, setHeadcount] = useState([]);
  const [turnover, setTurnover] = useState([]);
  const [filteredTurnover, setFilteredTurnover] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [licenseSummary, setLicenseSummary] = useState(null);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filter states
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [licenseType, setLicenseType] = useState('all');
  const [licenseStatus, setLicenseStatus] = useState('all');
  
  const [years] = useState([
    { value: 'all', label: 'All Years' },
    { value: 2023, label: '2023' },
    { value: 2024, label: '2024' },
    { value: 2025, label: '2025' },
    { value: 2026, label: '2026' }
  ]);

  const [months] = useState([
    { value: 'all', label: 'All Months' },
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ]);

  useEffect(() => {
    loadData();
  }, [selectedYear, activeTab, licenseType, licenseStatus]);

  useEffect(() => {
    applyMonthFilter();
  }, [turnover, selectedMonth]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 3) {
        // Load license compliance data
        const licenseRes = await getLicenseCompliance(licenseType, licenseStatus);
        setLicenses(licenseRes.data?.licenses || []);
        setLicenseSummary(licenseRes.data?.summary || null);
      } else {
        // Load other workforce data
        const yearParam = selectedYear === 'all' ? null : selectedYear;

        const [summaryRes, headcountRes, turnoverRes] = await Promise.all([
          getWorkforceSummary(null),
          getHeadcountByDepartment(),
          getTurnoverAnalysis(yearParam)
        ]);

        setWorkforceSummary(summaryRes.data?.employees || []);
        setHeadcount(headcountRes.data?.departments || []);
        setTurnover(turnoverRes.data?.turnover || []);
      }

    } catch (err) {
      console.error('Error loading workforce data:', err);
      setError(err.response?.data?.message || 'Failed to load workforce reports');
    } finally {
      setLoading(false);
    }
  };

  const applyMonthFilter = () => {
    if (selectedMonth === 'all') {
      setFilteredTurnover(turnover);
    } else {
      const filtered = turnover.filter(t => t.TerminationMonth === selectedMonth);
      setFilteredTurnover(filtered);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setSelectedMonth('all');
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setPage(0);
  };

  const handleExport = () => {
    let data = [];
    let filename = '';

    switch (activeTab) {
      case 0:
        data = workforceSummary;
        filename = 'workforce_summary';
        break;
      case 1:
        data = headcount;
        filename = 'headcount_by_department';
        break;
      case 2:
        data = filteredTurnover;
        filename = `turnover_analysis${selectedYear !== 'all' ? `_${selectedYear}` : ''}${selectedMonth !== 'all' ? `_${selectedMonth}` : ''}`;
        break;
      case 3:
        data = licenses;
        filename = `license_compliance_${licenseType}_${licenseStatus}`;
        break;
      default:
        break;
    }

    exportToCSV(data, filename);
  };

  const handlePrint = () => {
    printReport('workforce-report-content');
  };

  const getLicenseStatusChip = (status, daysUntilExpiration) => {
    if (status === 'N/A') {
      return <Chip label="N/A" size="small" sx={{ backgroundColor: '#9e9e9e', color: '#fff' }} />;
    }
    
    if (status === 'Valid') {
      return (
        <Chip 
          icon={<CheckIcon />} 
          label={`Valid (${daysUntilExpiration}d)`} 
          size="small" 
          color="success" 
          variant="outlined"
        />
      );
    }
    
    if (status === 'Expiring Soon') {
      return (
        <Chip 
          icon={<WarningIcon />} 
          label={`Expiring in ${daysUntilExpiration}d`} 
          size="small" 
          sx={{ backgroundColor: '#ff9800', color: '#fff' }}
        />
      );
    }
    
    if (status === 'Expired') {
      return (
        <Chip 
          icon={<ErrorIcon />} 
          label={`Expired ${Math.abs(daysUntilExpiration)}d ago`} 
          size="small" 
          color="error"
        />
      );
    }
  };

  if (error) {
    return (
      <Layout>
        <PageHeader title="Workforce Reports" subtitle="Employee & Headcount Analytics" />
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Layout>
    );
  }

  // Calculate statistics
  let totalEmployees = 0;
  let activeEmployees = 0;
  let avgYearsOfService = 0;
  let turnoverCount = 0;

  try {
    totalEmployees = Array.isArray(workforceSummary) 
      ? workforceSummary.filter(e => e && e.IsActive === true).length 
      : 0;
      
    activeEmployees = Array.isArray(workforceSummary)
      ? workforceSummary.filter(e => e && e.EmploymentStatus === 'Active').length
      : 0;
    
    const validYears = Array.isArray(workforceSummary)
      ? workforceSummary
          .filter(e => e && e.YearsOfService != null && !isNaN(e.YearsOfService))
          .map(e => parseFloat(e.YearsOfService))
      : [];
    
    avgYearsOfService = validYears.length > 0
      ? validYears.reduce((sum, val) => sum + val, 0) / validYears.length
      : 0;
    
    turnoverCount = Array.isArray(filteredTurnover) ? filteredTurnover.length : 0;
  } catch (err) {
    console.error('Error calculating workforce statistics:', err);
  }

  const getPeriodLabel = () => {
    if (selectedYear === 'all' && selectedMonth === 'all') {
      return 'All time';
    }
    if (selectedYear !== 'all' && selectedMonth === 'all') {
      return `Year ${selectedYear}`;
    }
    const monthLabel = months.find(m => m.value === selectedMonth)?.label || '';
    if (selectedYear === 'all') {
      return monthLabel;
    }
    return `${monthLabel} ${selectedYear}`;
  };

  // Workforce Summary Columns
  const workforceSummaryColumns = [
    { id: 'EmployeeCode', label: 'Employee Code', minWidth: 130 },
    { id: 'FirstName', label: 'First Name', minWidth: 120 },
    { id: 'LastName', label: 'Last Name', minWidth: 120 },
    { id: 'DepartmentName', label: 'Department', minWidth: 150 },
    { id: 'JobTitle', label: 'Job Title', minWidth: 150 },
    { id: 'EmploymentStatus', label: 'Status', minWidth: 120 },
    { id: 'HireDate', label: 'Hire Date', minWidth: 120, render: (row) => formatDate(row.HireDate) },
    { 
      id: 'YearsOfService', 
      label: 'Years of Service', 
      minWidth: 140, 
      align: 'right',
      render: (row) => row.YearsOfService != null ? parseFloat(row.YearsOfService).toFixed(1) : 'N/A'
    }
  ];

  // Headcount Columns
  const headcountColumns = [
    { id: 'DepartmentName', label: 'Department', minWidth: 200 },
    { id: 'TotalEmployees', label: 'Total Employees', minWidth: 150, align: 'right' },
    { id: 'AdminStaffCount', label: 'Admin Staff', minWidth: 130, align: 'right' },
    { id: 'FieldStaffCount', label: 'Field Staff', minWidth: 130, align: 'right' },
    { id: 'ActiveEmployees', label: 'Active', minWidth: 100, align: 'right' }
  ];

  // Turnover Columns
  const turnoverColumns = [
    { id: 'FirstName', label: 'First Name', minWidth: 120 },
    { id: 'LastName', label: 'Last Name', minWidth: 120 },
    { id: 'DepartmentName', label: 'Department', minWidth: 150 },
    { id: 'JobTitle', label: 'Job Title', minWidth: 150 },
    { id: 'HireDate', label: 'Hire Date', minWidth: 120, render: (row) => formatDate(row.HireDate) },
    { id: 'TerminationDate', label: 'Termination Date', minWidth: 150, render: (row) => formatDate(row.TerminationDate) },
    { id: 'MonthsEmployed', label: 'Months Employed', minWidth: 150, align: 'right' }
  ];

  // License Compliance Columns
  const licenseColumns = [
    { id: 'EmployeeCode', label: 'Code', minWidth: 100 },
    { id: 'FirstName', label: 'First Name', minWidth: 120 },
    { id: 'LastName', label: 'Last Name', minWidth: 120 },
    { id: 'DepartmentName', label: 'Department', minWidth: 150 },
    { id: 'JobTitle', label: 'Job Title', minWidth: 150 },
    { 
      id: 'NursingLicense', 
      label: 'Nursing License', 
      minWidth: 180,
      render: (row) => getLicenseStatusChip(row.NursingLicenseStatus, row.NursingDaysUntilExpiration)
    },
    { 
      id: 'DriversLicense', 
      label: "Driver's License", 
      minWidth: 180,
      render: (row) => getLicenseStatusChip(row.DriversLicenseStatus, row.DriversDaysUntilExpiration)
    },
    { 
      id: 'Status', 
      label: 'Overall', 
      minWidth: 130,
      render: (row) => row.HasExpiredLicense ? (
        <Chip label="⚠️ Action Required" size="small" color="error" />
      ) : row.RequiresAttention ? (
        <Chip label="⚠️ Expiring Soon" size="small" color="warning" />
      ) : (
        <Chip label="✅ Compliant" size="small" color="success" variant="outlined" />
      )
    }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Workforce Reports" 
        subtitle="Employee & Headcount Analytics"
        icon={WorkforceIcon}
      />
      
      <Box sx={{ p: 3 }} id="workforce-report-content">
        {/* Summary Stats */}
        {activeTab !== 3 && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <StatCard
                title="Total Employees"
                value={totalEmployees}
                icon={WorkforceIcon}
                color={TPA_COLORS.primary}
                subtitle="Active employees"
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <StatCard
                title="Active Status"
                value={activeEmployees}
                icon={TrendingUpIcon}
                color={TPA_COLORS.success}
                subtitle="Currently active"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <StatCard
                title="Avg Years Service"
                value={avgYearsOfService.toFixed(1)}
                icon={DepartmentIcon}
                color={TPA_COLORS.info}
                subtitle="Years employed"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <StatCard
                title={`Turnover (${getPeriodLabel()})`}
                value={turnoverCount}
                icon={TrendingUpIcon}
                color={TPA_COLORS.warning}
                subtitle="Employees terminated"
              />
            </Grid>
          </Grid>
        )}

        {/* License Stats */}
        {activeTab === 3 && licenseSummary && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <StatCard
                title="Total Licensed"
                value={licenseSummary.totalEmployees}
                icon={LicenseIcon}
                color={TPA_COLORS.primary}
                subtitle="Employees with licenses"
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <StatCard
                title="Valid Licenses"
                value={(licenseSummary.nursingLicenses?.valid || 0) + (licenseSummary.driversLicenses?.valid || 0)}
                icon={CheckIcon}
                color={TPA_COLORS.success}
                subtitle="Currently valid"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <StatCard
                title="Expiring Soon"
                value={(licenseSummary.nursingLicenses?.expiringSoon || 0) + (licenseSummary.driversLicenses?.expiringSoon || 0)}
                icon={WarningIcon}
                color={TPA_COLORS.warning}
                subtitle="Next 30 days"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <StatCard
                title="Expired"
                value={(licenseSummary.nursingLicenses?.expired || 0) + (licenseSummary.driversLicenses?.expired || 0)}
                icon={ErrorIcon}
                color={TPA_COLORS.error}
                subtitle="Requires renewal"
              />
            </Grid>
          </Grid>
        )}

        {/* Actions Bar */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          {activeTab === 2 && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Year</InputLabel>
                <Select value={selectedYear} label="Year" onChange={handleYearChange}>
                  {years.map((year) => (
                    <MenuItem key={year.value} value={year.value}>
                      {year.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Month</InputLabel>
                <Select value={selectedMonth} label="Month" onChange={handleMonthChange}>
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {activeTab === 3 && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>License Type</InputLabel>
                <Select value={licenseType} label="License Type" onChange={(e) => setLicenseType(e.target.value)}>
                  <MenuItem value="all">All Licenses</MenuItem>
                  <MenuItem value="nursing">Nursing Only</MenuItem>
                  <MenuItem value="drivers">Driver's Only</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select value={licenseStatus} label="Status" onChange={(e) => setLicenseStatus(e.target.value)}>
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="valid">Valid Only</MenuItem>
                  <MenuItem value="expiring">Expiring Soon</MenuItem>
                  <MenuItem value="expired">Expired Only</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
              Export CSV
            </Button>
            <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>
              Print
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Workforce Summary" />
            <Tab label="Headcount by Department" />
            <Tab label="Turnover Analysis" />
            <Tab label="License Compliance" icon={<LicenseIcon />} iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Workforce Summary
            </Typography>
            <DataTable
              columns={workforceSummaryColumns}
              data={workforceSummary}
              loading={loading}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={workforceSummary.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              emptyMessage="No employee data found"
            />
          </Box>
        )}

        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Headcount by Department
            </Typography>
            
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={headcount}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="DepartmentName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="TotalEmployees" fill={TPA_COLORS.primary} name="Total" />
                <Bar dataKey="AdminStaffCount" fill={TPA_COLORS.secondary} name="Admin Staff" />
                <Bar dataKey="FieldStaffCount" fill={TPA_COLORS.success} name="Field Staff" />
              </BarChart>
            </ResponsiveContainer>

            <Box sx={{ mt: 3 }}>
              <DataTable
                columns={headcountColumns}
                data={headcount}
                loading={loading}
                emptyMessage="No headcount data available"
              />
            </Box>
          </Paper>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Turnover Analysis - {getPeriodLabel()}
            </Typography>
            <DataTable
              columns={turnoverColumns}
              data={filteredTurnover}
              loading={loading}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={filteredTurnover.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              emptyMessage="No turnover data found"
            />
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              License Compliance Report
            </Typography>
            <DataTable
              columns={licenseColumns}
              data={licenses}
              loading={loading}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={licenses.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              emptyMessage="No license data found"
            />
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default WorkforceReports;