// src/pages/reports/PayrollReports.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import DataTable from '../../components/common/tables/DataTable';
import StatCard from './components/StatCard';
import {
  getPayrollByDepartment,
  getSalaryByRole
} from '../../services/reportsApi';
import { exportToCSV, printReport, formatCurrency } from './helpers/reportsHelpers';
import { TPA_COLORS } from './models/reportsModels';

const PayrollReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const [payrollByDept, setPayrollByDept] = useState([]);
  const [salaryByRole, setSalaryByRole] = useState([]);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [payrollRes, salaryRes] = await Promise.all([
        getPayrollByDepartment(),
        getSalaryByRole()
      ]);

      setPayrollByDept(payrollRes.data || []);
      setSalaryByRole(salaryRes.data || []);

    } catch (err) {
      console.error('Error loading payroll data:', err);
      setError(err.response?.data?.message || 'Failed to load payroll reports');
    } finally {
      setLoading(false);
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

  const handleExport = () => {
    const data = activeTab === 0 ? payrollByDept : salaryByRole;
    const filename = activeTab === 0 ? 'payroll_by_department' : 'salary_by_role';
    exportToCSV(data, filename);
  };

  const handlePrint = () => {
    printReport('payroll-report-content');
  };

  if (error) {
    return (
      <Layout>
        <PageHeader title="Payroll Reports" subtitle="Compensation & Salary Analysis" />
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Layout>
    );
  }

  // Calculate statistics
  const totalPayroll = payrollByDept.reduce((sum, dept) => sum + (dept.totalSalary || 0), 0);
  const avgSalary = salaryByRole.length > 0 
    ? salaryByRole.reduce((sum, role) => sum + (role.averageSalary || 0), 0) / salaryByRole.length 
    : 0;

  const COLORS = [TPA_COLORS.primary, TPA_COLORS.secondary, TPA_COLORS.success, TPA_COLORS.warning, TPA_COLORS.info, TPA_COLORS.error];

  // Define columns for Payroll by Department table
  const payrollDeptColumns = [
    {
      id: 'departmentName',
      label: 'Department',
      minWidth: 200
    },
    {
      id: 'employeeCount',
      label: 'Employee Count',
      minWidth: 150,
      align: 'right'
    },
    {
      id: 'totalSalary',
      label: 'Total Salary',
      minWidth: 150,
      align: 'right',
      render: (row) => formatCurrency(row.totalSalary)
    },
    {
      id: 'averageSalary',
      label: 'Average Salary',
      minWidth: 150,
      align: 'right',
      render: (row) => formatCurrency(row.averageSalary)
    }
  ];

  // Define columns for Salary by Role table
  const salaryRoleColumns = [
    {
      id: 'roleLevel',
      label: 'Role Level',
      minWidth: 150
    },
    {
      id: 'employeeCount',
      label: 'Employee Count',
      minWidth: 150,
      align: 'right'
    },
    {
      id: 'averageSalary',
      label: 'Avg Salary',
      minWidth: 130,
      align: 'right',
      render: (row) => formatCurrency(row.averageSalary)
    },
    {
      id: 'minSalary',
      label: 'Min Salary',
      minWidth: 130,
      align: 'right',
      render: (row) => formatCurrency(row.minSalary)
    },
    {
      id: 'maxSalary',
      label: 'Max Salary',
      minWidth: 130,
      align: 'right',
      render: (row) => formatCurrency(row.maxSalary)
    }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Payroll Reports" 
        subtitle="Compensation & Salary Analysis"
        icon={MoneyIcon}
      />
      
      <Box sx={{ p: 3 }} id="payroll-report-content">
        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <StatCard
              title="Total Payroll"
              value={formatCurrency(totalPayroll)}
              icon={MoneyIcon}
              color={TPA_COLORS.primary}
              subtitle="All departments"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StatCard
              title="Average Salary"
              value={formatCurrency(avgSalary)}
              icon={TrendingUpIcon}
              color={TPA_COLORS.success}
              subtitle="Across all roles"
            />
          </Grid>
        </Grid>

        {/* Actions Bar */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Payroll by Department" />
            <Tab label="Salary by Role" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Payroll by Department
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={payrollByDept}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="departmentName" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="totalSalary" fill={TPA_COLORS.primary} name="Total Salary" />
                <Bar dataKey="averageSalary" fill={TPA_COLORS.secondary} name="Average Salary" />
              </BarChart>
            </ResponsiveContainer>

            <Box sx={{ mt: 3 }}>
              <DataTable
                columns={payrollDeptColumns}
                data={payrollByDept}
                loading={loading}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={payrollByDept.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                emptyMessage="No payroll data available"
              />
            </Box>
          </Paper>
        )}

        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Salary by Role
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={salaryByRole}
                      dataKey="averageSalary"
                      nameKey="roleLevel"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label
                    >
                      {salaryByRole.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <DataTable
                  columns={salaryRoleColumns}
                  data={salaryByRole}
                  loading={loading}
                  emptyMessage="No salary data available"
                />
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default PayrollReports;