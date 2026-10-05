import type { APIRoute } from 'astro';
import { SITE } from '../site.ts';

/**
 * Generated rather than kept in public/, so the sitemap URL can never disagree
 * with SITE.domain — which varies by deployment target — and so the file can
 * follow SITE.indexable.
 *
 * Crawling is allowed even while the site is not indexable. It used to be
 * closed with `Disallow: /`, on the reasoning that a temporary hostname had no
 * inbound links. The site now lives on its real domain and its links circulate
 * on LinkedIn, and a crawler that may not fetch a page never reads the page's
 * `noindex`: the URL can be indexed anyway, with no content. So crawlers may
 * read everything, and the `<meta name="robots">` and the `X-Robots-Tag`
 * (scripts/serve-dist.mjs) are what keep it out of the index until
 * SITE_INDEXABLE is set. The temporary Railway hostname redirects to the domain
 * instead (serve-dist.mjs), so it serves nothing to index.
 */
const body = SITE.indexable
  ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap-index.xml\n`
  : 'User-agent: *\nAllow: /\n';

export const GET: APIRoute = () =>
  new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
