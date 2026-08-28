#!/usr/bin/env node
/**
 * Answers one question for CI: should this push deploy to GitHub Pages?
 *
 * public/CNAME makes Pages serve the site at that hostname and nowhere else.
 * While the hostname is a placeholder, deploying produces a site that is
 * unreachable — worse than not deploying. Flip SITE.domainConfirmed once the
 * DNS is real.
 */
import { appendFileSync } from 'node:fs';
import { SITE } from '../src/site.ts';

const ready = SITE.domainConfirmed === true;

console.log(
  ready
    ? `Custom domain confirmed (${SITE.domain}) — deploying.`
    : `SITE.domainConfirmed is false (domain: ${SITE.domain}) — verifying only, not deploying.`,
);

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `ready=${ready}\n`);
}
if (!ready && process.env.CI) {
  console.log(
    '::notice::Pages deploy skipped: set the real domain in src/site.ts and public/CNAME, then flip SITE.domainConfirmed to true.',
  );
}
