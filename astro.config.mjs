// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { SITE } from './src/site.ts';

// Stamped once per build. Every page in a two-page résumé changes together, so
// a single build date is honest — and a <lastmod> is the cheapest crawl signal
// there is.
const buildDate = new Date();

// https://astro.build/config
export default defineConfig({
  site: SITE.origin,
  // Custom domain -> the site is served from the root.
  base: '/',
  // The server 301s `/fr` to `/fr/` (scripts/serve-dist.mjs); the config says
  // the same thing, so hrefs, the canonical link and what is actually served
  // cannot drift. 'ignore' let five spellings of one page answer 200.
  trailingSlash: 'always',
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
      serialize: (item) => ({ ...item, lastmod: buildDate }),
    }),
  ],
  image: {
    responsiveStyles: true,
  },
  prefetch: false,
});
