import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Shield, 
  Users, 
  Award, 
  BookOpen, 
  Stethoscope,
  Home,
  Utensils
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Stethoscope,
      title: 'Healthcare Support',
      description: 'Providing essential medical care, regular health checkups, and emergency medical assistance for infants and children.',
      color: 'text-red-500 bg-red-100',
    //   stats: '2,500+ Children'
    },
    {
      icon: Utensils,
      title: 'Nutrition Programs',
      description: 'Ensuring proper nutrition through meal programs, nutritional supplements, and feeding support for growing children.',
      color: 'text-orange-500 bg-orange-100',
    //   stats: '100,000+ Meals'
    },
    {
      icon: BookOpen,
      title: 'Education Support',
      description: 'Early childhood education programs, learning materials, and educational support to give children a bright future.',
      color: 'text-blue-500 bg-blue-100',
    //   stats: '1,500+ Students'
    },
    {
      icon: Home,
      title: 'Safe Environment',
      description: 'Creating safe, nurturing environments where children can grow, learn, and develop in a protected setting.',
      color: 'text-green-500 bg-green-100',
    //   stats: '50+ Safe Spaces'
    },
    {
      icon: Users,
      title: 'Family Support',
      description: 'Supporting families with resources, guidance, and assistance to create better living conditions for their children.',
      color: 'text-purple-500 bg-purple-100',
    //   stats: '5,000+ Families'
    },
    {
      icon: Shield,
      title: 'Child Protection',
      description: 'Protecting children from harm, abuse, and neglect while advocating for their rights and wellbeing.',
      color: 'text-indigo-500 bg-indigo-100',
    //   stats: '100% Protection'
    }
  ];

  const whyChooseUs = [
    {
      icon: Award,
      title: 'Tax Benefits',
      description: 'Your donations are eligible for tax benefits. Please consult your local tax advisor for details.'
    },
    {
      icon: Shield,
      title: 'Transparent Operations',
      description: 'Complete transparency in how your donations are used with regular updates and impact reports.'
    },
    {
      icon: Heart,
      title: 'Direct Impact',
      description: 'Your contributions directly reach the children and families who need support the most.'
    }
  ];

  return (
    <>
      {/* Main Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">
              How We <span className="text-gradient">Help</span>
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              Our comprehensive approach ensures that every child receives the care, 
              support, and opportunities they need to thrive and reach their full potential.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card p-6 lg:p-8 text-center group cursor-pointer"
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
                  className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl ${feature.color} 
                    flex items-center justify-center mx-auto mb-6 group-hover:scale-110 
                    transition-transform duration-300`}
                >
                  <feature.icon className="h-8 w-8 lg:h-10 lg:w-10" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-soft-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-soft-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Stats */}
                {/* <div className="inline-flex items-center px-4 py-2 bg-warm-100 rounded-full">
                  <span className="text-sm font-semibold text-primary-600">
                    {feature.stats}
                  </span>
                </div> */}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">
              Why <span className="text-gradient">Choose Us</span>
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              We're committed to making the biggest impact with your generous donations 
              through transparency, efficiency, and direct community engagement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ 
                    delay: index * 0.2 + 0.3,
                    type: "spring",
                    stiffness: 200
                  }}
                  className="w-20 h-20 bg-white rounded-2xl shadow-warm flex items-center justify-center mx-auto mb-6"
                >
                  <item.icon className="h-10 w-10 text-primary-500" />
                </motion.div>
                
                <h3 className="text-xl font-semibold text-soft-900 mb-3">
                  {item.title}
                </h3>
                
                <p className="text-soft-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-warm">
              <h3 className="heading-sm mb-4">
                Ready to Make a <span className="text-gradient">Difference</span>?
              </h3>
              <p className="text-body mb-6 max-w-xl mx-auto">
                Join thousands of supporters who are helping us transform the lives 
                of infants and children across communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/donate"
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Start Donating
                </motion.a>
                <motion.a
                  href="/about"
                  className="btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More About Us
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Features;