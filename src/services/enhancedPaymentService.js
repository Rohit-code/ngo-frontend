// services/enhancedPaymentService.js - Enhanced payment processing with proper confirmation
import { loadStripe } from '@stripe/stripe-js';
import { donationService } from './donationService';
import toast from 'react-hot-toast';

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export const enhancedPaymentService = {
  /**
   * Process donation payment with proper confirmation flow
   */
  processDonationPayment: async (donation, cardElement, billingDetails, isInternational = false) => {
    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to load. Please refresh and try again.');
      }

      // Step 1: Create payment intent
      const paymentResponse = isInternational 
        ? await donationService.processInternationalPayment(donation.id, {
            payment_method: 'card',
            currency: donation.currency?.toLowerCase() || 'usd'
          })
        : await donationService.processPayment(donation.id, {
            payment_method: 'card'
          });

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message || 'Failed to create payment intent');
      }

      const { client_secret, publishable_key } = paymentResponse.data;

      // Step 2: Confirm payment with Stripe
      const confirmationResult = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingDetails.name,
            email: billingDetails.email,
            phone: billingDetails.phone,
            address: {
              line1: billingDetails.address,
              city: billingDetails.city,
              state: billingDetails.state,
              postal_code: billingDetails.postal_code,
              country: billingDetails.country || 'IN'
            }
          }
        }
      });

      if (confirmationResult.error) {
        // Handle specific Stripe errors
        const errorMessage = this.handleStripeError(confirmationResult.error);
        throw new Error(errorMessage);
      }

      const { paymentIntent } = confirmationResult;

      // Step 3: Confirm with backend (CRITICAL STEP that was missing)
      if (paymentIntent.status === 'succeeded') {
        const confirmResponse = await donationService.confirmPayment(paymentIntent.id);
        
        if (!confirmResponse.success) {
          throw new Error('Payment succeeded but confirmation failed. Please contact support.');
        }

        // Payment fully confirmed
        return {
          success: true,
          paymentIntent,
          donation: confirmResponse.data.donation,
          receipt: confirmResponse.data.receipt_number
        };
      }

      // Handle other payment statuses
      if (paymentIntent.status === 'requires_action') {
        throw new Error('Additional authentication required. Please try again.');
      }

      throw new Error(`Payment status: ${paymentIntent.status}. Please contact support if this persists.`);

    } catch (error) {
      console.error('Enhanced payment processing error:', error);
      
      // Log error for monitoring
      this.logPaymentError(error, donation);
      
      throw error;
    }
  },

  /**
   * Handle recurring payment setup with proper error handling
   */
  setupRecurringPayment: async (donationData, cardElement, billingDetails) => {
    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to load. Please refresh and try again.');
      }

      // Create recurring donation
      const response = await donationService.createRecurringDonation(donationData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to setup recurring donation');
      }

      const { client_secret, subscription_id } = response.data;

      // Confirm setup intent
      const { error, setupIntent } = await stripe.confirmCardSetup(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingDetails.name,
            email: billingDetails.email,
            phone: billingDetails.phone,
            address: {
              line1: billingDetails.address,
              city: billingDetails.city,
              state: billingDetails.state,
              postal_code: billingDetails.postal_code,
              country: billingDetails.country || 'IN'
            }
          }
        }
      });

      if (error) {
        const errorMessage = this.handleStripeError(error);
        throw new Error(errorMessage);
      }

      return {
        success: true,
        setupIntent,
        subscription_id,
        donation: response.data.donation
      };

    } catch (error) {
      console.error('Recurring payment setup error:', error);
      throw error;
    }
  },

  /**
   * Handle Stripe errors with user-friendly messages
   */
  handleStripeError: (error) => {
    switch (error.code) {
      case 'card_declined':
        return 'Your card was declined. Please try a different card or contact your bank.';
      case 'insufficient_funds':
        return 'Insufficient funds. Please try a different card or add funds to your account.';
      case 'incorrect_cvc':
        return 'Your card\'s security code is incorrect. Please check and try again.';
      case 'expired_card':
        return 'Your card has expired. Please use a different card.';
      case 'processing_error':
        return 'An error occurred while processing your card. Please try again.';
      case 'incorrect_number':
        return 'Your card number is incorrect. Please check and try again.';
      case 'card_not_supported':
        return 'This card is not supported. Please try a different card.';
      case 'currency_not_supported':
        return 'This currency is not supported for your card. Please try a different card.';
      case 'duplicate_transaction':
        return 'A payment with these details was recently submitted. Please wait a moment before trying again.';
      case 'rate_limit':
        return 'Too many requests. Please wait a moment before trying again.';
      default:
        return error.message || 'Payment failed. Please try again or contact support.';
    }
  },

  /**
   * Validate payment before processing
   */
  validatePaymentData: (donation, billingDetails) => {
    const errors = [];

    // Validate donation
    if (!donation || !donation.id) {
      errors.push('Invalid donation data');
    }

    if (!donation.amount || donation.amount <= 0) {
      errors.push('Invalid donation amount');
    }

    // Validate billing details
    if (!billingDetails.name) {
      errors.push('Cardholder name is required');
    }

    if (!billingDetails.email) {
      errors.push('Email address is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Log payment errors for monitoring
   */
  logPaymentError: (error, donation) => {
    const errorData = {
      error: error.message,
      donation_id: donation?.id,
      amount: donation?.amount,
      currency: donation?.currency,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      url: window.location.href
    };

    // In production, send this to your error tracking service
    console.error('Payment Error Log:', errorData);
    
    // You could also send this to your backend for logging
    // api.post('/logs/payment-error', errorData).catch(() => {});
  },

  /**
   * Retry payment with exponential backoff
   */
  retryPayment: async (paymentFunction, maxRetries = 3, baseDelay = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await paymentFunction();
      } catch (error) {
        // Don't retry for certain error types
        const nonRetryableErrors = [
          'card_declined',
          'insufficient_funds',
          'incorrect_cvc',
          'expired_card',
          'incorrect_number'
        ];

        if (nonRetryableErrors.includes(error.code) || attempt === maxRetries) {
          throw error;
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
};

