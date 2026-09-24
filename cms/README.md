# Grandmont Group CMS

Payload CMS 3.x, self-hosted, PostgreSQL-backed. Runs as `grandmont-cms.service`
on the VPS (port 3010, localhost only, behind Caddy once a domain is routed to it).

Wired to the public site since 2026-09-24 — `../src/lib/cms/content-source.ts`
fetches from this CMS's REST API (`../src/lib/cms/payload-client.ts`), not
static arrays. `services` currently holds the 6 approved services;
`portfolio`/`ratgeber`/`faq` are live-connected but empty until real content
is published.

## Setup

```bash
npm install
cp .env.example .env   # fill DATABASE_URI (Postgres) and PAYLOAD_SECRET
npm run build
npm run start           # or `npm run dev` locally
```

First visit to `/admin` creates the owner account — see
`../configs/ACCESS.md` (gitignored, not in this repo) for current
server credentials and connection details.

Schema changes require a migration (`npx payload migrate:create <name>`,
then `npx payload migrate`) — `migrations/` is checked into this repo,
so the DB schema is reproducible from source, not just server state.

## Collections

`users`, `services`, `portfolio`, `faq`, `ratgeber`, `media` — de/en localized.

Publication gate: anonymous read only returns rows matching an explicit
query constraint (`access.read`, not a post-fetch hook) —
`services` requires `status === "published" && ownerApproved && legalApproved`;
`portfolio` requires `published && clientApproved && imageRightsCleared`;
`faq`/`ratgeber`/`media` require `published`. Authenticated (admin) requests
see everything, including drafts.

`services` fields match what the service-page component actually renders
(not a generic title/excerpt/body shape): `eyebrow`, `title`, `statement`,
`included[]`, `scopeNote`, `forWhom[]`, `outcomes[]`, `pricing`, `faq[]` —
all per-locale (de/en).
