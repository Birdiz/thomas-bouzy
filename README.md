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
| Domain | `SITE_DOMAIN` at build time (Railway), or `SITE.domain` + `public/CNAME` (Pages) | Canonical URLs, `hreflang`, the sitemap and `robots.txt` point at the placeholder, and the Pages deploy is skipped |

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
| `docker build --build-arg SITE_DOMAIN=… -t cv .` | Build the deployment image locally |
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

### Railway (current target)

Railway builds the `Dockerfile` and runs `scripts/serve-dist.mjs`. Two stages:
the site is built, then `dist/` and the server are copied into a runtime that
carries **no `node_modules`** — the server uses Node built-ins only.

Set one service variable:

```
SITE_DOMAIN=your-service.up.railway.app
```

It is a **build** argument: canonical URLs, `hreflang`, the sitemap, `robots.txt`
and the JSON-LD are baked into the output, so changing it needs a rebuild, not a
restart. Point a real domain at the service later and change this one value.

Because a process replaces a CDN, the server does what the CDN was doing —
brotli/gzip, immutable caching on fingerprinted assets, a hash-based CSP,
security headers, a real 404. All of it is asserted in
[tests/e2e/serving.spec.ts](tests/e2e/serving.spec.ts), and the e2e suite runs
against that same server, so what is tested is what ships. See
[ADR 7](docs/adr/0007-serving-the-site-ourselves-on-railway.md).

### GitHub Pages (kept, dormant)

`.github/workflows/ci.yml` verifies every push and pull request. On `main` it
also deploys to Pages — but only once `SITE.domainConfirmed` is true.
`public/CNAME` makes Pages serve at that hostname and nowhere else, so deploying
against a placeholder produces a site reachable from no address at all.

Repository settings need **Pages → Build and deployment → Source: GitHub
Actions**, and the custom domain pointed at GitHub Pages by DNS.
