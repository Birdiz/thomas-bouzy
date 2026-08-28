# 8. Railway is the only deploy target, and staging is not indexable

- Status: accepted
- Date: 2026-08-28
- Amends [ADR 7](0007-serving-the-site-ourselves-on-railway.md), which kept the
  GitHub Pages workflow armed.

## Context

ADR 7 moved the deploy to Railway and deliberately kept the Pages workflow,
gated on `SITE.domainConfirmed` — which was simply `Boolean(process.env.SITE_DOMAIN)`.
That gate reads as caution, but it is armed by the same variable that makes the
Railway build correct. The day `SITE_DOMAIN` is set anywhere the workflow can
see it, `main` publishes the identical site to a second host, and the two
compete for the same queries. A dormant deploy that turns itself on is worse
than no deploy.

The second problem was live rather than hypothetical. The site was serving from
`thomas-bouzy-production.up.railway.app` with `robots.txt` saying `Allow: /`, and
a `canonical`, `hreflang` set and sitemap all naming that hostname. Nothing was
wrong with the markup — it correctly described a site that is not the site
Thomas wants indexed. A temporary hostname that gets indexed becomes a duplicate
of the real domain the moment the real domain exists, and a new site has no
authority to spend on a redirect-and-reindex cycle.

## Decision

**One target.** The Pages deploy job, `upload-pages-artifact`,
`scripts/pages-ready.mjs`, `SITE.domainConfirmed` and `public/CNAME` are removed.
CI keeps every verification step it had; it simply no longer publishes. Railway
builds and serves.

**Indexing is a decision, not a side effect.** A second variable, `SITE_INDEXABLE`,
gates it, and nothing else does:

| | `SITE_INDEXABLE` unset | `SITE_INDEXABLE=true` |
| --- | --- | --- |
| `robots.txt` | `Disallow: /` | `Allow: /` + `Sitemap:` |
| every page | `<meta name="robots" content="noindex, nofollow">` | nothing |
| every response | `X-Robots-Tag: noindex, nofollow` | nothing |

Three layers because they fail differently: `robots.txt` stops the polite
crawler, the header reaches anything that fetches without parsing, and the meta
tag survives the file being cached or ignored.

**A missing domain is a failed build.** `SITE.domain` still falls back to a
placeholder for local development, but the Dockerfile sets `SITE_STRICT=1` and
`scripts/check-assets.mjs` turns an empty `SITE_DOMAIN` into an error there. The
previous behaviour — build succeeds, every canonical URL points at a domain that
does not resolve — is the kind of failure nobody notices for a month.

## Consequences

- Going live is two service variables and a redeploy:
  `SITE_DOMAIN=thomasbouzy.dev`, `SITE_INDEXABLE=true`.
- Until then the site is fully functional and fully shareable by link; it is
  simply not in anyone's index. That is the point.
- Returning to Pages means writing the workflow again. Given that Pages cannot
  serve without a custom domain, and a custom domain is what would make Railway
  correct anyway, that is not a trade worth keeping warm.
