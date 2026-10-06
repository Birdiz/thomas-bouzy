# 16. The legal notice wins, so the number becomes one meant to be public

- Status: accepted, takes effect at registration;
  the indexing guard is in place since 2026-10-04
- Date: 2026-10-03
- Supersedes [ADR 5](0005-phone-number-is-not-in-the-html.md) from that date

## Context

French law (LCEN, art. 6) requires a site published by a natural person acting
professionally to show that person's name, home address and telephone number. A
freelancer working under their own name is exactly that.

Two earlier decisions point the other way:

- **ADR 5** keeps the phone number out of the HTML. It is assembled in the
  browser after a click.
- **ADR 9** and `SITE.region` withhold the commune and the *département*.

The comment on `LEGAL` in `site.ts` already noticed the address problem. It did
not notice the telephone. Filling in `LEGAL` as it stands would have published
the personal mobile and the home commune in the footer of every page, which
undoes both decisions in one commit.

Neither can apply until the business is registered, so `LEGAL` stays empty and the site stays a showcase.

## Decision

**At registration, the legal notice is satisfied with details that exist to be
public, instead of with private ones that have to be hidden:**

- **A business domiciliation address** as the registered address, published in
  the notice. The home address stays private.
- **A dedicated professional number**, a VoIP line or an eSIM, published in plain
  text in the notice and in the contact section.
- **`RevealPhone` is removed.** There is no reason to hide a number that was
  bought to be called. The component, its inline script, its CSP hash and the
  tests asserting that the number is absent from the HTML all go with it.

**Until registration nothing changes.** `RevealPhone` and the personal mobile stay
as ADR 5 describes.

**No indexing without a complete legal notice.** `npm run assets:check` fails a
build that sets `SITE_INDEXABLE=true` while `LEGAL.isComplete` is false. Everywhere
else this repository turns a missing input into a failed build rather than a
shipped defect, and an indexed commercial site with no publisher identified is
that kind of defect. The site therefore stays out of the index for the whole
showcase period, and circulates only by link: LinkedIn, the network, the booking
page.

## Consequences

- **SEO starts on registration day, not before.** That costs months of ranking
  head start. It is accepted because the only traffic available during the
  showcase period is warm traffic, which arrives by link anyway.
- **Google Business Profile waits for registration too.** It needs a business. It
  also refuses domiciliation addresses, so it will be verified at the real
  address and published as a service-area business with the address hidden, over
  the Service area.
- **The CV PDF leak that ADR 5 recorded stops mattering**, because the PDF leaves
  the site (postscript to [ADR 11](0011-the-page-is-not-a-cv.md)). The protection
  no longer stops at the HTML, since nothing else is published.
- **The Inline JS line of the ADR 6 budget loses its only occupant**, short of the
  estimator in [ADR 17](0017-offer-pages-public-prices-and-the-estimator.md).
- Whether the INSEE's partial-diffusion option would keep a sole trader's address
  out of the public registers is unverified. Domiciliation makes the question
  moot.
