import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Target, Award, Heart, CheckCircle, Lightbulb, Globe } from 'lucide-react';

const EducationSection = () => {
  const educationDimensions = [
    {
      icon: Users,
      title: 'Equity',
      description: 'Ensuring non-discrimination and equal access regardless of gender, ethnic origin, or family background.',
      highlight: 'No child left behind'
    },
    {
      icon: Target,
      title: 'Contextualisation',
      description: 'Adapting education systems based on real community needs rather than one-size-fits-all solutions.',
      highlight: 'Community-centered approach'
    },
    {
      icon: Heart,
      title: 'Child-friendly Learning',
      description: 'Putting children at the center and helping them reach their full potential through active participation.',
      highlight: 'Student-centered education'
    },
    {
      icon: Globe,
      title: 'Sustainability',
      description: 'Building local capacities and institutionalizing educational change processes for lasting impact.',
      highlight: 'Long-term solutions'
    },
    {
      icon: Award,
      title: 'Balanced Approach',
      description: 'Developing economic, social, and personal capabilities for productive and fulfilling lives.',
      highlight: 'Holistic development'
    },
    {
      icon: CheckCircle,
      title: 'Learning Outcomes',
      description: 'Ensuring minimum standards of literacy, numeracy, and life skills through results-oriented approach.',
      highlight: 'Measurable results'
    }
  ];

  const keyFocus = [
    'Threshold levels of literacy and numeracy',
    'Basic scientific knowledge and understanding',
    'Essential life skills and disease prevention',
    'Teacher capacity development programs',
    'Community engagement and empowerment',
    'Technology integration for modern learning'
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4">
            A Quality <span className="text-gradient">Education</span> for Every Child
          </h2>
          <p className="text-body max-w-4xl mx-auto mb-8">
            Education is a powerful driver of prosperity. Our main focus is to provide free quality 
            education with better facilities for underprivileged children. We believe education is 
            essential for every individual to grow and lead a happy, dignified life.
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-primary-50 via-secondary-50 to-accent-50 rounded-2xl p-6 lg:p-8 border border-primary-200"
          >
            <div className="flex items-center justify-center mb-4">
              <Lightbulb className="h-8 w-8 text-primary-500 mr-3" />
              <h3 className="text-xl font-semibold text-soft-900">Our Definition of Quality Education</h3>
            </div>
            <p className="text-soft-700 text-lg leading-relaxed max-w-4xl mx-auto">
              <em>"A good quality education provides all learners with capabilities they require to become 
              economically productive, develop sustainable livelihoods, contribute to peaceful and 
              democratic societies, and enhance individual well-being."</em>
            </p>
          </motion.div>
        </motion.div>

        {/* Six Dimensions of Quality Education */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center text-soft-900 mb-4">
            Six Crucial Dimensions of <span className="text-gradient">Quality Education</span>
          </h3>
          <p className="text-body text-center max-w-3xl mx-auto mb-12">
            INFANT NGO believes that education leads to empowerment. Quality education is crucial 
            in combating poverty and inequality in society.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {educationDimensions.map((dimension, index) => (
              <motion.div
                key={dimension.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card p-6 group cursor-pointer"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                  className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                >
                  <dimension.icon className="h-6 w-6 text-white" />
                </motion.div>
                
                <h4 className="text-lg font-semibold text-soft-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {dimension.title}
                </h4>
                
                <p className="text-soft-600 text-sm mb-3 leading-relaxed">
                  {dimension.description}
                </p>
                
                <div className="inline-flex items-center px-3 py-1 bg-accent-50 rounded-full border border-accent-200">
                  <span className="text-xs font-semibold text-accent-700">
                    {dimension.highlight}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Focus Areas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-warm-50 to-primary-50 rounded-2xl p-8 lg:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            <div>
              <h3 className="text-2xl font-bold text-soft-900 mb-6">
                Our Educational <span className="text-gradient">Priorities</span>
              </h3>
              <p className="text-soft-600 mb-6 leading-relaxed">
                Technology has provided abundant opportunities, but lack of education remains the main 
                barrier. We focus on essential skills and knowledge that every child needs to succeed.
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {keyFocus.map((focus, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                    <span className="text-soft-700">{focus}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-warm"
              >
                <div className="w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-soft-900 mb-4">
                  Education = Empowerment
                </h4>
                <p className="text-soft-600 mb-6">
                  We strengthen individuals, organizations, and communities to get more control 
                  over their lives and environments.
                </p>
                <motion.a
                  href="/donate"
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Support Education
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EducationSection;