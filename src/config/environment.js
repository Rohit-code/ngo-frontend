// config/environment.js
const config = {
    development: {
      API_URL: 'http://localhost:5002/api',
      BASE_URL: 'http://localhost:5002',
      STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
      DEBUG: true
    },
    production: {
      API_URL: 'https://infantnog.up.railway.app/api',
      BASE_URL: 'https://infantnog.up.railway.app',
      STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
      DEBUG: false
    }
  };
  
  export default config[import.meta.env.MODE || 'development'];