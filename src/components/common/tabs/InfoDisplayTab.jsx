// src/components/common/tabs/InfoDisplayTab.jsx
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip
} from '@mui/material';

/**
 * InfoDisplayTab - Universal read-only information display component
 * 
 * @param {Object} props
 * @param {Array} props.sections - Array of section configurations
 * @param {Object} props.data - Data object to display
 * @param {string} props.layout - 'card' or 'table' (default: 'card')
 */
const InfoDisplayTab = ({ sections = [], data = {}, layout = 'card' }) => {
  
  // Render a single field value
  const renderFieldValue = (field) => {
    if (!data) return '-';
    
    const value = field.getValue ? field.getValue(data) : data[field.key];
    
    // Handle different field types
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
    
    if (field.type === 'currency' && value) {
      return `$${parseFloat(value).toFixed(2)}`;
    }
    
    if (field.format && value) {
      return field.format(value);
    }
    
    return value || '-';
  };

  // Render card layout
  const renderCardLayout = (section, index) => (
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
          {/* Section Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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

          {/* Fields */}
          <Table size="small">
            <TableBody>
              {section.fields?.map((field, fieldIndex) => (
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
  );

  // Render table layout (all in one table)
  const renderTableLayout = () => (
    <Grid item xs={12}>
      <Card elevation={2}>
        <CardContent>
          <Table>
            <TableBody>
              {sections.map((section, sectionIndex) => (
                <React.Fragment key={sectionIndex}>
                  {/* Section Header Row */}
                  <TableRow>
                    <TableCell 
                      colSpan={2}
                      sx={{ 
                        backgroundColor: '#F5F5F5',
                        fontWeight: 700,
                        color: '#5B8FCC', // TPA Blue
                        py: 1.5
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {section.icon && (
                          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                            {section.icon}
                          </Box>
                        )}
                        {section.title}
                      </Box>
                    </TableCell>
                  </TableRow>
                  
                  {/* Field Rows */}
                  {section.fields?.map((field, fieldIndex) => (
                    <TableRow 
                      key={fieldIndex}
                      sx={{ '&:hover': { backgroundColor: '#FAFAFA' } }}
                    >
                      <TableCell sx={{ fontWeight: 600, color: '#666', width: '30%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {field.icon && (
                            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center', color: '#999' }}>
                              {field.icon}
                            </Box>
                          )}
                          {field.label}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#333' }}>
                        {renderFieldValue(field)}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {layout === 'table' 
          ? renderTableLayout()
          : sections.map((section, index) => renderCardLayout(section, index))
        }
      </Grid>
    </Box>
  );
};

export default InfoDisplayTab;