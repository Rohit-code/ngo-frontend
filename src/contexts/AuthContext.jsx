import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const clearAuthState = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check if user is already logged in
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        
        // Set user immediately to prevent flickering
        setUser(currentUser);
        setIsAuthenticated(true);
        
        // Skip server verification for now to prevent bouncing
        // Token verification will happen on first API call
        console.log('User authenticated from localStorage');
      } else {
        // No token found, ensure clean state
        clearAuthState();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearAuthState();
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  }, [clearAuthState]);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (username, password) => {
    try {
      setLoading(true);
      const response = await authService.login(username, password);
      
      if (response.success) {
        const { user: userData, token } = response.data;
        
        // Store auth data
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        
        // Update state
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthState();
      setLoading(false);
    }
  }, [clearAuthState]);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('admin_user', JSON.stringify(userData));
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const verification = await authService.verifyToken();
      if (verification.valid) {
        setUser(verification.user);
        setIsAuthenticated(true);
        return true;
      } else {
        clearAuthState();
        return false;
      }
    } catch (error) {
      console.error('Auth refresh error:', error);
      clearAuthState();
      return false;
    }
  }, [clearAuthState]);

  const value = useMemo(() => ({
    user,
    loading: loading || !authChecked,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshAuth,
    clearAuthState
  }), [user, loading, authChecked, isAuthenticated, login, logout, updateUser, refreshAuth, clearAuthState]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
