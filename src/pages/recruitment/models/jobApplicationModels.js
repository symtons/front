// src/pages/recruitment/models/jobApplicationModels.js
/**
 * Comprehensive Job Application Models - Matching TPA Paper Form
 * 
 * This file contains all data structures, validation logic, and helper functions
 * for the complete TPA job application process
 */

// ============================================
// CONSTANTS - DROPDOWN OPTIONS
// ============================================

/**
 * Gender options
 */
export const GENDER_OPTIONS = [
  { value: '', label: 'Select Gender' },
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'PreferNotToSay', label: 'Prefer not to say' }
];

/**
 * Employment type options
 */
export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: '', label: 'Select Employment Type' },
  { value: 'FullTime', label: 'Full Time' },
  { value: 'PartTime', label: 'Part Time' },
  { value: 'Temporary', label: 'Temporary' }
];

/**
 * Salary type options
 */
export const SALARY_TYPE_OPTIONS = [
  { value: '', label: 'Select Salary Type' },
  { value: 'Hourly', label: 'Hourly' },
  { value: 'Yearly', label: 'Yearly' }
];

/**
 * Location preferences
 */
export const LOCATION_OPTIONS = [
  { value: 'Nashville', label: 'Nashville' },
  { value: 'Franklin', label: 'Franklin' },
  { value: 'Shelbyville', label: 'Shelbyville' },
  { value: 'Waynesboro', label: 'Waynesboro' },
  { value: 'Other', label: 'Other' }
];

/**
 * Shift preferences
 */
export const SHIFT_OPTIONS = [
  { value: '1stShift', label: '1st Shift' },
  { value: '2ndShift', label: '2nd Shift' },
  { value: '3rdShift', label: '3rd Shift' },
  { value: 'WeekendsOnly', label: 'Weekends Only' }
];

/**
 * Days of the week
 */
export const DAYS_OF_WEEK = [
  { value: 'Monday', label: 'Mon' },
  { value: 'Tuesday', label: 'Tues' },
  { value: 'Wednesday', label: 'Wed' },
  { value: 'Thursday', label: 'Thurs' },
  { value: 'Friday', label: 'Fri' },
  { value: 'Saturday', label: 'Sat' },
  { value: 'Sunday', label: 'Sun' }
];

/**
 * Education levels
 */
export const EDUCATION_LEVELS = [
  { value: 'ElementarySchool', label: 'Elementary School' },
  { value: 'HighSchool', label: 'High School' },
  { value: 'UndergraduateCollege', label: 'Undergraduate College/University' },
  { value: 'GraduateProfessional', label: 'Graduate/Professional' }
];

/**
 * US States
 */
export const US_STATES = [
  { value: '', label: 'Select State' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

// ============================================
// INITIAL FORM DATA STRUCTURE
// ============================================

/**
 * Get initial empty form data structure matching paper form
 */
export const getInitialApplicationFormData = () => ({
  // Step 1: Personal Information
  applicationDate: new Date().toISOString().split('T')[0],
  lastName: '',
  firstName: '',
  middleName: '',
  homeAddress: '',
  aptNumber: '',
  city: '',
  state: '',
  zipCode: '',
  socialSecurityNumber: '',
  driversLicenseNumber: '',
  driversLicenseState: '',
  phoneNumber: '',
  cellNumber: '',
  emergencyContactPerson: '',
  emergencyContactRelationship: '',
  emergencyContactAddress: '',
  emergencyContactPhone: '',

  // Step 2: Position & Availability
  position1: '',
  position2: '',
  salaryDesired: '',
  salaryType: '', // Hourly or Yearly
  availableStartDate: '',
  employmentSought: '', // FullTime, PartTime, Temporary
  desiredLocations: [], // Array of selected locations
  desiredLocationOther: '',
  shiftPreferences: [], // Array of selected shifts
  daysAvailable: [], // Array of selected days

  // Step 3: Background & Eligibility Questions
  previouslyAppliedToTPA: null, // true/false
  previouslyAppliedWhen: '',
  previouslyWorkedForTPA: null,
  previouslyWorkedWhen: '',
  familyMembersAtTPA: null,
  familyMembersWho: '',
  usCitizenOrResident: null,
  alienNumber: '',
  legallyEntitledToWork: null,
  eighteenOrOlder: null,
  servedInArmedForces: null,
  convictedOfCrime: null,
  crimeDetails: [], // Array of {date, charge, statusOrOutcome}
  nameOnAbuseRegistry: null,
  foundGuiltyOfAbuse: null,
  healthcareLicenseIssues: null,

  // Step 4: Education
  educationHistory: [
    // {
    //   level: 'HighSchool', // ElementarySchool, HighSchool, UndergraduateCollege, GraduateProfessional
    //   schoolName: '',
    //   location: '',
    //   yearsCompleted: '',
    //   hasDiploma: null,
    //   majorMinor: '',
    //   specializedTraining: ''
    // }
  ],
  specialSkillsKnowledge: '',
  typingSpeedWPM: '',

  // Step 5: Licenses & Certifications
  licensesAndCertifications: [
    // {
    //   type: '',
    //   state: '',
    //   idNumber: '',
    //   expirationDate: ''
    // }
  ],
  diddTrainingClasses: '',

  // Step 6: Professional References
  references: [
    {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      yearsKnown: ''
    },
    {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      yearsKnown: ''
    },
    {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      yearsKnown: ''
    }
  ],

  // Step 7: Employment History
  employmentHistory: [
    // {
    //   employer: '',
    //   address: '',
    //   city: '',
    //   state: '',
    //   zipCode: '',
    //   telephoneNumber: '',
    //   jobTitle: '',
    //   supervisor: '',
    //   employedFrom: '',
    //   employedTo: '',
    //   startingPay: '',
    //   finalPay: '',
    //   workPerformed: '',
    //   stillEmployed: null,
    //   reasonForLeaving: '',
    //   eligibleForRehire: null
    // }
  ],

  // Step 8: Background Check Authorization & Disclosures
  backgroundCheckConsent: false,
  backgroundCheckDate: '',
  backgroundCheckSignature: '',
  
  // New York specific (if applicable)
  nyApplicant: false,
  nyConsentToReport: false,
  
  // Minnesota/Oklahoma specific
  mnOkApplicant: false,
  mnOkConsentToReport: false,
  
  // California specific
  caApplicant: false,
  caConsentToReport: false,
  
  // Reference check authorization
  referenceCheckConsent: false,
  referenceCheckSSNLast4: '',
  referenceCheckDate: '',
  referenceCheckSignature: '',
  
  // DIDD/TennCare authorization
  hasNoAbuseCaseAgainstMe: null,
  hasAbuseCaseAgainstMe: null,
  diddAuthorizationConsent: false,
  diddFullName: '',
  diddSSN: '',
  diddDOB: '',
  diddDriverLicense: '',
  diddWitnessName: '',
  
  // Protection from harm statement
  protectionNoAbuseCase: null,
  protectionHasAbuseCase: null,
  protectionAuthorizationConsent: false
});

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  if (!email) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

/**
 * Validate SSN format (XXX-XX-XXXX)
 */
export const isValidSSN = (ssn) => {
  if (!ssn) return false;
  const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/;
  return ssnRegex.test(ssn);
};

/**
 * Validate zip code
 */
export const isValidZipCode = (zipCode) => {
  if (!zipCode) return false;
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};

/**
 * Validate date format
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

/**
 * Validate Step 1 - Personal Information
 */
export const validatePersonalInfo = (formData) => {
  const errors = {};

  if (!formData.firstName?.trim()) errors.firstName = 'First name is required';
  if (!formData.lastName?.trim()) errors.lastName = 'Last name is required';
  if (!formData.homeAddress?.trim()) errors.homeAddress = 'Home address is required';
  if (!formData.city?.trim()) errors.city = 'City is required';
  if (!formData.state) errors.state = 'State is required';
  if (!formData.zipCode?.trim()) {
    errors.zipCode = 'Zip code is required';
  } else if (!isValidZipCode(formData.zipCode)) {
    errors.zipCode = 'Invalid zip code format';
  }
  
  if (!formData.socialSecurityNumber?.trim()) {
    errors.socialSecurityNumber = 'Social Security Number is required';
  } else if (!isValidSSN(formData.socialSecurityNumber)) {
    errors.socialSecurityNumber = 'Invalid SSN format (XXX-XX-XXXX)';
  }
  
  if (!formData.driversLicenseNumber?.trim()) {
    errors.driversLicenseNumber = 'Driver\'s License Number is required';
  }
  if (!formData.driversLicenseState) {
    errors.driversLicenseState = 'Driver\'s License State is required';
  }
  
  if (!formData.phoneNumber?.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!isValidPhone(formData.phoneNumber)) {
    errors.phoneNumber = 'Invalid phone number format';
  }
  
  if (formData.cellNumber && !isValidPhone(formData.cellNumber)) {
    errors.cellNumber = 'Invalid cell number format';
  }
  
  if (!formData.emergencyContactPerson?.trim()) {
    errors.emergencyContactPerson = 'Emergency contact person is required';
  }
  if (!formData.emergencyContactRelationship?.trim()) {
    errors.emergencyContactRelationship = 'Emergency contact relationship is required';
  }
  if (!formData.emergencyContactPhone?.trim()) {
    errors.emergencyContactPhone = 'Emergency contact phone is required';
  } else if (!isValidPhone(formData.emergencyContactPhone)) {
    errors.emergencyContactPhone = 'Invalid emergency contact phone format';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Step 2 - Position & Availability
 */
export const validatePositionInfo = (formData) => {
  const errors = {};

  if (!formData.position1?.trim()) {
    errors.position1 = 'At least one position is required';
  }
  
  if (!formData.salaryDesired) {
    errors.salaryDesired = 'Desired salary is required';
  }
  
  if (!formData.salaryType) {
    errors.salaryType = 'Salary type is required';
  }
  
  if (!formData.availableStartDate) {
    errors.availableStartDate = 'Available start date is required';
  }
  
  if (!formData.employmentSought) {
    errors.employmentSought = 'Employment type is required';
  }
  
  if (!formData.desiredLocations || formData.desiredLocations.length === 0) {
    errors.desiredLocations = 'At least one location preference is required';
  }
  
  if (!formData.shiftPreferences || formData.shiftPreferences.length === 0) {
    errors.shiftPreferences = 'At least one shift preference is required';
  }
  
  if (!formData.daysAvailable || formData.daysAvailable.length === 0) {
    errors.daysAvailable = 'At least one available day is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Step 3 - Background Questions
 */
export const validateBackgroundQuestions = (formData) => {
  const errors = {};

  if (formData.previouslyAppliedToTPA === null) {
    errors.previouslyAppliedToTPA = 'This field is required';
  }
  
  if (formData.previouslyWorkedForTPA === null) {
    errors.previouslyWorkedForTPA = 'This field is required';
  }
  
  if (formData.familyMembersAtTPA === null) {
    errors.familyMembersAtTPA = 'This field is required';
  }
  
  if (formData.usCitizenOrResident === null) {
    errors.usCitizenOrResident = 'This field is required';
  }
  
  if (formData.legallyEntitledToWork === null) {
    errors.legallyEntitledToWork = 'This field is required';
  }
  
  if (formData.eighteenOrOlder === null) {
    errors.eighteenOrOlder = 'This field is required';
  }
  
  if (formData.servedInArmedForces === null) {
    errors.servedInArmedForces = 'This field is required';
  }
  
  if (formData.convictedOfCrime === null) {
    errors.convictedOfCrime = 'This field is required';
  }
  
  if (formData.nameOnAbuseRegistry === null) {
    errors.nameOnAbuseRegistry = 'This field is required';
  }
  
  if (formData.foundGuiltyOfAbuse === null) {
    errors.foundGuiltyOfAbuse = 'This field is required';
  }
  
  if (formData.healthcareLicenseIssues === null) {
    errors.healthcareLicenseIssues = 'This field is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Step 6 - References
 */
export const validateReferences = (formData) => {
  const errors = {};
  
  // At least one reference required (first reference must be complete)
  const ref1 = formData.references[0];
  if (!ref1.firstName?.trim()) {
    errors.reference1FirstName = 'First reference first name is required';
  }
  if (!ref1.lastName?.trim()) {
    errors.reference1LastName = 'First reference last name is required';
  }
  if (!ref1.phoneNumber?.trim()) {
    errors.reference1PhoneNumber = 'First reference phone number is required';
  } else if (!isValidPhone(ref1.phoneNumber)) {
    errors.reference1PhoneNumber = 'Invalid phone number format';
  }
  if (ref1.email && !isValidEmail(ref1.email)) {
    errors.reference1Email = 'Invalid email format';
  }
  if (!ref1.yearsKnown || ref1.yearsKnown < 1) {
    errors.reference1YearsKnown = 'Years known is required (minimum 5 for first reference)';
  } else if (ref1.yearsKnown < 5) {
    errors.reference1YearsKnown = 'First reference must have known you for at least 5 years';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Step 8 - Authorizations
 */
export const validateAuthorizations = (formData) => {
  const errors = {};

  if (!formData.backgroundCheckConsent) {
    errors.backgroundCheckConsent = 'You must consent to background check';
  }
  
  if (!formData.referenceCheckConsent) {
    errors.referenceCheckConsent = 'You must consent to reference check';
  }
  
  if (!formData.referenceCheckSSNLast4?.trim()) {
    errors.referenceCheckSSNLast4 = 'Last 4 digits of SSN required';
  } else if (!/^\d{4}$/.test(formData.referenceCheckSSNLast4)) {
    errors.referenceCheckSSNLast4 = 'Must be exactly 4 digits';
  }
  
  if (formData.hasNoAbuseCaseAgainstMe === null && formData.hasAbuseCaseAgainstMe === null) {
    errors.abuseCase = 'You must select one option';
  }
  
  if (!formData.diddAuthorizationConsent) {
    errors.diddAuthorizationConsent = 'You must consent to DIDD/TennCare authorization';
  }
  
  if (!formData.diddFullName?.trim()) {
    errors.diddFullName = 'Full name is required';
  }
  
  if (!formData.diddSSN?.trim()) {
    errors.diddSSN = 'SSN is required';
  } else if (!isValidSSN(formData.diddSSN)) {
    errors.diddSSN = 'Invalid SSN format';
  }
  
  if (!formData.diddDOB) {
    errors.diddDOB = 'Date of birth is required';
  }
  
  if (!formData.diddDriverLicense?.trim()) {
    errors.diddDriverLicense = 'Driver license or ID# is required';
  }
  
  if (formData.protectionNoAbuseCase === null && formData.protectionHasAbuseCase === null) {
    errors.protectionAbuseCase = 'You must select one option';
  }
  
  if (!formData.protectionAuthorizationConsent) {
    errors.protectionAuthorizationConsent = 'You must consent to protection from harm verification';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ============================================
// HELPER/FORMATTING FUNCTIONS
// ============================================

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
};

/**
 * Format SSN for display (XXX-XX-XXXX)
 */
export const formatSSN = (ssn) => {
  if (!ssn) return '';
  const cleaned = ssn.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
  if (match) {
    return match[1] + '-' + match[2] + '-' + match[3];
  }
  return ssn;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount) => {
  if (!amount) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US');
};

/**
 * Format full name
 */
export const formatFullName = (firstName, middleName, lastName) => {
  const parts = [firstName, middleName, lastName].filter(Boolean);
  return parts.join(' ');
};

/**
 * Get state label from value
 */
export const getStateLabel = (stateValue) => {
  const state = US_STATES.find(s => s.value === stateValue);
  return state ? state.label : stateValue;
};

/**
 * Prepare application data for API submission
 */
// FIXED prepareApplicationForAPI function
// Add this to your jobApplicationModels.js file (replace the existing function)

/**
 * Prepare application data for API submission
 * Safely handles undefined values and converts arrays to JSON strings
 */
export const prepareApplicationForAPI = (formData) => {
  // Helper function to safely stringify
  const safeStringify = (value) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return null;
    }
    return typeof value === 'string' ? value : JSON.stringify(value);
  };

  return {
    // Personal Information
    applicationDate: formData.applicationDate || null,
    firstName: formData.firstName || '',
    lastName: formData.lastName || '',
    middleName: formData.middleName || null,
    dateOfBirth: formData.dateOfBirth || null,
    gender: formData.gender || null,
    phoneNumber: formData.phoneNumber || '',
    cellNumber: formData.cellNumber || null,
    email: formData.email || '',
    address: formData.address || '',
    aptNumber: formData.aptNumber || null,
    city: formData.city || '',
    state: formData.state || '',
    zipCode: formData.zipCode || '',
    country: formData.country || 'USA',
    socialSecurityNumber: formData.socialSecurityNumber || null,
    driversLicenseNumber: formData.driversLicenseNumber || null,
    driversLicenseState: formData.driversLicenseState || null,
    emergencyContactPerson: formData.emergencyContactPerson || null,
    emergencyContactRelationship: formData.emergencyContactRelationship || null,
    emergencyContactAddress: formData.emergencyContactAddress || null,
    emergencyContactPhone: formData.emergencyContactPhone || null,

    // Position Details - Map to API expected names
    position1: formData.position1 || formData.positionAppliedFor || '',
    position2: formData.position2 || null,
    salaryDesired: formData.salaryDesired || formData.desiredSalary || null,
    salaryType: formData.salaryType || null,
    availableStartDate: formData.availableStartDate || formData.expectedStartDate || null,
    employmentSought: formData.employmentSought || null,
    desiredLocations: safeStringify(formData.desiredLocations),
    desiredLocationOther: formData.desiredLocationOther || null,
    shiftPreferences: safeStringify(formData.shiftPreferences),
    daysAvailable: safeStringify(formData.daysAvailable),

    // Background Questions
    previouslyAppliedToTPA: formData.previouslyAppliedToTPA,
    previouslyAppliedWhen: formData.previouslyAppliedWhen || null,
    previouslyWorkedForTPA: formData.previouslyWorkedForTPA,
    previouslyWorkedWhen: formData.previouslyWorkedWhen || null,
    familyMembersAtTPA: formData.familyMembersAtTPA,
    familyMembersWho: formData.familyMembersWho || null,
    usCitizenOrResident: formData.usCitizenOrResident,
    alienNumber: formData.alienNumber || null,
    legallyEntitledToWork: formData.legallyEntitledToWork,
    eighteenOrOlder: formData.eighteenOrOlder,
    servedInArmedForces: formData.servedInArmedForces,
    convictedOfCrime: formData.convictedOfCrime,
    crimeDetails: safeStringify(formData.crimeDetails),
    nameOnAbuseRegistry: formData.nameOnAbuseRegistry,
    foundGuiltyOfAbuse: formData.foundGuiltyOfAbuse,
    healthcareLicenseIssues: formData.healthcareLicenseIssues,

    // Education
    educationHistory: safeStringify(formData.educationHistory),
    specialSkillsKnowledge: formData.specialSkillsKnowledge || null,
    typingSpeedWPM: formData.typingSpeedWPM || null,

    // Licenses
    licensesAndCertifications: safeStringify(formData.licensesAndCertifications),
    diddTrainingClasses: formData.diddTrainingClasses || null,

    // References
    references: safeStringify(formData.references),

    // Employment History
    employmentHistory: safeStringify(formData.employmentHistory),

    // Authorizations
    backgroundCheckConsent: formData.backgroundCheckConsent || false,
    backgroundCheckDate: formData.backgroundCheckDate || null,
    backgroundCheckSignature: formData.backgroundCheckSignature || null,
    nyApplicant: formData.nyApplicant || false,
    mnOkApplicant: formData.mnOkApplicant || false,
    caApplicant: formData.caApplicant || false,
    referenceCheckConsent: formData.referenceCheckConsent || false,
    referenceCheckSSNLast4: formData.referenceCheckSSNLast4 || null,
    referenceCheckDate: formData.referenceCheckDate || null,
    referenceCheckSignature: formData.referenceCheckSignature || null,
    hasNoAbuseCaseAgainstMe: formData.hasNoAbuseCaseAgainstMe,
    hasAbuseCaseAgainstMe: formData.hasAbuseCaseAgainstMe,
    diddAuthorizationConsent: formData.diddAuthorizationConsent || false,
    diddFullName: formData.diddFullName || null,
    diddSSN: formData.diddSSN || null,
    diddDOB: formData.diddDOB || null,
    diddDriverLicense: formData.diddDriverLicense || null,
    diddWitnessName: formData.diddWitnessName || null,
    protectionNoAbuseCase: formData.protectionNoAbuseCase,
    protectionHasAbuseCase: formData.protectionHasAbuseCase,
    protectionAuthorizationConsent: formData.protectionAuthorizationConsent || false
  };
};