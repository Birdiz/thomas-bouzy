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
# robots.txt, the JSON-LD — is baked in here, so this has to be a build
# variable rather than a runtime one. Railway passes it from the service config.
ARG SITE_DOMAIN
ENV SITE_DOMAIN=${SITE_DOMAIN}

RUN npm run fonts:check \
  && npm run assets:check \
  && npm run build

# ─── Stage 2: runtime ────────────────────────────────────────────────────────
FROM ${NODE_IMAGE} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 web \
  && adduser --system --uid 1001 --ingroup web web

COPY --from=builder --chown=web:web /app/dist ./dist
COPY --from=builder --chown=web:web /app/scripts/serve-dist.mjs ./scripts/serve-dist.mjs

USER web
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8080)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "scripts/serve-dist.mjs"]
