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
  AttachMoney as PayrollIcon,
  TrendingUp as TrendingUpIcon,
  Business as DepartmentIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

      const [deptRes, roleRes] = await Promise.all([
        getPayrollByDepartment(),
        getSalaryByRole()
      ]);

      // ✅ FIXED: Extract data from nested response objects
      setPayrollByDept(deptRes.data?.payroll || []);
      setSalaryByRole(roleRes.data?.salaries || []);

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
    let data = [];
    let filename = '';

    switch (activeTab) {
      case 0:
        data = payrollByDept;
        filename = 'payroll_by_department';
        break;
      case 1:
        data = salaryByRole;
        filename = 'salary_by_role';
        break;
      default:
        break;
    }

    exportToCSV(data, filename);
  };

  const handlePrint = () => {
    printReport('payroll-report-content');
  };

  if (error) {
    return (
      <Layout>
        <PageHeader title="Payroll Reports" subtitle="Compensation & Salary Analytics" />
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Layout>
    );
  }

  // Calculate statistics - ✅ FIXED: Using PascalCase field names
  const totalPayroll = payrollByDept.reduce((sum, dept) => sum + (dept.TotalPayroll || 0), 0);
  const totalEmployees = payrollByDept.reduce((sum, dept) => sum + (dept.EmployeeCount || 0), 0);
  const avgSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;
  const departmentCount = payrollByDept.length;

  // Define columns for Payroll by Department table
  const payrollDeptColumns = [
    {
      id: 'DepartmentName',
      label: 'Department',
      minWidth: 200
    },
    {
      id: 'EmployeeCount',
      label: 'Employee Count',
      minWidth: 150,
      align: 'right'
    },
    {
      id: 'TotalPayroll',
      label: 'Total Payroll',
      minWidth: 150,
      align: 'right',
      render: (row) => formatCurrency(row.TotalPayroll)
    },
    {
      id: 'AvgSalary',
      label: 'Avg Salary',
      minWidth: 140,
      align: 'right',
      render: (row) => formatCurrency(row.AvgSalary)
    },
    {
      id: 'MinSalary',
      label: 'Min Salary',
      minWidth: 140,
      align: 'right',
      render: (row) => formatCurrency(row.MinSalary)
    },
    {
      id: 'MaxSalary',
      label: 'Max Salary',
      minWidth: 140,
      align: 'right',
      render: (row) => formatCurrency(row.MaxSalary)
    }
  ];

  // Define columns for Salary by Role table
  const salaryRoleColumns = [
    {
      id: 'JobTitle',
      label: 'Job Title',
      minWidth: 200
    },
    {
      id: 'DepartmentName',
      label: 'Department',
      minWidth: 180
    },
    {
      id: 'EmployeeCount',
      label: 'Employee Count',
      minWidth: 150,
      align: 'right'
    },
    {
      id: 'AvgSalary',
      label: 'Avg Salary',
      minWidth: 140,
      align: 'right',
      render: (row) => formatCurrency(row.AvgSalary)
    },
    {
      id: 'MinSalary',
      label: 'Min Salary',
      minWidth: 140,
      align: 'right',
      render: (row) => formatCurrency(row.MinSalary)
    },
    {
      id: 'MaxSalary',
      label: 'Max Salary',
      minWidth: 140,
      align: 'right',
      render: (row) => formatCurrency(row.MaxSalary)
    }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Payroll Reports" 
        subtitle="Compensation & Salary Analytics"
        icon={PayrollIcon}
      />
      
      <Box sx={{ p: 3 }} id="payroll-report-content">
        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Payroll"
              value={formatCurrency(totalPayroll)}
              icon={PayrollIcon}
              color={TPA_COLORS.primary}
              subtitle="Annual compensation"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Employees"
              value={totalEmployees}
              icon={TrendingUpIcon}
              color={TPA_COLORS.success}
              subtitle="Active headcount"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              title="Average Salary"
              value={formatCurrency(avgSalary)}
              icon={PayrollIcon}
              color={TPA_COLORS.info}
              subtitle="Per employee"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <StatCard
              title="Departments"
              value={departmentCount}
              icon={DepartmentIcon}
              color={TPA_COLORS.warning}
              subtitle="Total departments"
            />
          </Grid>
        </Grid>

        {/* Actions Bar */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
            <Tab label="By Department" />
            <Tab label="By Role" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Payroll by Department
            </Typography>
            
            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={payrollByDept}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="DepartmentName" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="TotalPayroll" fill={TPA_COLORS.primary} name="Total Payroll" />
                <Bar dataKey="AvgSalary" fill={TPA_COLORS.secondary} name="Avg Salary" />
              </BarChart>
            </ResponsiveContainer>

            {/* Table */}
            <Box sx={{ mt: 3 }}>
              <DataTable
                columns={payrollDeptColumns}
                data={payrollByDept}
                loading={loading}
                emptyMessage="No payroll data available"
              />
            </Box>
          </Paper>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Salary by Role
            </Typography>
            <DataTable
              columns={salaryRoleColumns}
              data={salaryByRole}
              loading={loading}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={salaryByRole.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              emptyMessage="No salary data available"
            />
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default PayrollReports;