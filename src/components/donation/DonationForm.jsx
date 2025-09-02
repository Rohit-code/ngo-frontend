// components/donation/CorrectedDonationForm.jsx - PAYMENT FIRST APPROACH
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Heart, User, CheckCircle, CreditCard, Globe, AlertCircle,
  ArrowLeft, ArrowRight, Shield, Award, Users, FileText
} from 'lucide-react';

// Components
import CorrectedPaymentFlow from '../payment/CorrectedPaymentFlow';
import { InlineLoading } from '../common/Loading';

// Services & Utils
import { validateByCountry, getCountryValidation } from '../../utils/countryValidation';
import { SUPPORTED_COUNTRIES, INDIAN_STATES_SIMPLE } from '../../utils/constants';
import { formatCurrency, getImpactMessage } from '../../utils/helpers';

import toast from 'react-hot-toast';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_dummy');

const CorrectedDonationForm = ({ selectedCampaign = null }) => {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('one_time');
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [countryConfig, setCountryConfig] = useState(null);
  const [isInternational, setIsInternational] = useState(false);
  const [formValidated, setFormValidated] = useState(false);
  const [donationData, setDonationData] = useState(null); // Form data, NOT saved to DB
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger,
    setValue,
    getValues
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      country: 'IN',
      state: '',
      full_name: '',
      email: '',
      mobile: '',
      city: '',
      address: '',
      pincode: '',
      pan_number: ''
    }
  });

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  // Predefined amounts based on country
  const getPresetAmounts = (countryCode) => {
    const country = SUPPORTED_COUNTRIES.find(c => c.code === countryCode);
    if (countryCode === 'IN') {
      return [500, 1000, 2500, 5000, 10000];
    } else if (country?.currency === 'USD') {
      return [10, 25, 50, 100, 250];
    } else if (country?.currency === 'GBP') {
      return [10, 20, 40, 80, 200];
    }
    return [10, 25, 50, 100, 250];
  };

  // Initialize country config
  useEffect(() => {
    const config = getCountryValidation(selectedCountry);
    setCountryConfig(config);
    setIsInternational(selectedCountry !== 'IN');
    
    const presetAmounts = getPresetAmounts(selectedCountry);
    setSelectedAmount(presetAmounts[1]);
    setCustomAmount('');
  }, [selectedCountry]);

  // Handle country change
  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);
    setValue('country', countryCode);
  };

  // Form validation by step
  const validateStep = async (step) => {
    switch (step) {
      case 1:
        const minAmount = countryConfig?.min_donation || 10;
        return finalAmount >= minAmount;
      case 2:
        const fieldsToValidate = ['full_name', 'email', 'mobile', 'address', 'city', 'pincode'];
        if (selectedCountry === 'IN') {
          fieldsToValidate.push('state');
        }
        return await trigger(fieldsToValidate);
      case 3:
        return true; // Review step
      default:
        return true;
    }
  };

  // Navigation
  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      toast.error('Please fill all required fields correctly');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form submission - DOES NOT SAVE TO DATABASE
  const onSubmit = async (data) => {
    try {
      const minAmount = countryConfig?.min_donation || 10;
      if (!finalAmount || finalAmount < minAmount) {
        toast.error(`Minimum donation amount is ${countryConfig?.currency_symbol}${minAmount}`);
        return;
      }

      // Prepare donation data (but don't save to database yet)
      const preparedDonationData = {
        donor: {
          full_name: data.full_name?.trim(),
          email: data.email?.trim().toLowerCase(),
          mobile: data.mobile?.trim(),
          pan_number: data.pan_number?.trim().toUpperCase() || null,
          country: countryConfig?.name || 'India',
          country_code: selectedCountry,
          state: data.state?.trim(),
          city: data.city?.trim(),
          address: data.address?.trim(),
          pincode: data.pincode?.trim(),
          is_anonymous: false
        },
        amount: parseFloat(finalAmount),
        currency: countryConfig?.currency || 'INR',
        donation_type: donationType,
        campaign_id: selectedCampaign?.id || null,
        source: 'website'
      };

      // Validate data locally
      const validation = validateDonationData(preparedDonationData);
      if (!validation.isValid) {
        toast.error(validation.errors[0]);
        return;
      }

      // Store form data for payment processing (NOT in database)
      setDonationData(preparedDonationData);
      setFormValidated(true);
      setCurrentStep(4); // Move to payment step
      
      toast.success('Form validated! Now complete payment to save your donation.');

    } catch (error) {
      console.error('Form preparation error:', error);
      toast.error('Please check all fields and try again.');
    }
  };

  // Payment success handler - donation is now saved in database
  const handlePaymentSuccess = (result) => {
    setPaymentComplete(true);
    toast.success('Thank you! Your donation has been completed and saved successfully.');
    
    // Reset form after a delay
    setTimeout(() => {
      reset();
      setCurrentStep(1);
      setDonationData(null);
      setFormValidated(false);
      setPaymentComplete(false);
      setSelectedAmount(1000);
      setCustomAmount('');
    }, 10000);
  };

  // Payment error handler  
  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    toast.error('Payment failed. Your donation was not saved. Please try again.');
    // Stay on payment step to retry
  };

  // Client-side validation function
  const validateDonationData = (donationData) => {
    const errors = [];

    if (!donationData.donor?.full_name?.trim()) {
      errors.push('Full name is required');
    }

    if (!donationData.donor?.email?.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donationData.donor.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!donationData.donor?.mobile?.trim()) {
      errors.push('Mobile number is required');
    }

    if (!donationData.amount || donationData.amount <= 0) {
      errors.push('Donation amount must be greater than 0');
    }

    if (!donationData.donor?.address?.trim()) {
      errors.push('Address is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  return (
    <div className="max-w-4xl mx-auto" id="donation-form">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {[
            { step: 1, title: 'Amount', icon: Heart },
            { step: 2, title: 'Details', icon: User },
            { step: 3, title: 'Review', icon: CheckCircle },
            { step: 4, title: 'Payment', icon: CreditCard }
          ].map(({ step, title, icon: Icon }, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center relative z-10">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step 
                    ? 'border-primary-500 bg-primary-500 text-white shadow-lg' 
                    : 'border-soft-300 bg-white text-soft-400'
                }`}>
                  {currentStep > step ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                <span className={`mt-2 text-sm font-medium transition-colors ${
                  currentStep >= step ? 'text-primary-600' : 'text-soft-400'
                }`}>
                  {title}
                </span>
              </div>
              {index < 3 && (
                <div className={`absolute top-6 h-1 transition-all duration-300 ${
                  currentStep > step ? 'bg-primary-500' : 'bg-soft-200'
                }`} 
                style={{
                  left: `${(index + 1) * 25}%`,
                  width: '25%',
                  transform: 'translateX(-50%)'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Important Notice */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <div className="flex items-start">
          <FileText className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900">Payment-First Approach</h4>
            <p className="text-blue-800 text-sm mt-1">
              Your donation will only be saved to our database after payment is successfully completed. 
              No record is created until payment succeeds.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* Step 1: Amount Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card p-8"
            >
              <h2 className="text-3xl font-bold text-soft-900 mb-8 text-center">
                Choose Your Donation Amount
              </h2>

              {/* Country Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-soft-700 mb-4 text-center">
                  Select Your Country
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {SUPPORTED_COUNTRIES.map((country) => (
                    <motion.button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountryChange(country.code)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedCountry === country.code
                          ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg'
                          : 'border-soft-200 bg-white text-soft-600 hover:border-soft-300 hover:shadow-md'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">
                          {country.code === 'IN' ? '🇮🇳' : 
                           country.code === 'US' ? '🇺🇸' : 
                           country.code === 'GB' ? '🇬🇧' : 
                           country.code === 'CA' ? '🇨🇦' : 
                           country.code === 'AU' ? '🇦🇺' :
                           country.code === 'SG' ? '🇸🇬' : '🌍'}
                        </div>
                        <div className="font-semibold text-sm">{country.name}</div>
                        <div className="text-xs opacity-75">{country.currency_symbol}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Currency Info */}
              {countryConfig && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-6 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-primary-800">
                        Currency: {countryConfig.currency} ({countryConfig.currency_symbol})
                      </span>
                      <div className="text-primary-600 mt-1">
                        Minimum donation: {countryConfig.currency_symbol}{countryConfig.min_donation}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* Donation Type */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <motion.button
                  type="button"
                  onClick={() => setDonationType('one_time')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    donationType === 'one_time'
                      ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg'
                      : 'border-soft-200 bg-white text-soft-600 hover:border-soft-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-xl font-bold mb-2">One Time</div>
                  <div className="text-sm opacity-75">Single donation</div>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setDonationType('monthly')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    donationType === 'monthly'
                      ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg'
                      : 'border-soft-200 bg-white text-soft-600 hover:border-soft-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-xl font-bold mb-2">Monthly</div>
                  <div className="text-sm opacity-75">Recurring donation</div>
                </motion.button>
              </div>

              {/* Preset Amounts */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-soft-700 mb-4 text-center">
                  Quick Select Amount
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {getPresetAmounts(selectedCountry).map((amount) => (
                    <motion.button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        selectedAmount === amount && !customAmount
                          ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg'
                          : 'border-soft-200 bg-white text-soft-600 hover:border-soft-300 hover:shadow-md'
                      }`}
                    >
                      <div className="font-bold text-2xl">
                        {countryConfig?.currency_symbol}{amount}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="mb-8 text-center">
                <label className="block text-lg font-semibold text-soft-700 mb-4">
                  Or Enter Custom Amount
                </label>
                <div className="relative max-w-xs mx-auto">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-semibold text-soft-500">
                    {countryConfig?.currency_symbol}
                  </div>
                  <input
                    type="number"
                    min={countryConfig?.min_donation || 1}
                    step="1"
                    placeholder="0"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-xl font-semibold border-2 border-soft-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center"
                  />
                </div>
              </div>

              {/* Impact Message */}
              {finalAmount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl text-center"
                >
                  <div className="text-green-800 font-semibold text-lg">
                    Your Impact: {getImpactMessage(finalAmount, countryConfig?.currency)}
                  </div>
                </motion.div>
              )}

              <div className="flex justify-end">
                <motion.button
                  type="button"
                  onClick={nextStep}
                  disabled={!finalAmount || finalAmount < (countryConfig?.min_donation || 1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Donor Details - Same as before */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card p-8"
            >
              <h2 className="text-3xl font-bold text-soft-900 mb-8 text-center">
                Your Details
              </h2>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <strong>Note:</strong> These details are not saved yet. Your information will only be stored after successful payment.
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('full_name', { 
                        required: 'Full name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                      type="text"
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        errors.full_name ? 'border-red-500' : 'border-soft-300'
                      }`}
                    />
                    {errors.full_name && (
                      <div className="flex items-center mt-2 text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">{errors.full_name.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register('email', { 
                        required: 'Email is required',
                        validate: (value) => validateByCountry.email(value)
                      })}
                      type="email"
                      placeholder="your.email@example.com"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-soft-300'
                      }`}
                    />
                    {errors.email && (
                      <div className="flex items-center mt-2 text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">{errors.email.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Mobile Number *
                    </label>
                    <input
                      {...register('mobile', { 
                        required: 'Mobile number is required',
                        validate: (value) => validateByCountry.mobile(value, selectedCountry)
                      })}
                      type="tel"
                      placeholder={selectedCountry === 'IN' ? '9876543210' : 'Your phone number'}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        errors.mobile ? 'border-red-500' : 'border-soft-300'
                      }`}
                    />
                    {errors.mobile && (
                      <div className="flex items-center mt-2 text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">{errors.mobile.message}</span>
                      </div>
                    )}
                  </div>


                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-soft-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    {...register('address', { 
                      required: 'Address is required',
                      minLength: { value: 10, message: 'Address must be at least 10 characters' }
                    })}
                    placeholder="Enter your complete address"
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none ${
                      errors.address ? 'border-red-500' : 'border-soft-300'
                    }`}
                  />
                  {errors.address && (
                    <div className="flex items-center mt-2 text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">{errors.address.message}</span>
                    </div>
                  )}
                </div>

                {/* City, State, Pincode */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      {selectedCountry === 'IN' ? 'State' : 'State/Province'} *
                    </label>
                    <div className="relative">
                      {selectedCountry === 'IN' ? (
                        <select
                          {...register('state', { required: 'Please select your state' })}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none ${
                            errors.state ? 'border-red-500' : 'border-soft-300'
                          }`}
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES_SIMPLE.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          {...register('state', { required: 'State/Province is required' })}
                          type="text"
                          placeholder="State/Province"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                            errors.state ? 'border-red-500' : 'border-soft-300'
                          }`}
                        />
                      )}
                    </div>
                    {errors.state && (
                      <div className="flex items-center mt-2 text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">{errors.state.message}</span>
                      </div>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      City *
                    </label>
                    <input
                      {...register('city', { required: 'City is required' })}
                      type="text"
                      placeholder="City"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        errors.city ? 'border-red-500' : 'border-soft-300'
                      }`}
                    />
                    {errors.city && (
                      <div className="flex items-center mt-2 text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">{errors.city.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      {selectedCountry === 'IN' ? 'Pincode' : 'Postal Code'} *
                    </label>
                    <input
                      {...register('pincode', { 
                        required: 'Postal code is required',
                        validate: (value) => validateByCountry.postalCode(value, selectedCountry)
                      })}
                      type="text"
                      placeholder={selectedCountry === 'IN' ? '400001' : 'Postal code'}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        errors.pincode ? 'border-red-500' : 'border-soft-300'
                      }`}
                    />
                    {errors.pincode && (
                      <div className="flex items-center mt-2 text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">{errors.pincode.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary flex items-center px-6 py-3"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </motion.button>
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center px-6 py-3"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card p-8"
            >
              <h2 className="text-3xl font-bold text-soft-900 mb-8 text-center">
                Review Your Donation
              </h2>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <strong>Final Review:</strong> Please verify all details. Your donation will only be saved after successful payment on the next step.
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Donation Summary */}
                <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-8 rounded-xl border border-primary-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-primary-800">
                        Donation Amount
                      </h3>
                      <p className="text-primary-600 mt-1">
                        {donationType === 'monthly' ? 'Monthly recurring donation' : 'One-time donation'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-primary-700">
                        {countryConfig?.currency_symbol}{finalAmount}
                      </div>
                      <div className="text-primary-600 mt-1">
                        {countryConfig?.currency}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Donor Details */}
                <div className="bg-soft-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-soft-800 mb-4">
                    Your Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Name:</strong> {watch('full_name')}
                    </div>
                    <div>
                      <strong>Email:</strong> {watch('email')}
                    </div>
                    <div>
                      <strong>Mobile:</strong> {watch('mobile')}
                    </div>
                    <div>
                      <strong>Country:</strong> {countryConfig?.name}
                    </div>
                    {watch('pan_number') && (
                      <div>
                        <strong>PAN:</strong> {watch('pan_number')}
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <strong>Address:</strong> {watch('address')}, {watch('city')}
                      {watch('state') && `, ${watch('state')}`} - {watch('pincode')}
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center mb-3">
                      <Shield className="h-6 w-6 text-green-600 mr-2" />
                      <div className="font-semibold text-green-800">Secure Payment</div>
                    </div>
                    <div className="text-sm text-green-700">
                      Payment processed securely through Stripe. Data saved only after payment succeeds.
                    </div>
                  </div>



                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center mb-3">
                      <Users className="h-6 w-6 text-purple-600 mr-2" />
                      <div className="font-semibold text-purple-800">Direct Impact</div>
                    </div>
                    <div className="text-sm text-purple-700">
                      100% of your donation goes directly to helping children
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary flex items-center px-6 py-3"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center px-8 py-4 text-lg"
                >
                  Proceed to Payment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Payment - Only shown if form is validated */}
          {currentStep === 4 && formValidated && donationData && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Elements stripe={stripePromise}>
                <CorrectedPaymentFlow
                  donationData={donationData} // Form data, not DB record
                  countryConfig={countryConfig}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default CorrectedDonationForm;