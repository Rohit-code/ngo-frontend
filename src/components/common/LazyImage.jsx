import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/placeholder.jpg',
  sizes = '100vw',
  loading = 'lazy'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      <motion.img
        src={imageSrc}
        alt={alt}
        loading={loading}
        sizes={sizes}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => {
          if (imageSrc !== placeholder) {
            setImageLoaded(true);
          }
        }}
        onError={() => {
          setImageError(true);
          setImageSrc(placeholder);
        }}
      />
      
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gradient-warm opacity-20 animate-pulse" />
      )}
    </div>
  );
};

export default LazyImage;