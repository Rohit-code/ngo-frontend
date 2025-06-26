import { loadStripe } from '@stripe/stripe-js';
import { donationService } from './donationService';
import toast from 'react-hot-toast';

// Initialize Stripe
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export const paymentService = {
  /**
   * Process donation payment with Stripe
   */
  processDonationPayment: async (donation, isInternational = false) => {
    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Create payment intent based on donation type
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

      const { client_secret, donation_id } = paymentResponse.data;

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: {
            // This would be populated by Stripe Elements
          },
          billing_details: {
            name: donation.donor?.full_name,
            email: donation.donor?.email,
            address: {
              line1: donation.donor?.address,
              city: donation.donor?.city,
              state: donation.donor?.state,
              postal_code: donation.donor?.pincode,
              country: donation.donor?.country_code || 'IN'
            }
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment with backend
        const confirmResponse = await donationService.confirmPayment(paymentIntent.id);
        return {
          success: true,
          paymentIntent,
          donation: confirmResponse.data
        };
      }

      throw new Error('Payment was not successful');
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  },

  /**
   * Setup Stripe Elements for card input
   */
  createStripeElements: async (clientSecret, options = {}) => {
    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const elements = stripe.elements({
        clientSecret,
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
  },

  /**
   * Handle recurring payment setup
   */
  setupRecurringPayment: async (donationData) => {
    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Create recurring donation
      const response = await donationService.createRecurringDonation(donationData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to setup recurring donation');
      }

      const { client_secret, subscription_id } = response.data;

      // Confirm setup intent for subscription
      const { error, setupIntent } = await stripe.confirmCardSetup(client_secret, {
        payment_method: {
          card: {
            // This would be populated by Stripe Elements
          },
          billing_details: {
            name: donationData.donor?.full_name,
            email: donationData.donor?.email,
            address: {
              line1: donationData.donor?.address,
              city: donationData.donor?.city,
              state: donationData.donor?.state,
              postal_code: donationData.donor?.pincode,
              country: donationData.donor?.country_code || 'IN'
            }
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        setupIntent,
        subscription_id
      };
    } catch (error) {
      console.error('Recurring payment setup error:', error);
      throw error;
    }
  },

  /**
   * Format currency for display
   */
  formatCurrency: (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },

  /**
   * Get currency symbol
   */
  getCurrencySymbol: (currency = 'INR') => {
    const symbols = {
      INR: '₹',
      USD: '$',
      GBP: '£',
      EUR: '€',
      CAD: 'C$',
      AUD: 'A$',
      SGD: 'S$'
    };
    return symbols[currency] || currency;
  },

  /**
   * Convert amount based on exchange rate
   */
  convertCurrency: async (amount, fromCurrency, toCurrency) => {
    // This would typically call an exchange rate API
    // For now, return the same amount as backend handles conversion
    return amount;
  }
};