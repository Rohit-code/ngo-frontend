// services/paymentService.js - FIXED VERSION
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

export const paymentService = {
  /**
   * Process donation payment with Stripe - FIXED VERSION
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

      const { client_secret } = paymentResponse.data;

      // Step 2: Confirm payment with Stripe
      const confirmationResult = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement, // This should be the actual card element from Stripe Elements
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

      // Step 3: CRITICAL - Confirm with backend (this was missing in your original code)
      if (paymentIntent.status === 'succeeded') {
        try {
          const confirmResponse = await donationService.confirmPayment(paymentIntent.id);
          
          if (!confirmResponse.success) {
            throw new Error('Payment succeeded but confirmation failed. Please contact support.');
          }

          return {
            success: true,
            paymentIntent,
            donation: confirmResponse.data
          };
        } catch (confirmError) {
          console.error('Backend confirmation failed:', confirmError);
          // Even if backend confirmation fails, payment went through
          // Log this for manual reconciliation
          throw new Error('Payment processed but confirmation pending. Please contact support with payment ID: ' + paymentIntent.id);
        }
      }

      throw new Error('Payment was not successful');
    } catch (error) {
      console.error('Payment processing error:', error);
      // Don't re-throw toast errors to avoid double toasts
      throw error;
    }
  },

  /**
   * Handle Stripe-specific errors
   */
  handleStripeError: (error) => {
    switch (error.code) {
      case 'card_declined':
        return 'Your card was declined. Please try a different payment method.';
      case 'insufficient_funds':
        return 'Insufficient funds. Please try a different card.';
      case 'incorrect_cvc':
        return 'Your card\'s security code is incorrect.';
      case 'expired_card':
        return 'Your card has expired. Please try a different card.';
      case 'processing_error':
        return 'An error occurred while processing your card. Please try again.';
      case 'incorrect_number':
        return 'Your card number is incorrect.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  },

  /**
   * Create Stripe Elements for card input
   */
  createStripeElements: async (options = {}) => {
    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const elements = stripe.elements({
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#14b8a6',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            colorDanger: '#ef4444',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px'
          }
        },
        ...options
      });

      return { stripe, elements };
    } catch (error) {
      console.error('Stripe Elements creation error:', error);
      throw error;
    }
  }
};