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
        primary: {
          DEFAULT: '#002C5F', // Hyundai Premium Navy
          dark: '#001A3D',
          glow: 'rgba(0, 44, 95, 0.4)',
        },
        secondary: {
          DEFAULT: '#E4D00A', // Premium Gold/Accent
          dark: '#B8A300',
        },
        background: {
          light: '#F8FAFC', // Slate 50
          dark: '#0F172A', // Slate 900
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E293B', // Slate 800
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
