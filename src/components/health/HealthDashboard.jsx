import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Clock,
  Settings
} from 'lucide-react';
import { useHealthMonitoring } from '../../hooks/useHealthMonitoring';
import HealthStatusIndicator from './HealthStatusIndicator';
import { formatCurrency, calculateProgress, formatDate, getDaysRemaining, getCampaignStatus, getImpactMessage} from '../../utils/helpers';

const HealthDashboard = () => {
  const [monitoringInterval, setMonitoringInterval] = useState(30000);
  const { healthStatus, isMonitoring, startMonitoring, stopMonitoring, backendAvailable } = 
    useHealthMonitoring(monitoringInterval);

  const getStatusCounts = () => {
    const services = healthStatus.services?.data?.services || {};
    const counts = { healthy: 0, unhealthy: 0, total: 0 };
    
    // Count main services
    ['health', 'database', 'services'].forEach(service => {
      counts.total++;
      if (healthStatus[service] && !healthStatus[service].error) {
        counts.healthy++;
      } else {
        counts.unhealthy++;
      }
    });

    // Count external services
    Object.values(services).forEach(service => {
      counts.total++;
      if (service.status === 'healthy') {
        counts.healthy++;
      } else {
        counts.unhealthy++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();
  const healthPercentage = statusCounts.total > 0 
    ? Math.round((statusCounts.healthy / statusCounts.total) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-warm-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-soft-900">System Health Dashboard</h1>
            <p className="text-soft-600 mt-1">
              Monitor the health and status of all system components
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={monitoringInterval}
              onChange={(e) => setMonitoringInterval(Number(e.target.value))}
              className="form-select text-sm"
            >
              <option value={10000}>Every 10 seconds</option>
              <option value={30000}>Every 30 seconds</option>
              <option value={60000}>Every minute</option>
              <option value={300000}>Every 5 minutes</option>
            </select>
            
            <button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              className={`btn-primary ${isMonitoring ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </button>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 text-center"
          >
            <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
              healthStatus.overall_status === 'healthy' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {healthStatus.overall_status === 'healthy' ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-600" />
              )}
            </div>
            <h3 className="font-semibold text-soft-900">Overall Status</h3>
            <p className={`text-sm mt-1 capitalize font-medium ${
              healthStatus.overall_status === 'healthy' ? 'text-green-600' : 'text-red-600'
            }`}>
              {healthStatus.overall_status}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 text-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-soft-900">Health Score</h3>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {healthPercentage}%
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 text-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-soft-900">Healthy Services</h3>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {statusCounts.healthy}/{statusCounts.total}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 text-center"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-soft-900">Last Check</h3>
            <p className="text-sm text-soft-600 mt-1">
              {healthStatus.lastCheck 
                ? formatDate(healthStatus.lastCheck, 'HH:mm:ss')
                : 'Never'
              }
            </p>
          </motion.div>
        </div>

        {/* Backend Availability Notice */}
        {!backendAvailable && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <h4 className="font-medium text-yellow-800">Backend Server Unavailable</h4>
                <p className="text-sm text-yellow-700">
                  The backend server is not responding. Health monitoring is showing fallback data.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Detailed Health Status */}
        <HealthStatusIndicator showDetails={true} intervalMs={monitoringInterval} />

        {/* Health History Chart could go here */}
        {/* <HealthChart data={healthHistory} /> */}
      </div>
    </div>
  );
};

export default HealthDashboard;