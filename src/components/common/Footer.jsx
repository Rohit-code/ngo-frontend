import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { NGO_INFO, SOCIAL_LINKS, NAVIGATION_ITEMS } from '../../utils/constants';

const Footer = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show scroll to top button on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      id: 'links',
      title: 'Quick Links',
      icon: '🔗',
      content: (
        <ul className="space-y-3">
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className="text-primary-200 hover:text-primary-400 transition-colors duration-200 flex items-center group touch-friendly"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/donate"
              className="text-primary-400 hover:text-primary-300 transition-colors duration-200 flex items-center group font-medium touch-friendly"
            >
              <Heart className="h-4 w-4 mr-2" />
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                Make a Donation
              </span>
            </Link>
          </li>
        </ul>
      )
    },
    {
      id: 'contact',
      title: 'Contact Info',
      icon: '📞',
      content: (
        <div className="space-y-4">
          <div className="flex items-start space-x-3 text-primary-200">
            <Mail className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Email</p>
              <a 
                href={`mailto:${NGO_INFO.email}`}
                className="hover:text-primary-400 transition-colors break-all"
              >
                {NGO_INFO.email}
              </a>
            </div>
          </div>
          <div className="flex items-start space-x-3 text-primary-200">
            <Phone className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Phone</p>
              <a 
                href={`tel:${NGO_INFO.phone}`}
                className="hover:text-primary-400 transition-colors"
              >
                {NGO_INFO.phone}
              </a>
            </div>
          </div>
          <div className="flex items-start space-x-3 text-primary-200">
            <MapPin className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-sm leading-relaxed">{NGO_INFO.address}</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'social',
      title: 'Follow Us',
      icon: '📱',
      content: (
        <div>
          <p className="text-primary-200 mb-4 text-sm">
            Stay connected with our latest updates and impact stories.
          </p>
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-3">
            {[
              { icon: Facebook, href: SOCIAL_LINKS.facebook, name: 'Facebook', color: 'hover:bg-blue-600' },
              { icon: Twitter, href: SOCIAL_LINKS.twitter, name: 'Twitter', color: 'hover:bg-sky-500' },
              { icon: Instagram, href: SOCIAL_LINKS.instagram, name: 'Instagram', color: 'hover:bg-pink-500' },
              { icon: Linkedin, href: SOCIAL_LINKS.linkedin, name: 'LinkedIn', color: 'hover:bg-blue-700' },
              { icon: Youtube, href: SOCIAL_LINKS.youtube, name: 'YouTube', color: 'hover:bg-red-600' }
            ].map(({ icon: Icon, href, name, color }) => (
              <motion.a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 bg-primary-700 rounded-lg flex items-center justify-center text-primary-300 hover:text-white transition-all duration-200 ${color} touch-friendly`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={name}
              >
                <Icon className="h-5 w-5" />
                <ExternalLink className="h-2 w-2 absolute top-1 right-1 opacity-50" />
              </motion.a>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'legal',
      title: 'Legal Info',
      icon: '📋',
      content: (
        <div className="space-y-3 text-sm">
          <div className="bg-primary-800 rounded-lg p-3">
            <h5 className="font-semibold text-primary-300 mb-2">Registration Details</h5>
            <div className="space-y-1 text-primary-200">
              <p><span className="font-medium">PAN:</span> {NGO_INFO.pan}</p>
              <p><span className="font-medium">Reg. No:</span> {NGO_INFO.registration}</p>
              <p><span className="font-medium">80G No:</span> {NGO_INFO.section_80g}</p>
            </div>
          </div>
          <div className="text-primary-300 text-xs">
            <p>Registered as a non-profit organization under the Income Tax Act</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <footer className="bg-soft-800 text-white relative overflow-hidden safe-area-bottom">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dots opacity-10"></div>
      
      <div className="relative">
        {/* Main Footer Content */}
        <div className="container-mobile py-12 sm:py-16">
          
          {/* Mobile Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-white rounded-xl p-2">
                <img
                  src="/logo.jpg"
                  alt="Infant Organisation Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Infant Organisation
                </h3>
                <p className="text-primary-200 text-sm sm:text-base">{NGO_INFO.tagline}</p>
                <p className="text-primary-300 text-xs sm:text-sm mt-1 max-w-md">
                  {NGO_INFO.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-8">
            {footerSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h4 className="text-lg font-semibold font-display mb-6 flex items-center">
                  <span className="text-xl mr-2">{section.icon}</span>
                  {section.title}
                </h4>
                {section.content}
              </motion.div>
            ))}
          </div>

          {/* Mobile/Tablet Accordion Layout */}
          <div className="lg:hidden space-y-4">
            {footerSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border border-primary-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-4 py-4 bg-primary-800 flex items-center justify-between text-left touch-friendly"
                  aria-expanded={expandedSection === section.id}
                >
                  <span className="flex items-center font-semibold">
                    <span className="text-lg mr-3">{section.icon}</span>
                    {section.title}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedSection === section.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 py-4 bg-primary-900"
                    >
                      {section.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tax Exemption Notice */}
        <div className="bg-primary-700 border-t border-primary-600">
          <div className="container-mobile py-4 sm:py-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-primary-50 border border-primary-200 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <span className="text-lg mr-2">🏆</span>
                <span className="font-semibold text-primary-800 text-sm sm:text-base">
                  Tax Benefits Available
                </span>
              </div>
              <p className="text-primary-700 text-xs sm:text-sm leading-relaxed">
                Your contributions are eligible for up to 50% tax benefit under Section 80G 
                as Infant Organisation is registered as a non-profit organization.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="bg-soft-900 border-t border-primary-600">
          <div className="container-mobile py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center sm:text-left"
              >
                <p className="text-primary-300 text-xs sm:text-sm">
                  © {currentYear} Infant Organisation. All rights reserved.
                </p>
                <p className="text-primary-400 text-xs mt-1">
                  Made with ❤️ for infants and children
                </p>
              </motion.div>
              
              {/* Quick Action Buttons */}
              <div className="flex items-center space-x-3">
                <motion.a
                  href="/donate"
                  className="btn-primary text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Donate</span>
                  <span className="xs:hidden">❤️</span>
                </motion.a>
                
                <motion.a
                  href="/contact"
                  className="btn-secondary text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="hidden xs:inline">Contact</span>
                  <span className="xs:hidden">📞</span>
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-peaceful flex items-center justify-center transition-colors duration-200 touch-friendly"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;