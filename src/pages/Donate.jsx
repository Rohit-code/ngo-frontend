import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Heart, Shield, Award, Users, Target, Globe, CreditCard } from 'lucide-react';
import StripeWrapper from '../components/common/StripeWrapper';
import DonationForm from '../components/donation/DonationForm';
import { campaignService } from '../services/campaignService';
import { donationService } from '../services/donationService';
import { NGO_INFO, SUPPORTED_COUNTRIES } from '../utils/constants';
import { formatCurrency, calculateProgress } from '../utils/helpers';

const Donate = () => {
  const [searchParams] = useSearchParams();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [supportedCountries, setSupportedCountries] = useState([]);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  
  const campaignId = searchParams.get('campaign');
  const preselectedAmount = searchParams.get('amount');
  const preselectedType = searchParams.get('type');

  // Load specific campaign if ID is provided
  useEffect(() => {
    if (campaignId) {
      fetchCampaign(campaignId);
    }
  }, [campaignId]);

  // Load supported countries
  useEffect(() => {
    fetchSupportedCountries();
  }, []);

  const fetchCampaign = async (id) => {
    try {
      setIsLoadingCampaign(true);
      const response = await campaignService.getCampaignById(id);
      if (response.success) {
        setSelectedCampaign(response.data.campaign);
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setIsLoadingCampaign(false);
    }
  };

  const fetchSupportedCountries = async () => {
    try {
      const response = await donationService.getSupportedCountries();
      if (response.success) {
        setSupportedCountries(response.data.supported_countries);
      } else {
        // Fallback to static countries if API fails
        setSupportedCountries(SUPPORTED_COUNTRIES);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      // Fallback to static countries
      setSupportedCountries(SUPPORTED_COUNTRIES);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const trustFactors = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Your donations are processed through secure, encrypted payment gateways powered by Stripe'
    },
    {
      icon: Award,
      title: '80G Tax Benefits',
      description: 'Indian donors get up to 50% tax exemption under Section 80G of Income Tax Act'
    },
    {
      icon: Users,
      title: 'Direct Impact',
      description: 'Your contribution directly reaches children and families in need across multiple countries'
    },
    {
      icon: Globe,
      title: 'International Support',
      description: 'Accept donations from multiple countries with local currency support'
    }
  ];

  const impactStats = [
    {
      amount: '₹200',
      description: 'Can provide basic care for 1 week',
      color: 'text-primary-600'
    },
    {
      amount: '₹1000',
      description: 'Can provide healthcare for 1 month',
      color: 'text-accent-600'
    },
    {
      amount: '₹5000',
      description: 'Can support complete care for 2 months',
      color: 'text-secondary-600'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Donate Now - {NGO_INFO.name}</title>
        <meta 
          name="description" 
          content={`Make an international donation to ${NGO_INFO.name} and help support infants and children worldwide. Secure payments with Stripe. Get 80G tax exemption benefits for Indian donors.`}
        />
        <meta 
          name="keywords" 
          content="donate, infant NGO, child donation, international donation, 80G tax exemption, secure donation, online donation, Stripe payment"
        />
        <meta property="og:title" content={`Donate Now - ${NGO_INFO.name}`} />
        <meta property="og:description" content="Make a difference in the lives of infants and children worldwide with your generous donation." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-warm-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="heading-lg mb-4">
              Make a <span className="text-gradient">Donation</span>
            </h1>
            <p className="text-body max-w-2xl mx-auto mb-6">
              Your generous contribution helps us provide essential care, nutrition, 
              and support to infants and children who need it most across the globe.
            </p>
            
            {/* International Support Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-full mb-4">
              <Globe className="h-4 w-4 text-primary-600 mr-2" />
              <span className="text-sm font-medium text-primary-800">
                Supporting {supportedCountries.length}+ Countries
              </span>
            </div>

            {/* Supported Countries Preview */}
            {!isLoadingCountries && supportedCountries.length > 0 && (
              <div className="flex justify-center items-center space-x-4 text-sm text-soft-600">
                <span>We accept:</span>
                {supportedCountries.slice(0, 4).map((country, index) => (
                  <div key={country.code} className="flex items-center space-x-1">
                    <span className="font-medium">{country.currency_symbol}</span>
                    <span>{country.currency}</span>
                  </div>
                ))}
                {supportedCountries.length > 4 && (
                  <span className="text-primary-600">+{supportedCountries.length - 4} more</span>
                )}
              </div>
            )}
          </motion.div>

          {/* Selected Campaign Info */}
          {selectedCampaign && !isLoadingCampaign && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 mb-8"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-warm rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-soft-900 mb-2">
                    Supporting: {selectedCampaign.title}
                  </h3>
                  <p className="text-soft-600 mb-4 line-clamp-2">
                    {selectedCampaign.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-soft-500">Target:</span>
                      <div className="font-semibold text-soft-900">
                        {formatCurrency(selectedCampaign.target_amount)}
                      </div>
                    </div>
                    <div>
                      <span className="text-soft-500">Raised:</span>
                      <div className="font-semibold text-soft-900">
                        {formatCurrency(selectedCampaign.raised_amount || 0)}
                      </div>
                    </div>
                    <div>
                      <span className="text-soft-500">Progress:</span>
                      <div className="font-semibold text-soft-900">
                        {Math.round(calculateProgress(selectedCampaign.raised_amount || 0, selectedCampaign.target_amount))}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Main Donation Form */}
            <div className="lg:col-span-3">
              <StripeWrapper>
                <DonationForm 
                  selectedCampaign={selectedCampaign}
                  preselectedAmount={preselectedAmount}
                  preselectedType={preselectedType}
                  supportedCountries={supportedCountries}
                />
              </StripeWrapper>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Trust Factors */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-soft-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-primary-500 mr-2" />
                  Why Donate With Us
                </h3>
                
                <div className="space-y-4">
                  {trustFactors.map((factor, index) => (
                    <div key={factor.title} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <factor.icon className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-soft-900 text-sm mb-1">
                          {factor.title}
                        </h4>
                        <p className="text-soft-600 text-xs leading-relaxed">
                          {factor.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Impact Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-soft-900 mb-4 flex items-center">
                  <Heart className="h-5 w-5 text-accent-500 mr-2" />
                  Your Impact (INR)
                </h3>
                
                <div className="space-y-4">
                  {impactStats.map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-warm-50 rounded-xl">
                      <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                        {stat.amount}
                      </div>
                      <div className="text-xs text-soft-600">
                        {stat.description}
                      </div>
                    </div>
                  ))}
                </div>

                {/* International Impact Note */}
                <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="h-4 w-4 text-primary-600" />
                    <span className="text-sm font-medium text-primary-800">International Donors</span>
                  </div>
                  <p className="text-xs text-primary-700">
                    Amounts will be converted to your local currency. Impact remains the same worldwide!
                  </p>
                </div>
              </motion.div>

              {/* Payment Security */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-soft-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 text-primary-500 mr-2" />
                  Secure Payments
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">S</span>
                    </div>
                    <span className="text-sm text-soft-700">Powered by Stripe</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-xs">🔒</span>
                    </div>
                    <span className="text-sm text-soft-700">256-bit SSL Encryption</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                      <span className="text-xs">💳</span>
                    </div>
                    <span className="text-sm text-soft-700">PCI DSS Compliant</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                      <span className="text-xs">🌍</span>
                    </div>
                    <span className="text-sm text-soft-700">Multi-currency Support</span>
                  </div>
                </div>
              </motion.div>

              {/* Contact Support */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-soft-900 mb-4">
                  Need Help?
                </h3>
                <p className="text-soft-600 text-sm mb-4">
                  Have questions about donating? Our team is here to help with international donations.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-soft-500">📞</span>
                    <span className="text-soft-700">{NGO_INFO.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-soft-500">✉️</span>
                    <span className="text-soft-700">{NGO_INFO.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-soft-500">🕐</span>
                    <span className="text-soft-700">24/7 Support Available</span>
                  </div>
                </div>
              </motion.div>

              {/* Quick Donation CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="card p-6 bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200"
              >
                <h3 className="text-lg font-semibold text-soft-900 mb-4 flex items-center">
                  <Heart className="h-5 w-5 text-primary-500 mr-3" />
                  Ready to Make a Difference?
                </h3>
                <p className="text-soft-600 text-sm mb-4">
                  Don't wait to help! Your donation can start making an impact today across the globe.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="btn-primary text-xs py-2 px-3"
                  >
                    ₹1000
                  </button>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="btn-primary text-xs py-2 px-3"
                  >
                    ₹5000
                  </button>
                </div>
                <motion.a
                  href="/campaigns"
                  className="btn-secondary w-full justify-center text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View All Campaigns
                </motion.a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Donate;