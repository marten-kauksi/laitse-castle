import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://laitsecastle.ee',
  redirects: {
    '/en/events-and-seminars': '/en/events',
    // Summer terrace café menu pages were removed; keep old indexed URLs alive.
    '/menuu': '/',
    '/en/menu': '/en/',
  },
  i18n: {
    defaultLocale: 'et',
    locales: ['et', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    tailwind(),
    sitemap({
      // Guest check-in and its privacy notice are private utility pages, not
      // site content — the accommodation activity is deliberately not advertised
      // publicly. Matches sub-paths too, so /registreerimine/privaatsus and
      // /en/check-in/privacy are excluded as well.
      // (Security comes from RLS, not from being unlisted — see the design doc.)
      filter: (page) => !/\/(registreerimine|check-in)(\/|$)/.test(page),
    }),
  ],
});
