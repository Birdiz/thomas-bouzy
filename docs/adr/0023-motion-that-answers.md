# 23. Motion that answers

- Status: accepted, implemented 2026-10-06
- Date: 2026-10-06

## Context

The site read as rigid. A UX audit and a copy audit, run side by side, found
that this was not because nothing moved. The carousel of Client sentences
moves, and so do the arrow of the invitation to the Audit and the Reference
panels. What felt rigid was the controls:

- no button, nav link or footer link eased between its states, so every
  hover was a jump cut;
- an Offer card is one big link, but under the pointer only its name
  underlined;
- a Reference jumped to its height, and the FAQ kept the browser's marker;
- every page change was a blank flash, on the site's main path (home page →
  Offer page) and on the language switch.

Both audits warned against the obvious fix: fading every section in on
scroll. It delays reading for the least technical reader (ADR 14), hides
content from search-in-page, screenshots and axe, and it is the template of
every SaaS landing page.

## Decision

**Motion answers what the reader did, or shows an order. It never decorates.**

1. **Opt-in.** Anything that moves on its own (a disclosure's height, the page
   cross-fade) is declared under `prefers-reduced-motion: no-preference`. The
   global reduced-motion reset in `app.css` stays as the net beneath, and now
   also zeroes the animation and transition delays.
2. **CSS first.** No library and no client router. Astro's `<ClientRouter />`
   would cost 10–15 kB of external script against a 4 kB budget (ADR 6), and
   would break the scripts that run once on load (the carousel, the phone
   reveal, the estimator). Cross-document view transitions do the same job in
   CSS, and browsers without them cut, as before.
3. **Once, short, decelerating.** One curve, `--ease-out`, and two durations,
   `--dur-fast` (150 ms, a control answering) and `--dur-base` (250 ms, a panel
   opening, a page changing). Nothing loops, nothing overshoots, nothing moves
   more than a few pixels.
4. **What stays still:** the H1 and the hero's promise, the portrait, every
   price and figure (no counters), the booking buttons beyond their hover, the
   footer and the legal notice. Nothing fades in on scroll.

Shipped with this ADR:

- transitions on `.btn` (with a 1 px press) and on the header, breadcrumb and
  footer links;
- an Offer card lifts 2 px, its ground lightens a step where it has one, and
  an arrow slides in after its name, on hover and on keyboard focus;
- References and FAQ answers open and close to their height
  (`::details-content`, `interpolate-size`), and the FAQ takes the References'
  ring chevron;
- a 250 ms cross-fade between pages (`@view-transition`).

## Consequences

- The e2e suite runs under reduced motion by default (`tests/e2e/fixtures.ts`),
  so it sees none of this. `resume.spec.ts` checks both sides: with no stated
  preference the controls have transitions and the next page is revealed
  through a view transition; under reduced motion neither.
- Scroll-driven animation (`animation-timeline: view()`) is not used yet. The
  reduced-motion reset cannot stop it: its duration maps to scroll distance, not
  time, so it must sit under `no-preference` and `@supports`, and never start
  from a hidden state. A scroll-driven animation that is not wrapped this way
  also never finishes, so `settle()` in `a11y.spec.ts` would wait it out until
  the test times out.
- Candidates for a next step, each to be argued on its own: drawing the
  journey track as it scrolls into view; a short fade on the estimator's figure
  when a slider moves it (the figure only, never the `role="status"` text); the
  hero's ridge rising once on load, which would amend
  [ADR 13](0013-the-site-wears-the-linkedin-cover.md)'s "static"; and the
  carousel of Client sentences, whose pace and existence are both in question.
