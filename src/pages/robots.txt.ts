import type { APIRoute } from 'astro';
import { SITE } from '../site.ts';

/**
 * Generated rather than kept in public/, so the sitemap URL can never disagree
 * with SITE.domain — which now varies by deployment target.
 */
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap-index.xml\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
