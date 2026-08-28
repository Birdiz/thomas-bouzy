import type { APIRoute } from 'astro';
import { SITE } from '../site.ts';

/**
 * Generated rather than kept in public/, so the sitemap URL can never disagree
 * with SITE.domain — which varies by deployment target — and so the file can
 * follow SITE.indexable.
 *
 * While the site is on a temporary hostname it is closed to crawlers outright:
 * there are no inbound links to that host, so `Disallow` is enough and does not
 * risk the "indexed, though blocked" state a link would otherwise create. The
 * `X-Robots-Tag` served alongside it (scripts/serve-dist.mjs) and the page-level
 * `<meta name="robots">` cover anything that ignores this file.
 */
const body = SITE.indexable
  ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap-index.xml\n`
  : 'User-agent: *\nDisallow: /\n';

export const GET: APIRoute = () =>
  new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
