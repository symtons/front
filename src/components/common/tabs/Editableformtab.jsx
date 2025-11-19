// src/components/common/tabs/EditableFormTab.jsx
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  TextField
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import CustomModal from '../feedback/CustomModal';

/**
 * EditableFormTab - Universal component that displays info with edit capability
 * 
 * @param {Object} props
 * @param {Array} props.sections - Array of section configurations
 * @param {Object} props.data - Data object to display
 * @param {Function} props.onSave - Save handler function
 * @param {boolean} props.canEdit - Whether user can edit (default: true)
 */
const EditableFormTab = ({ sections = [], data = {}, onSave, canEdit = true }) => {
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Open edit modal for a section
  const handleEdit = (section) => {
    const initialData = {};
    section.editConfig?.fields?.forEach(field => {
      initialData[field.name] = field.getValue 
        ? field.getValue(data)
        : data[field.name] || '';
    });
    setFormData(initialData);
    setErrors({});
    setEditingSection(section);
  };

  // Close edit modal
  const handleCloseModal = () => {
    setEditingSection(null);
    setFormData({});
    setErrors({});
    setLoading(false);
  };

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const editConfig = editingSection?.editConfig;

    if (!editConfig?.fields) return true;

    editConfig.fields.forEach(field => {
      // Required validation
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }

      // Email validation
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Invalid email format';
        }
      }

      // Phone validation
      if (field.type === 'tel' && formData[field.name]) {
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (!phoneRegex.test(formData[field.name].replace(/\s/g, ''))) {
          newErrors[field.name] = 'Invalid phone format (XXX-XXX-XXXX)';
        }
      }

      // Custom validation
      if (field.validate) {
        const error = field.validate(formData[field.name], formData);
        if (error) {
          newErrors[field.name] = error;
        }
      }
    });

    // Section-level validation
    if (editConfig.validate) {
      const sectionErrors = editConfig.validate(formData);
      Object.assign(newErrors, sectionErrors);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave(editingSection.editConfig.saveKey || editingSection.key, formData);
      handleCloseModal();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to save changes' });
    } finally {
      setLoading(false);
    }
  };

  // Render field value
  const renderFieldValue = (field) => {
    if (!data) return '-';
    
    const value = field.getValue ? field.getValue(data) : data[field.key];
    
    if (field.type === 'chip') {
      return (
        <Chip
          label={value || '-'}
          size="small"
          sx={{
            backgroundColor: field.chipColor || '#E3F2FD',
            color: field.chipTextColor || '#1976D2',
            fontWeight: 500
          }}
        />
      );
    }
    
    if (field.type === 'date' && value) {
      return new Date(value).toLocaleDateString();
    }
    
    if (field.type === 'masked' && value) {
      return field.mask ? field.mask(value) : value;
    }
    
    if (field.format && value) {
      return field.format(value);
    }
    
    return value || '-';
  };

  // Render form field
  const renderFormField = (field) => {
    const commonProps = {
      fullWidth: true,
      name: field.name,
      label: field.label,
      value: formData[field.name] || '',
      onChange: handleChange,
      error: !!errors[field.name],
      helperText: errors[field.name],
      disabled: loading || field.disabled,
      required: field.required,
      type: field.type === 'password' ? 'password' : 'text',
      placeholder: field.placeholder,
      multiline: field.multiline,
      rows: field.rows || 3
    };

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

    return <TextField {...commonProps} />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {sections.map((section, index) => (
          <Grid item xs={12} md={section.fullWidth ? 12 : 6} key={index}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent>
                {/* Section Header with Edit Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {section.icon && (
                      <Box
                        sx={{
                          mr: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          color: section.iconColor || '#FDB94E' // TPA Golden
                        }}
                      >
                        {section.icon}
                      </Box>
                    )}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                      {section.title}
                    </Typography>
                  </Box>
                  
                  {canEdit && section.editConfig && (
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(section)}
                      sx={{
                        color: '#6AB4A8', // TPA Teal
                        '&:hover': {
                          backgroundColor: 'rgba(106, 180, 168, 0.1)'
                        }
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </Box>

                {/* Display Fields */}
                <Table size="small">
                  <TableBody>
                    {section.displayFields?.map((field, fieldIndex) => (
                      <TableRow
                        key={fieldIndex}
                        sx={{
                          '&:last-child td': { border: 0 },
                          '&:hover': { backgroundColor: '#F5F5F5' }
                        }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: '#666',
                            width: '40%',
                            border: 0,
                            py: 1.5
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {field.icon && (
                              <Box
                                sx={{
                                  mr: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  color: '#999',
                                  fontSize: '1.2rem'
                                }}
                              >
                                {field.icon}
                              </Box>
                            )}
                            {field.label}
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            color: '#333',
                            border: 0,
                            py: 1.5
                          }}
                        >
                          {renderFieldValue(field)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Custom Content */}
                {section.customContent && (
                  <Box sx={{ mt: 2 }}>
                    {section.customContent(data)}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Modal */}
      {editingSection && (
        <CustomModal
          open={!!editingSection}
          onClose={handleCloseModal}
          title={editingSection.editConfig?.modalTitle || `Edit ${editingSection.title}`}
          maxWidth="sm"
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {/* Form Fields */}
            {editingSection.editConfig?.fields?.map((field, index) => (
              <Box key={index}>
                {renderFormField(field)}
              </Box>
            ))}

            {/* Submit Error */}
            {errors.submit && (
              <Typography color="error" variant="body2">
                {errors.submit}
              </Typography>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                onClick={handleCloseModal}
                disabled={loading}
                sx={{ color: '#666' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading}
                sx={{
                  backgroundColor: '#6AB4A8', // TPA Teal
                  '&:hover': {
                    backgroundColor: '#5A9D91'
                  }
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </CustomModal>
      )}
    </Box>
  );
};

export default EditableFormTab;