import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useDragControls } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const Carousel = ({ 
  images = [], 
  autoPlay = true, 
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  className = "",
  height = "auto" // auto, sm, md, lg, xl
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const dragControls = useDragControls();
  const x = useMotionValue(0);

  // Default images if none provided
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

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || isDragging) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, autoPlayInterval, slides.length, isDragging]);

  // Height classes mapping
  const heightClasses = {
    auto: 'h-48 sm:h-64 md:h-80 lg:h-96',
    sm: 'h-40 sm:h-48 md:h-56',
    md: 'h-56 sm:h-64 md:h-72 lg:h-80',
    lg: 'h-64 sm:h-80 md:h-96 lg:h-[28rem]',
    xl: 'h-72 sm:h-96 md:h-[28rem] lg:h-[32rem]'
  };

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Touch/drag handlers
  const handleDragStart = (event, info) => {
    setIsDragging(true);
    setDragStartX(info.point.x);
    setIsPlaying(false); // Pause autoplay during drag
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const dragDistance = info.point.x - dragStartX;
    const threshold = 50; // Minimum drag distance to trigger slide change

    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }

    // Resume autoplay after a delay
    if (autoPlay) {
      setTimeout(() => setIsPlaying(true), 1000);
    }

    x.set(0); // Reset position
  };

  // Touch handlers for better mobile support
  const handleTouchStart = (e) => {
    setDragStartX(e.touches[0].clientX);
    setIsDragging(true);
    setIsPlaying(false);
  };

  const handleTouchEnd = (e) => {
    setIsDragging(false);
    const touchEndX = e.changedTouches[0].clientX;
    const dragDistance = touchEndX - dragStartX;
    const threshold = 50;

    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }

    // Resume autoplay
    if (autoPlay) {
      setTimeout(() => setIsPlaying(true), 1000);
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl shadow-peaceful ${className}`}
      ref={containerRef}
    >
      {/* Main Image Container */}
      <div className={`relative ${heightClasses[height]} overflow-hidden`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: isMobile ? 0 : 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isMobile ? 0 : -300 }}
            transition={{ 
              duration: isMobile ? 0.3 : 0.5, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 select-none"
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ x }}
          >
            <picture>
              {/* Different image sizes for different devices */}
              <source 
                media="(max-width: 480px)" 
                srcSet={`${slides[currentIndex].src}&w=480&q=80`} 
              />
              <source 
                media="(max-width: 768px)" 
                srcSet={`${slides[currentIndex].src}&w=768&q=80`} 
              />
              <source 
                media="(max-width: 1024px)" 
                srcSet={`${slides[currentIndex].src}&w=1024&q=80`} 
              />
              <img
                src={slides[currentIndex].src}
                alt={slides[currentIndex].alt}
                className="w-full h-full object-cover"
                loading="lazy"
                draggable="false"
              />
            </picture>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Caption */}
            {slides[currentIndex].caption && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6"
              >
                <h3 className="text-white text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold drop-shadow-lg leading-tight">
                  {slides[currentIndex].caption}
                </h3>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Loading placeholder */}
        <div className="absolute inset-0 bg-gradient-warm opacity-20 animate-pulse" />
      </div>

      {/* Navigation Arrows - Larger touch targets for mobile */}
      {showArrows && slides.length > 1 && (
        <>
          <motion.button
            onClick={goToPrevious}
            className={`carousel-control absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 ${
              isMobile ? 'w-12 h-12' : 'w-10 h-10 sm:w-12 sm:h-12'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </motion.button>

          <motion.button
            onClick={goToNext}
            className={`carousel-control absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 ${
              isMobile ? 'w-12 h-12' : 'w-10 h-10 sm:w-12 sm:h-12'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </motion.button>
        </>
      )}

      {/* Play/Pause Button */}
      {autoPlay && (
        <motion.button
          onClick={toggleAutoPlay}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors touch-friendly"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            <Play className="h-3 w-3 sm:h-4 sm:w-4 ml-0.5" />
          )}
        </motion.button>
      )}

      {/* Dots Indicator - Responsive sizing */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 touch-friendly ${
                index === currentIndex 
                  ? 'bg-white scale-125 w-3 h-3 sm:w-4 sm:h-4' 
                  : 'bg-white/50 hover:bg-white/75 w-2 h-2 sm:w-3 sm:h-3'
              }`}
              whileHover={{ scale: index === currentIndex ? 1.25 : 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Loading Indicator */}
      {isPlaying && !isDragging && (
        <div className="absolute bottom-0 left-0 h-1 bg-primary-500/30 w-full">
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

      {/* Swipe Indicator for Mobile */}
      {isMobile && slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 text-xs animate-pulse">
          ← Swipe to navigate →
        </div>
      )}
    </div>
  );
};

export default Carousel;