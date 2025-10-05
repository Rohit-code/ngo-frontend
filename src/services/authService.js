// services/authService.js
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
      case 401:
        throw new Error('Invalid credentials');
      case 403:
        throw new Error('Access denied');
      case 404:
        throw new Error('User not found');
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

export const authService = {
  /**
   * Login with username and password
   */
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });
      return response.data; // Return the data part
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Logout current user
   */
  logout: async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (token) {
        await api.post('/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.warn('Logout API call failed:', error.message);
    } finally {
      // Always clear local storage
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
  },

  /**
   * Verify current token
   */
  verifyToken: async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        return { valid: false, user: null };
      }

      const response = await api.get('/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return {
        valid: true,
        user: response.data.user
      };
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      return { valid: false, user: null };
    }
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('admin_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  /**
   * Get current token
   */
  getToken: () => {
    return localStorage.getItem('admin_token');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    return !!(token && user);
  },

  /**
   * Refresh token (if implemented)
   */
  refreshToken: async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No token to refresh');
      }

      const response = await api.post('/auth/refresh', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.success) {
        localStorage.setItem('admin_token', response.data.token);
        return response.data.token;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear invalid token
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      throw error;
    }
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Password changed successfully');
      }
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update profile
   */
  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await api.put('/auth/profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Update stored user data
        localStorage.setItem('admin_user', JSON.stringify(response.data.user));
        toast.success('Profile updated successfully');
      }
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default authService;
