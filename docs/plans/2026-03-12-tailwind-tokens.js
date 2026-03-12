// Laitse Loss — Design Tokens for Tailwind CSS
// Reference: docs/plans/2026-03-12-brand-guidelines.md
// To be used in tailwind.config.mjs when Astro project is initialized

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        // Primary
        'warm-white': '#FAF7F2',
        burgundy: {
          DEFAULT: '#8B1A1A',
          hover: '#6B1414',
        },

        // Secondary
        gold: {
          DEFAULT: '#B8860B',
          light: '#ffd86e',
          start: '#d19e1d',
          end: '#e3a812',
        },
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
        // Display / Hero
        'hero': ['clamp(38px, 5.5vw, 68px)', { lineHeight: '1.05', letterSpacing: '0.04em', fontWeight: '200' }],
        // Section headings
        'section': ['clamp(28px, 3.5vw, 44px)', { lineHeight: '1.15', letterSpacing: '0.03em', fontWeight: '300' }],
        // Subtitle italic
        'subtitle': ['clamp(17px, 1.8vw, 22px)', { lineHeight: '1.4', fontWeight: '300' }],
        // Body
        'body-lg': ['17px', { lineHeight: '1.8', fontWeight: '300' }],
        // Small labels / UI
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
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
      },
    },
  },
}
