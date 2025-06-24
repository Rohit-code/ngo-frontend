import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Target, 
  Users, 
  Award, 
  Shield, 
  BookOpen, 
  Stethoscope, 
  Home,
  Eye,
  Lightbulb,
  HandHeart
} from 'lucide-react';
import { NGO_INFO, STATS } from '../utils/constants';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Compassion',
      description: 'We approach every child and family with genuine care, empathy, and understanding.',
      color: 'text-red-500 bg-red-100'
    },
    {
      icon: Shield,
      title: 'Trust',
      description: 'We maintain complete transparency in our operations and build lasting trust with our community.',
      color: 'text-blue-500 bg-blue-100'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We work together with families, communities, and partners to achieve our shared goals.',
      color: 'text-green-500 bg-green-100'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for the highest quality in all our programs and services for children.',
      color: 'text-yellow-500 bg-yellow-100'
    }
  ];

  const programs = [
    {
      icon: Stethoscope,
      title: 'Healthcare Programs',
      description: 'Comprehensive medical care including regular checkups, vaccinations, emergency treatment, and specialized care for infants and children.',
    },
    {
      icon: BookOpen,
      title: 'Education Support',
      description: 'Early childhood education, school supplies, tutoring programs, and educational scholarships to ensure every child has access to quality education.',
    },
    {
      icon: Home,
      title: 'Safe Housing',
      description: 'Providing safe, clean, and nurturing living environments for children who need temporary or long-term housing assistance.',
    },
    {
      icon: HandHeart,
      title: 'Family Support',
      description: 'Counseling, parenting support, skill development programs, and financial assistance to strengthen families and communities.',
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - {NGO_INFO.name}</title>
        <meta 
          name="description" 
          content={`Learn about ${NGO_INFO.name}, our mission to support infants and children, our programs, values, and the impact we're making in communities.`}
        />
        <meta 
          name="keywords" 
          content="about infant organisation, child welfare organization, mission, vision, programs, team"
        />
        <meta property="og:title" content={`About Us - ${NGO_INFO.name}`} />
        <meta property="og:description" content="Discover our mission to support infants and children through healthcare, education, and family support programs." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary-50 via-soft-50 to-secondary-50 overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-20"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="heading-xl mb-6">
                About <span className="text-gradient">Infant Organisation</span>
              </h1>
              <p className="text-body max-w-3xl mx-auto mb-8">
                {NGO_INFO.description}
              </p>
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-peaceful border border-primary-200 p-4"
                >
                  <img
                    src="/logo.jpg"
                    alt="Infant Organisation Logo"
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="card p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                    <Target className="h-6 w-6 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-soft-900">Our Mission</h2>
                </div>
                <p className="text-soft-600 leading-relaxed mb-4">
                  Helping you towards a healthier, wealthier, happier and longer life through comprehensive 
                  support programs that address the fundamental needs of infants and children.
                </p>
                <p className="text-soft-600 leading-relaxed">
                  We provide quality education, healthcare, nutrition, and family support to ensure every 
                  child has the opportunity to grow, learn, and thrive in a safe and nurturing environment, 
                  ultimately contributing to peaceful and democratic societies.
                </p>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="card p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mr-4">
                    <Eye className="h-6 w-6 text-secondary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-soft-900">Our Vision</h2>
                </div>
                <p className="text-soft-600 leading-relaxed">
                  A future where every infant and child, regardless of their circumstances, has access 
                  to quality healthcare, education, nutrition, and a loving family environment. We 
                  envision communities where children are valued, protected, and empowered to reach 
                  their full potential.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-gradient-to-br from-primary-50 via-soft-50 to-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="heading-lg mb-4">
                Our <span className="text-gradient">Values</span>
              </h2>
              <p className="text-body max-w-2xl mx-auto">
                These core values guide everything we do and shape how we serve 
                the children and families in our community.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card p-6 text-center group cursor-pointer hover:shadow-peaceful"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                    className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-soft-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-soft-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Programs */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="heading-lg mb-4">
                Our <span className="text-gradient">Programs</span>
              </h2>
              <p className="text-body max-w-2xl mx-auto">
                We offer comprehensive programs designed to address the diverse needs 
                of infants, children, and their families.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {programs.map((program, index) => (
                <motion.div
                  key={program.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card p-8 group hover:shadow-peaceful"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                      <program.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-soft-900 mb-3 group-hover:text-primary-600 transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-soft-600 mb-4 leading-relaxed">
                        {program.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quality Education Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 rounded-2xl p-8 lg:p-12"
            >
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-bold text-soft-900 mb-4">
                  Our Approach to <span className="text-gradient">Quality Education</span>
                </h3>
                <div className="max-w-4xl mx-auto">
                  <p className="text-lg text-soft-700 mb-6 italic">
                    "A good quality education provides all learners with capabilities they require to become 
                    economically productive, develop sustainable livelihoods, contribute to peaceful and 
                    democratic societies, and enhance individual well-being."
                  </p>
                  <p className="text-soft-600 leading-relaxed">
                    Education leads to empowerment - a process of strengthening individuals, organizations, 
                    and communities so they get more control over their lives, situations, and environments. 
                    Quality education is crucial in combating poverty and inequality in society.
                  </p>
                </div>
              </div>

              {/* Six Dimensions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Inclusivity',
                    description: 'Creating welcoming environments where every child feels valued and supported.',
                    icon: '🤝'
                  },
                  {
                    title: 'Child-Centered Learning',
                    description: 'Placing children at the heart of learning, respecting their natural curiosity.',
                    icon: '👶'
                  },
                  {
                    title: 'Family Partnership',
                    description: 'Working hand-in-hand with families to support children\'s growth.',
                    icon: '👨‍👩‍👧‍👦'
                  },
                  {
                    title: 'Community Connection',
                    description: 'Building strong community networks that support children and families.',
                    icon: '🌱'
                  },
                  {
                    title: 'Holistic Development',
                    description: 'Supporting the whole child - emotional, social, physical, and cognitive development.',
                    icon: '⭐'
                  },
                  {
                    title: 'Sustainable Impact',
                    description: 'Creating programs that build local capacity and ensure long-term positive outcomes.',
                    icon: '📊'
                  }
                ].map((dimension, index) => (
                  <motion.div
                    key={dimension.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 text-center border border-primary-100"
                  >
                    <div className="text-3xl mb-3">{dimension.icon}</div>
                    <h4 className="font-semibold text-soft-900 mb-2">{dimension.title}</h4>
                    <p className="text-soft-600 text-sm leading-relaxed">{dimension.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Impact Stats */}
        {/* <section className="py-20 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Impact in Numbers
              </h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Together with our supporters, we've been able to make a real difference 
                in the lives of thousands of children and families.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {STATS.map((stat, index) => (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl lg:text-5xl font-bold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg opacity-90">
                    {stat.name}
                  </div>
                  <div className="text-3xl mt-2 opacity-60">
                    {stat.icon}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="heading-lg mb-6">
                Join Our <span className="text-gradient">Mission</span>
              </h2>
              <p className="text-body mb-8">
                Whether through donations, volunteering, or spreading awareness, 
                there are many ways to get involved and help us make a difference 
                in the lives of infants and children.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/donate"
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Make a Donation
                </motion.a>
                <motion.a
                  href="/contact"
                  className="btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Involved
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;