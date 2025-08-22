
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen, Stethoscope, Utensils, Home, Users, Target, Sparkles } from 'lucide-react';
import Carousel from '../common/Carousel';

const FocusAreas = () => {
  const focusAreas = [
    {
      icon: BookOpen,
      title: 'Education',
      description: 'We rejuvenate children\'s educational experiences, focusing on building foundational academic skills so they are positively invested in their learning now and in the future.',
      color: 'text-blue-500 bg-blue-100',
    //   stats: '1,500+ Students Supported'
    },
    {
      icon: Stethoscope,
      title: 'Health',
      description: 'Medical camps conducted by health professionals carry out limited health interventions amongst the underprivileged community, providing free check-ups and treatment.',
      color: 'text-red-500 bg-red-100',
    //   stats: '2,500+ Medical Checkups'
    },
    {
      icon: Utensils,
      title: 'Food',
      description: 'We work to end hunger and malnutrition by providing nutritious cooked meals to poor, needy & hungry people with a smooth, efficient and dependable distribution system.',
      color: 'text-green-500 bg-green-100',
    //   stats: '100,000+ Meals Served'
    }
  ];

  const carouselImages = [
    {
      src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Children learning in classroom",
      caption: "Quality Education for Every Child"
    },
    {
      src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Healthcare for children",
      caption: "Healthcare Support for Growing Minds"
    },
    {
      src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Children receiving meals",
      caption: "Nutrition Programs for Healthy Growth"
    },
    {
      src: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Happy children playing",
      caption: "Building Brighter Futures Together"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-warm-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-primary-500 mr-2" />
            <h2 className="heading-lg">
              Our <span className="text-gradient">Focus</span>
            </h2>
            <Sparkles className="h-6 w-6 text-primary-500 ml-2" />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-semibold text-primary-600 mb-4"
          >
            Helping You Towards a Healthier, Wealthier, Happier and Longer Life
          </motion.p>
          <p className="text-body max-w-3xl mx-auto">
            Our comprehensive approach focuses on the fundamental pillars that ensure 
            every child has the opportunity to thrive and reach their full potential.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          
          {/* Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Carousel 
              images={carouselImages}
              autoPlay={true}
              autoPlayInterval={4000}
              height="md"
              className="shadow-2xl"
            />
          </motion.div>

          {/* Focus Areas Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {focusAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="card p-6 group cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                    className={`w-12 h-12 ${area.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <area.icon className="h-6 w-6" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-soft-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {area.title}
                    </h3>
                    <p className="text-soft-600 mb-3 leading-relaxed">
                      {area.description}
                    </p>
                    <div className="inline-flex items-center px-3 py-1 bg-primary-50 rounded-full">
                      <span className="text-sm font-semibold text-primary-700">
                        {area.stats}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-warm border border-primary-100">
            <h3 className="heading-sm mb-4">
              Join Our <span className="text-gradient">Mission</span>
            </h3>
            <p className="text-body mb-6 max-w-2xl mx-auto">
              Together, we can create lasting change in the lives of children and families. 
              Your support helps us continue our vital work across education, health, and nutrition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/donate"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="h-4 w-4 mr-2" />
                Support Our Cause
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
  );
};

export default FocusAreas;