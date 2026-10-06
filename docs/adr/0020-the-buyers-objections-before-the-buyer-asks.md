# 20. The buyer's objections, before the buyer asks them

- Status: accepted, implemented 2026-10-05
- Date: 2026-10-05
- Amends [ADR 9](0009-the-pitch-master-owns-the-copy.md),
  [ADR 14](0014-three-segments-and-the-least-technical-reader.md) and
  [ADR 18](0018-one-day-rate-and-half-the-words.md)

## Context

A second review pass was run on the site as ADR 18 shipped it, from four
angles: copy, search, user research and marketing. It read the 13 built pages
on a phone, their `<head>`, their JSON-LD and the share image. ADR 18's choices
held. What it found was the Client's questions that the page still leaves
unanswered, and two places where the page says something untrue by omission.

**Untrue by omission:**

- **The share image sold the old profile.** `og.png` still said, in English,
  "I design transactional systems that have to stay correct while they stay
  up", over "Backend & architecture". Its own script said the card should say
  what the hero says. LinkedIn is the first channel, and the image is what a
  LinkedIn reader sees before the page.
- **Two "from" prices were the first half of the price.** The Takeover's card
  read "from 2,000 €", its set-up alone: what sells it to an SME is the monthly
  plan from 350 €. The Migration's read "from 2,000 €", its plan alone: the
  execution is billed by the day on top, and a reader who finds six to ten
  weeks of it after the card will feel misled.

**Questions left unanswered:**

- **"And if you leave too?"** The orphan-app Client has just been left by a
  provider, and Thomas is one person. No line on the site answered it.
- **"Am I committed?"** The Watch and Evolution plans said nothing about
  duration or notice.
- **The price was three sections down.** On a phone, an Offer page's first
  screen held neither the price nor the way to it; the Audit's fixed price is
  its argument.
- **Nothing said where to start.** The Offer cards had equal weight, and the
  Entry offer was not marked as one.

**Search:**

- The Service area appeared only at the foot of the Offer pages: in no title,
  no description, nowhere on the home page. The orphan-app Client searches
  "développeur Symfony Nancy".
- The Takeover's title named neither PHP, Symfony nor "TMA", against ADR 18.
  The Reliability title, "Écarts de stock, bugs en prod", matched a search for
  stock software rather than for someone to fix one.
- The Person schema's `jobTitle` was a salaried job title, "Senior Software
  Engineer — backend architecture".
- The Audit's meta description said the price was deducted from the next
  engagement. Only `AUDIT_CREDIT` is.
- The Achievements' H2, "Des réalisations à ouvrir", was an instruction for
  using the page, with no word a reader searches with.

**Copy:**

- Three Achievement titles were vocabulary ("Event Sourcing", "on-chain", "open
  data"). A closed card shows its title and nothing else, and ADR 14 writes the
  page for the least technical reader.
- "Premières missions en préparation" read as "a beginner" to a buyer.
- The third principle, "three honesty levels, never compressed", is about how
  Thomas lists his skills. It is a rule of the CV's grammar, which ADR 11 took
  off the site, and a Client buys nothing on it.
- "L'écrit et l'asynchrone sont mon mode par défaut" reads, to an SME director,
  as "hard to reach". "Full remote" and "CET" told a French reader nothing.
- "…personne ne regardait" blamed the reader for their own bug.

## Decision

**Every amount an Offer charges is on its card.** `fromPrices` returns the
lowest of each amount, headline first, and `fromLine` prints them: "à partir de
2 000 € HT, puis 350 € / mois HT". A Migration's headline says "plan à partir
de". The same line sits under the plain line of each Offer page, and links to
its estimator.

**The Entry offer says it is one.** `ENTRY_OFFER` names it, and its card
carries a "Par où commencer" badge.

**The objections are answered where they arise.**

- The Takeover's FAQ gains "Et si vous partez à votre tour ?" and "La formule
  est-elle avec engagement ?". The plans are **monthly, with no commitment and
  a month's notice on either side**: a Client just left by a provider will not
  sign for a year, and the paid set-up already filters out the unserious.
  The Takeover therefore has four questions, against ADR 18's two; it stays
  under its 400 words.
- The third principle becomes **"Ce que je laisse derrière moi vous
  appartient"**: the code, the access, the tests and the written decisions,
  so that another developer can carry on. Its cost: time spent writing,
  billed like the rest.

**The honesty rule is applied rather than stated.** ADR 9 named it
load-bearing, and it still is: no list on the site merges production work with
personal projects. With no skills list left to apply it to, it holds on the
Achievements, whose byline says what the work was: "Pour un client" (the
open-data tool, per [ADR 19](0019-building-new-and-holding-the-load.md)) or
"bénévolat". The test moves there.

**The share image says what the hero says,** in French: the name, the
promise, "Freelance PHP/Symfony". The English pages share it, and their
`og:image:alt` says it is in French.

**The Service area is searchable.** The home title becomes "Thomas Bouzy —
Freelance PHP/Symfony, Nancy et Strasbourg", still without a job title (ADR 14).
The description names the area. The home page's contact line lists the towns
from `SITE.serviceArea`, as the Offer pages do, and keeps the 8 years of remote
work.

**Titles and schema:**

| Where | Before | After |
| --- | --- | --- |
| Takeover title | Maintenance d'application métier : reprise, prix publics | TMA PHP/Symfony : reprise et maintenance d'application métier |
| Reliability title | Écarts de stock, bugs en prod : fiabiliser l'application | Fiabiliser une application PHP/Symfony : écarts, bugs en prod |
| Achievements H2 | Des réalisations à ouvrir | Ce que j'ai déjà tenu en production |
| `jobTitle` | Ingénieur logiciel senior — architecture backend | Développeur freelance PHP/Symfony |

**Achievement titles say the outcome:** "Tracer l'argent de 1,5 million
d'utilisateurs", "Déplacer de l'argent réel, sans droit à
l'erreur", "Reconstituer en 40 secondes un annuaire fait à la main". The
vocabulary stays in the card body, where `knowsAbout` finds it.

**The availability line names a year:** "Je prépare mon calendrier 2027 —
parlons-en dès maintenant". ADR 11 removed
dates so that nothing could rot. This one can, so the test compares it with the
clock again, and the first build of 2028 fails until it is rewritten.

**The numbered kickers no longer break on a phone.** The number keeps its
width (`flex: none`), and "Ce que vous recevez, dans l'ordre" loses its last
three words.

## Consequences

- The industrial ERP card, the only proof the orphan-app Segment has, carried
  no fact and a result that talked about the site. Thomas supplied the fact:
  the ERP ran the whole chain in several ArcelorMittal plants in France. The
  title and the result now say so, and a test keeps the name on the card.
- The English copy follows the French, as ADR 18 requires. The English title
  keeps "backend consultant" and no town: its reader is remote.
- The sitemap's `lastmod` is still the build time on every page, which search
  engines learn to ignore. It is left as it is: not a decision this pass needed.
