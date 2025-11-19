// src/components/common/inputs/DateRangePicker.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  EventAvailable as EventIcon
} from '@mui/icons-material';

/**
 * Universal DateRangePicker Component
 * Reusable component for selecting start and end dates with validation
 * 
 * @param {Date|string} startDate - Start date value
 * @param {Date|string} endDate - End date value
 * @param {Function} onStartDateChange - Start date change handler
 * @param {Function} onEndDateChange - End date change handler
 * @param {string} startLabel - Label for start date field
 * @param {string} endLabel - Label for end date field
 * @param {boolean} disablePastDates - Disable dates before today
 * @param {boolean} showTotalDays - Show calculated total days
 * @param {boolean} allowHalfDay - Show half-day checkbox
 * @param {boolean} isHalfDay - Half-day checkbox value
 * @param {Function} onHalfDayChange - Half-day change handler
 * @param {boolean} required - Make fields required
 * @param {boolean} disabled - Disable all inputs
 * @param {string} error - Error message to display
 * @param {Object} sx - Custom styling
 */
const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startLabel = 'Start Date',
  endLabel = 'End Date',
  disablePastDates = true,
  showTotalDays = true,
  allowHalfDay = false,
  isHalfDay = false,
  onHalfDayChange,
  required = true,
  disabled = false,
  error = '',
  sx = {}
}) => {
  const [localError, setLocalError] = useState('');
  const [totalDays, setTotalDays] = useState(0);

  // Get minimum date (today if disablePastDates is true)
  const getMinDate = () => {
    if (disablePastDates) {
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
    return undefined;
  };

  // Calculate total days between dates
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Validate dates
      if (end < start) {
        setLocalError('End date cannot be before start date');
        setTotalDays(0);
        return;
      }

      // Calculate days (inclusive)
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // If half-day, show 0.5 days
      if (isHalfDay) {
        setTotalDays(0.5);
      } else {
        setTotalDays(diffDays);
      }

      setLocalError('');
    } else {
      setTotalDays(0);
      setLocalError('');
    }
  }, [startDate, endDate, isHalfDay]);

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    onStartDateChange(value);

    // If end date is not set, auto-set it to same as start date
    if (!endDate && value) {
      onEndDateChange(value);
    }
  };

  const displayError = error || localError;

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {/* Date Fields */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {/* Start Date */}
        <TextField
          label={startLabel}
          type="date"
          value={startDate || ''}
          onChange={handleStartDateChange}
          required={required}
          disabled={disabled}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: getMinDate()
          }}
          sx={{ flex: 1, minWidth: 200 }}
        />

        {/* End Date */}
        <TextField
          label={endLabel}
          type="date"
          value={endDate || ''}
          onChange={(e) => onEndDateChange(e.target.value)}
          required={required}
          disabled={disabled}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: startDate || getMinDate()
          }}
          sx={{ flex: 1, minWidth: 200 }}
        />
      </Box>

      {/* Half-Day Checkbox */}
      {allowHalfDay && onHalfDayChange && (
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isHalfDay}
                onChange={(e) => onHalfDayChange(e.target.checked)}
                disabled={disabled}
                sx={{
                  color: '#5B8FCC',
                  '&.Mui-checked': {
                    color: '#5B8FCC',
                  }
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: '#34495e' }}>
                This is a half-day request
              </Typography>
            }
          />
        </Box>
      )}

      {/* Total Days Display */}
      {showTotalDays && startDate && endDate && !displayError && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: '#E8F4F8',
            borderRadius: 1,
            border: '1px solid #B3E0ED',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <EventIcon sx={{ color: '#5B8FCC', fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: '#2c3e50', fontWeight: 500 }}>
            Total Days: <strong style={{ color: '#5B8FCC', fontSize: '1.1em' }}>{totalDays}</strong>
            {isHalfDay && ' (Half Day)'}
          </Typography>
        </Box>
      )}

      {/* Error Display */}
      {displayError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {displayError}
        </Alert>
      )}

      {/* Helper Text */}
      {!displayError && startDate && endDate && (
        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 1, color: 'text.secondary' }}
        >
          {isHalfDay 
            ? `Half day on ${new Date(startDate).toLocaleDateString()}`
            : `From ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
          }
        </Typography>
      )}
    </Box>
  );
};

export default DateRangePicker;