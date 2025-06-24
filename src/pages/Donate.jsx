import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Heart, Shield, Award, Users, Target } from 'lucide-react';
import DonationForm from '../components/donation/DonationForm';
import { campaignService } from '../services/campaignService';
import { NGO_INFO } from '../utils/constants';
import { formatCurrency, calculateProgress } from '../utils/helpers';

const Donate = () => {
  const [searchParams] = useSearchParams();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(false);
  
  const campaignId = searchParams.get('campaign');

  // Load specific campaign if ID is provided
  useEffect(() => {
    if (campaignId) {
      fetchCampaign(campaignId);
    }
  }, [campaignId]);

  const fetchCampaign = async (id) => {
    try {
      setIsLoadingCampaign(true);
      const response = await campaignService.getCampaignById(id);
      setSelectedCampaign(response.data.campaign);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setIsLoadingCampaign(false);
    }
  };

  const trustFactors = [
    {
      icon: Shield,
      title: 'Secure Donations',
      description: 'Your donations are processed through secure, encrypted payment gateways'
    },
    {
      icon: Award,
      title: '80G Tax Benefits',
      description: 'Get up to 50% tax exemption under Section 80G of Income Tax Act'
    },
    {
      icon: Users,
      title: 'Direct Impact',
      description: 'Your contribution directly reaches children and families in need'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Donate Now - {NGO_INFO.name}</title>
        <meta 
          name="description" 
          content={`Make a donation to ${NGO_INFO.name} and help support infants and children. Get 80G tax exemption benefits on your contribution.`}
        />
        <meta 
          name="keywords" 
          content="donate, infant NGO, child donation, 80G tax exemption, secure donation, online donation"
        />
        <meta property="og:title" content={`Donate Now - ${NGO_INFO.name}`} />
        <meta property="og:description" content="Make a difference in the lives of infants and children with your generous donation." />
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
            <p className="text-body max-w-2xl mx-auto">
              Your generous contribution helps us provide essential care, nutrition, 
              and support to infants and children who need it most.
            </p>
          </motion.div>

          {/* Selected Campaign Info */}
          {selectedCampaign && (
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
                  <p className="text-soft-600 mb-4">
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
              <DonationForm selectedCampaign={selectedCampaign} />
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
                  Your Impact
                </h3>
                
                <div className="space-y-4">
                  <div className="text-center p-4 bg-warm-50 rounded-xl">
                    <div className="text-2xl font-bold text-primary-600 mb-1">₹200</div>
                    <div className="text-xs text-soft-600">Can provide basic care for 1 week</div>
                  </div>
                  
                  <div className="text-center p-4 bg-warm-50 rounded-xl">
                    <div className="text-2xl font-bold text-accent-600 mb-1">₹1000</div>
                    <div className="text-xs text-soft-600">Can provide healthcare for 1 month</div>
                  </div>
                  
                  <div className="text-center p-4 bg-warm-50 rounded-xl">
                    <div className="text-2xl font-bold text-secondary-600 mb-1">₹5000</div>
                    <div className="text-xs text-soft-600">Can support complete care for 2 months</div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Support */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-soft-900 mb-4">
                  Need Help?
                </h3>
                <p className="text-soft-600 text-sm mb-4">
                  Have questions about donating? Our team is here to help.
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
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Donate;