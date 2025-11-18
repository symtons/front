import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Checkbox,
  TableSortLabel,
  Box
} from '@mui/material';
import Loading from '../feedback/Loading';

/**
 * Universal DataTable Component
 * 
 * @param {Array} columns - Array of column definitions
 *   Example: [
 *     { 
 *       id: 'name', 
 *       label: 'Name', 
 *       minWidth: 170,
 *       align: 'left',
 *       sortable: true,
 *       render: (row) => <CustomComponent data={row} /> // Optional custom render
 *     }
 *   ]
 * @param {Array} data - Array of row data
 * @param {Boolean} loading - Loading state
 * @param {Number} page - Current page (0-indexed)
 * @param {Number} rowsPerPage - Rows per page
 * @param {Number} totalCount - Total number of rows
 * @param {Function} onPageChange - Page change handler
 * @param {Function} onRowsPerPageChange - Rows per page change handler
 * @param {Function} onRowClick - Row click handler (optional)
 * @param {Boolean} selectable - Enable row selection (optional)
 * @param {Array} selected - Selected row IDs (optional)
 * @param {Function} onSelectChange - Selection change handler (optional)
 * @param {Boolean} sortable - Enable sorting (optional)
 * @param {String} orderBy - Current sort column (optional)
 * @param {String} order - Sort order 'asc' or 'desc' (optional)
 * @param {Function} onSort - Sort handler (optional)
 * @param {String} emptyMessage - Message to show when no data
 * @param {Object} sx - Custom styling
 */
const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
  selectable = false,
  selected = [],
  onSelectChange,
  sortable = false,
  orderBy = '',
  order = 'asc',
  onSort,
  emptyMessage = 'No data available',
  sx = {}
}) => {
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((row) => row.id || row[Object.keys(row)[0]]);
      onSelectChange && onSelectChange(newSelected);
    } else {
      onSelectChange && onSelectChange([]);
    }
  };

  const handleSelectOne = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }

    onSelectChange && onSelectChange(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleSort = (columnId) => {
    if (sortable && onSort) {
      const isAsc = orderBy === columnId && order === 'asc';
      onSort(columnId, isAsc ? 'desc' : 'asc');
    }
  };

  if (loading) {
    return (
      <Paper sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', ...sx }}>
        <Loading message="Loading data..." />
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', ...sx }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            {selectable && (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < data.length}
                  checked={data.length > 0 && selected.length === data.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                style={{ minWidth: column.minWidth }}
                sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}
              >
                {column.sortable && sortable ? (
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={columns.length + (selectable ? 1 : 0)} 
                align="center" 
                sx={{ py: 5 }}
              >
                <Typography variant="body2" color="text.secondary">
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const rowId = row.id || row[Object.keys(row)[0]];
              const isItemSelected = isSelected(rowId);

              return (
                <TableRow
                  key={rowId || index}
                  hover
                  onClick={() => onRowClick && onRowClick(row)}
                  selected={isItemSelected}
                  sx={{ 
                    '&:hover': { backgroundColor: '#f9f9f9' },
                    cursor: onRowClick ? 'pointer' : 'default'
                  }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={() => handleSelectOne(rowId)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align || 'left'}>
                      {column.render 
                        ? column.render(row) 
                        : row[column.id] || 'N/A'
                      }
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      {totalCount > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </TableContainer>
  );
};

export default DataTable;