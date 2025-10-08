import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  X,
  Calendar,
  MapPin,
  Users
} from 'lucide-react';

// Services
import { eventsService } from '../services/eventsService';

// Utils
import { NGO_INFO } from '../utils/constants';
import config from '../config/environment';

const Events = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsService.getCompletedEvents();
      if (response.success) {
        setEvents(response.data.events || []);
        // Set the first event as selected by default
        if (response.data.events && response.data.events.length > 0) {
          setSelectedEvent(response.data.events[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to hardcoded data if API fails
      setEvents([{
        id: 1,
        title: "Community Health & Nutrition Drive",
        description: "Join us for a comprehensive health and nutrition drive aimed at supporting infants and children in our community.",
        images: [
          { url: '/images/event1/IMG_8325.jpg' },
          { url: '/images/event1/img1.JPG' },
          { url: '/images/event1/img2.jpg' },
          { url: '/images/event1/img3.JPG' },
          { url: '/images/event1/img4.JPG' },
          { url: '/images/event1/img5.JPG' },
          { url: '/images/event1/img6.jpg' },
          { url: '/images/event1/img7.jpg' }
        ],
        impact: "150+ children received health checkups and nutritional support",
        date: "2024-01-15",
        location: "Community Center, Mumbai"
      }]);
      setSelectedEvent({
        id: 1,
        title: "Community Health & Nutrition Drive",
        description: "Join us for a comprehensive health and nutrition drive aimed at supporting infants and children in our community.",
        images: [
          { url: '/images/event1/IMG_8325.jpg' },
          { url: '/images/event1/img1.JPG' },
          { url: '/images/event1/img2.jpg' },
          { url: '/images/event1/img3.JPG' },
          { url: '/images/event1/img4.JPG' },
          { url: '/images/event1/img5.JPG' },
          { url: '/images/event1/img6.jpg' },
          { url: '/images/event1/img7.jpg' }
        ],
        impact: "150+ children received health checkups and nutritional support",
        date: "2024-01-15",
        location: "Community Center, Mumbai"
      });
    } finally {
      setLoading(false);
    }
  };

  const openImageModal = (imageIndex) => {
    if (!selectedEvent || !selectedEvent.images) return;
    setCurrentImageIndex(imageIndex);
    setSelectedImage(selectedEvent.images[imageIndex]);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (!selectedEvent || !selectedEvent.images) return;
    const nextIndex = (currentImageIndex + 1) % selectedEvent.images.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(selectedEvent.images[nextIndex]);
  };

  const prevImage = () => {
    if (!selectedEvent || !selectedEvent.images) return;
    const prevIndex = currentImageIndex === 0 ? selectedEvent.images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(selectedEvent.images[prevIndex]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

        {/* Events Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-soft-600">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-soft-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-soft-600 mb-2">No events found</h3>
                <p className="text-soft-500">Check back later for upcoming events</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
              >
                {/* Event Selection */}
                {events.length > 1 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-soft-900 mb-4">Select an Event</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {events.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                            selectedEvent?.id === event.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-soft-200 hover:border-primary-300 bg-white'
                          }`}
                        >
                          <h4 className="font-semibold text-soft-900 mb-2">{event.title}</h4>
                          <p className="text-sm text-soft-600 mb-2 line-clamp-2">{event.description}</p>
                          <div className="flex items-center gap-2 text-xs text-soft-500">
                            {event.date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Event Display */}
                {selectedEvent && (
                  <>
                    {/* Event Header */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 mb-8 shadow-glass border border-primary-200/50">
                      <div className="mb-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-soft-900 mb-4">
                          {selectedEvent.title}
                        </h2>
                        <p className="text-lg text-soft-600 mb-6">
                          {selectedEvent.description}
                        </p>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEvent.status)}`}>
                            <Heart className="h-4 w-4 mr-1" />
                            {selectedEvent.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-4 text-sm text-soft-600">
                          {selectedEvent.date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(selectedEvent.date).toLocaleDateString()}
                            </div>
                          )}
                          {selectedEvent.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {selectedEvent.location}
                            </div>
                          )}
                          {selectedEvent.impact && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {selectedEvent.impact}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-glass border border-primary-200/50">
                      <h3 className="text-2xl font-bold text-soft-900 mb-6">Event Gallery</h3>
                      
                      {selectedEvent.images && selectedEvent.images.length > 0 ? (
                        <>
                          {/* Grid Layout for Images */}
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {selectedEvent.images.map((image, index) => (
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
                  src={image.url ? `${config.BASE_URL}${image.url}` : (image.file_path ? `${config.BASE_URL}${image.file_path}` : image)}
                  alt={`${selectedEvent.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error('Image load error:', image.url || image.file_path);
                    e.target.style.display = 'none';
                  }}
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
                              {selectedEvent.images.length} photos from this event
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <Heart className="h-16 w-16 text-soft-400 mx-auto mb-4" />
                          <p className="text-soft-600">No images available for this event</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}
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
                  src={selectedImage?.url ? `${config.BASE_URL}${selectedImage.url}` : (selectedImage?.file_path ? `${config.BASE_URL}${selectedImage.file_path}` : selectedImage)}
                  alt={`Event gallery image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error('Modal image load error:', selectedImage?.url || selectedImage?.file_path);
                    e.target.style.display = 'none';
                  }}
                />

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                {currentImageIndex + 1} of {selectedEvent?.images?.length || 0}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Events;