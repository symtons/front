// src/pages/reports/helpers/reportsHelpers.js
/**
 * Helper functions for Reports & Analytics module
 */

// ============================================
// FORMATTING HELPERS
// ============================================

/**
 * Format currency values
 * @param {number} value - The numeric value to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format date values
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string (MM/DD/YYYY)
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    return d.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format percentage values
 * @param {number} value - The numeric value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format number with commas
 * @param {number} value - The numeric value to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  return new Intl.NumberFormat('en-US').format(value);
};

// ============================================
// EXPORT/PRINT HELPERS
// ============================================

/**
 * Export data to CSV - IMPROVED VERSION
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the CSV file (without extension)
 */
export const exportToCSV = (data, filename = 'export') => {
  // Validation
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data to export:', data);
    alert('No data available to export');
    return;
  }

  try {
    console.log('Exporting data:', { rowCount: data.length, filename, firstRow: data[0] });
    
    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    if (headers.length === 0) {
      alert('No columns found in data');
      return;
    }
    
    // Create CSV header row
    let csvContent = headers.join(',') + '\n';
    
    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => {
        let value = row[header];
        
        // Handle null/undefined
        if (value === null || value === undefined) {
          return '';
        }
        
        // Convert to string
        value = String(value);
        
        // Escape quotes by doubling them
        value = value.replace(/"/g, '""');
        
        // Wrap in quotes if contains comma, newline, or quote
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          return `"${value}"`;
        }
        
        return value;
      });
      
      csvContent += values.join(',') + '\n';
    });

    // Create blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const fullFilename = `${filename}_${timestamp}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fullFilename);
    link.style.visibility = 'hidden';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Export successful:', fullFilename);
    
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    alert('Failed to export data. Please check console for details.');
  }
};

/**
 * Print report content
 * @param {string} elementId - ID of the element to print
 */
export const printReport = (elementId) => {
  try {
    const printContent = document.getElementById(elementId);
    
    if (!printContent) {
      console.error(`Element with ID '${elementId}' not found`);
      alert('Unable to print. Content not found.');
      return;
    }

    const windowPrint = window.open('', '_blank', 'width=800,height=600');
    
    windowPrint.document.write(`
      <html>
        <head>
          <title>Print Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            h1, h2, h3 {
              color: #333;
            }
            @media print {
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    windowPrint.document.close();
    windowPrint.focus();
    
    // Wait for content to load before printing
    setTimeout(() => {
      windowPrint.print();
      windowPrint.close();
    }, 250);
    
  } catch (error) {
    console.error('Error printing report:', error);
    alert('Failed to print report. Please try again.');
  }
};

// ============================================
// DATA TRANSFORMATION HELPERS
// ============================================

/**
 * Flatten nested objects for CSV export
 * @param {Array} data - Array of objects
 * @returns {Array} Flattened array
 */
export const flattenForExport = (data) => {
  if (!Array.isArray(data) || data.length === 0) return [];
  
  return data.map(item => {
    const flattened = {};
    
    Object.keys(item).forEach(key => {
      const value = item[key];
      
      // If value is object, flatten it
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        Object.keys(value).forEach(subKey => {
          flattened[`${key}_${subKey}`] = value[subKey];
        });
      } else {
        flattened[key] = value;
      }
    });
    
    return flattened;
  });
};

/**
 * Filter columns for export
 * @param {Array} data - Array of objects
 * @param {Array} excludeColumns - Column names to exclude
 * @returns {Array} Filtered array
 */
export const filterColumnsForExport = (data, excludeColumns = []) => {
  if (!Array.isArray(data) || data.length === 0) return [];
  
  return data.map(item => {
    const filtered = {};
    Object.keys(item).forEach(key => {
      if (!excludeColumns.includes(key)) {
        filtered[key] = item[key];
      }
    });
    return filtered;
  });
};