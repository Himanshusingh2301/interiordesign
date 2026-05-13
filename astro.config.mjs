// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { siteConfig } from './src/site.config.ts';

// All site identity (URL, business name, brand color tints, etc.) lives in
// src/site.config.ts. Editing that file is the single per-site change.
export default defineConfig({
  site: siteConfig.url,

  vite: {
    plugins: [tailwindcss()],
  },

  devToolbar: {
    enabled: false,
  },
});
