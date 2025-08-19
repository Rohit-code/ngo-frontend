// components/home/FeaturedCampaigns.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Users, Target, ArrowRight, Calendar, MapPin, Loader2 } from 'lucide-react';
import { campaignService } from '../../services/campaignService';
import { formatCurrency, calculateProgress, formatDate, getDaysRemaining, getCampaignStatus, getImpactMessage} from '../../utils/helpers';
import { CardSkeleton } from '../common/Loading';
import toast from 'react-hot-toast';

const FeaturedCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCampaigns();
  }, []);

  const fetchFeaturedCampaigns = async () => {
    try {
      setIsLoading(true);
      const response = await campaignService.getFeaturedCampaigns();
      
      // Handle different response structures
      if (response?.success) {
        setCampaigns(response.data?.campaigns || []);
      } else if (response?.data?.campaigns) {
        setCampaigns(response.data.campaigns);
      } else if (Array.isArray(response?.data)) {
        setCampaigns(response.data);
      } else {
        setCampaigns([]);
      }
    } catch (error) {
      console.error('Error fetching featured campaigns:', error);
      // Don't show error toast for missing campaigns
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-20 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-warm-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-warm-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Don't render section if no campaigns
  if (!campaigns || campaigns.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-warm-50 via-primary-50/30 to-secondary-50/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-primary-100/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-soft-900 mb-4">
            Featured <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent drop-shadow-sm">Campaigns</span>
          </h2>
          <p className="text-lg text-soft-600 max-w-2xl mx-auto">
            Support our active campaigns and make a direct impact on the lives of 
            infants and children who need our help the most.
          </p>
        </motion.div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {campaigns.slice(0, 6).map((campaign, index) => (
            <CampaignCard key={campaign.id} campaign={campaign} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link
            to="/campaigns"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:via-secondary-700 hover:to-accent-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2 relative overflow-hidden group"
          >
            View All Campaigns
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// Campaign Card Component
const CampaignCard = ({ campaign, index }) => {
  const progress = calculateProgress(
    campaign.current_amount || campaign.raised_amount || 0, 
    campaign.target_amount || 0
  );
  const donationCount = campaign.donation_count || campaign.donors_count || 0;
  const daysRemaining = getDaysRemaining(campaign.end_date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white/90 backdrop-blur-md rounded-2xl shadow-glass hover:shadow-glass-hover transition-all duration-300 overflow-hidden group border border-white/20"
    >
      {/* Campaign Image */}
      <div className="relative h-48 overflow-hidden">
        {campaign.image_url || campaign.image ? (
          <img
            src={campaign.image_url || campaign.image}
            alt={campaign.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-400 via-accent-400 to-secondary-400 flex items-center justify-center">
            <Heart className="h-16 w-16 text-white opacity-80" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            campaign.status === 'active' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-warm-100 text-warm-700'
          }`}>
            {campaign.status === 'active' ? 'Active' : 'Completed'}
          </span>
        </div>

        {/* Progress Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-soft-700">
            {Math.round(progress)}% Funded
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-semibold text-soft-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
          {campaign.title}
        </h3>

        {/* Description */}
        <p className="text-soft-600 text-sm mb-4 line-clamp-3">
          {campaign.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-soft-700">
              Progress
            </span>
            <span className="text-sm text-soft-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-warm-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(progress, 100)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
            />
          </div>
        </div>

        {/* Funding Information */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-soft-500 mb-1">Raised</p>
            <p className="font-semibold text-soft-900">
              {formatCurrency(campaign.current_amount || campaign.raised_amount || 0, 'INR')}
            </p>
          </div>
          <div>
            <p className="text-xs text-soft-500 mb-1">Goal</p>
            <p className="font-semibold text-soft-900">
              {formatCurrency(campaign.target_amount || 0, 'INR')}
            </p>
          </div>
        </div>

        {/* Campaign Stats */}
        <div className="flex items-center justify-between text-sm text-soft-600 mb-6">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{donationCount} donors</span>
          </div>
          {campaign.end_date && daysRemaining !== null && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {daysRemaining > 0 
                  ? `${daysRemaining} days left`
                  : 'Campaign ended'
                }
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            to={`/donate?campaign=${campaign.id}`}
            className="flex-1 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-center py-3 px-4 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all duration-300 flex items-center justify-center group"
          >
            <Heart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Donate Now
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-3 bg-soft-100 text-soft-600 rounded-xl hover:bg-soft-200 transition-colors"
            onClick={() => {
              // Could add campaign details modal or navigation
              console.log('View campaign details:', campaign.id);
            }}
            title="View Details"
          >
            <Target className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedCampaigns;