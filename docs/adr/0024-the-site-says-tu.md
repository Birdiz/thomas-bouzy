# 24. The site speaks in Thomas's voice, and says *tu*

- Status: accepted, implemented 2026-11-13; *tu* superseded by
  [ADR 26](0026-the-site-says-vous.md), 2026-11-19: French now says *vous*
- Date: 2026-11-13

## Context

The copy was correct and anonymous. It said *vous*, it stated the stack the way
a CV does, and nothing on the page sounded like the person a Client would get
on the phone. Thomas's own writing, where it reaches the most readers, is
nothing like that: short lines, a question to the reader, an aside in
brackets, dry irony, an admitted limit.

Two things were decided with him:

- **The voice is his.** It is written down in a personal brand brief: what he
  believes, how he writes, which words he never uses, and the line between what
  the site shows and what it keeps. The brief draws on personal material, so it
  is kept off this repository, as the pitch master is
  ([ADR 9](0009-the-pitch-master-owns-the-copy.md)). It is to the voice what
  the pitch master is to career facts.
- **French says *tu*, everywhere**, the Public sector page included.

## Decision

Every French string addresses the reader as *tu*. English needs no choice; it
carries the same voice.

The About block beside the call is rewritten in the first person. It opens on
what Thomas enjoys, the problem, and says the tech comes second; it never opens
on a bare negation, which reads as a rebuff. It then says what a Client gets
from his main flaw: too direct, so advice without sugar coating. "Expertise"
leaves the FAQ answers for "home ground", and the remote-work answer becomes an
invitation rather than a condition. The three honesty levels on the stack stay
as they were.

French copy puts no comma before *et*, an English habit, except in a genuinely
complex enumeration.

## Consequences

- ***Tu* is a filter, deliberately.** [ADR 14](0014-three-segments-and-the-least-technical-reader.md)
  names a non-technical buyer, often the owner of a local SME, and the Public
  sector page speaks to a town hall. Some of them will read *tu* as
  over-familiar. Thomas accepts losing them: a Client put off by *tu* is unlikely
  to enjoy working with him.
- **The home page has no room for more voice.** It was at 1,197 of its 1,200
  words ([ADR 18](0018-one-day-rate-and-half-the-words.md)); the rewrite lands
  at exactly 1,200. The About block is therefore two tight paragraphs, a swap
  rather than an addition. The longer version the voice asks for is kept in the
  brief, for a dedicated About page should one be built. That page would have a
  budget of its own; the home page's is unchanged.
- **The recommendations are not quoted.** Thomas does not want testimonials on
  the site. They were read to check that the voice tells the truth, not to be
  published.
- An agent rebasing the copy must keep *tu*, and must read the brief when it is
  available. It lives outside git, so a clone or a worktree does not have it:
  see the owner.
