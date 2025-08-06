import api from './api';

// Add request/response interceptors for better error handling
const handleApiError = (error) => {
  if (error.response?.status === 429) {
    throw new Error('Too many requests. Please wait a moment and try again.');
  } else if (error.response?.status >= 500) {
    throw new Error('Server error. Please try again later.');
  } else if (!navigator.onLine) {
    throw new Error('Please check your internet connection.');
  }
  
  throw error;
};

// Add retry logic for failed requests
const retryRequest = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      if (error.response?.status >= 500 || !navigator.onLine) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        continue;
      }
      
      throw error;
    }
  }
};

export const donationService = {
  /**
   * Create a standard donation (Indian)
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
   * Get supported countries for international donations
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
   * Confirm payment after Stripe processing
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
   * Get all donations with pagination and filters
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
   * Get donation by ID
   */
  getDonationById: async (id) => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/donations/${id}`);
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
        const response = await api.delete(`/donations/${donationId}/recurring`);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get donation statistics
   */
  getDonationStats: async (period = '30d') => {
    return retryRequest(async () => {
      try {
        const response = await api.get('/donations/stats', { 
          params: { period } 
        });
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Update donation status (admin only)
   */
  updateDonationStatus: async (donationId, statusData) => {
    return retryRequest(async () => {
      try {
        const response = await api.patch(`/donations/${donationId}/status`, statusData);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  }
};