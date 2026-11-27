# 34. The catalogue hidden behind a field study

- Status: accepted, implemented 2026-11-27
- Date: 2026-11-27
- Suspends, while `OFFERS_PUBLISHED` is not true, the home page's running order
  of [ADR 31](0031-five-sections-one-job-each.md) and the Workshops as the way
  in of [ADR 27](0027-software-engineer-and-the-workshops-as-the-way-in.md) and
  [ADR 28](0028-proof-on-the-first-screen-and-the-workshops-format.md)
- Amends [ADR 17](0017-offer-pages-public-prices-and-the-estimator.md) and
  [ADR 29](0029-counting-visits-on-the-server-without-a-cookie.md) on one page

## Context

The owner is calibrating the Offers and the Workshops against what local
organisations actually need. Rather than sell a catalogue built ahead of those
needs, he runs a field study first: a questionnaire, shown behind a QR code at a
trade fair from Monday 1 December 2026, whose answers decide what he will sell.
A reply can also ask for the results or for a conversation.

Selling seven priced Offers beside a questionnaire that asks what to sell would
contradict the questionnaire. Deleting them would throw away work that returns
once the study has spoken.

## Decision

**One switch hides the catalogue, and hidden is the default.** The build reads
`OFFERS_PUBLISHED` from the environment, like `SITE_DOMAIN`, and publishes the
catalogue only when it says true. Unset, the catalogue is hidden: the launch
depends on no service variable someone could forget, and restoring it is one
variable and a redeploy. While hidden, the build serves no Offer page, no
Partners or public-sector page, no Workshops, no Offers section and no price:
`publishedPages()` in `src/routes.ts` leaves them out of `ROUTES`, so the pages,
the sitemap, the menu, the footer, the JSON-LD and every suite that walks the
site follow. `pathOf` answers nothing for a hidden page, so a link left to one
fails the build in `linkTo` instead of shipping a dead end. Nothing is deleted:
the content, the prices, the Open Graph cards and the sitemap dates of the
hidden pages are kept current (`OG_CARDS` and the JSON-LD tests run on every
registered page, `npm run lastmod` keeps their records). The catalogue's own e2e
tests skip while it is hidden, and say why.

**The hidden addresses answer a 302 to the home page.** Links to the Offer
pages were shared before the study. A 404 would tell their readers, and the
crawlers, that the pages are gone for good; a temporary redirect says they will
be back, and lands the reader on who Thomas is and the study. The build writes
the map in `dist/_catalogue.json` (`hiddenRedirects()`), the server reads it at
start and never serves it: the runtime image carries `dist/` and the server,
not the registry. The shortcuts into the catalogue of ADR 29 (`/offres/`,
`/tarifs/`, `/ateliers/`, `/en/offers/`) redirect to the home page the same way.

**The home page asks, in French.** Hero, field study, References, Contact. The
hero keeps the job title, the promise and the proof. Its line says Thomas is
not selling and runs a study; its primary button goes to the study and the call
comes second. The head and the JSON-LD describe the person, not the Offers
(`homeDescription()`). The English home page says nothing of a questionnaire
that exists in French only: hero, References, Contact, the call first and the
References second. The 404 page offers the study in place of the Workshops and
the Offers.

**The study is a page, French only, at `/enquete/`,** like the organisations it
asks (ADR 15). The page's own words stay neutral: a field study, not a sales
pitch. They never say how long it takes or how many questions it asks, and they
name no place and no person: the questionnaire's introduction, served by the
back office with the questions, says what the study is about and whom it asks,
and the page renders it above the first step. `estimatedMinutes` is read and
never shown. The progress bar counts steps, not questions.

**The questionnaire lives in the back office, not here.** Thomas's own back
office, a separate application, serves and stores it: the page fetches
`${PUBLIC_SURVEY_API_ORIGIN}/api/surveys/besoins-numeriques-2026` and posts the
answers to `…/responses`, under the contract that application documents. The
site still stores nothing (ADR 7). The form is plain TypeScript with no
framework (`src/lib/survey/`), its pure logic ported from the owner's own survey
engine with its tests, and the two changes the back office made to it: the text
an option reveals is kept on any question with options, and lengths are counted
in characters. One section per step, with a progress bar, back and next; one
display condition per section or question, the answers of hidden questions
dropped before sending; the same validation the back office runs again.
Progress survives a reload in `sessionStorage`, and is forgotten once sent.

**The contact is optional, and each box means one thing.** Three independent
boxes, as the back office holds them: the results need an e-mail address and
imply no consent to be contacted; the 20-minute conversation needs the address
and the consent; the consent box carries the notice in plain words (its purpose,
a single reader, 24 months, erasure on request), and only once it is ticked are
a name and an organisation asked. A hidden `website` field turns bots away. A
201 shows the thanks and the booking link; a 422 puts each refusal back on its
step; a 404 or 410 says the study is closed. The page also carries the notice
for the answers themselves, since there is no privacy page to put it on.

## Consequences

- **A request leaves the origin, on one page.** ADR 17 kept "no request leaves
  the origin" true by linking the booking page rather than embedding it. The
  field study cannot work without a server, and the site has none of its own.
  So `/enquete/` alone calls one origin, the owner's own back office, never a
  third party; the CSP's `connect-src` names it, read from the same variable at
  server start, and the server refuses to start on anything but an https origin.
  A deployment build that hides the catalogue without the variable fails
  (`npm run assets:check`). The e2e suite runs with it unset, the page then
  calls its own origin, and the API is mocked.
- **The site's first script of any size**, on that page only. Its
  external-script limit is 18 kB; every other page keeps 4 kB
  (`tests/e2e/budget.spec.ts`). Its styles stay in the inline block every page
  already carried.
- The home page's word ceiling is counted on the half it renders (the catalogue
  or the field study), and the field study's page has its own, its form's
  labels left out: they are an interface, not prose.
- The questionnaire's address is a constant (`FIELD_STUDY.slug`); the back
  office must serve the questionnaire under the same one.
- CI builds the hidden site, the one that ships. The published one is held by
  the unit tests, which build every registered page's graph and card; the
  catalogue's e2e tests skip in CI and run again on a build with
  `OFFERS_PUBLISHED=true`, which is the first thing to do before flipping it.
- To publish the catalogue again: set `OFFERS_PUBLISHED=true` on the service,
  run `OFFERS_PUBLISHED=true npm run build && npm run lastmod` and commit the
  dates (the home pages' text changes), redeploy, and decide whether `/enquete/`
  stays.
