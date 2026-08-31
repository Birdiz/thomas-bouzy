# 12. The client's sentence first, and a plain line on every card

- Status: accepted
- Date: 2026-08-31

## Context

Two things on this page were written for a peer.

The first is the section the page opens its argument with. Four failure modes,
each under the name an engineer gives it — "Double execution", "A balance nobody
can explain", "The migration that never happens", "Defects found by users". They
are accurate, they are well written, and not one of them is a sentence anybody
has ever said out loud in a meeting.

That section's job is not taxonomy. It is the moment a reader thinks *we have
said that here*. It is the cheapest qualification mechanism on the page, because
a reader who recognises his own words has qualified himself before reading a
line of Thomas's — and the page already has a surface for named concepts, the
six-card grid above it.

The second is a device Thomas invented and then used once. The on-chain card
opened "In plain terms: a service that places and readjusts money on markets by
itself, where an order once sent cannot be called back", and only then went
technical. One card in six. The other five open on event-sourced wallets, outbox
patterns, a multi-tenant monolith and an eight-stage cost funnel — each of which
requires the reader to already know the thing the card is trying to sell him.

## Decision

**The client's sentence is the heading; the diagnosis is the body.**
`FailureMode.label` becomes `FailureMode.quote`, and carries its quote marks in
the locale's own — `« »` in French, curly doubles in English. The diagnosis
follows underneath, and each one now *opens* by naming the failure mode it
explains, so the vocabulary the rest of the page argues in did not leave with the
labels.

Two rules in `tests/content.spec.ts` hold it:

- every quote is actually quoted. An unquoted first-person line reads as Thomas
  speaking, which inverts the whole device;
- all four names are still findable in the prose. The rewrite is allowed to move
  them, not to cost them.

**Every project card opens on a plain line.** `Project.plain` is one sentence
saying what the work was, before any word the reader has to learn. It renders
above the three facets, under a `work.labelPlain` lead-in that carries its own
colon because French spaces it. The on-chain card's inline version is deleted —
it is the field now, and a second inline copy would print it twice.

The rule is asserted rather than trusted to care: **no plain line may contain a
term from `schema.knowsAbout`.** That list is exactly the set of words this page
teaches, so it doubles as the blocklist and maintains itself — the commit that
adds a technology to the schema tightens the rule on the same pass. A length cap
keeps the line a lede rather than a fourth facet.

## Consequences

- **The triggers still do not point at the offers.** The scaffold asks that each
  one link to the offer that treats it; that is what turns the section from
  illustration into a funnel, and it is the half of this work with the higher
  return. It is blocked on the offers section, which does not exist yet and is
  the only part of the architecture waiting on the market analysis. The four
  quotes are written so a link can be hung on each without rewriting it.
- **The mirror is only as good as its four sentences.** They are inferred from
  the failure modes, not transcribed from a client. Each is a claim about how a
  buyer says the thing, and each is the cheapest line on the page to correct the
  first time someone says it differently.
- **The hero is untouched, and still opens on `event-driven`, `Event Sourcing`
  and `on-chain` inside two lines.** That is the densest jargon left on the page,
  and it is deliberately out of scope: rewriting the opening is a positioning
  decision that belongs with the segment, not with this note. Same reason
  `meta.title` still names a job title — see [ADR 11](0011-the-page-is-not-a-cv.md).
- The cards grew by roughly one line each. The budget in
  [ADR 6](0006-budget-tests-instead-of-lighthouse-ci.md) is a ceiling and
  absorbed it; prose compresses.
- "En clair" / "In plain terms" is printed on all six cards rather than implied
  by the styling. Quieter would have been possible, but the words are half the
  device: they tell a reader who does not have the vocabulary that this one line
  is for him.
