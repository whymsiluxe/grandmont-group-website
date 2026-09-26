# ENVIRONMENT.md

Runtime environment variables for the public website.

Do not commit real secrets. Production values live on the VPS or hosting provider.

## Lead intake

```bash
# Absolute private directory outside public web roots.
# If unset, /api/leads validates requests but does not store them.
LEAD_STORAGE_DIR=/var/lib/grandmont-group-website/leads

# Optional retention metadata for stored leads/photos.
# Default: 90. Cleanup job is a separate production task.
LEAD_RETENTION_DAYS=90

# Optional internal notification.
# If either value is missing, lead storage still works and notificationSent=false.
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Security notes:
- `LEAD_STORAGE_DIR` must be absolute.
- It must not be inside a `public/` directory.
- Stored lead metadata includes `retention.days` and `retention.deleteAfter`; production still needs a scheduled cleanup job.
- Uploaded photos are converted to JPEG through `sharp`, stripping metadata/EXIF.
- Stored lead folders and metadata are written with private filesystem permissions.
- `/api/leads` also applies request size, field length, magic-byte image checks, honeypot spam filtering and a basic in-memory IP rate limit.
- Add proxy/WAF-level persistent rate limiting before production launch; in-memory limits reset on process restart and are not shared across multiple instances.
- **Request body size still needs a reverse-proxy hard limit — application-layer checks alone are not sufficient.** `requestSizeTooLarge()` in `route.ts` rejects requests with an oversized `Content-Length` header before parsing, but a client that omits `Content-Length` (chunked transfer-encoding) or lies about it bypasses that check entirely, and `request.formData()` would then buffer an unbounded body into memory. Next.js 16's `experimental.proxyClientMaxBodySize` does not help here: it only applies to requests that pass through `proxy.ts`, and this repo's `proxy.ts` `matcher` explicitly excludes `/api/*` (see `src/proxy.ts`) — so it never sees `/api/leads` traffic, and even where it does apply it silently truncates rather than rejecting the request. **Action needed at deployment**: set a hard request body size limit at the reverse proxy in front of this app (Caddy `request_body { max_size ... }` or equivalent) — this is VPS/Caddyfile configuration outside this repository and must be verified/applied there, not invented here.

Cleanup:

```bash
# Preview expired lead folders.
LEAD_STORAGE_DIR=/var/lib/grandmont-group-website/leads npm run leads:cleanup -- --dry-run

# Delete expired lead folders. Run from cron/systemd timer in production.
LEAD_STORAGE_DIR=/var/lib/grandmont-group-website/leads npm run leads:cleanup
```

## Site contact config

Canonical public phone, WhatsApp and email are currently placeholders in `src/lib/seo/site-config.ts`.
Do not publish draft numbers. Fill these only after owner approval.
