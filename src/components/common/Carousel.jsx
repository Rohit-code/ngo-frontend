import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const Carousel = ({ 
  images = [], 
  autoPlay = true, 
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Default images if none provided - Beautiful, natural NGO images
  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Joyful children playing and learning together",
      caption: "Creating Joyful Learning Experiences"
    },
    {
      src: "https://images.unsplash.com/photo-1586769852044-692d6df65393?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Gentle healthcare for children",
      caption: "Compassionate Healthcare for Every Child"
    },
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Children sharing healthy meals together",
      caption: "Nourishing Bodies and Minds"
    },
    {
      src: "https://images.unsplash.com/photo-1594736797933-d0dba0e6b999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Happy family moment with children",
      caption: "Strengthening Families and Communities"
    },
    {
      src: "https://images.unsplash.com/photo-1502781252888-9143ba7f074e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Children in a beautiful learning environment",
      caption: "Safe Spaces for Growth and Discovery"
    }
  ];

  const slides = images.length > 0 ? images : defaultImages;

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, autoPlayInterval, slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-peaceful ${className}`}>
      {/* Main Image Container */}
      <div className="relative h-64 md:h-80 lg:h-96">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={slides[currentIndex].src}
              alt={slides[currentIndex].alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {/* Caption */}
            {slides[currentIndex].caption && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-4 left-4 right-4"
              >
                <h3 className="text-white text-lg md:text-xl font-semibold drop-shadow-lg">
                  {slides[currentIndex].caption}
                </h3>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <motion.button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>

          <motion.button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </>
      )}

      {/* Play/Pause Button */}
      {autoPlay && (
        <motion.button
          onClick={toggleAutoPlay}
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </motion.button>
      )}

      {/* Dots Indicator */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Loading Indicator */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 h-1 bg-primary-500/30">
          <motion.div
            className="h-full bg-primary-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: autoPlayInterval / 1000, 
              ease: "linear",
              repeat: Infinity
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Carousel;