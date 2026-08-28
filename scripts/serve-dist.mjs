#!/usr/bin/env node
/**
 * Foreground static server for dist/.
 *
 * `astro preview` daemonises in Astro 7 — the foreground process exits as soon
 * as the background server is up, which Playwright reads as "webServer exited
 * early". This serves the same directory and stays in the foreground, so the
 * e2e suite runs against the real built output with real content types and real
 * 404s.
 *
 *   node scripts/serve-dist.mjs [--port 4322] [--root dist]
 */
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const port = Number(flag('port', 4322));
const root = resolve(flag('root', 'dist'));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.pdf': 'application/pdf',
};

async function resolveFile(pathname) {
  // Contain the request inside root: no `..`, no absolute escapes.
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const target = join(root, safe);
  if (target !== root && !target.startsWith(root + sep)) return null;

  const candidates = extname(target)
    ? [target]
    : [join(target, 'index.html'), `${target}.html`, target];

  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return { path: candidate, size: info.size };
    } catch {
      // try the next candidate
    }
  }
  return null;
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', `http://localhost:${port}`);
  const file = await resolveFile(pathname);

  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  res.writeHead(200, {
    'content-type': TYPES[extname(file.path).toLowerCase()] ?? 'application/octet-stream',
    'content-length': file.size,
    'cache-control': 'no-store',
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  createReadStream(file.path).pipe(res);
});

server.listen(port, () => {
  console.log(`Serving ${root} on http://localhost:${port}`);
});
