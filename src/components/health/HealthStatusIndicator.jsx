import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Activity,
  Database,
  Server
} from 'lucide-react';
import { useHealthMonitoring } from '../../hooks/useHealthMonitoring';
import { formatCurrency, calculateProgress, formatDate, getDaysRemaining, getCampaignStatus, getImpactMessage} from '../../utils/helpers';

const HealthStatusIndicator = ({ 
  compact = false, 
  showDetails = false,
  intervalMs = 30000 
}) => {
  const { 
    healthStatus, 
    isMonitoring, 
    startMonitoring, 
    stopMonitoring, 
    forceCheck 
  } = useHealthMonitoring(intervalMs);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'checking':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'unhealthy':
        return 'text-red-600 bg-red-100';
      case 'checking':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getServiceStatus = (service) => {
    if (!service) return 'unknown';
    if (service.error) return 'unhealthy';
    return service.data?.status || 'healthy';
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-2"
      >
        {getStatusIcon(healthStatus.overall_status)}
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(healthStatus.overall_status)}`}>
          API {healthStatus.overall_status}
        </span>
        
        <button
          onClick={forceCheck}
          disabled={healthStatus.isChecking}
          className="p-1 hover:bg-soft-100 rounded"
        >
          <RefreshCw className={`h-3 w-3 text-soft-500 ${healthStatus.isChecking ? 'animate-spin' : ''}`} />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-soft-900 flex items-center">
          <Activity className="h-5 w-5 text-primary-500 mr-2" />
          System Health
        </h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={`btn-secondary text-xs px-3 py-1 ${isMonitoring ? 'bg-green-100 text-green-700' : ''}`}
          >
            {isMonitoring ? 'Monitoring' : 'Start Monitor'}
          </button>
          
          <button
            onClick={forceCheck}
            disabled={healthStatus.isChecking}
            className="btn-secondary p-2"
          >
            <RefreshCw className={`h-4 w-4 ${healthStatus.isChecking ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overall Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-soft-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {getStatusIcon(healthStatus.overall_status)}
            <div>
              <span className="font-semibold text-soft-900">Overall Status</span>
              <div className="text-sm text-soft-600">
                {healthStatus.lastCheck 
                  ? `Last checked: ${formatDate(healthStatus.lastCheck, 'HH:mm:ss')}`
                  : 'Never checked'
                }
              </div>
            </div>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(healthStatus.overall_status)}`}>
            {healthStatus.overall_status}
          </span>
        </div>

        {healthStatus.error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-700 text-sm">{healthStatus.error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Service Details */}
      {showDetails && (
        <div className="space-y-4">
          <h4 className="font-medium text-soft-900">Service Details</h4>
          
          {/* Server Health */}
          <div className="flex items-center justify-between p-3 bg-white border border-soft-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Server className="h-4 w-4 text-soft-400" />
              <div>
                <span className="font-medium text-soft-900">Server</span>
                <div className="text-xs text-soft-600">
                  {healthStatus.health?.data?.uptime 
                    ? `Uptime: ${Math.round(healthStatus.health.data.uptime / 3600)}h`
                    : 'No data'
                  }
                </div>
              </div>
            </div>
            {getStatusIcon(getServiceStatus(healthStatus.health))}
          </div>

          {/* Database Health */}
          <div className="flex items-center justify-between p-3 bg-white border border-soft-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Database className="h-4 w-4 text-soft-400" />
              <div>
                <span className="font-medium text-soft-900">Database</span>
                <div className="text-xs text-soft-600">
                  {healthStatus.database?.data?.database || 'PostgreSQL'}
                </div>
              </div>
            </div>
            {getStatusIcon(getServiceStatus(healthStatus.database))}
          </div>

          {/* External Services */}
          {healthStatus.services?.data?.services && (
            <div className="space-y-2">
              {Object.entries(healthStatus.services.data.services).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between p-2 bg-white border border-soft-200 rounded">
                  <span className="text-sm font-medium text-soft-900 capitalize">
                    {service}
                  </span>
                  {getStatusIcon(status.status)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default HealthStatusIndicator;
