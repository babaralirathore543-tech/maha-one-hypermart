/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ============================================================
        // ✅ PURANE NAMES (baaki pages in par depend karte hain)
        // ============================================================
        primary: '#0F766E',
        darkGreen: '#065F46',
        gold: '#D4AF37',
        cream: '#FFFDF7',
        lightGray: '#F8FAFC',
        text: '#111827',
        border: '#E5E7EB',
        secondaryText: '#6B7280',

        // ============================================================
        // ✅ PURPLE THEME (landing page ke liye)
        // NOTE: `purple` Tailwind ka default hai — extend kar rahe hain
        // ============================================================
        purple: {
          DEFAULT: '#A855F7',
          dark:    '#7E22CE',
          deep:    '#581C87',
          light:   '#C084FC',
          50:      '#FAF5FF',
          100:     '#F3E8FF',
          200:     '#E9D5FF',
          300:     '#D8B4FE',
          400:     '#C084FC',
          500:     '#A855F7',
          600:     '#9333EA',
          700:     '#7E22CE',
          800:     '#6B21A8',
          900:     '#581C87',
        },

        // ✅ Dark backgrounds for purple theme
        night: {
          DEFAULT: '#0D0415',
          light:   '#150A24',
          card:    '#1A0B2E',
          soft:    '#241238',
          border:  '#3B1E54',
        },

        // ============================================================
        // ✅ NAYE SEMANTIC NAMES (agar future mein chahiye)
        // ============================================================
        brand: {
          DEFAULT: '#0F766E',
          dark:    '#065F46',
          light:   '#14B8A6',
          50:      '#F0FDFA',
          100:     '#CCFBF1',
          200:     '#99F6E4',
          300:     '#5EEAD4',
          400:     '#2DD4BF',
          500:     '#14B8A6',
          600:     '#0D9488',
          700:     '#0F766E',
          800:     '#115E59',
          900:     '#134E4A',
        },

        accent: {
          DEFAULT: '#D4AF37',
          dark:    '#B8941F',
          light:   '#F4D77A',
          50:      '#FEFCE8',
          100:     '#FEF9C3',
          200:     '#FEF08A',
          300:     '#FDE047',
          400:     '#FACC15',
          500:     '#D4AF37',
          600:     '#B8941F',
          700:     '#A16207',
        },

        surface: {
          DEFAULT: '#FFFDF7',
          soft:    '#F8FAFC',
          dark:    '#111827',
        },

        ink: {
          DEFAULT: '#111827',
          soft:    '#374151',
          muted:   '#6B7280',
          faint:   '#9CA3AF',
        },
      },

      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },

      boxShadow: {
        // Purane
        'brand':  '0 10px 30px -10px rgba(15, 118, 110, 0.3)',
        'accent': '0 10px 30px -10px rgba(212, 175, 55, 0.4)',
        'soft':   '0 2px 8px -2px rgba(0, 0, 0, 0.06)',
        'medium': '0 8px 24px -8px rgba(0, 0, 0, 0.08)',

        // ✅ Naye purple theme ke liye
        'purple':    '0 10px 40px -10px rgba(168, 85, 247, 0.5)',
        'purple-sm': '0 4px 20px -5px rgba(168, 85, 247, 0.3)',
        'gold':      '0 10px 30px -10px rgba(212, 175, 55, 0.4)',
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