/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'warm-white': '#FAF7F2',
        burgundy: {
          DEFAULT: '#8B1A1A',
          hover: '#6B1414',
        },
        gold: {
          DEFAULT: '#B8860B',
          light: '#ffd86e',
          start: '#d19e1d',
          end: '#e3a812',
        },
        'warm-light': '#F5F1EB',
        'warm-dark': '#2C2420',
        stone: '#7A6F64',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        subtitle: ['"Cormorant Infant"', 'serif'],
        body: ['"Libre Baskerville"', 'serif'],
        ui: ['"Lato"', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(38px, 5.5vw, 68px)', { lineHeight: '1.05', letterSpacing: '0.04em', fontWeight: '200' }],
        'section': ['clamp(28px, 3.5vw, 44px)', { lineHeight: '1.15', letterSpacing: '0.03em', fontWeight: '300' }],
        'subtitle': ['clamp(17px, 1.8vw, 22px)', { lineHeight: '1.4', fontWeight: '300' }],
        'body-lg': ['17px', { lineHeight: '1.8', fontWeight: '300' }],
        'body': ['16px', { lineHeight: '1.7', fontWeight: '400' }],
        'label': ['14px', { lineHeight: '1.4', letterSpacing: '0.12em', fontWeight: '300' }],
        'label-sm': ['13px', { lineHeight: '1.4', letterSpacing: '0.18em', fontWeight: '300' }],
      },
      letterSpacing: {
        display: '0.04em',
        wide: '0.12em',
        wider: '0.18em',
      },
      backgroundImage: {
        'gold-gradient-h': 'linear-gradient(90deg, #d19e1d 0%, #ffd86e 50%, #e3a812 100%)',
        'gold-gradient-v': 'linear-gradient(180deg, #d19e1d 0%, #ffd86e 50%, #e3a812 100%)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
};
