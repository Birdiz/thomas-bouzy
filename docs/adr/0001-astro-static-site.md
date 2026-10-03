# 1. Astro, built to static files

- Status: accepted; readers revised in the postscript, 2026-10-03
- Date: 2026-08-28

## Context

The source of this site is a Claude Design canvas file, `Thomas Bouzy -
Interactive Résumé.dc.html`. That file is not deliverable code: it is a template
for the canvas runtime (`<x-dc>`, `DCLogic`, `<sc-for>`, `<sc-if>`, `{{ }}`
bindings). It describes a visual intention and a content structure, and nothing
about responsiveness, indexing, accessibility or hosting.

The page is a résumé. Its content changes a few times a year, it has no
authenticated area, no database and no forms. Its readers are recruiters and
engineers arriving from a search engine or a LinkedIn link.

## Decision

Build it with Astro, output static HTML, deploy to GitHub Pages behind a custom
domain.

Alternatives weighed:

- **Hand-written HTML/CSS/JS, no build.** Matches the design system's own
  philosophy. Rejected because two locales mean either duplicated markup that
  drifts, or client-side rendering that costs the SEO the site exists for.
- **Next.js.** Brings a React runtime and hydration to a page with one
  interactive control. The weight buys nothing here.
- **Symfony + Twig.** On-brand for the author, and the most tempting. Rejected
  because it requires a PHP host and a running process to serve a page that
  never changes, and a CV site should not have an uptime story.

## Consequences

- Zero JavaScript framework ships. The page's only script is 364 bytes, inline.
- Content is authored in TypeScript and type-checked (see ADR 4).
- Deployment is a file copy; there is nothing to keep running.
- Astro's own release cadence is the main maintenance cost. `npm audit` is clean
  at the pinned versions and the CI build would catch a break.

## Postscript, 2026-10-03 — the readers changed, the build did not

The context above names this site's readers as "recruiters and engineers arriving
from a search engine or a LinkedIn link". Half of that is gone. The site sells
engagements now, and its readers are Clients in three Segments
([ADR 14](0014-three-segments-and-the-least-technical-reader.md)), the least
technical of whom runs a manufacturing SME. Recruiters get one line, pointing to
LinkedIn.

The arrival path stands: LinkedIn and links first, search later
([ADR 16](0016-the-legal-notice-and-a-number-meant-to-be-public.md) keeps the site
out of the index until there is a business to publish it). So does the decision.
A site that grows from one page to one per Offer
([ADR 17](0017-offer-pages-public-prices-and-the-estimator.md)) is still static
content that changes a few times a year, and still has no reason to have an
uptime story.
