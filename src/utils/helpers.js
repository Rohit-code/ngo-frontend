import { format, parseISO, isValid } from 'date-fns';
import { 
  VALIDATION_PATTERNS, 
  IMPACT_MESSAGES, 
  INTERNATIONAL_IMPACT_MESSAGES,
  CURRENCIES,
  SUPPORTED_COUNTRIES,
  DONATION_AMOUNTS
} from './constants';

/**
 * Format currency based on locale and currency type
 */
export const formatCurrency = (amount, currency = 'INR', showDecimals = false) => {
  if (!amount && amount !== 0) return getCurrencySymbol(currency) + '0';
  
  const num = parseFloat(amount);
  if (isNaN(num)) return getCurrencySymbol(currency) + '0';
  
  const currencyInfo = CURRENCIES[currency];
  const decimals = showDecimals ? (currencyInfo?.decimal_places || 2) : 0;
  
  // Use appropriate locale based on currency
  const locale = getLocaleForCurrency(currency);
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currency = 'INR') => {
  return CURRENCIES[currency]?.symbol || currency;
};

/**
 * Get appropriate locale for currency formatting
 */
export const getLocaleForCurrency = (currency) => {
  const localeMap = {
    INR: 'en-IN',
    USD: 'en-US',
    GBP: 'en-GB',
    EUR: 'en-GB', // or 'de-DE', 'fr-FR' based on preference
    CAD: 'en-CA',
    AUD: 'en-AU',
    SGD: 'en-SG'
  };
  return localeMap[currency] || 'en-US';
};

/**
 * Format large numbers with K, L, Cr suffixes (international support)
 */
export const formatNumber = (num, currency = 'INR') => {
  if (!num && num !== 0) return '0';
  
  const number = parseFloat(num);
  if (isNaN(number)) return '0';
  
  // Use Indian formatting for INR
  if (currency === 'INR') {
    if (number >= 10000000) { // 1 Crore
      return `${(number / 10000000).toFixed(1)}Cr`;
    } else if (number >= 100000) { // 1 Lakh
      return `${(number / 100000).toFixed(1)}L`;
    } else if (number >= 1000) { // 1 Thousand
      return `${(number / 1000).toFixed(1)}K`;
    }
  } else {
    // Use international formatting for other currencies
    if (number >= 1000000) { // 1 Million
      return `${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) { // 1 Thousand
      return `${(number / 1000).toFixed(1)}K`;
    }
  }
  
  return number.toString();
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString, formatString = 'MMM dd, yyyy') => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return '';
    return format(date, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  return VALIDATION_PATTERNS.email.test(email);
};

/**
 * Validate mobile number based on country
 */
export const isValidMobile = (mobile, countryCode = 'IN') => {
  const country = SUPPORTED_COUNTRIES.find(c => c.code === countryCode);
  if (country && country.phone_validation) {
    return country.phone_validation.test(mobile);
  }
  // Fallback to international mobile pattern
  return VALIDATION_PATTERNS.international_mobile.test(mobile);
};

/**
 * Validate PAN number (India specific)
 */
export const isValidPAN = (pan) => {
  return VALIDATION_PATTERNS.pan.test(pan);
};

/**
 * Validate postal code based on country
 */
export const isValidPincode = (pincode, countryCode = 'IN') => {
  const country = SUPPORTED_COUNTRIES.find(c => c.code === countryCode);
  if (country && country.postal_validation) {
    return country.postal_validation.test(pincode);
  }
  // Fallback validation
  return pincode && pincode.length >= 3;
};

/**
 * Get impact message for donation amount based on currency
 */
export const getImpactMessage = (amount, currency = 'INR') => {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return '';
  
  // Use appropriate impact messages based on currency
  const messages = currency === 'INR' ? IMPACT_MESSAGES : INTERNATIONAL_IMPACT_MESSAGES;
  
  // Find the closest predefined amount
  const amounts = Object.keys(messages).map(a => parseInt(a)).sort((a, b) => a - b);
  let closestAmount = amounts[0];
  
  for (const amt of amounts) {
    if (num >= amt) {
      closestAmount = amt;
    } else {
      break;
    }
  }
  
  return messages[closestAmount] || 'Your donation will make a meaningful difference in the lives of infants and children.';
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (raised, target) => {
  if (!target || target <= 0) return 0;
  const progress = (raised / target) * 100;
  return Math.min(progress, 100); // Cap at 100%
};

/**
 * Get donation amounts for a specific currency
 */
export const getDonationAmounts = (currency = 'INR') => {
  return DONATION_AMOUNTS[currency] || DONATION_AMOUNTS.USD;
};

/**
 * Get country configuration by code
 */
export const getCountryConfig = (countryCode) => {
  return SUPPORTED_COUNTRIES.find(country => country.code === countryCode);
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone, countryCode = 'IN') => {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  if (countryCode === 'IN' && cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (countryCode === 'US' && cleaned.length === 10) {
    return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone; // Return original if can't format
};

/**
 * Convert currency amount (placeholder - would use real exchange rates)
 */
export const convertCurrency = async (amount, fromCurrency, toCurrency, exchangeRate = null) => {
  if (fromCurrency === toCurrency) return amount;
  
  if (exchangeRate) {
    return parseFloat((amount * exchangeRate).toFixed(2));
  }
  
  // In a real implementation, you would call an exchange rate API
  // For now, return the original amount
  return amount;
};

/**
 * Get minimum donation amount for currency
 */
export const getMinDonation = (currency = 'INR') => {
  const country = SUPPORTED_COUNTRIES.find(c => c.currency === currency);
  return country?.min_donation || 1;
};

/**
 * Validate donation amount
 */
export const isValidDonationAmount = (amount, currency = 'INR') => {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return false;
  
  const minAmount = getMinDonation(currency);
  return num >= minAmount;
};

/**
 * Format address based on country format
 */
export const formatAddress = (addressData, countryCode = 'IN') => {
  const country = getCountryConfig(countryCode);
  if (!country || !addressData) return '';
  
  const { address, city, state, pincode } = addressData;
  const parts = [address, city, state, pincode].filter(Boolean);
  
  return parts.join(', ');
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Scroll to element smoothly
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.offsetTop - offset;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  }
};

/**
 * Check if user is on mobile device
 */
export const isMobile = () => {
  return window.innerWidth <= 768;
};

/**
 * Convert donation type to display format
 */
export const formatDonationType = (type) => {
  const typeMap = {
    one_time: 'One Time',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly'
  };
  return typeMap[type] || type;
};

/**
 * Convert payment status to display format
 */
export const formatPaymentStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
    refunded: 'Refunded'
  };
  return statusMap[status] || status;
};

/**
 * Get status color class
 */
export const getStatusColor = (status) => {
  const colorMap = {
    pending: 'text-secondary-600 bg-secondary-100',
    processing: 'text-primary-600 bg-primary-100',
    completed: 'text-accent-600 bg-accent-100',
    failed: 'text-red-600 bg-red-100',
    cancelled: 'text-gray-600 bg-gray-100',
    refunded: 'text-blue-600 bg-blue-100'
  };
  return colorMap[status] || 'text-gray-600 bg-gray-100';
};

/**
 * Generate share URLs for social media
 */
export const generateShareUrls = (url, title, description) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if value is empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Sleep function for delays
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Format donation ID for display
 */
export const formatDonationId = (id) => {
  if (!id) return '';
  if (id.startsWith('INFANT-')) return id;
  return `INFANT-${id}`;
};

/**
 * Parse donation ID
 */
export const parseDonationId = (donationId) => {
  if (!donationId) return null;
  
  const parts = donationId.split('-');
  if (parts.length >= 3) {
    return {
      prefix: parts[0],
      date: parts[1],
      sequence: parts[2]
    };
  }
  return null;
};

/**
 * Get currency conversion rate (mock function)
 */
export const getCurrencyRate = async (fromCurrency, toCurrency) => {
  // In a real implementation, this would call an exchange rate API
  const mockRates = {
    'INR-USD': 0.012,
    'USD-INR': 83.0,
    'INR-GBP': 0.010,
    'GBP-INR': 100.0,
    'USD-GBP': 0.8,
    'GBP-USD': 1.25
  };
  
  const key = `${fromCurrency}-${toCurrency}`;
  return mockRates[key] || 1;
};

/**
 * Format receipt number
 */
export const formatReceiptNumber = (receiptNumber) => {
  if (!receiptNumber) return '';
  if (receiptNumber.startsWith('RCP-')) return receiptNumber;
  return `RCP-${receiptNumber}`;
};

/**
 * Validate campaign data
 */
export const validateCampaignData = (campaignData) => {
  const errors = {};
  
  if (!campaignData.title || campaignData.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }
  
  if (!campaignData.description || campaignData.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }
  
  if (!campaignData.target_amount || campaignData.target_amount < 100) {
    errors.target_amount = 'Target amount must be at least 100';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Calculate estimated exchange amount
 */
export const calculateExchangeAmount = (amount, fromCurrency, toCurrency, rate) => {
  if (fromCurrency === toCurrency) return amount;
  
  const converted = amount * rate;
  const decimals = CURRENCIES[toCurrency]?.decimal_places || 2;
  
  return parseFloat(converted.toFixed(decimals));
};