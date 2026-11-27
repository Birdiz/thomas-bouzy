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
 * It also counts visits, without a cookie: page views and clicks through to
 * the booking page, one line in the log a day (ADR 29, scripts/visit-count.mjs).
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
import { extname, join, normalize, relative, resolve, sep } from 'node:path';
import { createBrotliCompress, createGzip, constants as zlib } from 'node:zlib';
import { createVisitCount, isBot, referringPath } from './visit-count.mjs';

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

/**
 * The canonical domain, as src/site.ts spells it. A request that reached the
 * service through Railway's generated hostname is sent there, so the same
 * pages are never served under two names (the canonical link only cleans that
 * up after the fact). Only that hostname: localhost, the e2e suite and
 * Railway's healthcheck, which comes in under its own name, are served as is.
 */
const DOMAIN = process.env.SITE_DOMAIN?.trim() || 'thomasbouzy.dev';
const RAILWAY_HOSTNAME = /\.up\.railway\.app$/i;

/** The name a request was sent to, without its port. */
const hostnameOf = (req) => (req.headers.host ?? '').replace(/:\d+$/, '').toLowerCase();

function redirectToDomain(req) {
  const hostname = hostnameOf(req);
  return RAILWAY_HOSTNAME.test(hostname) && hostname !== DOMAIN.toLowerCase();
}

/**
 * The booking page, behind a hop of our own (ADR 29). CONTACT.booking in
 * src/site.ts sends every "book a call" button here; the server counts the
 * click and answers with a redirect to cal.com. A 302 with no-store, so that
 * neither Cloudflare nor the browser answers the next click without us. Its
 * query string is dropped: nothing a visitor sends is passed on to cal.com.
 */
const BOOKING_PATH = '/rdv/';
const BOOKING_URL = 'https://cal.com/thomas-bouzy/30min';

/**
 * Addresses people type, or trim a URL down to, that have no page of their own:
 * each goes to the section of the home page that answers it (ADR 29). None of
 * them is in src/routes.ts; a page registered at one of these paths would be
 * shadowed, which the e2e suite catches, since it expects a 200 from every page.
 *
 * A 301 like every other redirect here, and with no-store like them: no browser
 * keeps it, so the day the Workshops get a page of their own (ADR 27), removing
 * the line is all it takes.
 */
const SHORTCUTS = new Map([
  ['/offres/', '/#offers'],
  // The prices are on the offer cards.
  ['/tarifs/', '/#offers'],
  ['/ateliers/', '/#workshops'],
  ['/contact/', '/#contact'],
  // The parent of the English offer pages: the same dead end as /offres/.
  ['/en/offers/', '/en/#offers'],
]);

/** The shortcuts that lead into the catalogue, and the home page each falls back to. */
const CATALOGUE_SHORTCUTS = new Map([
  ['/offres/', '/'],
  ['/tarifs/', '/'],
  ['/ateliers/', '/'],
  ['/en/offers/', '/en/'],
]);

/**
 * What the build did with the catalogue (ADR 34), from the manifest it writes
 * next to the pages (astro.config.mjs). While the catalogue is hidden, every
 * address it had, the shortcuts into it included, answers a 302 to the home
 * page: temporary, because the pages come back once the field study has
 * spoken, and no-store, so that no browser remembers it. No manifest, as in a
 * build older than the switch, means the catalogue is published.
 */
const CATALOGUE_MANIFEST = '/_catalogue.json';

function readCatalogue(dir) {
  try {
    const manifest = JSON.parse(readFileSync(join(dir, CATALOGUE_MANIFEST), 'utf8'));
    return {
      published: manifest.published !== false,
      redirects: new Map(Object.entries(manifest.redirects ?? {})),
    };
  } catch {
    return { published: true, redirects: new Map() };
  }
}

const CATALOGUE = readCatalogue(root);

/** Where a hidden catalogue address sends the reader, or undefined. */
function hiddenTarget(slashed) {
  if (CATALOGUE.published) return undefined;
  return CATALOGUE.redirects.get(slashed) ?? CATALOGUE_SHORTCUTS.get(slashed);
}

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
};

/** Worth compressing: text formats. Images and fonts are already packed. */
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

/**
 * Every page, spelled as its URL: one per directory index in the build. A view
 * is counted for these and nothing else — not 404.html, not an asset.
 */
async function collectPages(dir) {
  const pages = new Set();
  for (const entry of await readdir(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || entry.name !== 'index.html') continue;
    const folder = relative(dir, entry.parentPath ?? entry.path);
    pages.add(folder === '' ? '/' : `/${folder.split(sep).join('/')}/`);
  }
  return pages;
}

const PAGES = await collectPages(root);

const visits = createVisitCount();

/**
 * Whether a request is one the visit count looks at: a GET that reached the
 * server under the site's own name. Not localhost, not the e2e suite, not
 * Railway's healthcheck, which comes in under its own name; not HEAD, which
 * link checkers and monitors send; and not a prefetch, which is the browser's
 * guess at a page nobody has opened yet.
 */
function countable(req) {
  if (req.method !== 'GET' || hostnameOf(req) !== DOMAIN.toLowerCase()) return false;
  const purpose = `${req.headers['sec-purpose'] ?? ''} ${req.headers.purpose ?? ''}`;
  return !/prefetch/i.test(purpose);
}

/** Where a click through to the booking page came from. */
function bookingSource(req) {
  const path = referringPath(req.headers.referer, req.headers.host);
  if (path !== null) return PAGES.has(path) ? path : '(other)';
  // Typed, scanned from a QR code, opened from an app, or a browser that
  // withholds the Referer: "direct". Another site's address is not kept.
  return req.headers.referer ? '(external)' : '(direct)';
}

function countBooking(req) {
  if (!countable(req)) return;
  if (isBot(req.headers['user-agent'])) visits.bot();
  else visits.booking(bookingSource(req));
}

/**
 * A page view, or a page asked for that does not exist. A revalidation that
 * ends in a 304 is a view too: the visitor is looking at the page.
 */
function countRequest(req, pathname, hit) {
  if (!countable(req)) return;
  const page = hit !== null && PAGES.has(pathname);
  // A navigation asks for HTML; a missing favicon or image does not.
  const deadEnd = hit === null && /text\/html/.test(req.headers.accept ?? '');
  if (!page && !deadEnd) return;
  if (isBot(req.headers['user-agent'])) {
    visits.bot();
  } else if (page) {
    visits.view(pathname, referringPath(req.headers.referer, req.headers.host) === null);
  } else {
    visits.notFound(pathname);
  }
}

/**
 * The back office the field study's page talks to (ADR 34, FIELD_STUDY in
 * src/site.ts): the one origin outside this one that a page may reach, and
 * only with fetch. Unset, the page calls its own origin and nothing is added.
 * Anything but a bare https origin stops the server rather than widening the
 * policy to something nobody meant.
 */
function surveyApiOrigin() {
  const value = (process.env.PUBLIC_SURVEY_API_ORIGIN ?? '').trim();
  if (!value) return '';
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.origin !== value.replace(/\/$/, '')) {
    throw new Error(`PUBLIC_SURVEY_API_ORIGIN must be an https origin, got "${value}"`);
  }
  return url.origin;
}

const CSP = [
  "default-src 'none'",
  `script-src 'self' ${inlineHashes.scripts.join(' ')}`.trim(),
  // Hash-based, like script-src. The built HTML carries no style="" attribute —
  // those would need 'unsafe-hashes', which is why tests/e2e/serving.spec.ts
  // asserts the pages render with no CSP violation in the console.
  `style-src 'self' ${inlineHashes.styles.join(' ')}`.trim(),
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self' ${surveyApiOrigin()}`.trim(),
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
  const current = withoutIndex.replace(LEGACY_FRENCH_PREFIX, '/');
  return current === '' ? '/' : current;
}

/**
 * French used to live under `/fr/`; it is served at the root now (ADR 15).
 * `/fr`, `/fr/` and anything below answer with the same one-hop 301 as every
 * other spelling of a page, to the address the page has today. The site was
 * never communicated or indexed, so this is courtesy to the odd shared link,
 * not an SEO migration.
 */
const LEGACY_FRENCH_PREFIX = /^\/fr(\/|$)/;

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

  const target = req.url ?? '/';
  if (redirectToDomain(req) && target.startsWith('/')) {
    send(res, 301, { location: `https://${DOMAIN}${target}`, 'cache-control': 'no-store' }, '');
    return;
  }

  // The request target is split by hand rather than handed to `new URL()`: a
  // target beginning with `//` is a protocol-relative URL to that constructor,
  // so `GET //fr/` silently became a request for `/` — served 200, wrong page,
  // and invisible to the redirect below.
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

  // The booking hop, the hidden catalogue and the shortcuts come before the
  // spelling redirect below, so `/offres`, `//offres/` or `/fr/offres/` reach
  // their target in one hop.
  const slashed = canonical.endsWith('/') ? canonical : `${canonical}/`;
  if (slashed === BOOKING_PATH) {
    countBooking(req);
    send(res, 302, { location: BOOKING_URL, 'cache-control': 'no-store' }, '');
    return;
  }
  const hidden = hiddenTarget(slashed);
  if (hidden) {
    send(res, 302, { location: `${hidden}${search}`, 'cache-control': 'no-store' }, '');
    return;
  }
  const shortcut = SHORTCUTS.get(slashed);
  if (shortcut) {
    // The query string goes before the fragment, or the browser reads it as
    // part of the fragment.
    const hash = shortcut.indexOf('#');
    const target = `${shortcut.slice(0, hash)}${search}${shortcut.slice(hash)}`;
    send(res, 301, { location: target, 'cache-control': 'no-store' }, '');
    return;
  }

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

  // The manifest is for this server, not for readers.
  const hit = canonical === CATALOGUE_MANIFEST ? null : await resolveFile(canonical);

  // `/en` is a directory: it is spelled `/en/`, the way src/routes.ts and the
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

  countRequest(req, canonical, hit);

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
// Log it, with the day's visits so far, and let Railway restart us.
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception, exiting:', error);
  try {
    visits.flush();
  } catch {
    // The exit matters more than the count.
  }
  process.exit(1);
});

// A day closes at midnight even when nobody visits around it.
setInterval(() => visits.tick(), 60_000).unref();

// Railway stops a deployment with SIGTERM. The day so far is written first, or
// every deploy would lose it; then the server stops taking requests and lets
// the ones in flight finish, for a moment.
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.once(signal, () => {
    visits.flush();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 2_000).unref();
  });
}

server.listen(port, host, () => {
  // The port actually bound: PORT=0 asks the system for a free one.
  console.log(`Serving ${root} on http://${host}:${server.address().port}`);
  console.log(
    `CSP pinned to ${inlineHashes.scripts.length} inline script and ${inlineHashes.styles.length} inline style hash(es).`,
  );
  console.log(
    INDEXABLE ? 'Indexable: crawlers are welcome.' : 'Not indexable: X-Robots-Tag noindex.',
  );
  console.log(
    `Counting visits to ${DOMAIN}: one "visits" line a day at midnight Paris time, and one on shutdown.`,
  );
});
