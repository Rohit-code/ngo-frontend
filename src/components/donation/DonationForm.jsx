import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  Heart, CreditCard, Smartphone, Building, User, Mail, Phone, MapPin,
  CheckCircle, AlertCircle, Eye, EyeOff, ChevronDown, Info, Globe, Flag
} from 'lucide-react';
import { donationService } from '../../services/donationService';
import { paymentService } from '../../services/paymentService';
import { INDIAN_STATES } from '../../utils/constants';
import { formatCurrency, isValidEmail, isValidMobile, isValidPAN, isValidPincode, getImpactMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

const DonationForm = ({ selectedCampaign = null }) => {
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('one_time');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPAN, setShowPAN] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInternational, setIsInternational] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [supportedCountries, setSupportedCountries] = useState([]);
  const [countryConfig, setCountryConfig] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
    trigger,
    setValue
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      country: 'IN'
    }
  });

  // Predefined amounts with international consideration
  const donationAmounts = [200, 500, 1000, 2500, 5000, 10000];
  const MIN_DONATION = 200;

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load supported countries
  useEffect(() => {
    fetchSupportedCountries();
  }, []);

  // Load country config when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetchCountryConfig(selectedCountry);
      setIsInternational(selectedCountry !== 'IN');
    }
  }, [selectedCountry]);

  const fetchSupportedCountries = async () => {
    try {
      const response = await donationService.getSupportedCountries();
      if (response.success) {
        setSupportedCountries(response.data.supported_countries);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Failed to load countries');
    }
  };

  const fetchCountryConfig = async (countryCode) => {
    try {
      const response = await donationService.getCountryConfig(countryCode);
      if (response.success) {
        setCountryConfig(response.data);
      }
    } catch (error) {
      console.error('Error fetching country config:', error);
    }
  };

  const finalAmount = customAmount || selectedAmount;
  const impactMessage = getImpactMessage(finalAmount);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      setCustomAmount(value);
      setSelectedAmount(0);
    }
  };

  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);
    setValue('country', countryCode);
  };

  const validateStep = async (step) => {
    switch (step) {
      case 1:
        return finalAmount >= MIN_DONATION;
      case 2:
        return await trigger(['full_name', 'email', 'mobile', 'state', 'city', 'pincode', 'address']);
      case 3:
        return true; // Payment method selection
      default:
        return true;
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      if (!finalAmount || finalAmount < MIN_DONATION) {
        toast.error(`Minimum donation amount is ${formatCurrency(MIN_DONATION)}`);
        return;
      }

      const donationData = {
        donor: {
          full_name: data.full_name,
          email: data.email,
          mobile: data.mobile,
          pan_number: data.pan_number || null,
          country: countryConfig?.name || "India",
          country_code: selectedCountry,
          state: data.state,
          city: data.city,
          address: data.address,
          pincode: data.pincode,
          is_anonymous: false
        },
        amount: parseFloat(finalAmount),
        donation_type: donationType,
        campaign_id: selectedCampaign?.id || null
      };

      // Create donation based on country
      let response;
      if (isInternational) {
        response = await donationService.createInternationalDonation(donationData);
      } else {
        response = await donationService.createDonation(donationData);
      }
      
      if (response.success) {
        toast.success('Donation created successfully! Proceeding to payment...');
        
        // Store donation for payment processing
        setPaymentIntent(response.data.donation);
        setCurrentStep(4); // Move to payment step
      }
    } catch (error) {
      console.error('Donation error:', error);
      toast.error(error.message || 'Failed to create donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Amount', icon: Heart, completed: currentStep > 1 },
    { number: 2, title: 'Details', icon: User, completed: currentStep > 2 },
    { number: 3, title: 'Review', icon: CheckCircle, completed: currentStep > 3 },
    { number: 4, title: 'Payment', icon: CreditCard, completed: false }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-warm-200">
            <motion.div
              className="h-full bg-primary-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Step Indicators */}
          {steps.map((step, index) => (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <motion.div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step.completed || currentStep >= step.number
                    ? 'bg-primary-500 text-white'
                    : 'bg-warm-200 text-soft-600'
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {step.completed ? (
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </motion.div>
              <span className="text-xs sm:text-sm font-medium text-soft-600 mt-2 hidden sm:block">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
        
        <AnimatePresence mode="wait">
          {/* Step 1: Amount Selection & Country */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="card p-4 sm:p-6 lg:p-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-soft-900 mb-4 sm:mb-6 text-center flex items-center justify-center">
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500 mr-2" />
                Choose Your Donation
              </h2>
              
              {/* Country Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-soft-700 mb-3">
                  Select Your Country
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {supportedCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountryChange(country.code)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 touch-friendly ${
                        selectedCountry === country.code
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-warm-200 bg-white text-soft-600 hover:border-warm-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1">{country.code === 'IN' ? '🇮🇳' : country.code === 'US' ? '🇺🇸' : country.code === 'GB' ? '🇬🇧' : country.code === 'CA' ? '🇨🇦' : '🌍'}</div>
                        <div className="font-semibold text-xs">{country.name}</div>
                        <div className="text-xs opacity-75">{country.currency_symbol}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency Info */}
              {countryConfig && (
                <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-primary-800">
                        Currency: {countryConfig.currency} ({countryConfig.currency_symbol})
                      </span>
                      <div className="text-sm text-primary-600 mt-1">
                        Minimum: {countryConfig.currency_symbol}{countryConfig.min_donation}
                      </div>
                    </div>
                    {countryConfig.tax_benefit && (
                      <div className="text-right">
                        <div className="text-sm text-green-600 font-medium">✓ Tax Benefits</div>
                        <div className="text-xs text-green-500">{countryConfig.tax_section}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Donation Type Toggle */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <button
                  type="button"
                  onClick={() => setDonationType('one_time')}
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 touch-friendly ${
                    donationType === 'one_time'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-warm-200 bg-white text-soft-600 hover:border-warm-300'
                  }`}
                >
                  <div className="font-semibold text-sm sm:text-base">One Time</div>
                  <div className="text-xs sm:text-sm opacity-75">Single donation</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDonationType('monthly')}
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 touch-friendly ${
                    donationType === 'monthly'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-warm-200 bg-white text-soft-600 hover:border-warm-300'
                  }`}
                >
                  <div className="font-semibold text-sm sm:text-base">Monthly</div>
                  <div className="text-xs sm:text-sm opacity-75">Recurring support</div>
                </button>
              </div>

              {/* Amount Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleAmountSelect(amount)}
                    className={`donation-amount-btn ${
                      selectedAmount === amount && !customAmount
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-warm-200 bg-white text-soft-600 hover:border-warm-300'
                    }`}
                  >
                    <div className="font-semibold text-sm sm:text-base">
                      {countryConfig?.currency_symbol || '₹'}{amount}
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div className="relative mb-4 sm:mb-6">
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  min={countryConfig?.min_donation || MIN_DONATION}
                  className="form-input w-full pl-10 sm:pl-12 text-base"
                />
                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-soft-500 font-medium text-sm sm:text-base">
                  {countryConfig?.currency_symbol || '₹'}
                </div>
              </div>

              {/* Impact Message */}
              {finalAmount >= (countryConfig?.min_donation || MIN_DONATION) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 sm:p-4 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-lg sm:rounded-xl text-center"
                >
                  <div className="flex items-center justify-center mb-2">
                    <Info className="h-4 w-4 text-primary-600 mr-2" />
                    <span className="font-semibold text-primary-800 text-sm sm:text-base">
                      Your Impact: {countryConfig?.currency_symbol || '₹'}{finalAmount}
                    </span>
                  </div>
                  <p className="text-primary-700 text-xs sm:text-sm">
                    {impactMessage}
                  </p>
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex justify-end mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!finalAmount || finalAmount < (countryConfig?.min_donation || MIN_DONATION)}
                  className="btn-primary px-6 sm:px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="card p-4 sm:p-6 lg:p-8"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-soft-900 mb-4 sm:mb-6 flex items-center">
                <User className="h-5 w-5 text-primary-500 mr-2" />
                Your Information
              </h3>

              <div className="space-y-4 sm:space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-soft-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      {...register('full_name', { 
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name too short' }
                      })}
                      type="text"
                      placeholder="Enter your full name"
                      className={`form-input pl-10 sm:pl-12 ${errors.full_name ? 'border-red-500' : ''}`}
                    />
                    <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-soft-400" />
                    {errors.full_name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center mt-1 text-red-600"
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">{errors.full_name.message}</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Email & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <input
                        {...register('email', { 
                          required: 'Email is required',
                          validate: (value) => isValidEmail(value) || 'Invalid email'
                        })}
                        type="email"
                        placeholder="your@email.com"
                        className={`form-input pl-10 sm:pl-12 ${errors.email ? 'border-red-500' : ''}`}
                      />
                      <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-soft-400" />
                      {errors.email && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center mt-1 text-red-600"
                        >
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm">{errors.email.message}</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      Phone *
                    </label>
                    <div className="relative">
                      <input
                        {...register('mobile', { 
                          required: 'Phone is required',
                          validate: (value) => {
                            if (selectedCountry === 'IN') {
                              return isValidMobile(value) || 'Invalid mobile number';
                            }
                            return value.length >= 8 || 'Invalid phone number';
                          }
                        })}
                        type="tel"
                        placeholder={selectedCountry === 'IN' ? '9876543210' : 'Phone number'}
                        className={`form-input pl-10 sm:pl-12 ${errors.mobile ? 'border-red-500' : ''}`}
                      />
                      <Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-soft-400" />
                      {errors.mobile && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center mt-1 text-red-600"
                        >
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm">{errors.mobile.message}</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* PAN Number for Indian donors */}
                {selectedCountry === 'IN' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-soft-700">
                        PAN Number (for 80G receipt)
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPAN(!showPAN)}
                        className="text-primary-600 text-sm hover:text-primary-700 touch-friendly"
                      >
                        {showPAN ? 'Hide' : 'Add PAN'}
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {showPAN && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          <input
                            {...register('pan_number', {
                              validate: (value) => !value || isValidPAN(value) || 'Invalid PAN'
                            })}
                            type="text"
                            placeholder="ABCDE1234F"
                            className={`form-input uppercase ${errors.pan_number ? 'border-red-500' : ''}`}
                          />
                          {errors.pan_number && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center mt-1 text-red-600"
                            >
                              <AlertCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">{errors.pan_number.message}</span>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Location Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      State/Province *
                    </label>
                    <div className="relative">
                      {selectedCountry === 'IN' ? (
                        <select
                          {...register('state', { required: 'State is required' })}
                          className={`form-select ${errors.state ? 'border-red-500' : ''}`}
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((state) => (
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
                          className={`form-input ${errors.state ? 'border-red-500' : ''}`}
                        />
                      )}
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-soft-400 pointer-events-none" />
                      {errors.state && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center mt-1 text-red-600"
                        >
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm">{errors.state.message}</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-700 mb-2">
                      City *
                    </label>
                    <input
                      {...register('city', { required: 'City is required' })}
                      type="text"
                      placeholder="City"
                      className={`form-input ${errors.city ? 'border-red-500' : ''}`}
                    />
                    {errors.city && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center mt-1 text-red-600"
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">{errors.city.message}</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-sm font-medium text-soft-700 mb-2">
                    {selectedCountry === 'IN' ? 'Pincode' : 'Postal Code'} *
                  </label>
                  <input
                    {...register('pincode', { 
                      required: 'Postal code is required',
                      validate: (value) => {
                        if (selectedCountry === 'IN') {
                          return isValidPincode(value) || 'Invalid pincode';
                        }
                        return value.length >= 3 || 'Invalid postal code';
                      }
                    })}
                    type="text"
                    placeholder={selectedCountry === 'IN' ? '400001' : 'Postal code'}
                    className={`form-input max-w-xs ${errors.pincode ? 'border-red-500' : ''}`}
                    maxLength={selectedCountry === 'IN' ? 6 : 10}
                  />
                  {errors.pincode && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center mt-1 text-red-600"
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">{errors.pincode.message}</span>
                    </motion.div>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-soft-700 mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <textarea
                      {...register('address', { 
                        required: 'Address is required',
                        minLength: { value: 10, message: 'Address too short' }
                      })}
                      placeholder="Enter your complete address"
                      rows={3}
                      className={`form-input pl-10 sm:pl-12 resize-none ${errors.address ? 'border-red-500' : ''}`}
                    />
                    <MapPin className="absolute left-3 sm:left-4 top-4 h-4 w-4 sm:h-5 sm:w-5 text-soft-400" />
                    {errors.address && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center mt-1 text-red-600"
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">{errors.address.message}</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary px-4 sm:px-6 py-3"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary px-6 sm:px-8 py-3"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="card p-4 sm:p-6 lg:p-8"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-soft-900 mb-4 sm:mb-6 flex items-center">
                <CheckCircle className="h-5 w-5 text-primary-500 mr-2" />
                Review Your Donation
              </h3>

              {/* Order Summary */}
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-primary-200">
                <h4 className="font-semibold text-soft-900 mb-3 sm:mb-4">Donation Summary</h4>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span>Amount:</span>
                    <span className="font-semibold">{countryConfig?.currency_symbol || '₹'}{finalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span>Currency:</span>
                    <span className="capitalize">{countryConfig?.currency || 'INR'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span>Type:</span>
                    <span className="capitalize">{donationType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span>Country:</span>
                    <span>{countryConfig?.name || 'India'}</span>
                  </div>
                  {selectedCampaign && (
                    <div className="flex justify-between items-start text-sm sm:text-base">
                      <span>Campaign:</span>
                      <span className="font-medium text-right max-w-xs">{selectedCampaign.title}</span>
                    </div>
                  )}
                  {countryConfig?.tax_benefit && (
                    <div className="flex justify-between items-center text-sm sm:text-base pt-2 border-t border-primary-200">
                      <span>Tax Benefit:</span>
                      <span className="text-green-600 font-medium">{countryConfig.tax_section}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary px-4 sm:px-6 py-3"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-6 sm:px-12 py-3 sm:py-4 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Create Donation
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Payment Processing */}
          {currentStep === 4 && paymentIntent && (
            <PaymentStep 
              donation={paymentIntent}
              isInternational={isInternational}
              countryConfig={countryConfig}
              onSuccess={() => {
                toast.success('Payment completed successfully!');
                reset();
                setCurrentStep(1);
                setPaymentIntent(null);
              }}
              onError={(error) => {
                toast.error(error.message || 'Payment failed');
                setCurrentStep(3); // Go back to review
              }}
            />
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

// Payment Step Component
const PaymentStep = ({ donation, isInternational, countryConfig, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
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
      const cardElement = elements.getElement(CardElement);

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
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
        // Confirm with backend
        await donationService.confirmPayment(paymentIntent.id);
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="card p-4 sm:p-6 lg:p-8"
    >
      <h3 className="text-xl sm:text-2xl font-semibold text-soft-900 mb-4 sm:mb-6 flex items-center">
        <CreditCard className="h-5 w-5 text-primary-500 mr-2" />
        Complete Payment
      </h3>

      {/* Payment Summary */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-4 mb-6 border border-primary-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">
            {countryConfig?.currency_symbol || '₹'}{donation.amount}
          </div>
          <div className="text-sm text-primary-700">
            {donation.donation_type === 'monthly' ? 'Monthly Donation' : 'One-time Donation'}
          </div>
        </div>
      </div>

      {/* Card Element */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-soft-700 mb-3">
          Card Details
        </label>
        <div className="p-4 border border-primary-200 rounded-lg bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1f2937',
                  '::placeholder': {
                    color: '#9ca3af',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={!stripe || isProcessing}
        className="btn-primary w-full justify-center py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Pay {countryConfig?.currency_symbol || '₹'}{donation.amount}
          </>
        )}
      </button>

      <p className="text-xs sm:text-sm text-soft-500 mt-4 text-center">
        🔒 Secure payment powered by Stripe • {countryConfig?.tax_benefit ? '80G tax benefits available' : 'International donation'}
      </p>
    </motion.div>
  );
};

export default DonationForm;