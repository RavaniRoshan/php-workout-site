/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.php",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx,html}",
    "./src/css/workout-card.css",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Fitness theme colors
        primary: {
          blue: '#00D4FF',
          green: '#39FF7A', 
          orange: '#FF6B35',
          50: '#f0fdff',
          100: '#ccf7fe',
          200: '#99effd',
          300: '#66e7fc',
          400: '#33dffb',
          500: '#00D4FF',
          600: '#00a3cc',
          700: '#007299',
          800: '#004166',
          900: '#001033'
        },
        secondary: {
          green: '#39FF7A',
          50: '#f0fff4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#39FF7A',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        accent: {
          orange: '#FF6B35',
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FF6B35',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12'
        },
        background: {
          main: '#0B1426',
          card: '#1A2332',
          elevated: '#2D3748'
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#E2E8F0',
          muted: '#A0AEC0',
          dark: '#1A202C'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-green': '0 0 20px rgba(57, 255, 122, 0.3)',
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-blue-green': 'linear-gradient(135deg, #00D4FF 0%, #39FF7A 100%)',
        'gradient-orange-pink': 'linear-gradient(135deg, #FF6B35 0%, #F093FB 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}