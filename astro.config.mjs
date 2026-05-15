// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { resolveSiteUrl } from './src/lib/site-url';

// `PUBLIC_SITE_URL` on Vercel / `.env` overrides; see `src/lib/site-url.ts`.
export default defineConfig({
  site: resolveSiteUrl(),

  vite: {
    plugins: [tailwindcss()],
  },

  devToolbar: {
    enabled: false,
  },
});
