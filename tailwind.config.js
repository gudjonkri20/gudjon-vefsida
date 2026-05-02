/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#22d3ee',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        accent: {
          DEFAULT: '#a78bfa',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-up': 'fade-up 0.6s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'gradient-shift': 'gradient-shift 12s ease infinite',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.15) 1px, transparent 0)',
        'brand-glow':
          'radial-gradient(60% 60% at 50% 0%, rgba(34,211,238,0.18) 0%, rgba(15,23,42,0) 70%)',
      },
      boxShadow: {
        glow: '0 0 30px 5px rgba(34, 211, 238, 0.25)',
        'glow-violet': '0 0 30px 5px rgba(167, 139, 250, 0.25)',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.prose': {
          color: '#1f2937',
          '& h1': {
            fontSize: '2.25rem',
            fontWeight: '700',
            marginBottom: '1rem',
            marginTop: '1.5rem',
          },
          '& h2': {
            fontSize: '1.875rem',
            fontWeight: '600',
            marginBottom: '0.75rem',
            marginTop: '1.5rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid #e5e7eb',
          },
          '& h3': {
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '0.75rem',
            marginTop: '1.25rem',
          },
          '& p': {
            marginBottom: '1rem',
            lineHeight: '1.625',
          },
          '& ul': {
            listStyleType: 'disc',
            paddingLeft: '1.5rem',
            marginBottom: '1rem',
          },
          '& ol': {
            listStyleType: 'decimal',
            paddingLeft: '1.5rem',
            marginBottom: '1rem',
          },
          '& li': {
            marginBottom: '0.5rem',
          },
          '& a': {
            color: '#0891b2',
            textDecoration: 'underline',
          },
          '& a:hover': {
            color: '#155e75',
          },
          '& blockquote': {
            borderLeft: '4px solid #e5e7eb',
            paddingLeft: '1rem',
            fontStyle: 'italic',
            marginBottom: '1rem',
          },
          '& code': {
            backgroundColor: '#f3f4f6',
            padding: '0.2rem 0.4rem',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
          },
          '& pre': {
            backgroundColor: '#0f172a',
            color: '#f9fafb',
            padding: '1rem',
            borderRadius: '0.375rem',
            overflow: 'auto',
            marginBottom: '1rem',
          },
          '& pre code': {
            backgroundColor: 'transparent',
            padding: '0',
            fontSize: '0.875rem',
          },
          '& hr': {
            marginTop: '1.5rem',
            marginBottom: '1.5rem',
            borderColor: '#e5e7eb',
          },
        },
      });
    },
  ],
};
