import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Users, Heart, Gift, Shield, TrendingUp, Award } from 'lucide-react';
import { STATS } from '../../utils/constants';
import { formatNumber } from '../../utils/helpers';

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { threshold: 0.3, once: true });
  const controls = useAnimation();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Start animations when in view
  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
      controls.start('visible');
    }
  }, [isInView, controls]);

  // Enhanced stats with better mobile presentation
  const enhancedStats = STATS.map((stat, index) => ({
    ...stat,
    IconComponent: [Users, Heart, Gift, Shield][index] || TrendingUp, // Use different property name
    color: [
      'text-primary-500 bg-primary-100',
      'text-accent-500 bg-accent-100', 
      'text-secondary-500 bg-secondary-100',
      'text-warm-500 bg-warm-100'
    ][index],
    gradient: [
      'from-primary-500 to-primary-600',
      'from-accent-500 to-accent-600',
      'from-secondary-500 to-secondary-600',
      'from-warm-500 to-warm-600'
    ][index]
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.1 : 0.2,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      scale: 0.8 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="mobile-section-padding bg-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      
      <div className="container-responsive relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500 mr-2" />
            <h2 className="heading-lg">
              Our <span className="text-gradient">Impact</span> So Far
            </h2>
          </div>
          <p className="text-body max-w-2xl mx-auto">
            Together, we've been able to make a significant difference in the lives of 
            infants and children. Here's what we've accomplished with your support.
          </p>
        </motion.div>

        {/* Stats Grid - Mobile optimized with group class applied directly */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 mb-8 sm:mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {enhancedStats.map((stat, index) => {
            const IconComponent = stat.IconComponent; // Get the React component
            return (
              <motion.div
                key={stat.name}
                variants={cardVariants}
                whileHover={{ 
                  scale: isMobile ? 1.02 : 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                className="stats-card group" // Applied group class directly here
              >
                {/* Mobile Card Layout */}
                <div className="relative">
                  {/* Icon Container */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isVisible ? { scale: 1 } : { scale: 0 }}
                    transition={{ 
                      delay: index * 0.1 + 0.3,
                      type: "spring",
                      stiffness: 200
                    }}
                    className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl ${stat.color} 
                      flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 
                      transition-transform duration-300`}
                  >
                    <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
                  </motion.div>

                  {/* Value with Counter Animation */}
                  <motion.div
                    className="text-xl sm:text-3xl lg:text-4xl font-bold text-soft-900 mb-1 sm:mb-2"
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    {isVisible && (
                      <CountUpAnimation 
                        end={stat.value} 
                        duration={isMobile ? 1.5 : 2} 
                        delay={index * 0.1}
                      />
                    )}
                  </motion.div>

                  {/* Label */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: index * 0.1 + 0.6 }}
                    className="text-soft-600 font-medium text-xs sm:text-sm lg:text-base leading-tight"
                  >
                    {stat.name}
                  </motion.p>

                  {/* Emoji Badge */}
                  <div className="absolute -top-1 -right-1 sm:top-2 sm:right-2 opacity-40 group-hover:opacity-60 transition-opacity text-lg sm:text-2xl">
                    {stat.icon}
                  </div>

                  {/* Progress Bar for Mobile */}
                  {isMobile && (
                    <motion.div
                      className="mt-2 h-1 bg-warm-200 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      animate={isVisible ? { width: "100%" } : { width: 0 }}
                      transition={{ delay: index * 0.1 + 0.8, duration: 1 }}
                    >
                      <motion.div
                        className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                        initial={{ width: 0 }}
                        animate={isVisible ? { width: "100%" } : { width: 0 }}
                        transition={{ delay: index * 0.1 + 1, duration: 1.5 }}
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Impact Metrics for Mobile */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1.5 }}
            className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4 border border-primary-200 mb-6"
          >
            <div className="text-center">
              <h3 className="font-semibold text-soft-900 mb-2 text-sm">Our Growing Impact</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-bold text-primary-600">95%</div>
                  <div className="text-soft-600">Success Rate</div>
                </div>
                <div>
                  <div className="font-bold text-secondary-600">24/7</div>
                  <div className="text-soft-600">Support</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: isMobile ? 1.2 : 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-50 via-secondary-50 to-accent-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 border border-primary-200">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500 mr-2" />
              <h3 className="heading-sm">
                Be Part of Our Growing <span className="text-gradient">Impact</span>
              </h3>
            </div>
            <p className="text-body mb-4 sm:mb-6 max-w-xl mx-auto">
              Every donation, no matter the size, contributes to these numbers and 
              helps us reach more children in need.
            </p>
            
            {/* CTA Buttons - Mobile optimized */}
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
              <motion.a
                href="/donate"
                className="btn-primary flex-1 xs:flex-none"
                whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="h-4 w-4 mr-2" />
                <span className="hidden xs:inline">Join Our Mission</span>
                <span className="xs:hidden">Donate</span>
              </motion.a>
              
              <motion.a
                href="/about"
                className="btn-secondary flex-1 xs:flex-none"
                whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="hidden xs:inline">Learn More</span>
                <span className="xs:hidden">About Us</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Enhanced Counter Animation Component
const CountUpAnimation = ({ end, duration = 2, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  useEffect(() => {
    if (hasStarted) return;
    
    const timer = setTimeout(() => {
      setHasStarted(true);
      let start = 0;
      const endNum = parseInt(end.replace(/[+,]/g, ''));
      const increment = endNum / (duration * 60);
      
      const counter = setInterval(() => {
        start += increment;
        const current = Math.floor(start);
        
        if (current >= endNum) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(formatNumber(current) + (end.includes('+') ? '+' : ''));
        }
      }, 1000 / 60);
      
      return () => clearInterval(counter);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [end, duration, delay, hasStarted]);
  
  return <span className="tabular-nums">{count}</span>;
};

export default Stats;