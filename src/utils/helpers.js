import { format, parseISO, isValid } from 'date-fns';
import { VALIDATION_PATTERNS, IMPACT_MESSAGES } from './constants';

/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount, showDecimals = false) => {
  if (!amount && amount !== 0) return '₹0';
  
  const num = parseFloat(amount);
  if (isNaN(num)) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  }).format(num);
};

/**
 * Format large numbers with K, L, Cr suffixes
 */
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  
  const number = parseFloat(num);
  if (isNaN(number)) return '0';
  
  if (number >= 10000000) { // 1 Crore
    return `${(number / 10000000).toFixed(1)}Cr`;
  } else if (number >= 100000) { // 1 Lakh
    return `${(number / 100000).toFixed(1)}L`;
  } else if (number >= 1000) { // 1 Thousand
    return `${(number / 1000).toFixed(1)}K`;
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
 * Validate Indian mobile number
 */
export const isValidMobile = (mobile) => {
  return VALIDATION_PATTERNS.mobile.test(mobile);
};

/**
 * Validate PAN number
 */
export const isValidPAN = (pan) => {
  return VALIDATION_PATTERNS.pan.test(pan);
};

/**
 * Validate pincode
 */
export const isValidPincode = (pincode) => {
  return VALIDATION_PATTERNS.pincode.test(pincode);
};

/**
 * Get impact message for donation amount
 */
export const getImpactMessage = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return '';
  
  // Find the closest predefined amount
  const amounts = Object.keys(IMPACT_MESSAGES).map(a => parseInt(a)).sort((a, b) => a - b);
  let closestAmount = amounts[0];
  
  for (const amt of amounts) {
    if (num >= amt) {
      closestAmount = amt;
    } else {
      break;
    }
  }
  
  return IMPACT_MESSAGES[closestAmount] || 'Your donation will make a meaningful difference in the lives of infants and children.';
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