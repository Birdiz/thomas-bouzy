# 28. Proof on the first screen, the Workshops' format, and a way around

- Status: accepted, implemented 2026-11-21; its open facts on the Takeover, the
  Build and La Cartonnerie answered in part by [ADR 30](0030-offers-by-situation-and-the-whole-budget.md), 2026-11-21
- Date: 2026-11-21
- Amends [ADR 1](0001-astro-static-site.md) (postscript),
  [ADR 11](0011-the-page-is-not-a-cv.md),
  [ADR 12](0012-the-clients-sentence-first.md),
  [ADR 20](0020-the-buyers-objections-before-the-buyer-asks.md),
  [ADR 23](0023-motion-that-answers.md),
  [ADR 24](0024-the-site-says-tu.md),
  [ADR 25](0025-an-about-page-for-the-voice.md) and
  [ADR 27](0027-software-engineer-and-the-workshops-as-the-way-in.md)

## Context

A marketing audit read the live site on 2026-11-19, with three simulated
business owners as readers. The report stays with the owner, outside this
repository. Its verdict, in the part this record covers:

- the first screen opened on the AI Workshops with no example, no takeaway and
  no proof, and all three owners read the status line ("not yet a date, a
  programme or a price") as "so it does not exist";
- the proof was four screens down on a desktop and six on a phone: ArcelorMittal
  and the university teaching sat in the References and the About block;
- the carousel of Client sentences showed one sentence in five, five seconds
  each, and hid the explanations; two owners in three took the sentences for
  invented testimonials;
- "En poste plutôt qu'en mission ?" read, to an owner buying continuity, as
  Thomas looking for a job;
- the References put salaried posts, unlabelled, beside a labelled volunteer
  project, and the Socios panel opened on Kubernetes, Event Sourcing and DeFi on
  Solana;
- the menu's four links led to anchors on the home page, even from an Offer
  page; booking from the header took two clicks; the About page got one link;
  the 404 had no header; the phone header took three lines and 127px at 360px;
  an English reader who followed a French-only page had no way back.

Thomas ruled on twelve decisions on 2026-11-20, each as the report recommended,
and asked for the whole prioritised plan. This record covers D1 to D3 and D6 to
D11, the home page and what every page shares. The Offers section, the Offer
pages and their prices (D4, D5, D12) are recorded with their own work, and the
server's redirects with theirs.

## Decision

**D1. AI stays the way in, and the hero balances the two doors.** The title
speaks of tools, the subtitle of the Workshop, the line under the buttons of the
software. With a stop rule: the booking page asks each Client what the call is
about, and if by 31 March 2027, or after 15 to 20 qualified calls, fewer than a
quarter are about AI, AI leaves the subtitle. That overrides
[ADR 27](0027-software-engineer-and-the-workshops-as-the-way-in.md) in part,
which made the hero's subtitle the Workshops' word for word.

**D6. The title stays; the subtitle and the kicker change.** The kicker reads
« Ingénieur logiciel · Grand Est »: the first screen did not say where Thomas
works. The region is a field of its own (`hero.region`), so the job title stays
the one job title and its test holds. The subtitle speaks to the reader and
reads on its own: « Je commence par un atelier : vous voyez ce que l'IA change
chez vous. » It replaces « En commençant par montrer aux dirigeants ce que l'IA
y change. », whose gerund and *y* leaned on the title. The English site has no
Workshops, so its subtitle promises none: "Starting with the software you
already run, without stopping it." The title itself changes only after an oral
test at the trade fair: two sentences alternated by half-day, kept by how
often a visitor rephrases it as "software for companies".

**The proof moves under the buttons** (`hero.proof`), in facts already on the
page and each kept whole: « J'étais dans l'équipe qui a maintenu l'ERP de
plusieurs usines ArcelorMittal, puis dans celle qui a rendu traçable l'argent de
1,5 million d'utilisateurs. J'ai enseigné la programmation à l'Université de
Reims. » Both Achievements were team work, and the line says so. A first draft
merged two Achievements into one claim, a product rebuilt without an outage
"for 1.5 million users": the rebuild was a trading product, the figure the
wallet's. The teaching line leaves the About block for it: the Workshops' proof
is now on the first screen.

**D2. The Workshops publish their format, never a date or a price.** The three
levels say what each is: a morning in a small group of six to eight owners, on
cases like theirs; a day at the owner's premises, on their files, ending in a
written note of what AI can do for them and what it must not touch; then a
follow-up, « Un suivi », where « Un accompagnement » used a word the voice
never uses. A line says why an engineer runs them: « Je me sers de l'IA chaque
jour pour construire des logiciels : je sais où elle se trompe. » The status
says what will come, « Les dates et le prix seront annoncés ici. », instead of
three negations. The group's size is written in words: a digit in the section
still fails the test that keeps prices and dates out. That reverses
[ADR 27](0027-software-engineer-and-the-workshops-as-the-way-in.md)'s "no
programme".

**D11. The rule on data is on the site, because it is the practice:** in a
group, anonymised standard cases; at the owner's premises, their tools and their
accounts; nothing leaves without their consent.

**D3. The Workshops' format and launch prices are decided, and applied the day
they become an Offer** (a row in `prices.ts` and a page of their own, as ADR 27
says). Nothing of them reaches the site before, and nothing free is ever
announced: a price published early goes stale, as ADRs 11 and 17 found, and a
free session announced in public is a question for a lawyer first. The figures
stay with the audit, not in this record, for the same reason.

**D9. They stay *ateliers*, never a *formation*.** The content keeps away from
what a training course is: work on the company, a note written for the company,
no assessment of the participants. The test that fails on either word stays.

**D10. No link from the Workshops to the software Offers**, and no Workshop
price credited against an Engagement. The hero's title already says Thomas
builds tools; ADR 27 removed the line that said it again because it read as a
pitch.

**The Client sentences become a fixed list**, each linked to the Offer that
treats it, under « Vous reconnaissez l'une de ces phrases ? »: read under a
question, they are questions to the reader, not testimonials. The labels and
explanations under them go (`FailureMode.text`): in the default motion setting
the carousel already hid them from most readers. The Failure modes' names stay
in the glossary. One sentence loses its jargon: « La montée de version » becomes
« La mise à jour ». That amends [ADR 12](0012-the-clients-sentence-first.md),
whose rule kept the names findable in the prose.

**Motion stays visible.** Each sentence rises 48px into place in 0.45 s as it
scrolls into view, those arriving together 0.12 s apart, once, never looping;
with no script or under reduced motion the list is simply there. That amends
[ADR 23](0023-motion-that-answers.md)'s "nothing fades in on scroll" for this
list only, and closes its open question on the carousel: the carousel was the
section's motion, and Thomas judges motion by looking at it. Motion calibrated
by its numbers alone has twice been too quiet to see (ADR 23).

**D7. The proof a business owner reads:**

- the years, once, in a sentence of the About block: « Depuis une douzaine
  d'années, je construis et je maintiens des logiciels dont des entreprises
  dépendent chaque jour. » Never a badge: ADR 11's chronology and badge stay off;
- each Reference says under its name in what capacity the work was done
  (`Reference.nature`): on staff at Quadra Informatique for ArcelorMittal, on
  staff at Socios.com, as an independent for Kiss The Bride; volunteer work,
  client work and a personal product as before;
- the Approach of each Achievement is folded, « pour les équipes techniques »;
  the plain line and the result stay in sight;
- the on-chain operations leave the home page's References. They stay on the
  Reliability page, for the technical buyer they prove something to;
- testimonials from Clients and Workshop participants are welcome once they
  exist, with written consent, a name and a company. That amends
  [ADR 24](0024-the-site-says-tu.md). LinkedIn recommendations from colleagues
  stay off: they answer a hiring question. Former employers' logos stay off:
  they were not Clients.

The References' words follow the reader: « Des logiciels qui ne pouvaient pas
s'arrêter » and « Industrie, finance, grands comptes, associations, une
commune. »; Finance for fintech, online software for large accounts for SaaS,
civic projects for civic tech, public data for open data, a product rebuilt for
an API, software taken over for a monolith, kept in service for kept in
production, a setup by hand for a setup *sur mesure*.

**D8. « En poste plutôt qu'en mission ? » goes.** « Mon parcours complet est sur
LinkedIn. » stays, alone, at the end of the About block, and the About page gets
it too: it had no way to the career. That amends ADR 11's postscript, which
made that line the salaried route, and ADR 1's, which gave recruiters one line.

**The About block opens on who answers**, « Quand vous appelez, c'est moi qui
décroche. », because all three owners read « Qui décroche » as "who drops out".
The list of technologies leaves it for the six FAQ answers that carry it.

**The About page's H1 names Thomas and his job**, « Thomas Bouzy, ingénieur
logiciel dans le Grand Est », where it said « Qui décroche ». Under it, Thomas's
own line without the job it would repeat: « Avec le goût de comprendre
l'exigence des autres. » Two sentences go: « Alors non, je ne suis pas
« passionné de tech ». », a word the voice never uses, said to a recruiter's
cliché; and the paragraph on teams chasing perfect code, which read as "he cuts
corners". A paragraph names the software he spent his career on.

**A way around, on every page:**

- the menu reads Ateliers · Offres et prix · Références · À propos, and About
  goes to its page, which [ADR 25](0025-an-about-page-for-the-voice.md) left as
  a two-way door;
- the header's button is « Réserver un appel », straight to the booking page,
  from every page;
- the footer lists the Workshops and About with the other pages;
- on a phone the header takes two lines, 92px at 360px, and steps aside while
  the reader goes down, back as soon as they go up or tab into it;
- the 404 wears the header and offers four ways back in: the home page, the
  Workshops, the Offers and prices, and the English home page;
- a page that exists in French only links to the English home page, and its
  name says so (`a11y.otherHome`); a page in both languages keeps its switch.

**The contact says where Thomas comes**: « Parlons de votre entreprise. » and
« Je viens chez vous à {towns}. Ailleurs, on avance à distance. »

**The sitemap's `<lastmod>` is the day each page's text last changed**, not the
hour of the build, which said "now" for every page on every deploy and closes
the point [ADR 20](0020-the-buyers-objections-before-the-buyer-asks.md) left
open. `npm run lastmod`, after a build, dates today every page whose text has
changed since `scripts/lastmod.json` recorded it; the text is the page's
`<main>`, without markup, scripts or the shared header and footer. The sitemap
prints a date only while the record still matches the built page, so a page
changed without it goes out undated rather than misdated, and the e2e suite
fails on it.

**`alumniOf` stays**: Thomas studied at the University of Reims, and taught
there later.

## Consequences

- The copy runs ahead of the pitch master again, as with ADR 27
  ([ADR 9](0009-the-pitch-master-owns-the-copy.md)): the years, the nature of
  each post, the team work and the About paragraph. Thomas backports them.
- The home page is 1,332 words of its 1,400 ([ADR 18](0018-one-day-rate-and-half-the-words.md)):
  the explanations under the sentences paid for the proof, the Workshops'
  format and the nature of the References.
- Every copy change now ends with `npm run build && npm run lastmod`. The test
  says so when it is forgotten.
- Still open, waiting on facts only Thomas has: the response time he can hold
  alone and who covers his holidays; whether he recovers code from a server
  when the previous provider has gone; whether the upgrade of a small
  application that can stop for a weekend falls under the Takeover; whether a
  Build replaces Access, WinDev or spreadsheet tools; work around an ERP or
  off-the-shelf software without its code; whether the target applications
  issue their own invoices; La Cartonnerie's year and nature; how many joiners
  use Quart de tour; whether "not my first time as an independent" can be
  written.
- If the stop rule fires, the subtitle changes and this record gets a
  postscript; the Workshops' section stays where it is until they have a price
  and a page.
