// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { SITE } from './src/site.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE.origin,
  // Custom domain -> the site is served from the root.
  base: '/',
  trailingSlash: 'ignore',
  build: {
    // One CSS file instead of per-page chunks: the whole site is two pages.
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', fr: 'fr' },
      },
    }),
  ],
  image: {
    responsiveStyles: true,
  },
  prefetch: false,
});
