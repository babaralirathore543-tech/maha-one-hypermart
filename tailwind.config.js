/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F766E',
        darkGreen: '#065F46',
        gold: '#D4AF37',
        cream: '#FFFDF7',
        lightGray: '#F8FAFC',
        text: '#111827',
        border: '#E5E7EB',
        secondaryText: '#6B7280',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'scroll-categories': 'scrollCategories 20s linear infinite',
        'scroll-brands': 'scrollBrands 25s linear infinite',
        'slide': 'slide 12s infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.4)' },
        },
        scrollCategories: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scrollBrands: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        slide: {
          '0%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(0)' },
          '33%': { transform: 'translateX(-100%)' },
          '53%': { transform: 'translateX(-100%)' },
          '66%': { transform: 'translateX(-200%)' },
          '86%': { transform: 'translateX(-200%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}