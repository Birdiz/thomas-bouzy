# Thomas Bouzy — interactive résumé

Bilingual static résumé site. English at `/`, French at `/fr/`.
Built with Astro, deployed to GitHub Pages.

Implemented from the Claude Design canvas
`Thomas Bouzy - Interactive Résumé.dc.html`. Every deliberate departure from
that design is listed in [docs/design-deltas.md](docs/design-deltas.md), and the
structural decisions are in [docs/adr](docs/adr).

## Still to supply

The site builds and deploys without these; it degrades on purpose rather than
shipping a dead link or an empty circle. `npm run assets:check` lists whatever
is still missing.

| What | Where | Effect while missing |
| --- | --- | --- |
| Portrait photo | `src/assets/portrait.jpg` (or `.png` / `.webp` / `.avif`) — see [src/assets/README.md](src/assets/README.md) | Hero shows a labelled placeholder |
| Domain | `src/site.ts` → `SITE.domain` + `domainConfirmed`, and `public/CNAME` | Canonical URLs, `hreflang` and the sitemap point at the placeholder, **and CI skips the Pages deploy** |

The domain lives in one place: change `SITE.domain`, then `public/CNAME` and
`public/robots.txt` to match. `npm run assets:check` fails if the three disagree.

## Commands

```bash
npm install
npm run dev            # dev server on :4321
npm run verify         # everything CI runs, in the same order
```

| Command | What it does |
| --- | --- |
| `npm run build` | Static output into `dist/` |
| `npm run serve:dist` | Foreground static server for `dist/` (what the e2e suite runs against) |
| `npm run check` | `astro check` — types across `.astro` and `.ts` |
| `npm run lint` / `format` | Biome |
| `npm run test` | Vitest — EN/FR content parity |
| `npm run test:e2e` | Playwright — chromium, webkit, mobile chromium |
| `npm run assets:check` | Missing files and CNAME/domain drift |
| `npm run fonts` / `fonts:check` | Copy the woff2 faces out of `@fontsource` / verify they match |
| `npm run og` | Regenerate `public/og.png` and the touch icon |
| `npm run contrast` | Print WCAG ratios for the Organic palette |

## Layout

```
src/
  site.ts                 domain, contact details, locales — one source of truth
  content/
    types.ts              the content contract; both locales `satisfies` it
    en.ts · fr.ts         all copy
  styles/
    tokens.css            the Organic design system, copied verbatim
    fonts.css             self-hosted @font-face
    app.css               layout, responsiveness, reduced motion, AA corrections
  components/             one per section, plus RevealPhone
  layouts/                BaseLayout (<head>, JSON-LD) · ResumePage (composition)
  pages/index.astro       EN
  pages/fr/index.astro    FR
scripts/                  fonts · og image · asset checks · contrast · static server
tests/
  content.spec.ts         EN/FR parity (vitest)
  e2e/                    behaviour · accessibility · links · performance budget
```

## What the tests hold in place

- **Content** — both locales have the same shape and the same array lengths at
  every depth; nothing is blank; the prose is genuinely translated.
- **Behaviour** — one project open at a time, the earlier-experience disclosure,
  the language switch changing the URL, anchors clearing the sticky header.
- **Privacy** — the phone number is in neither page's HTML source nor the
  JSON-LD, and appears only after a click.
- **Accessibility** — axe at WCAG 2.1 AA, on both locales, with every disclosure
  open, on desktop and mobile viewports; one `h1` and no skipped heading levels.
- **Integrity** — every link and asset the page references resolves; no request
  leaves the origin.
- **Budget** — document, CSS, JS, font bytes and request count, with the
  numbers in [ADR 6](docs/adr/0006-budget-tests-instead-of-lighthouse-ci.md).

## Deployment

`.github/workflows/ci.yml` verifies every push and pull request. On `main`, a
green run uploads `dist/` and deploys it to GitHub Pages — **but only once
`SITE.domainConfirmed` is true**. `public/CNAME` makes Pages serve the site at
that hostname and nowhere else, so deploying against a placeholder produces a
site reachable from no address at all. Until then CI verifies and stops.

Repository settings need **Pages → Build and deployment → Source: GitHub
Actions**, and the custom domain pointed at GitHub Pages by DNS.
