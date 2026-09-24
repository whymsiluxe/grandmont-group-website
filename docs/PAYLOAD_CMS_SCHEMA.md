# PAYLOAD_CMS_SCHEMA.md

Target CMS: Payload CMS, self-hosted, PostgreSQL.

Status 2026-09-24: implementation bridge exists in `src/lib/cms/content-source.ts`; current source is `static-approved-content`. Payload cutover should replace that adapter first.

Static seed helper: `src/lib/cms/static-seed.ts` returns current approved services, empty public project/article lists and planned article topics in CMS-shaped form. Use it as the first import/seed source when Payload is installed.

## Global Rules

- Locales: `de`, `en`.
- Public website must only render `published` content.
- Services must also satisfy owner/legal approval before public rendering.
- Draft/review content must not appear in sitemap, static params, JSON-LD or public navigation.
- Do not publish invented prices, fake projects, fake reviews, certificates or guarantees.
- Media must be optimized derivatives, not original 8-15 MB uploads.

## Collection: services

Purpose: public service pages and service navigation.

Fields:
- `slug` unique, lowercase, stable URL key.
- `status`: `draft | review | published`.
- `ownerApproved`: boolean.
- `legalApproved`: boolean.
- `group`: `montage | objektservice` initially; future groups only after SERVICE_MATRIX approval.
- `eyebrow.de/en`.
- `title.de/en`.
- `statement.de/en`.
- `included.de/en`: string array.
- `scopeNote.de/en`.
- `forWhom.de/en`: string array.
- `outcomes.de/en`: string array.
- `pricing.de/en`.
- `faq.de/en`: array `{ question, answer }`.
- `seoTitle.de/en` optional.
- `seoDescription.de/en` optional.
- `updatedAt`.

Public filter:

```ts
status === "published" && ownerApproved === true && legalApproved === true
```

## Collection: projects

Purpose: portfolio cards and `/projekte/[slug]`.

Fields:
- `slug` unique, stable URL key.
- `status`: `draft | approved | published`.
- `clientApproved`: boolean.
- `imageRightsCleared`: boolean.
- `title.de/en`.
- `location`.
- `service`: relationship to `services`.
- `duration.de/en`.
- `summary.de/en`.
- `challenge.de/en`.
- `solution.de/en`.
- `result.de/en`.
- `media`: array relationship to media items, each with `kind: cover | before | after | gallery`, alt text `de/en`, width, height, optimized src.
- `updatedAt`.

Public filter:

```ts
status === "published" && clientApproved === true && imageRightsCleared === true
```

## Collection: articles

Purpose: Ratgeber SEO content and `/ratgeber/[slug]`.

Fields:
- `slug` unique, stable URL key.
- `status`: `draft | review | published`.
- `title.de/en`.
- `description.de/en`.
- `category.de/en`.
- `service`: optional relationship to `services`.
- `readingMinutes`.
- `publishedAt`.
- `updatedAt`.
- `sections.de/en`: array `{ heading, body }`.
- `seoTitle.de/en` optional.
- `seoDescription.de/en` optional.

Public filter:

```ts
status === "published"
```

## Collection: faq

Purpose: shared FAQ blocks, service-specific FAQ and homepage FAQ.

Fields:
- `status`: `draft | review | published`.
- `scope`: `home | service | global`.
- `service`: optional relationship to `services`.
- `question.de/en`.
- `answer.de/en`.
- `sortOrder`.

Public filter:

```ts
status === "published"
```

## Collection: testimonials

Purpose: public customer reviews only after compliant neutral review flow.

Fields:
- `status`: `draft | review | published`.
- `clientNamePublic`.
- `service`: optional relationship to `services`.
- `rating`: optional number.
- `quote.de/en`.
- `permissionRecordedAt`.
- `source`: optional.

Public filter:

```ts
status === "published" && permissionRecordedAt != null
```

Never selectively request only positive public reviews. See `LEGAL_PRIVACY_CHECKLIST.md`.

## Media Rules

- Store originals privately or restricted.
- Generate web derivatives for public rendering: AVIF/WebP/JPEG fallback.
- Strip EXIF/GPS metadata.
- Require alt text per locale for public images.
- Portfolio cover must have stable aspect ratio.

## Cutover Steps

1. Add Payload dependencies and config.
2. Implement collections above.
3. Add seed/import script from current static data.
4. Replace internals of `src/lib/cms/content-source.ts` with Payload reads.
5. Keep public filters identical.
6. Run `npm run lint`, `npm run build`.
7. Verify sitemap contains only published/approved public content.
