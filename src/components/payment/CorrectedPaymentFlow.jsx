// components/payment/CorrectedPaymentFlow.jsx - SAVE DONATION AFTER PAYMENT SUCCESS
import React, { useState } from 'react';
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
  Lock,
  Mail,
  FileText,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const CorrectedPaymentFlow = ({ 
  donationData,  // Form data, NOT saved to DB yet
  countryConfig, 
  onSuccess, 
  onError 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('input');
  const [cardValidation, setCardValidation] = useState({
    number: { complete: false, error: null },
    expiry: { complete: false, error: null },
    cvc: { complete: false, error: null }
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1f2937',
        fontFamily: 'Inter, system-ui, sans-serif',
        '::placeholder': { color: '#9ca3af' },
      },
      invalid: { color: '#ef4444' },
      complete: { color: '#059669' },
    },
  };

  const handleCardChange = (elementType) => (event) => {
    setCardValidation(prev => ({
      ...prev,
      [elementType]: {
        complete: event.complete,
        error: event.error?.message || null
      }
    }));
  };

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

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !isCardValid() || !agreedToTerms) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      const cardNumberElement = elements.getElement(CardNumberElement);

      // Step 1: Create payment method (validate card)
      const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: donationData.donor.full_name,
          email: donationData.donor.email,
          phone: donationData.donor.mobile,
          address: {
            line1: donationData.donor.address,
            city: donationData.donor.city,
            state: donationData.donor.state,
            postal_code: donationData.donor.pincode,
            country: donationData.donor.country_code
          }
        }
      });

      if (cardError) {
        throw new Error(cardError.message);
      }

      // Step 2: Create payment intent with donation data (but don't save donation yet)
      const paymentResponse = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donation_data: donationData,  // Send form data, not DB record
          payment_method_id: paymentMethod.id
        })
      });

      const paymentResult = await paymentResponse.json();
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Failed to create payment');
      }

      const { client_secret, payment_intent_id } = paymentResult.data;

      // Step 3: Confirm payment with Stripe
      const confirmationResult = await stripe.confirmCardPayment(client_secret, {
        payment_method: paymentMethod.id
      });

      if (confirmationResult.error) {
        throw new Error(confirmationResult.error.message);
      }

      const { paymentIntent } = confirmationResult;

      // Step 4: ONLY IF PAYMENT SUCCEEDS → Save donation and create invoice
      if (paymentIntent.status === 'succeeded') {
        
        // NOW save the donation to database with payment confirmation
        const saveDonationResponse = await fetch('/api/donations/save-after-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            donation_data: donationData,
            payment_intent_id: paymentIntent.id,
            payment_method_id: paymentMethod.id,
            payment_status: 'completed'
          })
        });

        const savedDonation = await saveDonationResponse.json();
        
        if (!savedDonation.success) {
          // Critical: Payment succeeded but donation save failed
          throw new Error('Payment completed but donation save failed. Please contact support with Payment ID: ' + paymentIntent.id);
        }

        // Step 5: Generate invoice and send email
        const invoiceResponse = await fetch('/api/invoices/generate-and-send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            donation_id: savedDonation.data.donation.id
          })
        });

        setPaymentResult({
          success: true,
          paymentIntent,
          donation: savedDonation.data.donation,
          invoice: invoiceResponse.data?.invoice
        });

        setPaymentStep('success');
        toast.success('Payment completed and donation saved successfully!');
        onSuccess(savedDonation.data);

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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8">
        <AnimatePresence mode="wait">
          {/* Payment Input */}
          {paymentStep === 'input' && (
            <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              
              <h3 className="text-2xl font-bold text-soft-900 mb-6">
                Complete Your Payment
              </h3>

              {/* Payment Summary */}
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-6 rounded-xl mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-primary-800">
                      Donation Amount
                    </h4>
                    <p className="text-sm text-primary-600">
                      {donationData.donation_type === 'monthly' ? 'Monthly recurring' : 'One-time payment'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-700">
                      {countryConfig?.currency_symbol}{donationData.amount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Important:</strong> Your donation will only be saved after successful payment. 
                    No database record is created until payment completes.
                  </div>
                </div>
              </div>

              {/* Card Form */}
              <div className="space-y-6">
                
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-soft-700 mb-2">
                    Card Number *
                  </label>
                  <div className={`relative p-4 border rounded-xl transition-all ${
                    cardValidation.number.error 
                      ? 'border-red-500 bg-red-50' 
                      : cardValidation.number.complete 
                        ? 'border-green-500 bg-green-50'
                        : 'border-soft-300 bg-white'
                  }`}>
                    <CardNumberElement 
                      options={cardElementOptions}
                      onChange={handleCardChange('number')}
                    />
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
                    <div className="mt-2 text-red-600 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {cardValidation.number.error}
                    </div>
                  )}
                  {cardValidation.number.complete && !cardValidation.number.error && (
                    <div className="mt-2 text-green-600 text-sm flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Valid card number
                    </div>
                  )}
                </div>

                {/* Expiry and CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Expiry Date *
                    </label>
                    <div className={`relative p-4 border rounded-xl transition-all ${
                      cardValidation.expiry.error 
                        ? 'border-red-500 bg-red-50' 
                        : cardValidation.expiry.complete 
                          ? 'border-green-500 bg-green-50'
                          : 'border-soft-300 bg-white'
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Security Code *
                    </label>
                    <div className={`relative p-4 border rounded-xl transition-all ${
                      cardValidation.cvc.error 
                        ? 'border-red-500 bg-red-50' 
                        : cardValidation.cvc.complete 
                          ? 'border-green-500 bg-green-50'
                          : 'border-soft-300 bg-white'
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
                  </div>
                </div>

                {/* Card Validation Summary */}
                {(cardValidation.number.complete || cardValidation.expiry.complete || cardValidation.cvc.complete) && (
                  <div className="p-4 bg-soft-50 rounded-xl">
                    <h4 className="font-medium text-soft-900 mb-2">Card Validation Status</h4>
                    <div className="space-y-1 text-sm">
                      <div className={`flex items-center ${
                        cardValidation.number.complete && !cardValidation.number.error 
                          ? 'text-green-600' : 'text-soft-500'
                      }`}>
                        <CheckCircle className={`h-4 w-4 mr-2 ${
                          cardValidation.number.complete && !cardValidation.number.error 
                            ? 'text-green-500' : 'text-soft-400'
                        }`} />
                        Card number {cardValidation.number.complete && !cardValidation.number.error ? 'valid ✓' : 'required'}
                      </div>
                      <div className={`flex items-center ${
                        cardValidation.expiry.complete && !cardValidation.expiry.error 
                          ? 'text-green-600' : 'text-soft-500'
                      }`}>
                        <CheckCircle className={`h-4 w-4 mr-2 ${
                          cardValidation.expiry.complete && !cardValidation.expiry.error 
                            ? 'text-green-500' : 'text-soft-400'
                        }`} />
                        Expiry date {cardValidation.expiry.complete && !cardValidation.expiry.error ? 'valid ✓' : 'required'}
                      </div>
                      <div className={`flex items-center ${
                        cardValidation.cvc.complete && !cardValidation.cvc.error 
                          ? 'text-green-600' : 'text-soft-500'
                      }`}>
                        <CheckCircle className={`h-4 w-4 mr-2 ${
                          cardValidation.cvc.complete && !cardValidation.cvc.error 
                            ? 'text-green-500' : 'text-soft-400'
                        }`} />
                        Security code {cardValidation.cvc.complete && !cardValidation.cvc.error ? 'valid ✓' : 'required'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 mr-3 h-4 w-4 text-primary-600"
                  />
                  <label htmlFor="terms" className="text-sm text-soft-700">
                    I agree to the Terms & Conditions and understand that my donation will only be saved after successful payment.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={!stripe || isProcessing || !isCardValid() || !agreedToTerms}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center ${
                    !stripe || isProcessing || !isCardValid() || !agreedToTerms
                      ? 'bg-soft-300 text-soft-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:from-primary-700 hover:to-accent-700 shadow-lg hover:shadow-xl'
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
                      Pay {countryConfig?.currency_symbol}{donationData.amount}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Processing State */}
          {paymentStep === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Loader2 className="animate-spin h-16 w-16 text-primary-600 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-soft-900 mb-4">Processing Your Payment</h3>
              <div className="space-y-2 text-sm text-soft-600">
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Card details validated
                </div>
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-primary-500 mr-2" />
                  Processing payment with Stripe
                </div>
                <div className="flex items-center justify-center text-blue-600">
                  <FileText className="h-4 w-4 mr-2" />
                  Will save donation after payment success
                </div>
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {paymentStep === 'success' && paymentResult && (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-soft-900 mb-2">Payment Successful!</h3>
              <p className="text-lg text-soft-600 mb-8">
                Your donation has been processed and saved successfully
              </p>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-800">Payment ID:</span>
                    <div className="text-green-700 font-mono text-xs">{paymentResult.paymentIntent.id}</div>
                  </div>
                  <div>
                    <span className="font-medium text-green-800">Donation ID:</span>
                    <div className="text-green-700 font-mono text-xs">{paymentResult.donation.id}</div>
                  </div>
                  <div>
                    <span className="font-medium text-green-800">Amount:</span>
                    <div className="text-green-700">{countryConfig?.currency_symbol}{donationData.amount}</div>
                  </div>
                  <div>
                    <span className="font-medium text-green-800">Status:</span>
                    <div className="text-green-700">Completed & Saved</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center text-blue-800">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>Receipt email sent to {donationData.donor.email}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {paymentStep === 'error' && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-soft-900 mb-2">Payment Failed</h3>
              <p className="text-lg text-soft-600 mb-8">
                Your donation was not saved. Please try again.
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

export default CorrectedPaymentFlow;