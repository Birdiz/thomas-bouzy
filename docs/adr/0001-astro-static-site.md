# 1. Astro, built to static files

- Status: accepted
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
