// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

// Donation Types
export const DONATION_TYPES = {
  ONE_TIME: 'one_time',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
};

export const DONATION_TYPE_LABELS = {
  [DONATION_TYPES.ONE_TIME]: 'One Time',
  [DONATION_TYPES.MONTHLY]: 'Monthly',
  [DONATION_TYPES.QUARTERLY]: 'Quarterly',
  [DONATION_TYPES.YEARLY]: 'Yearly'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  NETBANKING: 'netbanking',
  WALLET: 'wallet',
  BANK_TRANSFER: 'bank_transfer'
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CARD]: 'Credit/Debit Card',
  [PAYMENT_METHODS.NETBANKING]: 'Net Banking',
  [PAYMENT_METHODS.WALLET]: 'Wallet',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Bank Transfer'
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// Campaign Status
export const CAMPAIGN_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  CANCELLED: 'cancelled'
};

// Supported Countries for International Donations
export const SUPPORTED_COUNTRIES = [
  {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    currency_symbol: '₹',
    tax_benefit: true,
    tax_section: 'Tax Benefits',
    min_donation: 50,
    address_format: ['address', 'city', 'state', 'pincode'],
    phone_validation: /^[6-9]\d{9}$/,
    postal_validation: /^[1-9][0-9]{5}$/
  },
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    currency_symbol: '$',
    tax_benefit: false,
    tax_section: null,
    min_donation: 1,
    address_format: ['address', 'city', 'state', 'zipcode'],
    phone_validation: /^[\+]?[1]?[\s\-\.]?\(?[0-9]{3}\)?[\s\-\.]?[0-9]{3}[\s\-\.]?[0-9]{4}$/,
    postal_validation: /^\d{5}(-\d{4})?$/
  },
  {
    code: 'EU',
    name: 'European Union',
    currency: 'EUR',
    currency_symbol: '€',
    tax_benefit: false,
    tax_section: null,
    min_donation: 1,
    address_format: ['address', 'city', 'state', 'postal_code'],
    phone_validation: /^(\+[3-9][0-9]|0)[0-9\s\-\(\)]{8,}$/,
    postal_validation: /^.{3,10}$/
  },
  {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    currency_symbol: 'C$',
    tax_benefit: false,
    tax_section: null,
    min_donation: 1,
    address_format: ['address', 'city', 'province', 'postal_code'],
    phone_validation: /^[\+]?[1]?[\s\-\.]?\(?[0-9]{3}\)?[\s\-\.]?[0-9]{3}[\s\-\.]?[0-9]{4}$/,
    postal_validation: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i
  },
  {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    currency_symbol: 'A$',
    tax_benefit: false,
    tax_section: null,
    min_donation: 1,
    address_format: ['address', 'city', 'state', 'postcode'],
    phone_validation: /^(\+61|0)[2-9]\d{8}$/,
    postal_validation: /^\d{4}$/
  },
  {
    code: 'SG',
    name: 'Singapore',
    currency: 'SGD',
    currency_symbol: 'S$',
    tax_benefit: false,
    tax_section: null,
    min_donation: 1,
    address_format: ['address', 'city', 'postal_code'],
    phone_validation: /^(\+65)?[689]\d{7}$/,
    postal_validation: /^\d{6}$/
  },
  {
    code: 'MY',
    name: 'Malaysia',
    currency: 'MYR',
    currency_symbol: 'RM',
    tax_benefit: false,
    tax_section: null,
    min_donation: 1,
    address_format: ['address', 'city', 'state', 'postcode'],
    phone_validation: /^(\+60|0)[1-9]\d{8}$/,
    postal_validation: /^\d{5}$/
  },

];

// Currency Information
export const CURRENCIES = {
  INR: { symbol: '₹', name: 'Indian Rupee', decimal_places: 0 },
  USD: { symbol: '$', name: 'US Dollar', decimal_places: 2 },
  EUR: { symbol: '€', name: 'Euro', decimal_places: 2 },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', decimal_places: 2 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', decimal_places: 2 },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', decimal_places: 2 },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit', decimal_places: 2 }
};

// Indian States
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

export const INDIAN_STATES_SIMPLE = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

// Impact messages based on donation amount (international support)
export const IMPACT_MESSAGES = {
  50: "Can provide basic care for an infant for 1 day",
  100: "Can provide nutritious meals for an infant for 1 week",
  200: "Can provide basic care for an infant for 1 week",
  500: "Can provide nutritious meals for an infant for 2 weeks",
  1000: "Can support basic healthcare for an infant for 1 month",
  2500: "Can provide educational materials for 3 infants for 3 months",
  5000: "Can support complete healthcare and nutrition for an infant for 2 months",
  10000: "Can provide comprehensive support for an infant for 3 months"
};

// International Impact Messages (USD)
export const INTERNATIONAL_IMPACT_MESSAGES = {
  1: "Can provide clean water for an infant for 1 day",
  5: "Can provide clean water for an infant for 1 week",
  10: "Can provide nutritious meals for an infant for 1 week",
  25: "Can support basic healthcare for an infant for 1 week",
  50: "Can provide educational materials for an infant for 1 month",
  100: "Can support complete care for an infant for 2 weeks",
  250: "Can provide comprehensive support for an infant for 1 month"
};

// Form validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  mobile: /^[6-9]\d{9}$/,
  international_mobile: /^[\+]?[\d\s\-\(\)]{8,}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  pincode: /^[1-9][0-9]{5}$/,
  us_zipcode: /^\d{5}(-\d{4})?$/,
  uk_postcode: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
  ca_postal: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
  de_postal: /^\d{5}$/,
  dk_postal: /^\d{4}$/
};

// Toast messages
export const TOAST_MESSAGES = {
  donation: {
    success: 'Donation created successfully! Proceed to payment.',
    error: 'Failed to create donation. Please try again.',
    payment_success: 'Payment completed successfully! Thank you for your donation.',
    payment_error: 'Payment failed. Please try again.',
    international_success: 'International donation created successfully!',
    recurring_success: 'Recurring donation set up successfully!'
  },
  form: {
    validation_error: 'Please check all fields and try again.',
    submit_error: 'Failed to submit form. Please try again.'
  },
  payment: {
    processing: 'Processing payment...',
    stripe_error: 'Payment processing failed. Please try again.',
    network_error: 'Network error during payment. Please check your connection.',
    success: 'Payment completed successfully!',
    cancelled: 'Payment was cancelled.',
    insufficient_funds: 'Insufficient funds. Please try a different card.'
  },
  general: {
    loading: 'Loading...',
    error: 'Something went wrong. Please try again.',
    network_error: 'Network error. Please check your connection.'
  }
};

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/profile.php?id=61577405711455',
  twitter: 'https://twitter.com/infantorganisation',
  instagram: 'https://instagram.com/infantorganisation',
  linkedin: 'https://linkedin.com/company/infantorganisation',
  youtube: 'https://youtube.com/infantorganisation'
};

// Navigation Menu Items
export const NAVIGATION_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Campaigns', href: '/campaigns' },
  { name: 'Contact', href: '/contact' }
];

// Sponsorship Packages (International)
export const SPONSORSHIP_PACKAGES = [
  {
    title: 'Basic Education Package',
    amount: 2500,
    amount_usd: 30,
    description: 'Sponsor a child\'s basic education including books, supplies, and school fees.',
    features: [
      'School fees and supplies',
      'Textbooks and materials',
      'Basic educational support',
      'Progress tracking'
    ]
  },
  {
    title: 'Complete Development Package',
    amount: 5000,
    amount_usd: 60,
    description: 'Comprehensive support including education, extracurricular activities, and development programs.',
    features: [
      'Complete education support',
      'Extracurricular activities',
      'Sports and arts programs',
      'Personal mentoring',
      'Regular progress reports'
    ],
    popular: true
  },
  {
    title: 'Community Impact Package',
    amount: 10000,
    amount_usd: 120,
    description: 'Support multiple children and contribute to community-wide educational improvements.',
    features: [
      'Support for 3-4 children',
      'Community infrastructure',
      'Teacher training programs',
      'Educational technology',
      'Long-term sustainability'
    ]
  }
];

// Predefined donation amounts (international support)
export const DONATION_AMOUNTS = {
  INR: [200, 500, 1000, 2500, 5000, 10000],
  USD: [5, 10, 25, 50, 100, 250],
  GBP: [5, 10, 20, 40, 80, 200],
  EUR: [5, 10, 25, 50, 100, 250],
  CAD: [5, 15, 30, 60, 120, 300],
  AUD: [5, 15, 30, 60, 120, 300],
  SGD: [5, 15, 30, 60, 120, 300],
  MYR: [5, 15, 30, 60, 120, 300],
  DKK: [5, 15, 30, 60, 120, 300]
};

// Minimum and maximum donation amounts by currency
export const DONATION_LIMITS = {
  INR: { min: 200, max: 10000000 },
  USD: { min: 5, max: 100000 },
  GBP: { min: 5, max: 100000 },
  EUR: { min: 5, max: 100000 },
  CAD: { min: 5, max: 100000 },
  AUD: { min: 5, max: 100000 },
  SGD: { min: 5, max: 100000 },
  MYR: { min: 5, max: 100000 },
  DKK: { min: 5, max: 100000 }
};

// NGO Information
export const NGO_INFO = {
  name: 'Infant Organisation',
  tagline: 'Nurturing Lives, Building Hope',
  description: 'Dedicated to providing compassionate care, nutrition, healthcare, and development programs for infants and children to ensure their healthy growth and bright future in a peaceful, nurturing environment.',
  mission: 'Creating a world where every infant and child receives the love, care, and opportunities they need to thrive through comprehensive support programs that strengthen families and build resilient communities.',
  email: 'info@infantngo.org',
  phone: '+91 78429 63399, +91 76750 63399',
  address: '505, MVV Greens, Sagar Nagar, Visakhapatnam, Andhra Pradesh - 530045',
  website: 'www.infantngo.org',
  registration: '602 of 2019'
};

// Invoice Types
export const INVOICE_TYPES = {
  TAX_RECEIPT: 'tax_receipt',
  DONATION_RECEIPT: 'donation_receipt',
  INTERNATIONAL_RECEIPT: 'international_receipt'
};

// Donation Sources
export const DONATION_SOURCES = {
  WEBSITE: 'website',
  MOBILE_APP: 'mobile_app',
  API: 'api',
  ADMIN: 'admin'
};

// Focus Areas Content
export const FOCUS_AREAS = {
  education: {
    title: 'Early Education',
    description: 'We nurture children\'s early learning experiences, building strong foundations for academic success and lifelong learning through play-based, child-centered approaches.',
    fullDescription: 'Early education is the cornerstone of a child\'s development. We provide quality early childhood education that respects each child\'s unique pace and style of learning, creating safe, nurturing environments where children can explore, discover, and grow.',
    // stats: '1,500+ Children Supported'
  },
  health: {
    title: 'Healthcare & Wellness',
    description: 'Comprehensive healthcare services including preventive care, regular checkups, and wellness programs to ensure every child grows up healthy and strong.',
    // stats: '2,500+ Medical Consultations'
  },
  nutrition: {
    title: 'Nutrition & Wellbeing',
    description: 'We provide nutritious meals and nutrition education to combat malnutrition and ensure proper physical and cognitive development for growing children.',
    // stats: '100,000+ Nutritious Meals'
  }
};

// Quality Education Dimensions
export const EDUCATION_DIMENSIONS = [
  {
    title: 'Inclusivity',
    description: 'Creating welcoming environments where every child feels valued and supported regardless of background or abilities.',
    focus: 'Every child belongs and thrives'
  },
  {
    title: 'Child-Centered Learning',
    description: 'Placing children at the heart of learning, respecting their natural curiosity and individual development paths.',
    focus: 'Learning through play and exploration'
  },
  {
    title: 'Family Partnership',
    description: 'Working hand-in-hand with families to support children\'s growth and strengthen family bonds.',
    focus: 'Families as partners in development'
  },
  {
    title: 'Community Connection',
    description: 'Building strong community networks that support children and families in creating lasting positive change.',
    focus: 'Community-rooted support'
  },
  {
    title: 'Holistic Development',
    description: 'Supporting the whole child - emotional, social, physical, and cognitive development in balanced harmony.',
    focus: 'Mind, body, and spirit wellness'
  },
  {
    title: 'Sustainable Impact',
    description: 'Creating programs that build local capacity and ensure long-term positive outcomes for children and families.',
    focus: 'Lasting positive change'
  }
];

// Statistics for homepage
export const STATS = [
  { name: 'Children Supported', value: '1,000-2,000', icon: '👶' },
  { name: 'Families Helped', value: '1,200+', icon: '👨‍👩‍👧‍👦' },
  { name: 'Meals Provided', value: '50,000+', icon: '🍽️' },
  { name: 'Health Checkups', value: '800+', icon: '🏥' }
];

// Stripe Configuration
export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#14b8a6',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px'
    }
  }
};