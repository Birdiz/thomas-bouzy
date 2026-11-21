# Thomas Bouzy — freelance site

Static showcase site that sells seven Offers to three Segments
([ADR 14](docs/adr/0014-three-segments-and-the-least-technical-reader.md)): a
home page, one page per Offer with public prices and an estimator, and a page
for Partners ([ADR 17](docs/adr/0017-offer-pages-public-prices-and-the-estimator.md)).
French at `/`, English under `/en/` where it sells
([ADR 15](docs/adr/0015-french-at-the-root-english-where-it-sells.md)).
Every page and the locales it exists in are listed once, in `src/routes.ts`.
Every price is in one table, `src/content/prices.ts`; prose names a price and
never types it, and each page's prose has a word ceiling
([ADR 18](docs/adr/0018-one-day-rate-and-half-the-words.md)).
Built with Astro, containerised, deployed to Railway. The vocabulary is in
[CONTEXT.md](CONTEXT.md).

The home page reads job title, promise and proof → the AI Workshops, the way in →
problem → invitation to the Audit → offer → proof → contact, with the person
beside the call — which is the opposite of a CV, and deliberate:
[ADR 10](docs/adr/0010-the-site-owns-its-own-design.md) has the measurements
behind the running order,
[ADR 27](docs/adr/0027-software-engineer-and-the-workshops-as-the-way-in.md)
put the job title back and the Workshops first, and
[ADR 28](docs/adr/0028-proof-on-the-first-screen-and-the-workshops-format.md)
moved the proof under the hero's buttons. The Offers are grouped by the
reader's situation, not laid out as the life of an application
([ADR 30](docs/adr/0030-offers-by-situation-and-the-whole-budget.md)). The Workshops are French only, are
never called a *formation*, and publish their format but never a date or a
price. The palette is the LinkedIn cover's — dark slate, one
terracotta, a ridge —
[ADR 13](docs/adr/0013-the-site-wears-the-linkedin-cover.md); the type is one
family, Figtree
([ADR 21](docs/adr/0021-one-family.md)).

The site owns its own design. It began as an implementation of a Claude Design
canvas, and the record of where it departed from it is in
[docs/design-deltas.md](docs/design-deltas.md); the canvas no longer leads.
Career facts still come from `Pitch_Master_Thomas_Bouzy_{EN,FR}.md` and the two
reference CVs — [ADR 9](docs/adr/0009-the-pitch-master-owns-the-copy.md).

Structural decisions are in [docs/adr](docs/adr).

New material therefore reaches the site by revising the pitch master first, then
rebasing `src/content/{en,fr}.ts` on it. `npm run test` fails if that rebase
breaks EN/FR parity, compresses the stack's three honesty levels, drops the
blockchain scope boundary, puts a date back in the availability line, or lets
the structured data claim a technology the page never states.

The page is not a CV, and the tests keep it from becoming one again: there is no
chronology, no years badge, no stack chips and no CV download. The one job
title, « Ingénieur logiciel », is there because a business owner met in person
must find it (ADR 27), and the years are said once, in a sentence (ADR 28). The
career is on LinkedIn: the home page's About block and the About page each
point to it once, and no line asks the reader whether they are hiring;
elsewhere LinkedIn is only a way to get in touch, beside the email. A Partner
gets a CV on request. See [ADR 11](docs/adr/0011-the-page-is-not-a-cv.md) and its
postscript, as amended by ADR 28.

It also speaks in the reader's words rather than in its own: the five Client
sentences it opens on are a fixed list under a question, each linking to the
Offer that treats it, and the hero, every Offer and every Achievement lead with
a plain line that names no technology. All of it is asserted —
[ADR 12](docs/adr/0012-the-clients-sentence-first.md),
[ADR 14](docs/adr/0014-three-segments-and-the-least-technical-reader.md).

Every price comes from one typed table, `src/content/prices.ts`: the static
table on each Offer page, the estimator that turns it into sliders, the whole
budget it adds up under them (ADR 30), the "from" on the home page's cards, the
published day rate and the JSON-LD's `Service.offers` all read it, so changing a
price is one edit
(`tests/structured-data.spec.ts` holds the JSON-LD to the table). The amounts
are provisional, like the copy.

## Still to supply

The site builds and deploys without these; it degrades on purpose rather than
shipping a dead link or an empty circle. `npm run assets:check` lists whatever
is still missing.

| What | Where | Effect while missing |
| --- | --- | --- |
| A portrait of at least 580×580 | `src/assets/portrait.png` (`.jpg` / `.webp` / `.avif` also work) — see [src/assets/README.md](src/assets/README.md) | Absent: the hero shows a labelled placeholder. Too small: the largest variant is upscaled, and `assets:check` says so |
| Domain | `SITE_DOMAIN`, a Railway service variable | A deployment build **fails** rather than canonicalising the site to a domain that does not resolve |
| Indexing | `SITE_INDEXABLE=true`, once `SITE_DOMAIN` is the real domain **and** `LEGAL` in `src/site.ts` is complete | `robots.txt` lets crawlers in so they can read the `noindex` every page carries, and every response carries `X-Robots-Tag`. Railway's `*.up.railway.app` hostname redirects to `SITE_DOMAIN` ([ADR 18](docs/adr/0018-one-day-rate-and-half-the-words.md)). Setting it while `LEGAL` is incomplete **fails** the build ([ADR 16](docs/adr/0016-the-legal-notice-and-a-number-meant-to-be-public.md)) |

## Going live on a real domain

The site currently runs on the hostname Railway hands out, and is deliberately
**not indexable** — see [ADR 8](docs/adr/0008-railway-is-the-only-deploy-target.md)
for why a temporary hostname in Google's index is a debt rather than a head start.

Buying the domain and pointing it at the service is the whole technical
migration; the other prerequisite is a registered business, because the build
refuses `SITE_INDEXABLE=true` until the legal notice in `LEGAL` is complete
([ADR 16](docs/adr/0016-the-legal-notice-and-a-number-meant-to-be-public.md)).
After that, two service variables and a redeploy:

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
| `npm run test` | Vitest — EN/FR content parity on bilingual pages, and the asset check's verdict |
| `npm run test:e2e` | Playwright — chromium, webkit, mobile chromium |
| `npm run assets:check` | Missing files, a missing or stale Open Graph card, portrait format and size, `SITE_DOMAIN` on a deployment build, no indexing without a legal notice |
| `npm run fonts` / `fonts:check` | Copy the woff2 faces out of `@fontsource` / verify they match |
| `npm run og` | Redraw each route's Open Graph card into `public/og/`, and the touch icon |
| `npm run lastmod` | After a build, date today every page whose text changed, for the sitemap's `<lastmod>` (`scripts/lastmod.json`) |
| `docker build --build-arg SITE_DOMAIN=… -t cv .` | Build the deployment image locally |
| `npm run contrast` | Print WCAG ratios for the site palette (ADR 13) |

## Layout

```
src/
  site.ts                 domain, contact details, locales — one source of truth
  routes.ts               the page registry: every page, and the locales it exists in
  content/
    types.ts              the content contract; both locales `satisfies` it
    en.ts · fr.ts         all copy
    offers.ts             the Offers' language-neutral facts: Segments, cited Achievements
    prices.ts             every published price, euros excl. VAT, no locale
  styles/
    tokens.css            the palette and components (ADR 13)
    fonts.css             self-hosted @font-face
    app.css               layout, responsiveness, reduced motion, AA corrections
  components/             one per section, plus RevealPhone; offer/ holds the estimator
  lib/                    price formatting · JSON-LD
  layouts/                BaseLayout (<head>) · ResumePage (home) · OfferPage · PartnersPage
  pages/[...path].astro   one route per registry entry and locale
scripts/                  fonts · og image · asset checks · contrast · static server · sitemap dates
tests/
  content.spec.ts         the content contract: parity, references, prices (vitest)
  asset-check.spec.ts     the asset check's verdict on indexing (vitest)
  e2e/                    behaviour · offers · accessibility · links · performance budget
```

## What the tests hold in place

- **Content** — each page has content in exactly the locales the registry
  declares, and a bilingual page has the same shape and array lengths in both;
  nothing is blank; the prose is genuinely translated. Every Failure mode
  references one existing Offer, every cited Achievement exists, each Concept is
  on exactly one Offer, every option combination has a price range with its
  minimum at most its maximum, and the day rate is 550 € excl. VAT, for
  everyone. Every Offer is in one of the home page's three situations, the
  technical team's last and sold to no orphan application; a two-phase card
  names its first step; an Offer sold in two phases, or with a monthly plan,
  shows its whole budget (ADR 30).
- **Behaviour** — the home page's running order and its hero buttons, one
  Achievement open at a time, no track record and no CV link, the language
  switch changing the URL and never pointing at a page that does not exist,
  anchors clearing the sticky header. The header books the call in one click
  from every page, its About goes to the About page, and on a phone it fits two
  lines and steps aside going down; the 404 offers four ways back in; the
  Client sentences come in once, as they scroll into view (ADR 28).
- **Offers** — each Offer page's ranges match the price table, with and without
  JavaScript, its whole budget included; every slider is labelled and
  keyboard-operable, opens on its default, and steps aside when it moves no
  figure, and the result is announced; the call sits right under the price, the
  booking block says who answers, and the booking link is a plain outbound link
  (ADR 30).
- **Privacy** — the phone number is in neither page's HTML source nor the
  JSON-LD, and appears only after a click.
- **Accessibility** — axe at WCAG 2.1 AA, on every registered page, with every
  disclosure open, on desktop and mobile viewports; one `h1` and no skipped
  heading levels.
- **Integrity** — every link and asset a page references resolves; no request
  leaves the origin; the sitemap lists exactly the registered pages, each dated
  by the day its text last changed (`scripts/lastmod.json`, ADR 28).
- **Budget** — document, CSS, JS, font bytes and request count, with the
  numbers in [ADR 6](docs/adr/0006-budget-tests-instead-of-lighthouse-ci.md).
- **Copy invariants** — the pitch master's own rules, asserted rather than
  trusted: EN/FR parity at every array depth, the three honesty levels on the
  stack kept apart, the "no smart contract authoring" boundary present on the
  on-chain card, no date at all in the availability line, the four measurements
  the Track record used to carry alone still on the page, every `knowsAbout`
  term findable in rendered prose, and the phone number absent from every
  content string.

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
pull request and publishes nothing. One job runs fonts, lint, types, assets, content
parity and build, while the Playwright suite runs alongside it in three shards; the
Verify job merges their reports and is the one check that says whether the commit
passed. Railway builds from the repository.
