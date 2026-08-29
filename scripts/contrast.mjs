#!/usr/bin/env node
/**
 * WCAG 2.1 contrast calculator for the Organic palette.
 *
 * The design system's accent-on-cream pairings sit around 2.3–3.0:1, well under
 * the 4.5:1 AA threshold for body text. This works out which token to swap in
 * so the fix is a measurement, not a guess. `--audit` prints the pairs the site
 * actually uses.
 */
const TOKENS = {
  bg: '#f5ead8',
  surface: '#ebddc5',
  text: '#201e1d',
  accent: '#c67139',
  'accent-400': '#f6a06b',
  'accent-600': '#b2622d',
  'accent-700': '#8c491a',
  'accent-800': '#643312',
  'accent-900': '#402310',
  'accent-2-100': '#f0fae1',
  'accent-2-700': '#56633f',
  'accent-2-800': '#3d472b',
  'accent-2-900': '#272e1b',
  'neutral-100': '#f9f4ed',
  'neutral-800': '#474238',
  'neutral-900': '#2e2b25',
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
  console.log('\n— accent as text —');
  for (const fg of ['accent', 'accent-600', 'accent-700', 'accent-800']) {
    for (const [bgName, bg] of [
      ['bg', T.bg],
      ['surface', T.surface],
    ]) {
      const r = ratio(T[fg], bg);
      console.log(`  ${fg.padEnd(11)} on ${bgName.padEnd(8)} ${fmt(r)}  ${verdict(r)}`);
    }
  }

  console.log('\n— primary button (cream text on accent fill) —');
  for (const fill of ['accent', 'accent-600', 'accent-700', 'accent-800']) {
    const r = ratio(T.bg, T[fill]);
    console.log(`  bg on ${fill.padEnd(11)} ${fmt(r)}  ${verdict(r)}`);
  }

  console.log('\n— accent-2 as text (project facet labels) —');
  for (const fg of ['accent-2-700', 'accent-2-800', 'accent-2-900']) {
    for (const [bgName, bg] of [
      ['bg', T.bg],
      ['surface', T.surface],
      ['accent-2-100', T['accent-2-100']],
    ]) {
      const r = ratio(T[fg], bg);
      console.log(`  ${fg.padEnd(13)} on ${bgName.padEnd(13)} ${fmt(r)}  ${verdict(r)}`);
    }
  }

  console.log('\n— muted body text: minimum opacity of `text` to clear 4.5:1 —');
  for (const [bgName, bg] of [
    ['bg', T.bg],
    ['surface', T.surface],
    ['accent-2-100', T['accent-2-100']],
  ]) {
    for (let a = 0.5; a <= 1.001; a += 0.05) {
      const r = ratio(blend(T.text, bg, a), bg);
      if (r >= 4.5) {
        console.log(`  on ${bgName.padEnd(13)} needs opacity >= ${a.toFixed(2)}  (${fmt(r)})`);
        break;
      }
    }
  }

  // The sticky header is `--color-bg` at 86% over a blur, so its effective
  // background is whatever scrolls beneath it. The worst case is not a card:
  // it is the dark contact panel (--color-neutral-900), which composites the
  // header down to #d9cfbf — the exact value axe reports when it fails the
  // language switch. The block above, which assumes a solid ground, is what let
  // that switch ship at 0.65 and measure 4.29:1 in place.
  console.log('\n— sticky header: `text` over the 86% header, by what is beneath —');
  {
    const beneath = [
      ['ground', T.bg],
      ['surface', T.surface],
      ['dark panel', T['neutral-900']],
    ];
    for (const a of [0.65, 0.7, 0.75, 0.8]) {
      const cells = beneath.map(([name, under]) => {
        const bg = blend(T.bg, under, 0.86);
        const r = ratio(blend(T.text, bg, a), bg);
        return `${name} ${fmt(r)} ${verdict(r)}`;
      });
      console.log(`  text @ ${a.toFixed(2)}   ${cells.join('   ')}`);
    }
  }

  console.log('\n— dark contact panel —');
  for (const a of [0.6, 0.7, 0.75, 0.8, 0.9, 1]) {
    const r = ratio(blend(T['neutral-100'], T['neutral-900'], a), T['neutral-900']);
    console.log(`  neutral-100 @ ${a.toFixed(2)} on neutral-900  ${fmt(r)}  ${verdict(r)}`);
  }
  console.log(
    `  accent-400 on neutral-900        ${fmt(ratio(T['accent-400'], T['neutral-900']))}  ${verdict(ratio(T['accent-400'], T['neutral-900']))}`,
  );
  console.log('');
}
