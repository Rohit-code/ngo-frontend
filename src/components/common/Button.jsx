import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ripple = true,
  haptic = true,
  accessibility = true,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);
  const scale = useMotionValue(1);
  const opacity = useTransform(scale, [0.95, 1], [0.8, 1]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Base classes optimized for mobile with smooth focus
  const baseClasses = clsx(
    'relative inline-flex items-center justify-center font-medium',
    'transition-all duration-300 ease-in-out',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'select-none overflow-hidden',
    // Touch-friendly minimum sizes
    'min-h-[44px] min-w-[44px]',
    // Better mobile tap target
    isMobile && 'active:scale-95',
    // Smooth focus ring without harsh squares
    'focus-visible:ring-primary-500/50 focus-visible:ring-offset-2',
    'focus-visible:shadow-lg focus-visible:shadow-primary-500/25'
  );
  
  const variants = {
    primary: clsx(
      'text-white bg-gradient-to-r from-primary-500 to-primary-600 border border-transparent shadow-lg',
      'hover:from-primary-600 hover:to-primary-700 hover:shadow-xl',
      'focus-visible:ring-white/50 focus-visible:ring-offset-primary-600',
      'focus-visible:from-primary-600 focus-visible:to-primary-700 focus-visible:shadow-xl',
      isMobile ? '' : 'transform hover:scale-105 hover:-translate-y-0.5'
    ),
    secondary: clsx(
      'text-primary-600 bg-white/90 backdrop-blur-md border border-primary-300 shadow-glass',
      'hover:bg-white hover:border-primary-400 hover:shadow-glass-hover',
      'focus-visible:ring-primary-500/50 focus-visible:bg-white',
      'focus-visible:border-primary-500 focus-visible:shadow-lg'
    ),
    accent: clsx(
      'text-white bg-gradient-to-r from-accent-500 to-accent-600 border border-transparent shadow-lg',
      'hover:from-accent-600 hover:to-accent-700 hover:shadow-xl',
      'focus-visible:ring-white/50 focus-visible:ring-offset-accent-600',
      'focus-visible:from-accent-600 focus-visible:to-accent-700 focus-visible:shadow-xl',
      isMobile ? '' : 'transform hover:scale-105 hover:-translate-y-0.5'
    ),
    outline: clsx(
      'text-soft-600 bg-transparent border border-soft-300',
      'hover:bg-soft-50 hover:border-soft-400 hover:text-soft-700',
      'focus-visible:ring-soft-500/50 focus-visible:bg-soft-50',
      'focus-visible:border-soft-500 focus-visible:text-soft-700'
    ),
    ghost: clsx(
      'text-soft-600 bg-transparent border border-transparent',
      'hover:bg-soft-100 hover:text-soft-700',
      'focus-visible:ring-soft-500/50 focus-visible:bg-soft-100',
      'focus-visible:text-soft-700'
    ),
    danger: clsx(
      'text-white bg-red-500 border border-transparent shadow-sm',
      'hover:bg-red-600 hover:shadow-lg',
      'focus-visible:ring-white/50 focus-visible:ring-offset-red-600',
      'focus-visible:bg-red-600 focus-visible:shadow-xl',
      isMobile ? '' : 'transform hover:scale-105 hover:-translate-y-0.5'
    ),
    success: clsx(
      'text-white bg-green-500 border border-transparent shadow-sm',
      'hover:bg-green-600 hover:shadow-lg',
      'focus-visible:ring-white/50 focus-visible:ring-offset-green-600',
      'focus-visible:bg-green-600 focus-visible:shadow-xl',
      isMobile ? '' : 'transform hover:scale-105 hover:-translate-y-0.5'
    ),
    warm: clsx(
      'text-white bg-warm-500 border border-transparent shadow-warm',
      'hover:bg-warm-600 hover:shadow-peaceful',
      'focus-visible:ring-white/50 focus-visible:ring-offset-warm-600',
      'focus-visible:bg-warm-600 focus-visible:shadow-xl',
      isMobile ? '' : 'transform hover:scale-105 hover:-translate-y-0.5'
    )
  };
  
  const sizes = {
    xs: 'px-2 py-1.5 text-xs rounded-lg min-h-[36px]',
    sm: 'px-3 py-2 text-sm rounded-lg min-h-[40px]',
    md: 'px-4 py-3 text-base rounded-xl min-h-[44px]',
    lg: 'px-6 py-4 text-lg rounded-xl min-h-[48px]',
    xl: 'px-8 py-5 text-xl rounded-2xl min-h-[52px]'
  };
  
  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6'
  };

  // Mobile-specific size adjustments
  const mobileAdjustedSize = isMobile ? {
    xs: 'px-3 py-2 text-sm rounded-lg min-h-[40px]',
    sm: 'px-4 py-2.5 text-sm rounded-lg min-h-[44px]',
    md: 'px-5 py-3 text-base rounded-xl min-h-[48px]',
    lg: 'px-6 py-4 text-lg rounded-xl min-h-[52px]',
    xl: 'px-8 py-5 text-xl rounded-2xl min-h-[56px]'
  }[size] : sizes[size];

  const buttonClasses = clsx(
    baseClasses,
    variants[variant],
    mobileAdjustedSize,
    fullWidth && 'w-full',
    className
  );

  // Haptic feedback for mobile devices
  const triggerHaptic = () => {
    if (haptic && isMobile && navigator.vibrate) {
      navigator.vibrate(10); // Very light haptic feedback
    }
  };

  // Create ripple effect
  const createRipple = (event) => {
    if (!ripple || !buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (e) => {
    if (disabled || isLoading) return;
    
    // Create ripple effect
    createRipple(e);
    
    // Trigger haptic feedback
    triggerHaptic();
    
    // Visual feedback
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    // Call onClick handler
    if (onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isLoading) {
      e.preventDefault();
      handleClick(e);
    }
  };

  const handleFocus = () => {
    // Add subtle scale on focus for better feedback
    if (!isMobile) {
      scale.set(1.02);
    }
  };

  const handleBlur = () => {
    // Reset scale on blur
    scale.set(1);
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled || isLoading}
      style={{ scale, opacity }}
      whileTap={disabled || isLoading ? {} : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-pressed={isPressed}
      aria-busy={isLoading}
      role="button"
      tabIndex={0}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center">
          <Loader2 className={clsx('animate-spin', iconSizes[size], children && 'mr-2')} />
          {children && <span>Loading...</span>}
        </div>
      ) : (
        <div className="flex items-center">
          {/* Left icon */}
          {Icon && iconPosition === 'left' && (
            <motion.div
              initial={false}
              animate={{ rotate: isPressed ? 5 : 0 }}
              transition={{ duration: 0.1 }}
              className={clsx(iconSizes[size], children && 'mr-2')}
            >
              <Icon className="w-full h-full" />
            </motion.div>
          )}
          
          {/* Button text */}
          {children && (
            <span className="relative">
              {children}
            </span>
          )}
          
          {/* Right icon */}
          {Icon && iconPosition === 'right' && (
            <motion.div
              initial={false}
              animate={{ rotate: isPressed ? -5 : 0 }}
              transition={{ duration: 0.1 }}
              className={clsx(iconSizes[size], children && 'ml-2')}
            >
              <Icon className="w-full h-full" />
            </motion.div>
          )}
        </div>
      )}

      {/* Smooth focus ring */}
      <motion.div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isPressed ? 0.1 : 0,
          scale: isPressed ? 0.95 : 1
        }}
        transition={{ duration: 0.15 }}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)'
        }}
      />
    </motion.button>
  );
};

// Specialized button components with mobile optimizations
export const PrimaryButton = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="primary" {...props} />
));
PrimaryButton.displayName = 'PrimaryButton';

export const SecondaryButton = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="secondary" {...props} />
));
SecondaryButton.displayName = 'SecondaryButton';

export const AccentButton = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="accent" {...props} />
));
AccentButton.displayName = 'AccentButton';

export const OutlineButton = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="outline" {...props} />
));
OutlineButton.displayName = 'OutlineButton';

export const GhostButton = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="ghost" {...props} />
));
GhostButton.displayName = 'GhostButton';

export const DangerButton = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="danger" {...props} />
));
DangerButton.displayName = 'DangerButton';

export const SuccessButton = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="success" {...props} />
));
SuccessButton.displayName = 'SuccessButton';

export const WarmButton = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="warm" {...props} />
));
WarmButton.displayName = 'WarmButton';

// Mobile-specific button variants
export const MobileButton = React.forwardRef((props, ref) => (
  <Button 
    ref={ref} 
    size="md" 
    ripple={true}
    haptic={true}
    className="min-h-[48px] px-6 py-3 font-medium"
    {...props} 
  />
));
MobileButton.displayName = 'MobileButton';

export const TouchButton = React.forwardRef((props, ref) => (
  <Button 
    ref={ref} 
    size="lg" 
    ripple={true}
    haptic={true}
    className="min-h-[52px] px-8 py-4 font-semibold touch-friendly"
    {...props} 
  />
));
TouchButton.displayName = 'TouchButton';

export default Button;