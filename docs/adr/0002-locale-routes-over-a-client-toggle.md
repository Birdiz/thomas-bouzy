# 2. Real routes per locale, not a client-side toggle

- Status: accepted
- Date: 2026-08-28

## Context

The design holds the current language in component state: clicking EN/FR swaps
every string in place, at one URL.

For a portfolio whose job is to be found and forwarded, that has three costs:
a search engine indexes one language only; a link shared with a French recruiter
opens in English; and the browser's back button does nothing after a switch.

## Decision

Serve English at `/` and French at `/fr/`. The switch is two `<a>` elements with
`hreflang`, `lang` and `aria-current`. Each page declares a canonical URL and
`hreflang` alternates including `x-default`, and both appear in the sitemap.

English is the default because the stated target is remote and international
roles.

There is deliberately **no** automatic redirect based on `Accept-Language` or
`localStorage`. Redirecting on a stored preference breaks the back button and
overrides an explicit choice — a link sent in French must open in French.

## Consequences

- Two indexable, shareable URLs; `hreflang` tells Google they are translations.
- The language state disappears from the client entirely.
- A visitor's choice is not remembered between visits. That is the trade, and it
  is the less surprising half of it.
