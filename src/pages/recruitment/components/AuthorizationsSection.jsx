// src/pages/recruitment/components/AuthorizationsSection.jsx
/**
 * AuthorizationsSection Component - Step 8
 * 
 * Multiple authorization and consent forms:
 * 1. Background Investigation Disclosure and Authorization
 * 2. Pre-Employment Reference Check Release
 * 3. DIDD/TennCare/Bureau Authorization
 * 4. Protection from Harm Statement
 */

import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  Alert,
  Box,
  Paper,
  FormControlLabel,
  Checkbox,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  Divider
} from '@mui/material';
import {
  Gavel as LegalIcon,
  VerifiedUser as VerifiedIcon
} from '@mui/icons-material';

const AuthorizationsSection = ({ formData, onChange, errors = {} }) => {
  
  const handleChange = (e) => {
    onChange(e);
  };

  const handleCheckboxChange = (name, checked) => {
    onChange({
      target: {
        name: name,
        value: checked
      }
    });
  };

  const handleRadioChange = (name, value) => {
    onChange({
      target: {
        name: name,
        value: value === 'true'
      }
    });
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
        Background Check Authorizations & Disclosures
      </Typography>

      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          IMPORTANT - PLEASE READ CAREFULLY BEFORE SIGNING AUTHORIZATION
        </Typography>
        <Typography variant="body2">
          This section contains legally binding authorizations. Please read each section carefully 
          and provide your consent. All fields are required to complete your application.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* 1. BACKGROUND INVESTIGATION DISCLOSURE */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 3, backgroundColor: '#f9f9f9' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LegalIcon sx={{ mr: 1, color: '#667eea', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                (1) Background Investigation Disclosure and Authorization
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7 }}>
              <strong>DISCLOSURE REGARDING BACKGROUND INVESTIGATION</strong>
            </Typography>

            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7, fontSize: '0.875rem' }}>
              Tennessee Personal Assistance, Inc. - Nashville may obtain information about you from a 
              consumer reporting agency for Employment purposes. Thus, you may be the subject of a "consumer report" 
              and/or an "investigative consumer report" which may include information about your character, general 
              reputation, personal characteristics, and/or mode of living, and which can involve personal interviews 
              with sources such as your neighbors, friends, or associates. These reports may be obtained at any time 
              after receipt of your authorization and, if you are hired, throughout your employment. You also are 
              advised that the nature and scope of the most common form of investigative history conducted by 
              Fowlers' Profile Links, Inc., PO Box 291043, Nashville, TN, 37229, 1-866-887-7581 or another outside 
              organization. The scope of this notice and authorization is all-encompassing, however, allowing 
              Tennessee Personal Assistance, Inc. - Nashville to obtain from any outside organization all manners 
              of consumer reports and investigative consumer reports now and throughout the course of your employment 
              to the full extent permitted by law. As a result, you should carefully consider whether to exercise 
              your right to request disclosure of the nature and scope of any investigative consumer report.
            </Typography>

            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
              ACKNOWLEDGMENT AND AUTHORIZATION
            </Typography>

            <Typography variant="body2" sx={{ mb: 2, fontSize: '0.875rem', lineHeight: 1.7 }}>
              I acknowledge receipt of the DISCLOSURE REGARDING BACKGROUND INVESTIGATION and A SUMMARY OF YOUR RIGHTS 
              UNDER THE FAIR CREDIT REPORTING ACT and certify that I have read and understand both of those documents. 
              I hereby authorize the obtaining of "consumer reports" and/or "investigative consumer reports" by the 
              Company at any time after receipt of this authorization and throughout my employment, if applicable.
            </Typography>

            {/* State-specific consents */}
            <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.nyApplicant || false}
                    onChange={(e) => handleCheckboxChange('nyApplicant', e.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2">
                    <strong>New York applicants/employees only:</strong> I wish to receive a copy of 
                    any investigative consumer report if one is obtained.
                  </Typography>
                }
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.mnOkApplicant || false}
                    onChange={(e) => handleCheckboxChange('mnOkApplicant', e.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2">
                    <strong>Minnesota and Oklahoma applicants/employees only:</strong> I wish to receive 
                    a copy of a consumer report if one is obtained.
                  </Typography>
                }
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.caApplicant || false}
                    onChange={(e) => handleCheckboxChange('caApplicant', e.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2">
                    <strong>California applicants/employees only:</strong> I acknowledge receipt of 
                    REGARDING BACKGROUND INVESTIGATION PURSUANT TO CALIFORNIA LAW and wish to receive 
                    a copy of an investigative consumer report.
                  </Typography>
                }
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.backgroundCheckConsent || false}
                  onChange={(e) => handleCheckboxChange('backgroundCheckConsent', e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  <strong style={{ color: '#f44336' }}>* Required:</strong> I consent to background investigation
                </Typography>
              }
            />
            {errors.backgroundCheckConsent && (
              <Typography variant="caption" color="error" display="block" sx={{ ml: 4 }}>
                {errors.backgroundCheckConsent}
              </Typography>
            )}

            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                name="backgroundCheckDate"
                value={formData.backgroundCheckDate || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Electronic Signature (Type your full name)"
                name="backgroundCheckSignature"
                value={formData.backgroundCheckSignature || ''}
                onChange={handleChange}
                placeholder="Type your full legal name as signature"
                helperText="By typing your name, you are electronically signing this authorization"
              />
            </Box>
          </Paper>
        </Grid>

        {/* 2. PRE-EMPLOYMENT REFERENCE CHECK RELEASE */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <VerifiedIcon sx={{ mr: 1, color: '#6AB4A8', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                (2) Pre-Employment Reference Check Release & Authorization
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 2, fontSize: '0.875rem', lineHeight: 1.7 }}>
              The person named below has applied for a position with our company. Their consideration for 
              employment is largely dependent on this reference form. Below is a signed authorization and 
              consent from the applicant for our company to obtain reference information. Your prompt 
              cooperation, time and attention in completing this reference will be greatly appreciated.
            </Typography>

            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
              Applicant's Authorization, Release and Request for Reference Information
            </Typography>

            <Typography variant="body2" sx={{ mb: 2, fontSize: '0.875rem', lineHeight: 1.7 }}>
              I authorize all my current and former employers to provide reference information, including my job 
              performance, my work record and attendance, the reason(s) for my leaving, my eligibility for rehire 
              and my suitability for the position I am now seeking. I encourage my current and former employers to 
              provide complete responses to requests for information, which I believe to be true but not documented. 
              I realize some information may be complimentary and some may be critical. I promise I will not bring 
              any legal claims or actions against my current or former employer due to their responses to job reference 
              requests. I recognize there is also a State Statute; which provide my employers with certain protection 
              from such claims. I realize no one is required to give a reference, so I make this commitment to 
              encourage the free exchange of reference information.
            </Typography>

            <Typography variant="body2" sx={{ mb: 2, fontSize: '0.875rem' }}>
              I signed this release voluntarily and was not required to do so as part of the application process.
            </Typography>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="SSN # (Last 4 digits only)"
                name="referenceCheckSSNLast4"
                value={formData.referenceCheckSSNLast4 || ''}
                onChange={handleChange}
                placeholder="XXX-XX"
                inputProps={{ maxLength: 4 }}
                error={!!errors.referenceCheckSSNLast4}
                helperText={errors.referenceCheckSSNLast4 || 'Last 4 digits only for legal compliance'}
                sx={{ mb: 2 }}
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.referenceCheckConsent || false}
                  onChange={(e) => handleCheckboxChange('referenceCheckConsent', e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  <strong style={{ color: '#f44336' }}>* Required:</strong> I authorize reference checks as described above
                </Typography>
              }
            />
            {errors.referenceCheckConsent && (
              <Typography variant="caption" color="error" display="block" sx={{ ml: 4 }}>
                {errors.referenceCheckConsent}
              </Typography>
            )}

            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                name="referenceCheckDate"
                value={formData.referenceCheckDate || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Electronic Signature (Type your full name)"
                name="referenceCheckSignature"
                value={formData.referenceCheckSignature || ''}
                onChange={handleChange}
                placeholder="Type your full legal name as signature"
              />
            </Box>
          </Paper>
        </Grid>

        {/* 3. DIDD/TENNCARE AUTHORIZATION */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 3, backgroundColor: '#fff8e1' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              (3) DIDD, Bureau of TennCare & TPA Authorization and General Release
            </Typography>

            <Typography variant="body2" sx={{ mb: 2, fontSize: '0.875rem' }}>
              I, the undersigned applicant certify and affirm that, to the best of my knowledge and belief:
            </Typography>

            <FormControl component="fieldset" error={!!errors.abuseCase} sx={{ mb: 2 }}>
              <RadioGroup
                value={
                  formData.hasNoAbuseCaseAgainstMe ? 'no' : 
                  formData.hasAbuseCaseAgainstMe ? 'yes' : ''
                }
                onChange={(e) => {
                  if (e.target.value === 'no') {
                    handleCheckboxChange('hasNoAbuseCaseAgainstMe', true);
                    handleCheckboxChange('hasAbuseCaseAgainstMe', false);
                  } else {
                    handleCheckboxChange('hasNoAbuseCaseAgainstMe', false);
                    handleCheckboxChange('hasAbuseCaseAgainstMe', true);
                  }
                }}
              >
                <FormControlLabel 
                  value="no" 
                  control={<Radio />} 
                  label="I have NOT had a case of abuse, neglect, mistreatment or exploitation substantiated against me" 
                />
                <FormControlLabel 
                  value="yes" 
                  control={<Radio />} 
                  label="I have had a case of abuse, neglect, mistreatment or exploitation substantiated against me" 
                />
              </RadioGroup>
              {errors.abuseCase && (
                <Typography variant="caption" color="error">{errors.abuseCase}</Typography>
              )}
            </FormControl>

            <Typography variant="body2" sx={{ mb: 2, fontSize: '0.875rem', lineHeight: 1.7 }}>
              As a condition of submitting this application and in order to verify this affirmation, I further 
              release and authorize Tennessee Personal Assistance, the Tennessee Department of Intellectual 
              and Developmental Disabilities and the Bureau of TennCare to have full and complete access to 
              any and all current or prior personnel or investigative records, from any party, person, business, 
              entity or agency, whether governmental or non-governmental, as pertains to any allegations against 
              me of abuse, neglect, mistreatment or exploitation and to consider this information as may be 
              deemed appropriate.
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name (Last, First, Middle)"
                  name="diddFullName"
                  value={formData.diddFullName || ''}
                  onChange={handleChange}
                  error={!!errors.diddFullName}
                  helperText={errors.diddFullName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SSN #"
                  name="diddSSN"
                  value={formData.diddSSN || ''}
                  onChange={handleChange}
                  placeholder="XXX-XX-XXXX"
                  error={!!errors.diddSSN}
                  helperText={errors.diddSSN}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  name="diddDOB"
                  value={formData.diddDOB || ''}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.diddDOB}
                  helperText={errors.diddDOB}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Driver License or ID #"
                  name="diddDriverLicense"
                  value={formData.diddDriverLicense || ''}
                  onChange={handleChange}
                  error={!!errors.diddDriverLicense}
                  helperText={errors.diddDriverLicense}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Witness Name"
                  name="diddWitnessName"
                  value={formData.diddWitnessName || ''}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.diddAuthorizationConsent || false}
                  onChange={(e) => handleCheckboxChange('diddAuthorizationConsent', e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  <strong style={{ color: '#f44336' }}>* Required:</strong> I authorize DIDD/TennCare access as described above
                </Typography>
              }
            />
            {errors.diddAuthorizationConsent && (
              <Typography variant="caption" color="error" display="block" sx={{ ml: 4 }}>
                {errors.diddAuthorizationConsent}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* 4. PROTECTION FROM HARM STATEMENT */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              (4) Protection from Harm Statement
            </Typography>

            <Typography variant="body2" sx={{ mb: 2, fontSize: '0.875rem' }}>
              I, certify and affirm that, to the best of my knowledge and belief:
            </Typography>

            <FormControl component="fieldset" error={!!errors.protectionAbuseCase} sx={{ mb: 2 }}>
              <RadioGroup
                value={
                  formData.protectionNoAbuseCase ? 'no' : 
                  formData.protectionHasAbuseCase ? 'yes' : ''
                }
                onChange={(e) => {
                  if (e.target.value === 'no') {
                    handleCheckboxChange('protectionNoAbuseCase', true);
                    handleCheckboxChange('protectionHasAbuseCase', false);
                  } else {
                    handleCheckboxChange('protectionNoAbuseCase', false);
                    handleCheckboxChange('protectionHasAbuseCase', true);
                  }
                }}
              >
                <FormControlLabel 
                  value="no" 
                  control={<Radio />} 
                  label="I have NOT had a case of abuse, neglect, mistreatment or exploitation substantiated against me" 
                />
                <FormControlLabel 
                  value="yes" 
                  control={<Radio />} 
                  label="I have had a case of abuse, neglect, mistreatment or exploitation substantiated against me" 
                />
              </RadioGroup>
              {errors.protectionAbuseCase && (
                <Typography variant="caption" color="error">{errors.protectionAbuseCase}</Typography>
              )}
            </FormControl>

            <Typography variant="body2" sx={{ mb: 2, fontSize: '0.875rem', lineHeight: 1.7 }}>
              In order to verify this affirmation, I further release and authorize Tennessee Personal 
              Assistance, the Tennessee Department of Intellectual and Developmental Disabilities and the 
              Bureau of TennCare to have full and complete access to any and all current or prior personnel 
              or investigative records as pertains to substantiated allegations against me of abuse, neglect, 
              mistreatment or exploitation.
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.protectionAuthorizationConsent || false}
                  onChange={(e) => handleCheckboxChange('protectionAuthorizationConsent', e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  <strong style={{ color: '#f44336' }}>* Required:</strong> I authorize protection from harm verification
                </Typography>
              }
            />
            {errors.protectionAuthorizationConsent && (
              <Typography variant="caption" color="error" display="block" sx={{ ml: 4 }}>
                {errors.protectionAuthorizationConsent}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Final Notice */}
        <Grid item xs={12}>
          <Alert severity="success">
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Almost Done!
            </Typography>
            <Typography variant="body2">
              After reviewing all sections, click "Submit Application" to complete your application. 
              You will receive a confirmation and a PDF copy of your application will be automatically downloaded.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </>
  );
};

export default AuthorizationsSection;