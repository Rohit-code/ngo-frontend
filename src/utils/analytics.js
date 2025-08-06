// utils/analytics.js
const analytics = {
    track: (event, properties = {}) => {
      if (typeof gtag !== 'undefined') {
        gtag('event', event, {
          custom_map: { donation_amount: 'value' },
          ...properties
        });
      }
      
      if (typeof fbq !== 'undefined') {
        fbq('track', event, properties);
      }
    },
    
    trackDonation: (amount, currency = 'INR', campaignId = null) => {
      analytics.track('donation_completed', {
        value: amount,
        currency: currency,
        campaign_id: campaignId
      });
    }
  };
  
  export default analytics;