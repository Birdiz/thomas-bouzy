# 32. The sentences are read, and each Offer is drawn

- Status: accepted, implemented 2026-11-21
- Date: 2026-11-21
- Amends [ADR 12](0012-the-clients-sentence-first.md),
  [ADR 28](0028-proof-on-the-first-screen-and-the-workshops-format.md) and
  [ADR 31](0031-five-sections-one-job-each.md)

## Context

ADR 31 moved the Client sentences to the head of the situations, still links
to their Offer. On a wide screen that put each sentence on the left and the
Offer it linked to on the right of the same row: two links to one page side by
side, the second the only one with a price. The sentences were set at 19 to 23
px, the size of a heading, each with a rule under it and its Offer's name
repeated as a third line, so the left column outweighed the Offers it was meant
to lead to. And the seven Offers, rows of the same weight, could not be told
apart before their names were read.

The owner asked for the section to be challenged. Two layouts were drawn in
Claude Design on 2026-11-21: A, each sentence moved into its Offer's card, the
cards in a grid of three; B, the layout kept, the sentences no longer links and
set small, and each row opening on a drawing. He chose B. A had a risk of its
own: a quoted sentence inside a card, with no name, reads as a testimonial,
which ADR 12 and ADR 28 exist to prevent.

## Decision

**The Client sentences are read, not clicked.** Each stays at the head of the
situation of the Offer that treats it, under the section's question, in body
size (16px), a step brighter than the lead, without rules or the Offer's name
under it. Its Offer's row, the one link to that page, is beside it. The Offers
section holds nine links: one per Offer, the Partners and the public sector
(ADR 31 measured fifteen). The entrance on scroll (ADR 28) is kept.

**Each Offer is drawn.** A line drawing on a 160 × 100 grid opens every row,
112 × 70 px, on a ground a step up from the page: in the cover's slate, with one
stroke of sandstone on what the Offer sells (`src/art/offers.ts`). The Audit's
costly line under the lens; the loop that keeps a taken-over application
running; the gap Reliability finds between two counts; the spreadsheet the Build
turns into a tool; the line a Migration never breaks while it climbs; the peak
Scaling holds under its ceiling; the senior who joins a team. Inline SVG, no
request, decorative (`aria-hidden`): the name and the plain line say it in
words. On a phone the drawing sits beside the name only, at 72 × 45, and the
line and price take the whole width.

**The rows take the wider column** on a wide screen (0.8 / 1.2, was 0.9 / 1.1),
since each now opens on its drawing.

No copy changed.

## Consequences

- Measured on the dev server with every sentence shown: the section is 2,605 px
  on a 375 px phone (was 2,821), and 1,730 px at 1,440 px (was 1,702). On a
  wide screen the Offers' column sets the height, and the drawings narrowed it;
  what the section lost there is weight, not height.
- ADR 12's consequence, "each [sentence] links to the offer that treats it",
  and ADR 31's "they stay links to their Offer" no longer hold. A sentence still
  names its Offer in the content (`FailureMode.offer`), which places it in its
  situation.
- The home page's word count drops by the Offer names that followed the
  sentences.
- The drawings are the site's first pictures of what it sells. Offer pages and
  the share card could use them; that waits on the owner.
