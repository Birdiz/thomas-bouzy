# 13. The site wears the LinkedIn cover

- Status: accepted; type superseded by [ADR 21](0021-one-family.md), 2026-10-06
- Date: 2026-09-16
- Supersedes the colour and type half of [ADR 10](0010-the-site-owns-its-own-design.md)

## Context

Thomas made a new LinkedIn cover and avatar, and liked them enough to want the
site to follow. The cover is a slate night (`#0e1418`), layered mountain ridges
with a terracotta rim and glow, a serif title in off-white, and tracked capitals
in grey and terracotta. The avatar is the same photo as before, cut out onto a
dark ground with the same warm glow, at 1000×1000.

Most people who reach this site come from LinkedIn ([ADR 1](0001-astro-static-site.md)).
They left a dark, serif, mountain-lit page and landed on a warm near-white one
in a rounded sans. The two did not look like the same person.

Three options were weighed: swap only the portrait and the social card, add a
dark hero band over a light page, or move the whole site. Thomas chose the
whole site.

Two things were worth arguing before doing it.

**Does this undo ADR 10?** Only the half about lightness. ADR 10's finding was
about *saturation*: Organic's ground was 59% saturated and read as "not quite
professional"; the studios that sell engineering either drain colour to almost
nothing or make it the whole ground. The cover's slate is a drained ground on
the dark side. The rules that did the work — one accent hue, spent on the
section numbers, the primary button and the links — carry over unchanged, and
the cover's terracotta is within a few steps of the one the site already had.

**Should the card copy the cover's words?** No. The cover is a LinkedIn headline:
"Senior Backend Engineer — Architecture", a stack list, "Full remote — EU". That
is the job-title-and-stack register [ADR 11](0011-the-page-is-not-a-cv.md) took
off this page. The look travels; the words don't.

## Decision

**The palette is the cover's.** Ground `#0e1418`, surface and sunken each a step
*lighter* (on a dark ground "raised" means lighter; the token names and their
uses are unchanged), ink `#eef2f3`, muted `#93a5ae`, accent `#c8785e`.
Components now read semantic tokens — `--color-accent-text` for accent-coloured
text, `--color-on-accent` for a label on an accent fill — instead of a rung of
the ramp, so the ramp keeps its usual 100-light / 900-dark meaning. Every text
pairing clears AA with room to spare; `npm run contrast` prints them.

**Dark only.** No light theme, no `prefers-color-scheme` switch. A toggle would
double the contrast surface and bring back the palette this replaces.

**Spectral carries the headings.** 500 weight, latin and latin-ext, self-hosted
like the rest. Figtree stays for prose at 400; JetBrains Mono stays for the
numbered eyebrows. Figtree 700 is dropped: nothing bold is set in the sans any
more, and keeping it would have pushed fonts past the 60 kB budget
([ADR 6](0006-budget-tests-instead-of-lighthouse-ci.md)). Fonts measure 55.4 kB;
the limit did not move. Buttons and the language switch are set in Figtree —
a control is not a title.

**The ridge is the one illustration.** Its paths live once, in `src/art/ridge.ts`,
and are drawn by the hero (`Ridge.astro`, inline SVG, static, `aria-hidden`) and
by the social card (`scripts/build-og.mjs`). In the hero it is mirrored so the
crest and glow rise behind the portrait, and masked so no text is ever set over
the slate. The drifting blobs are gone.

**The contact panel is raised, not inverted.** It was a dark block on a light
page; on a dark page that would vanish. It is now a surface with a hairline edge
and a low terracotta glow, and its outline buttons use the ordinary text colour.

**The social card borrows the look and the hero's sentence.** Slate ground,
ridge, a short terracotta rule, the name in Spectral, then "I design
transactional systems that have to stay correct while they stay up." and a
single "Backend & architecture" eyebrow. No job title, no stack.

**The portrait is the LinkedIn avatar.** 1000×1000 clears the 580px minimum
`assets:check` had been warning about. `.washed` is reduced to a light
desaturation: the old brightness and opacity lift was there to sit a photo on a
light ground and reads as haze on this one.

## Consequences

- `docs/design-deltas.md` entries 8 and 22 describe contrast problems of the
  light palette. They stay as history; the note at the top of that file says so.
- `scripts/contrast.mjs` models the new grounds, the opacity-dimmed text and the
  sticky header over each ground. The dark-panel block is gone with the panel.
- The `<title>` and meta description still say "Senior Software Engineer". That
  is a copy question for ADR 11's owner, not a design one, and is left open.
- The cutout on the avatar has a faint light halo along its edge. The circular
  crop hides most of it; a cleaner export from the source photo would hide the
  rest.
- Re-run `npm run og` whenever the ridge, the palette or the card's sentence
  changes: `public/og.png` and `apple-touch-icon.png` are committed outputs.
