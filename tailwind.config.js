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
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 245, 160, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 245, 160, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
