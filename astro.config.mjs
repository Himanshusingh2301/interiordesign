// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Production URL — drives sitemap, canonical fallbacks, and absolute OG image URLs.
  // When you add a custom domain on Vercel, update this to match your primary domain.
  site: 'https://atlantaleakdetection.vercel.app',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],

  devToolbar: {
    enabled: false,
  },
});
