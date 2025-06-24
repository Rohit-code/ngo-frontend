import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Gift, Shield } from 'lucide-react';
import { STATS } from '../../utils/constants';
import { formatNumber } from '../../utils/helpers';

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('stats-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const icons = {
    '👶': Users,
    '👨‍👩‍👧‍👦': Heart,
    '🍽️': Gift,
    '🏥': Shield
  };

  const colors = [
    'text-primary-500 bg-primary-100',
    'text-accent-500 bg-accent-100',
    'text-secondary-500 bg-secondary-100',
    'text-warm-500 bg-warm-100'
  ];

  return (
    <section id="stats-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4">
            Our <span className="text-gradient">Impact</span> So Far
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Together, we've been able to make a significant difference in the lives of 
            infants and children. Here's what we've accomplished with your support.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS.map((stat, index) => {
            const IconComponent = icons[stat.icon];
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="card p-6 lg:p-8 text-center group cursor-pointer card-hover"
              >
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ 
                    delay: index * 0.1 + 0.3,
                    type: "spring",
                    stiffness: 200
                  }}
                  className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl ${colors[index]} 
                    flex items-center justify-center mx-auto mb-4 group-hover:scale-110 
                    transition-transform duration-300`}
                >
                  <IconComponent className="h-8 w-8 lg:h-10 lg:w-10" />
                </motion.div>

                {/* Value with Counter Animation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="text-3xl lg:text-4xl font-bold text-soft-900 mb-2"
                >
                  {/* {isVisible && (
                    <CountUpAnimation 
                      end={stat.value} 
                      duration={2} 
                      delay={index * 0.1}
                    />
                  )} */}
                </motion.div>

                {/* Label */}
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                  className="text-soft-600 font-medium text-sm lg:text-base"
                >
                  {stat.name}
                </motion.p>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-50 via-secondary-50 to-accent-50 rounded-2xl p-8 lg:p-12">
            <h3 className="heading-sm mb-4">
              Be Part of Our Growing <span className="text-gradient">Impact</span>
            </h3>
            <p className="text-body mb-6 max-w-xl mx-auto">
              Every donation, no matter the size, contributes to these numbers and 
              helps us reach more children in need.
            </p>
            <motion.a
              href="/donate"
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="h-4 w-4 mr-2" />
              Join Our Mission
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Counter Animation Component
const CountUpAnimation = ({ end, duration = 2, delay = 0 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const increment = end.includes('+') || end.includes(',') ? 
        parseInt(end.replace(/[+,]/g, '')) / (duration * 60) : 
        parseInt(end) / (duration * 60);
      
      const counter = setInterval(() => {
        start += increment;
        const current = Math.floor(start);
        const target = parseInt(end.replace(/[+,]/g, ''));
        
        if (current >= target) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(formatNumber(current) + (end.includes('+') ? '+' : ''));
        }
      }, 1000 / 60);
      
      return () => clearInterval(counter);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [end, duration, delay]);
  
  return <span>{count}</span>;
};

export default Stats;