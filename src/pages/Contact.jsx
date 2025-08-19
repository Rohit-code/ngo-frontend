import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react';
import { NGO_INFO, SOCIAL_LINKS } from '../utils/constants';
import { isValidEmail, isValidMobile } from '../utils/helpers';
import { ButtonLoading } from '../components/common/Loading';
import toast from 'react-hot-toast';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call (replace with actual contact form submission)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Thank you for your message! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      details: [NGO_INFO.phone],
      subtitle: 'Mon - Fri, 9 AM - 6 PM',
      color: 'text-primary-500 bg-primary-100'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: [NGO_INFO.email],
      subtitle: 'We respond within 24 hours',
      color: 'text-accent-500 bg-accent-100'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: [NGO_INFO.address],
      subtitle: 'Our office location',
      color: 'text-secondary-500 bg-secondary-100'
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: SOCIAL_LINKS.facebook, name: 'Facebook', color: 'text-blue-600' },
    { icon: Twitter, href: SOCIAL_LINKS.twitter, name: 'Twitter', color: 'text-sky-500' },
    { icon: Instagram, href: SOCIAL_LINKS.instagram, name: 'Instagram', color: 'text-pink-500' },
    { icon: Linkedin, href: SOCIAL_LINKS.linkedin, name: 'LinkedIn', color: 'text-blue-700' },
    { icon: Youtube, href: SOCIAL_LINKS.youtube, name: 'YouTube', color: 'text-red-600' }
  ];

  const faqs = [
    {
      question: 'How can I make a donation?',
      answer: 'You can make a donation through our secure online donation form, by phone, or by visiting our office. We accept various payment methods including cards and bank transfers.'
    },
    {
      question: 'Are donations tax-deductible?',
      answer: 'Yes! Your donations are eligible for up to 50% tax exemption under Section 80G of the Income Tax Act. We\'ll provide you with a tax exemption certificate.'
    },
    {
      question: 'How do you use the donations?',
      answer: 'We use donations to provide healthcare, nutrition, education, and family support programs for infants and children. We maintain complete transparency in our spending.'
    },
    {
      question: 'Can I volunteer with your organization?',
      answer: 'Absolutely! We welcome volunteers who want to make a difference. Contact us to learn about current volunteer opportunities and how you can get involved.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - {NGO_INFO.name}</title>
        <meta 
          name="description" 
          content={`Get in touch with ${NGO_INFO.name}. Contact us for donations, volunteering, partnerships, or any questions about our work with infants and children.`}
        />
        <meta 
          name="keywords" 
          content="contact infant NGO, get in touch, volunteer, partnership, donation inquiry, support"
        />
        <meta property="og:title" content={`Contact Us - ${NGO_INFO.name}`} />
        <meta property="og:description" content="Contact us to learn more about our work or to get involved in supporting infants and children." />
      </Helmet>

      <div className="min-h-screen bg-warm-50">
        
        {/* Header */}
        <section className="py-16 bg-gradient-to-br from-primary-50 via-warm-50 to-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="heading-lg mb-4">
                Get in <span className="text-gradient">Touch</span>
              </h1>
              <p className="text-body max-w-2xl mx-auto">
                We'd love to hear from you! Whether you have questions, want to volunteer, 
                or are interested in partnering with us, we're here to help.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card p-6 text-center group hover:shadow-warm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                    className={`w-16 h-16 ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <info.icon className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-soft-900 mb-2">
                    {info.title}
                  </h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-soft-600 font-medium">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="text-soft-500 text-sm mt-2">
                    {info.subtitle}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="card p-8">
                  <h2 className="text-2xl font-bold text-soft-900 mb-6 flex items-center">
                    <MessageCircle className="h-6 w-6 text-primary-500 mr-3" />
                    Send us a Message
                  </h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-soft-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        {...register('name', { 
                          required: 'Name is required',
                          minLength: { value: 2, message: 'Name must be at least 2 characters' }
                        })}
                        type="text"
                        placeholder="Enter your full name"
                        className="form-input"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-soft-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        {...register('email', { 
                          required: 'Email is required',
                          validate: (value) => isValidEmail(value) || 'Please enter a valid email'
                        })}
                        type="email"
                        placeholder="Enter your email address"
                        className="form-input"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-soft-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        {...register('phone', {
                          validate: (value) => !value || isValidMobile(value) || 'Please enter a valid mobile number'
                        })}
                        type="tel"
                        placeholder="Enter your phone number"
                        className="form-input"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-soft-700 mb-2">
                        Subject *
                      </label>
                      <select
                        {...register('subject', { required: 'Please select a subject' })}
                        className="form-select"
                      >
                        <option value="">Select a subject</option>
                        <option value="donation">Donation Inquiry</option>
                        <option value="volunteer">Volunteer Opportunity</option>
                        <option value="partnership">Partnership</option>
                        <option value="general">General Question</option>
                        <option value="support">Technical Support</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-soft-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        {...register('message', { 
                          required: 'Message is required',
                          minLength: { value: 10, message: 'Message must be at least 10 characters' }
                        })}
                        placeholder="Tell us how we can help you..."
                        rows={5}
                        className="form-input resize-none"
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <ButtonLoading
                      type="submit"
                      isLoading={isSubmitting}
                      className="btn-primary w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </ButtonLoading>
                  </form>
                </div>
              </motion.div>

              {/* Additional Information */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                
                {/* Office Hours */}
                <div className="card p-6">
                  <h3 className="text-xl font-semibold text-soft-900 mb-4 flex items-center">
                    <Clock className="h-5 w-5 text-primary-500 mr-3" />
                    Office Hours
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-soft-600">Monday - Friday</span>
                      <span className="font-medium text-soft-900">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-soft-600">Saturday</span>
                      <span className="font-medium text-soft-900">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-soft-600">Sunday</span>
                      <span className="font-medium text-soft-900">Closed</span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-primary-50 rounded-xl">
                    <p className="text-primary-800 text-sm">
                      <strong>Emergency:</strong> For urgent matters related to child welfare, 
                      please call our emergency hotline available 24/7.
                    </p>
                  </div>
                </div>

                {/* Social Media */}
                <div className="card p-6">
                  <h3 className="text-xl font-semibold text-soft-900 mb-4">
                    Follow Us
                  </h3>
                  <p className="text-soft-600 mb-4">
                    Stay connected with our latest updates and impact stories.
                  </p>
                  <div className="flex space-x-4">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 bg-soft-100 rounded-xl flex items-center justify-center ${social.color} hover:bg-soft-200 transition-colors`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={social.name}
                      >
                        <social.icon className="h-5 w-5" />
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Quick Donation */}
                <div className="card p-6 bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
                  <h3 className="text-xl font-semibold text-soft-900 mb-4 flex items-center">
                    <Heart className="h-5 w-5 text-primary-500 mr-3" />
                    Ready to Make a Difference?
                  </h3>
                  <p className="text-soft-600 mb-4">
                    Don't wait to help! Your donation can start making an impact today.
                  </p>
                  <motion.a
                    href="/donate"
                    className="btn-primary w-full justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Donate Now
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gradient-to-br from-warm-50 to-primary-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="heading-lg mb-4">
                Frequently Asked <span className="text-gradient">Questions</span>
              </h2>
              <p className="text-body">
                Find quick answers to common questions about our organization and how you can help.
              </p>
            </motion.div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card p-6"
                >
                  <h3 className="text-lg font-semibold text-soft-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-soft-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <p className="text-soft-600 mb-4">
                Still have questions? We're here to help!
              </p>
              <a
                href={`mailto:${NGO_INFO.email}`}
                className="btn-secondary"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Us Directly
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;