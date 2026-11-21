# 30. Offers by situation, the whole budget, and Offer pages an owner reads

- Status: accepted, implemented 2026-11-21
- Date: 2026-11-21
- Amends [ADR 17](0017-offer-pages-public-prices-and-the-estimator.md),
  [ADR 18](0018-one-day-rate-and-half-the-words.md),
  [ADR 19](0019-building-new-and-holding-the-load.md),
  [ADR 20](0020-the-buyers-objections-before-the-buyer-asks.md) and
  [ADR 23](0023-motion-that-answers.md); answers part of what
  [ADR 28](0028-proof-on-the-first-screen-and-the-workshops-format.md) left open

## Context

The marketing audit of 2026-11-19, read with three simulated business owners
([ADR 28](0028-proof-on-the-first-screen-and-the-workshops-format.md)), found
this on the Offers and their prices:

- the home page laid the seven Offers out as the life of an application: three
  "at any time", then Build, Reliability and Migration, then Scaling. None of
  the three owners read that timeline. `offers.ts` already sold three of the
  seven (Migration, Scaling, Reinforcement) to no orphan application, and the
  Reinforcement page itself sent an owner without a technical team to the
  Takeover;
- on an Offer sold in two phases, the card's "première étape à partir de" was
  12 to 33 % of what the reader would pay, by the rule the Build's own FAQ
  taught: the first phase, then the estimator's weeks at four days a week. ADR
  20 had foreseen the reader who finds weeks of execution after the card and
  feels misled; all three owners did;
- the estimators opened on the cheapest case ("Couverture de tests : Bonne"),
  their technical criteria had no help, and the Audit's size slider moved
  nothing on an express Audit;
- on the Offer pages, the section titles were 12px grey capitals, smaller than
  the text under them; the card prices 14px and grey; the first booking button
  3.2 screens below the price on a desktop and 4.9 on a phone (Takeover); and no
  name or face near it;
- jargon where an owner reads: Reliability's H1 ("flux traçables"), its Client
  sentence ("recrédité… réconciliation") and two deliverables; seven technical
  terms in the 31 words of Scaling's fourth deliverable; "application métier"
  where an owner says « notre logiciel »; "sur mesure" outside the Offer's
  name in the Build's H1, price title and description; and proof that proved
  something else (the Migration by an onboarding in a day, the Audit by an API
  rebuilt);
- the Takeover said nothing of response time, holidays, or code left on a server
  by a provider who has gone, and stated its test safety net four times;
- La Cartonnerie, on the public-sector page, was « accompagné », a word the
  voice never uses.

Thomas ruled on D4, D5 and D12 on 2026-11-20, as the report recommended, and on
2026-11-21 gave the facts the Takeover and the Build waited on.

## Decision

**D4 B: the Offers grouped by situation, all seven pages kept.** The H2 reads
« Une offre par situation, chacune avec son prix. », then three questions the
reader answers for themselves (`SITUATIONS` in offers.ts):

- « Votre logiciel vous pose problème »: the Audit, still badged « Par où
  commencer », the Takeover and Reliability;
- « Il vous manque un outil »: the Build, under the sentence of the owner it is
  for, « Toute notre activité tient sur un fichier Excel. ». The hero's promise
  of tools has its door;
- « Vous avez une équipe technique ? »: Migration, Scaling and Reinforcement,
  then the Partners.

The groups follow the Segments: the last sells to no orphan application, every
other does, and a test holds both. The timeline, which no ADR recorded, goes
with its track. No page is merged or renamed: a name costs its URL, its tests
and its search words, and nothing needs redirecting if a first-click test
contradicts the grouping.

Every card ends on « Voir l'offre et le prix », its arrow drawn at rest: the
whole card was the link, with nothing to say so on a phone, and the arrow came
in only under a pointer. The name stays the card's one link. The card lines
speak to the reader in the first person; the Audit's says what justifies its
price, its independence: « Un avis écrit, sans refonte à vendre ».

**D5 C: the prices stay public, and the whole budget is shown.**

- A two-phase Offer's card names its first step: « cadrage dès 1 650 € HT »,
  « plan dès 2 000 € HT », « diagnostic dès 2 200 € HT ». The step is the
  Offer's `phase`; the amount is still read from prices.ts.
- Under the Migration's, Scaling's and the Build's estimators, « Budget total, au
  plus »: the first phase, then the weeks at the day rate, four days a week at
  most (`totalOf`, `total: 'phases'`). D5 covers every Offer sold in two phases,
  the Build included: its written ceiling is the one D5 names. Under the
  Takeover's, « Première année »: the set-up, then twelve months of the plan
  (`total: 'firstYear'`). The static table carries the same column, so a reader
  without JavaScript keeps it.
- The first phase ends on a written ceiling for the second: « Vous décidez de
  la seconde, plan et plafond écrit en main. »
- Against the total: it compares badly with an agency's "from". Kept anyway,
  because the measure is the qualified call, and a visitor the total sends away
  would not have signed.

**D12: one day rate, 550 € excluding VAT, for everyone.** `DAY_RATE` already
says so, and nothing else changes. The Reinforcement does not rise to signal a
lead: the price-quality effect is weak for services.

**The estimators** (amends [ADR 17](0017-offer-pages-public-prices-and-the-estimator.md)):

- a line of help under a criterion the reader may not know how to answer, test
  coverage and existing monitoring, each ending « Vous ne savez pas ? Choisissez
  « Aucune » : c'est l'estimation haute. »;
- such a criterion opens on its median case, « Partielle » (`Dimension.default`);
- a slider that moves no figure, given the others, steps aside: the size of an
  express Audit. The rule is read from the table the page already carries, so no
  Offer has code of its own.

**The Offer page** (amends [ADR 18](0018-one-day-rate-and-half-the-words.md)):

- section titles at 24px in normal case, their number still in the eyebrow's
  mono and accent; the Partners and public-sector pages share them;
- the card price at 17px, in ink;
- « Réserver un appel » right under the price block, through `CONTACT.booking`;
- in « Premier pas », a 64px portrait and « C'est moi qui décroche : Thomas
  Bouzy, ingénieur logiciel dans le Grand Est. », on the Partners and
  public-sector pages too, not on the About page, which opens on the portrait;
- « Ce qui le prouve » says what each Achievement proves for this Offer
  (`OfferPage.proof`), one Achievement per line, never two merged: the Migration
  by software with no tests upgraded two major versions, Scaling by its load
  figures, the Takeover by software for large accounts taken over without
  stopping it, Reinforcement by four junior developers mentored. The Audit is
  proven by the audit of someone else's code alone.

**Words an owner reads:**

- Reliability: « Savoir d'où vient chaque écart, au lieu de le deviner », « On a
  facturé deux fois le même client et personne ne l'a vu. », and its second and
  third deliverables in plain words. Double execution keeps its FAQ question.
- Scaling: its fourth deliverable in plain words. Its technical terms move,
  verbatim, to a FAQ question for a technical team, where
  [ADR 19](0019-building-new-and-holding-the-load.md) puts them.
- Build: « Création sur mesure : l'outil métier qui vous manque », « Combien
  coûte un outil métier neuf ? », and a description where "sur mesure" is only
  the Offer's name.
- « logiciel métier » for « application métier » in the Takeover's and the
  Build's prose. The Takeover's estimator keeps « Une application métier »,
  words the audit found an owner reads as meant; the meta keep their search
  words until the titles are written for search; the home page's problem title
  is Thomas's own ([ADR 27](0027-software-engineer-and-the-workshops-as-the-way-in.md)),
  and is put to him rather than changed.
- The test of the words the voice never uses now reads every French page.

**The Takeover answers an owner a provider has left**, with Thomas's facts:

- « Et quand ça plante ? »: a reply within 48 working hours, a blocking incident
  first, no on-call at night or at weekends;
- « Et pendant vos congés ? »: a month's notice, and the urgent updates made
  before he leaves;
- the code of a provider who has gone is looked for on the server and in the
  backups;
- three rules instead of five: what each plan's tests cover, what goes beyond
  the plan, and the Audit's credit. The test safety net is said once, by the
  first deliverable. The page stays under its 400 words.

**The Migration sends an application that can stop for a weekend to the
Takeover**, whose upgrade costs less there: Thomas confirmed it is his practice.

**The Build says it works around an ERP or software bought off the shelf**,
whose code the Client does not have: exports, links, automation.

**A new Achievement, Thomas's own work at Socios.com:** an application the
company bought, migrated into its ecosystem. It proves the Takeover. It is not
among the Socios Reference's Achievements on the home page, and carries no
Approach or Result until Thomas describes them: both became optional, and a
test keeps an Achievement without them off the References, where they are read.

**The Partners page speaks to a Referrer**, who buys nothing: « Cabinet
comptable, intégrateur ? Si l'un de vos clients a un logiciel qui coince, je
fais avec lui un premier point gratuit. »

**La Cartonnerie** reads « j'étais aux côtés du responsable artistique face au
prestataire », in three sentences. No year or nature is added: both are still
unknown. The civic projects' byline reads « Projets citoyens », like their
Reference (ADR 28), and the API redesign's title says what it was to a reader:
« Refaire un produit en service sans que ses utilisateurs s'en aperçoivent ».

## Consequences

- The Offers section lost its motion: the journey's track drew itself as it
  scrolled into view ([ADR 23](0023-motion-that-answers.md)). The cards still
  lift and answer the pointer. The Client sentences' entrance (ADR 28) can carry
  over to the cards if Thomas wants the section to move again.
- The home page is at 1,373 words of its 1,400, the Scaling page at 399 of 400,
  the Build's at 393 and the Takeover's at 382. The CSS lost the journey: 32.7 kB
  of its 35 kB.
- An Offer's plain line may name a price token, `{maxDays}`; RESUME fills it in,
  so the card, the page, the share card and the structured data agree.
- The copy runs ahead of the pitch master again
  ([ADR 9](0009-the-pitch-master-owns-the-copy.md)): the acquired application,
  the response time and holidays, work around an ERP. Thomas backports them.
- Still open, waiting on facts only Thomas has: whether a Build replaces an
  Access, WinDev or spreadsheet tool (the Takeover's FAQ keeps « Pas de WinDev ni
  d'Access. »); La Cartonnerie's year and nature; the acquired application's
  period, approach and result. E-invoicing gets no FAQ: Thomas ruled it out.
- Reliability's H1 and its plain line both say « d'où vient » now, one above the
  other: one of them is Thomas's to tune.
