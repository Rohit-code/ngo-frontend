import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, FileText, CheckCircle } from 'lucide-react';
import { invoiceService } from '../../services/invoiceService';
import { formatDate } from '../../utils/helpers';

const InvoiceCard = ({ invoice, compact = false }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await invoiceService.downloadInvoice(invoice.id);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      setIsSending(true);
      await invoiceService.resendInvoiceEmail(invoice.id);
    } catch (error) {
      console.error('Resend error:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-green-900">Invoice Generated</h4>
              <p className="text-sm text-green-700">
                {invoice.invoice_number} • {formatDate(invoice.invoice_date)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
            </button>
            
            {!invoice.email_sent && (
              <button
                onClick={handleResendEmail}
                disabled={isSending}
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <Mail className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        {invoice.tax_exemption_applicable && (
          <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
            ✓ Tax benefits available
          </div>
        )}
      </motion.div>
    );
  }

  // Full card version
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-primary-500" />
          <div>
            <h4 className="text-lg font-semibold text-soft-900">
              {invoice.invoice_number}
            </h4>
            <p className="text-soft-600">Generated on {formatDate(invoice.invoice_date)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </motion.button>
          
          {!invoice.email_sent && (
            <motion.button
              onClick={handleResendEmail}
              disabled={isSending}
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="h-4 w-4 mr-2" />
              {isSending ? 'Sending...' : 'Email'}
            </motion.button>
          )}
        </div>
      </div>
      
      {invoice.tax_exemption_applicable && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-900">Tax Benefits Available</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Tax benefits are available for this donation. Please consult your local tax advisor for details.
          </p>
        </div>
      )}
    </div>
  );
};

export default InvoiceCard;