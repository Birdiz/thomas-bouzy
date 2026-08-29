# Where the implementation departs from the design canvas

Source: Claude Design project `192e8aa3-4ac8-43c2-8ff3-305baaf30e70`,
file `Thomas Bouzy - Interactive Résumé.dc.html`.

Every deviation below is deliberate. Anything not listed here matches the
canvas.

**Scope, since 2026-08-29.** The canvas owns the design; the copy is owned by
`Pitch_Master_Thomas_Bouzy_{EN,FR}.md` — see
[ADR 9](adr/0009-the-pitch-master-owns-the-copy.md). This file therefore records
structural, accessibility and privacy departures only. Wording differences
against the canvas are no longer deviations, they are the other source
speaking.

## Structural

| # | Canvas | Here | Why |
| --- | --- | --- | --- |
| 1 | Language held in component state, one URL | Routes `/` (EN) and `/fr/` | Indexable and shareable per language — [ADR 2](adr/0002-locale-routes-over-a-client-toggle.md) |
| 2 | Project accordion driven by `state.open` | `<details name="projects">` | The browser enforces one-open-at-a-time and provides `aria-expanded` for free; removes the state |
| 3 | "Earlier experience" driven by `state.earlierOpen` | `<details>`, label swapped in CSS | Same; the show/hide label is `details[open]`, no script |
| 4 | Desktop-only, no breakpoints | Breakpoints at 1023 / 860 / 640 / 400 px | The canvas has none; below ~900px its fixed grids break |
| 5 | `<image-slot>` placeholder | `<Image>` with responsive `widths`, labelled placeholder until a photo lands | The slot was empty in the canvas |
| 6 | Hero is the 1160px container | Full-bleed section wrapping the container | Lets the decorative blob bleed as designed without widening the document |

## Accessibility

| # | Canvas | Here | Why |
| --- | --- | --- | --- |
| 7 | Section kickers are `<h6>` before an `<h2>` | `<p class="kicker">`, same pixels | An `h6` before an `h2` is an invalid heading outline on every section |
| 8 | `--color-accent` for kickers, links, primary button fill | `--color-accent-700` | 3.03:1 on cream, 2.69:1 on surface — under the 4.5:1 AA floor. Same ramp, one step down: 5.72 / 5.09 — [ADR 3](adr/0003-design-system-copied-verbatim.md) |
| 9 | `.project__facet p` also styled the facet label | `.project__facet-text` | The label is a `<p class="kicker">`; the rule dropped it to 14.5px at 90% opacity and under AA |
| 10 | Animations always run | Cut under `prefers-reduced-motion: reduce` | Vestibular safety; also makes programmatic scrolling deterministic |
| 11 | — | Skip link, `scroll-padding-top` on the scroll container | Keyboard access; nothing lands under the sticky header |
| 12 | `<button style="all:unset">` | `<summary>` with a real focus ring | `all: unset` removed the focus outline |
| 22 | Inactive language switch at `opacity: 0.65` | `0.75` | The header is `--color-bg` at 86% over a blur, so its effective background is whatever scrolls beneath. Over the page ground 0.65 measures 4.84:1; over the dark contact panel the header composites to `#d9cfbf` and it drops to 4.29:1 — AA or not depending on scroll position. 0.75 holds 6.61 / 5.70. `contrast.mjs --audit` now models the header explicitly, which the solid-background block above could not |

## Privacy and performance

| # | Canvas | Here | Why |
| --- | --- | --- | --- |
| 13 | Mobile number in the HTML source | Click-to-reveal, absent from JSON-LD | [ADR 5](adr/0005-phone-number-is-not-in-the-html.md) |
| 14 | `@import url(fonts.googleapis.com/...)` | Self-hosted woff2 from `@fontsource` | Render-blocking third party on the critical path, and every visitor's browser calling Google — the well-documented CNIL problem for a site aimed at a French audience |
| 15 | — | `og.png`, JSON-LD `Person`, canonical, `hreflang`, sitemap, `robots.txt` | The canvas has no `<head>` |

## Content

Superseded on 2026-08-29. Entries 16 to 21 recorded corrections against the
canvas's copy: a stale availability date, the remote track record counted from
2018, one PDF per locale, two project cards swapped, the location published as a
region rather than a commune.

The copy now derives from the pitch master rather than the canvas
([ADR 9](adr/0009-the-pitch-master-owns-the-copy.md)), so those entries no longer
describe a deviation — they describe a document the site is no longer downstream
of. What each of them protected is still protected, and now by a test rather
than by a table:

| Was | Now enforced by |
| --- | --- |
| 16 — no availability date that has already passed | `tests/content.spec.ts`, which allows a date only while it is still ahead |
| 17 — remote track record counted from 2018 | `tests/content.spec.ts` |
| 18 — one CV PDF per locale | `src/site.ts` `CV.path(locale)`, `tests/e2e/links.spec.ts` |
| 19 — a département, never a commune | `tests/content.spec.ts`; the JSON-LD stays region-level |
| 20, 21 — the project set | Owned by the pitch master; six cards, chosen there |

One privacy judgement moved rather than disappeared. Entry 19 rejected
"Grandrupt, Grand Est (88)" because a commune of a few hundred people, beside a
name and a job title, is a near-deducible home address. The pitch master
publishes "the Vosges" in its own LinkedIn section, and a département of 360,000
is not an address — so the page now says *Vosges, Grand Est, France* while the
structured data still carries the region alone. The original reasoning holds
against the commune, which is what it was aimed at.

## Raised and settled

Flagged during implementation; the resolution is recorded here so it is not
re-litigated on the next pass.

1. **April → August 2026.** Socios is dated "– April 2026" and nothing on the
   page covers the months since. Reviewed with Thomas and deliberately left
   alone: the reason is a conversation for the call, not a line on a public
   page. The hero now carries the two availabilities the pitch master states —
   freelance immediately, permanent from September 2026 — which is the part a
   reader can act on.
2. **The exit is not on the page.** The pitch master says to state the
   collective economic redundancy plainly (§5). That instruction is written for
   an interview, and the availability line already answers the question it
   would raise. Excluded from the site on purpose, not overlooked.
3. **Project dates inside the Socios period.** The API redesign and the DeFi
   microservice are both dated `2022–2026`, the full engagement, because the
   pitch master dates neither. Narrower dates would be invented. Worth
   tightening if Thomas remembers them.
4. **The PDFs are behind the page.** `public/assets/cv-thomas-bouzy-{en,fr}.pdf`
   predate this rebase and carry none of its numbers — the pitch master's §10
   item 1. A visitor who downloads the CV gets less than the page showed them.
   Tracked, not fixed here.
5. **Overlapping 2016–2017 entries.** Business & Decision, Quadra Informatique
   and Université de Reims overlap in "earlier experience". Accurate — the
   teaching ran in parallel — and accepted as-is.
6. **LinkedIn URL.** Verified by Thomas. Implemented as
   `https://www.linkedin.com/in/thomas-bouzy`; `links.spec.ts` does not check
   it, because it is the one reference that leaves the origin.
