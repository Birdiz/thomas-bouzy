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
| Document | 34 KB | ~25 KB |
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
