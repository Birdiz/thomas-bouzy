# 22. Full-stack, anchored in the backend

- Status: accepted, implemented 2026-10-06
- Date: 2026-10-06
- Amends [ADR 18](0018-one-day-rate-and-half-the-words.md) and
  [ADR 20](0020-the-buyers-objections-before-the-buyer-asks.md)

## Context

ADR 18 found that "PHP" appeared nowhere on the site, and put PHP and Symfony
into every title, every meta description and several H1s. ADR 20 went further:
the home title, the Person's `jobTitle` and the share image's signature all
became "Freelance PHP/Symfony".

That fixed what search reads, but it also made one stack the site's identity.
Two things are wrong with that:

- **It describes Thomas too narrowly.** He is full-stack. His depth is the
  backend and software architecture, and PHP/Symfony is where that depth was
  built, but he also works in Node.js, TypeScript and React, and wants Node.js
  and Python engagements.
- **It closes doors the Offers do not.** An Audit, a Reliability or a Scaling
  engagement uses the same method in any language. A non-technical Client does
  not know what "PHP/Symfony" means, and a technical one with a Node.js system
  reads it as "not for us". The Partners page had already met this problem in
  its points (PR #46), and only there.

## Decision

**The brand says full-stack, with the depth in the backend and in
architecture.** A technology is named where it helps a reader recognise
themselves, and PHP/Symfony is named as the expertise rather than hidden. Three
levels:

1. **Identity**, wherever the site speaks of Thomas rather than of an Offer. The
   home title becomes "Freelance fullstack" (still no job title, ADR 14). The
   home description names PHP/Symfony as the backend expertise. `jobTitle`
   becomes "Développeur fullstack freelance". The share image is signed
   "Freelance fullstack". About states the stack in order of depth.
2. **Offers whose method does not depend on the language**: Audit, Takeover,
   Reliability, Scaling, Build and the Public sector page. Their titles,
   descriptions and H1s drop PHP/Symfony for the reader's words. The Build's
   title says "front et back". Each of these Offer pages answers "Sur quelles
   technologies ?" in its FAQ, and the Takeover keeps the question it already had.
3. **Where the technology is the product or the buyer's filter.** The Migration
   keeps Symfony and PHP: an upgrade of either is what it sells. Reinforcement
   and the Partners page name every stack (PHP/Symfony, Node.js, React), because a
   team lead or an agency is chosen on stack match.

The hero still names no technology (ADR 14).

**Python is stated at its real level.** It is personal projects only, so it
appears in About and in the technology answers as "pour l'instant en projets
personnels". It is in no title and not in `knowsAbout`. This is the honesty rule
of the pitch master's §4.5, which ADR 20 moved onto the Achievements.

**The booking button says "gratuit" rather than "30 minutes".** Price is the
objection a first-time Client has, and length is not. The blocks under the
button still give the length.

## Consequences

- Searches for "développeur Symfony Nancy" lose the home title. They keep the
  home description, the Migration, Reinforcement and Partners titles, and every
  FAQ. That is the trade: a reader who searches a stack is technical, and finds
  it one click deeper.
- This time the site's copy runs ahead of the pitch master, contrary to ADR 9.
  The positioning is backported to the pitch master by its owner.
- The share image's signature is a constant per locale in `src/lib/og.ts`, not
  `jobTitle`, which wraps onto a second line on the Offer cards.
