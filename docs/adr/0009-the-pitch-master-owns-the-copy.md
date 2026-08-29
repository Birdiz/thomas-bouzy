# 9. The design canvas owns the design; the pitch master owns the copy

- Status: accepted
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
