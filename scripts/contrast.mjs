#!/usr/bin/env node
/**
 * WCAG 2.1 contrast calculator for the site's palette.
 *
 * The palette is the LinkedIn cover's since docs/adr/0013: a slate ground, an
 * off-white ink, one terracotta. On a dark ground the accent is lifted for text
 * (--color-accent-text) rather than dimmed, and the button label is the ground
 * colour on the full-strength fill. `--audit` prints the pairs the site ships.
 *
 * Keep TOKENS in step with src/styles/tokens.css by hand.
 */
const TOKENS = {
  bg: '#0e1418',
  surface: '#151d23',
  sunken: '#1d272f',
  divider: '#2a3540',
  text: '#eef2f3',
  muted: '#93a5ae',
  accent: '#c8785e',
  'accent-text': '#d4876c',
  'accent-500': '#d4876c',
  'accent-400': '#dc9479',
  'on-accent': '#0e1418',
};

const toRgb = (hex) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16));
};

const luminance = (hex) => {
  const [r, g, b] = toRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const ratio = (fg, bg) => {
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

/** Flatten `fg` drawn at `alpha` over an opaque `bg` — what `opacity` does. */
export const blend = (fg, bg, alpha) => {
  const f = toRgb(fg);
  const b = toRgb(bg);
  return `#${f
    .map((c, i) => Math.round(c * alpha + b[i] * (1 - alpha)))
    .map((c) => c.toString(16).padStart(2, '0'))
    .join('')}`;
};

const fmt = (n) => n.toFixed(2).padStart(5);
const verdict = (r, large = false) => (r >= (large ? 3 : 4.5) ? 'PASS' : 'FAIL');

if (process.argv.includes('--audit')) {
  const T = TOKENS;
  const grounds = [
    ['bg', T.bg],
    ['surface', T.surface],
    ['sunken', T.sunken],
  ];
  const row = (label, r, large = false) =>
    console.log(`  ${label.padEnd(34)} ${fmt(r)}  ${verdict(r, large)}`);

  console.log('\n— accent as text —');
  for (const [name, bg] of grounds) row(`accent-text on ${name}`, ratio(T['accent-text'], bg));

  console.log('\n— primary button (ground-coloured label on accent fill) —');
  for (const fill of ['accent', 'accent-500', 'accent-400']) {
    row(`on-accent on ${fill} (rest/hover/active)`, ratio(T['on-accent'], T[fill]));
  }

  console.log('\n— ink and muted —');
  for (const [name, bg] of grounds) {
    row(`text on ${name}`, ratio(T.text, bg));
    row(`muted on ${name}`, ratio(T.muted, bg));
  }

  // Text dimmed with `opacity` rather than a token: hero blurb 0.85, concept
  // gloss 0.75, achievement meta 0.7, card body 0.8, facet text 0.9. Measured on the
  // lightest ground each can sit on.
  console.log('\n— ink dimmed by opacity —');
  for (const a of [0.7, 0.75, 0.8, 0.85, 0.9]) {
    for (const [name, bg] of grounds) {
      row(`text @ ${a.toFixed(2)} on ${name}`, ratio(blend(T.text, bg, a), bg));
    }
  }

  // The sticky header is `--color-bg` at 86% over a blur, so its effective
  // background is whatever scrolls beneath it. On this palette the lightest
  // thing that can pass under it is the raised contact panel (surface).
  console.log('\n— sticky header: `text` over the 86% header, by what is beneath —');
  for (const a of [0.65, 0.75]) {
    const cells = grounds.map(([name, under]) => {
      const bg = blend(T.bg, under, 0.86);
      const r = ratio(blend(T.text, bg, a), bg);
      return `${name} ${fmt(r)} ${verdict(r)}`;
    });
    console.log(`  text @ ${a.toFixed(2)}   ${cells.join('   ')}`);
  }
  console.log('');
}
