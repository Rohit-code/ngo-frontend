import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  ArrowUp
} from 'lucide-react';
import { NGO_INFO, SOCIAL_LINKS, NAVIGATION_ITEMS } from '../../utils/constants';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-soft-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dots opacity-10"></div>
      
      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="col-span-1 lg:col-span-2"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg p-2">
                  <img
                    src="/logo.jpg"
                    alt="Infant Organisation Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display text-white">
                    Infant Organisation
                  </h3>
                  <p className="text-primary-200 text-sm">{NGO_INFO.tagline}</p>
                </div>
              </div>
              
              <p className="text-primary-200 mb-6 leading-relaxed max-w-md">
                {NGO_INFO.description}
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-primary-200">
                  <Mail className="h-5 w-5 text-primary-400" />
                  <span>{NGO_INFO.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-primary-200">
                  <Phone className="h-5 w-5 text-primary-400" />
                  <span>{NGO_INFO.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-primary-200">
                  <MapPin className="h-5 w-5 text-primary-400" />
                  <span>{NGO_INFO.address}</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-lg font-semibold font-display mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {NAVIGATION_ITEMS.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-primary-200 hover:text-primary-400 transition-colors duration-200 flex items-center group"
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
                    className="text-primary-400 hover:text-primary-300 transition-colors duration-200 flex items-center group font-medium"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Make a Donation
                    </span>
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Legal & Social */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold font-display mb-6">Connect With Us</h4>
              
              {/* Social Links */}
              <div className="flex space-x-4 mb-6">
                {[
                  { icon: Facebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
                  { icon: Twitter, href: SOCIAL_LINKS.twitter, label: 'Twitter' },
                  { icon: Instagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
                  { icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
                  { icon: Youtube, href: SOCIAL_LINKS.youtube, label: 'YouTube' }
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center text-primary-300 hover:text-white hover:bg-primary-500 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>

              {/* Legal Info */}
              <div className="space-y-2 text-sm text-primary-300">
                <p><span className="font-medium">PAN:</span> {NGO_INFO.pan}</p>
                <p><span className="font-medium">Reg. No:</span> {NGO_INFO.registration}</p>
                <p><span className="font-medium">80G No:</span> {NGO_INFO.section_80g}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tax Exemption Notice */}
        <div className="bg-primary-700 border-t border-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-primary-50 border border-primary-200 rounded-xl p-4 text-center"
            >
              <p className="text-primary-800 text-sm font-medium">
                🏆 Your contributions are eligible for up to 50% tax benefit under Section 80G 
                as Infant Organisation is registered as a non-profit organization.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="bg-soft-900 border-t border-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-primary-300 text-sm text-center sm:text-left"
              >
                © {currentYear} Infant Organisation. All rights reserved. Made with ❤️ for infants and children.
              </motion.p>
              
              <motion.button
                onClick={scrollToTop}
                className="mt-4 sm:mt-0 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors duration-200 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Scroll to top"
              >
                <ArrowUp className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;