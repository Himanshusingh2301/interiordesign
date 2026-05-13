// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: replace with your real production domain before deploying.
  // Required for sitemap generation, canonical URLs, and absolute OG image URLs.
  site: 'https://example.com',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],

  devToolbar: {
    enabled: false,
  },
});
