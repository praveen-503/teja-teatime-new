/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          50:  '#fdf6f0',
          100: '#f9e8d8',
          200: '#f0c9a0',
          300: '#e5a36a',
          400: '#d98040',
          500: '#5C3B1E',
          600: '#4a2e17',
          700: '#3a2311',
          800: '#2a1a0c',
          900: '#1a1007',
          DEFAULT: '#5C3B1E',
        },
        cream: {
          50:  '#fefcf9',
          100: '#F8F1E7',
          200: '#f0e4d0',
          300: '#e5d0b5',
          DEFAULT: '#F8F1E7',
        },
        amber: {
          tea: '#D98E04',
          light: '#f5b92e',
          dark: '#b87602',
        },
        charcoal: '#1F1F1F',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'tea': '0 4px 24px rgba(92, 59, 30, 0.12)',
        'tea-lg': '0 8px 40px rgba(92, 59, 30, 0.18)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'bottom-nav': '0 -4px 24px rgba(0, 0, 0, 0.08)',
        'primary': '0 4px 16px rgba(217, 142, 4, 0.40)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, rgba(92,59,30,0) 0%, rgba(92,59,30,0.8) 60%, rgba(92,59,30,1) 100%)',
        'card-gradient': 'linear-gradient(135deg, #ffffff 0%, #fdf6f0 100%)',
        'amber-gradient': 'linear-gradient(135deg, #D98E04 0%, #f5b92e 100%)',
        'brown-gradient': 'linear-gradient(135deg, #5C3B1E 0%, #8B5E3C 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
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
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
};
