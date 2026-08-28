# 7. Serving the site ourselves, on Railway

- Status: accepted; the deploy-target half is amended by [ADR 8](0008-railway-is-the-only-deploy-target.md)
- Date: 2026-08-28
- Supersedes the deploy half of [ADR 1](0001-astro-static-site.md); its build
  decisions stand.

## Context

GitHub Pages was the original target: free, CDN-backed, no process to keep
alive. It is still the better fit on paper for two pages of static HTML.

Two things pushed against it. Pages reads `public/CNAME` and then serves at that
hostname **and nowhere else**, so it cannot go live before a domain is bought —
and serving from `birdiz.github.io/thomas-bouzy/` instead means threading a base
path through every hand-written href, asset URL and locale route. Thomas already
runs his other projects on Railway, and Railway hands out a resolving hostname
immediately.

## Decision

Deploy the container to Railway. The Pages workflow stays, gated on
`SITE.domainConfirmed`, and costs nothing while it is skipped. *(Reversed by
[ADR 8](0008-railway-is-the-only-deploy-target.md): a gate armed by the same
variable that makes the Railway build correct is not a gate.)*

A two-stage Dockerfile builds the site and copies `dist/` plus
`scripts/serve-dist.mjs` into a runtime stage. **The runtime carries no
`node_modules`**: the server uses Node built-ins only, so the final image is the
base plus a few hundred kilobytes, and there is no dependency surface to patch.
The base image is pinned by digest, matching the standard Thomas applied on his
other repositories.

`SITE_DOMAIN` is a **build** argument, not a runtime variable — canonical URLs,
`hreflang`, the sitemap, `robots.txt` and the JSON-LD are all baked into the
output. It reuses the variable name his Caddyfiles already use. `robots.txt` is
generated from it rather than kept in `public/`, so it cannot drift.

## The part that is not free

A CDN was supplying caching, compression and a sane 404 for nothing. A process
supplies whatever we wrote, so we wrote it, and `tests/e2e/serving.spec.ts`
holds it in place:

- **Compression** — brotli then gzip by negotiation, skipped for formats that
  are already packed. The home page goes from 28.4 KB to 7.2 KB.
- **Caching** — `immutable` for a year on `/_astro/` and `/fonts/`, which are
  fingerprinted or versioned; `must-revalidate` on HTML, so a deploy reaches
  everyone.
- **Security headers** — the platform adds none. Notably a
  Content-Security-Policy with `default-src 'none'` whose `script-src` is built
  by hashing every inline script in `dist/` at startup: no `'unsafe-inline'`,
  and a script nobody expected breaks loudly rather than running.
- **A real 404 page**, returned with a 404 status.
- Path traversal refused, and 405 on methods we do not implement.

## Consequences

- The site can go live today, on a hostname that resolves, with no domain
  purchase. Pointing a domain at Railway later changes one variable.
- It costs money to keep a process running, where Pages was free. For a page
  that could be a file on a CDN, that is the price of not waiting.
- The server is ours to maintain — but it is 180 lines of built-ins, exercised
  by the same suite that tests the site, because the e2e run is served by it.
