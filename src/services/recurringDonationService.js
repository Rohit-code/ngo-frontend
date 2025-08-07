// services/recurringDonationService.js
import api from './api';
import toast from 'react-hot-toast';

const handleApiError = (error) => {
  if (error.response?.status === 429) {
    throw new Error('Too many requests. Please wait a moment and try again.');
  } else if (error.response?.status >= 500) {
    throw new Error('Server error. Please try again later.');
  } else if (!navigator.onLine) {
    throw new Error('Please check your internet connection.');
  }
  
  throw error;
};

const retryRequest = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      if (error.response?.status >= 500 || !navigator.onLine) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        continue;
      }
      
      throw error;
    }
  }
};

export const recurringDonationService = {
  /**
   * Create recurring donation
   */
  createRecurringDonation: async (donationData) => {
    return retryRequest(async () => {
      try {
        const response = await api.post('/donations/recurring', donationData);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get all recurring donations for a user
   */
  getRecurringDonations: async (params = {}) => {
    return retryRequest(async () => {
      try {
        const response = await api.get('/donations/recurring', { params });
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Get recurring donation by ID
   */
  getRecurringDonationById: async (donationId) => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/donations/${donationId}/recurring`);
        return response;
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Cancel recurring donation
   */
  cancelRecurringDonation: async (donationId, reason = '') => {
    return retryRequest(async () => {
      try {
        const response = await api.delete(`/donations/${donationId}/recurring`, {
          data: { cancellation_reason: reason }
        });
        
        if (response.success) {
          toast.success('Recurring donation cancelled successfully');
        }
        
        return response;
      } catch (error) {
        toast.error('Failed to cancel recurring donation');
        throw handleApiError(error);
      }
    });
  },

  /**
   * Update recurring donation
   */
  updateRecurringDonation: async (donationId, updateData) => {
    return retryRequest(async () => {
      try {
        const response = await api.patch(`/donations/${donationId}/recurring`, updateData);
        
        if (response.success) {
          toast.success('Recurring donation updated successfully');
        }
        
        return response;
      } catch (error) {
        toast.error('Failed to update recurring donation');
        throw handleApiError(error);
      }
    });
  },

  /**
   * Pause recurring donation
   */
  pauseRecurringDonation: async (donationId) => {
    return retryRequest(async () => {
      try {
        const response = await api.patch(`/donations/${donationId}/recurring/pause`);
        
        if (response.success) {
          toast.success('Recurring donation paused');
        }
        
        return response;
      } catch (error) {
        toast.error('Failed to pause recurring donation');
        throw handleApiError(error);
      }
    });
  },

  /**
   * Resume recurring donation
   */
  resumeRecurringDonation: async (donationId) => {
    return retryRequest(async () => {
      try {
        const response = await api.patch(`/donations/${donationId}/recurring/resume`);
        
        if (response.success) {
          toast.success('Recurring donation resumed');
        }
        
        return response;
      } catch (error) {
        toast.error('Failed to resume recurring donation');
        throw handleApiError(error);
      }
    });
  }
};

// components/recurring/RecurringDonationManager.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  CreditCard,
  Pause,
  Play,
  X,
  Edit3,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  RefreshCw,
  Heart
} from 'lucide-react';
import { recurringDonationService } from '../../services/recurringDonationService';
import { formatCurrency, formatDate, formatDonationType } from '../../utils/helpers';
import { InlineLoading } from '../common/Loading';
import toast from 'react-hot-toast';

const RecurringDonationManager = ({ userEmail = null }) => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchRecurringDonations();
  }, [userEmail]);

  const fetchRecurringDonations = async () => {
    try {
      setIsLoading(true);
      const params = userEmail ? { email: userEmail } : {};
      const response = await recurringDonationService.getRecurringDonations(params);
      
      if (response.success) {
        setDonations(response.data.donations || []);
      }
    } catch (error) {
      console.error('Error fetching recurring donations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (donationId) => {
    if (!showCancelModal) return;
    
    try {
      setActionLoading(prev => ({ ...prev, [donationId]: 'cancelling' }));
      await recurringDonationService.cancelRecurringDonation(donationId, cancelReason);
      await fetchRecurringDonations();
      setShowCancelModal(null);
      setCancelReason('');
    } catch (error) {
      console.error('Cancel error:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [donationId]: null }));
    }
  };

  const handlePause = async (donationId) => {
    try {
      setActionLoading(prev => ({ ...prev, [donationId]: 'pausing' }));
      await recurringDonationService.pauseRecurringDonation(donationId);
      await fetchRecurringDonations();
    } catch (error) {
      console.error('Pause error:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [donationId]: null }));
    }
  };

  const handleResume = async (donationId) => {
    try {
      setActionLoading(prev => ({ ...prev, [donationId]: 'resuming' }));
      await recurringDonationService.resumeRecurringDonation(donationId);
      await fetchRecurringDonations();
    } catch (error) {
      console.error('Resume error:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [donationId]: null }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return <InlineLoading message="Loading recurring donations..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-soft-900 flex items-center">
            <Heart className="h-5 w-5 text-primary-500 mr-2" />
            Recurring Donations
          </h3>
          <p className="text-soft-600 text-sm mt-1">
            Manage your recurring donation subscriptions
          </p>
        </div>
        <button
          onClick={fetchRecurringDonations}
          className="btn-secondary p-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Donations List */}
      {donations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Heart className="h-16 w-16 text-soft-400 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-soft-900 mb-2">
            No Recurring Donations
          </h4>
          <p className="text-soft-600 mb-6">
            You don't have any recurring donations set up yet.
          </p>
          <a href="/donate" className="btn-primary">
            <Heart className="h-4 w-4 mr-2" />
            Start a Recurring Donation
          </a>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {donations.map((donation, index) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary-600" />
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-soft-900 mb-1">
                      {formatCurrency(donation.amount, donation.currency)} {formatDonationType(donation.donation_type)}
                    </h4>
                    <p className="text-soft-600 text-sm">
                      {donation.campaign?.title || 'General Fund'}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-soft-500" />
                        <span className="text-xs text-soft-600">
                          Started: {formatDate(donation.created_at)}
                        </span>
                      </div>
                      {donation.next_payment_date && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-soft-500" />
                          <span className="text-xs text-soft-600">
                            Next: {formatDate(donation.next_payment_date)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(donation.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                      {donation.status?.charAt(0).toUpperCase() + donation.status?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              {donation.payment_method && (
                <div className="bg-soft-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-soft-500" />
                    <span className="text-sm text-soft-600">
                      {donation.payment_method.brand?.toUpperCase()} •••• {donation.payment_method.last4}
                    </span>
                    <span className="text-xs text-soft-500">
                      Expires {donation.payment_method.exp_month}/{donation.payment_method.exp_year}
                    </span>
                  </div>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-lg font-semibold text-primary-600">
                    {donation.payment_count || 0}
                  </div>
                  <div className="text-xs text-soft-600">Payments Made</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-primary-600">
                    {formatCurrency(donation.total_donated || 0, donation.currency)}
                  </div>
                  <div className="text-xs text-soft-600">Total Donated</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-primary-600">
                    {donation.failed_payments || 0}
                  </div>
                  <div className="text-xs text-soft-600">Failed Payments</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-primary-600">
                    {donation.remaining_payments || '∞'}
                  </div>
                  <div className="text-xs text-soft-600">Remaining</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3">
                {donation.status === 'active' && (
                  <motion.button
                    onClick={() => handlePause(donation.id)}
                    disabled={actionLoading[donation.id] === 'pausing'}
                    className="btn-secondary flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {actionLoading[donation.id] === 'pausing' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Pause className="h-4 w-4" />
                    )}
                    <span>Pause</span>
                  </motion.button>
                )}

                {donation.status === 'paused' && (
                  <motion.button
                    onClick={() => handleResume(donation.id)}
                    disabled={actionLoading[donation.id] === 'resuming'}
                    className="btn-accent flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {actionLoading[donation.id] === 'resuming' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    <span>Resume</span>
                  </motion.button>
                )}

                {(donation.status === 'active' || donation.status === 'paused') && (
                  <motion.button
                    onClick={() => setShowCancelModal(donation.id)}
                    className="btn-secondary text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCancelModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-soft-900">
                    Cancel Recurring Donation
                  </h3>
                  <p className="text-soft-600 text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-soft-700 mb-2">
                  Reason for cancellation (optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Help us improve by telling us why you're cancelling..."
                  rows={3}
                  className="form-input w-full resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowCancelModal(null)}
                  className="btn-secondary"
                >
                  Keep Donation
                </button>
                <button
                  onClick={() => handleCancel(showCancelModal)}
                  disabled={actionLoading[showCancelModal] === 'cancelling'}
                  className="btn-primary bg-red-500 hover:bg-red-600"
                >
                  {actionLoading[showCancelModal] === 'cancelling' ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel Donation
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecurringDonationManager;