import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Mail, 
  RefreshCw, 
  Eye, 
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { invoiceService } from '../../services/invoiceService';
import { formatCurrency, calculateProgress, formatDate, getDaysRemaining, getCampaignStatus, getImpactMessage} from '../../utils/helpers';
import { InlineLoading } from '../common/Loading';
import toast from 'react-hot-toast';

const InvoiceManager = ({ donationId = null }) => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchInvoices();
  }, [donationId]);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const params = donationId ? { donation_id: donationId } : {};
      const response = await invoiceService.getInvoices(params);
      
      if (response.success) {
        setInvoices(response.data.invoices || []);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (invoiceId) => {
    try {
      setActionLoading(prev => ({ ...prev, [invoiceId]: 'downloading' }));
      await invoiceService.downloadInvoice(invoiceId);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [invoiceId]: null }));
    }
  };

  const handleResendEmail = async (invoiceId) => {
    try {
      setActionLoading(prev => ({ ...prev, [invoiceId]: 'sending' }));
      await invoiceService.resendInvoiceEmail(invoiceId);
    } catch (error) {
      console.error('Resend error:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [invoiceId]: null }));
    }
  };

  const handleRegenerate = async (invoiceId) => {
    try {
      setActionLoading(prev => ({ ...prev, [invoiceId]: 'regenerating' }));
      await invoiceService.regenerateInvoice(invoiceId);
      await fetchInvoices(); // Refresh list
    } catch (error) {
      console.error('Regenerate error:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [invoiceId]: null }));
    }
  };

  const getStatusIcon = (invoice) => {
    if (invoice.email_sent) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = (invoice) => {
    return invoice.email_sent ? 'Email Sent' : 'Pending Email';
  };

  if (isLoading) {
    return <InlineLoading message="Loading invoices..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-soft-900 flex items-center">
          <FileText className="h-5 w-5 text-primary-500 mr-2" />
          Invoice Management
        </h3>
        <button
          onClick={fetchInvoices}
          className="btn-secondary p-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Invoices List */}
      {invoices.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-soft-400 mx-auto mb-4" />
          <p className="text-soft-600">No invoices found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-soft-900">
                    {invoice.invoice_number}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-soft-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(invoice.invoice_date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(invoice)}
                      <span>{getStatusText(invoice)}</span>
                    </div>
                    {invoice.tax_exemption_applicable && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Tax Benefits
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-soft-900">
                    {formatCurrency(invoice.donation?.amount || 0, invoice.donation?.currency)}
                  </div>
                  <div className="text-sm text-soft-600">
                    {invoice.donation?.donation_type === 'monthly' ? 'Monthly' : 'One-time'}
                  </div>
                </div>
              </div>

              {/* Donation Details */}
              {invoice.donation && (
                <div className="bg-warm-50 rounded-lg p-4 mb-4">
                  <h5 className="font-medium text-soft-900 mb-2">Donation Details</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-soft-500">Donor:</span>
                      <div className="font-medium">{invoice.donation.donor?.full_name}</div>
                    </div>
                    <div>
                      <span className="text-soft-500">Email:</span>
                      <div className="font-medium">{invoice.donation.donor?.email}</div>
                    </div>
                    <div>
                      <span className="text-soft-500">Status:</span>
                      <div className="font-medium capitalize">{invoice.donation.payment_status}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3">
                <motion.button
                  onClick={() => handleDownload(invoice.id)}
                  disabled={actionLoading[invoice.id] === 'downloading'}
                  className="btn-secondary p-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {actionLoading[invoice.id] === 'downloading' ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </motion.button>

                <motion.button
                  onClick={() => handleResendEmail(invoice.id)}
                  disabled={actionLoading[invoice.id] === 'sending'}
                  className="btn-secondary p-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {actionLoading[invoice.id] === 'sending' ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                </motion.button>

                <motion.button
                  onClick={() => handleRegenerate(invoice.id)}
                  disabled={actionLoading[invoice.id] === 'regenerating'}
                  className="btn-secondary p-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {actionLoading[invoice.id] === 'regenerating' ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceManager;