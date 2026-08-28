# 4. Content as typed modules, not a validated collection

- Status: accepted
- Date: 2026-08-28

## Context

The canvas keeps all copy in a `DATA` object with an `en` and an `fr` branch —
already cleanly separated from the markup. It has to land somewhere the two
locales cannot silently diverge.

The obvious Astro answer is a content collection: JSON files validated by a Zod
schema at build time.

## Decision

Two TypeScript modules, `src/content/en.ts` and `fr.ts`, each declared
`satisfies ResumeContent` against a shared interface in `types.ts`.

Zod validates data at runtime, which earns its keep when content arrives from a
CMS, an API or a non-developer. Here it is authored in the repo by the person
who owns the types. TypeScript already rejects a missing or misspelled key
before the build runs — `astro check` is the gate — and a runtime schema over
data the compiler has already proven would be ceremony.

What types cannot express is enforced by `tests/content.spec.ts`:

- both locales have the same shape **and the same array lengths at every depth**
  (five projects in English is five projects in French);
- no empty or whitespace-only strings;
- the prose is actually translated, not copied through — asserted per path, so
  tech stacks and dates are allowed to be identical;
- the phone number never appears in a content string (see ADR 5).

## Consequences

- A forgotten translation fails the build or the test suite, never ships.
- Editing copy means editing TypeScript. For a single-author repo that is a
  feature: autocomplete and compile errors.
- Moving to a CMS later means adding the runtime schema back. The interface is
  already the contract to validate against.
