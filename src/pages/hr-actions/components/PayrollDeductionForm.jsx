// src/pages/hr-actions/components/PayrollDeductionForm.jsx
// PERFECT UI - Professional Layout

import React from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  Box,
  Alert,
  InputAdornment,
  Paper
} from '@mui/material';
import {
  AccountBalance as PayrollIcon,
  AttachMoney as MoneyIcon,
  Gavel as CourtIcon,
  Person as RecipientIcon
} from '@mui/icons-material';

const PayrollDeductionForm = ({ formData, onChange, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value
    });
  };

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 4, fontSize: '1rem' }}>
        Request a new payroll deduction or modify an existing one. This could be for garnishments, child support, voluntary contributions, or other authorized deductions.
      </Alert>

      {/* DEDUCTION DETAILS */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#667eea', mb: 3 }}>
          <PayrollIcon /> Deduction Details
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="deductionType"
              label="Deduction Type *"
              select
              value={formData.deductionType || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.deductionType}
              helperText={errors.deductionType || 'Select type of deduction'}
              SelectProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            >
              <MenuItem value="Garnishment" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Garnishment (Court Ordered)
              </MenuItem>
              <MenuItem value="ChildSupport" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Child Support
              </MenuItem>
              <MenuItem value="LoanRepayment" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Loan Repayment
              </MenuItem>
              <MenuItem value="CharitableDonation" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Charitable Donation
              </MenuItem>
              <MenuItem value="UnionDues" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Union Dues
              </MenuItem>
              <MenuItem value="HSAContribution" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                HSA Contribution
              </MenuItem>
              <MenuItem value="Other" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Other
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="deductionAction"
              label="Action *"
              select
              value={formData.deductionAction || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.deductionAction}
              helperText={errors.deductionAction}
              SelectProps={{
                style: { fontSize: '1.2rem', height: '60px' }
              }}
            >
              <MenuItem value="New" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                New Deduction
              </MenuItem>
              <MenuItem value="Modify" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Modify Existing
              </MenuItem>
              <MenuItem value="Stop" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                Stop Deduction
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="payrollDeductionDescription"
              label="Deduction Description *"
              value={formData.payrollDeductionDescription || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.payrollDeductionDescription}
              helperText={errors.payrollDeductionDescription || 'Provide a clear description of the deduction'}
              placeholder="e.g., Court-ordered garnishment for case #12345, Child support for dependent"
              multiline
              rows={2}
              InputProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* AMOUNT & FREQUENCY */}
      {formData.deductionAction !== 'Stop' && (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6AB4A8', mb: 3 }}>
            <MoneyIcon /> Amount & Frequency
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="payrollDeductionAmount"
                label="Deduction Amount *"
                type="number"
                value={formData.payrollDeductionAmount || ''}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.payrollDeductionAmount}
                helperText={errors.payrollDeductionAmount || 'Amount per paycheck'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="success" />
                    </InputAdornment>
                  ),
                  style: { fontSize: '1.2rem', height: '60px' }
                }}
                placeholder="0.00"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="payrollDeductionFrequency"
                label="Deduction Frequency *"
                select
                value={formData.payrollDeductionFrequency || 'EveryPaycheck'}
                onChange={handleChange}
                fullWidth
                required
                SelectProps={{
                  style: { fontSize: '1.2rem', height: '60px' }
                }}
              >
                <MenuItem value="EveryPaycheck" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                  Every Paycheck
                </MenuItem>
                <MenuItem value="Monthly" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                  Monthly
                </MenuItem>
                <MenuItem value="BiWeekly" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                  Bi-Weekly
                </MenuItem>
                <MenuItem value="Weekly" style={{ fontSize: '1.2rem', padding: '12px 16px' }}>
                  Weekly
                </MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="deductionStartDate"
                label="Start Date *"
                type="date"
                value={formData.deductionStartDate || ''}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.deductionStartDate}
                helperText={errors.deductionStartDate || 'When to start deduction'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  style: { fontSize: '1.2rem', height: '60px' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="deductionEndDate"
                label="End Date (Optional)"
                type="date"
                value={formData.deductionEndDate || ''}
                onChange={handleChange}
                fullWidth
                helperText="Leave blank if ongoing"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  style: { fontSize: '1.2rem', height: '60px' }
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* RECIPIENT INFORMATION */}
      {formData.deductionType !== 'HSAContribution' && formData.deductionAction !== 'Stop' && (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#FDB94E', mb: 3 }}>
            <RecipientIcon /> Recipient/Payee Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="recipientName"
                label="Recipient Name *"
                value={formData.recipientName || ''}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.recipientName}
                helperText={errors.recipientName || 'Who receives this payment?'}
                placeholder="Recipient name"
                InputProps={{
                  style: { fontSize: '1.2rem', height: '60px' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="recipientAccountNumber"
                label="Account/Case Number"
                value={formData.recipientAccountNumber || ''}
                onChange={handleChange}
                fullWidth
                placeholder="Account or case number (if applicable)"
                InputProps={{
                  style: { fontSize: '1.2rem', height: '60px' }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="recipientAddress"
                label="Recipient Address"
                value={formData.recipientAddress || ''}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                placeholder="Mailing address for payments"
                InputProps={{
                  style: { fontSize: '1.1rem' }
                }}
              />
            </Grid>

            {(formData.deductionType === 'Garnishment' || formData.deductionType === 'ChildSupport') && (
              <Grid item xs={12} sm={6}>
                <TextField
                  name="courtOrderNumber"
                  label="Court Order Number *"
                  value={formData.courtOrderNumber || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.courtOrderNumber}
                  helperText={errors.courtOrderNumber || 'Required for court-ordered deductions'}
                  placeholder="Case number from court order"
                  InputProps={{
                    startAdornment: <CourtIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    style: { fontSize: '1.2rem', height: '60px' }
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                name="effectiveDate"
                label="Effective Date *"
                type="date"
                value={formData.effectiveDate || ''}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.effectiveDate}
                helperText={errors.effectiveDate || 'When should this take effect?'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  style: { fontSize: '1.2rem', height: '60px' }
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* JUSTIFICATION */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#5B8FCC' }}>
          📝 Justification
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="reason"
              label="Reason/Authorization *"
              multiline
              rows={6}
              value={formData.reason || ''}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.reason}
              helperText={errors.reason || 'Minimum 10 characters - explain authorization for this deduction'}
              placeholder="Explain the reason and authorization for this payroll deduction (attach court orders or signed authorization forms)"
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
              placeholder="Any special instructions or additional information"
              InputProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Alert severity="warning" sx={{ fontSize: '1rem' }}>
        <strong>Important:</strong> Court-ordered deductions require supporting documentation (court order, legal paperwork). Voluntary deductions require signed authorization.
      </Alert>
    </Box>
  );
};

export default PayrollDeductionForm;