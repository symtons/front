// src/components/common/tabs/FormTab.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  Grid
} from '@mui/material';

/**
 * FormTab - Universal form component (no display mode, just a form)
 * 
 * @param {Object} props
 * @param {string} props.title - Form title
 * @param {string} props.description - Form description
 * @param {Array} props.fields - Form field configurations
 * @param {Function} props.onSubmit - Submit handler function
 * @param {string} props.submitButtonText - Submit button text
 * @param {Function} props.validate - Custom validation function
 * @param {Object} props.initialData - Initial form data
 */
const FormTab = ({
  title,
  description,
  fields = [],
  onSubmit,
  submitButtonText = 'Submit',
  validate,
  initialData = {}
}) => {
  const [formData, setFormData] = useState(() => {
    const data = { ...initialData };
    fields.forEach(field => {
      if (!data[field.name]) {
        data[field.name] = field.defaultValue || '';
      }
    });
    return data;
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle form field change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: fieldValue }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear success message when user starts editing again
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  // Validate individual field
  const validateField = (field) => {
    const value = formData[field.name];

    // Required validation
    if (field.required && !value?.toString().trim()) {
      return `${field.label} is required`;
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Invalid email format';
      }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        return 'Invalid phone format (XXX-XXX-XXXX)';
      }
    }

    // Min length validation
    if (field.minLength && value && value.length < field.minLength) {
      return `${field.label} must be at least ${field.minLength} characters`;
    }

    // Max length validation
    if (field.maxLength && value && value.length > field.maxLength) {
      return `${field.label} must not exceed ${field.maxLength} characters`;
    }

    // Pattern validation
    if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
      return field.patternMessage || `Invalid format for ${field.label}`;
    }

    // Custom field validation
    if (field.validate) {
      return field.validate(value, formData);
    }

    return null;
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};

    // Validate each field
    fields.forEach(field => {
      const error = validateField(field);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    // Custom form-level validation
    if (validate) {
      const customErrors = validate(formData);
      Object.assign(newErrors, customErrors);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const result = await onSubmit(formData);
      
      // Show success message if provided
      if (result?.message) {
        setSuccessMessage(result.message);
      }

      // Reset form if specified
      if (result?.resetForm) {
        const resetData = {};
        fields.forEach(field => {
          resetData[field.name] = field.defaultValue || '';
        });
        setFormData(resetData);
      }
    } catch (error) {
      setErrors({ submit: error.message || 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Render form field
  const renderField = (field) => {
    const commonProps = {
      fullWidth: true,
      name: field.name,
      label: field.label,
      value: formData[field.name] || '',
      onChange: handleChange,
      error: !!errors[field.name],
      helperText: errors[field.name] || field.helperText,
      disabled: loading || field.disabled,
      required: field.required,
      placeholder: field.placeholder,
      InputProps: field.InputProps
    };

    // Select field
    if (field.type === 'select') {
      return (
        <TextField
          {...commonProps}
          select
          SelectProps={{ native: true }}
        >
          <option value="">Select {field.label}</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      );
    }

    // Textarea
    if (field.multiline) {
      return (
        <TextField
          {...commonProps}
          multiline
          rows={field.rows || 4}
        />
      );
    }

    // Password, email, tel, etc.
    return (
      <TextField
        {...commonProps}
        type={field.type || 'text'}
      />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card elevation={2}>
        <CardContent>
          {/* Form Header */}
          {(title || description) && (
            <Box sx={{ mb: 3 }}>
              {title && (
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                  {title}
                </Typography>
              )}
              {description && (
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {description}
                </Typography>
              )}
            </Box>
          )}

          {/* Success Message */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          {/* Error Message */}
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.submit}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {fields.map((field, index) => (
                <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={index}>
                  {renderField(field)}
                </Grid>
              ))}
            </Grid>

            {/* Submit Button */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: '#6AB4A8', // TPA Teal
                  px: 4,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#5A9D91'
                  }
                }}
              >
                {loading ? 'Submitting...' : submitButtonText}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FormTab;