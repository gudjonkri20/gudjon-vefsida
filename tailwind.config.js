/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
      },
    },
  },
  plugins: [
    function({ addComponents }) {
      // The site is dark throughout, so these render on a dark card.
      addComponents({
        '.prose': {
          color: '#d1d5db',
          '& strong': { color: '#f9fafb' },
          '& h1': {
            fontSize: '2.25rem',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '1rem',
            marginTop: '1.5rem',
          },
          '& h2': {
            fontSize: '1.875rem',
            fontWeight: '600',
            marginBottom: '0.75rem',
            marginTop: '1.5rem',
            paddingBottom: '0.5rem',
            color: '#ffffff',
            borderBottom: '1px solid #374151',
          },
          '& h3': {
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#ffffff',
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
            color: '#60a5fa',
            textDecoration: 'underline',
          },
          '& a:hover': {
            color: '#93c5fd',
          },
          '& blockquote': {
            borderLeft: '4px solid #60a5fa',
            paddingLeft: '1rem',
            fontStyle: 'italic',
            color: '#9ca3af',
            marginBottom: '1rem',
          },
          '& code': {
            backgroundColor: '#374151',
            color: '#e5e7eb',
            padding: '0.2rem 0.4rem',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
          },
          '& pre': {
            backgroundColor: '#111827',
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
            borderColor: '#374151',
          },
        },
      });
    },
  ],
};