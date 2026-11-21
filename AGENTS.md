# thomas-bouzy

Thomas Bouzy's freelance site: a static Astro site that sells Offers to Segments,
French at `/` and English under `/en/`, served by its own Node server on Railway.

## Done means `npm run verify` passes

It runs what CI runs, one step after the other where CI runs the quick checks and
three e2e shards side by side. The e2e suite builds, then serves `dist/` on
port 4322 and reuses a server already listening there, so a stale one tests an old
build. Serve `dist/` with `npm run serve:dist`: `npm run preview` daemonises under
Astro 7.

## Everything written here is public

Commits, PRs, issues and docs are world-readable. Write about the site's structure
and the decisions in `docs/adr/`. Thomas's personal and administrative situation,
his contact details, and whatever the ADRs withhold (ADR 5, 9, 16) stay off the
repo: where a ticket needs such a fact, write "see the owner".

## Where to look

- **Domain vocabulary and decisions**, before naming a concept or touching an area
  an ADR covers: [docs/agents/domain.md](docs/agents/domain.md).
- **Copy, prices and pages**: [README.md](README.md) names the single sources and
  what the tests hold in place. Career facts come from the pitch master, which
  lives outside the repo ([ADR 9](docs/adr/0009-the-pitch-master-owns-the-copy.md)).
- **Voice**: the copy speaks in Thomas's voice
  ([ADR 24](docs/adr/0024-the-site-says-tu.md)) and says *vous* in French
  ([ADR 26](docs/adr/0026-the-site-says-vous.md)). The brief that defines the voice
  holds personal material, so it lives in `.context/` at the root of the main
  checkout, ignored by git. A clone or worktree does not have it: see the owner.

## Agent skills

- **Issues, tickets, PR triage, wayfinding**: GitHub Issues via `gh`, see
  [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md).
- **Triage labels**: [docs/agents/triage-labels.md](docs/agents/triage-labels.md).
