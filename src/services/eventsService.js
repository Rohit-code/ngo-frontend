// services/eventsService.js
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
        throw new Error('Event not found');
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

export const eventsService = {
  /**
   * Get all events
   */
  getAllEvents: async (params = {}) => {
    return retryRequest(async () => {
      try {
        const response = await api.get('/events', { params });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get event by ID
   */
  getEventById: async (eventId) => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/events/${eventId}`);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Create new event
   */
  createEvent: async (eventData) => {
    return retryRequest(async () => {
      try {
        const response = await api.post('/events', eventData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Update event
   */
  updateEvent: async (eventId, eventData) => {
    return retryRequest(async () => {
      try {
        const response = await api.put(`/events/${eventId}`, eventData);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Delete event
   */
  deleteEvent: async (eventId) => {
    return retryRequest(async () => {
      try {
        const response = await api.delete(`/events/${eventId}`);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Upload images for an event
   */
  uploadEventImages: async (eventId, files) => {
    return retryRequest(async () => {
      try {
        const formData = new FormData();
        
        // Add files to FormData
        Array.from(files).forEach((file, index) => {
          formData.append(`images`, file);
        });

        const response = await api.post(`/events/${eventId}/images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Delete specific image from event
   */
  deleteEventImage: async (eventId, imageId) => {
    return retryRequest(async () => {
      try {
        const response = await api.delete(`/events/${eventId}/images/${imageId}`);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get featured events (for public display)
   */
  getFeaturedEvents: async (limit = 6) => {
    return retryRequest(async () => {
      try {
        const response = await api.get('/events/featured', { 
          params: { limit } 
        });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get events by status
   */
  getEventsByStatus: async (status) => {
    return retryRequest(async () => {
      try {
        const response = await api.get('/events', { 
          params: { status } 
        });
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get upcoming events
   */
  getUpcomingEvents: async () => {
    return retryRequest(async () => {
      try {
        const response = await api.get('/events/upcoming');
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get completed events
   */
  getCompletedEvents: async () => {
    return retryRequest(async () => {
      try {
        const response = await api.get('/events/completed');
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Validate event data
   */
  validateEventData: (eventData) => {
    const errors = [];

    if (!eventData.title?.trim()) {
      errors.push('Event title is required');
    }

    if (!eventData.description?.trim()) {
      errors.push('Event description is required');
    }

    if (eventData.date && new Date(eventData.date) < new Date()) {
      errors.push('Event date cannot be in the past');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Format event data for API
   */
  formatEventData: (formData) => {
    return {
      title: formData.title?.trim(),
      description: formData.description?.trim(),
      date: formData.date || null,
      location: formData.location?.trim() || null,
      impact: formData.impact?.trim() || null,
      status: formData.status || 'upcoming'
    };
  }
};

export default eventsService;
