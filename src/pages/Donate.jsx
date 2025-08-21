// pages/Donate.jsx - ENHANCED VERSION
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Heart, Shield, Award, Users, Globe, CreditCard,
  CheckCircle, Info, Star, TrendingUp
} from 'lucide-react';

// Components
import DonationForm from '../components/donation/DonationForm';
import HealthStatusIndicator from '../components/health/HealthStatusIndicator';
import { InlineLoading } from '../components/common/Loading';

// Services
import { campaignService } from '../services/campaignService';

// Utils
import { NGO_INFO, SUPPORTED_COUNTRIES } from '../utils/constants';
import { 
  formatCurrency, 
  calculateProgress, 
  formatDate,
  getImpactMessage 
} from '../utils/helpers';

const Donate = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonations: 15847,
    totalAmount: 2547893,
    childrenHelped: 5241,
    countries: 12
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const response = await campaignService.getFeaturedCampaigns();
      if (response.success) {
        setCampaigns(response.data.campaigns || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const trustIndicators = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'All donations are processed through secure, encrypted payment gateways powered by Stripe',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Award,
      title: 'Tax Benefits',
      description: 'Tax benefits available for eligible donors. Please consult your local tax advisor.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Users,
      title: 'Direct Impact',
      description: 'Your contribution directly reaches children and families in need across multiple countries',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Globe,
      title: 'International Support',
      description: 'Accept donations from multiple countries with local currency support',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    }
  ];

  const impactStats = [
    {
      amount: '₹200',
      description: 'Can provide basic care for 1 week',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      amount: '₹1000',
      description: 'Can provide healthcare for 1 month',
      color: 'text-accent-600',
      bgColor: 'bg-accent-50'
    },
    {
      amount: '₹5000',
      description: 'Can support complete care for 2 months',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Donate Now - {NGO_INFO.name}</title>
        <meta 
          name="description" 
          content={`Make an international donation to ${NGO_INFO.name} and help support infants and children worldwide. Secure payments with Stripe. Tax benefits available for eligible donors.`}
        />
        <meta 
          name="keywords" 
          content="donate, infant NGO, child donation, international donation, tax benefits, secure donation, online donation, Stripe payment"
        />
        <meta property="og:title" content={`Donate Now - ${NGO_INFO.name}`} />
        <meta property="og:description" content="Make a difference in the lives of infants and children worldwide with your generous donation." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.jpg" />
        <link rel="canonical" href={`${window.location.origin}/donate`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-warm-50 via-primary-50 to-accent-50">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-soft-900 mb-6">
                Make a <span className="text-gradient">Donation</span>
              </h1>
              <p className="text-lg md:text-xl text-soft-700 max-w-3xl mx-auto mb-8">
                Your generous contribution helps us provide essential care, nutrition, 
                and support to infants and children who need it most across the globe.
              </p>

              {/* Live Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
                {[
                  { label: 'Total Donations', value: stats.totalDonations.toLocaleString(), icon: Heart },
                  { label: 'Amount Raised', value: formatCurrency(stats.totalAmount, 'INR'), icon: TrendingUp },
                  { label: 'Children Helped', value: stats.childrenHelped.toLocaleString(), icon: Users },
                  { label: 'Countries', value: stats.countries, icon: Globe }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-soft-200"
                  >
                    <stat.icon className="h-6 w-6 md:h-8 md:w-8 text-primary-500 mx-auto mb-2" />
                    <div className="text-xl md:text-3xl font-bold text-soft-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-soft-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-center text-soft-900 mb-4">
                Why Donate With Us?
              </h2>
              <p className="text-center text-soft-600 max-w-2xl mx-auto mb-8">
                Your donation is secure, impactful, and comes with benefits. Here's what makes us trustworthy:
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {trustIndicators.map((indicator, index) => (
                <motion.div
                  key={indicator.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 border border-soft-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-12 h-12 ${indicator.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <indicator.icon className={`h-6 w-6 ${indicator.color}`} />
                  </div>
                  <h3 className="font-semibold text-soft-900 mb-2">{indicator.title}</h3>
                  <p className="text-sm text-soft-600">{indicator.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Examples */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-soft-900 mb-4">
                Your Impact
              </h2>
              <p className="text-soft-600 max-w-2xl mx-auto">
                Every donation, no matter the size, makes a real difference in a child's life.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {impactStats.map((impact, index) => (
                <motion.div
                  key={impact.amount}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${impact.bgColor} rounded-xl p-6 border border-opacity-20 text-center`}
                >
                  <div className={`text-3xl font-bold ${impact.color} mb-2`}>
                    {impact.amount}
                  </div>
                  <p className={`text-sm font-medium ${impact.color.replace('600', '700')}`}>
                    {impact.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Campaigns */}
        {campaigns.length > 0 && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-soft-900 mb-4">
                  Featured Campaigns
                </h2>
                <p className="text-soft-600 max-w-2xl mx-auto">
                  Support specific campaigns that are making a difference right now.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {campaigns.slice(0, 3).map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                      selectedCampaign?.id === campaign.id 
                        ? 'border-primary-500 ring-2 ring-primary-200' 
                        : 'border-soft-200 hover:border-primary-300'
                    }`}
                    onClick={() => setSelectedCampaign(selectedCampaign?.id === campaign.id ? null : campaign)}
                  >
                    {campaign.image && (
                      <div className="h-48 bg-gradient-to-r from-primary-400 to-accent-400">
                        <img 
                          src={campaign.image} 
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-soft-900 mb-2">
                        {campaign.title}
                      </h3>
                      <p className="text-soft-600 text-sm mb-4 line-clamp-3">
                        {campaign.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-soft-600 mb-1">
                          <span>Raised: {formatCurrency(campaign.current_amount || 0, 'INR')}</span>
                          <span>Goal: {formatCurrency(campaign.target_amount, 'INR')}</span>
                        </div>
                        <div className="w-full bg-soft-200 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ 
                              width: `${Math.min((campaign.current_amount || 0) / campaign.target_amount * 100, 100)}%` 
                            }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                        <div className="text-xs text-soft-500 mt-1">
                          {Math.round((campaign.current_amount || 0) / campaign.target_amount * 100)}% completed
                        </div>
                      </div>

                      {selectedCampaign?.id === campaign.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="bg-primary-50 -mx-6 -mb-6 mt-4 p-4 border-t border-primary-200"
                        >
                          <div className="flex items-center text-sm text-primary-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span className="font-medium">Selected for donation</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Donation Form Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-center text-soft-900 mb-4">
                Start Your Donation
              </h2>
              <p className="text-center text-soft-600 max-w-2xl mx-auto">
                Complete the secure donation process in just a few simple steps.
              </p>
            </motion.div>

            {/* Selected Campaign Alert */}
            {selectedCampaign && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-primary-50 border border-primary-200 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="font-medium text-primary-800">
                      Donating to: {selectedCampaign.title}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedCampaign(null)}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    Change Campaign
                  </button>
                </div>
              </motion.div>
            )}

            <DonationForm selectedCampaign={selectedCampaign} />
          </div>
        </section>

        {/* System Status */}
        <section className="py-8 bg-soft-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HealthStatusIndicator />
          </div>
        </section>

        {/* International Support */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-soft-900 mb-4">
                International Donations Welcome
              </h2>
              <p className="text-soft-600 max-w-2xl mx-auto">
                We accept donations from supporters worldwide. Choose your country for localized payment options.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {SUPPORTED_COUNTRIES.map((country, index) => (
                <motion.div
                  key={country.code}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-4 text-center border border-soft-200 hover:border-primary-300 transition-all duration-300"
                >
                  <div className="text-2xl mb-2">
                    {country.code === 'IN' ? '🇮🇳' : 
                     country.code === 'US' ? '🇺🇸' : 
                     country.code === 'GB' ? '🇬🇧' : 
                     country.code === 'CA' ? '🇨🇦' : 
                     country.code === 'AU' ? '🇦🇺' :
                     country.code === 'SG' ? '🇸🇬' : '🌍'}
                  </div>
                  <div className="font-semibold text-sm text-soft-900">{country.name}</div>
                  <div className="text-xs text-soft-600">{country.currency}</div>
                  {country.tax_benefit && (
                    <div className="text-xs text-green-600 font-medium mt-1">Tax Benefits</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Every Child Deserves a Bright Future
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Your donation today will help us continue our mission to support 
                infants and children worldwide with healthcare, education, and nutrition.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => document.querySelector('#donation-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors duration-200"
                >
                  Donate Now
                </button>
                <a
                  href="/about"
                  className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Donate;