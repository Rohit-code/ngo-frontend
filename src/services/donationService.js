import api from './api';

export const donationService = {
  /**
   * Create a new donation
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
   * Process payment for a donation
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
   * Handle payment callback from gateway
   */
  handlePaymentCallback: async (callbackData) => {
    try {
      const response = await api.post('/donations/payment/callback', callbackData);
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