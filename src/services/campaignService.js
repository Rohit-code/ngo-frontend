import api from './api';

export const campaignService = {
  /**
   * Get all campaigns with pagination and filters
   */
  getCampaigns: async (params = {}) => {
    try {
      const response = await api.get('/campaigns', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get featured campaigns (max 6)
   */
  getFeaturedCampaigns: async () => {
    try {
      const response = await api.get('/campaigns/featured');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get campaign by ID with recent donations
   */
  getCampaignById: async (id) => {
    try {
      const response = await api.get(`/campaigns/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get campaign statistics
   */
  getCampaignStats: async () => {
    try {
      const response = await api.get('/campaigns/stats');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get donations for a specific campaign
   */
  getCampaignDonations: async (campaignId, params = {}) => {
    try {
      const response = await api.get(`/campaigns/${campaignId}/donations`, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new campaign (admin only)
   */
  createCampaign: async (campaignData) => {
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(campaignData).forEach(key => {
        if (key !== 'image' && campaignData[key] !== null && campaignData[key] !== undefined) {
          formData.append(key, campaignData[key]);
        }
      });
      
      // Append image if exists
      if (campaignData.image) {
        formData.append('image', campaignData.image);
      }
      
      const response = await api.post('/campaigns', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update campaign (admin only)
   */
  updateCampaign: async (campaignId, campaignData) => {
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(campaignData).forEach(key => {
        if (key !== 'image' && campaignData[key] !== null && campaignData[key] !== undefined) {
          formData.append(key, campaignData[key]);
        }
      });
      
      // Append image if exists
      if (campaignData.image) {
        formData.append('image', campaignData.image);
      }
      
      const response = await api.put(`/campaigns/${campaignId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete campaign (admin only)
   */
  deleteCampaign: async (campaignId) => {
    try {
      const response = await api.delete(`/campaigns/${campaignId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search campaigns
   */
  searchCampaigns: async (searchTerm, filters = {}) => {
    try {
      const params = {
        search: searchTerm,
        ...filters
      };
      const response = await api.get('/campaigns', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get campaign progress analytics
   */
  getCampaignProgress: async (campaignId) => {
    try {
      const response = await api.get(`/campaigns/${campaignId}/progress`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};