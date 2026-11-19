# 26. The site says *vous*

- Status: accepted, implemented 2026-11-19
- Date: 2026-11-19
- Supersedes the *tu* half of [ADR 24](0024-the-site-says-tu.md); the voice
  stays

## Context

ADR 24 made French say *tu* everywhere and called it a filter: a Client put off
by *tu* was unlikely to enjoy working with Thomas, so losing that Client was
accepted.

Reread with the copy in place, the filter costs more than it buys. The three
Segments of [ADR 14](0014-three-segments-and-the-least-technical-reader.md) are
the owner of a local SME, a town hall or public body, and an agency buying a
day of work for its own client. *Vous* is the default for all three in a first
contact with a supplier. *Tu* reads as bold before it reads as warm, and a
reader who stops at the address never reaches the voice that was meant to win
them.

## Decision

Every French string addresses the reader as *vous*, the Public sector and
Partners pages included. That covers the reader's own questions to Thomas in
the FAQs ("Vous travaillez à distance ?"), which are written in the reader's
voice.

Only the address changes. The voice ADR 24 describes stays: short lines, a
question to the reader, an aside in brackets, dry irony, an admitted limit, and
the About copy in the first person. English is unaffected.

## Consequences

- **The voice has to carry the warmth on its own.** *Vous* no longer does any
  of it, so a rewrite that smooths the voice into neutral corporate French
  loses what ADR 24 was for. Keep the short lines and the asides.
- **Word ceilings hold.** *Tu* and *vous* forms are the same number of words,
  so the switch leaves [ADR 18](0018-one-day-rate-and-half-the-words.md)'s
  budgets where they were.
- **The brief that defines the voice still says *tu*.** It lives outside git
  (ADR 24), so this change cannot reach it. An agent rebasing the copy from it
  converts to *vous*; updating the brief itself: see the owner.
