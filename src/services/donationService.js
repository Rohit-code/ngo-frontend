// services/donationService.js - UPDATED with Payment Confirmation
import api from './api';
import toast from 'react-hot-toast';

/**
 * Handle API errors consistently
 */
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || `Server error (${status})`;
    
    switch (status) {
      case 400:
        throw new Error(message || 'Invalid request');
      case 404:
        throw new Error('Donation not found');
      case 409:
        throw new Error(message || 'Payment already in progress');
      case 500:
        throw new Error('Internal server error. Please try again later.');
      default:
        throw new Error(message);
    }
  } else if (error.request) {
    throw new Error('Network error. Please check your internet connection.');
  } else {
    throw new Error(error.message || 'An unexpected error occurred.');
  }
};

/**
 * Retry request with exponential backoff
 */
const retryRequest = async (requestFn, maxAttempts = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      if (attempt === maxAttempts) {
        throw error;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

export const donationService = {
  /**
   * Create a new donation (India)
   */
  createDonation: async (donationData) => {
    return retryRequest(async () => {
      try {
        const response = await api.post('/donations', donationData);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Create international donation
   */
  createInternationalDonation: async (donationData) => {
    return retryRequest(async () => {
      try {
        const response = await api.post('/donations/international', donationData);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Process payment for donation
   */
  processPayment: async (donationId, paymentData) => {
    return retryRequest(async () => {
      try {
        const response = await api.post(`/donations/${donationId}/payment`, paymentData);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Process international payment
   */
  processInternationalPayment: async (donationId, paymentData) => {
    return retryRequest(async () => {
      try {
        const response = await api.post(`/donations/${donationId}/payment/international`, paymentData);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * CRITICAL - Confirm payment after Stripe processing
   */
  confirmPayment: async (paymentIntentId) => {
    return retryRequest(async () => {
      try {
        const response = await api.post('/donations/payment/confirm', {
          payment_intent_id: paymentIntentId
        });
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get payment status
   */
  getPaymentStatus: async (paymentIntentId) => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/donations/payment/status/${paymentIntentId}`);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Validate payment before processing
   */
  validatePayment: async (donationId, paymentData) => {
    return retryRequest(async () => {
      try {
        const response = await api.post(`/donations/${donationId}/validate-payment`, paymentData);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get donation by ID
   */
  getDonationById: async (donationId) => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/donations/${donationId}`);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get all donations with pagination
   */
  getDonations: async (params = {}) => {
    return retryRequest(async () => {
      try {
        const response = await api.get('/donations', { params });
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get donations by donor email
   */
  getDonationsByEmail: async (email) => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/donations/donor/${email}`);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get supported countries
   */
  getSupportedCountries: async () => {
    return retryRequest(async () => {
      try {
        const response = await api.get('/donations/countries');
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get country configuration
   */
  getCountryConfig: async (countryCode) => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/donations/country/${countryCode}`);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Create recurring donation
   */
  createRecurringDonation: async (donationData) => {
    return retryRequest(async () => {
      try {
        const response = await api.post('/donations/recurring', donationData);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Cancel recurring donation
   */
  cancelRecurringDonation: async (donationId) => {
    return retryRequest(async () => {
      try {
        const response = await api.post(`/donations/${donationId}/cancel-recurring`);
        if (response.success) {
          toast.success('Recurring donation cancelled successfully');
        }
        return response;
      } catch (error) {
        toast.error('Failed to cancel recurring donation');
        throw handleApiError(error);
      }
    });
  },

  /**
   * Update recurring donation
   */
  updateRecurringDonation: async (donationId, updateData) => {
    return retryRequest(async () => {
      try {
        const response = await api.put(`/donations/${donationId}/recurring`, updateData);
        if (response.success) {
          toast.success('Recurring donation updated successfully');
        }
        return response;
      } catch (error) {
        toast.error('Failed to update recurring donation');
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get donation analytics
   */
  getDonationAnalytics: async (params = {}) => {
    return retryRequest(async () => {
      try {
        const response = await api.get('/donations/analytics', { params });
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Resend donation receipt
   */
  resendReceipt: async (donationId) => {
    return retryRequest(async () => {
      try {
        const response = await api.post(`/donations/${donationId}/resend-receipt`);
        if (response.success) {
          toast.success('Receipt sent successfully');
        }
        return response;
      } catch (error) {
        toast.error('Failed to send receipt');
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get donation receipt
   */
  getDonationReceipt: async (donationId) => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/donations/${donationId}/receipt`);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Download donation receipt PDF
   */
  downloadReceipt: async (donationId) => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/donations/${donationId}/receipt/download`, {
          responseType: 'blob'
        });
        
        // Create blob URL and trigger download
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `donation-receipt-${donationId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('Receipt downloaded successfully');
        return { success: true };
      } catch (error) {
        toast.error('Failed to download receipt');
        throw handleApiError(error);
      }
    });
  },

  /**
   * Validate donation data before submission
   */
  validateDonationData: (donationData) => {
    const errors = [];

    // Required fields validation
    if (!donationData.donor?.full_name?.trim()) {
      errors.push('Full name is required');
    }

    if (!donationData.donor?.email?.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donationData.donor.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!donationData.donor?.mobile?.trim()) {
      errors.push('Mobile number is required');
    }

    if (!donationData.amount || donationData.amount <= 0) {
      errors.push('Donation amount must be greater than 0');
    }

    if (!donationData.donor?.address?.trim()) {
      errors.push('Address is required');
    }

    if (!donationData.donor?.city?.trim()) {
      errors.push('City is required');
    }

    if (!donationData.donor?.pincode?.trim()) {
      errors.push('Postal code is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Format donation data for API
   */
  formatDonationData: (formData, amount, donationType, selectedCampaign, countryConfig) => {
    return {
      donor: {
        full_name: formData.full_name?.trim(),
        email: formData.email?.trim().toLowerCase(),
        mobile: formData.mobile?.trim(),
        pan_number: formData.pan_number?.trim().toUpperCase() || null,
        country: countryConfig?.name || 'India',
        country_code: formData.country || 'IN',
        state: formData.state?.trim(),
        city: formData.city?.trim(),
        address: formData.address?.trim(),
        pincode: formData.pincode?.trim(),
        is_anonymous: false
      },
      amount: parseFloat(amount),
      currency: countryConfig?.currency || 'INR',
      donation_type: donationType,
      campaign_id: selectedCampaign?.id || null,
      source: 'website'
    };
  }
};

export default donationService;