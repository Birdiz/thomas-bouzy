# 15. French at the root, English only where it sells

- Status: accepted, not yet implemented
- Date: 2026-10-03
- Supersedes the default-locale half of [ADR 2](0002-locale-routes-over-a-client-toggle.md)

## Context

ADR 2 put English at `/` "because the stated target is remote and international
roles". That target is gone: the site sells engagements, and two of its three
Segments ([ADR 14](0014-three-segments-and-the-least-technical-reader.md)) are
French. The third, Critical systems, is remote, and part of it reads English. The
LinkedIn cover the site wears says "Full remote — EU".

The site is also about to grow from one page to one page per Offer. Under ADR 2's
full parity, every Offer page costs two pieces of writing, and the parity test
holds the whole catalogue to both languages. A plain-language page about taking
over a Vosges manufacturer's in-house application gains nothing from an English
twin.

## Decision

- **French is served at `/`**, and the Offer pages under `/offres/<slug>/`.
- **English moves to `/en/`**, and covers the home page and the four Offers the
  Critical-systems Segment buys, under `/en/offers/<slug>/`: Audit, Migration,
  Reliability, Reinforcement.
- **The Takeover is French only.** Its Segments, Partners and the orphan app, are
  French and local.

ADR 2's mechanics are unchanged: real routes, `hreflang` alternates, no redirect
on `Accept-Language`. A French-only page has no `hreflang` alternate, rather than
pointing at one that does not exist.

German was considered, because the Alsace industrial fabric has many German and
Swiss-owned subsidiaries. It was rejected: B1 German is not enough to write sales
copy, and a weak translation does more harm than no page. If a first engagement
comes from across the Rhine, the question reopens.

## Consequences

- **The parity test stops being universal.** It covers the home page and the four
  bilingual Offers. A page that is French only is declared as such in the content
  contract, so the test fails on an untranslated page that was meant to be
  bilingual and is silent on one that was never meant to be.
- **`x-default` moves from the English home page to the French one.**
- The URLs ADR 2 made shareable change once. The site has never been
  communicated or indexed (ADR 8), so no link in circulation breaks.
- **Selling to a business elsewhere in the EU is an administrative step, not a
  site change.** Under the VAT franchise, Thomas will need an intra-community VAT
  number and reverse-charge invoices. This is to confirm with an accountant
  before the first EU engagement.
