# 33. A sheet beside the Offers, on the Partners and public-sector pages

- Status: accepted, implemented 2026-11-22
- Date: 2026-11-22
- Extends [ADR 32](0032-the-sentences-are-read-and-each-offer-is-drawn.md)

## Context

The Partners and public-sector pages were three grids of identical cards, one
under the other: the points, the proof or the day rate, then the Offers. Every
card weighed the same, so nothing on either page stood out. The fact that
decides was the quietest one: the day rate an agency asks first was a grey line
under the cards, and the figures of the public proof were inside its sentences.
The Partners' six Offers filled four columns and left two cards alone on a
second row, without the drawings the home page had just given them (ADR 32).
The Referrers' line, meant for a third reader, was set in a box larger than
anything on the page but the title.

The owner asked for both pages to be challenged. Two layouts per page were
drawn in Claude Design on 2026-11-22: A, the single column kept, the day rate in
a band, the points without frames, the Offers as drawn rows in two columns; B,
the Offers as the home page's rows, beside a sheet of what decides. He chose B.

## Decision

**A sheet beside the Offers.** On a wide screen the page splits under its head:
the Offers on the left, and on the right a sheet that stays in view while they
scroll (`OfferSheet`): the points, each ticked, then « Réserver un appel » and
the address. On the Partners page the sheet opens on the day rate, its figure
set large, in the same sentence as before. On a phone the sheet comes right
under the head, before the Offers: it is first in the markup. The points are no
longer a grid of their own.

**The Offers are the home page's rows** (`OfferRow`, which the home page now
renders too): the drawing, the name as the link over the whole row, the plain
line and « Voir l'offre → ». The same row wherever an Offer is listed.

**The public sector's Offers come before its proof.** The proof answers "can
he?" once the reader knows what they would order. Each proof sets the figure
its own sentence holds large beside it (`PublicSectorPage.proof.items[].figure`):
31 273, 3 langues, 1 000+. The figure repeats the text and is hidden from a
screen reader, which reads it in the sentence.

**The Referrers' line is quiet**: under a rule, under the Partners' Offers, at
the size of the home page's lines to its other readers. It is still addressed
apart (ADR 30).

No copy changed, apart from the three figures.

## Consequences

- Measured on the dev server, the page's main element: on a 375 px phone the
  Partners page is 2,988 px (was 3,119) and the public-sector page 3,425 px (was
  3,569); at 1,440 px they are 2,144 px (was 2,028) and 2,275 px (was 2,057).
  One row per Offer is taller than a grid of four, so a wide screen got longer;
  what it lost is the cards' equal weight, and the call is never out of view.
- « Réserver un appel » appears three times on each page: the header, the sheet
  and « Premier pas ». The sheet's is the one beside the Offers.
- The shared stylesheet grows from 34.4 to 35.9 kB, over the 35 kB budget;
  the limit moves to 36 kB (`tests/e2e/budget.spec.ts`). The pages reuse the
  home page's row and classes, and a dead rule left, before the limit moved.
- The day rate's class changed (`.offer__rate` on the Partners page;
  Reinforcement keeps `.offer__day-rate`).
