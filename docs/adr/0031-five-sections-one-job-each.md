# 31. Five sections, one job each

- Status: accepted, implemented 2026-11-21
- Date: 2026-11-21
- Amends [ADR 12](0012-the-clients-sentence-first.md),
  [ADR 14](0014-three-segments-and-the-least-technical-reader.md),
  [ADR 18](0018-one-day-rate-and-half-the-words.md),
  [ADR 27](0027-software-engineer-and-the-workshops-as-the-way-in.md),
  [ADR 28](0028-proof-on-the-first-screen-and-the-workshops-format.md) and
  [ADR 30](0030-offers-by-situation-and-the-whole-budget.md)

## Context

After ADR 30 the home page was 6.5 screens on a desktop and 10.6 on a phone,
about 930 words rendered, in seven sections: hero, Workshops, problem, the
Audit band, Offers, References, Contact. The owner found it gave too much at
once. Three separate reviews of the same screenshots (information
architecture, visual hierarchy, conversion) found the same cause: the page did
the same job several times.

- **Three "start here"s.** The hero says *je commence par un atelier*; three
  screens down the band said *commencez par un audit*; the Offers then closed
  on a box asking *vous savez déjà ce qu'il vous faut ?*. The Audit card's own
  badge, *par où commencer*, already did the band's job.
- **One choice asked twice.** The five Client sentences each linked to an
  Offer, then the three situations led to the same Offers again: two
  sections, about two screens on a phone, for one decision.
- **Five "book a call" buttons**, with a sixth in the sticky header. None
  stood out.
- **Everything at the same weight.** Seven identical Offer cards under four
  levels of heading; seven References of the same height, a product of his
  own level with ArcelorMittal; three Workshop cards, one of them a single
  line.

## Decision

The home page reads **hero → Workshops → Offers by situation → References →
Contact**: five sections, one job each.

1. **The Client sentences open the situations.** The problem section goes.
   Each sentence moves to the situation of the Offer it links to: three under
   *your software gives you trouble*, the spreadsheet under *a tool is
   missing*, two under *you have a technical team*. They stay links to their
   Offer, keep their entrance on scroll (ADR 28's exception to ADR 23), and
   are still read under one question, now under the section's title, so they
   are never taken for testimonials. The promise ADR 27 moved into the problem
   section becomes the lead of the first situation, the one it sells to.
2. **The Audit band goes**, and so does the *vous savez déjà* box. The Entry
   offer is the first card of the first situation, the only one drawn as a
   card, with its badge. The other six Offers are rows under a rule: name,
   plain line, price, and the line that says the row opens (ADR 30).  The
   Partners stay under the technical team's Offers, the public sector under
   the situations.
3. **Three booking buttons**: the header, the hero, Contact. The Workshops
   lose theirs; the hero's books the same call right above it. Their levels
   become a track, 01 → 02 → 03, since an owner takes them in order.
4. **Four References shown, three folded** behind *voir les 3 autres*: the
   three engagements and the one audit of someone else's code, the Entry
   offer's proof (ADR 30). Nothing leaves the page.
5. **"Who picks up" keeps one paragraph** and its link to the About page,
   which says the rest at length.
6. **The home page's word ceiling comes down from 1,400 to 1,320**, its count
   after the cut (the count includes the folded Achievements). A ceiling left
   where it was invites the words back.

Kept on purpose: the proof under the hero's buttons (ADR 28), a "from" price
on every Offer (ADR 17, ADR 30), the five Client sentences and their links
(ADR 12), the Partners link (ADR 14), the Service area in Contact (ADR 20),
the Workshops' place and format until the review ADR 28 set for them.

## Consequences

- Measured on the built page: 5.3 screens on a desktop (was 6.5), 8.7 on a
  phone (was 10.6); 15 links in the Offers, where the problem, the band and
  the Offers had 16 between them, and one section fewer to cross to reach
  them.
- ADR 12's "a fixed list under a question" holds, split across three
  situations; ADR 14's Audit "under the sentences" is now its card at the head
  of the first situation.
- The phone is still long. What is left is layout, not content: room between
  sections, the situations folded on a phone, a lighter hero and header. It
  waits on a separate change.
- The visit count (ADR 29) counts pages, not buttons, and started on
  2026-11-20: it cannot tell whether this cost anything. The check is
  qualitative: technical and Partner calls must keep coming, and a first-click
  test with a few owners, old page against new, would say more than the count.
