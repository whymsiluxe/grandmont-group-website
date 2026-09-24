# ENVIRONMENT.md

Runtime environment variables for the public website.

Do not commit real secrets. Production values live on the VPS or hosting provider.

## Lead intake

```bash
# Absolute private directory outside public web roots.
# If unset, /api/leads validates requests but does not store them.
LEAD_STORAGE_DIR=/var/lib/grandmont-group-website/leads

# Optional internal notification.
# If either value is missing, lead storage still works and notificationSent=false.
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Security notes:
- `LEAD_STORAGE_DIR` must be absolute.
- It must not be inside a `public/` directory.
- Uploaded photos are converted to JPEG through `sharp`, stripping metadata/EXIF.
- Stored lead folders and metadata are written with private filesystem permissions.

## Site contact config

Canonical public phone, WhatsApp and email are currently placeholders in `src/lib/seo/site-config.ts`.
Do not publish draft numbers. Fill these only after owner approval.
