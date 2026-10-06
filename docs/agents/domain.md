# Domain Docs

This repo has a single context: one glossary and one ADR series.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root: the glossary.
- **`docs/adr/`**: the ADRs that touch the area you're about to work in.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a
hypothesis, a test name, a commit message), use the term as defined in
`CONTEXT.md`, never a synonym it lists under _Avoid_.

A concept missing from the glossary is a signal: either you're inventing language
the project doesn't use (reconsider) or there's a real gap (note it for
`/domain-modeling`).

## Flag ADR conflicts

When your output contradicts an existing ADR, say so explicitly instead of
silently overriding it:

> _Contradicts ADR 8 (Railway is the only deploy target), but worth reopening because…_
