import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  // Prevent bouncing by adding a small delay
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsInitialized(true);
      }, 100); // Small delay to prevent rapid state changes
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Show loading spinner while checking authentication
  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 via-primary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-soft-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If route requires authentication but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route doesn't require authentication but user is authenticated (like login page)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/admin/events" replace />;
  }

  return children;
};

export default ProtectedRoute;
