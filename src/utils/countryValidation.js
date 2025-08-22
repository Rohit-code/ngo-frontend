// utils/countryValidation.js - Enhanced country-specific validation
import { SUPPORTED_COUNTRIES, VALIDATION_PATTERNS } from './constants';

export const getCountryValidation = (countryCode) => {
  const country = SUPPORTED_COUNTRIES.find(c => c.code === countryCode);
  return country || SUPPORTED_COUNTRIES[0]; // Default to first country (India)
};

export const validateByCountry = {
  /**
   * Validate mobile number based on country
   */
  mobile: (value, countryCode = 'IN') => {
    if (!value) return 'Phone number is required';
    
    const country = getCountryValidation(countryCode);
    
    // Country-specific validation
    switch (countryCode) {
      case 'IN':
        if (!country.phone_validation.test(value)) {
          return 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9';
        }
        break;
      case 'US':
      case 'CA':
        if (!country.phone_validation.test(value)) {
          return 'Please enter a valid phone number (e.g., (555) 123-4567)';
        }
        break;
      case 'GB':
        if (!country.phone_validation.test(value)) {
          return 'Please enter a valid UK phone number';
        }
        break;
      case 'AU':
        if (!country.phone_validation.test(value)) {
          return 'Please enter a valid Australian phone number';
        }
        break;
      case 'SG':
        if (!country.phone_validation.test(value)) {
          return 'Please enter a valid Singapore phone number';
        }
        break;
      case 'DE':
        if (!country.phone_validation.test(value)) {
          return 'Please enter a valid German phone number';
        }
        break;
      case 'DK':
        if (!country.phone_validation.test(value)) {
          return 'Please enter a valid Danish phone number';
        }
        break;
      default:
        // Generic international validation
        if (value.length < 8 || value.length > 15) {
          return 'Phone number must be 8-15 digits';
        }
        if (!/^[\+]?[\d\s\-\(\)]{8,15}$/.test(value)) {
          return 'Please enter a valid phone number';
        }
    }
    
    return true;
  },

  /**
   * Validate postal code based on country
   */
  postalCode: (value, countryCode = 'IN') => {
    if (!value) return 'Postal code is required';
    
    const country = getCountryValidation(countryCode);
    
    switch (countryCode) {
      case 'IN':
        if (!country.postal_validation.test(value)) {
          return 'Please enter a valid 6-digit pincode (e.g., 400001)';
        }
        break;
      case 'US':
        if (!country.postal_validation.test(value)) {
          return 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
        }
        break;
      case 'GB':
        if (!country.postal_validation.test(value)) {
          return 'Please enter a valid UK postcode (e.g., SW1A 1AA)';
        }
        break;
      case 'CA':
        if (!country.postal_validation.test(value)) {
          return 'Please enter a valid Canadian postal code (e.g., K1A 0A6)';
        }
        break;
      case 'AU':
        if (!country.postal_validation.test(value)) {
          return 'Please enter a valid 4-digit postcode';
        }
        break;
      case 'SG':
        if (!country.postal_validation.test(value)) {
          return 'Please enter a valid 6-digit postal code';
        }
        break;
      case 'DE':
        if (!country.postal_validation.test(value)) {
          return 'Please enter a valid 5-digit postal code';
        }
        break;
      case 'DK':
        if (!country.postal_validation.test(value)) {
          return 'Please enter a valid 4-digit postal code';
        }
        break;
      default:
        if (value.length < 3) {
          return 'Postal code must be at least 3 characters';
        }
    }
    
    return true;
  },

  /**
   * Validate PAN (India only)
   */
  pan: (value, countryCode = 'IN') => {
    if (countryCode !== 'IN') return true; // Only validate for India
    if (!value) return true; // Optional field
    
    if (!VALIDATION_PATTERNS.pan.test(value)) {
      return 'Please enter a valid PAN (e.g., ABCDE1234F)';
    }
    
    return true;
  },

  /**
   * Validate email (universal)
   */
  email: (value) => {
    if (!value) return 'Email is required';
    
    if (!VALIDATION_PATTERNS.email.test(value)) {
      return 'Please enter a valid email address';
    }
    
    return true;
  },

  /**
   * Get address format for country
   */
  getAddressFields: (countryCode = 'IN') => {
    const country = getCountryValidation(countryCode);
    
    const fieldLabels = {
      'IN': {
        state: 'State',
        city: 'City',
        postal: 'Pincode',
        address: 'Address'
      },
      'US': {
        state: 'State',
        city: 'City', 
        postal: 'ZIP Code',
        address: 'Address'
      },
      'GB': {
        state: 'County',
        city: 'City',
        postal: 'Postcode',
        address: 'Address'
      },
      'CA': {
        state: 'Province',
        city: 'City',
        postal: 'Postal Code',
        address: 'Address'
      },
      'AU': {
        state: 'State',
        city: 'City',
        postal: 'Postcode',
        address: 'Address'
      },
      'SG': {
        state: 'District',
        city: 'City',
        postal: 'Postal Code',
        address: 'Address'
      },
      'DE': {
        state: 'State',
        city: 'City',
        postal: 'Postal Code',
        address: 'Address'
      },
      'DK': {
        state: 'State',
        city: 'City',
        postal: 'Postal Code',
        address: 'Address'
      }
    };
    
    return fieldLabels[countryCode] || fieldLabels['US']; // Default to US format
  }
};

// Enhanced DonationForm validation (Update existing DonationForm.jsx)
// Add this to your existing DonationForm component:

const validateFormField = (fieldName, value, selectedCountry) => {
  switch (fieldName) {
    case 'mobile':
      return validateByCountry.mobile(value, selectedCountry);
    case 'pincode':
      return validateByCountry.postalCode(value, selectedCountry);
    case 'pan_number':
      return validateByCountry.pan(value, selectedCountry);
    case 'email':
      return validateByCountry.email(value);
    default:
      return true;
  }
};

