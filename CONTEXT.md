# Thomas Bouzy — freelance site

A bilingual showcase that sells Thomas's interventions to the people who could
commission them, and leaves the salaried route to one line pointing at LinkedIn.
Each term is given in English and French: the site speaks both.

## Readers

**Client** (FR *Client*):
A person or organisation who could buy an Offer, whether or not they ever have.
_Avoid_: buyer, prospect, customer

**Recruiter** (FR *Recruteur*):
A person reading for a salaried post. The page addresses them once, with a line
pointing to LinkedIn.
_Avoid_: hiring manager, employer

**Reader** (FR *Lecteur*):
Anyone on the page, when both Client and Recruiter are meant.

**Partner** (FR *Partenaire*):
An agency or IT services firm that brings Thomas into an Engagement for its own
client. It buys from him but is not the end Client.
_Avoid_: reseller, subcontractor, ESN (as a term)

**Referrer** (FR *Prescripteur*):
Someone who sees a Client's problem first and recommends Thomas, without buying
anything: an accountant, an ERP integrator, a former colleague.
_Avoid_: partner (a Partner buys), ambassador, affiliate

**Segment** (FR *Segment*):
A population of Clients who buy for the same reason. Segments are defined by
what breaks for the Client, not by the Client's sector.
_Avoid_: market, target, vertical

**Critical-systems segment** (FR *Systèmes critiques*):
Software publishers and scale-ups whose system moves money or commitments, so
that an error costs real money. Usually remote, usually a technical buyer.
_Avoid_: fintech (that is an Achievement's sector, not the Segment)

**Orphan-app segment** (FR *Appli métier orpheline*):
Local SMEs and manufacturers running an in-house business application that nobody
left in the company dares to touch. Usually a non-technical buyer.
_Avoid_: PME segment, industrial segment (they are one Segment)

**Service area** (FR *Zone d'intervention*):
The towns Thomas will travel to for in-person work. It is published; where he
lives is not.
_Avoid_: location, region, address

## What is sold

**Offer** (FR *Offre*):
A packaged intervention published on the site, with a scope and a format.
_Avoid_: prestation, service, package

**Entry offer** (FR *Offre d'entrée*):
The one small, fixed-price Offer that every Segment can buy first: an audit
delivered as a written report and an action plan.
_Avoid_: discovery, free consultation, starter pack

**Audit** (FR *Audit*):
The Entry offer: a written report, a risk register and an action plan. Its
pre-acquisition variant is the **Due diligence** (FR *Due diligence technique*),
written for someone who is not the team.
_Avoid_: review, diagnostic, health check

**Takeover** (FR *Reprise et maintenance*):
Taking charge of an orphan application: map it, put a test safety net under it
before changing anything, then maintain it on a monthly plan.
_Avoid_: TMA, support, rescue

**Maintenance plan** (FR *Formule*):
The monthly half of a Takeover, at one of two levels: **Watch** (FR *Veille*),
for updates and supervision, or **Evolution** (FR *Évolution*), which adds days of
change each month.
_Avoid_: retainer, subscription, SLA

**Migration** (FR *Migration sans interruption*):
Moving a running system to a new version or a new API contract without stopping
it. It is sold in two phases: a fixed-price plan, then execution alongside the
Client's team.
_Avoid_: upgrade, rewrite, refactoring

**Reliability** (FR *Fiabilisation*):
Making a system observable and its flows traceable, so that a balance, a batch or
a defect can be explained instead of guessed.
_Avoid_: observability (that is one means), monitoring, quality

**Reinforcement** (FR *Renfort senior*):
Thomas as a part-time lead or architect inside the Client's team, billed by the day,
at most four days a week.
_Avoid_: staff augmentation, fractional CTO, régie (as a term)

**Day rate** (FR *Taux journalier*):
The one price of a day of Thomas's work, the same for a Client and for a Partner.
_Avoid_: TJM (as a term), partner rate

**Engagement** (FR *Mission*):
One Offer sold to one Client: the instance, not the catalogue entry.
_Avoid_: contract, gig, prestation; *engagement* in French

## What the page argues with

**Failure mode** (FR *Mode de défaillance*):
One way a system of the interesting kind goes wrong, named in Thomas's words.
_Avoid_: trigger, pain point, problem

**Client sentence** (FR *Phrase client*):
How a Client would say a Failure mode out loud, in quotes. Written by Thomas, not
heard from a real Client: the page offers it for the reader to recognise, and never
attributes it to anyone.
_Avoid_: quote, label, testimonial

**Achievement** (FR *Réalisation*):
Past work Thomas actually did, shown as proof of a capability. It is never itself for sale.
_Avoid_: project, subject, case study, reference

**Principle** (FR *Principe*):
A position Thomas holds, stated together with what holding it costs.
_Avoid_: value, belief, approach

## Relationships

- A **Failure mode** has exactly one **Client sentence**.
- A **Failure mode** is *treated by* exactly one **Offer**; an Offer may treat several,
  or none (the **Audit** treats none: it is for the Client who cannot yet name theirs).
- An **Achievement** proves a capability; an **Offer** sells it.
- An **Engagement** is an instance of one **Offer** for one **Client**.
- Every **Segment** can buy the **Entry offer**; the other Offers are not all for every Segment.
- An **Audit** credits a fixed amount, the express Audit's fee, against the
  **Engagement** that follows it.
- A **Takeover** always begins with the test safety net, before any change.
- An **Engagement** may come through a **Partner**, in which case the Partner is
  the one who pays and the Client is the one being served.

## Flagged ambiguities

- "Engagement" in ADR 11 meant what is sold in general. It now means only the
  instance; the catalogue entry is an **Offer**.
- "Triggers" in ADR 12 were the Failure modes seen as funnel entry points. That is
  a relationship (*treated by*), not a term of its own.
- The `Project` type and the "Six sujets à ouvrir" heading both named what is now an
  **Achievement**. Resolved: the contract says `Achievement`, and the heading
  carries no count.
- The **Concept** was a named capability on an Offer page. ADR 18 took Concepts off
  the site; the term is retired.
- The glossary governs the site's voice. Metadata and an FAQ question may quote the
  words a reader types instead, as a Client sentence quotes the words a Client says:
  "TMA" in one Takeover question, "sous-traitance" and "ESN" in the Partners page's
  title and description.
