# Thomas Bouzy — interactive résumé

Bilingual static résumé site. English at `/`, French at `/fr/`.
Built with Astro, containerised, deployed to Railway.

Two sources, two scopes. The **design** comes from the Claude Design canvas
`Thomas Bouzy - Interactive Résumé.dc.html`; the **copy** comes from
`Pitch_Master_Thomas_Bouzy_{EN,FR}.md`, and wins wherever the two disagree on
words — [ADR 9](docs/adr/0009-the-pitch-master-owns-the-copy.md).

Every deliberate departure from the design is listed in
[docs/design-deltas.md](docs/design-deltas.md); the structural decisions are in
[docs/adr](docs/adr).

New material therefore reaches the site by revising the pitch master first, then
rebasing `src/content/{en,fr}.ts` on it. `npm run test` fails if that rebase
breaks EN/FR parity, compresses the stack's three honesty levels, drops the
blockchain scope boundary, or advertises a date already past.

## Still to supply

The site builds and deploys without these; it degrades on purpose rather than
shipping a dead link or an empty circle. `npm run assets:check` lists whatever
is still missing.

| What | Where | Effect while missing |
| --- | --- | --- |
| A portrait of at least 580×580 | `src/assets/portrait.png` (`.jpg` / `.webp` / `.avif` also work) — see [src/assets/README.md](src/assets/README.md) | Absent: the hero shows a labelled placeholder. Too small: the largest variant is upscaled, and `assets:check` says so |
| Domain | `SITE_DOMAIN`, a Railway service variable | A deployment build **fails** rather than canonicalising the site to a domain that does not resolve |
| Indexing | `SITE_INDEXABLE=true`, once `SITE_DOMAIN` is the real domain | `robots.txt` disallows everything, pages carry `noindex`, and every response carries `X-Robots-Tag` |

## Going live on a real domain

The site currently runs on the hostname Railway hands out, and is deliberately
**not indexable** — see [ADR 8](docs/adr/0008-railway-is-the-only-deploy-target.md)
for why a temporary hostname in Google's index is a debt rather than a head start.

Buying the domain and pointing it at the service is the whole migration. After
that, two service variables and a redeploy:

```
SITE_DOMAIN=thomasbouzy.dev
SITE_INDEXABLE=true
```

Both are read at **build** time (canonical URLs, `hreflang`, the sitemap,
`robots.txt` and the JSON-LD are baked into the output), so changing them needs a
rebuild, not a restart. `SITE_INDEXABLE` is read at runtime too, for the
`X-Robots-Tag` header.

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
| `npm run assets:check` | Missing files, portrait format and size, `SITE_DOMAIN` on a deployment build |
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
- **Copy invariants** — the pitch master's own rules, asserted rather than
  trusted: EN/FR parity at every array depth, the three honesty levels on the
  stack kept apart, the "no smart contract authoring" boundary present on the
  on-chain card, no availability date already past, and the phone number absent
  from every content string.

## Deployment

Railway builds the `Dockerfile` and runs `scripts/serve-dist.mjs`. Two stages:
the site is built, then `dist/` and the server are copied into a runtime that
carries **no `node_modules`** — the server uses Node built-ins only.

The service variables are `SITE_DOMAIN` and `SITE_INDEXABLE` — see
[Going live on a real domain](#going-live-on-a-real-domain) above.

Because a process replaces a CDN, the server does what the CDN was doing —
brotli/gzip, conditional requests answered with a 304, immutable caching on
fingerprinted assets, one canonical URL per page with a 301 for every other
spelling, a hash-based CSP with no `'unsafe-inline'` at all, security headers, a
real 404, and a 400 rather than a crash on a malformed URL. All of it is asserted in
[tests/e2e/serving.spec.ts](tests/e2e/serving.spec.ts), and the e2e suite runs
against that same server, so what is tested is what ships. See
[ADR 7](docs/adr/0007-serving-the-site-ourselves-on-railway.md).

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) verifies every push and
pull request — fonts, lint, types, assets, content parity, build, then the full
Playwright suite — and publishes nothing. Railway builds from the repository.
