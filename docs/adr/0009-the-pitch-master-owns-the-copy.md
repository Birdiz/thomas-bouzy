# 9. The design canvas owns the design; the pitch master owns the copy

- Status: amended by [ADR 10](0010-the-site-owns-its-own-design.md), 2026-08-29
- Date: 2026-08-29

## Context

Until now the Claude Design canvas `Thomas Bouzy - Interactive Résumé.dc.html`
was the single source for everything: layout, tokens **and** the words. Every
departure from it was a numbered entry in `docs/design-deltas.md`, and six of
those entries (16–21) were content corrections — a stale availability date, a
remote track record counted from the wrong year, two project cards swapped out.

That worked while the copy had one origin. It stopped working when a second
appeared: `Pitch_Master_Thomas_Bouzy_{EN,FR}.md`, rev. 6, 29 August 2026 — a
positioning document maintained deliberately, revised after interviews, and far
richer than the canvas. It carried a whole body of work the site had no trace
of: observability with a quantified result, an API redesign under a
no-regression constraint, cost ownership, a DeFi microservice in production on
real funds.

Its own §10 names the highest-return action available: *push these numbers into
the reference CVs*. This site is a reference CV.

Keeping the canvas as the copy's authority would have meant logging every one of
those additions as a "deviation" from a document that simply does not know about
them. The delta list would have grown into a changelog of the pitch master,
which is not what it is for.

## Decision

Two sources, two scopes, no overlap:

- **The canvas owns the design.** Structure, layout, breakpoints and the Organic
  design system. `src/styles/tokens.css` stays a byte-for-byte copy of the
  upstream `styles.css` (ADR 3), and a canvas retune is still a mechanical diff.
- **The pitch master owns the copy.** Everything in `src/content/en.ts` and
  `src/content/fr.ts`. Where the two disagree on words, the pitch master wins.

The pitch master is a set, not a file: the two positioning documents, the
subject briefs that extend them (the Kiss The Bride context of 2026-08-29 is
the first), and the two reference CVs derived from all of it. The CVs are the
tie-breaker, because they are what Thomas actually sends. That is how the KTB
block's Mercure work moved from "to confirm" to a bullet, and how MongoDB —
carried for months on a misremembered stack, and long enough to grow a rule of
its own — left the file: the CVs say MariaDB, and MongoDB appears nowhere in
twelve years. `tests/content.spec.ts` now fails if it comes back.

`docs/design-deltas.md` therefore stops recording content differences against
the canvas. It records structural, accessibility and privacy departures — the
things the canvas still governs — plus one line naming this decision.

## Consequences

- New material reaches the site by revising the pitch master first, then
  rebasing the content modules on it. The site is downstream, not a second
  original.
- Three of the pitch master's own rules are load-bearing here and are asserted
  in `tests/content.spec.ts` rather than left to care:
  - the three honesty levels on the stack (production deep / production
    secondary / currently learning) are never compressed into one flat list;
  - the blockchain scope boundary — SDK integration and transaction operation,
    **no smart contract authoring** — is stated in the project card itself;
  - an availability line may name a date, but never one already past.
- The two CV PDFs in `public/assets/` are **not** rebased by this decision and
  are now behind the page that offers them. Regenerating them is the pitch
  master's §10 item 1; Thomas is doing it, and they drop in at the same paths.
- The pitch master wins on wording, not on what is safe to publish. Two of its
  lines are deliberately not on the page: the collective redundancy, and the
  département. Both are Thomas's calls, recorded in `design-deltas.md` so the
  next rebase does not "restore" them.
- The canvas and the site will drift apart in wording. That is intended, and is
  why this file exists: without it, the next person to diff the two would read
  the drift as rot and "fix" it backwards.

## Postscript, 2026-08-29 — half of this is gone

The split this file describes had two halves. The first — "the canvas owns the
design" — is over: ADR 10 forked the palette and the type, and the canvas leads
nothing any more.

The second half stands, with one correction. The pitch master owns the career
facts, and it is still the tie-breaker on what Thomas has actually done. But
this file also said "the site is downstream, not a second original", and that
was wrong the day it was written. Thomas means to build freelance offers here.
A site carrying a commercial offer has sections its author's CV will never have,
a different audience, and every right to its own contact address — which is
exactly what happened: the page moved to birdiz@proton.me while the CVs kept
theirs, and that is not a defect to reconcile.

So: the pitch master owns the past, the site owns what it sells.

## Postscript 2, 2026-08-30 — the honesty rule left the grid

The Toolkit section is gone. Thomas's reading on mobile was that a grid of
technology tags is the CV look the repositioning was meant to escape, and that
it says nothing a dated Track record chip does not say better.

That grid was carrying one of the three load-bearing rules named above: the
three honesty levels, never compressed. Deleting the section without moving the
rule would have retired it silently — the worst outcome, because the rule's
whole value is that it is visible and therefore costly.

So it moved rather than died. It is now **principle 5 of the Approach section**,
stated the way the other four are: a position, with the price of holding it.
`tests/content.spec.ts` asserts it there instead of on the skills groups, and a
second test asserts the stack is still on the page at all — the dated job chips
are its only carrier now, so dropping one removes a technology from the site
outright.

Two consequences, recorded so they are not read as rot:

- The stack chips left every surface except Track record: the hero's four
  badges and the six project cards' chips are gone. `knowsAbout` in the Person
  schema is derived from the job stacks now, for the same reason.
- The AI-practice lines went with the grid. They were the one place the page
  carried Claude API, MCP servers and pipeline orchestration, each tagged with
  its level. Nothing on the page claims them today. Putting them back belongs in
  the About section, as trajectory, and is not decided yet — §8 of the pitch
  master is explicit that the AI angle is credible grafted onto another, never
  as a headline of its own.
