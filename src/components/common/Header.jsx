import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, Phone, Mail, ChevronDown, Home, Info, Target, MessageCircle } from 'lucide-react';
import { NAVIGATION_ITEMS, NGO_INFO } from '../../utils/constants';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  // Enhanced scroll handling with hide/show functionality
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide/show header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowTopBar(false);
      } else {
        setShowTopBar(true);
      }
      
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigation items with icons for mobile (exclude Home if on home page)
  const navItemsWithIcons = NAVIGATION_ITEMS
    .filter(item => location.pathname === '/' ? item.href !== '/' : true)
    .map((item, index) => {
      const icons = [Home, Info, Target, MessageCircle];
      return { ...item, icon: icons[index] };
    });

  return (
    <>
      {/* Top Bar - Hidden on mobile scroll */}
      <AnimatePresence>
        {showTopBar && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 text-white py-2 hidden sm:block relative overflow-hidden"
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-hexagon opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="container-responsive">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4 lg:space-x-6">
                  <motion.a
                    href={`tel:${NGO_INFO.phone}`}
                    className="flex items-center space-x-2 hover:text-primary-200 transition-colors duration-300 rounded-lg px-2 py-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-0"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Phone className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span className="hidden md:inline">{NGO_INFO.phone}</span>
                    <span className="md:hidden">Call Us</span>
                  </motion.a>
                  <motion.a
                    href={`mailto:${NGO_INFO.email}`}
                    className="flex items-center space-x-2 hover:text-primary-200 transition-colors duration-300 rounded-lg px-2 py-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-0"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Mail className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span className="hidden lg:inline">{NGO_INFO.email}</span>
                    <span className="lg:hidden">Email</span>
                  </motion.a>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-3 w-3 lg:h-4 lg:w-4 text-red-300" />
                  <span className="hidden md:inline">Nurturing Lives, Building Hope</span>
                  <span className="md:hidden">❤️ Hope</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`sticky top-0 z-50 transition-all duration-500 ease-in-out safe-area-top ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-glass border-b border-primary-200/50'
            : 'bg-white/80 backdrop-blur-md shadow-gentle'
        }`}
      >
        <div className="container-responsive">
          <div className="flex items-center justify-between h-16 sm:h-16 lg:h-20">
            
            {/* Logo */}
            <motion.div
              className="flex items-center flex-shrink-0 mr-2 sm:mr-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
                              <Link 
                to="/" 
                className="flex items-center space-x-2 sm:space-x-3 rounded-xl p-2 -m-2 hover:bg-primary-50/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:bg-primary-50/80 group"
              >
                {/* Logo Image */}
                <div className="w-12 h-12 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex-shrink-0">
                  <img
                    src="/logo.jpg"
                    alt="Infant Organisation Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Logo Text - Always visible on mobile */}
                <div className="block">
                  <h1 className="text-base sm:text-xl lg:text-2xl font-bold font-display text-gradient-primary leading-tight group-hover:scale-105 transition-transform duration-300">
                    Infant Organisation
                  </h1>
                  <p className="text-xs lg:text-sm text-soft-500 -mt-1 hidden sm:block group-hover:text-primary-600 transition-colors duration-300">
                    {NGO_INFO.tagline}
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-3 text-sm xl:text-base font-medium transition-all duration-300 ease-in-out rounded-xl hover:bg-primary-50/80 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:bg-primary-50/80 ${
                    location.pathname === item.href
                      ? 'text-primary-600 bg-primary-50/80 shadow-glass'
                      : 'text-soft-600 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                  {location.pathname === item.href && (
                    <motion.div
                      className="absolute inset-x-2 -bottom-1 h-0.5 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full"
                      layoutId="activeTab"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA Button & Mobile Menu */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Donate Button - Always visible on mobile */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block"
              >
                <Link
                  to="/donate"
                  className="inline-flex items-center justify-center px-4 py-3 sm:px-4 sm:py-2 lg:px-6 lg:py-3 text-sm sm:text-sm lg:text-base font-medium text-white border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl min-h-[48px]"
                >
                  <Heart className="h-4 w-4 sm:h-4 sm:w-4 mr-2 sm:mr-2" />
                  <span className="text-sm sm:inline">Donate</span>
                </Link>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={toggleMenu}
                className="lg:hidden p-4 rounded-xl text-soft-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:bg-primary-50 min-h-[48px] min-w-[48px]"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={toggleMenu}
              />

              {/* Mobile Menu */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-primary-200 shadow-peaceful z-50 safe-area-bottom"
              >
                <div className="mobile-padding py-4 space-y-2 max-h-[calc(100vh-theme(spacing.16))] overflow-y-auto">
                  
                  {/* Mobile Logo Section */}
                  <div className="flex items-center space-x-3 pb-4 border-b border-primary-100 xs:hidden">
                    <div className="w-10 h-10">
                      <img
                        src="/logo.jpg"
                        alt="Infant Organisation Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-primary-600">
                        Infant Organisation
                      </h2>
                      <p className="text-xs text-soft-500">
                        {NGO_INFO.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Items */}
                  {navItemsWithIcons.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Link
                        to={item.href}
                        className={`flex items-center px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 min-h-[56px] ${
                          location.pathname === item.href
                            ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-500'
                            : 'text-soft-600 hover:text-primary-600 hover:bg-primary-50'
                        }`}
                      >
                        <item.icon className="h-6 w-6 mr-4 flex-shrink-0" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Mobile Donate Button */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItemsWithIcons.length * 0.1, duration: 0.3 }}
                    className="pt-4 border-t border-primary-100"
                  >
                    <Link
                      to="/donate"
                      className="inline-flex items-center justify-center w-full py-4 px-6 text-lg font-medium text-white bg-primary-500 border border-transparent rounded-xl hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-warm min-h-[56px]"
                    >
                      <Heart className="h-5 w-5 mr-3" />
                      Donate Now
                    </Link>
                  </motion.div>

                  {/* Contact Info in Mobile Menu */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItemsWithIcons.length + 1) * 0.1, duration: 0.3 }}
                    className="pt-4 border-t border-primary-100 space-y-3"
                  >
                    <div className="text-sm text-soft-600">
                      <a
                        href={`tel:${NGO_INFO.phone}`}
                        className="flex items-center space-x-2 mb-2 p-2 rounded-lg hover:bg-primary-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2"
                      >
                        <Phone className="h-4 w-4 text-primary-500" />
                        <span>{NGO_INFO.phone}</span>
                      </a>
                      <a
                        href={`mailto:${NGO_INFO.email}`}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2"
                      >
                        <Mail className="h-4 w-4 text-primary-500" />
                        <span className="break-all">{NGO_INFO.email}</span>
                      </a>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;