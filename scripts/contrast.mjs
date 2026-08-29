#!/usr/bin/env node
/**
 * WCAG 2.1 contrast calculator for the Organic palette.
 *
 * Organic's accent-on-cream pairings sat around 2.3–3.0:1, well under the 4.5:1
 * AA threshold for body text, and every text use had to step down a rung to
 * compensate. Draining the ground (docs/adr/0010) removed the problem at the
 * source rather than patching each use. This is what proves it: `--audit`
 * prints the pairs the site actually ships.
 */
const TOKENS = {
  bg: '#f6f5f3',
  surface: '#eeebe7',
  sunken: '#e5e1dc',
  divider: '#dcd7d1',
  text: '#211c18',
  muted: '#686055',
  accent: '#c67139',
  'accent-400': '#f6a06b',
  'accent-600': '#b2622d',
  'accent-700': '#8c491a',
  'accent-800': '#643312',
  'accent-900': '#402310',
  'neutral-100': '#faf9f8',
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

  console.log('\n— muted text, now a token rather than an opacity —');
  for (const [name, bg] of [
    ['bg', T.bg],
    ['surface', T.surface],
    ['sunken', T.sunken],
  ]) {
    const r = ratio(T.muted, bg);
    console.log(`  muted on ${name.padEnd(8)} ${fmt(r)}  ${verdict(r)}`);
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
