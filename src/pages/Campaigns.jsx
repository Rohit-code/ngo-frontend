import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Heart, 
  Target, 
  Users, 
  Calendar, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { campaignService } from '../services/campaignService';
import { 
  formatCurrency, 
  calculateProgress, 
  formatDate,
  getDaysRemaining,
  getCampaignStatus 
} from '../utils/helpers';
import { CAMPAIGN_STATUS, NGO_INFO } from '../utils/constants';
import { InlineLoading, CardSkeleton } from '../components/common/Loading';
import toast from 'react-hot-toast';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter, featuredFilter, searchTerm, currentPage]);

  const fetchCampaigns = async (page = 1) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const params = {
        page,
        limit: 9,
        status: statusFilter === 'all' ? undefined : statusFilter,
        featured: featuredFilter === 'all' ? undefined : featuredFilter === 'featured',
        search: searchTerm || undefined
      };

      const response = await campaignService.getCampaigns(params);
      
      // Handle the response structure correctly
      const { campaigns: newCampaigns } = response.data;
      const meta = response.meta || {}; // Use meta from response

      if (page === 1) {
        setCampaigns(newCampaigns || []);
      } else {
        setCampaigns(prev => [...prev, ...(newCampaigns || [])]);
      }

      setTotalPages(meta.total_pages || 1);
      setCurrentPage(meta.current_page || page);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Failed to load campaigns');
      // Set empty state on error
      setCampaigns([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCampaigns(1);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      fetchCampaigns(currentPage + 1);
    }
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'status') {
      setStatusFilter(value);
    } else if (filterType === 'featured') {
      setFeaturedFilter(value);
    }
    setCurrentPage(1);
  };

  return (
    <>
      <Helmet>
        <title>Campaigns - {NGO_INFO.name}</title>
        <meta 
          name="description" 
          content={`Discover and support active campaigns by ${NGO_INFO.name}. Help us reach our goals to support infants and children in need.`}
        />
        <meta 
          name="keywords" 
          content="campaigns, infant NGO campaigns, child welfare campaigns, donation campaigns, active fundraising"
        />
        <meta property="og:title" content={`Campaigns - ${NGO_INFO.name}`} />
        <meta property="og:description" content="Support our active campaigns and help make a difference in the lives of infants and children." />
      </Helmet>

      <div className="min-h-screen bg-warm-50">
        
        {/* Header */}
        <section className="py-16 bg-gradient-to-br from-primary-50 via-warm-50 to-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="heading-lg mb-4">
                Our <span className="text-gradient">Campaigns</span>
              </h1>
              <p className="text-body max-w-2xl mx-auto">
                Join us in supporting specific causes that directly impact the lives 
                of infants and children. Every contribution brings us closer to our goals.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 bg-white border-b border-warm-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Search */}
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSearch}
                className="flex-1"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input w-full pl-12"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-soft-400" />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 btn-primary px-4 py-2 text-sm"
                  >
                    Search
                  </button>
                </div>
              </motion.form>

              {/* Filters */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-wrap gap-4"
              >
                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-soft-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="form-select text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>

                {/* Featured Filter */}
                <div className="flex items-center space-x-2">
                  <select
                    value={featuredFilter}
                    onChange={(e) => handleFilterChange('featured', e.target.value)}
                    className="form-select text-sm"
                  >
                    <option value="all">All Campaigns</option>
                    <option value="featured">Featured Only</option>
                    <option value="regular">Regular Only</option>
                  </select>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Campaigns Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            ) : campaigns.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {campaigns.map((campaign, index) => (
                    <CampaignCard 
                      key={campaign.id} 
                      campaign={campaign} 
                      index={index} 
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {currentPage < totalPages && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-12"
                  >
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="btn-secondary"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Load More Campaigns
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-warm-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-12 w-12 text-warm-400" />
                </div>
                <h3 className="text-xl font-semibold text-soft-900 mb-4">
                  No Campaigns Found
                </h3>
                <p className="text-soft-600 mb-8 max-w-md mx-auto">
                  {searchTerm 
                    ? `No campaigns match your search "${searchTerm}". Try different keywords or filters.`
                    : 'We don\'t have any campaigns matching your current filters. Try adjusting your search criteria.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('active');
                      setFeaturedFilter('all');
                      setCurrentPage(1);
                    }}
                    className="btn-secondary"
                  >
                    Clear Filters
                  </button>
                  <Link to="/donate" className="btn-primary">
                    <Heart className="h-4 w-4 mr-2" />
                    Make General Donation
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </>
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
            loading="lazy"
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
              : campaign.status === 'completed'
              ? 'bg-green-100 text-green-700'
              : 'bg-warm-100 text-warm-700'
          }`}>
            {campaign.status ? campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1) : 'Active'}
          </span>
        </div>

        {/* Featured Badge */}
        {campaign.is_featured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
              Featured
            </span>
          </div>
        )}

        {/* Progress Badge */}
        <div className="absolute bottom-4 right-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-soft-700">
            {Math.round(progress)}% Funded
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-semibold text-soft-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
          {campaign.title || 'Campaign Title'}
        </h3>

        {/* Description */}
        <p className="text-soft-600 text-sm mb-4 line-clamp-3">
          {campaign.description || 'Campaign description...'}
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
              {formatCurrency(campaign.target_amount || 0)}
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

        {/* Action Button */}
        <Link
          to={`/donate?campaign=${campaign.id}`}
          className="btn-primary w-full justify-center group"
        >
          <Heart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Support This Campaign
        </Link>
      </div>
    </motion.div>
  );
};

export default Campaigns;