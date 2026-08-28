# 3. The design system file is copied verbatim, corrections live elsewhere

- Status: accepted
- Date: 2026-08-28

## Context

The canvas project carries a design system, "Organic", as a single
`styles.css`: tokens plus component classes. It is the source of truth for the
look and will be retuned upstream.

Parts of it do not survive contact with WCAG. `--color-accent` (#c67139) scores
3.03:1 on `--color-bg` and 2.69:1 on `--color-surface`, under the 4.5:1 floor for
body text — and it is the default for links, kickers and the primary button
fill. Its `@import` of fonts.googleapis.com is also a render-blocking
third-party request on the critical path.

## Decision

`src/styles/tokens.css` is a byte-for-byte copy of the upstream file, with one
change: the Google Fonts `@import` is removed (the faces are self-hosted from
`@fontsource`; see `scripts/sync-fonts.mjs`).

Everything else — layout, responsiveness, reduced motion, and the contrast
corrections — lives in `src/styles/app.css`, in a clearly marked block. Nothing
overrides a token; the corrections step down the **same ramp**, from
`--color-accent` to `--color-accent-700` (5.72:1 / 5.09:1). Hue and family are
unchanged; only the value moves. Decorative uses of `--color-accent` that carry
no text are untouched.

`scripts/contrast.mjs --audit` prints the measurements the choice was made from.

## Consequences

- An upstream retune can be diffed straight against `tokens.css`.
- Every deviation is greppable in one file, with its ratio in the comment.
- If upstream fixes its own contrast, the override block shrinks rather than
  conflicting.
