# Source images

Images that Astro processes at build time — optimised, resized and served as
AVIF/WebP. Anything that must keep its exact filename and be served verbatim
(the PDFs, the fonts, `og.png`) belongs in `public/` instead.

Git does not track empty directories, so this file is what keeps the folder
here after a clone.

## portrait.*

The hero portrait. Drop the file in as:

    src/assets/portrait.jpg      # .jpeg, .png, .webp and .avif also work

`Hero.astro` picks it up through `import.meta.glob`, so there is nothing to
wire: it appears on the next build. Until then the hero renders a labelled
placeholder rather than an empty circle, and `npm run assets:check` lists it as
pending.

Two things about the source file:

- **Square, not pre-cropped to a circle.** The CSS applies `border-radius` and
  `object-fit: cover` itself, at 290 / 220 / 150 px depending on the viewport. A
  square source lets it crop cleanly at all three. A circular PNG on a
  transparent background works too.
- **At least 580px on the short side.** Astro emits widths of 300, 440 and 580;
  a smaller source is upscaled and will look soft on a Retina screen.
  `npm run assets:check` measures the file and warns when it falls short — the
  one currently in the repo is 500×500, so that warning is live.

Name the file for what it is: the first version shipped as `portrait.jpg` while
actually being a PNG. `Hero.astro`'s glob matches on the name, so nothing
noticed. `assets:check` now compares the real format against the extension.

The design system's `.washed` filter (desaturate, soften contrast) is applied on
top.
