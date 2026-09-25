# CRM_INTEGRATION_NOTES.md — webhook-интеграция (2026-09-25)

Status 2026-09-25: старый adapter (service-account login → Client → Object →
per-file photo upload) **удалён и заменён** webhook-based adapter
(`src/lib/crm/client.ts`), после hardening-раунда на CRM-стороне
(идемпотентность, orphan-файлы, rollback ownership, hmac secret-check,
magic-byte MIME validation — см. `grandmont-group-crm` repo history).

## Модель

```
Browser → website backend (storeLead, local filesystem) → CRM lead webhook → CRM lead attachments webhook
```

- **no auto Client**
- **no auto Object**
- **no service-account auth**
- **no browser → CRM call** (website backend всегда посредник, browser никогда не видит CRM URL/secret)

Конверсия Lead → Client/Object делается вручную в самой CRM позже, не
автоматически при intake.

## Эндпоинты

`POST {CRM_BASE_URL}/public/leads/website`
Header: `X-Webhook-Secret: <secret>`
Body (JSON):
```json
{
  "external_id": "...",
  "name": "...",
  "email": null,
  "phone": "...",
  "message": "...",
  "service": "...",
  "postcode": "...",
  "locale": "de",
  "utm_source": "...",
  "utm_medium": "...",
  "utm_campaign": "...",
  "page_url": "..."
}
```
`name` is **required** (`str`, not `Optional`) on the CRM side — the
website form's name field is optional for the user, so `client.ts`
falls back to `contact` (phone/email) when the user left it blank,
same fallback the old service-account adapter used.
Возвращает `{ lead_id, duplicate }`. Идемпотентно по `external_id` —
повторный вызов с тем же `external_id` не создаёт второй Lead.

`POST {CRM_BASE_URL}/public/leads/{lead_id}/attachments`
Header: `X-Webhook-Secret: <secret>`
multipart field `files` (может быть несколько), MIME определяется CRM
по magic-byte сигнатуре, не по Content-Type клиента.
Возвращает `{ attached, duplicates_skipped }`. Идемпотентно по
sha256-содержимому файла — повторная отправка тех же байтов не создаёт
дубль attachment.

## Secret

- CRM-сторона: `WEBSITE_WEBHOOK_SECRET`
- Website-сторона: `CRM_WEBHOOK_SECRET` (server-only env, VPS)
- Оба должны содержать одно и то же значение.
- Никогда не в `NEXT_PUBLIC_*`, client bundle, `metadata.json`, логах, git.

## Photos — что именно отправляется

Не оригиналы пользователя. `storeLead()` в `/api/leads/route.ts` уже
прогоняет каждое фото через `sharp().rotate().jpeg()` — нормализация
ориентации, JPEG re-encode, EXIF/GPS metadata стриппится этим же
re-encode. Именно эти уже сохранённые байты (`photoPaths`, пути на
диске в приватном хранилище) уходят в CRM как `files`, MIME всегда
`image/jpeg`. Это canonical copy: провалидирован (magic-byte signature
check уже прошёл в route.ts до сохранения), нормализован, без EXIF.

## external_id / идемпотентность

`external_id` = website `leadId` (тот же ID, что в имени директории
приватного хранилища и в ответе клиенту как `leadId`). При retry
(ручном или автоматическом) используется тот же `external_id` —
CRM отвечает `duplicate: true`, второй Lead не создаётся; то же для
attachments — те же JPEG-байты дают тот же sha256, CRM отвечает
`duplicates_skipped`, физический файл не дублируется.

## metadata.json — что записывается после push

```json
"crm": {
  "pushed": true,
  "leadId": "<crm lead id>",
  "duplicate": false,
  "attachmentsAttached": 3,
  "attachmentsDuplicatesSkipped": 0,
  "pushedAt": "2026-09-25T..."
}
```
или при ошибке:
```json
"crm": {
  "pushed": false,
  "stage": "lead" | "attachments",
  "error": "...",
  "attemptedAt": "2026-09-25T..."
}
```

Ошибка CRM push **не отменяет** уже сохранённую локально заявку — клиент
получает успешный ответ формы независимо от результата CRM push.
`stage: "lead"` означает лид не дошёл до CRM вообще; `stage:
"attachments"` означает CRM lead уже создан/найден, но фото не
прикреплены в этом вызове — при ручном retry по тому же external_id
Lead не задублируется, фото допришлются.

## Что дальше (не в scope этого intake-adapter)

- Downstream conversion Lead → Client/Object — ручная операция в самой
  CRM, вне этого адаптера.
- `delete_lead` cleanup физических attachment-файлов — известный,
  некритичный, отдельный lifecycle-фикс на CRM-стороне (не блокирует
  intake flow).
- Production-grade rate limiting (сейчас in-memory Map на website
  API route) — нужен перед реальным рекламным трафиком, не для текущего
  этапа.
