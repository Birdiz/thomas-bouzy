# 21. One family

- Status: accepted, implemented 2026-10-06
- Date: 2026-10-06
- Supersedes the type half of [ADR 13](0013-the-site-wears-the-linkedin-cover.md)

## Context

ADR 13 set every heading in Spectral 500 so the site would match the serif
title on the LinkedIn cover. Figtree was kept for prose at 400, and Figtree 700
was dropped to stay inside the 60 kB font budget ([ADR 6](0006-budget-tests-instead-of-lighthouse-ci.md)).
Figtree 800 later came back, latin only, for the one heavy line on the home
page — the invitation to the Audit — and the limit moved to 72 kB to pay for it.

Thomas does not like Spectral as the site's main face, and noticed that Figtree
barely shows. An audit of the computed styles agreed, and found why: Figtree
was rendering about half the page, but at one weight, mostly muted, and never
at a size where its shapes read. Everything large or in full ink was Spectral;
everything in capitals was the mono.

The audit also found that the roles had drifted, whatever the faces:

- One price in three faces: a sentence, "à partir de … puis …", in the code
  face under an Offer's title, the estimator's figure in Spectral, the day rate
  in Figtree.
- "Client · period" in Figtree on the home page and in the mono on the Offer
  pages.
- `.table th` in a synthesised bold, since no 700 face is loaded.

## Options

**Keep Spectral and add a Figtree heading weight.** Any Figtree weight is
~11.4 kB, on top of a budget that had already been raised once for 800.

**Keep Spectral for a small role** (the client quotes, the name) and give the
headings to Figtree. Spectral costs its 22.3 kB however little it sets.

**Drop Spectral.** One Figtree weight costs half of what the serif did. It is
all or nothing, and this is the option that pays for itself.

## Decision

**Figtree carries the headings at 600.** `--font-heading` is Figtree and
`--font-heading-weight` is 600, so every rule that read the token followed. 600
and 700 were compared on the hero: on a dark ground the light text already reads
heavier than it is, the two were hard to tell apart, and 600 is the lighter one.
800 stays for the invitation to the Audit, the one line meant to be heavier
than a heading.

**Weight tells voice from title.** The client's sentences — the problem rows
and the Offer pages — are 400 at full ink: someone speaking, not a heading.

**Each face has one job.**

- Figtree 600 — what you remember: headings, the hero promise, card titles,
  the name, the estimator's answer.
- Figtree 400 — what you read and press: prose, ledes, client sentences,
  controls, metadata, prices inside a sentence.
- JetBrains Mono 400 — structure only: tracked-capital labels (eyebrows, `dt`,
  `th`, badges) and ordinals. Never a sentence, a price or a date.

So the price under an Offer's title and the Offer pages' metadata leave the
mono, and the table headers join it. Figures that sit in a column or update
live (the estimator, the prices) use `tabular-nums`.

**The social card follows.** The name is Figtree 600 in `scripts/build-og.mjs`,
and `public/og.png` was re-rendered.

## Consequences

- Fonts on the home page measure 55.5 kB (Figtree 400, 600 and 800 + JetBrains
  Mono, latin), down from 66.8 kB. The budget goes back from 72 kB to 60 kB:
  the page no longer needs the room.
- `@fontsource/spectral` is no longer a dependency, and its files left
  `public/fonts/`.
- The serif half of ADR 13's argument — that a visitor arriving from LinkedIn
  should recognise the cover's title face — is given up. The slate, the ridge,
  the terracotta glow and the portrait still carry the resemblance. If the
  cover is redrawn, setting its title in Figtree would close the gap.
