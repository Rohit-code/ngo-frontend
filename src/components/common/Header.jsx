import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, Phone, Mail } from 'lucide-react';
import { NAVIGATION_ITEMS, NGO_INFO } from '../../utils/constants';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-500 text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{NGO_INFO.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{NGO_INFO.email}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-300" />
              <span>Nurturing Lives, Building Hope</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-peaceful border-b border-primary-200'
            : 'bg-white shadow-gentle'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/" className="flex items-center space-x-3">
                {/* Logo Image */}
                <div className="w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0">
                  <img
                    src="/logo.jpg"
                    alt="Infant Organisation Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Logo Text */}
                <div className="hidden sm:block">
                  <h1 className="text-xl lg:text-2xl font-bold font-display text-primary-600">
                    Infant Organisation
                  </h1>
                  <p className="text-xs lg:text-sm text-soft-500 -mt-1">
                    {NGO_INFO.tagline}
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? 'text-primary-600'
                      : 'text-soft-600 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                  {location.pathname === item.href && (
                    <motion.div
                      className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-primary-400 to-secondary-400"
                      layoutId="activeTab"
                      initial={false}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Donate Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/donate"
                  className="btn-primary hidden sm:inline-flex"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Donate Now
                </Link>
              </motion.div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 rounded-lg text-soft-600 hover:text-primary-600 hover:bg-primary-100 transition-colors duration-200"
                aria-label="Toggle menu"
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
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-primary-200"
            >
              <div className="px-4 py-6 space-y-4">
                
                {/* Mobile Logo for Context */}
                <div className="flex items-center space-x-3 sm:hidden pb-4 border-b border-primary-100">
                  <div className="w-10 h-10">
                    <img
                      src="/logo.jpg"
                      alt="Infant Organisation Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-primary-600">
                      Infant Organisation
                    </h2>
                    <p className="text-xs text-soft-500">
                      {NGO_INFO.tagline}
                    </p>
                  </div>
                </div>

                {NAVIGATION_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
                        location.pathname === item.href
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-soft-600 hover:text-primary-600 hover:bg-primary-100'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Donate Button */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: NAVIGATION_ITEMS.length * 0.1 }}
                  className="pt-4"
                >
                  <Link
                    to="/donate"
                    className="btn-primary w-full justify-center"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Donate Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;