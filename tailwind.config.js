/** @type {import('tailwindcss').Config} */

// Palette: North Atlantic navy, cool paper, warm brass.
// Navy carries authority, paper carries the reading, brass marks the one
// thing worth looking at. Nothing else gets a colour.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1F38',
          950: '#081729',
          900: '#0B1F38',
          800: '#122E4F',
          700: '#1B4270',
          600: '#2A5D97',
          500: '#3B77B8',
          200: '#C3D2E4',
          100: '#DEE7F1',
          50: '#EFF4F9',
        },
        paper: {
          DEFAULT: '#F4F6F9',
          raised: '#FFFFFF',
          sunken: '#E8EDF4',
        },
        brass: {
          DEFAULT: '#B98A3C',
          400: '#CCA35C',
          500: '#B98A3C',
          600: '#A0742C',
          700: '#8A6524',
        },
        // Body copy on paper. Navy-tinted rather than neutral grey so the
        // whole page sits in one temperature.
        muted: '#4C6076',
      },
      fontFamily: {
        // Display + UI chrome: a Nordic grotesque with actual character.
        display: ['"Familjen Grotesk Variable"', 'Familjen Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Familjen Grotesk Variable"', 'Familjen Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Long-form reading: a serif, because this is a body of work, not a dashboard.
        serif: ['"Source Serif 4 Variable"', '"Source Serif 4"', 'Georgia', 'serif'],
        // Eyebrows, tech tags, counts — anything that is data rather than prose.
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        eyebrow: '0.18em',
      },
      maxWidth: {
        prose: '68ch',
      },
      keyframes: {
        'rise': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // The hero waveform draws itself once, left to right.
        'trace': {
          '0%': { strokeDashoffset: '1' },
          '100%': { strokeDashoffset: '0' },
        },
        // The chat waveform breathing while a reply is being written.
        // Amplitude only: the mark keeps its shape, it just gets louder.
        'speak': {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        rise: 'rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        fade: 'fade 0.6s ease-out both',
        trace: 'trace 1.6s cubic-bezier(0.4, 0, 0.2, 1) both',
        speak: 'speak 0.9s ease-in-out infinite',
      },
      boxShadow: {
        // Navy-tinted, not black — a black shadow on paper reads as dirt.
        card: '0 1px 2px rgba(11, 31, 56, 0.06), 0 8px 24px -12px rgba(11, 31, 56, 0.12)',
        'card-hover': '0 1px 2px rgba(11, 31, 56, 0.08), 0 18px 40px -16px rgba(11, 31, 56, 0.22)',
      },
    },
  },
  plugins: [
    function ({ addComponents, theme }) {
      addComponents({
        '.prose': {
          color: theme('colors.muted'),
          fontFamily: theme('fontFamily.serif'),
          fontSize: '1.0625rem',
          lineHeight: '1.75',
          '& h2': {
            fontFamily: theme('fontFamily.display'),
            color: theme('colors.navy.900'),
            fontSize: '1.5rem',
            fontWeight: '600',
            letterSpacing: '-0.01em',
            marginTop: '2.5rem',
            marginBottom: '0.75rem',
          },
          '& h3': {
            fontFamily: theme('fontFamily.display'),
            color: theme('colors.navy.900'),
            fontSize: '1.1875rem',
            fontWeight: '600',
            marginTop: '1.75rem',
            marginBottom: '0.5rem',
          },
          '& p': { marginBottom: '1.125rem' },
          '& strong': { color: theme('colors.navy.900'), fontWeight: '600' },
          '& ul': { listStyleType: 'none', paddingLeft: '0', marginBottom: '1.125rem' },
          '& ul > li': {
            position: 'relative',
            paddingLeft: '1.25rem',
            marginBottom: '0.5rem',
          },
          // Brass tick instead of a bullet — the accent doing structural work.
          '& ul > li::before': {
            content: '""',
            position: 'absolute',
            left: '0',
            top: '0.7em',
            width: '0.5rem',
            height: '1px',
            backgroundColor: theme('colors.brass.500'),
          },
          '& ol': { paddingLeft: '1.25rem', marginBottom: '1.125rem' },
          '& li': { marginBottom: '0.5rem' },
          '& a': {
            color: theme('colors.brass.700'),
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            textDecorationThickness: '1px',
          },
          '& a:hover': { color: theme('colors.navy.900') },
          '& blockquote': {
            borderLeft: `2px solid ${theme('colors.brass.500')}`,
            paddingLeft: '1rem',
            fontStyle: 'italic',
            color: theme('colors.navy.800'),
            marginBottom: '1.125rem',
          },
          '& code': {
            fontFamily: theme('fontFamily.mono'),
            backgroundColor: theme('colors.paper.sunken'),
            color: theme('colors.navy.900'),
            padding: '0.15rem 0.35rem',
            borderRadius: '0.25rem',
            fontSize: '0.85em',
          },
          '& pre': {
            backgroundColor: theme('colors.navy.900'),
            color: theme('colors.paper.DEFAULT'),
            padding: '1rem',
            borderRadius: '0.5rem',
            overflow: 'auto',
            marginBottom: '1.125rem',
          },
          '& pre code': { backgroundColor: 'transparent', padding: '0', color: 'inherit' },
          '& hr': {
            marginTop: '2rem',
            marginBottom: '2rem',
            borderColor: theme('colors.navy.100'),
          },
        },
      });
    },
  ],
};
