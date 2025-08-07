import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Users, Heart, Gift, Shield, TrendingUp, Award } from 'lucide-react';
import { STATS } from '../../utils/constants';
import { formatCurrency, calculateProgress, formatDate, getDaysRemaining, getCampaignStatus, getImpactMessage} from '../../utils/helpers';

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
          setCount(formatCurrency(current) + (end.includes('+') ? '+' : ''));
        }
      }, 1000 / 60);
      
      return () => clearInterval(counter);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [end, duration, delay, hasStarted]);
  
  return <span className="tabular-nums">{count}</span>;
};

export default Stats;