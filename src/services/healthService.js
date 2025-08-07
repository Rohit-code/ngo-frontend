// services/healthService.js
import api from './api';

export const healthService = {
  /**
   * Basic health check
   */
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Database health check
   */
  checkDatabase: async () => {
    try {
      const response = await api.get('/health/database');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * All services health check
   */
  checkAllServices: async () => {
    try {
      const response = await api.get('/health/services');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get comprehensive system status
   */
  getSystemStatus: async () => {
    try {
      const [health, database, services] = await Promise.allSettled([
        this.checkHealth(),
        this.checkDatabase(),
        this.checkAllServices()
      ]);

      return {
        success: true,
        data: {
          overall_status: health.status === 'fulfilled' && health.value.success ? 'healthy' : 'unhealthy',
          health: health.status === 'fulfilled' ? health.value : { error: health.reason?.message },
          database: database.status === 'fulfilled' ? database.value : { error: database.reason?.message },
          services: services.status === 'fulfilled' ? services.value : { error: services.reason?.message },
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      throw error;
    }
  }
};