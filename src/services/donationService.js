import api from './api';

export const donationService = {
  /**
   * Create a standard donation (Indian)
   */
  createDonation: async (donationData) => {
    try {
      const response = await api.post('/donations', donationData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create international donation
   */
  createInternationalDonation: async (donationData) => {
    try {
      const response = await api.post('/donations/international', donationData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get supported countries for international donations
   */
  getSupportedCountries: async () => {
    try {
      const response = await api.get('/donations/countries');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get country configuration
   */
  getCountryConfig: async (countryCode) => {
    try {
      const response = await api.get(`/donations/country/${countryCode}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Process payment for donation
   */
  processPayment: async (donationId, paymentData) => {
    try {
      const response = await api.post(`/donations/${donationId}/payment`, paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Process international payment
   */
  processInternationalPayment: async (donationId, paymentData) => {
    try {
      const response = await api.post(`/donations/${donationId}/payment/international`, paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Confirm payment after Stripe processing
   */
  confirmPayment: async (paymentIntentId) => {
    try {
      const response = await api.post('/donations/payment/confirm', {
        payment_intent_id: paymentIntentId
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all donations with pagination and filters
   */
  getDonations: async (params = {}) => {
    try {
      const response = await api.get('/donations', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get donation by ID
   */
  getDonationById: async (id) => {
    try {
      const response = await api.get(`/donations/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create recurring donation
   */
  createRecurringDonation: async (donationData) => {
    try {
      const response = await api.post('/donations/recurring', donationData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cancel recurring donation
   */
  cancelRecurringDonation: async (donationId) => {
    try {
      const response = await api.delete(`/donations/${donationId}/recurring`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get donation statistics
   */
  getDonationStats: async (period = '30d') => {
    try {
      const response = await api.get('/donations/stats', { 
        params: { period } 
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update donation status (admin only)
   */
  updateDonationStatus: async (donationId, statusData) => {
    try {
      const response = await api.patch(`/donations/${donationId}/status`, statusData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};