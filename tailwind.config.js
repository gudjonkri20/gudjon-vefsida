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
      addComponents({
        '.prose': {
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
            color: '#3b82f6',
            textDecoration: 'underline',
          },
          '& a:hover': {
            color: '#2563eb',
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
            backgroundColor: '#1f2937',
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