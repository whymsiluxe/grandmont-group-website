# Grandmont Group CMS

Payload CMS 3.x, self-hosted, PostgreSQL-backed. Runs as `grandmont-cms.service`
on the VPS (port 3010, localhost only, behind Caddy once a domain is routed to it).

Not yet wired to the public site — `../src/lib/cms/content-source.ts` in the
main Next.js app still reads static TS arrays (`mode: "static-approved-content"`).
Connecting the frontend to this CMS is a separate, tracked task.

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

## Collections

`users`, `services`, `portfolio`, `faq`, `ratgeber`, `media` — de/en localized.
Schema intent: `../docs/PAYLOAD_CMS_SCHEMA.md`. Note: the doc predates this
implementation and may reference slightly different collection names —
reconcile before building the frontend adapter.
