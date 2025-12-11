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
 * Export data to CSV
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the CSV file (without extension)
 */
export const exportToCSV = (data, filename = 'export') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  try {
    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    // Add rows
    data.forEach(row => {
      const values = headers.map(header => {
        let value = row[header];
        
        // Handle null/undefined
        if (value === null || value === undefined) {
          value = '';
        }
        
        // Convert to string and escape quotes
        value = String(value).replace(/"/g, '""');
        
        // Wrap in quotes if contains comma, newline, or quote
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          value = `"${value}"`;
        }
        
        return value;
      });
      
      csvContent += values.join(',') + '\n';
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    alert('Failed to export data. Please try again.');
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
// DATA PROCESSING HELPERS
// ============================================

/**
 * Calculate percentage
 * @param {number} part - The part value
 * @param {number} total - The total value
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {number} Calculated percentage
 */
export const calculatePercentage = (part, total, decimals = 1) => {
  if (!total || total === 0) return 0;
  return parseFloat(((part / total) * 100).toFixed(decimals));
};

/**
 * Sort array of objects by key
 * @param {Array} data - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export const sortData = (data, key, order = 'asc') => {
  if (!data || !Array.isArray(data)) return [];
  
  return [...data].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (valueA === valueB) return 0;
    
    if (order === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
};

/**
 * Filter data by search term
 * @param {Array} data - Array to filter
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} Filtered array
 */
export const filterData = (data, searchTerm, searchFields = []) => {
  if (!searchTerm || !data || !Array.isArray(data)) return data;
  
  const term = searchTerm.toLowerCase();
  
  return data.filter(item => {
    // If no fields specified, search all string values
    if (searchFields.length === 0) {
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(term)
      );
    }
    
    // Search specified fields
    return searchFields.some(field => 
      String(item[field] || '').toLowerCase().includes(term)
    );
  });
};

/**
 * Group data by key
 * @param {Array} data - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped data object
 */
export const groupBy = (data, key) => {
  if (!data || !Array.isArray(data)) return {};
  
  return data.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

// ============================================
// DATE HELPERS
// ============================================

/**
 * Get date range for preset
 * @param {string} preset - Date range preset
 * @returns {Object} Object with startDate and endDate
 */
export const getDateRange = (preset) => {
  const today = new Date();
  let startDate, endDate;
  
  switch (preset) {
    case 'today':
      startDate = endDate = today;
      break;
      
    case 'this_week':
      startDate = new Date(today.setDate(today.getDate() - today.getDay()));
      endDate = new Date(today.setDate(today.getDate() - today.getDay() + 6));
      break;
      
    case 'this_month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
      
    case 'this_quarter':
      const quarter = Math.floor(today.getMonth() / 3);
      startDate = new Date(today.getFullYear(), quarter * 3, 1);
      endDate = new Date(today.getFullYear(), quarter * 3 + 3, 0);
      break;
      
    case 'this_year':
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today.getFullYear(), 11, 31);
      break;
      
    case 'last_month':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
      
    case 'last_quarter':
      const lastQuarter = Math.floor(today.getMonth() / 3) - 1;
      startDate = new Date(today.getFullYear(), lastQuarter * 3, 1);
      endDate = new Date(today.getFullYear(), lastQuarter * 3 + 3, 0);
      break;
      
    case 'last_year':
      startDate = new Date(today.getFullYear() - 1, 0, 1);
      endDate = new Date(today.getFullYear() - 1, 11, 31);
      break;
      
    default:
      startDate = endDate = today;
  }
  
  return { startDate, endDate };
};