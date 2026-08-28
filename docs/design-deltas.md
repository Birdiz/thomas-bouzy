# Where the implementation departs from the design canvas

Source: Claude Design project `192e8aa3-4ac8-43c2-8ff3-305baaf30e70`,
file `Thomas Bouzy - Interactive Résumé.dc.html`.

Every deviation below is deliberate. Anything not listed here matches the
canvas.

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

## Privacy and performance

| # | Canvas | Here | Why |
| --- | --- | --- | --- |
| 13 | Mobile number in the HTML source | Click-to-reveal, absent from JSON-LD | [ADR 5](adr/0005-phone-number-is-not-in-the-html.md) |
| 14 | `@import url(fonts.googleapis.com/...)` | Self-hosted woff2 from `@fontsource` | Render-blocking third party on the critical path, and every visitor's browser calling Google — the well-documented CNIL problem for a site aimed at a French audience |
| 15 | — | `og.png`, JSON-LD `Person`, canonical, `hreflang`, sitemap, `robots.txt` | The canvas has no `<head>` |

## Content

| # | Canvas | Here | Why |
| --- | --- | --- | --- |
| 16 | "Open to full-time roles & freelance — from May 2026" | "Available now — full-time roles & freelance" | It is August 2026; the page read as stale |
| 17 | "Fully remote for 6+ years" / "depuis 6 ans" | "8+ years" / "depuis 8 ans" | Remote freelance starts January 2018 → 8 years |
| 18 | One PDF (`-EN`) linked from both languages | One per locale | The FR page offered an English CV |

Everything else in the copy is the canvas's, verbatim in both languages.

## Raised and settled

Flagged during implementation; the resolution is recorded here so it is not
re-litigated on the next pass.

1. **April → August 2026.** Socios is dated "– April 2026" and nothing on the
   page covers the months since. Reviewed with Thomas and deliberately left
   alone: the hero already says "Available now", and the reason is a
   conversation for the call, not a line on a public page.
2. **Overlapping 2016–2017 entries.** Business & Decision, Quadra Informatique
   and Université de Reims overlap in "earlier experience". Accurate — the
   teaching ran in parallel — and accepted as-is.
3. **LinkedIn URL.** Verified by Thomas. Implemented as
   `https://www.linkedin.com/in/thomas-bouzy`; `links.spec.ts` does not check
   it, because it is the one reference that leaves the origin.

## Still open

1. **The locality is published in full** — "Grandrupt, Grand Est (88)". Kept as
   designed; the JSON-LD carries the region only. Narrowing the visible line to
   "Grand Est, France" would cost nothing and give away less.
