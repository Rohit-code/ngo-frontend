import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';

// Full page loading component
export const PageLoading = () => {
  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity }
          }}
          className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-4 shadow-warm"
        >
          <Heart className="h-8 w-8 text-white" />
        </motion.div>
        <h3 className="text-lg font-semibold text-soft-900 mb-2">Loading...</h3>
        <p className="text-soft-600">Please wait while we load the content</p>
      </motion.div>
    </div>
  );
};

// Inline loading component
export const InlineLoading = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center space-x-3"
      >
        <Loader2 className="h-6 w-6 text-primary-500 animate-spin" />
        <span className="text-soft-600 font-medium">{message}</span>
      </motion.div>
    </div>
  );
};

// Button loading state
export const ButtonLoading = ({ children, isLoading = false, ...props }) => {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${props.className} relative`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
};

// Card loading skeleton
export const CardSkeleton = () => {
  return (
    <div className="card p-6 animate-pulse">
      <div className="h-48 bg-warm-200 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-warm-200 rounded w-3/4"></div>
        <div className="h-4 bg-warm-200 rounded w-1/2"></div>
        <div className="h-4 bg-warm-200 rounded w-5/6"></div>
      </div>
    </div>
  );
};

// List loading skeleton
export const ListSkeleton = ({ items = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-gentle animate-pulse">
          <div className="w-16 h-16 bg-warm-200 rounded-full flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-warm-200 rounded w-3/4"></div>
            <div className="h-3 bg-warm-200 rounded w-1/2"></div>
          </div>
          <div className="w-20 h-8 bg-warm-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

// Stats loading skeleton
export const StatsLoading = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="card p-6 text-center animate-pulse">
          <div className="w-12 h-12 bg-warm-200 rounded-full mx-auto mb-3"></div>
          <div className="h-6 bg-warm-200 rounded w-16 mx-auto mb-2"></div>
          <div className="h-4 bg-warm-200 rounded w-20 mx-auto"></div>
        </div>
      ))}
    </div>
  );
};

export default InlineLoading;