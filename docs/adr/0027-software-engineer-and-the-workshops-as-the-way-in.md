# 27. Software engineer, and the AI workshops as the way in

- Status: accepted, implemented 2026-11-19
- Date: 2026-11-19
- Amends [ADR 11](0011-the-page-is-not-a-cv.md),
  [ADR 14](0014-three-segments-and-the-least-technical-reader.md),
  [ADR 22](0022-full-stack-anchored-in-the-backend.md) and
  [ADR 25](0025-an-about-page-for-the-voice.md)

## Context

Thomas's positioning changed. The entry point is now a series of hands-on AI
workshops for owners of small and mid-sized companies (PME). They lead to what
he actually wants to sell: software tools for the core business of those
companies. The Takeover, Reliability, Migration and Scaling stay on sale as
part of that goal.

He will meet business owners in person at a trade fair. Someone who looks him
up afterwards must read, on the first screen, the title and the sentence he
said to them. The site said "Freelance fullstack" and opened on the Takeover
("Je reprends et fais évoluer tes applications métier"). Neither matched what
he will say.

These decisions were Thomas's own, taken before the work started. This record
says what they changed in the site, and which earlier ADRs they override.

## Decision

**One job title: « Ingénieur logiciel », "Software engineer" in English.** It
replaces "fullstack" and "freelance developer" wherever the site says who
Thomas is: above the hero's H1, in the home page's `<title>` and description,
the Person's `jobTitle`, the Open Graph signature, the footer, the About block
and page, and the titles of the Partners, Public sector and Reinforcement pages.
This overrides:

- ADR 11 and ADR 14, which took the job title off the page and kept it out of
  the title and description. The years badge, the chronology and the CV stay
  off: those answer a hiring question, and the title answers the question of
  the owner who met him;
- ADR 22, which made "fullstack" the identity. Its three levels of technology
  naming stay; only the identity changes.

**The hero is one sentence, word for word:** « J'outille le métier des PME, en
commençant par montrer aux dirigeants ce que l'IA y change. » In English: "I
build tools for the core business of small and mid-sized companies, starting
by showing their owners what AI changes in it." *PME* covers mid-sized
companies too, and their *dirigeants* are usually their owners, so the English
says both. The sentence is in the third person, so it reads the same whatever
the address; the rest of the French says *vous*
([ADR 26](0026-the-site-says-vous.md)).

**The old promise moves into the problem section**, whose kicker, H2 and lead
now say it: "Ton logiciel existe déjà ?", then « Je reprends et fais évoluer tes
applications métier, même celle que plus personne n'ose toucher. », then
« Sans l'arrêter, sans tout réécrire. » The Takeover card already said the
rest.

**The Workshops are a section of the French home page, right after the hero
and before the software Offers.** They are the way in, so:

- the hero's secondary button and a header link lead to them;
- three levels, as Thomas named them: a discovery morning, a one-day workshop,
  then support on the owner's real case;
- no price, programme, date, outcome or testimonial, because none exists yet.
  The section says they are being designed. Its primary button is the free
  call, and an email lets an owner ask to hear when the first sessions open: the
  site is static and sends nothing anywhere ([ADR 7](0007-serving-the-site-ourselves-on-railway.md));
- it says plainly that Thomas also builds tools and that a workshop can lead
  there. A workshop must never look like hidden prospecting.

**They are never called a *formation*, nor a "training course".** In France a
*formation* names a regulated framework the workshops do not use. They are
*ateliers*. A test fails on either word anywhere in the copy.

**The Workshops are French only.** The owners they are for are French and
local, like the Partners ([ADR 15](0015-french-at-the-root-english-where-it-sells.md)).
The English hero keeps the sentence and its secondary button goes to the Offers.

**They are not an Offer yet.** In the glossary an Offer has a scope, a price
and a page; the Workshops have none of those. They are a term of their own
until they do. The Audit stays the Entry offer among the priced Offers.

**The university teaching is the Workshops' proof.** The About block on the
home page names it again (object-oriented programming at the University of
Reims), which reverses ADR 25's move of that line to the About page.

**The home page's ceiling rises from 1,200 to 1,400 words** for the new section
and the old promise's move ([ADR 18](0018-one-day-rate-and-half-the-words.md)).

## Consequences

- The site's copy runs ahead of the pitch master again, as with ADR 22
  ([ADR 9](0009-the-pitch-master-owns-the-copy.md)). Thomas backports it.
- The home page says who he is twice above the fold (the header's name, the
  hero's title) and the H1 still carries the name for screen readers. ADR 18's
  "once is enough" applies to the name, not to the title.
- A fourth Segment, owners who come for the Workshops before any software
  problem, is not declared. It waits on real conversations, like the Build's
  local buyer (ADR 19) and issue #51.
- When the Workshops get a price, a programme or a date, they become an Offer:
  a registry entry, a row in the price table and a page, under the same tests.
