// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { alternatesOf, routeAt } from './src/routes.ts';
import { LOCALE_TAG, SITE } from './src/site.ts';

// Stamped once per build. The pages change together, because they are one
// build of one content contract, so a single build date is honest — and a
// <lastmod> is the cheapest crawl signal there is.
const buildDate = new Date();

/** The registry route behind a sitemap URL. */
const routeOf = (url) => routeAt(new URL(url).pathname);

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
    // The pages and their alternates come from src/routes.ts, not from URL
    // prefixes: the sitemap's own i18n mode pairs pages by path, and cannot
    // pair a page with a translation that lives at another slug, or know that
    // a page exists in one locale only.
    sitemap({
      filter: (url) => routeOf(url) !== undefined,
      serialize: (item) => {
        const route = routeOf(item.url);
        const links = route
          ? alternatesOf(route.page).map((alternate) => ({
              url: new URL(alternate.path, SITE.origin).href,
              lang: LOCALE_TAG[alternate.locale],
            }))
          : [];
        return { ...item, links, lastmod: buildDate };
      },
    }),
  ],
  image: {
    responsiveStyles: true,
  },
  prefetch: false,
});
