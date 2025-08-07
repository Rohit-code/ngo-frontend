// components/payment/EnhancedPaymentForm.jsx - COMPLETE PAYMENT SOLUTION
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CardNumberElement,
  CardExpiryElement, 
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import {
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  FileText,
  Loader2
} from 'lucide-react';
import { enhancedPaymentService } from '../../services/enhancedPaymentService';
import { invoiceService } from '../../services/invoiceService';
import toast from 'react-hot-toast';

const EnhancedPaymentForm = ({ 
  donation, 
  isInternational, 
  countryConfig, 
  formData, 
  onSuccess, 
  onError 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  // Payment state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('input'); // input, processing, success, error
  
  // Card validation states
  const [cardValidation, setCardValidation] = useState({
    number: { complete: false, error: null },
    expiry: { complete: false, error: null },
    cvc: { complete: false, error: null }
  });
  
  // UI states
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Payment result
  const [paymentResult, setPaymentResult] = useState(null);
  const [invoiceStatus, setInvoiceStatus] = useState('pending');

  // Card element options with enhanced styling
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1f2937',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#9ca3af',
        },
        iconColor: '#6b7280',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
      complete: {
        color: '#059669',
        iconColor: '#059669',
      },
    },
    hidePostalCode: true, // We collect this separately
  };

  // Real-time card validation
  const handleCardChange = (elementType) => (event) => {
    setCardValidation(prev => ({
      ...prev,
      [elementType]: {
        complete: event.complete,
        error: event.error?.message || null
      }
    }));

    // Show card details when user starts typing
    if (!showCardDetails && event.complete) {
      setShowCardDetails(true);
    }
  };

  // Check if all card fields are valid
  const isCardValid = () => {
    return (
      cardValidation.number.complete &&
      cardValidation.expiry.complete &&
      cardValidation.cvc.complete &&
      !cardValidation.number.error &&
      !cardValidation.expiry.error &&
      !cardValidation.cvc.error
    );
  };

  // Enhanced payment processing
  const handlePayment = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!stripe || !elements) {
      toast.error('Payment system not loaded. Please refresh the page.');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to terms and conditions');
      return;
    }

    if (!isCardValid()) {
      toast.error('Please enter valid card details');
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      toast.error('Card details not found. Please refresh and try again.');
      return;
    }

    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Step 1: Validate card details with Stripe
      const { error: cardError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: formData.full_name,
          email: formData.email,
          phone: formData.mobile,
          address: {
            line1: formData.address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.pincode,
            country: formData.country
          }
        }
      });

      if (cardError) {
        throw new Error(cardError.message);
      }

      // Step 2: Process payment with backend
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

      // Step 3: Confirm payment with Stripe
      const confirmationResult = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: formData.full_name,
            email: formData.email,
            phone: formData.mobile,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.pincode,
              country: formData.country
            }
          }
        }
      });

      if (confirmationResult.error) {
        throw new Error(confirmationResult.error.message);
      }

      const { paymentIntent } = confirmationResult;

      // Step 4: CRITICAL - Confirm with backend and get invoice
      if (paymentIntent.status === 'succeeded') {
        const confirmResponse = await donationService.confirmPayment(paymentIntent.id);
        
        if (!confirmResponse.success) {
          throw new Error('Payment succeeded but confirmation failed. Please contact support.');
        }

        // Step 5: Handle invoice generation and email
        await handleInvoiceGeneration(confirmResponse.data.donation);

        setPaymentResult({
          success: true,
          paymentIntent,
          donation: confirmResponse.data.donation,
          invoice: confirmResponse.data.invoice
        });

        setPaymentStep('success');
        toast.success('Payment completed successfully!');
        
        // Call success callback
        onSuccess({
          paymentIntent,
          donation: confirmResponse.data.donation,
          invoice: confirmResponse.data.invoice
        });

      } else {
        throw new Error(`Payment status: ${paymentIntent.status}`);
      }

    } catch (error) {
      console.error('Payment processing error:', error);
      setPaymentStep('error');
      toast.error(error.message || 'Payment failed. Please try again.');
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle invoice generation and email sending
  const handleInvoiceGeneration = async (donationData) => {
    try {
      setInvoiceStatus('generating');
      
      // Invoice should be auto-generated by backend on payment confirmation
      // If not, we can trigger manual generation
      if (!donationData.invoice_id) {
        const invoiceResponse = await invoiceService.generateInvoice(donationData.id);
        if (invoiceResponse.success) {
          donationData.invoice_id = invoiceResponse.data.invoice.id;
        }
      }

      // Send invoice email
      if (donationData.invoice_id) {
        setInvoiceStatus('sending');
        await invoiceService.resendInvoiceEmail(donationData.invoice_id);
        setInvoiceStatus('sent');
      } else {
        setInvoiceStatus('error');
      }
      
    } catch (error) {
      console.error('Invoice handling error:', error);
      setInvoiceStatus('error');
      // Don't fail the payment for invoice issues
      toast.error('Payment successful, but invoice email may be delayed. Please contact support if needed.');
    }
  };

  // Get card brand for display
  const getCardBrand = () => {
    // This would be enhanced with actual card brand detection
    return 'card';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8">
        <AnimatePresence mode="wait">
          {/* Payment Input Form */}
          {paymentStep === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-2xl font-bold text-soft-900 mb-6 flex items-center">
                <CreditCard className="mr-3 h-6 w-6 text-primary-600" />
                Complete Your Payment
              </h3>

              {/* Payment Summary */}
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-6 rounded-xl border border-primary-200 mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-primary-800">
                      Total Amount
                    </h4>
                    <p className="text-sm text-primary-600">
                      {donation.donation_type === 'monthly' ? 'Monthly recurring' : 'One-time payment'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-700">
                      {countryConfig?.currency_symbol}{donation.amount}
                    </div>
                    <div className="text-sm text-primary-600">
                      {countryConfig?.currency}
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Indicators */}
              <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-green-800">256-bit SSL</div>
                  <div className="text-xs text-green-600">Encrypted</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Lock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-blue-800">PCI Compliant</div>
                  <div className="text-xs text-blue-600">Secure</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-purple-800">Tax Receipt</div>
                  <div className="text-xs text-purple-600">Instant Email</div>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePayment} className="space-y-6">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-soft-700 mb-2">
                    Card Number *
                  </label>
                  <div className={`relative p-4 border rounded-xl transition-all duration-200 ${
                    cardValidation.number.error 
                      ? 'border-red-500 bg-red-50' 
                      : cardValidation.number.complete 
                        ? 'border-green-500 bg-green-50'
                        : 'border-soft-300 bg-white hover:border-soft-400'
                  }`}>
                    <CardNumberElement 
                      options={cardElementOptions}
                      onChange={handleCardChange('number')}
                    />
                    
                    {/* Validation Icons */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {cardValidation.number.complete && !cardValidation.number.error && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {cardValidation.number.error && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  
                  {cardValidation.number.error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center mt-2 text-red-600"
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">{cardValidation.number.error}</span>
                    </motion.div>
                  )}
                  
                  {cardValidation.number.complete && !cardValidation.number.error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center mt-2 text-green-600"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Valid card number</span>
                    </motion.div>
                  )}
                </div>

                {/* Expiry and CVC */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Card Expiry */}
                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Expiry Date *
                    </label>
                    <div className={`relative p-4 border rounded-xl transition-all duration-200 ${
                      cardValidation.expiry.error 
                        ? 'border-red-500 bg-red-50' 
                        : cardValidation.expiry.complete 
                          ? 'border-green-500 bg-green-50'
                          : 'border-soft-300 bg-white hover:border-soft-400'
                    }`}>
                      <CardExpiryElement 
                        options={cardElementOptions}
                        onChange={handleCardChange('expiry')}
                      />
                      
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        {cardValidation.expiry.complete && !cardValidation.expiry.error && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {cardValidation.expiry.error && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    
                    {cardValidation.expiry.error && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center mt-1 text-red-600"
                      >
                        <span className="text-xs">{cardValidation.expiry.error}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Card CVC */}
                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Security Code *
                    </label>
                    <div className={`relative p-4 border rounded-xl transition-all duration-200 ${
                      cardValidation.cvc.error 
                        ? 'border-red-500 bg-red-50' 
                        : cardValidation.cvc.complete 
                          ? 'border-green-500 bg-green-50'
                          : 'border-soft-300 bg-white hover:border-soft-400'
                    }`}>
                      <CardCvcElement 
                        options={cardElementOptions}
                        onChange={handleCardChange('cvc')}
                      />
                      
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        {cardValidation.cvc.complete && !cardValidation.cvc.error && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {cardValidation.cvc.error && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    
                    {cardValidation.cvc.error && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center mt-1 text-red-600"
                      >
                        <span className="text-xs">{cardValidation.cvc.error}</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Card Validation Summary */}
                <AnimatePresence>
                  {(cardValidation.number.complete || cardValidation.expiry.complete || cardValidation.cvc.complete) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-soft-50 rounded-xl"
                    >
                      <h4 className="font-medium text-soft-900 mb-2">Card Validation Status</h4>
                      <div className="space-y-1 text-sm">
                        <div className={`flex items-center ${
                          cardValidation.number.complete && !cardValidation.number.error 
                            ? 'text-green-600' 
                            : 'text-soft-500'
                        }`}>
                          <CheckCircle className={`h-4 w-4 mr-2 ${
                            cardValidation.number.complete && !cardValidation.number.error 
                              ? 'text-green-500' 
                              : 'text-soft-400'
                          }`} />
                          Card number {cardValidation.number.complete && !cardValidation.number.error ? 'valid' : 'required'}
                        </div>
                        <div className={`flex items-center ${
                          cardValidation.expiry.complete && !cardValidation.expiry.error 
                            ? 'text-green-600' 
                            : 'text-soft-500'
                        }`}>
                          <CheckCircle className={`h-4 w-4 mr-2 ${
                            cardValidation.expiry.complete && !cardValidation.expiry.error 
                              ? 'text-green-500' 
                              : 'text-soft-400'
                          }`} />
                          Expiry date {cardValidation.expiry.complete && !cardValidation.expiry.error ? 'valid' : 'required'}
                        </div>
                        <div className={`flex items-center ${
                          cardValidation.cvc.complete && !cardValidation.cvc.error 
                            ? 'text-green-600' 
                            : 'text-soft-500'
                        }`}>
                          <CheckCircle className={`h-4 w-4 mr-2 ${
                            cardValidation.cvc.complete && !cardValidation.cvc.error 
                              ? 'text-green-500' 
                              : 'text-soft-400'
                          }`} />
                          Security code {cardValidation.cvc.complete && !cardValidation.cvc.error ? 'valid' : 'required'}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-soft-300 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-soft-700">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" className="text-primary-600 hover:text-primary-700 underline">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" className="text-primary-600 hover:text-primary-700 underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!stripe || isProcessing || !isCardValid() || !agreedToTerms}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center ${
                    !stripe || isProcessing || !isCardValid() || !agreedToTerms
                      ? 'bg-soft-300 text-soft-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:from-primary-700 hover:to-accent-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-3" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-3 h-5 w-5" />
                      Complete Donation of {countryConfig?.currency_symbol}{donation.amount}
                    </>
                  )}
                </button>

                {/* Payment Method Info */}
                <div className="text-center text-sm text-soft-600">
                  <div className="flex items-center justify-center space-x-4">
                    <span>Powered by Stripe</span>
                    <div className="flex space-x-2">
                      <img src="/visa-logo.svg" alt="Visa" className="h-6" />
                      <img src="/mastercard-logo.svg" alt="Mastercard" className="h-6" />
                      <img src="/amex-logo.svg" alt="American Express" className="h-6" />
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {/* Processing State */}
          {paymentStep === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-soft-900 mb-2">Processing Payment</h3>
              <p className="text-soft-600 mb-4">Please don't close this window...</p>
              
              <div className="space-y-2 text-sm text-soft-600">
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Card details validated
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Payment processing
                </div>
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-primary-500 mr-2" />
                  Confirming payment
                </div>
                {invoiceStatus === 'generating' && (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-primary-500 mr-2" />
                    Generating invoice
                  </div>
                )}
                {invoiceStatus === 'sending' && (
                  <div className="flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary-500 mr-2" />
                    Sending receipt email
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {paymentStep === 'success' && paymentResult && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-soft-900 mb-2">Payment Successful!</h3>
              <p className="text-lg text-soft-600 mb-8">
                Thank you for your generous donation of {countryConfig?.currency_symbol}{donation.amount}
              </p>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-800">Payment ID:</span>
                    <div className="text-green-700 font-mono">{paymentResult.paymentIntent.id}</div>
                  </div>
                  <div>
                    <span className="font-medium text-green-800">Donation ID:</span>
                    <div className="text-green-700 font-mono">{paymentResult.donation.id}</div>
                  </div>
                  <div>
                    <span className="font-medium text-green-800">Amount:</span>
                    <div className="text-green-700">{countryConfig?.currency_symbol}{donation.amount}</div>
                  </div>
                  <div>
                    <span className="font-medium text-green-800">Status:</span>
                    <div className="text-green-700">Completed</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className={`flex items-center justify-center p-3 rounded-lg ${
                  invoiceStatus === 'sent' 
                    ? 'bg-green-50 text-green-700' 
                    : invoiceStatus === 'error'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-blue-50 text-blue-700'
                }`}>
                  {invoiceStatus === 'sent' && <CheckCircle className="h-5 w-5 mr-2" />}
                  {invoiceStatus === 'error' && <AlertCircle className="h-5 w-5 mr-2" />}
                  {invoiceStatus === 'generating' && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                  <Mail className="h-5 w-5 mr-2" />
                  
                  {invoiceStatus === 'sent' && 'Receipt email sent successfully!'}
                  {invoiceStatus === 'error' && 'Receipt email pending - will be sent shortly'}
                  {invoiceStatus === 'generating' && 'Generating receipt...'}
                  {invoiceStatus === 'sending' && 'Sending receipt email...'}
                </div>

                {countryConfig?.tax_benefit && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center text-blue-800">
                      <FileText className="h-5 w-5 mr-2" />
                      <span className="font-medium">Tax Benefit Available</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Your donation is eligible for {countryConfig.tax_section} tax exemption. 
                      Receipt will be emailed to {formData.email}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {paymentStep === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-soft-900 mb-2">Payment Failed</h3>
              <p className="text-lg text-soft-600 mb-8">
                We couldn't process your payment. Please try again.
              </p>

              <button
                onClick={() => {
                  setPaymentStep('input');
                  setPaymentResult(null);
                }}
                className="btn-primary"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedPaymentForm;