/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Enhanced breakpoints for better device targeting
    screens: {
      'xs': '375px',    // Small phones
      'sm': '640px',    // Large phones / small tablets
      'md': '768px',    // Tablets
      'lg': '1024px',   // Small laptops
      'xl': '1280px',   // Large laptops
      '2xl': '1536px',  // Desktop monitors
      '3xl': '1920px',  // Large desktop monitors
      
      // Custom breakpoints for specific use cases
      'mobile': {'max': '767px'},     // Mobile-only styles
      'tablet': {'min': '768px', 'max': '1023px'}, // Tablet-only styles
      'desktop': {'min': '1024px'},   // Desktop and above
      
      // Height-based breakpoints
      'h-sm': {'raw': '(max-height: 640px)'},
      'h-md': {'raw': '(min-height: 641px) and (max-height: 900px)'},
      'h-lg': {'raw': '(min-height: 901px)'},
      
      // Orientation breakpoints
      'portrait': {'raw': '(orientation: portrait)'},
      'landscape': {'raw': '(orientation: landscape)'},
    },
    
    extend: {
      colors: {
        // Enhanced peaceful color palette for INFANT NGO
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        warm: {
          50: '#fef7f0',
          100: '#feecdc',
          200: '#fcd9bd',
          300: '#fdba8c',
          400: '#ff8a65',
          500: '#ff7043',
          600: '#f4511e',
          700: '#e64a19',
          800: '#d84315',
          900: '#bf360c',
          950: '#8c2f0a',
        },
        earth: {
          50: '#fdfcfb',
          100: '#faf8f5',
          200: '#f5f0e8',
          300: '#ede4d3',
          400: '#e0d0b7',
          500: '#d4b896',
          600: '#c19e73',
          700: '#a67c52',
          800: '#8b5a3c',
          900: '#654321',
          950: '#4a2c14',
        },
        soft: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      
      fontFamily: {
        sans: [
          'Inter', 
          'ui-sans-serif', 
          'system-ui', 
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        display: [
          'Poppins', 
          'ui-sans-serif', 
          'system-ui', 
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
      },
      
      fontSize: {
        // Enhanced responsive font sizes
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        
        // Mobile-optimized font sizes
        'mobile-xs': ['0.7rem', { lineHeight: '1rem' }],
        'mobile-sm': ['0.8rem', { lineHeight: '1.1rem' }],
        'mobile-base': ['0.9rem', { lineHeight: '1.3rem' }],
        'mobile-lg': ['1rem', { lineHeight: '1.4rem' }],
        'mobile-xl': ['1.1rem', { lineHeight: '1.5rem' }],
      },
      
      spacing: {
        // Enhanced spacing scale for mobile
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
        
        // Safe area spacing for devices with notches
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      
      minHeight: {
        // Touch-friendly minimum heights
        'touch': '44px',
        'touch-lg': '48px',
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      
      minWidth: {
        // Touch-friendly minimum widths
        'touch': '44px',
        'touch-lg': '48px',
      },
      
      maxWidth: {
        // Mobile-optimized max widths
        'mobile': '100vw',
        'mobile-content': 'calc(100vw - 2rem)',
      },
      
      animation: {
        // Enhanced animations optimized for mobile
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-fast': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-up-fast': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scale-in': 'scaleIn 0.3s ease-out',
        'scale-out': 'scaleOut 0.3s ease-in',
        'rotate-slow': 'rotate 20s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(20, 184, 166, 0.5)' },
          'to': { boxShadow: '0 0 30px rgba(20, 184, 166, 0.8)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.8)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      
      backgroundImage: {
        // Enhanced gradients with peaceful colors
        'gradient-warm': 'linear-gradient(135deg, #ff7043 0%, #14b8a6 50%, #22c55e 100%)',
        'gradient-soft': 'linear-gradient(135deg, #22c55e 0%, #14b8a6 50%, #d946ef 100%)',
        'gradient-hero': 'linear-gradient(135deg, #14b8a6 0%, #22c55e 25%, #d946ef 75%, #ff7043 100%)',
        'gradient-peaceful': 'linear-gradient(135deg, #f0fdfa 0%, #f0fdf4 50%, #fdf4ff 100%)',
        'gradient-calm': 'linear-gradient(135deg, #ccfbf1 0%, #dcfce7 50%, #fae8ff 100%)',
        'gradient-serene': 'linear-gradient(135deg, #14b8a6 0%, #22c55e 100%)',
        'gradient-mobile': 'linear-gradient(180deg, #14b8a6 0%, #22c55e 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      },
      
      backdropBlur: {
        'xs': '2px',
      },
      
      borderRadius: {
        // Mobile-friendly border radius
        'mobile': '0.5rem',
        'mobile-lg': '0.75rem',
        'mobile-xl': '1rem',
      },
      
      boxShadow: {
        // Enhanced shadows with peaceful colors
        'warm': '0 4px 20px -2px rgba(255, 112, 67, 0.25)',
        'soft': '0 4px 20px -2px rgba(34, 197, 94, 0.25)',
        'peaceful': '0 4px 20px -2px rgba(20, 184, 166, 0.25)',
        'gentle': '0 2px 10px -1px rgba(0, 0, 0, 0.1)',
        'mobile': '0 2px 8px -1px rgba(0, 0, 0, 0.1)',
        'mobile-lg': '0 4px 16px -2px rgba(0, 0, 0, 0.15)',
        'glow-primary': '0 0 20px rgba(20, 184, 166, 0.4)',
        'glow-secondary': '0 0 20px rgba(34, 197, 94, 0.4)',
        'glow-accent': '0 0 20px rgba(217, 70, 239, 0.4)',
        'inner-mobile': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
      
      blur: {
        'xs': '2px',
      },
      
      // Custom utilities for mobile optimization
      aspectRatio: {
        'mobile-hero': '4/3',
        'mobile-card': '3/2',
        'mobile-banner': '16/9',
      },
      
      // Touch target sizes
      width: {
        'touch': '44px',
        'touch-lg': '48px',
        'touch-xl': '52px',
      },
      
      height: {
        'touch': '44px',
        'touch-lg': '48px',
        'touch-xl': '52px',
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        'mobile-nav': '60px',
        'mobile-header': '56px',
      },
    },
  },
  
  plugins: [
    // Custom plugin for mobile-specific utilities
    function({ addUtilities, theme, addComponents }) {
      // Mobile-first container utilities
      addUtilities({
        '.container-mobile': {
          width: '100%',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
          marginLeft: 'auto',
          marginRight: 'auto',
          '@screen sm': {
            paddingLeft: theme('spacing.6'),
            paddingRight: theme('spacing.6'),
          },
          '@screen lg': {
            paddingLeft: theme('spacing.8'),
            paddingRight: theme('spacing.8'),
          },
          '@screen xl': {
            maxWidth: theme('screens.xl'),
          },
          '@screen 2xl': {
            maxWidth: theme('screens.2xl'),
          },
        },
        
        // Safe area utilities
        '.pt-safe': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.pb-safe': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.pl-safe': {
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.pr-safe': {
          paddingRight: 'env(safe-area-inset-right)',
        },
        
        // Touch-friendly utilities
        '.touch-target': {
          minHeight: '44px',
          minWidth: '44px',
          padding: theme('spacing.2'),
        },
        
        // Mobile scrolling utilities
        '.scroll-smooth-mobile': {
          '-webkit-overflow-scrolling': 'touch',
          scrollBehavior: 'smooth',
        },
        
        // Text rendering optimization
        '.text-rendering-optimized': {
          textRendering: 'optimizeLegibility',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
        
        // Hardware acceleration for animations
        '.hardware-accelerated': {
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
        },
      });
      
      // Mobile-optimized components
      addComponents({
        '.btn-mobile': {
          padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
          fontSize: theme('fontSize.base')[0],
          lineHeight: theme('fontSize.base')[1].lineHeight,
          fontWeight: theme('fontWeight.medium'),
          borderRadius: theme('borderRadius.lg'),
          minHeight: '44px',
          minWidth: '44px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease-in-out',
          '&:active': {
            transform: 'scale(0.95)',
          },
          '@screen sm': {
            padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
            borderRadius: theme('borderRadius.xl'),
          },
        },
        
        '.card-mobile': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.4'),
          boxShadow: theme('boxShadow.mobile'),
          border: `1px solid ${theme('colors.primary.100')}`,
          marginLeft: theme('spacing.2'),
          marginRight: theme('spacing.2'),
          transition: 'all 0.3s ease-in-out',
          '@screen sm': {
            borderRadius: theme('borderRadius.xl'),
            padding: theme('spacing.6'),
            marginLeft: '0',
            marginRight: '0',
            boxShadow: theme('boxShadow.gentle'),
          },
        },
        
        '.form-input-mobile': {
          width: '100%',
          padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
          fontSize: '16px', // Prevents zoom on iOS
          lineHeight: theme('lineHeight.6'),
          backgroundColor: theme('colors.white'),
          border: `1px solid ${theme('colors.primary.200')}`,
          borderRadius: theme('borderRadius.lg'),
          minHeight: '44px',
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.500'),
            boxShadow: `0 0 0 2px ${theme('colors.primary.500')}40`,
          },
          '@screen sm': {
            borderRadius: theme('borderRadius.xl'),
          },
        },
      });
    },
  ],
  
  // Disable hover effects on touch devices
  future: {
    hoverOnlyWhenSupported: true,
  },
  
  // Dark mode support (optional)
  darkMode: 'class',
}