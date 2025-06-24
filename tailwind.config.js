/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Peaceful, welcoming color palette for INFANT NGO
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Main teal - calm and trustworthy
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Gentle green - growth and hope
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef', // Soft purple - care and compassion
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        warm: {
          50: '#fef7f0',
          100: '#feecdc',
          200: '#fcd9bd',
          300: '#fdba8c',
          400: '#ff8a65',
          500: '#ff7043', // Gentle coral - warmth without aggression
          600: '#f4511e',
          700: '#e64a19',
          800: '#d84315',
          900: '#bf360c',
        },
        earth: {
          50: '#fdfcfb',
          100: '#faf8f5',
          200: '#f5f0e8',
          300: '#ede4d3',
          400: '#e0d0b7',
          500: '#d4b896', // Warm beige - natural and grounding
          600: '#c19e73',
          700: '#a67c52',
          800: '#8b5a3c',
          900: '#654321',
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
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
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
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          from: { boxShadow: '0 0 20px rgba(20, 184, 166, 0.5)' },
          to: { boxShadow: '0 0 30px rgba(20, 184, 166, 0.8)' },
        },
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #ff7043 0%, #14b8a6 50%, #22c55e 100%)',
        'gradient-soft': 'linear-gradient(135deg, #22c55e 0%, #14b8a6 50%, #d946ef 100%)',
        'gradient-`hero`': 'linear-gradient(135deg, #14b8a6 0%, #22c55e 25%, #d946ef 75%, #ff7043 100%)',
        'gradient-peaceful': 'linear-gradient(135deg, #f0fdfa 0%, #f0fdf4 50%, #fdf4ff 100%)',
        'gradient-calm': 'linear-gradient(135deg, #ccfbf1 0%, #dcfce7 50%, #fae8ff 100%)',
        'gradient-serene': 'linear-gradient(135deg, #14b8a6 0%, #22c55e 100%)',
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(255, 112, 67, 0.25)',
        'soft': '0 4px 20px -2px rgba(34, 197, 94, 0.25)',
        'peaceful': '0 4px 20px -2px rgba(20, 184, 166, 0.25)',
        'gentle': '0 2px 10px -1px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}