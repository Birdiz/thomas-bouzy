# Where the implementation departs from the design canvas

Source: Claude Design project `192e8aa3-4ac8-43c2-8ff3-305baaf30e70`,
file `Thomas Bouzy - Interactive Résumé.dc.html`.

Every deviation below is deliberate. Anything not listed here matches the
canvas.

**Verified against the canvas on 2026-08-29.** `styles.css` is unchanged
upstream — normalised for comments and whitespace it is character-for-character
`src/styles/tokens.css`, down to an identical length, with one cosmetic quote
style biome rewrote. The `.dc.html` is unchanged too: it still carries the May
2026 availability, "Grandrupt, Grand Est (88)", "6+ years" remote and the
original five projects. Nothing upstream needed porting; entries 23 to 25 below
are gaps the first pass left unrecorded, found by this diff.

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
| 23 | No skills section, and no `#skills` in the nav | `SkillsSection.astro`, plus a fifth nav link | The canvas's data carries `skills`, `kickerSkills` and `skillsTitle`, and `renderVals` returns them — the markup that would render them is simply absent. Built as the data intends |
| 24 | About's aside renders the mentoring card only | Mentoring, plus languages and education | Same shape: `langs`, `langKicker`, `eduKicker` and `eduText` all exist in the data and reach `renderVals`, and nothing renders them |
| 25 | Stat figure at 23px | 34px | The canvas's four stats are words — "Event-driven", "Tech lead" — at a size that suits a phrase. They are figures here, and a figure carries the tile; below 640px it steps back to 28px, where "1,000/min" stops fitting a half-width tile |

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
| 19 — a region, never narrower | `tests/content.spec.ts`, which now also rejects the département; the JSON-LD is region-level too |
| 20, 21 — the project set | Owned by the pitch master; six cards, chosen there |

One entry is a judgement rather than a rule, and it stands. Entry 19 rejected
"Grandrupt, Grand Est (88)" because a commune of a few hundred people, beside a
name and a job title, is a near-deducible home address. The pitch master
publishes "the Vosges" in its own LinkedIn section, so the département was put
to Thomas as a possible middle ground; he chose to stay at the region. The page
says *Grand Est, France*, the structured data agrees, and the test now rejects
the département as well as the commune — this is the one place where the pitch
master does not win, because it is his call to make and not the document's.

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
   collective economic redundancy plainly (§5). Raised with Thomas, who does not
   want it mentioned. That instruction is written for an interview anyway, and
   the availability line already answers the question it would raise.
3. **Project dates.** Confirmed by Thomas: the Socios cards all carry the full
   engagement, May 2022 – April 2026. Each project card now spells out the
   period of the engagement it belongs to, rather than a short year range, so
   the KTB card reads in the same register as the three beside it.
4. **The PDFs are behind the page.** `public/assets/cv-thomas-bouzy-{en,fr}.pdf`
   predate this rebase and carry none of its numbers — the pitch master's §10
   item 1. A visitor who downloads the CV gets less than the page showed them.
   Thomas is reworking both; they land as a drop-in replacement at the same two
   paths, and `npm run assets:check` says so if one goes missing.
5. **Overlapping 2016–2017 entries.** Business & Decision, Quadra Informatique
   and Université de Reims overlap in "earlier experience". Accurate — the
   teaching ran in parallel — and accepted as-is.
6. **LinkedIn URL.** Verified by Thomas. Implemented as
   `https://www.linkedin.com/in/thomas-bouzy`; `links.spec.ts` does not check
   it, because it is the one reference that leaves the origin.
