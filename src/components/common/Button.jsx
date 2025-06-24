import React from 'react';
import { motion } from 'framer-motion';
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
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'text-white bg-primary-500 border border-transparent shadow-warm hover:bg-primary-600 focus:ring-primary-500 transform hover:scale-105',
    secondary: 'text-primary-600 bg-white border border-primary-300 shadow-gentle hover:bg-primary-50 focus:ring-primary-500',
    accent: 'text-white bg-accent-500 border border-transparent shadow-soft hover:bg-accent-600 focus:ring-accent-500 transform hover:scale-105',
    outline: 'text-soft-600 bg-transparent border border-soft-300 hover:bg-soft-50 focus:ring-soft-500',
    ghost: 'text-soft-600 bg-transparent border border-transparent hover:bg-soft-100 focus:ring-soft-500',
    danger: 'text-white bg-red-500 border border-transparent shadow-sm hover:bg-red-600 focus:ring-red-500 transform hover:scale-105',
    success: 'text-white bg-green-500 border border-transparent shadow-sm hover:bg-green-600 focus:ring-green-500 transform hover:scale-105',
    warm: 'text-white bg-warm-500 border border-transparent shadow-warm hover:bg-warm-600 focus:ring-warm-500 transform hover:scale-105'
  };
  
  const sizes = {
    xs: 'px-3 py-1.5 text-xs rounded-lg',
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
    xl: 'px-10 py-5 text-xl rounded-2xl'
  };
  
  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6'
  };

  const buttonClasses = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className
  );

  const handleClick = (e) => {
    if (!disabled && !isLoading && onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || isLoading}
      whileHover={disabled || isLoading ? {} : { scale: variant === 'ghost' || variant === 'outline' ? 1.02 : 1.05 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.98 }}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className={clsx('animate-spin', iconSizes[size], children && 'mr-2')} />
          {children && <span>Loading...</span>}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={clsx(iconSizes[size], children && 'mr-2')} />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon className={clsx(iconSizes[size], children && 'ml-2')} />
          )}
        </>
      )}
    </motion.button>
  );
};

// Specialized button components
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const AccentButton = (props) => <Button variant="accent" {...props} />;
export const OutlineButton = (props) => <Button variant="outline" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
export const SuccessButton = (props) => <Button variant="success" {...props} />;
export const WarmButton = (props) => <Button variant="warm" {...props} />;

export default Button;