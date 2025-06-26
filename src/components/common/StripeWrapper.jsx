import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeWrapper = ({ children, options = {} }) => {
  const defaultOptions = {
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#14b8a6',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
        // Mobile optimizations
        spacingGridRow: '16px',
        spacingGridColumn: '16px'
      },
      rules: {
        '.Input': {
          padding: '12px',
          fontSize: '16px', // Prevents zoom on iOS
        },
        '.Input--focus': {
          boxShadow: '0 0 0 2px rgba(20, 184, 166, 0.5)',
        },
        '.Label': {
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px'
        }
      }
    },
    ...options
  };

  return (
    <Elements stripe={stripePromise} options={defaultOptions}>
      {children}
    </Elements>
  );
};

export default StripeWrapper;