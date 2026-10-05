# 14. Three Segments, and a page written for the least technical of them

- Status: accepted, implemented 2026-10-04; amended by
  [ADR 18](0018-one-day-rate-and-half-the-words.md) and
  [ADR 19](0019-the-buyers-objections-before-the-buyer-asks.md), 2026-10-05
- Date: 2026-10-03
- Settles what [ADR 11](0011-the-page-is-not-a-cv.md) and
  [ADR 12](0012-the-clients-sentence-first.md) left waiting on "the segment"

## Context

Since ADR 11 the page has been selling engagements without saying to whom. Three
things were parked on that question: the hero, which still opened on
`event-driven`, `Event Sourcing` and `on-chain` inside two lines; `meta.title`,
which still named a job title; and the link from each Failure mode to the Offer
that treats it, which ADR 12 called the half of its work with the higher return.

The question looked like a choice between two markets: the national and
international fintech market the content was written for, and the "local market"
that the market-analysis project in Claude Cowork was framed around. Two facts
changed it:

- **The local market was the Cowork project's framing, not Thomas's
  conviction.** It is a hypothesis, not a premise. The analysis has not produced
  anything yet, so nothing on the page can wait for it.
- **The two markets are not in tension once Segments are defined by what breaks
  rather than by sector.** A wallet that double-spends and a stock count that
  will not reconcile are the same failure, *a system that has to stay correct*.
  The About section already said the through-line was "the growing criticality of
  what breaks", not a stack and not an industry.

The vocabulary is in [CONTEXT.md](../../CONTEXT.md).

## Decision

**Three Segments:**

- **Critical systems.** Software publishers and scale-ups whose system moves
  money or commitments. Remote, with a technical buyer. Fintech is the sector of
  one Achievement, not the Segment.
- **Partners.** Agencies and IT services firms that bring Thomas in for their own
  client. White label is accepted, and Partners get a section of their own.
- **The orphan business app.** Local SMEs and manufacturers in the Service area
  (Nancy, Strasbourg, Colmar, Obernai, Épinal) running an in-house application
  nobody left in the company dares to touch. SMEs and manufacturers were going
  to be two Segments. They are one, because they say the same sentence.

**The page is written for the least technical reader.** The reasoning is an
asymmetry: a CTO reads a plain sentence without effort, and a manufacturing SME's
director does not read "Event Sourcing". ADR 12's rule (no `knowsAbout` term in a
plain line) therefore extends to the hero. The common thesis is the one the page
already had: a system that has to stay correct.

**The home page reads problem → offer → proof → position → person:**

Hero → 01 Problem → **02 Offers** → 03 Achievements → 04 Position → 05 About → Contact

- The hero keeps one button, now "See the offers".
- The four Failure modes are rewritten for the new reader, and each is treated by
  exactly one Offer:

  | Failure mode | Treated by |
  | --- | --- |
  | The orphan app (new) | Takeover |
  | The migration that never happens | Migration |
  | The discrepancy nobody can explain, widened from balances to stock and batches | Reliability |
  | Defects found by users | Reliability |

- "Double execution" leaves the home page for the Reliability page, where the
  Critical-systems reader will find it.
- The Audit treats no Failure mode. It is the call to action under all four, for
  the Client who cannot yet name theirs.
- The six Concepts leave the home page, and each moves to the page of the Offer
  it describes:

  | Concept | Moves to |
  | --- | --- |
  | Traceable | Reliability |
  | Invisible redesign | Migration |
  | Footprint, Build-vs-buy | Audit |
  | Shared service, Handover | Reinforcement |

  Under a hero aimed at a non-technical reader, a grid of S1 vocabulary would
  undo the sorting the hero had just done.
- A seventh Achievement serves the orphan-app Segment, which had no proof on the
  page: a complete industrial ERP maintained in production at Quadra Informatique
  (2016–2017). It reaches the site through the pitch master first (ADR 9).

## Consequences

- The four Client sentences are still inferences, as ADR 12 warned. The first
  real conversation with each Segment is the cheapest moment to correct them.
- The page now has to convince three Segments in an order that favours one. The
  Offer pages exist so that the other two are not short-changed:
  [ADR 17](0017-offer-pages-public-prices-and-the-estimator.md).
- `meta.title` and the `<title>` lose the job title in the same rewrite. That was
  the only thing still holding them.
- Nothing here is for sale before 14 April 2027, the date Thomas will register
  the business, and not before. Until then the site is a showcase: not indexed, and its availability
  line says "first engagements in preparation", which carries no date and so
  cannot expire. See [ADR 16](0016-the-legal-notice-and-a-number-meant-to-be-public.md).
