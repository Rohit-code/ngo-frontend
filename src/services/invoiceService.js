// services/invoiceService.js
import api from './api';
import toast from 'react-hot-toast';

export const invoiceService = {
  /**
   * Get all invoices with pagination
   */
  getInvoices: async (params = {}) => {
    try {
      const response = await api.get('/invoices', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get invoice by ID
   */
  getInvoiceById: async (invoiceId) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Download invoice PDF
   */
  downloadInvoice: async (invoiceId) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/download`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      
      // Create blob URL and trigger download
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded successfully');
      return { success: true };
    } catch (error) {
      toast.error('Failed to download invoice');
      throw error;
    }
  },

  /**
   * Resend invoice email
   */
  resendInvoiceEmail: async (invoiceId) => {
    try {
      const response = await api.post(`/invoices/${invoiceId}/resend`);
      if (response.success) {
        toast.success('Invoice email sent successfully');
      }
      return response;
    } catch (error) {
      toast.error('Failed to send invoice email');
      throw error;
    }
  },

  /**
   * Regenerate invoice (admin only)
   */
  regenerateInvoice: async (invoiceId) => {
    try {
      const response = await api.post(`/invoices/${invoiceId}/regenerate`);
      if (response.success) {
        toast.success('Invoice regenerated successfully');
      }
      return response;
    } catch (error) {
      toast.error('Failed to regenerate invoice');
      throw error;
    }
  }
};