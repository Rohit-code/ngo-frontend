import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Users, Shield, Award } from 'lucide-react';
import { NGO_INFO, STATS } from '../../utils/constants';
import Carousel from '../common/Carousel';

const Hero = () => {
  // Hero carousel images - Beautiful, natural NGO content
  const heroImages = [
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Joyful children playing and learning together",
      caption: "Creating Joyful Learning Experiences"
    },
    {
      src: "https://images.unsplash.com/photo-1586769852044-692d6df65393?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Gentle healthcare for children",
      caption: "Compassionate Healthcare for Every Child"
    },
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Children sharing healthy meals together",
      caption: "Nourishing Bodies and Minds"
    },
    {
      src: "https://images.unsplash.com/photo-1594736797933-d0dba0e6b999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Happy family moment with children",
      caption: "Strengthening Families and Communities"
    },
    {
      src: "https://images.unsplash.com/photo-1502781252888-9143ba7f074e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Children in a beautiful learning environment",
      caption: "Safe Spaces for Growth and Discovery"
    },
    {
      src: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Caring hands supporting children",
      caption: "Nurturing Every Child's Potential"
    }
  ];

  return (
    <>
      {/* Hero Image Carousel */}
      <section className="relative">
        <div className="h-64 sm:h-80 lg:h-96 overflow-hidden">
          <Carousel 
            images={heroImages}
            autoPlay={true}
            autoPlayInterval={5000}
            showDots={true}
            showArrows={true}
            className="h-full rounded-none"
          />
        </div>
        
        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  <span className="text-primary-300">Supporting Infants,</span>
                  <br />
                  <span className="text-white">Building Futures</span>
                </h1>
                <p className="text-lg md:text-xl mb-6 opacity-90">
                  Join us in providing essential care, nutrition, and development programs for infants and children.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/donate"
                    className="btn-primary bg-primary-500 hover:bg-primary-600 text-white border-none"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Donate Now
                  </Link>
                  <Link
                    to="/about"
                    className="btn-secondary bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Hero Content Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 via-soft-50 to-secondary-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pattern opacity-20"></div>
        
        {/* Floating Elements - Updated colors */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-secondary-200 rounded-full opacity-60 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent-200 rounded-full opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-primary-200 rounded-full opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-gentle border border-primary-200 mb-6"
              >
                <Award className="h-4 w-4 text-primary-500 mr-2" />
                <span className="text-sm font-medium text-primary-700">
                  80G Tax Exemption Available
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                  Every Child Deserves
                </span>
                <br />
                <span className="text-soft-900">Love, Care & Opportunity</span>
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-soft-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              >
                We provide comprehensive support through healthcare, education, nutrition, and family programs. 
                Together, we can ensure every infant and child has the foundation they need to thrive.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Link
                  to="/donate"
                  className="btn-primary group bg-primary-500 hover:bg-primary-600"
                >
                  <Heart className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Supporting
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/campaigns"
                  className="btn-secondary group border-primary-300 text-primary-600 hover:bg-primary-50"
                >
                  View Campaigns
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-6 text-center lg:text-left"
              >
                <div className="flex flex-col items-center lg:items-start">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                    <Shield className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="text-sm text-soft-600">Trusted</div>
                  <div className="text-sm font-semibold text-soft-900">Organization</div>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div className="text-sm text-soft-600">Transparent</div>
                  <div className="text-sm font-semibold text-soft-900">Operations</div>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center mb-2">
                    <Heart className="h-5 w-5 text-accent-600" />
                  </div>
                  <div className="text-sm text-soft-600">Direct</div>
                  <div className="text-sm font-semibold text-soft-900">Impact</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Main Illustration Container */}
              <div className="relative w-full max-w-lg mx-auto">
                
                {/* Background Circle with peaceful colors */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-primary-200 via-secondary-200 to-accent-200 rounded-full opacity-20"
                ></motion.div>
                
                {/* Central Hero Circle with Full Logo */}
                <div className="relative w-80 h-80 lg:w-96 lg:h-96 mx-auto bg-white rounded-full shadow-2xl flex items-center justify-center p-8 border-4 border-primary-200">
                  
                  {/* Full Logo Display */}
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <img
                      src="/logo.jpg"
                      alt="Infant Organisation Logo"
                      className="w-full h-full object-contain"
                    />
                  </motion.div>

                  {/* Floating Icons with peaceful colors */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-4 -left-4 w-16 h-16 bg-white rounded-full shadow-peaceful flex items-center justify-center"
                  >
                    <Users className="h-8 w-8 text-primary-500" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-full shadow-soft flex items-center justify-center"
                  >
                    <Shield className="h-8 w-8 text-secondary-500" />
                  </motion.div>
                </div>

                {/* Decorative Elements with peaceful emojis */}
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute top-10 right-10 w-8 h-8 text-secondary-400"
                >
                  ✨
                </motion.div>
                
                <motion.div
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-16 left-8 w-6 h-6 text-primary-400"
                >
                  🌱
                </motion.div>
                
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-1/2 -left-8 w-4 h-4 text-accent-400"
                >
                  💝
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-20 text-white"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              fill="currentColor"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              fill="currentColor"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </section>
    </>
  );
};

export default Hero;