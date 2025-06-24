import { useState, useEffect, useCallback, useRef } from 'react';

// Device Detection Utilities
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || 'ontouchstart' in window;
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 769 && window.innerWidth <= 1024;
};

export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1025;
};

export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const isIOS = () => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = () => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

export const hasNotch = () => {
  if (typeof window === 'undefined') return false;
  return CSS.supports('padding-top: env(safe-area-inset-top)');
};

// Custom Hooks for Mobile

/**
 * Hook to detect device type and screen size
 */
export const useDevice = () => {
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouchDevice: false,
    isIOS: false,
    isAndroid: false,
    hasNotch: false,
    width: 0,
    height: 0
  });

  useEffect(() => {
    const updateDevice = () => {
      setDevice({
        isMobile: isMobile(),
        isTablet: isTablet(),
        isDesktop: isDesktop(),
        isTouchDevice: isTouchDevice(),
        isIOS: isIOS(),
        isAndroid: isAndroid(),
        hasNotch: hasNotch(),
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDevice();
    
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDevice, 150); // Debounced resize
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', updateDevice);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateDevice);
      clearTimeout(timeoutId);
    };
  }, []);

  return device;
};

/**
 * Hook for touch gesture handling
 */
export const useTouch = (onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold = 50) => {
  const [startTouch, setStartTouch] = useState(null);
  const [endTouch, setEndTouch] = useState(null);

  const handleTouchStart = useCallback((e) => {
    setEndTouch(null);
    setStartTouch({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now()
    });
  }, []);

  const handleTouchMove = useCallback((e) => {
    setEndTouch({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!startTouch || !endTouch) return;

    const distanceX = startTouch.x - endTouch.x;
    const distanceY = startTouch.y - endTouch.y;
    const isLeftSwipe = distanceX > threshold;
    const isRightSwipe = distanceX < -threshold;
    const isUpSwipe = distanceY > threshold;
    const isDownSwipe = distanceY < -threshold;

    if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
    if (isRightSwipe && onSwipeRight) onSwipeRight();
    if (isUpSwipe && onSwipeUp) onSwipeUp();
    if (isDownSwipe && onSwipeDown) onSwipeDown();
  }, [startTouch, endTouch, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };
};

/**
 * Hook for viewport height handling (addresses mobile browser URL bar issues)
 */
export const useViewportHeight = () => {
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const updateVh = () => {
      const height = window.innerHeight * 0.01;
      setVh(height);
      document.documentElement.style.setProperty('--vh', `${height}px`);
    };

    updateVh();
    
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateVh, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', updateVh);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateVh);
      clearTimeout(timeoutId);
    };
  }, []);

  return vh;
};

/**
 * Hook for scroll direction detection
 */
export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [scrollY, setScrollY] = useState(0);
  const prevScrollY = useRef(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const direction = prevScrollY.current < currentScrollY ? 'down' : 'up';
      
      if (direction !== scrollDirection && Math.abs(currentScrollY - prevScrollY.current) > 10) {
        setScrollDirection(direction);
      }
      
      setScrollY(currentScrollY);
      prevScrollY.current = currentScrollY;
    };

    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScrollDirection, 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [scrollDirection]);

  return { scrollDirection, scrollY };
};

/**
 * Hook for haptic feedback
 */
export const useHaptic = () => {
  const vibrate = useCallback((pattern = 10) => {
    if (navigator.vibrate && isTouchDevice()) {
      navigator.vibrate(pattern);
    }
  }, []);

  const lightTap = useCallback(() => vibrate(10), [vibrate]);
  const mediumTap = useCallback(() => vibrate(25), [vibrate]);
  const heavyTap = useCallback(() => vibrate(50), [vibrate]);
  const doubleTap = useCallback(() => vibrate([25, 50, 25]), [vibrate]);
  const errorTap = useCallback(() => vibrate([100, 50, 100]), [vibrate]);
  const successTap = useCallback(() => vibrate([25, 25, 25]), [vibrate]);

  return {
    vibrate,
    lightTap,
    mediumTap,
    heavyTap,
    doubleTap,
    errorTap,
    successTap
  };
};

/**
 * Hook for safe area insets
 */
export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  useEffect(() => {
    const updateSafeArea = () => {
      if (hasNotch()) {
        const computedStyle = getComputedStyle(document.documentElement);
        setSafeArea({
          top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
          bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
          left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0'),
          right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0')
        });
      }
    };

    updateSafeArea();
    window.addEventListener('orientationchange', updateSafeArea);

    return () => {
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);

  return safeArea;
};

/**
 * Hook for network status
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detect connection type if available
    if ('connection' in navigator) {
      const connection = navigator.connection;
      setConnectionType(connection.effectiveType || 'unknown');
      
      const updateConnectionType = () => {
        setConnectionType(connection.effectiveType || 'unknown');
      };
      
      connection.addEventListener('change', updateConnectionType);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', updateConnectionType);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionType };
};

// Utility Functions

/**
 * Prevent zoom on double tap for iOS
 */
export const preventZoom = (element) => {
  if (!element || !isIOS()) return;

  let lastTouchEnd = 0;
  element.addEventListener('touchend', (event) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
};

/**
 * Optimize scroll performance
 */
export const optimizeScroll = () => {
  document.body.style.overflowScrolling = 'touch';
  document.body.style.webkitOverflowScrolling = 'touch';
};

/**
 * Lock body scroll (useful for modals on mobile)
 */
export const lockBodyScroll = () => {
  const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
  return scrollY;
};

/**
 * Unlock body scroll
 */
export const unlockBodyScroll = (scrollY = 0) => {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollY);
};

/**
 * Get responsive image URL based on device
 */
export const getResponsiveImageUrl = (baseUrl, deviceType = null) => {
  const device = deviceType || (isMobile() ? 'mobile' : isTablet() ? 'tablet' : 'desktop');
  const widths = {
    mobile: 480,
    tablet: 768,
    desktop: 1200
  };

  const width = widths[device];
  const dpr = window.devicePixelRatio || 1;
  const finalWidth = Math.round(width * dpr);

  // Assume the base URL supports width and quality parameters
  return `${baseUrl}&w=${finalWidth}&q=${dpr > 1 ? 75 : 80}`;
};

/**
 * Format text for mobile display (truncate if needed)
 */
export const formatTextForMobile = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Debounce function optimized for mobile
 */
export const mobileDebounce = (func, wait = 150) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for scroll events
 */
export const scrollThrottle = (func, limit = 16) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if element is in viewport (mobile optimized)
 */
export const isInViewport = (element, threshold = 0.1) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const vertInView = rect.top <= windowHeight * (1 - threshold) && rect.bottom >= windowHeight * threshold;
  const horInView = rect.left <= windowWidth * (1 - threshold) && rect.right >= windowWidth * threshold;
  
  return vertInView && horInView;
};

/**
 * Smooth scroll to element with mobile considerations
 */
export const scrollToElement = (elementId, offset = 0, behavior = 'smooth') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.offsetTop;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: behavior
  });
};

/**
 * Copy to clipboard with mobile support
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older mobile browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      return true;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * PWA installation utilities
 */
export const usePWA = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (!installPrompt) return false;

    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      setInstallPrompt(null);
      setIsInstallable(false);
      return result.outcome === 'accepted';
    } catch (error) {
      console.error('PWA installation failed:', error);
      return false;
    }
  };

  return {
    isInstallable,
    installPWA
  };
};

export default {
  isMobile,
  isTablet,
  isDesktop,
  isTouchDevice,
  isIOS,
  isAndroid,
  hasNotch,
  useDevice,
  useTouch,
  useViewportHeight,
  useScrollDirection,
  useHaptic,
  useSafeArea,
  useNetworkStatus,
  usePWA,
  preventZoom,
  optimizeScroll,
  lockBodyScroll,
  unlockBodyScroll,
  getResponsiveImageUrl,
  formatTextForMobile,
  mobileDebounce,
  scrollThrottle,
  isInViewport,
  scrollToElement,
  copyToClipboard
};