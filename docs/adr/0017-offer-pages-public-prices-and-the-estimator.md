# 17. One page per Offer, public prices, and an estimator that degrades to a table

- Status: accepted, not yet implemented
- Date: 2026-10-03
- Amends [ADR 4](0004-typed-content-modules.md) and
  [ADR 6](0006-budget-tests-instead-of-lighthouse-ci.md)

## Context

The site has to do two jobs: **prove**, for warm traffic arriving from LinkedIn
or a referral, and **acquire**, by being found. A single page ranks for its
author's name and nothing else. Nobody searches for "Thomas Bouzy". People search
for "migrer Symfony sans interruption" or "reprise application métier".

Ten independent consultants' sites were reviewed for how they sell. A few
patterns carried over:

- **Honoré** has a budget estimator: a project type and a feature count give an
  order of magnitude, labelled "not a quote".
- **Dalbin** and **Wavect** deduct the fee for the first, small engagement from
  the next one.
- **Rector** sells PHP upgrades in two phases: a fixed-price plan, then execution
  alongside the client's team.
- **Srivvs** lists a risk register and ADRs among an audit's deliverables.
- **Lugh Web** has an agency page in white label.

None of them publishes a price for maintaining a business application. That gap
is the Takeover's.

## Decision

**One page per Offer**: Audit, Takeover, Migration, Reliability, Reinforcement
(see [CONTEXT.md](../../CONTEXT.md)). The routes are those of
[ADR 15](0015-french-at-the-root-english-where-it-sells.md). Each page, in order:

1. the plain line (ADR 12);
2. the Client sentences it treats;
3. what is delivered;
4. the steps;
5. the estimator;
6. "a good choice when / not the right choice when", the Offer's own price, in
   the spirit of the Principles;
7. the Achievements that prove it;
8. a short FAQ;
9. the link to the 30-minute call, `cal.com/thomas-bouzy/30min`.

The booking page is **a link, never an embed.** That keeps the CSP hash-only and
`links.spec.ts`'s "no request leaves the origin" true.

**Content stays in typed TypeScript modules.** A content collection was the
obvious choice for N long pages, and it was rejected. The prices are data that
the estimator and its fallback table must read from one source. The parity test
and the `knowsAbout` blocklist on plain lines already operate on these modules,
and a second content mechanism would split them. The Offers join `ResumeContent`'s
contract as `Offer`, with a typed price table.

**Prices are public.** Each Offer's estimator uses the cost driver that actually
moves its price:

| Offer | Sliders |
| --- | --- |
| Audit | size × depth (express or full) |
| Takeover | application size × level (Watch or Evolution) |
| Migration | version gap × **existing test coverage** |
| Reliability | services or flows |
| Reinforcement | days per week |

The Migration's test-coverage slider teaches the Client the real cost driver, as
well as estimating.

The day rate is published, as a range of 600 to 750 € HT. The low end is for
long, full-time engagements. At about 140 billable days, a realistic occupancy,
it fills the micro-enterprise ceiling (83,600 € in 2026) without crossing it. A
lower rate meant to fill 227 days of a calendar year was considered and rejected:
the ceiling caps revenue, not days, and a junior rate reads as a risk to the two
Segments that buy on day rate. The amounts themselves are content, not this
decision, and are reviewed with the business on 14 October 2027.

**The estimator is progressive enhancement.** Without JavaScript, the page serves
a static table of each Offer's ranges, generated from the same typed table. The
script, when it runs, turns that table into sliders. A visitor without JS loses
the interaction, never the price.

**Commercial rules stated once, on the pages they govern:**

- the Audit's fee is deducted from the engagement that follows it;
- the Migration is sold in two phases;
- the Takeover always starts with a test safety net;
- capacity is a rule, "two Clients at a time, never more", and never a state
  that could go stale.

## Consequences

- **The site stops being one page.** ADR 1's static build absorbs that unchanged.
  The e2e suites (behaviour, accessibility, links, budget) have to iterate over
  routes instead of over two locales.
- **ADR 6 gets a second inline script.** The budget is per page, so each Offer
  page's estimator has to fit the existing 2 KB inline-JS line. If it does not,
  that is a finding about the estimator, not a reason to move the line.
- **A price on a page is a promise that can go stale**, like the date ADR 11
  removed. The typed table is the one place to change it, and the static table
  means a stale price is at least a consistent one.
- ADR 4's reasons are reaffirmed rather than revisited. The content contract now
  carries prices, which is the case where a runtime schema would earn its keep
  only if they came from outside the repo. They do not.
