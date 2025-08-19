// hooks/useHealthMonitoring.js - Health monitoring hook
import { useState, useEffect, useCallback, useRef } from 'react';
import { healthService } from '../services/healthService';

export const useHealthMonitoring = (intervalMs = 30000) => {
  const [healthStatus, setHealthStatus] = useState({
    overall_status: 'unknown',
    health: null,
    database: null,
    services: null,
    timestamp: null,
    lastCheck: null,
    isChecking: false,
    error: null,
    backendAvailable: true
  });
  
  const [isMonitoring, setIsMonitoring] = useState(false);
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Check health status
  const checkHealthStatus = useCallback(async () => {
    if (!mountedRef.current) return;
    
    try {
      setHealthStatus(prev => ({ ...prev, isChecking: true, error: null }));
      
      // Check if healthService is available
      if (!healthService || typeof healthService.getSystemStatus !== 'function') {
        throw new Error('Health service is not available');
      }
      
      const response = await healthService.getSystemStatus();
      
      if (!mountedRef.current) return;
      
      if (response && response.success) {
        setHealthStatus(prev => ({
          ...prev,
          ...response.data,
          lastCheck: new Date(),
          isChecking: false,
          error: null,
          backendAvailable: true
        }));
      } else {
        setHealthStatus(prev => ({
          ...prev,
          overall_status: 'unhealthy',
          error: response?.message || 'Health check failed',
          lastCheck: new Date(),
          isChecking: false,
          backendAvailable: false
        }));
      }
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('Health check error:', error);
      setHealthStatus(prev => ({
        ...prev,
        overall_status: 'unhealthy',
        error: error.message || 'Health check failed',
        lastCheck: new Date(),
        isChecking: false,
        backendAvailable: false
      }));
    }
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setIsMonitoring(true);
    
    // Initial check
    checkHealthStatus();
    
    // Set up interval only if backend is available
    intervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        checkHealthStatus();
      }
    }, intervalMs);
  }, [checkHealthStatus, intervalMs]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Force check
  const forceCheck = useCallback(() => {
    checkHealthStatus();
  }, [checkHealthStatus]);

  // Auto-start monitoring on mount
  useEffect(() => {
    startMonitoring();
    return () => stopMonitoring();
  }, [startMonitoring, stopMonitoring]);

  // Update interval
  useEffect(() => {
    if (isMonitoring) {
      stopMonitoring();
      startMonitoring();
    }
  }, [intervalMs, isMonitoring, startMonitoring, stopMonitoring]);

  return {
    healthStatus,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    forceCheck,
    checkHealthStatus,
    backendAvailable: healthStatus.backendAvailable
  };
};