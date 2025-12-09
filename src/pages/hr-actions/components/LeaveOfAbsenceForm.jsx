// src/pages/hr-actions/components/LeaveOfAbsenceForm.jsx
// PERFECT UI - Professional Layout

import React, { useEffect } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  Box,
  Alert,
  FormControlLabel,
  Checkbox,
  Paper
} from '@mui/material';
import {
  BeachAccess as LeaveIcon,
  CalendarToday as DateIcon,
  Event as EventIcon
} from '@mui/icons-material';

const LeaveOfAbsenceForm = ({ formData, onChange, errors }) => {
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    onChange({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Calculate number of days
  useEffect(() => {
    if (formData.leaveStartDate && formData.leaveEndDate) {
      const start = new Date(formData.leaveStartDate);
      const end = new Date(formData.leaveEndDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      onChange({
        ...formData,
        leaveDays: diffDays
      });
    }
  }, [formData.leaveStartDate, formData.leaveEndDate]);

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 4, fontSize: '1rem' }}>
        Request an extended leave of absence. This is different from regular PTO requests and typically covers FMLA, medical leave, personal leave, or bereavement.
      </Alert>

      {/* LEAVE TYPE & STATUS */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#667eea', mb: 3 }}>
          <LeaveIcon /> Leave Type & Status
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="leaveType"
              label="Leave Type *"
              select
              value={formData.leaveType || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.leaveType}
              helperText={errors.leaveType || 'Select type of leave'}
              SelectProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            >
              <MenuItem value="FMLA" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                FMLA (Family Medical Leave)
              </MenuItem>
              <MenuItem value="Medical" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Medical Leave
              </MenuItem>
              <MenuItem value="Personal" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Personal Leave
              </MenuItem>
              <MenuItem value="Bereavement" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Bereavement Leave
              </MenuItem>
              <MenuItem value="Military" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Military Leave
              </MenuItem>
              <MenuItem value="Jury" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Jury Duty
              </MenuItem>
              <MenuItem value="Educational" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Educational Leave
              </MenuItem>
              <MenuItem value="Other" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Other
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="leavePaidStatus"
              label="Leave Status *"
              select
              value={formData.leavePaidStatus || 'Unpaid'}
              onChange={handleChange}
              fullWidth
              required
              SelectProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            >
              <MenuItem value="Paid" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Paid Leave
              </MenuItem>
              <MenuItem value="Unpaid" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Unpaid Leave
              </MenuItem>
              <MenuItem value="PartiallyPaid" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Partially Paid
              </MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* LEAVE DATES */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6AB4A8', mb: 3 }}>
          <DateIcon /> Leave Dates
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="leaveStartDate"
              label="Start Date *"
              type="date"
              value={formData.leaveStartDate || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.leaveStartDate}
              helperText={errors.leaveStartDate || 'First day of leave'}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="leaveEndDate"
              label="End Date *"
              type="date"
              value={formData.leaveEndDate || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.leaveEndDate}
              helperText={errors.leaveEndDate || 'Expected last day of leave'}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="leaveDays"
              label="Total Days"
              type="number"
              value={formData.leaveDays || ''}
              fullWidth
              disabled
              helperText="Automatically calculated"
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="leaveReturnDate"
              label="Expected Return Date *"
              type="date"
              value={formData.leaveReturnDate || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.leaveReturnDate}
              helperText={errors.leaveReturnDate || 'When do you plan to return to work?'}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="leaveLastDayWorked"
              label="Last Day Worked"
              type="date"
              value={formData.leaveLastDayWorked || ''}
              onChange={handleChange}
              fullWidth
              helperText="Your last working day before leave starts"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="effectiveDate"
              label="Request Effective Date *"
              type="date"
              value={formData.effectiveDate || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.effectiveDate}
              helperText={errors.effectiveDate || 'When should this request take effect?'}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ADDITIONAL DETAILS */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#FDB94E', mb: 3 }}>
          <EventIcon /> Additional Details
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="leaveExcused"
                  checked={formData.leaveExcused || false}
                  onChange={handleChange}
                  sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                />
              }
              label={
                <Typography sx={{ fontSize: '1.1rem' }}>
                  This is an excused leave (authorized absence)
                </Typography>
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="leaveDoctorSlipReceived"
                  checked={formData.leaveDoctorSlipReceived || false}
                  onChange={handleChange}
                  sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                />
              }
              label={
                <Typography sx={{ fontSize: '1.1rem' }}>
                  Doctor's note/medical documentation attached
                </Typography>
              }
            />
          </Grid>

          {formData.leaveType === 'Bereavement' && (
            <Grid item xs={12} sm={6}>
              <TextField
                name="leaveRelationToDeceased"
                label="Relationship to Deceased *"
                value={formData.leaveRelationToDeceased || ''}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.leaveRelationToDeceased}
                helperText={errors.leaveRelationToDeceased}
                placeholder="e.g., Mother, Father, Spouse, Child"
                InputProps={{
                  style: { fontSize: '1.2rem', height: '60px' }
                }}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              name="leaveAccommodation"
              label="Accommodation or Special Arrangements"
              multiline
              rows={3}
              value={formData.leaveAccommodation || ''}
              onChange={handleChange}
              fullWidth
              placeholder="Describe any accommodations needed upon return or during leave (e.g., modified duties, flexible schedule, work-from-home)"
              InputProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* JUSTIFICATION */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#5B8FCC' }}>
          📝 Justification
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="reason"
              label="Reason for Leave of Absence *"
              multiline
              rows={6}
              value={formData.reason || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.reason}
              helperText={errors.reason || 'Minimum 10 characters - explain the reason for this leave'}
              placeholder="Provide detailed explanation for the leave request (medical condition, family situation, personal circumstances, etc.)"
              InputProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="workCoveragePlan"
              label="Work Coverage Plan"
              multiline
              rows={3}
              value={formData.workCoveragePlan || ''}
              onChange={handleChange}
              fullWidth
              placeholder="How will your work be covered during your absence? Who will handle urgent matters?"
              InputProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="notes"
              label="Additional Notes (Optional)"
              multiline
              rows={3}
              value={formData.notes || ''}
              onChange={handleChange}
              fullWidth
              placeholder="Any other relevant information about this leave request"
              InputProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Alert severity="warning" sx={{ fontSize: '1rem', mb: 2 }}>
        <strong>Important:</strong> Medical and FMLA leaves require doctor's documentation. Please attach all required medical certification or supporting documents.
      </Alert>

      {formData.leaveType === 'FMLA' && (
        <Alert severity="info" sx={{ fontSize: '1rem' }}>
          <strong>FMLA Notice:</strong> FMLA provides up to 12 weeks of unpaid, job-protected leave per year. You must have worked for the company for at least 12 months and 1,250 hours in the past 12 months to be eligible.
        </Alert>
      )}
    </Box>
  );
};

export default LeaveOfAbsenceForm;