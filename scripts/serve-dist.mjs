#!/usr/bin/env node
/**
 * The production server, and the one the e2e suite runs against.
 *
 * `astro preview` daemonises in Astro 7 — its foreground process exits as soon
 * as the background server is up, which Playwright reads as "webServer exited
 * early". This stays in the foreground, so the tests exercise exactly what
 * ships: the same headers, the same compression, the same 404.
 *
 *   node scripts/serve-dist.mjs [--port 4322] [--root dist]
 *
 * PORT and HOSTNAME from the environment win over the flags, which is what
 * Railway injects.
 */
import { createHash } from 'node:crypto';
import { createReadStream, readFileSync } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { createBrotliCompress, createGzip, constants as zlib } from 'node:zlib';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const port = Number(process.env.PORT ?? flag('port', 4322));
const hostname = process.env.HOSTNAME ?? flag('host', '0.0.0.0');
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

/** Worth compressing: text formats. Images, fonts and PDFs are already packed. */
const COMPRESSIBLE = /^(text\/|application\/(json|xml|javascript))|\+xml/;

/**
 * Content-Security-Policy is built from the built output rather than written by
 * hand: every inline <script> in dist/ is hashed, so the policy needs no
 * 'unsafe-inline' and breaks loudly if a script appears that nobody expected.
 */
async function collectScriptHashes(dir) {
  const hashes = new Set();
  for (const entry of await readdir(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || extname(entry.name) !== '.html') continue;
    const html = readFileSync(join(entry.parentPath ?? entry.path, entry.name), 'utf8');
    for (const match of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
      hashes.add(`'sha256-${createHash('sha256').update(match[1], 'utf8').digest('base64')}'`);
    }
  }
  return [...hashes];
}

const scriptHashes = await collectScriptHashes(root);

const CSP = [
  "default-src 'none'",
  `script-src 'self' ${scriptHashes.join(' ')}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  // No `upgrade-insecure-requests`. Every subresource URL here is root-relative
  // and inherits the page's scheme, so there is no mixed content for it to fix
  // — and it breaks the site outright over plain HTTP, because it rewrites
  // those requests to https:// where no TLS exists. Chromium exempts localhost;
  // WebKit does not, and failed every stylesheet and font with a TLS error.
].join('; ');

/** Security headers the platform will not add for us. */
const SECURITY_HEADERS = {
  'content-security-policy': CSP,
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'geolocation=(), camera=(), microphone=(), interest-cohort=()',
  'cross-origin-opener-policy': 'same-origin',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
};

/**
 * Astro fingerprints what it emits into /_astro/, and the font filenames carry
 * their version. Those can be cached for a year. HTML must revalidate, or a
 * deploy would not reach anyone still holding a copy.
 */
function cacheControl(pathname, mime) {
  if (pathname.startsWith('/_astro/') || pathname.startsWith('/fonts/')) {
    return 'public, max-age=31536000, immutable';
  }
  if (mime.startsWith('text/html')) return 'public, max-age=0, must-revalidate';
  return 'public, max-age=3600';
}

function negotiateEncoding(header = '') {
  if (/\bbr\b/.test(header)) return 'br';
  if (/\bgzip\b/.test(header)) return 'gzip';
  return null;
}

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
      if (info.isFile()) return { path: candidate, size: info.size, mtime: info.mtime };
    } catch {
      // try the next candidate
    }
  }
  return null;
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { allow: 'GET, HEAD', ...SECURITY_HEADERS });
    res.end();
    return;
  }

  const file = (await resolveFile(pathname)) ?? (await resolveFile('/404.html'));
  const found = Boolean(await resolveFile(pathname));

  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8', ...SECURITY_HEADERS });
    res.end('404 Not Found');
    return;
  }

  const mime = TYPES[extname(file.path).toLowerCase()] ?? 'application/octet-stream';
  const encoding = COMPRESSIBLE.test(mime)
    ? negotiateEncoding(req.headers['accept-encoding'])
    : null;

  const headers = {
    'content-type': mime,
    'cache-control': found ? cacheControl(pathname, mime) : 'no-store',
    'last-modified': file.mtime.toUTCString(),
    vary: 'Accept-Encoding',
    ...SECURITY_HEADERS,
  };
  if (encoding) headers['content-encoding'] = encoding;
  else headers['content-length'] = file.size;

  res.writeHead(found ? 200 : 404, headers);
  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  const stream = createReadStream(file.path);
  if (!encoding) {
    stream.pipe(res);
    return;
  }
  const compressor =
    encoding === 'br'
      ? createBrotliCompress({ params: { [zlib.BROTLI_PARAM_QUALITY]: 5 } })
      : createGzip({ level: 6 });
  stream.pipe(compressor).pipe(res);
});

server.listen(port, hostname, () => {
  console.log(`Serving ${root} on http://${hostname}:${port}`);
  console.log(`CSP pinned to ${scriptHashes.length} inline script hash(es).`);
});
