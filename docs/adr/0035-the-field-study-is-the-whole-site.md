# 35. The field study is the whole site

- Status: accepted, implemented 2026-11-27
- Date: 2026-11-27
- Supersedes, while `OFFERS_PUBLISHED` is not true, the home page, the English
  pages and the copy rule "the page asks, it does not sell" of
  [ADR 34](0034-the-catalogue-hidden-behind-a-field-study.md)
- Suspends on the same condition the booking link one click from every page of
  [ADR 28](0028-proof-on-the-first-screen-and-the-workshops-format.md)

## Context

ADR 34 hid the catalogue and kept a home page about Thomas: the job title, the
promise, the proof, the References and the call, with the field study as its
first button. Once live, the owner wanted the opposite balance. A reader who
scans the QR code at the fair should land on the questionnaire, and a page that
lists his skills and the work he wants beside it reads as a sales pitch in
disguise, which is what the study must not be. For the same reason, a line
saying he "sells nothing" made the reader think of selling.

## Decision

**While the catalogue is hidden, the build serves one page: the field study, at
the home page's address.** `publishedPages(false)` in `src/routes.ts` answers
the field study's page alone, with `/` as its one path, so the registry still
drives the routes, the sitemap and the suites that walk the site. Its content,
its Open Graph card, its JSON-LD and its weight budget stay the field study's.
About, the English home page and every other page are set aside with the
catalogue. Their addresses, `/enquete/` included, answer a 302 to `/`, as the
catalogue's did (ADR 34), so a QR code printed with either address still works.

**The page says who asks, by name, and nothing of what he does.** Under the
title, a portrait and one line give his name: the privacy notice says a single
person reads the answers, so the page says who. It has no job title, no promise,
no References, no proof and no booking link, not even on the thanks or closed
screens. The header keeps the name, without a menu, a language switch or the
call. The footer keeps the name, the e-mail address the notice points to for
erasure, and the legal notice; GitHub and LinkedIn go. The JSON-LD names the
Person and gives no job, skills or profiles. The Open Graph card is signed with
the name alone. The 404 offers the home page only.

**The page's own words do not mention selling, even to deny it.** They say what
the study wants to understand. ADR 34's other copy rules stand: no duration, no
number of questions, no place or person named except the one who asks.

**The switch is unchanged.** `OFFERS_PUBLISHED=true` restores ADR 34's published
site whole: the home page about Thomas, About, English, the catalogue, and the
field study at `/enquete/`, linked from nowhere.

## Consequences

- The variable is now misnamed: it publishes the whole site, not only the
  Offers. It keeps its name, because it is set on the live service.
- The suite runs the site that ships. The tests of the page about Thomas
  (`tests/e2e/resume.spec.ts`) skip while the catalogue is hidden, as the
  catalogue's own tests already did; `tests/e2e/field-study-site.spec.ts` holds
  what the site says instead. Before flipping back, run the suite on a build
  with `OFFERS_PUBLISHED=true`.
- To publish again, follow ADR 34: set the variable, rebuild, run
  `npm run lastmod` and commit the dates, redeploy. `/`'s date changes both
  ways.
