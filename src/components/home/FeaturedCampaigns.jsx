import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Users, Target, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { campaignService } from '../../services/campaignService';
import { formatCurrency, calculateProgress, formatDate } from '../../utils/helpers';
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
      const response = await campaignService.getFeaturedCampaigns();
      // Handle the response structure correctly
      const campaigns = response?.data?.campaigns || [];
      setCampaigns(campaigns);
    } catch (error) {
      console.error('Error fetching featured campaigns:', error);
      toast.error('Failed to load campaigns');
      setCampaigns([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-warm-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-warm-200 rounded w-96 mx-auto"></div>
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

  return (
    <section className="py-20 bg-warm-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4">
            Featured <span className="text-gradient">Campaigns</span>
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Support our active campaigns and make a direct impact on the lives of 
            infants and children who need our help the most.
          </p>
        </motion.div>

        {/* Campaigns Grid */}
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign, index) => (
              <CampaignCard 
                key={campaign.id} 
                campaign={campaign} 
                index={index} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-warm-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-12 w-12 text-warm-400" />
            </div>
            <h3 className="text-xl font-semibold text-soft-900 mb-2">
              No Active Campaigns
            </h3>
            <p className="text-soft-600 mb-6">
              We're preparing new campaigns to help more children. Check back soon!
            </p>
            <Link to="/donate" className="btn-primary">
              <Heart className="h-4 w-4 mr-2" />
              Make a General Donation
            </Link>
          </div>
        )}

        {/* View All Link */}
        {campaigns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link
              to="/campaigns"
              className="btn-secondary group"
            >
              View All Campaigns
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

// Campaign Card Component
const CampaignCard = ({ campaign, index }) => {
  const progress = calculateProgress(campaign.raised_amount || 0, campaign.target_amount);
  const donationCount = campaign.donation_count || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="card group cursor-pointer overflow-hidden"
    >
      {/* Campaign Image */}
      <div className="relative h-48 bg-gradient-warm overflow-hidden">
        {campaign.image_url ? (
          <img
            src={campaign.image_url}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-warm flex items-center justify-center">
            <Heart className="h-16 w-16 text-white opacity-80" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            campaign.status === 'active' 
              ? 'bg-accent-100 text-accent-700' 
              : 'bg-warm-100 text-warm-700'
          }`}>
            {campaign.status === 'active' ? 'Active' : 'Completed'}
          </span>
        </div>

        {/* Progress Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-soft-700">
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
              {formatCurrency(campaign.raised_amount || 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-soft-500 mb-1">Goal</p>
            <p className="font-semibold text-soft-900">
              {formatCurrency(campaign.target_amount)}
            </p>
          </div>
        </div>

        {/* Campaign Stats */}
        <div className="flex items-center justify-between text-sm text-soft-600 mb-6">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{donationCount} donors</span>
          </div>
          {campaign.end_date && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Ends {formatDate(campaign.end_date, 'MMM dd')}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            to={`/donate?campaign=${campaign.id}`}
            className="flex-1 btn-primary text-center"
          >
            <Heart className="h-4 w-4 mr-2" />
            Donate
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-soft-100 text-soft-600 rounded-xl hover:bg-soft-200 transition-colors"
            onClick={() => {
              // Add campaign details modal or navigation
              console.log('View campaign details:', campaign.id);
            }}
          >
            <Target className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedCampaigns;