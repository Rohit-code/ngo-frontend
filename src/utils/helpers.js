// utils/helpers.js - Enhanced helper functions
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/**
 * Format currency based on locale and currency code
 */
export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  if (!amount || isNaN(amount)) return '₹0';
  
  const currencyMap = {
    'INR': { locale: 'en-IN', symbol: '₹' },
    'USD': { locale: 'en-US', symbol: '$' },
    'GBP': { locale: 'en-GB', symbol: '£' },
    'EUR': { locale: 'en-EU', symbol: '€' },
    'CAD': { locale: 'en-CA', symbol: 'C$' },
    'AUD': { locale: 'en-AU', symbol: 'A$' },
    'SGD': { locale: 'en-SG', symbol: 'S$' }
  };

  const config = currencyMap[currency] || currencyMap['INR'];
  
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    // Fallback to symbol + amount
    return `${config.symbol}${Number(amount).toLocaleString()}`;
  }
};

/**
 * Format date with various options
 */
export const formatDate = (date, formatString = 'PPp', options = {}) => {
  if (!date) return '';
  
  let dateObj;
  
  // Handle different date inputs
  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return '';
  }
  
  if (!isValid(dateObj)) return '';
  
  try {
    // Common format shortcuts
    switch (formatString) {
      case 'short':
        return format(dateObj, 'MMM d, yyyy');
      case 'long':
        return format(dateObj, 'MMMM d, yyyy');
      case 'time':
        return format(dateObj, 'HH:mm:ss');
      case 'datetime':
        return format(dateObj, 'MMM d, yyyy HH:mm');
      case 'relative':
        return formatDistanceToNow(dateObj, { addSuffix: true });
      default:
        return format(dateObj, formatString, options);
    }
  } catch (error) {
    console.error('Date formatting error:', error);
    return date.toString();
  }
};

/**
 * Validate email address
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate Indian mobile number
 */
export const isValidMobile = (mobile, countryCode = 'IN') => {
  if (!mobile || typeof mobile !== 'string') return false;
  
  const cleanMobile = mobile.replace(/\D/g, '');
  
  switch (countryCode) {
    case 'IN':
      return /^[6-9]\d{9}$/.test(cleanMobile);
    case 'US':
    case 'CA':
      return /^\d{10}$/.test(cleanMobile) || /^1\d{10}$/.test(cleanMobile);
    case 'GB':
      return /^(\+44|0)[1-9]\d{8,9}$/.test(mobile);
    case 'AU':
      return /^(\+61|0)[2-9]\d{8}$/.test(mobile);
    case 'SG':
      return /^(\+65)?[689]\d{7}$/.test(mobile);
    case 'MY':
      return /^(\+60|0)[1-9]\d{8}$/.test(mobile);
    default:
      return cleanMobile.length >= 8 && cleanMobile.length <= 15;
  }
};

/**
 * Validate Indian PAN number
 */
export const isValidPAN = (pan) => {
  if (!pan || typeof pan !== 'string') return false;
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.trim().toUpperCase());
};

/**
 * Validate Indian pincode
 */
export const isValidPincode = (pincode, countryCode = 'IN') => {
  if (!pincode || typeof pincode !== 'string') return false;
  
  const cleanPincode = pincode.trim();
  
  switch (countryCode) {
    case 'IN':
      return /^[1-9][0-9]{5}$/.test(cleanPincode);
    case 'US':
      return /^\d{5}(-\d{4})?$/.test(cleanPincode);
    case 'GB':
      return /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(cleanPincode);
    case 'CA':
      return /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(cleanPincode);
    case 'AU':
      return /^\d{4}$/.test(cleanPincode);
    case 'SG':
      return /^\d{6}$/.test(cleanPincode);
    case 'MY':
      return /^\d{5}$/.test(cleanPincode);
    default:
      return cleanPincode.length >= 3;
  }
};

/**
 * Get impact message based on donation amount
 */
export const getImpactMessage = (amount, currency = 'INR') => {
  if (!amount || amount <= 0) return '';
  
  // Convert to INR for impact calculation (rough conversion)
  let inrAmount = amount;
  if (currency !== 'INR') {
      const conversionRates = {
    'USD': 83,
    'GBP': 104,
    'EUR': 90,
    'CAD': 61,
    'AUD': 54,
    'SGD': 61,
    'MYR': 17.5
  };
    inrAmount = amount * (conversionRates[currency] || 83);
  }
  
  if (inrAmount >= 10000) {
    return 'Can provide complete healthcare and education support for 3 months';
  } else if (inrAmount >= 5000) {
    return 'Can provide complete healthcare and education support for 2 months';
  } else if (inrAmount >= 2000) {
    return 'Can provide healthcare support for 1 month';
  } else if (inrAmount >= 1000) {
    return 'Can provide basic healthcare for 2 weeks';
  } else if (inrAmount >= 500) {
    return 'Can provide basic care for 1 week';
  } else {
    return 'Can provide essential supplies and care';
  }
};

/**
 * Sanitize string input (basic)
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/[<>]/g, '');
};

/**
 * Generate random ID
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(this, args);
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
 * Format file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      return true;
    } catch (fallbackError) {
      console.error('Clipboard copy failed:', fallbackError);
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

/**
 * Get browser info
 */
export const getBrowserInfo = () => {
  const { userAgent } = navigator;
  
  let browser = 'Unknown';
  let version = 'Unknown';
  
  if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
    version = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
    version = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.includes('Safari')) {
    browser = 'Safari';
    version = userAgent.match(/Safari\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge';
    version = userAgent.match(/Edge\/([0-9.]+)/)?.[1] || 'Unknown';
  }
  
  return { browser, version, userAgent };
};

/**
 * Check if device is mobile
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Get device type
 */
export const getDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet';
  }
  
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
    return 'mobile';
  }
  
  return 'desktop';
};

/**
 * Format percentage
 */
export const formatPercentage = (value, total, decimals = 1) => {
  if (!total || total === 0) return '0%';
  
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Validate URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sleep/delay function
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry function with exponential backoff
 */
export const retry = async (fn, maxAttempts = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await sleep(delay);
    }
  }
  
  throw lastError;
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    Object.keys(obj).forEach(key => {
      clonedObj[key] = deepClone(obj[key]);
    });
    return clonedObj;
  }
};

/**
 * Calculate progress percentage for campaigns
 */
export const calculateProgress = (current, target) => {
  if (!target || target === 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(progress, 100); // Cap at 100%
};

/**
 * Check if campaign is active
 */
export const isCampaignActive = (campaign) => {
  if (!campaign) return false;
  
  const now = new Date();
  const endDate = new Date(campaign.end_date);
  
  return campaign.status === 'active' && endDate > now;
};

/**
 * Get days remaining for campaign
 */
export const getDaysRemaining = (endDate) => {
  if (!endDate) return null;
  
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};

/**
 * Get campaign status display text
 */
export const getCampaignStatus = (campaign) => {
  if (!campaign) return 'Unknown';
  
  const now = new Date();
  const endDate = new Date(campaign.end_date);
  
  if (campaign.status === 'completed' || endDate < now) {
    return 'Completed';
  } else if (campaign.status === 'paused') {
    return 'Paused';
  } else if (campaign.status === 'active') {
    return 'Active';
  } else {
    return 'Draft';
  }
};

/**
 * Format number with abbreviations (K, M, B)
 */
export const formatNumberAbbreviation = (num) => {
  if (!num || num === 0) return '0';
  
  const absNum = Math.abs(num);
  
  if (absNum >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  } else if (absNum >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (absNum >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toString();
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  try {
    return formatDistanceToNow(parseISO(date), { addSuffix: true });
  } catch (error) {
    return formatDate(date, 'short');
  }
};

export default {
  formatCurrency,
  formatDate,
  isValidEmail,
  isValidMobile,
  isValidPAN,
  isValidPincode,
  getImpactMessage,
  sanitizeInput,
  generateId,
  debounce,
  throttle,
  formatFileSize,
  copyToClipboard,
  getBrowserInfo,
  isMobileDevice,
  getDeviceType,
  formatPercentage,
  isValidUrl,
  sleep,
  retry,
  deepClone,
  calculateProgress,
  isCampaignActive,
  getDaysRemaining,
  getCampaignStatus,
  formatNumberAbbreviation,
  truncateText,
  getRelativeTime
};