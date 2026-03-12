import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://laitseloss.ee',
  integrations: [
    tailwind(),
    sitemap({
      // Exclude any pages that shouldn't be indexed
      // All current pages are public-facing, so no exclusions needed
    }),
  ],
});
