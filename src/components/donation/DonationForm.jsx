import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Heart, CreditCard, Smartphone, Building, User, Mail, Phone, MapPin } from 'lucide-react';
import { donationService } from '../../services/donationService';
import { INDIAN_STATES } from '../../utils/constants';
import { formatCurrency, isValidEmail, isValidMobile, isValidPAN, isValidPincode } from '../../utils/helpers';
import toast from 'react-hot-toast';

const DonationForm = ({ selectedCampaign = null }) => {
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('one_time');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Predefined amounts (minimum 200)
  const donationAmounts = [100, 500, 1000, 2500, 5000, 10000];
  const MIN_DONATION = 100;

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

  const finalAmount = customAmount || selectedAmount;

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Validation
      if (!finalAmount || finalAmount < MIN_DONATION) {
        toast.error(`Minimum donation amount is ${formatCurrency(MIN_DONATION)}`);
        return;
      }

      // Prepare donation data according to API
      const donationData = {
        donor: {
          full_name: data.full_name,
          email: data.email,
          mobile: data.mobile,
          pan_number: data.pan_number || null,
          country: "India",
          state: data.state,
          city: data.city,
          address: data.address,
          pincode: data.pincode,
          is_anonymous: false
        },
        amount: parseFloat(finalAmount),
        donation_type: donationType,
        campaign_id: selectedCampaign?.id || null,
        payment_method: paymentMethod
      };

      const response = await donationService.createDonation(donationData);
      
      if (response.success) {
        toast.success('Donation created successfully! Redirecting to payment...');
        
        // Reset form
        reset();
        setSelectedAmount(1000);
        setCustomAmount('');
        setDonationType('one_time');
        setPaymentMethod('card');
      }
    } catch (error) {
      console.error('Donation error:', error);
      toast.error(error.message || 'Failed to create donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Amount Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8"
        >
          <h2 className="text-2xl font-bold text-soft-900 mb-6 text-center">
            <Heart className="h-6 w-6 text-primary-500 inline mr-2" />
            Choose Your Donation Amount
          </h2>
          
          {/* Donation Type */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setDonationType('one_time')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                donationType === 'one_time'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-warm-200 bg-white text-soft-600 hover:border-warm-300'
              }`}
            >
              <div className="font-semibold">One Time</div>
              <div className="text-sm opacity-75">Single donation</div>
            </button>

            <button
              type="button"
              onClick={() => setDonationType('monthly')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                donationType === 'monthly'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-warm-200 bg-white text-soft-600 hover:border-warm-300'
              }`}
            >
              <div className="font-semibold">Monthly</div>
              <div className="text-sm opacity-75">Recurring support</div>
            </button>
          </div>

          {/* Amount Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {donationAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleAmountSelect(amount)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedAmount === amount && !customAmount
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-warm-200 bg-white text-soft-600 hover:border-warm-300'
                }`}
              >
                <div className="font-semibold">{formatCurrency(amount)}</div>
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="relative">
            <input
              type="number"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              min={MIN_DONATION}
              className="form-input w-full pl-12"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-soft-500 font-medium">
              ₹
            </div>
          </div>

          {/* Impact Message */}
          {finalAmount >= MIN_DONATION && (
            <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-xl text-center">
              <p className="text-primary-800 font-medium">
                Your donation of {formatCurrency(finalAmount)} will help support children in need
              </p>
            </div>
          )}
        </motion.div>

        {/* Donor Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-8"
        >
          <h3 className="text-xl font-semibold text-soft-900 mb-6 flex items-center">
            <User className="h-5 w-5 text-primary-500 mr-2" />
            Your Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="md:col-span-2">
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
                  className="form-input pl-10"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-soft-400" />
              </div>
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            {/* Email */}
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
                  className="form-input pl-10"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-soft-400" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-soft-700 mb-2">
                Mobile *
              </label>
              <div className="relative">
                <input
                  {...register('mobile', { 
                    required: 'Mobile is required',
                    validate: (value) => isValidMobile(value) || 'Invalid mobile number'
                  })}
                  type="tel"
                  placeholder="9876543210"
                  className="form-input pl-10"
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-soft-400" />
              </div>
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>
              )}
            </div>

            {/* PAN (Optional) */}
            <div>
              <label className="block text-sm font-medium text-soft-700 mb-2">
                PAN Number (for 80G receipt)
              </label>
              <input
                {...register('pan_number', {
                  validate: (value) => !value || isValidPAN(value) || 'Invalid PAN'
                })}
                type="text"
                placeholder="ABCDE1234F"
                className="form-input uppercase"
              />
              {errors.pan_number && (
                <p className="mt-1 text-sm text-red-600">{errors.pan_number.message}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-soft-700 mb-2">
                State *
              </label>
              <select
                {...register('state', { required: 'State is required' })}
                className="form-select"
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
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
                placeholder="Mumbai"
                className="form-input"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-soft-700 mb-2">
                Pincode *
              </label>
              <input
                {...register('pincode', { 
                  required: 'Pincode is required',
                  validate: (value) => isValidPincode(value) || 'Invalid pincode'
                })}
                type="text"
                placeholder="400001"
                className="form-input"
                maxLength={6}
              />
              {errors.pincode && (
                <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
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
                  className="form-input pl-10 resize-none"
                />
                <MapPin className="absolute left-3 top-4 h-4 w-4 text-soft-400" />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8"
        >
          <h3 className="text-xl font-semibold text-soft-900 mb-6 flex items-center">
            <CreditCard className="h-5 w-5 text-primary-500 mr-2" />
            Payment Method
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                paymentMethod === 'card'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-warm-200 bg-white text-soft-600 hover:border-warm-300'
              }`}
            >
              <CreditCard className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-semibold">Card</div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                paymentMethod === 'upi'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-warm-200 bg-white text-soft-600 hover:border-warm-300'
              }`}
            >
              <Smartphone className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-semibold">UPI</div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                paymentMethod === 'netbanking'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-warm-200 bg-white text-soft-600 hover:border-warm-300'
              }`}
            >
              <Building className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-semibold">Net Banking</div>
            </button>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <button
            type="submit"
            disabled={isSubmitting || !finalAmount || finalAmount < MIN_DONATION}
            className="btn-primary px-12 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Heart className="h-5 w-5 mr-2" />
                Donate {finalAmount >= MIN_DONATION ? formatCurrency(finalAmount) : ''}
              </>
            )}
          </button>
          
          <p className="text-sm text-soft-500 mt-4">
            🔒 Secure payment • 80G tax benefits available
          </p>
        </motion.div>
      </form>
    </div>
  );
};

export default DonationForm;