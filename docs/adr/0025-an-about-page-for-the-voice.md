# 25. An About page for the voice

- Status: accepted, implemented 2026-11-18; teaching line amended by
  [ADR 26](0026-software-engineer-and-the-workshops-as-the-way-in.md), 2026-11-19
- Date: 2026-11-18
- Follows [ADR 24](0024-the-site-says-tu.md)

## Context

ADR 24 gave the site Thomas's voice, but the home page had three words left
under its 1,200-word ceiling ([ADR 18](0018-one-day-rate-and-half-the-words.md)).
Its About block ended up as two tight paragraphs. The longer version the voice
asks for — why he does this job, why he is not "passionate about tech", what
being direct means for a Client, explaining, the countryside — had nowhere to
go.

## Decision

A page of its own, in both locales: `/a-propos/` and `/en/about/`, registered in
`src/routes.ts` like every other page.

- One column of prose under the H1, the portrait beside it, and the booking
  section at the end, as on an Offer page. No cards, no stack, no chronology:
  [ADR 11](0011-the-page-is-not-a-cv.md) holds here too, and the salaried route
  still appears once, on the home page.
- The home page's About block links to it ("Lire la suite"). The three words
  of the link are paid for by moving the teaching line from the home page to
  this page, so the home page stays under its ceiling.
- The page sells nothing, so its structured data is an `AboutPage` whose
  `mainEntity` is the Person, with the trail Home › About, and no `Service`.
- It has the default page budget of 400 words.

## Consequences

- The header's "About" still jumps to the block on the home page, beside the
  call; the page is one link further. Pointing the header straight at the page
  is a two-way door if the block turns out to be skipped.
- The copy is the long version from the brief that defines the voice (ADR 24),
  validated by Thomas. A rebase of that brief must update this page.
