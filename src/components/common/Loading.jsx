// components/common/Loading.jsx - Loading components
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Heart, RefreshCw } from 'lucide-react';

/**
 * Inline Loading Component
 */
export const InlineLoading = ({ 
  message = 'Loading...', 
  size = 'sm',
  variant = 'default',
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const getIcon = () => {
    switch (variant) {
      case 'heart':
        return <Heart className={`${sizeClasses[size]} animate-pulse text-primary-500`} />;
      case 'refresh':
        return <RefreshCw className={`${sizeClasses[size]} animate-spin text-primary-500`} />;
      default:
        return <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-500`} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center justify-center space-x-2 ${className}`}
    >
      {getIcon()}
      {message && (
        <span className={`${textSizeClasses[size]} text-soft-600 font-medium`}>
          {message}
        </span>
      )}
    </motion.div>
  );
};

/**
 * Full Page Loading Component
 */
export const PageLoading = ({ 
  message = 'Loading...', 
  subtitle = null,
  variant = 'default' 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-6">
          {variant === 'heart' ? (
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="w-16 h-16 mx-auto"
            >
              <Heart className="w-full h-full text-primary-500 fill-current" />
            </motion.div>
          ) : (
            <Loader2 className="h-16 w-16 text-primary-500 animate-spin mx-auto" />
          )}
        </div>
        
        <h2 className="text-xl font-semibold text-soft-900 mb-2">{message}</h2>
        
        {subtitle && (
          <p className="text-soft-600 text-sm max-w-md mx-auto">{subtitle}</p>
        )}
      </motion.div>
    </div>
  );
};

/**
 * Card Loading Skeleton
 */
export const CardSkeleton = ({ className = '', rows = 3 }) => {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-soft-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-soft-200 rounded mb-2"></div>
            <div className="h-3 bg-soft-200 rounded w-2/3"></div>
          </div>
        </div>
        
        {/* Content rows */}
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="mb-3">
            <div className="h-3 bg-soft-200 rounded"></div>
          </div>
        ))}
        
        {/* Footer */}
        <div className="flex justify-between items-center mt-6">
          <div className="h-8 bg-soft-200 rounded w-20"></div>
          <div className="h-8 bg-soft-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Button Loading Component
 */
export const ButtonLoading = ({ 
  children,
  loading = false,
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-soft-200 text-soft-900 hover:bg-soft-300 focus:ring-soft-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </button>
  );
};

/**
 * List Loading Component
 */
export const ListLoading = ({ items = 5, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-soft-200">
            <div className="w-10 h-10 bg-soft-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-soft-200 rounded mb-2"></div>
              <div className="h-3 bg-soft-200 rounded w-3/4"></div>
            </div>
            <div className="w-16 h-8 bg-soft-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Table Loading Component
 */
export const TableLoading = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="overflow-hidden border border-soft-200 rounded-lg">
        {/* Header */}
        <div className="bg-soft-50 border-b border-soft-200">
          <div className="flex">
            {Array.from({ length: columns }).map((_, index) => (
              <div key={`header-${index}`} className="flex-1 p-4">
                <div className="h-4 bg-soft-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="border-b border-soft-200 last:border-b-0">
            <div className="flex">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1 p-4">
                  <div className="h-3 bg-soft-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Progress Loading Component
 */
export const ProgressLoading = ({ 
  progress = 0, 
  message = 'Loading...', 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 bg-white rounded-lg border border-soft-200 ${className}`}
    >
      <div className="text-center">
        <div className="mb-4">
          <Loader2 className="h-8 w-8 text-primary-500 animate-spin mx-auto" />
        </div>
        
        <h3 className="font-medium text-soft-900 mb-2">{message}</h3>
        
        <div className="w-full bg-soft-200 rounded-full h-2">
          <motion.div
            className="bg-primary-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="text-sm text-soft-600 mt-2">
          {progress}% complete
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Spinner only component
 */
export const Spinner = ({ 
  size = 'md',
  color = 'primary',
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  };

  const colorClasses = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    accent: 'text-accent-500',
    gray: 'text-soft-400',
    white: 'text-white'
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`} />
  );
};

export default {
  InlineLoading,
  PageLoading,
  CardSkeleton,
  ButtonLoading,
  ListLoading,
  TableLoading,
  ProgressLoading,
  Spinner
};