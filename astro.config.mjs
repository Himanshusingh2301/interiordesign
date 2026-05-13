// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Production URL — drives canonical fallbacks and absolute OG image URLs.
  // When you add a custom domain on Vercel, update this and public/sitemap.xml + robots.txt.
  site: 'https://atlantaleakdetection.vercel.app',

  vite: {
    plugins: [tailwindcss()],
  },

  devToolbar: {
    enabled: false,
  },
});
