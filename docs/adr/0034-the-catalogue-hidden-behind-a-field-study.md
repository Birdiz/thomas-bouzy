# 34. The catalogue hidden behind a field study

- Status: accepted, implemented 2026-11-26
- Date: 2026-11-26
- Suspends, while `OFFERS_PUBLISHED` is false, the home page's running order of
  [ADR 31](0031-five-sections-one-job-each.md) and the Workshops as the way in
  of [ADR 27](0027-software-engineer-and-the-workshops-as-the-way-in.md) and
  [ADR 28](0028-proof-on-the-first-screen-and-the-workshops-format.md)
- Amends [ADR 17](0017-offer-pages-public-prices-and-the-estimator.md) and
  [ADR 29](0029-counting-visits-on-the-server-without-a-cookie.md) on one page

## Context

The owner is calibrating the Offers and the Workshops against what local
organisations actually need, and found that he was one of several people
offering the same workshops locally. He has no product vision yet that rests
on real needs, so he decided to stop selling and ask: a field study, a
questionnaire sent by email and shown at events, whose answers decide what he
will sell. A reply can also lead to a meeting.

Selling seven priced Offers beside a questionnaire that asks what to sell
would contradict the questionnaire. Deleting them would throw away work that
returns once the study has spoken.

## Decision

**One switch hides the catalogue.** `OFFERS_PUBLISHED` in `src/site.ts`. While
it is false the build serves no Offer page, no Partners or public-sector page,
no Workshops and no Offers section, and no price: `publishedPages()` in
`src/routes.ts` leaves them out of `ROUTES`, so the sitemap, the pages and every
suite that walks the site follow. `pathOf` answers nothing for a hidden page, so
a link left to one fails the build in `linkTo` instead of shipping a dead end.
Nothing is deleted: the content, the prices, the Open Graph cards and the
sitemap dates of the hidden pages are kept current (`OG_CARDS` and the
JSON-LD tests run on every registered page, `npm run lastmod` keeps their
records), so setting the switch back to true restores the site as it was. The
catalogue's own e2e tests skip while it is hidden, and say why.

**The home page asks instead.** Hero, field study, References, Contact. The
hero keeps the job title, the promise, the proof and the call; its line and
its second button come from `fieldStudy` in the content, since the old line
promised a workshop and the head described the Offers. The field study's
section takes the place of the Workshops and the Offers, and carries the
anchors `#offers` and `#workshops`, so that `/offres/`, `/tarifs/` and
`/ateliers/` (ADR 29) land on the section that says why nothing is for sale.
The menu and the footer list the field study and About.

**The field study is a page, French only, at `/enquete/`.** The organisations
it asks are French and local, like the Partners page's (ADR 15). The English
home page keeps a short section that says the questionnaire is in French and
links to it with `hreflang="fr"`: an English reader still learns what the site
is doing, and nothing pretends to be translated.

**The questionnaire lives in the back office, not here.** It is served and
stored by Thomas's own back office, a separate application: the page fetches
it from `${PUBLIC_SURVEY_API_ORIGIN}/api/surveys/{slug}` and posts the answers
to `…/responses`. The site still stores nothing (ADR 7). The form is plain
TypeScript, ported from the owner's own survey engine (`src/lib/survey/`): one
section per step, one display condition per section or question, the answers
of hidden questions dropped before sending, the same validation the back office
runs again. The optional last step asks for a contact, a 20-minute meeting and
explicit consent; a hidden honeypot field turns bots away. The page says what
happens to the answers: who reads them, for what, 24 months at most, and how to
have them erased. There is no privacy page to add it to, so the notice is on
the page that collects.

## Consequences

- **A request leaves the origin, on one page.** ADR 17 kept "no request leaves
  the origin" true by linking the booking page rather than embedding it. The
  field study cannot work without a server, and the site has none of its own.
  So `/enquete/` alone calls one origin, the owner's own back office, never a
  third party; the CSP's `connect-src` names it, read from the same variable at
  server start, and refuses to start on anything but an https origin. The e2e
  suite runs with the variable unset, the page then calls its own origin, and
  the API is mocked.
- **The site's first script of any size**: 15.4 kB uncompressed, on that page
  only. Its external-script limit moves to 18 kB; every other page keeps 4 kB
  (`tests/e2e/budget.spec.ts`). Its styles are small enough to stay in the
  inline block every page already carried.
- The home page's word ceiling is counted on the half it renders (the catalogue
  or the field study), and the field study's page has its own, its form's
  labels left out: they are an interface, not prose.
- The questionnaire's address is a constant (`FIELD_STUDY.slug`); the back
  office must serve the questionnaire under the same one.
- To publish the catalogue again: set `OFFERS_PUBLISHED` to true, run
  `npm run build && npm run lastmod`, and decide whether `/enquete/` stays.
