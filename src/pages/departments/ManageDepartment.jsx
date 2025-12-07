// src/pages/departments/ManageDepartment.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  FormControlLabel,
  Switch,
  Typography
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import Layout from '../../components/common/layout/Layout';
import PageHeader from '../../components/common/layout/PageHeader';
import Loading from '../../components/common/feedback/Loading';
import departmentService from '../../services/departmentService';
import {
  getInitialDepartmentFormData,
  mapDepartmentToFormData,
  prepareDepartmentDataForAPI,
  validateDepartmentForm,
  formatDepartmentCode
} from './models/departmentModels';

const ManageDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id && id !== 'new';

  // State
  const [formData, setFormData] = useState(getInitialDepartmentFormData());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // User permissions
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const canManage = user.role === 'Admin' || user.role === 'Executive';

  // Fetch department if editing
  useEffect(() => {
    if (isEditMode) {
      fetchDepartment();
    }
  }, [id]);

  // Redirect if no permission
  useEffect(() => {
    if (!canManage) {
      navigate('/departments');
    }
  }, [canManage]);

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchDepartment = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await departmentService.getDepartmentById(id);
      setFormData(mapDepartmentToFormData(data));
    } catch (err) {
      console.error('Error fetching department:', err);
      setError(err.message || 'Failed to load department');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    let finalValue = value;
    
    // Auto-uppercase department code
    if (name === 'departmentCode') {
      finalValue = formatDepartmentCode(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : finalValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBack = () => {
    navigate('/departments');
  };

  const handleCancel = () => {
    if (isEditMode) {
      navigate(`/departments/${id}`);
    } else {
      navigate('/departments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateDepartmentForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setError('Please fix the errors before submitting');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const apiData = prepareDepartmentDataForAPI(formData);

      if (isEditMode) {
        // Update existing department
        await departmentService.updateDepartment(id, apiData);
        setSuccess('Department updated successfully!');
        setTimeout(() => {
          navigate(`/departments/${id}`);
        }, 1500);
      } else {
        // Create new department
        const response = await departmentService.createDepartment(apiData);
        setSuccess('Department created successfully!');
        setTimeout(() => {
          navigate(`/departments/${response.departmentId}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Error saving department:', err);
      setError(err.message || 'Failed to save department');
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading department..." />
      </Layout>
    );
  }

  if (!canManage) {
    return null;
  }

  return (
    <Layout>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{
          mb: 2,
          color: '#667eea',
          '&:hover': {
            backgroundColor: 'rgba(102, 126, 234, 0.04)'
          }
        }}
      >
        Back to Departments
      </Button>

      <PageHeader
        icon={BusinessIcon}
        title={isEditMode ? 'Edit Department' : 'Create New Department'}
        subtitle={isEditMode ? 'Update department information' : 'Add a new department to the organization'}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Form */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Department Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Department Name"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                error={!!errors.departmentName}
                helperText={errors.departmentName || 'Full name of the department'}
                disabled={saving}
              />
            </Grid>

            {/* Department Code */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Department Code"
                name="departmentCode"
                value={formData.departmentCode}
                onChange={handleChange}
                error={!!errors.departmentCode}
                helperText={errors.departmentCode || 'Unique abbreviation (e.g., NUR, HR)'}
                disabled={saving}
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description || 'Brief description of the department'}
                disabled={saving}
              />
            </Grid>

            {/* Active Status */}
            {isEditMode && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleChange}
                      name="isActive"
                      color="primary"
                      disabled={saving}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        Active Status
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formData.isActive
                          ? 'Department is currently active'
                          : 'Department is inactive'}
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            )}

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={saving}
                  sx={{
                    borderColor: '#ccc',
                    color: '#666',
                    '&:hover': {
                      borderColor: '#999',
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={saving}
                  sx={{
                    backgroundColor: '#667eea',
                    '&:hover': {
                      backgroundColor: '#5568d3'
                    }
                  }}
                >
                  {saving ? 'Saving...' : isEditMode ? 'Update Department' : 'Create Department'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Help Text */}
      <Paper elevation={2} sx={{ p: 3, mt: 3, backgroundColor: '#f8f9fa', borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#2c3e50' }}>
          {isEditMode ? 'Editing Guidelines' : 'Department Creation Guidelines'}
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          • Department name should be descriptive and unique
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          • Department code should be 2-10 characters, typically an abbreviation
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          • Description helps employees understand the department's purpose
        </Typography>
        {isEditMode && (
          <Typography variant="body2" color="textSecondary">
            • Deactivating a department requires all employees to be reassigned first
          </Typography>
        )}
      </Paper>
    </Layout>
  );
};

export default ManageDepartment;