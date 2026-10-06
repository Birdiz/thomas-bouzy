# 23. Motion that answers

- Status: accepted, implemented 2026-10-06
- Date: 2026-10-06
- Amends [ADR 13](0013-the-site-wears-the-linkedin-cover.md): the ridge is no
  longer static

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

**Motion answers what the reader did, or shows an order. Beyond that, one
entrance, once.**

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
   opening, a page changing). Nothing loops and nothing overshoots. Text moves
   a few pixels at most; only the ridge, which carries none, travels further.
4. **What stays still:** the H1 and the hero's promise, the portrait, every
   price and figure (no counters), the booking buttons beyond their hover, the
   footer and the legal notice. Nothing fades in on scroll.

Shipped with this ADR:

- transitions on `.btn` (with a 1 px press) and on the header, breadcrumb and
  footer links;
- an Offer card lifts 4 px, its name takes the accent, its ground lightens a
  step and takes an accent edge where it has one, and an arrow slides in
  after its name, on hover and on keyboard focus;
- References and FAQ answers open and close to their height
  (`::details-content`, `interpolate-size`), and the FAQ takes the References'
  ring chevron;
- from one page to the next, the header stays put while the old page lifts
  away (200 ms) and the new one comes up into place (400 ms), through
  `@view-transition`;
- the journey track draws itself stage by stage over half a screen of scroll
  as the panel comes into view, and each stop fills with the accent as the
  line reaches it
  (`animation-timeline`, under `@supports`). Tied to scroll, it stops when the
  reader stops;
- an estimator figure that changes comes up into place in 220 ms (the
  figure's box only, through the Web Animations API, skipped under reduced
  motion: the reset in `app.css` does not reach script);
- the hero's ridge rises once on load, the near layers more than the far ones,
  and its glow fades up behind it. It is the page's one entrance, on
  decoration only, and it never loops.

The first cut shipped only the controls' answers. Looked at, the page at rest
was the same to the pixel, and the owner saw no difference. A reader would not
either: the track, the estimator and the ridge are what make the change
visible without a click. The second cut was still too quiet: a 250 ms
cross-fade between two dark pages could not be told from a cut, and a 1.5 px
track drawn over a single flick of the wheel went unseen. Motion that is meant
to be seen has to be calibrated by looking at it, not by its numbers.

**Firefox gets a fallback for both.** As of Firefox 153, scroll-driven
animations are still behind a flag, and cross-document view transitions do
not run. Both were the visible part of the change, so "the browser cuts, as
before" was not good enough:

- the journey: a script in `OffersSection.astro` holds the track back
  (`is-waiting`) and draws it once on a clock (`is-drawn`) when the panel is
  well into view, through an `IntersectionObserver`;
- the page change: a script in the head marks a page reached from this site
  (`page-in`, on `<html>` before the first paint) and its `<main>` comes up
  into place. The leaving half needs a view transition and is not faked.

Both only add motion: with no script, the track is drawn and the page is
simply there.

## Consequences

- The CSS budget (ADR 6) moves 34 → 35 kB. ADR 6 raises a limit only for
  content; the owner ruled that motion the reader can see is worth a few
  hundred bytes (about 0.2 kB compressed). The unused components left in
  `tokens.css` went first. No script limit moved.

- The e2e suite runs under reduced motion by default (`tests/e2e/fixtures.ts`),
  so it sees none of this. `resume.spec.ts` checks both sides: with no stated
  preference the controls have transitions and the next page is revealed
  through a view transition; under reduced motion neither.
- The reduced-motion reset cannot stop a scroll-driven animation: its
  duration maps to scroll distance, not time. The journey's sits under
  `no-preference` and `@supports`, and starts from a drawn stop number, never
  from hidden content. A scroll-driven animation never finishes either, so
  `settle()` in `a11y.spec.ts` would wait on one until the test times out; the
  audit runs under reduced motion, where none is declared.
- Still open: the carousel of Client sentences, whose pace and existence are
  both in question, and which turns on its copy first.
