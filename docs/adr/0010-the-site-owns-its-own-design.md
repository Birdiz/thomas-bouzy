# 10. The site owns its own design, and stops opening on a CV

- Status: accepted
- Date: 2026-08-29
- Supersedes the design half of [ADR 3](0003-design-system-copied-verbatim.md) and
  [ADR 9](0009-the-pitch-master-owns-the-copy.md)

## Context

Thomas's verdict on the page, in his words: too focused on his CV, and the
colours were not great. Both halves turned out to be true, and neither had the
cause he assumed.

Rather than react to the one reference he offered, four sites that sell
engineering were measured — palette, typography and section order pulled from
the live DOM.

| | Ground | Text | Accent | Type |
| --- | --- | --- | --- | --- |
| hexquarter | `#fff` | `#0b0b0c` | none at all | Inter + Inter Tight + **JetBrains Mono ×57** |
| thoughtbot | `#eae6e4` warm | `#201313` **brown-black** | `#ffe7a3`, **14 uses on the page** | PPMori + Cosmica + **JetBrains Mono ×30** |
| 37signals | `#f0b103` saturated yellow, full-bleed | white | the ground *is* the accent | one face, Lab Grotesque 700 |
| staffeng | `#fff` | `#000` | default link blue | Avenir Next, almost nothing |

Two findings did the work.

**On colour.** Organic's ground `#f5ead8` measures 59% saturation. thoughtbot's
is 12%, hexquarter's hairline 7%. Five times too hot is what reads as "not
quite professional" — and it is the same fact behind every contrast patch this
repo had accumulated (deltas 8, 9, 22): an accent that has to be dimmed a rung
for every piece of text it touches is an accent fighting its ground.

Nobody in the sample uses a medium amount of colour everywhere. They either
drain it to almost nothing or make it the entire ground. This page did the one
thing none of them do.

Thomas also said he did not want black and white — and thoughtbot is the proof
he does not have to. Every one of its swatches is warm, its text included.

**On structure.** All four put the person last: hexquarter's founder is section
07 of 07, thoughtbot's "Our company" is 7th of 10 behind a headline that names
the client's stake rather than the vendor's identity. This site's seven sections
all answered "who is Thomas". That, not the palette, is what made it read as a
CV — and a palette change alone would have produced a prettier CV.

## Decision

**The site owns its design.** `src/styles/tokens.css` stops being a byte-for-byte
copy of the canvas's `styles.css`. ADR 3's diffability was worth having while the
canvas led; it is worth nothing now that the fork is deliberate. ADR 9's split —
canvas owns design, pitch master owns copy — loses its first half. The pitch
master still owns the career facts.

**Colour is inverted rather than replaced.** The ground keeps its hue (37°, the
same amber) and drops from 59% to 13–17% saturation. Text becomes a warm
near-black, never `#000`. The accent keeps every bit of its saturation and is
spent on the section numbers, the primary button and the links — nowhere else.
Organic's second accent, the green, is gone entirely: one accent hue, not two.

Contrast then stops being something to patch. `--color-accent-700` measures
6.25:1 on the ground and 5.73:1 on surface, against 5.72 / 5.09 before, and the
inactive language switch clears AA over the dark panel at its original opacity —
delta 22 fixed at the source rather than at the symptom.

**Type carries structure.** Caprasimo is dropped: a rounded display face reads
friendly, and the page no longer wants to be friendly first. Figtree carries
both prose and headings; JetBrains Mono carries the numbered eyebrow above every
section. That eyebrow is the single device both engineering references lean on,
and it is the cheapest way to stop reading as a portfolio.

**The page opens on the problem and closes on the person.**

```
Hero → stats band
01  The problem        what breaks, and what it costs — new
02  Work               six systems, already framed context → approach → result
03  Approach           four positions, each with its price — new
04  Track record       the CV, demoted
05  Toolkit            the stack, at its three honesty levels
06  About              the person, second to last
    Contact
```

Only section 01 is new writing. Section 03 is lifted from the pitch master's §4,
which was already written and had never reached the page — and it is the section
that changes the register, because **having an argued opinion is the thing a CV
never does**.

## Consequences

- Resynchronising the canvas no longer means anything for the design. Three
  reads of it produced one small change; a fourth would produce nothing worth
  having.
- The contrast corrections block in `app.css` shrinks to a budget rather than a
  fix, which is what ADR 3 predicted would happen if the ground were ever
  addressed upstream. It was addressed here instead.
- `scripts/contrast.mjs` audits the new palette; its accent-2 block is gone with
  the hue it measured.
- The document budget moves 42 kB → 50 kB for two new sections of prose
  ([ADR 6](0006-budget-tests-instead-of-lighthouse-ci.md)). Fonts held: Caprasimo
  left as JetBrains Mono arrived.
- `docs/design-deltas.md` keeps only what still describes a real departure. Most
  of it was written against a canvas the site no longer follows on design, and
  the file says so at the top rather than being deleted — the reasoning behind
  the accessibility and privacy entries outlived the comparison that produced it.
