# 18. One day rate, smaller first tickets, and half the words

- Status: accepted, implemented 2026-10-05
- Date: 2026-10-05
- Amends [ADR 14](0014-three-segments-and-the-least-technical-reader.md) and
  [ADR 17](0017-offer-pages-public-prices-and-the-estimator.md)

## Context

Two reviews were run on the site as ADR 17 shipped it: a pricing review,
benchmarked against the market, and a copy review, checked against an SEO
review. The reviews themselves are not in the repository.

**The prices.** Thomas's reading was that they were too high for the local
Segment. The review agreed on the first amounts a business owner has to pay,
not on the rate:

- A Takeover asked 3,500 to 10,000 € of set-up before its first month.
- The full Audit was priced below the day rate on its larger tiers.
- The Entry offer was described as "fixed-price" but published as six ranges.
- The 600–750 € rate had two further problems:
  - a range is read from its low end;
  - a Partner who must take a margin cannot resell 750 € outside Paris.
- "Two Clients at a time, never more" made a Watch plan, at a few hundred euros
  a month, occupy a whole place.

Thomas set the rate himself. Rates in France follow the nearest big city. His
is Nancy or Strasbourg, not Paris: above the regional generalists (about
420–530 €), below Paris.

**The copy.** The site had 6,224 words of French; the home page alone had
2,882, about thirteen minutes of reading. The home page's first reader is a
business owner on a phone, arriving from LinkedIn or a referral, who gives it
thirty seconds. The problems found:

- **Peer talk under the hero.** The paragraphs under the hero argued with a
  fintech peer.
- **Too much in the Achievement panels.** They were 45 % of the page.
- **No booking link on the home page.** It was the one page without one.
- **Rules said more than once.** The Takeover's test safety net was stated
  four times.
- **Concepts back under the H1.** ADR 14 had moved them to the Offer pages, and
  under the Entry offer's H1 they recreated the vocabulary grid it had removed
  from the home page.

The SEO review found two more defects:

- **PHP and Symfony absent from what search reads.** The word "PHP" appeared
  nowhere on the site. "Symfony" was in no title, no H1 and on no Offer page.
- **Dead-end Offer pages.** They linked to no other Offer.

## Decision

**One day rate: 550 € excluding VAT, for a Client and a Partner alike, at most
four days a week for anyone.** `DAY_RATE` becomes a number, not a range.
`MAX_DAYS_PER_WEEK` replaces the capacity rule, which leaves the site. The
Reinforcement slider stops at four days.

**Every fixed price is an effort in days at that rate**, with two exceptions:

- the express Audit, a single fixed fee (`AUDIT_EXPRESS_FEE`) whatever the
  size, bounded in time rather than in scope;
- the Watch plans, which are priced on the market for keeping an application
  healthy.

Other changes to the amounts:

- **The Audit's credit is capped at the express fee** (`AUDIT_CREDIT`).
  Uncapped, a full Audit would wipe out the set-up it is meant to lead to.
- **A Watch set-up is lighter than an Evolution set-up.** It puts a smoke-test
  net on the critical paths. The Evolution set-up puts the full net under the
  application, because the application will change.
- **An Evolution plan says what it contains.** It is the Watch plan plus 2 to 3
  days of change a month (`EVOLUTION_DAYS`), at the day rate.
- **Watch incidents are capped** at half a day a month.

**Prose never quotes a price.** A sentence that needs one names it, for example
`{credit}` or `{dayRate}`. `src/lib/price-tokens.ts` fills it in from
`prices.ts` at build time. A test fails when an amount is typed into an Offer
page's prose, and when prose names a price the table cannot answer.

**The copy is cut by half and held there.** A test caps the prose each page
renders: 1,200 words for the home page, 400 for an Offer page, 220 for the
Partners page. ADR 6 says of bytes that a ceiling nobody checks grows back, and
the same holds for words.

The Offer page now reads, in order:

1. the catalogue name as kicker, with an H1 of its own (`heading`) that carries
   the words a buyer searches with; then the plain line;
2. the Client sentences;
3. what is delivered, numbered in the order the Client receives it (the steps
   section is merged into it);
4. the price, under a heading of its own (`priceHeading`), with the rules;
5. "not the right choice when", whose lines link to the Offer they name;
6. the Achievements;
7. two FAQ questions;
8. the booking link.

The Concepts, "a good choice when" and the steps leave the content contract.

On the home page:

- **The H1 holds the name, then the promise** (`hero.title`).
- **The problem paragraphs and the Offers intro go.** The Failure modes speak
  for themselves.
- **The Achievement cards keep two facets** (Approach and Result). The
  Context facet goes, and the industrial ERP opens first.
- **Three Principles instead of five.**
- **Contact starts with the booking link.**
- **The footer links to every Offer**, from every page.

**The Client sentences are presented as sentences the reader might say, never
as testimonials.** None has been heard from a real Client. "Ce que vous en
dites" becomes "Vous reconnaissez-vous ici ?", and the home page asks "Vous
reconnaissez l'une de ces phrases ?".

**Search reads PHP and Symfony.** Titles and meta descriptions name the
technologies and the searched terms; "TMA", "sous-traitance" and "ESN" appear
there as the reader's words (see CONTEXT.md). Brand suffixes leave the Offer
pages' titles. `robots.txt` stops disallowing crawlers: a crawler that may not
fetch a page never reads its `noindex`. Railway's generated hostname redirects
to the domain.

## Consequences

- **The amounts are reviewed with the business on 14 October 2027**, on what
  the first months measure: how often an express Audit leads to an Engagement,
  and how many days a Watch plan actually takes.
- **Prices are shown excluding VAT**, which stays true whatever the VAT regime.
- **The English copy is derived from the French, never written alongside it.**
  The French is the source of truth.
- **Two reviews are deferred to their own issues:**
  - the structured data the SEO review targets (`@graph`, `Service.offers`
    read from `prices.ts`, `areaServed` per Offer, `WebSite` and
    `BreadcrumbList`);
  - an Open Graph image per Offer.
