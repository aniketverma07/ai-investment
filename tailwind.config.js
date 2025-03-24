/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        'primary-dark': '#7c3aed',
        'primary-light': '#a78bfa',
        dark: {
          900: '#0F0F11',
          800: '#151518',
          700: '#1C1C21',
          600: '#24242B',
          500: '#2D2D36',
        },
        secondary: {
          DEFAULT: '#8B5CF6', // Purple
          dark: '#6D28D9',
        },
        accent: {
          DEFAULT: '#10B981', // Teal/green
          dark: '#059669',
        },
        futuristic: {
          blue: '#00A3FF',
          purple: '#9333EA',
          teal: '#06B6D4',
          cyan: '#22D3EE',
          indigo: '#6366F1',
        },
        success: 'rgb(16, 185, 129)',
        warning: 'rgb(245, 158, 11)',
        error: 'rgb(239, 68, 68)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
        'futuristic-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #4F46E5 50%, #7C3AED 100%)',
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(139, 92, 246, 0.5)',
      },
      animation: {
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.glass-dark': {
          backgroundColor: 'rgba(15, 15, 17, 0.7)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1rem',
          border: '1px solid rgba(139, 92, 246, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        },
      });
    },
  ],
};
