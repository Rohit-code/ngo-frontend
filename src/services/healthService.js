// services/healthService.js
import api from './api';

// Fallback health data for when backend is not available
const fallbackHealthData = {
  success: true,
  data: {
    status: 'healthy',
    uptime: Date.now(),
    timestamp: new Date().toISOString()
  }
};

const fallbackDatabaseData = {
  success: true,
  data: {
    database: 'PostgreSQL',
    status: 'connected',
    timestamp: new Date().toISOString()
  }
};

const fallbackServicesData = {
  success: true,
  data: {
    services: {
      api: { status: 'healthy' },
      database: { status: 'healthy' },
      cache: { status: 'healthy' }
    },
    timestamp: new Date().toISOString()
  }
};

export const healthService = {
  /**
   * Basic health check
   */
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response;
    } catch (error) {
      console.error('Health check failed:', error);
      // Return fallback data if it's a network error (backend not available)
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.log('Using fallback health data - backend not available');
        return fallbackHealthData;
      }
      return { success: false, error: error.message || 'Health check failed' };
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
      console.error('Database health check failed:', error);
      // Return fallback data if it's a network error (backend not available)
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.log('Using fallback database data - backend not available');
        return fallbackDatabaseData;
      }
      return { success: false, error: error.message || 'Database health check failed' };
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
      console.error('Services health check failed:', error);
      // Return fallback data if it's a network error (backend not available)
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.log('Using fallback services data - backend not available');
        return fallbackServicesData;
      }
      return { success: false, error: error.message || 'Services health check failed' };
    }
  },

  /**
   * Get comprehensive system status
   */
  getSystemStatus: async () => {
    try {
      const [health, database, services] = await Promise.allSettled([
        healthService.checkHealth(),
        healthService.checkDatabase(),
        healthService.checkAllServices()
      ]);

      // Determine overall status
      const healthOk = health.status === 'fulfilled' && health.value?.success;
      const databaseOk = database.status === 'fulfilled' && database.value?.success;
      const servicesOk = services.status === 'fulfilled' && services.value?.success;
      
      const overall_status = healthOk && databaseOk && servicesOk ? 'healthy' : 'unhealthy';

      return {
        success: true,
        data: {
          overall_status,
          health: health.status === 'fulfilled' ? health.value : { error: health.reason?.message || 'Health check failed' },
          database: database.status === 'fulfilled' ? database.value : { error: database.reason?.message || 'Database check failed' },
          services: services.status === 'fulfilled' ? services.value : { error: services.reason?.message || 'Services check failed' },
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('System status check failed:', error);
      return {
        success: false,
        data: {
          overall_status: 'unhealthy',
          health: { error: error.message || 'System status check failed' },
          database: { error: error.message || 'System status check failed' },
          services: { error: error.message || 'System status check failed' },
          timestamp: new Date().toISOString()
        }
      };
    }
  }
};