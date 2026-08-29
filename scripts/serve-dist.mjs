#!/usr/bin/env node
/**
 * The production server, and the one the e2e suite runs against.
 *
 * `astro preview` daemonises in Astro 7 — its foreground process exits as soon
 * as the background server is up, which Playwright reads as "webServer exited
 * early". This stays in the foreground, so the tests exercise exactly what
 * ships: the same headers, the same compression, the same redirects, the same
 * 404.
 *
 *   node scripts/serve-dist.mjs [--port 4322] [--host 0.0.0.0] [--root dist]
 *
 * PORT and HOST from the environment win over the flags, which is what Railway
 * injects. HOSTNAME is accepted as a fallback but is NOT the primary name:
 * shells and container runtimes routinely set it to the machine's own hostname,
 * which would make listen() bind somewhere unexpected or fail outright.
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
const host = process.env.HOST ?? process.env.HOSTNAME ?? flag('host', '0.0.0.0');
const root = resolve(flag('root', 'dist'));

/**
 * Whether this deployment is the canonical, indexable one.
 *
 * The same flag drives robots.txt and the <meta name="robots"> at build time
 * (see src/site.ts); here it adds the header, which reaches crawlers that never
 * parse the HTML. Absent means "not the real domain yet" — a temporary
 * *.up.railway.app hostname must not be indexed, or the day the custom domain
 * lands it competes with the site it is supposed to become.
 */
const INDEXABLE = /^(1|true|yes)$/i.test((process.env.SITE_INDEXABLE ?? '').trim());

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
 * hand: every inline <script> and <style> in dist/ is hashed, so the policy
 * needs no 'unsafe-inline' at all and breaks loudly if something appears that
 * nobody expected.
 */
const sha256 = (source) =>
  `'sha256-${createHash('sha256').update(source, 'utf8').digest('base64')}'`;

async function collectInlineHashes(dir) {
  const scripts = new Set();
  const styles = new Set();
  for (const entry of await readdir(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || extname(entry.name) !== '.html') continue;
    const html = readFileSync(join(entry.parentPath ?? entry.path, entry.name), 'utf8');
    for (const match of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
      scripts.add(sha256(match[1]));
    }
    for (const match of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
      styles.add(sha256(match[1]));
    }
  }
  return { scripts: [...scripts], styles: [...styles] };
}

const inlineHashes = await collectInlineHashes(root);

const CSP = [
  "default-src 'none'",
  `script-src 'self' ${inlineHashes.scripts.join(' ')}`.trim(),
  // Hash-based, like script-src. The built HTML carries no style="" attribute —
  // those would need 'unsafe-hashes', which is why tests/e2e/serving.spec.ts
  // asserts the pages render with no CSP violation in the console.
  `style-src 'self' ${inlineHashes.styles.join(' ')}`.trim(),
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
  // Redundant with frame-ancestors for anything current, free for the rest.
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'geolocation=(), camera=(), microphone=(), interest-cohort=()',
  'cross-origin-opener-policy': 'same-origin',
  'cross-origin-resource-policy': 'same-origin',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  ...(INDEXABLE ? {} : { 'x-robots-tag': 'noindex, nofollow' }),
};

/**
 * Astro fingerprints what it emits into /_astro/, and the font filenames carry
 * their version. Those can be cached for a year. HTML must revalidate, or a
 * deploy would not reach anyone still holding a copy — which is exactly why the
 * conditional-request handling below matters: revalidating costs a 304, not the
 * whole document.
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

/**
 * Strong, and distinct per encoding.
 *
 * The obvious implementation is one weak ETag per file, since the bytes on the
 * wire vary with the negotiated encoding. It is also useless behind a CDN:
 * Cloudflare propagates strong validators only — it dropped the weak one
 * outright, so no visitor ever revalidated and every repeat view refetched the
 * whole document.
 *
 * Folding the encoding into the tag is the better answer anyway. HTTP wants a
 * validator per *representation*, and `identity`, `gzip` and `br` are three
 * representations of one file. Each now gets its own strong tag, which is both
 * more correct than the weak one and something a CDN will carry.
 */
function etagFor(file, encoding) {
  const suffix = encoding ? `-${encoding}` : '';
  return `"${file.size.toString(16)}-${file.mtime.getTime().toString(16)}${suffix}"`;
}

function isFresh(req, etag, mtime) {
  const ifNoneMatch = req.headers['if-none-match'];
  if (ifNoneMatch) {
    const bare = (tag) => tag.trim().replace(/^W\//, '');
    return ifNoneMatch.split(',').some((tag) => tag.trim() === '*' || bare(tag) === bare(etag));
  }
  const ifModifiedSince = req.headers['if-modified-since'];
  if (ifModifiedSince) {
    const since = Date.parse(ifModifiedSince);
    // Last-Modified is second-resolution on the wire; compare at that grain.
    return Number.isFinite(since) && Math.floor(mtime.getTime() / 1000) * 1000 <= since;
  }
  return false;
}

/**
 * The one spelling of a path we are willing to serve a 200 for.
 *
 * Without this, `/fr`, `/fr/`, `/fr//`, `//fr/` and `/fr/index.html` all
 * answered 200 with an identical body: five URLs for one page. rel=canonical
 * cleans that up after the fact; a 301 means the crawler never spends the
 * request. Directory paths gain their trailing slash in the caller, which needs
 * the filesystem to know it is a directory.
 */
function canonicalise(pathname) {
  const collapsed = pathname.replace(/\/{2,}/g, '/');
  const withoutIndex = collapsed.replace(/(^|\/)index\.html$/, '$1');
  return withoutIndex === '' ? '/' : withoutIndex;
}

async function resolveFile(pathname) {
  // Contain the request inside root: no `..`, no absolute escapes.
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const target = join(root, safe);
  if (target !== root && !target.startsWith(root + sep)) return null;

  const directoryIndex = join(target, 'index.html');
  const candidates = extname(target) ? [target] : [directoryIndex, `${target}.html`, target];

  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) {
        return {
          path: candidate,
          size: info.size,
          mtime: info.mtime,
          isDirectoryIndex: candidate === directoryIndex,
        };
      }
    } catch {
      // try the next candidate
    }
  }
  return null;
}

function send(res, status, headers, body) {
  res.writeHead(status, { ...headers, ...SECURITY_HEADERS });
  res.end(body);
}

async function handle(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, { allow: 'GET, HEAD', 'content-type': 'text/plain; charset=utf-8' }, '');
    return;
  }

  // The request target is split by hand rather than handed to `new URL()`: a
  // target beginning with `//` is a protocol-relative URL to that constructor,
  // so `GET //fr/` silently became a request for `/` — served 200, wrong page,
  // and invisible to the redirect below.
  const target = req.url ?? '/';
  const badRequest = () =>
    send(
      res,
      400,
      { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
      '400 Bad Request',
    );

  if (!target.startsWith('/')) {
    // Absolute-form and authority-form targets are for proxies, which we are not.
    badRequest();
    return;
  }
  const queryAt = target.indexOf('?');
  const rawPath = queryAt === -1 ? target : target.slice(0, queryAt);
  const search = queryAt === -1 ? '' : target.slice(queryAt);

  // A malformed percent-escape (`/%`) makes decodeURIComponent throw. Inside an
  // async handler that became an unhandled rejection and took the whole process
  // down with it — one request was enough to end the deploy. It is a 400.
  let decoded;
  try {
    decoded = decodeURIComponent(rawPath);
  } catch {
    badRequest();
    return;
  }

  // No legitimate URL on this site carries a `.` or `..` segment. Refusing them
  // outright beats redirecting to a normalised traversal path and beats relying
  // solely on the containment check in resolveFile().
  if (decoded.split('/').some((segment) => segment === '.' || segment === '..')) {
    badRequest();
    return;
  }

  const canonical = canonicalise(decoded);
  const location = encodeURI(canonical);
  if (location !== rawPath) {
    // Never redirect somewhere that would redirect again. `location` is what the
    // client will send back, so re-deriving it from itself has to be a fixed
    // point; if it is not, the escaping is something this server does not model
    // and a 400 beats a loop.
    if (encodeURI(decodeURIComponent(location)) !== location) {
      badRequest();
      return;
    }
    send(res, 301, { location: location + search, 'cache-control': 'no-store' }, '');
    return;
  }

  const hit = await resolveFile(canonical);

  // `/fr` is a directory: it is spelled `/fr/`, the way LOCALE_PATH and the
  // canonical link spell it.
  if (hit?.isDirectoryIndex && !canonical.endsWith('/')) {
    send(
      res,
      301,
      { location: `${encodeURI(canonical)}/${search}`, 'cache-control': 'no-store' },
      '',
    );
    return;
  }

  const file = hit ?? (await resolveFile('/404.html'));
  if (!file) {
    send(
      res,
      404,
      { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
      '404 Not Found',
    );
    return;
  }

  const mime = TYPES[extname(file.path).toLowerCase()] ?? 'application/octet-stream';

  // Negotiated before the validator is built, because the validator names the
  // representation and the representation depends on the encoding.
  const encoding = COMPRESSIBLE.test(mime)
    ? negotiateEncoding(req.headers['accept-encoding'])
    : null;
  const etag = etagFor(file, encoding);

  const headers = {
    'content-type': mime,
    'cache-control': hit ? cacheControl(canonical, mime) : 'no-store',
    'last-modified': file.mtime.toUTCString(),
    vary: 'Accept-Encoding',
  };
  if (hit) headers.etag = etag;

  // A revalidation of an unchanged file costs a header block, not the document.
  if (hit && isFresh(req, etag, file.mtime)) {
    send(res, 304, headers, '');
    return;
  }

  if (encoding) headers['content-encoding'] = encoding;
  else headers['content-length'] = file.size;

  res.writeHead(hit ? 200 : 404, { ...headers, ...SECURITY_HEADERS });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  // Past writeHead there is no status left to change: a read that fails now can
  // only be reported by cutting the connection. What it must not do — and did,
  // before this listener existed — is emit an unhandled 'error' and kill the
  // process for every other visitor too.
  const stream = createReadStream(file.path);
  const abort = (error) => {
    console.error(`Stream failed for ${file.path}:`, error?.message ?? error);
    res.destroy();
  };
  stream.on('error', abort);
  res.on('close', () => stream.destroy());

  if (!encoding) {
    stream.pipe(res);
    return;
  }
  const compressor =
    encoding === 'br'
      ? createBrotliCompress({ params: { [zlib.BROTLI_PARAM_QUALITY]: 5 } })
      : createGzip({ level: 6 });
  compressor.on('error', abort);
  stream.pipe(compressor).pipe(res);
}

const server = createServer((req, res) => {
  handle(req, res).catch((error) => {
    console.error(`Request failed for ${req.method} ${req.url}:`, error);
    if (res.headersSent) res.destroy();
    else
      send(
        res,
        500,
        { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
        '500 Internal Server Error',
      );
  });
});

// Malformed request lines never reach the handler above.
server.on('clientError', (error, socket) => {
  console.error('Malformed request line:', error.message);
  if (socket.writable) socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n');
  else socket.destroy();
});

// Backstop. Every known path is handled above; anything arriving here is a bug
// worth the log, but not worth taking a static file server offline for — this
// process holds no state that a rejection could have corrupted.
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection (serving continues):', reason);
});
// An uncaught exception is a different animal: the process may be mid-anything.
// Log it and let Railway restart us.
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception, exiting:', error);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`Serving ${root} on http://${host}:${port}`);
  console.log(
    `CSP pinned to ${inlineHashes.scripts.length} inline script and ${inlineHashes.styles.length} inline style hash(es).`,
  );
  console.log(
    INDEXABLE ? 'Indexable: crawlers are welcome.' : 'Not indexable: X-Robots-Tag noindex.',
  );
});
