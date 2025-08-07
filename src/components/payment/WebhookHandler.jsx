// components/payment/WebhookHandler.jsx - Handle webhook responses
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { donationService } from '../../services/donationService';

const WebhookHandler = ({ paymentIntentId, onComplete, onError }) => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing payment...');

  useEffect(() => {
    if (!paymentIntentId) return;

    const checkPaymentStatus = async () => {
      try {
        // Poll for payment confirmation
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds
        
        const pollStatus = async () => {
          attempts++;
          
          try {
            const response = await donationService.confirmPayment(paymentIntentId);
            
            if (response.success) {
              setStatus('success');
              setMessage('Payment completed successfully!');
              onComplete(response.data);
              return;
            }
          } catch (error) {
            // Continue polling unless max attempts reached
            if (attempts >= maxAttempts) {
              setStatus('error');
              setMessage('Payment confirmation timed out. Please contact support.');
              onError(new Error('Payment confirmation timeout'));
              return;
            }
          }

          // Continue polling
          if (attempts < maxAttempts) {
            setTimeout(pollStatus, 1000); // Check every second
          }
        };

        pollStatus();
      } catch (error) {
        setStatus('error');
        setMessage('Payment confirmation failed. Please contact support.');
        onError(error);
      }
    };

    checkPaymentStatus();
  }, [paymentIntentId, onComplete, onError]);

  const getIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      default:
        return <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />;
    }
  };

  const getColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`border rounded-xl p-6 text-center ${getColor()}`}
    >
      <div className="flex items-center justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="font-semibold mb-2">Payment Status</h3>
      <p className="text-sm">{message}</p>
      
      {status === 'processing' && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 30, ease: 'linear' }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            This may take up to 30 seconds...
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default WebhookHandler;