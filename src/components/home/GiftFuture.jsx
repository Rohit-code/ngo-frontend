import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Heart, BookOpen, Users, Star, ArrowRight, Sparkles } from 'lucide-react';

const GiftFuture = () => {
  const sponsorshipOptions = [
    {
      icon: BookOpen,
      title: 'Basic Education Package',
      amount: '₹2,500',
      period: 'per month',
      description: 'Sponsor a child\'s basic education including books, supplies, and school fees.',
      features: [
        'School fees and supplies',
        'Textbooks and materials',
        'Basic educational support',
        'Progress tracking'
      ],
      popular: false
    },
    {
      icon: Star,
      title: 'Complete Development Package',
      amount: '₹5,000',
      period: 'per month',
      description: 'Comprehensive support including education, extracurricular activities, and development programs.',
      features: [
        'Complete education support',
        'Extracurricular activities',
        'Sports and arts programs',
        'Personal mentoring',
        'Regular progress reports'
      ],
      popular: true
    },
    {
      icon: Users,
      title: 'Community Impact Package',
      amount: '₹10,000',
      period: 'per month',
      description: 'Support multiple children and contribute to community-wide educational improvements.',
      features: [
        'Support for 3-4 children',
        'Community infrastructure',
        'Teacher training programs',
        'Educational technology',
        'Long-term sustainability'
      ],
      popular: false
    }
  ];

  const impactNumbers = [
    { number: 'Quality', label: 'Education Focus', icon: '📚' },
    { number: 'Complete', label: 'Development', icon: '📈' },
    { number: 'Trusted', label: 'Organization', icon: '⭐' },
    { number: 'Transparent', label: 'Operations', icon: '🔍' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-accent-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Gift className="h-8 w-8 text-primary-500 mr-3" />
            <h2 className="heading-lg">
              Gift a <span className="text-gradient">Future!</span>
            </h2>
            <Sparkles className="h-6 w-6 text-secondary-400 ml-3" />
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-semibold text-primary-600 mb-4"
          >
            Sponsor Education of a Child
          </motion.p>
          
          <p className="text-body max-w-3xl mx-auto mb-8">
            Transform a child's life by sponsoring their education with school fees and 
            extracurricular activities. Your support creates lasting change and builds brighter futures.
          </p>

          {/* Impact Numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {impactNumbers.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="text-center"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-primary-600 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-soft-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sponsorship Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {sponsorshipOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`card p-8 relative group cursor-pointer ${
                option.popular 
                  ? 'border-2 border-primary-300 shadow-warm' 
                  : 'border border-warm-200'
              }`}
            >
              {/* Popular Badge */}
              {option.popular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                >
                  <div className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </motion.div>
              )}

              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 ${
                  option.popular 
                    ? 'bg-gradient-warm text-white' 
                    : 'bg-primary-100 text-primary-600'
                }`}
              >
                <option.icon className="h-8 w-8" />
              </motion.div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-soft-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {option.title}
                </h3>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-primary-600">{option.amount}</span>
                  <span className="text-soft-500 ml-1">{option.period}</span>
                </div>
                <p className="text-soft-600 text-sm leading-relaxed">
                  {option.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {option.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + idx * 0.05 + 0.5 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-2 h-2 bg-accent-500 rounded-full flex-shrink-0" />
                    <span className="text-soft-700 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.a
                href={`/donate?amount=${option.amount.replace('₹', '').replace(',', '')}&type=monthly`}
                className={`btn-primary w-full justify-center group ${
                  option.popular ? 'btn-primary' : 'btn-secondary'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Sponsor Now
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 lg:p-12 text-center text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Every Child Deserves a Bright Future
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Your sponsorship doesn't just fund education – it transforms lives, builds confidence, 
            and creates opportunities that last a lifetime.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/donate"
              className="btn-secondary bg-white text-primary-600 hover:bg-warm-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Gift className="h-4 w-4 mr-2" />
              Choose Your Package
            </motion.a>
            
            <motion.a
              href="/contact"
              className="btn-primary bg-white/20 text-white border-white/30 hover:bg-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
              <ArrowRight className="h-4 w-4 ml-2" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GiftFuture;