/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#07090E',
          800: '#0C0F17',
          700: '#141824',
          600: '#1E2436',
          500: '#2A324B',
        },
        trade: {
          bull: '#00F5A0',
          bear: '#FF3B69',
          warn: '#FFB800',
          cyan: '#00E5FF',
          accent: '#7000FF',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'border-glow': 'borderGlow 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 245, 160, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 245, 160, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0, 229, 255, 0.2), inset 0 0 8px rgba(0, 229, 255, 0.05)' },
          '50%': { boxShadow: '0 0 24px rgba(0, 229, 255, 0.4), inset 0 0 16px rgba(0, 229, 255, 0.1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(0, 229, 255, 0.3)' },
          '50%': { borderColor: 'rgba(0, 229, 255, 0.6)' },
        },
      },
      backdropBlur: {
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
    },
  },
  plugins: [],
}
