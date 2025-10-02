import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  X
} from 'lucide-react';

// Utils
import { NGO_INFO } from '../utils/constants';

const Events = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Event data
  const event = {
    id: 1,
    title: "Community Health & Nutrition Drive",
    description: "Join us for a comprehensive health and nutrition drive aimed at supporting infants and children in our community.",
    images: [
      '/images/event1/IMG_8325.jpg',
      '/images/event1/img1.JPG',
      '/images/event1/img2.jpg',
      '/images/event1/img3.JPG',
      '/images/event1/img4.JPG',
      '/images/event1/img5.JPG',
      '/images/event1/img6.jpg',
      '/images/event1/img7.jpg'
    ],
    impact: "150+ children received health checkups and nutritional support"
  };

  const openImageModal = (imageIndex) => {
    setCurrentImageIndex(imageIndex);
    setSelectedImage(event.images[imageIndex]);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % event.images.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(event.images[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = currentImageIndex === 0 ? event.images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(event.images[prevIndex]);
  };


  return (
    <>
      <Helmet>
        <title>Events - {NGO_INFO.name}</title>
        <meta 
          name="description" 
          content={`Join ${NGO_INFO.name} events and make a difference in the lives of infants and children.`}
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-warm-50 via-primary-50 to-accent-50">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-soft-900 mb-6">
                Our <span className="text-gradient">Events</span>
              </h1>
              <p className="text-lg md:text-xl text-soft-700 max-w-3xl mx-auto">
                Join us in making a difference through our community events and programs.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Event Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              {/* Event Header */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 mb-8 shadow-glass border border-primary-200/50">
                <div className="mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-soft-900 mb-4">
                    {event.title}
                  </h2>
                  <p className="text-lg text-soft-600 mb-6">
                    {event.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <Heart className="h-4 w-4 mr-1" />
                      Completed
                    </span>
                  </div>
                  <div className="text-sm text-soft-600">
                    <strong>Impact:</strong> {event.impact}
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-glass border border-primary-200/50">
                <h3 className="text-2xl font-bold text-soft-900 mb-6">Event Gallery</h3>
                
                {/* Grid Layout for Images */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {event.images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group cursor-pointer"
                      onClick={() => openImageModal(index)}
                    >
                      <div className="aspect-square overflow-hidden rounded-xl bg-soft-100">
                        <img
                          src={image}
                          alt={`${event.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                            <Heart className="h-5 w-5 text-soft-700" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Image Counter */}
                <div className="mt-6 text-center">
                  <p className="text-soft-600">
                    {event.images.length} photos from this event
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join Our Next Event
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Be part of our mission to support infants and children.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors duration-200"
                >
                  Get Involved
                </a>
                <a
                  href="/donate"
                  className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
                >
                  Support Our Mission
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="absolute -top-12 right-0 text-white hover:text-primary-300 transition-colors duration-200 z-10"
              >
                <X className="h-8 w-8" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-primary-300 transition-colors duration-200 z-10"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-primary-300 transition-colors duration-200 z-10"
              >
                <ChevronRight className="h-8 w-8" />
              </button>

              {/* Image */}
              <img
                src={selectedImage}
                alt={`Event gallery image ${currentImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                {currentImageIndex + 1} of {event.images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Events;