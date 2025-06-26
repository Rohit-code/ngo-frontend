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
   * Get system status
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
          overall_status: health.status === 'fulfilled' ? 'healthy' : 'unhealthy',
          health: health.status === 'fulfilled' ? health.value : { error: health.reason },
          database: database.status === 'fulfilled' ? database.value : { error: database.reason },
          services: services.status === 'fulfilled' ? services.value : { error: services.reason },
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check API connectivity
   */
  checkConnectivity: async () => {
    try {
      const startTime = Date.now();
      const response = await this.checkHealth();
      const endTime = Date.now();
      
      return {
        success: true,
        data: {
          status: 'connected',
          response_time: endTime - startTime,
          timestamp: new Date().toISOString(),
          server_info: response.data
        }
      };
    } catch (error) {
      return {
        success: false,
        data: {
          status: 'disconnected',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      };
    }
  }
};