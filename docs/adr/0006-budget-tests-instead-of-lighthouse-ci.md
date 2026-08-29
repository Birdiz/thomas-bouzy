# 6. A performance budget in Playwright, not Lighthouse CI

- Status: accepted
- Date: 2026-08-28

## Context

The plan called for Lighthouse CI with score budgets. Installing `@lhci/cli`
took the dependency tree from **0 vulnerabilities to 10** (7 high: `extract-zip`
path traversal, `tmp` symlink write, `uuid` bounds check), all transitive
through its chrome-launcher stack.

Lighthouse's performance score is also noisy in a shared CI runner. A gate that
fails for reasons nobody can act on gets marked `continue-on-error` within a
month, and then it is measuring nothing.

## Decision

Drop Lighthouse CI. Assert the budget's *inputs* directly in
`tests/e2e/budget.spec.ts`, using the browser Playwright is already running:

| Budget | Limit | Actual |
| --- | --- | --- |
| Document | 42 KB | ~37 KB |
| CSS | 34 KB | ~26 KB |
| External JS | 4 KB | 0 |
| Inline JS | 2 KB | 364 B |
| Fonts (first load) | 60 KB | ~44 KB |
| Requests | 12 | 6 |

Plus: every stylesheet is same-origin, and no request leaves the origin at all
(`links.spec.ts`).

## Consequences

- Zero vulnerabilities in the tree, and no browser download beyond the ones the
  e2e suite already needs.
- Failures are deterministic and name the cause: a library was added, an image
  was not optimised, or the Google Fonts `@import` came back.
- Lab metrics (LCP, CLS, TBT) are not scored here. Run Lighthouse by hand
  against the deployed site when that question comes up; field data will come
  from CrUX once the domain has traffic.

## Postscript, 2026-08-28

The budget spent its first weeks asserting nothing. It summed `content-length`,
and `scripts/serve-dist.mjs` omits that header on everything it compresses —
which is exactly the document, the CSS and the JavaScript the budget exists to
watch. All three measured zero and every assertion passed by default; only the
font total and the request count were real.

It now reads `response.body()`, which returns the decoded bytes and cannot be
absent. The thresholds turned out to be honest — the FR document runs at 30.5 kB
against 34 kB — but that was luck, not proof. The lesson generalises: a test
whose assertion can be satisfied by a missing measurement is not a test. Where a
budget is derived from a header, assert that the header is there.

## Postscript, 2026-08-29

The document limit moved from 34 kB to 42 kB. Rebasing the content on the pitch
master added two project cards, four Socios bullets and two stat tiles; the FR
document went from 30.5 kB to 37.6 kB and blew the limit — exactly the "roughly
one more project card" of headroom the original note predicted, spent twice.

Raised rather than absorbed by cutting, because the growth is prose and prose
compresses: that FR document is **8.9 kB brotli on the wire**. The new limit
leaves the same ~4 kB of headroom the old one did.

Worth saying plainly, since this is the move that quietly kills a budget: the
number was raised for content the résumé genuinely gained, measured before and
after. A library, a stray polyfill or an unoptimised asset pushing it over is
the failure the file exists to produce, and is not a reason to touch it again.
