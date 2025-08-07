// services/campaignService.js - Campaign service for fetching campaign data
import api from './api';
import toast from 'react-hot-toast';

/**
 * Handle API errors consistently
 */
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    const message = data?.message || `Server error (${status})`;
    
    switch (status) {
      case 400:
        throw new Error(message || 'Invalid request');
      case 404:
        throw new Error('Campaign not found');
      case 500:
        throw new Error('Internal server error. Please try again later.');
      default:
        throw new Error(message);
    }
  } else if (error.request) {
    // Network error
    throw new Error('Network error. Please check your internet connection.');
  } else {
    // Something else happened
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

export const campaignService = {
  /**
   * Get all campaigns with pagination and filters
   */
  getCampaigns: async (params = {}) => {
    return retryRequest(async () => {
      try {
        const response = await api.get('/campaigns', { params });
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get featured campaigns
   */
  getFeaturedCampaigns: async (limit = 6) => {
    return retryRequest(async () => {
      try {
        const response = await api.get('/campaigns', { 
          params: { 
            is_featured: true, 
            status: 'active',
            limit 
          } 
        });
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get active campaigns
   */
  getActiveCampaigns: async (params = {}) => {
    return retryRequest(async () => {
      try {
        const response = await api.get('/campaigns', { 
          params: { 
            ...params,
            status: 'active' 
          } 
        });
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get campaign by ID
   */
  getCampaignById: async (id) => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/campaigns/${id}`);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get campaign donations
   */
  getCampaignDonations: async (id, params = {}) => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/campaigns/${id}/donations`, { params });
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get campaign statistics
   */
  getCampaignStats: async (id) => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/campaigns/${id}/stats`);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Search campaigns
   */
  searchCampaigns: async (query, params = {}) => {
    return retryRequest(async () => {
      try {
        const response = await api.get('/campaigns/search', {
          params: {
            q: query,
            ...params
          }
        });
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get campaigns by category
   */
  getCampaignsByCategory: async (category, params = {}) => {
    return retryRequest(async () => {
      try {
        const response = await api.get('/campaigns', {
          params: {
            category,
            ...params
          }
        });
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Admin Functions (if needed)
   */

  /**
   * Create campaign (admin only)
   */
  createCampaign: async (campaignData) => {
    return retryRequest(async () => {
      try {
        const formData = new FormData();
        
        // Add campaign data
        Object.keys(campaignData).forEach(key => {
          if (key === 'image' && campaignData[key] instanceof File) {
            formData.append('image', campaignData[key]);
          } else if (campaignData[key] !== null && campaignData[key] !== undefined) {
            formData.append(key, campaignData[key]);
          }
        });

        const response = await api.post('/campaigns', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.success) {
          toast.success('Campaign created successfully');
        }

        return response;
      } catch (error) {
        toast.error('Failed to create campaign');
        throw handleApiError(error);
      }
    });
  },

  /**
   * Update campaign (admin only)
   */
  updateCampaign: async (id, campaignData) => {
    return retryRequest(async () => {
      try {
        const formData = new FormData();
        
        // Add campaign data
        Object.keys(campaignData).forEach(key => {
          if (key === 'image' && campaignData[key] instanceof File) {
            formData.append('image', campaignData[key]);
          } else if (campaignData[key] !== null && campaignData[key] !== undefined) {
            formData.append(key, campaignData[key]);
          }
        });

        const response = await api.put(`/campaigns/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.success) {
          toast.success('Campaign updated successfully');
        }

        return response;
      } catch (error) {
        toast.error('Failed to update campaign');
        throw handleApiError(error);
      }
    });
  },

  /**
   * Delete campaign (admin only)
   */
  deleteCampaign: async (id) => {
    return retryRequest(async () => {
      try {
        const response = await api.delete(`/campaigns/${id}`);

        if (response.success) {
          toast.success('Campaign deleted successfully');
        }

        return response;
      } catch (error) {
        toast.error('Failed to delete campaign');
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get campaign analytics (admin only)
   */
  getCampaignAnalytics: async (id, period = '30d') => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/campaigns/${id}/analytics`, {
          params: { period }
        });
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Utility Functions
   */

  /**
   * Calculate campaign progress percentage
   */
  calculateProgress: (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  },

  /**
   * Check if campaign is active
   */
  isActive: (campaign) => {
    if (!campaign) return false;
    
    const now = new Date();
    const endDate = new Date(campaign.end_date);
    
    return campaign.status === 'active' && endDate > now;
  },

  /**
   * Get days remaining
   */
  getDaysRemaining: (endDate) => {
    if (!endDate) return null;
    
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  },

  /**
   * Get campaign status display
   */
  getStatusDisplay: (campaign) => {
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
  },

  /**
   * Format campaign data for display
   */
  formatCampaignData: (campaign) => {
    if (!campaign) return null;
    
    const progress = campaignService.calculateProgress(
      campaign.current_amount || 0, 
      campaign.target_amount
    );
    
    const daysRemaining = campaignService.getDaysRemaining(campaign.end_date);
    const status = campaignService.getStatusDisplay(campaign);
    const isActive = campaignService.isActive(campaign);
    
    return {
      ...campaign,
      progress: Math.round(progress),
      daysRemaining,
      status,
      isActive,
      formattedCurrentAmount: campaign.current_amount || 0,
      formattedTargetAmount: campaign.target_amount || 0
    };
  }
};

export default campaignService;