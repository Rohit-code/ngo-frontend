import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, ArrowRight, Users, Shield, Award, Play, ChevronDown } from 'lucide-react';
import { NGO_INFO, STATS } from '../../utils/constants';
import Carousel from '../common/Carousel';

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hero carousel images optimized for mobile
  const heroImages = [
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Joyful children playing and learning together",
      caption: "Creating Joyful Learning Experiences",
      mobileCaption: "Joyful Learning"
    },
    {
      src: "https://images.unsplash.com/photo-1586769852044-692d6df65393?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Gentle healthcare for children",
      caption: "Compassionate Healthcare for Every Child",
      mobileCaption: "Healthcare Support"
    },
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Children sharing healthy meals together",
      caption: "Nourishing Bodies and Minds",
      mobileCaption: "Nutrition Programs"
    },
    {
      src: "https://images.unsplash.com/photo-1594736797933-d0dba0e6b999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Happy family moment with children",
      caption: "Strengthening Families and Communities",
      mobileCaption: "Family Support"
    },
    {
      src: "https://images.unsplash.com/photo-1502781252888-9143ba7f074e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Children in a beautiful learning environment",
      caption: "Safe Spaces for Growth and Discovery",
      mobileCaption: "Safe Environments"
    }
  ];

  const scrollToNext = () => {
    const nextSection = document.getElementById('focus-areas');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Image Carousel */}
      <section className="relative">
        <div className="h-56 sm:h-72 md:h-80 lg:h-96 xl:h-[28rem] overflow-hidden">
          <Carousel 
            images={heroImages.map(img => ({
              ...img,
              caption: isMobile ? img.mobileCaption : img.caption
            }))}
            autoPlay={true}
            autoPlayInterval={6000}
            showDots={true}
            showArrows={!isMobile} // Hide arrows on mobile for swipe navigation
            height="auto"
            className="h-full rounded-none"
          />
        </div>
        
        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 flex items-center">
          <div className="container-mobile w-full">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-white"
              >
                {/* Mobile-optimized heading */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                  <span className="text-primary-300 block sm:inline">Supporting Infants,</span>
                  <br className="hidden sm:block" />
                  <span className="text-white">Building Futures</span>
                </h1>
                
                <p className="text-sm sm:text-lg md:text-xl mb-4 sm:mb-6 opacity-90 leading-relaxed">
                  Join us in providing essential care, nutrition, and development programs for infants and children.
                </p>
                
                {/* Mobile-optimized CTA buttons */}
                <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/donate"
                      className="btn-primary bg-primary-500 hover:bg-primary-600 text-white border-none w-full xs:w-auto justify-center text-sm sm:text-base px-4 sm:px-6 py-3"
                    >
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Donate Now
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/about"
                      className="btn-secondary bg-white/20 text-white border-white/30 hover:bg-white/30 w-full xs:w-auto justify-center text-sm sm:text-base px-4 sm:px-6 py-3"
                    >
                      Learn More
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollToNext}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white transition-colors touch-friendly"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          aria-label="Scroll to next section"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.button>
      </section>

      {/* Main Hero Content Section */}
      <section id="focus-areas" className="relative mobile-section-padding bg-gradient-to-br from-primary-50 via-soft-50 to-secondary-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pattern opacity-20"></div>
        
        {/* Floating Elements - Optimized for mobile */}
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-12 sm:w-20 h-12 sm:h-20 bg-secondary-200 rounded-full opacity-60 animate-float"></div>
        <div className="absolute top-20 sm:top-40 right-4 sm:right-20 w-10 sm:w-16 h-10 sm:h-16 bg-accent-200 rounded-full opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 sm:bottom-20 left-8 sm:left-20 w-8 sm:w-12 h-8 sm:h-12 bg-primary-200 rounded-full opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative container-mobile">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-white shadow-gentle border border-primary-200 mb-4 sm:mb-6 text-xs sm:text-sm"
              >
                <Award className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500 mr-2" />
                <span className="font-medium text-primary-700">
                  80G Tax Exemption Available
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent block sm:inline">
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
                className="text-sm sm:text-lg text-soft-600 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              >
                We provide comprehensive support through healthcare, education, nutrition, and family programs. 
                Together, we can ensure every infant and child has the foundation they need to thrive.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mobile-flex mb-8 sm:mb-12"
              >
                <Link
                  to="/donate"
                  className="btn-primary group bg-primary-500 hover:bg-primary-600 flex-1 xs:flex-none"
                >
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Supporting
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/campaigns"
                  className="btn-secondary group border-primary-300 text-primary-600 hover:bg-primary-50 flex-1 xs:flex-none"
                >
                  View Campaigns
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Trust Indicators - Mobile optimized */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-3 sm:gap-6 text-center lg:text-left"
              >
                {[
                  { icon: Shield, title: 'Trusted', subtitle: 'Organization', color: 'bg-primary-100 text-primary-600' },
                  { icon: Users, title: 'Transparent', subtitle: 'Operations', color: 'bg-secondary-100 text-secondary-600' },
                  { icon: Heart, title: 'Direct', subtitle: 'Impact', color: 'bg-accent-100 text-accent-600' }
                ].map((item, index) => (
                  <div key={item.title} className="flex flex-col items-center lg:items-start">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 ${item.color} rounded-lg sm:rounded-xl flex items-center justify-center mb-2`}>
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="text-xs sm:text-sm text-soft-600">{item.title}</div>
                    <div className="text-xs sm:text-sm font-semibold text-soft-900">{item.subtitle}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Logo/Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative order-1 lg:order-2"
              style={{ y: isMobile ? 0 : y }}
            >
              {/* Main Illustration Container */}
              <div className="relative w-full max-w-md sm:max-w-lg mx-auto">
                
                {/* Background Circle */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-primary-200 via-secondary-200 to-accent-200 rounded-full opacity-20"
                ></motion.div>
                
                {/* Central Hero Circle with Logo */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto bg-white rounded-full shadow-2xl flex items-center justify-center p-6 sm:p-8 border-2 sm:border-4 border-primary-200">
                  
                  {/* Logo Display */}
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

                  {/* Floating Icons */}
                  <motion.div
                    animate={{ y: [-8, 8, -8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-3 -left-3 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full shadow-peaceful flex items-center justify-center"
                  >
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [8, -8, 8] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-3 -right-3 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full shadow-soft flex items-center justify-center"
                  >
                    <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-secondary-500" />
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute top-6 sm:top-10 right-6 sm:right-10 w-6 h-6 sm:w-8 sm:h-8 text-secondary-400 text-lg sm:text-xl"
                >
                  ✨
                </motion.div>
                
                <motion.div
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-12 sm:bottom-16 left-4 sm:left-8 w-4 h-4 sm:w-6 sm:h-6 text-primary-400 text-sm sm:text-lg"
                >
                  🌱
                </motion.div>
                
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-1/2 -left-4 sm:-left-8 w-3 h-3 sm:w-4 sm:h-4 text-accent-400 text-sm"
                >
                  💝
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Stats Strip - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="container-mobile mt-8 sm:mt-12 lg:mt-16"
        >
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-peaceful border border-primary-100 p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {STATS.slice(0, 4).map((stat, index) => (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-primary-600 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-soft-600 leading-tight">
                    {stat.name}
                  </div>
                  <div className="text-lg sm:text-xl mt-1 opacity-60">
                    {stat.icon}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12 sm:h-20 text-white"
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