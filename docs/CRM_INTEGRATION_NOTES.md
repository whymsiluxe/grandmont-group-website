# CRM_INTEGRATION_NOTES.md — API recon (Phase 5, 2026-09-24)

Recon done against the live `https://crm.promonta.fun/openapi.json` schema
before writing the adapter — no code shipped yet, waiting on a real service
account (see `OWNER_TODO.md`).

## Auth

`POST /api/auth/login` — email+password → JWT. Standard bearer flow
(`/api/auth/refresh`, `/api/auth/me`, `/api/auth/logout` also exist).

## Relevant endpoints for lead intake

- `POST /api/clients` — create a CRM client record. Fields map directly
  from our lead form:
  - `name` (required) ← lead `contact` (if it looks like a name) or a
    placeholder until a real name field exists on our form — **gap**: our
    form only collects `contact` (phone or email), not a name. Either add
    a name field to the lead form, or send phone/email as `name` as a
    stopgap.
  - `email`/`phone` ← lead `contact`, split by which pattern matched
    (`EMAIL_PATTERN` already exists in `/api/leads/route.ts`)
  - `postal_code` ← lead `postcode`
  - `notes` ← lead `description`
  - `lead_status` — enum `Kalt | Warm | Auftrag`, default `Warm`. A brand
    new website lead should be `Kalt`, not the default — must set
    explicitly.
  - `source` ← literal `"grandmont-website"` (matches the attribution
    tracking already captured — UTM/referrer stay in our own lead
    metadata, not duplicated into CRM `source`, which looks like a
    single free-text field, not structured attribution).
- `POST /api/objects` — likely the right place for the actual
  project/job record (service requested, address). Not fully explored
  yet — schema recon stopped here pending real credentials, since a
  wrong guess would be expensive to unwind once objects start getting
  created against production CRM data.
- `POST /api/quotes` — Angebot creation. Out of scope for the intake
  adapter itself — this is downstream, a human/AI step per REQ ("finale
  Preis muss von Mensch kontrolliert werden").

## Open questions before writing the adapter

- Does a website lead become a `client` immediately, or only after a
  human reviews it? (REQ pipeline: Neue Anfrage → Kontaktiert → ... —
  suggests the CRM `lead_status: Kalt` client creation IS the "Neue
  Anfrage" step, but worth confirming rather than assuming.)
- Where do the lead's photos go — `/api/objects/{object_id}/photos`
  implies photos attach to an object, not a client. Does client creation
  need to happen first, then an object, then photos uploaded to it? That's
  three API calls per lead, not one — needs to be atomic/retryable (per
  the earlier audit finding: lead intake must not silently drop data on a
  partial failure partway through a multi-step CRM write).
- `/api/files/{path}` GET exists — is this how CRM serves uploaded photos
  back out, or a separate concern?

## Not started

Adapter code, retry/outbox logic, end-to-end pipeline test. Blocked on
real CRM service-account credentials (see `OWNER_TODO.md`).
