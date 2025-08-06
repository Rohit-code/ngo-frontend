// config/environment.js
const config = {
    development: {
      API_URL: 'http://localhost:5002/api',
      STRIPE_PUBLISHABLE_KEY: process.env.VITE_STRIPE_PUBLISHABLE_KEY,
      DEBUG: true
    },
    production: {
      API_URL: 'https://api.infantngo.org/api',
      STRIPE_PUBLISHABLE_KEY: process.env.VITE_STRIPE_PUBLISHABLE_KEY,
      DEBUG: false
    }
  };
  
  export default config[process.env.NODE_ENV || 'development'];