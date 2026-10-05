# 19. Two more Offers: building what does not exist, and holding the load

- Status: accepted, not yet implemented
- Date: 2026-10-05
- Amends [ADR 14](0014-three-segments-and-the-least-technical-reader.md) and
  [ADR 17](0017-offer-pages-public-prices-and-the-estimator.md)

## Context

The catalogue of ADR 17 sells five Offers, and all five work on a system that
already exists. Two things Thomas does were not for sale anywhere on the site:

- **Building from scratch.** He has done it for employers and for Clients:
  sites for a record label's artists, the open-data directory tool, the on-chain
  service at Socios, which was built new and runs on real funds. No Offer sells
  it, and no glossary term names it.
- **Holding the load.** At Socios it was daily work: load tests with BlazeMeter,
  autoscaling, caching, database tuning, backpressure on queues, circuit
  breakers, post-mortems. The site shows only fragments of it, in two Achievement
  cards (1.5 million active users, more than 1,000 transactions a minute, peaks
  of 10,000 to 20,000 users load-tested). No Offer sells it, and no Failure mode
  names it.

Each addition has a risk.

**A from-scratch Offer can eat the positioning.** The hero says "without
rewriting everything", and the first Principle is "migrate in steps, never
rewrite everything". Sold as "custom development", a from-scratch Offer would:

- contradict both;
- put Thomas in a price race with every agency and with no-code;
- push a solo micro-business towards a fixed price on a vague specification,
  which carries the most risk.

**A load Offer could be folded into Reliability.** It should not be. The
site's own tagline, "systems that have to stay correct while they stay up",
makes two promises:

- **Reliability keeps a system correct.** CONTEXT.md defines it as making a
  discrepancy explainable. It starts from traceability.
- **The load promise keeps it up.** It starts from a measurement.

The two do not share a cost driver or the words a buyer searches with. Merging
them would turn Reliability into a catch-all.

## Decision

**Two new Offers, each sold in two phases like the Migration:** a fixed-price
first phase, then work by the day at the day rate. The Client can stop after
the first phase and keep what it delivered. The Audit's credit applies to
either.

**Build** (FR *Création sur mesure*) builds an application or a service that
does not exist yet.

- **Never the rewrite of a running system.** A running system goes to a
  Migration, or first to an Audit. The glossary states this rule, because
  without it the Offer contradicts the rest of the site.
- **Its argument is that it is built to be taken over.** Thomas takes over
  orphan applications, so he knows what makes a new one become an orphan. From
  the first week: tests, written decisions, a handover. This argument extends
  the Takeover instead of contradicting it, and no agency can make it.
- **Phase 1, the framing, at a fixed price.** It delivers the architecture, the
  decisions written down, and a walking skeleton that runs from end to end.
- **Phase 2, the build, by the day.**
- **Estimator: size × integrations with other systems.** The integrations
  slider does what test coverage does for the Migration: it teaches the
  Client what really moves the price.
- **Segments:**
  - Critical systems, launching a new service;
  - Partners, which build projects for their own Clients;
  - local businesses running a critical process on a shared spreadsheet (see
    *Consequences*).

**Scaling** (FR *Tenue en charge*) makes a system hold its peak and survive a
failure.

- **It always begins with a load test that reproduces the peak**, before any
  change. This is its rule, as the test safety net is the Takeover's.
- **Phase 1, the load diagnosis, at a fixed price.** It delivers the load test,
  the bottleneck found, and what each fix would buy.
- **Phase 2, the corrections, by the day.** Each correction is measured again
  under the same load test. The Client keeps:
  - the load scenario, in their CI;
  - the system's behaviour under failure (queues, retries, degradation);
  - an incident runbook.
- **Estimator: services × existing observability.** Without metrics, finding a
  bottleneck costs more, which is the second Principle stated as a price.
- **Segments:**
  - Critical systems (the scale-ups of that Segment);
  - Partners.

**A fifth Failure mode on the home page**, treated by Scaling: *the peak that
brings everything down*. Its Client sentence is "« Le jour de l'opération
commerciale, tout tombe. »" (EN "The day of the big campaign, everything goes
down."). A non-technical owner says it as readily as a CTO, so it respects the
rule of ADR 14.

The Build gets no Failure mode on the home page. Like the Audit, it treats
none: the reader who wants something built is not suffering a failure.

**Both pages are bilingual.** Their Segments include Critical systems, which is
remote and reads English (ADR 15).

**Words stay where they belong.** "Distributed systems", "resilience" and "high
availability" are for the technical buyer: they go in the page body and in the
metadata. They never go in a plain line, a Client sentence or the hero (ADR 12).

## Consequences

- **Seven Offers for one person.** The home page lists them as cards, and the
  Offer pages carry most of the weight, as ADR 17 intended: each new page is
  mainly a search entry ("application sur mesure Symfony", "montée en charge").
- **The home page's word cap holds: it was at 1,174 of 1,200 words on the day
  of this note.** A Failure mode and new Achievement material do not fit in
  26 words. The room comes from cutting elsewhere on the page; the cap is not
  raised. ADR 18 set it so that a ceiling nobody checks does not grow back.
- **The local buyer of the Build is not quite the Orphan-app segment.** An owner
  whose process lives on a shared spreadsheet has nothing orphaned yet. The
  Offer serves them under that Segment's population for now. A fourth Segment
  is opened only if real conversations show that they buy for a different
  reason. This is flagged in CONTEXT.md.
- **The Build is opened ahead of its proof, on purpose.** Its page cites the
  on-chain service and the open-data directory, and nothing older. The artist
  sites (2013–2016) are no longer online, so they get no card. Thomas's reason:
  the Offer is there to be built, not justified, and a route nobody can see
  brings no first Client. What it costs: the Build page has the thinnest proof
  in the catalogue until its first Engagement supplies one. The review of
  14 October 2027 checks whether a Build has been sold.
- **The open-data directory was delivered to a Client**, who stays unnamed.
  Its card said "personal project", which was wrong.
- **The Achievement cards state only what the CV states** (ADR 9: the pitch
  master owns the past). The CV carries the load tests, BlazeMeter, Redis,
  incident management and the Kubernetes footprint. It does not carry
  autoscaling, database tuning, backpressure, circuit breakers or post-mortems,
  which were daily work at Socios. The Scaling page may say what the Offer
  does, but a card claims these only once the CV does.
- **"Scale-up" keeps two meanings, and they are kept apart.** In the Critical-
  systems Segment it names a kind of company. The Offer is *Scaling*, never
  "scale-up".
- **The amounts are content, not this decision**, as in ADR 17: efforts in days
  at the day rate, reviewed with the business on 14 October 2027.
