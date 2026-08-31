# 11. The page is not a CV; the PDF is

- Status: accepted
- Date: 2026-08-31

## Context

The site sells engagements. It was still built like a résumé: a job title under
the name, a "12 years" badge, a Track record section with employers, dates,
durations and per-job stack chips, an earlier-roles disclosure going back to
2014, and a CV download in the hero next to the only other button.

Every one of those answers a hiring question — what post does he hold, is he
senior enough, where has he been, for how long. None of them answers the
question someone buying an engagement asks, which is whether this person can fix
the thing that is broken.

Two of them were also actively wrong on the day:

- the availability banner read "permanent roles from September 2026" on
  2026-08-31, so it was one day from advertising a date already past — on a page
  whose own thesis is that what is not instrumented is not reliable;
- the CV download sat in the first viewport as an equal alternative to the work,
  and appeared a second time in the contact panel, where it read as a third way
  to get in touch.

The PDF already carries the chronology, the titles, the stack and the twelve
years, in full. Nothing had to be written for this — only moved.

## Decision

The Track record section, the earlier-roles disclosure, the years badge, the
hero's job-title line and the per-job stack chips are removed. `Job` and
`EarlierRole` leave the content contract with them.

The CV keeps one home: the end of the About section, under a line that says what
it is for — "hiring rather than contracting? the detailed track record, the
chronology and the technologies are in the CV". It is gone from the hero and
from the contact panel. The hero is left with one button, pointing at the work.

The availability line carries no date at all.

**Four facts existed nowhere else on the page**, and a measurement is not
replaced by a download. Each moved to the card or the principle whose subject it
already was, rather than leaving with the section:

| Fact | New home |
| --- | --- |
| 1.5M+ active users | Event Sourcing card, context |
| Fan Token Offering peaks, 10–20k users, BlazeMeter | Event Sourcing card, result |
| OpenTelemetry, Datadog, dashboards, alerting | Principle 4, which already carried the 20→5 measurement without saying how |
| On call, incidents through Rootly | FanTokens card, result — the release it names |

Kubernetes and ArgoCD are now named beside the footprint numbers that were
already on that card, the third-party financial partner integrations moved to
the on-chain card, the two-team / six-people leadership scope moved to the
mentoring entry whose subject it is, and the peer assessments moved into the
About paragraph about handover. `tests/content.spec.ts` asserts the four
survivors are still findable, in both locales.

**The Person schema lost both its derivations.** `jobTitle` came from the hero's
role line and `knowsAbout` from the job stack chips; neither exists now. They
are stated in `schema` in the content modules instead, and the rule the
derivation used to guarantee — the schema claims only what the page states — is
asserted: every `knowsAbout` term must appear verbatim in a rendered string.
`DDD` and `PHP` were dropped rather than kept, because after the chips went
neither appears in the page's prose.

## Consequences

- The page no longer states, anywhere, how many years he has worked, what his
  last job title was, or when he held it. That is the point, and it is the part
  worth being sure about: a reader who wants it has the PDF, one link away.
- Six commits of Track record work — the LOT 9 rebase most recently — are not
  wasted but are no longer visible: they live in the PDF and in the four facts
  recovered above.
- The document shrank. The budget in
  [ADR 6](0006-budget-tests-instead-of-lighthouse-ci.md) is a ceiling, so
  nothing failed; the headroom it describes is now larger than that note says.
- **The PDF became load-bearing, and it is not built here.** It is generated
  upstream and committed as a binary. It still prints `tom.bouzy@gmail.com`
  while the site uses `birdiz@proton.me`, and the full commune the page
  deliberately withholds — see [ADR 5](0005-phone-number-is-not-in-the-html.md).
  Making it the sole carrier of the salaried route raises the cost of that gap;
  closing it is an upstream change.
- `meta.title` and `ogImageAlt` still name the job title. Deliberately left:
  they are the SERP and share-card identity, and rewriting them is a
  positioning decision that belongs with the page's opening line, which is
  waiting on the market analysis rather than on this note.
