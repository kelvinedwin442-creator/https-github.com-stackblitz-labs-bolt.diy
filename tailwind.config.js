/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pitch: {
          light: '#2d6a4f',
          dark: '#1b4332',
          line: '#ffffff',
          lineDark: 'rgba(255, 255, 255, 0.75)',
          stripe1: '#1e4b38',
          stripe2: '#245a44',
          tacticalDark: '#12261f',
          blueprint: '#0f2438',
          blueprintStripe: '#0b1d2e',
          chalkboard: '#1e293b',
          chalkboardStripe: '#182232',
          indoor: '#a36d40',
          indoorStripe: '#925f35',
        },
        tactics: {
          blue: '#2563eb',
          red: '#dc2626',
          yellow: '#eab308',
          green: '#16a34a',
          purple: '#9333ea',
          orange: '#ea580c',
          cyan: '#06b6d4',
          white: '#f8fafc',
          black: '#0f172a',
        },
        brand: {
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
          accent: '#10b981',
          gold: '#f59e0b',
        }
      },
      /*
       * System fonts only — deliberate. Grassroots coaches open this on cheap Android
       * devices, sometimes with no network at all, and as a single HTML file shared on
       * WhatsApp. A webfont request is a point of failure we cannot afford.
       */
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
        display: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'tactical': '0 4px 20px -2px rgba(0, 0, 0, 0.35)',
        'pitch': 'inset 0 0 100px rgba(0, 0, 0, 0.4)',
        'glow-green': '0 0 15px rgba(34, 197, 94, 0.4)',
        'glow-blue': '0 0 15px rgba(37, 99, 235, 0.4)',
        'glow-red': '0 0 15px rgba(220, 38, 38, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
