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

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedImage) {
        if (event.key === 'ArrowLeft') {
          prevImage();
        } else if (event.key === 'ArrowRight') {
          nextImage();
        } else if (event.key === 'Escape') {
          closeImageModal();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentImageIndex, selectedEvent]);

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
        {/* Enhanced Hero Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-bold text-soft-900 mb-6 leading-tight">
                  Our <span className="text-gradient bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Events</span>
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mb-8"></div>
              </div>
              <p className="text-xl md:text-2xl text-soft-700 max-w-4xl mx-auto leading-relaxed">
                Join us in making a difference through our community events and programs that bring hope and support to infants and children.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-20">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-6"></div>
                  <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-accent-400 mx-auto animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <h3 className="text-xl font-semibold text-soft-700 mb-2">Loading Events</h3>
                <p className="text-soft-500">Please wait while we fetch our latest events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-gradient-to-br from-soft-100 to-soft-200 rounded-3xl p-16 border-2 border-dashed border-soft-300 max-w-2xl mx-auto">
                  <Heart className="h-20 w-20 text-soft-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-soft-600 mb-4">No Events Available</h3>
                  <p className="text-soft-500 text-lg">We're working on bringing you amazing events. Check back soon!</p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
              >
                {/* Enhanced Event Selection */}
                {events.length > 1 && (
                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-6 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"></div>
                      <h3 className="text-2xl font-bold text-soft-900">Select an Event</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {events.map((event) => (
                        <motion.button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${
                            selectedEvent?.id === event.id
                              ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg'
                              : 'border-soft-200 hover:border-primary-300 bg-white hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-soft-900 text-lg group-hover:text-primary-700 transition-colors">
                              {event.title}
                            </h4>
                            {selectedEvent?.id === event.id && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <p className="text-sm text-soft-600 mb-4 line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>
                          <div className="space-y-2">
                            {event.date && (
                              <div className="flex items-center gap-2 text-xs text-soft-500">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center gap-2 text-xs text-soft-500">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                            {event.images && event.images.length > 0 && (
                              <div className="flex items-center gap-2 text-xs text-primary-600 font-medium">
                                <Heart className="h-3 w-3" />
                                <span>{event.images.length} photos</span>
                              </div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Event Display */}
                {selectedEvent && (
                  <>
                    {/* Enhanced Event Header */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 md:p-10 mb-8 shadow-xl border border-primary-200/30"
                    >
                      <div className="mb-8">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <h2 className="text-3xl md:text-5xl font-bold text-soft-900 mb-4 leading-tight">
                              {selectedEvent.title}
                            </h2>
                            <p className="text-lg md:text-xl text-soft-600 leading-relaxed max-w-4xl">
                              {selectedEvent.description}
                            </p>
                          </div>
                          <div className="ml-6">
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${getStatusColor(selectedEvent.status)}`}>
                              <Heart className="h-4 w-4 mr-2" />
                              {selectedEvent.status?.charAt(0).toUpperCase() + selectedEvent.status?.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {selectedEvent.date && (
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl border border-primary-200/50">
                            <div className="p-2 bg-primary-500 rounded-xl">
                              <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-soft-700">Event Date</p>
                              <p className="text-base font-semibold text-soft-900">
                                {new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {selectedEvent.location && (
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-accent-50 to-accent-100 rounded-2xl border border-accent-200/50">
                            <div className="p-2 bg-accent-500 rounded-xl">
                              <MapPin className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-soft-700">Location</p>
                              <p className="text-base font-semibold text-soft-900">
                                {selectedEvent.location}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {selectedEvent.impact && (
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-warm-50 to-warm-100 rounded-2xl border border-warm-200/50">
                            <div className="p-2 bg-warm-500 rounded-xl">
                              <Users className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-soft-700">Impact</p>
                              <p className="text-base font-semibold text-soft-900">
                                {selectedEvent.impact}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Enhanced Image Gallery */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 md:p-10 shadow-xl border border-primary-200/30"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"></div>
                          <h3 className="text-3xl font-bold text-soft-900">Event Gallery</h3>
                        </div>
                        {selectedEvent.images && selectedEvent.images.length > 0 && (
                          <div className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                            {selectedEvent.images.length} {selectedEvent.images.length === 1 ? 'Photo' : 'Photos'}
                          </div>
                        )}
                      </div>
                      
                      {selectedEvent.images && selectedEvent.images.length > 0 ? (
                        <>
                          {/* Enhanced Responsive Grid Layout for Images */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                            {selectedEvent.images.map((image, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ 
                                  delay: index * 0.03,
                                  duration: 0.5,
                                  ease: "easeOut"
                                }}
                                whileHover={{ scale: 1.05 }}
                                className="relative group cursor-pointer"
                                onClick={() => openImageModal(index)}
                              >
                                <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-soft-100 to-soft-200 shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-transparent group-hover:border-primary-200">
                                  <img
                                    src={image.url ? `${config.BASE_URL}${image.url}` : (image.file_path ? `${config.BASE_URL}${image.file_path}` : image)}
                                    alt={`${selectedEvent.title} - Image ${index + 1}`}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                    loading="lazy"
                                    crossOrigin="anonymous"
                                    onError={(e) => {
                                      console.error('Image load error:', image.url || image.file_path);
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </div>
                                
                                {/* Enhanced Overlay with Better Positioning */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl flex items-end justify-center pb-4">
                                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="bg-white/95 backdrop-blur-md rounded-full p-3 shadow-xl border border-white/20">
                                      <Heart className="h-5 w-5 text-primary-600" />
                                    </div>
                                  </div>
                                </div>

                                {/* Enhanced Image Number Badge */}
                                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20">
                                  {index + 1}
                                </div>

                                {/* Click Indicator */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-300 rounded-2xl transition-all duration-300"></div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Enhanced Image Counter */}
                          <div className="mt-12 text-center">
                            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-3 rounded-full border border-primary-200/50 shadow-sm">
                              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                              <p className="text-soft-700 font-semibold text-lg">
                                {selectedEvent.images.length} {selectedEvent.images.length === 1 ? 'Photo' : 'Photos'} from this Event
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-16">
                          <div className="bg-gradient-to-br from-soft-100 to-soft-200 rounded-3xl p-12 border-2 border-dashed border-soft-300">
                            <Heart className="h-20 w-20 text-soft-400 mx-auto mb-6" />
                            <h4 className="text-xl font-semibold text-soft-600 mb-2">No Images Available</h4>
                            <p className="text-soft-500">Images will appear here once they are uploaded for this event</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </section>

        {/* Enhanced Call to Action */}
        <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}></div>
          </div>
          
          <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-8">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Join Our Next Event
                </h2>
                <div className="w-32 h-1 bg-white/30 mx-auto rounded-full mb-8"></div>
              </div>
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                Be part of our mission to support infants and children. Together, we can make a lasting impact in our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-50 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  Get Involved
                </motion.a>
                <motion.a
                  href="/donate"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 shadow-xl hover:shadow-2xl backdrop-blur-sm"
                >
                  Support Our Mission
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Enhanced Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative max-w-6xl max-h-full w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Enhanced Close Button */}
              <button
                onClick={closeImageModal}
                className="absolute -top-16 right-0 bg-black/30 hover:bg-black/50 backdrop-blur-lg text-white hover:text-primary-300 transition-all duration-300 z-10 rounded-full p-3 shadow-xl border border-white/10"
              >
                <X className="h-7 w-7" />
              </button>

              {/* Enhanced Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-lg text-white hover:text-primary-300 transition-all duration-300 z-10 rounded-full p-4 shadow-xl border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/30"
                disabled={currentImageIndex === 0}
              >
                <ChevronLeft className="h-7 w-7" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-lg text-white hover:text-primary-300 transition-all duration-300 z-10 rounded-full p-4 shadow-xl border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black/30"
                disabled={currentImageIndex === (selectedEvent?.images?.length || 0) - 1}
              >
                <ChevronRight className="h-7 w-7" />
              </button>

              {/* Enhanced Image Container */}
              <div className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center">
                <div className="relative">
                  <img
                    src={selectedImage?.url ? `${config.BASE_URL}${selectedImage.url}` : (selectedImage?.file_path ? `${config.BASE_URL}${selectedImage.file_path}` : selectedImage)}
                    alt={`Event gallery image ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.error('Modal image load error:', selectedImage?.url || selectedImage?.file_path);
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Image Border Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 via-transparent to-accent-500/20 pointer-events-none"></div>
                </div>
              </div>

              {/* Enhanced Image Counter */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-xl text-white px-8 py-4 rounded-full text-base font-semibold border border-white/20 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span>{currentImageIndex + 1} of {selectedEvent?.images?.length || 0}</span>
                </div>
              </div>

              {/* Keyboard Navigation Hint */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-lg text-white/80 px-4 py-2 rounded-full text-sm border border-white/10">
                Use ← → arrow keys to navigate
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Events;