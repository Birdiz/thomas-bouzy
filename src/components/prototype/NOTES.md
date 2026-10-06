# PROTOTYPE: how does each audience find its Offers? (2026-10-06)

Throwaway, branch `prototype/segment-entry`. Never merged. Run `npm run dev`, then:

- `/?variant=0|A|B|C`: the home page's Offers section; ← → or the yellow bar cycle.
  `0` is today's line, `A` the "Vous êtes…" strip, `B` an in-place filter, `C` a
  static Offer × audience matrix.
- `/prototype/systemes-critiques/`: the Critical-systems landing page the strip
  sends to. Provisional copy, not checked against the pitch master.

The production build emits neither (`import.meta.env.DEV` gates both).

## Measured (scroll from the top of the home page to the variant)

| Variant | Desktop 1024×768 | Mobile 375×812 | Needs JS | What the reader gets |
| --- | --- | --- | --- | --- |
| 0 today | 3.0 screens | 4.3 screens | no | Partners and public sector only |
| A strip | 3.0 screens, then 1 click | 4.3 screens (strip is 1 screen tall), then 1 click | no | a door per audience, a page in its own words |
| B filter | 1.8 screens | 2.0 screens | yes | dims 1 card of 7 for Critical systems and Partners |
| C matrix | 3.0 screens | 4.3 screens, table 635 px in 335 px | no | a reference table, unreadable on a phone |

Critical-systems landing page: its Offers start at 664 px on a phone, inside the first screen.

Offers per audience, from `offers.ts`: Critical systems 6/7, Partners 6/7,
Orphan app 4/7, Public sector 4/7, shared-spreadsheet buyer 2/7 (prototype guess).

## Verdict

Filtering by Offer barely sorts the two audiences that need it most: 6 of 7
Offers are already theirs. What they lack is a page that speaks to them, since
the home page is written for the least technical reader on purpose (ADR 14).
Keep A plus one landing page per Segment; drop B (a second axis on the cards,
JS for little discrimination) and C (fails on mobile). C's real value was
internal: it makes `OFFERS[*].segments` reviewable at a glance.

Not prototyped, and likely the larger lever, since most visitors land on an
Offer page: a "Pour qui" line on each Offer page, read from `OFFERS[id].segments`,
linking to the Segment pages.
