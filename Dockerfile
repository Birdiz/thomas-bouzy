# syntax=docker/dockerfile:1.7
#
# Two stages: build the static site, then serve dist/ with a tiny Node process.
# The runtime carries no node_modules at all — scripts/serve-dist.mjs uses only
# Node built-ins — so the final image is the base plus a few hundred kilobytes.
#
# The base image is pinned by digest, not just by tag, so a rebuild cannot pick
# up a different image under the same name.

ARG NODE_IMAGE=node:24-alpine@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf

# ─── Stage 1: build ──────────────────────────────────────────────────────────
FROM ${NODE_IMAGE} AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Everything derived from the hostname — canonical URLs, hreflang, the sitemap,
# robots.txt, the JSON-LD — is baked in here, so these have to be build
# variables rather than runtime ones. Railway passes them from the service
# config. SITE_INDEXABLE gates indexing: leave it unset while the site lives on
# a temporary *.up.railway.app hostname.
ARG SITE_DOMAIN
ARG SITE_INDEXABLE
ENV SITE_DOMAIN=${SITE_DOMAIN}
ENV SITE_INDEXABLE=${SITE_INDEXABLE}

# Turns "SITE_DOMAIN is missing" from a site that silently canonicalises itself
# to a placeholder domain into a failed build. See scripts/check-assets.mjs.
ENV SITE_STRICT=1

RUN npm run fonts:check \
  && npm run assets:check \
  && npm run build

# ─── Stage 2: runtime ────────────────────────────────────────────────────────
FROM ${NODE_IMAGE} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
# HOST, not HOSTNAME: container runtimes and shells set HOSTNAME to the machine
# name, which would make listen() bind somewhere unintended.
ENV HOST=0.0.0.0

# The server reads this at runtime too, for the X-Robots-Tag header.
ARG SITE_INDEXABLE
ENV SITE_INDEXABLE=${SITE_INDEXABLE}

RUN addgroup --system --gid 1001 web \
  && adduser --system --uid 1001 --ingroup web web

COPY --from=builder --chown=web:web /app/dist ./dist
COPY --from=builder --chown=web:web /app/scripts/serve-dist.mjs ./scripts/serve-dist.mjs

USER web
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8080)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "scripts/serve-dist.mjs"]
