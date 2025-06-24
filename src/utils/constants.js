// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  UPI: 'upi',
  NETBANKING: 'netbanking',
  WALLET: 'wallet',
  BANK_TRANSFER: 'bank_transfer'
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CARD]: 'Credit/Debit Card',
  [PAYMENT_METHODS.UPI]: 'UPI',
  [PAYMENT_METHODS.NETBANKING]: 'Net Banking',
  [PAYMENT_METHODS.WALLET]: 'Wallet',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Bank Transfer'
};

// Payment Gateways
export const PAYMENT_GATEWAYS = {
  RAZORPAY: 'razorpay',
  STRIPE: 'stripe',
  PAYU: 'payu',
  CASHFREE: 'cashfree'
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

// Impact messages based on donation amount
export const IMPACT_MESSAGES = {
  200: "Can provide basic care for an infant for 1 week",
  500: "Can provide nutritious meals for an infant for 2 weeks",
  1000: "Can support basic healthcare for an infant for 1 month",
  2500: "Can provide educational materials for 3 infants for 3 months",
  5000: "Can support complete healthcare and nutrition for an infant for 2 months",
  10000: "Can provide comprehensive support for an infant for 3 months"
};

// Form validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  mobile: /^[6-9]\d{9}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  pincode: /^[1-9][0-9]{5}$/
};

// Toast messages
export const TOAST_MESSAGES = {
  donation: {
    success: 'Donation created successfully! Proceed to payment.',
    error: 'Failed to create donation. Please try again.',
    payment_success: 'Payment completed successfully! Thank you for your donation.',
    payment_error: 'Payment failed. Please try again.'
  },
  form: {
    validation_error: 'Please check all fields and try again.',
    submit_error: 'Failed to submit form. Please try again.'
  },
  general: {
    loading: 'Loading...',
    error: 'Something went wrong. Please try again.',
    network_error: 'Network error. Please check your connection.'
  }
};

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/infantorganisation',
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

// Sponsorship Packages
export const SPONSORSHIP_PACKAGES = [
  {
    title: 'Basic Care Package',
    amount: 2500,
    description: 'Provide essential healthcare and nutrition support for an infant.',
    features: [
      'Regular health checkups',
      'Nutritional supplements',
      'Basic medical care',
      'Growth monitoring'
    ]
  },
  {
    title: 'Complete Development Package',
    amount: 5000,
    description: 'Comprehensive support including healthcare, nutrition, and early education.',
    features: [
      'Complete healthcare support',
      'Nutrition programs',
      'Early childhood education',
      'Family counseling',
      'Regular progress reports'
    ],
    popular: true
  },
  {
    title: 'Family Support Package',
    amount: 10000,
    description: 'Support entire families with multiple children and community development.',
    features: [
      'Support for multiple children',
      'Family skill development',
      'Community health programs',
      'Educational resources',
      'Long-term sustainability'
    ]
  }
];

// Predefined donation amounts (minimum 200)
export const DONATION_AMOUNTS = [200, 500, 1000, 2500, 5000, 10000];

// Minimum and maximum donation amounts
export const MIN_DONATION_AMOUNT = 200;
export const MAX_DONATION_AMOUNT = 10000000; // 1 crore

// NGO Information
export const NGO_INFO = {
  name: 'Infant Organisation',
  tagline: 'Nurturing Lives, Building Hope',
  description: 'Dedicated to providing compassionate care, nutrition, healthcare, and development programs for infants and children to ensure their healthy growth and bright future in a peaceful, nurturing environment.',
  mission: 'Creating a world where every infant and child receives the love, care, and opportunities they need to thrive through comprehensive support programs that strengthen families and build resilient communities.',
  email: 'info@infantngo.org',
  phone: '+91-9999999999',
  address: 'Sample Address, City, State, PIN - 123456',
  website: 'www.infantngo.org',
  pan: 'AACTS7973G',
  registration: 'AACTS7973GF2010',
  section_80g: 'AACTS7973GF2010'
};

// Focus Areas Content
export const FOCUS_AREAS = {
  education: {
    title: 'Early Education',
    description: 'We nurture children\'s early learning experiences, building strong foundations for academic success and lifelong learning through play-based, child-centered approaches.',
    fullDescription: 'Early education is the cornerstone of a child\'s development. We provide quality early childhood education that respects each child\'s unique pace and style of learning, creating safe, nurturing environments where children can explore, discover, and grow.',
    stats: '1,500+ Children Supported'
  },
  health: {
    title: 'Healthcare & Wellness',
    description: 'Comprehensive healthcare services including preventive care, regular checkups, and wellness programs to ensure every child grows up healthy and strong.',
    stats: '2,500+ Medical Consultations'
  },
  nutrition: {
    title: 'Nutrition & Wellbeing',
    description: 'We provide nutritious meals and nutrition education to combat malnutrition and ensure proper physical and cognitive development for growing children.',
    stats: '100,000+ Nutritious Meals'
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
  { name: 'Children Supported', value: '2,500+', icon: '👶' },
  { name: 'Families Helped', value: '1,200+', icon: '👨‍👩‍👧‍👦' },
  { name: 'Meals Provided', value: '50,000+', icon: '🍽️' },
  { name: 'Health Checkups', value: '800+', icon: '🏥' }
];