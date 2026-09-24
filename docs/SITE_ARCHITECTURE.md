# SITE_ARCHITECTURE.md — Sitemap & Routing (Phase 0.4)

## CMS/content storage [DECIDE решено 2026-09-24]

**Headless CMS сразу — Payload CMS**, self-hosted или managed runtime + PostgreSQL. Конкретные серверы, IP и доступы не хранятся в публичном репозитории.

Причина: контент сайта не статичный — регулярно меняются услуги, портфолио/новые объекты, FAQ, Ratgeber/SEO-статьи, DE/EN-тексты, фотографии, возможно отзывы и B2B-контент. MDX/JSON в репо потребовал бы Git-доступа на каждую мелкую правку текста. Владелец/менеджер должен уметь сам добавить объект/фото/поправить текст услуги через CMS-панель, без обращения к разработчику.

Content-модели в Payload: Services (с локализацией DE/EN, SEO metadata, привязкой к SERVICE_MATRIX approval-статусу), Projects/Portfolio, FAQ, Ratgeber-статьи, Testimonials (если решится публично), B2B-контент. Архитектура остаётся простой — Payload работает как admin+API поверх той же PostgreSQL, не отдельный сервис.

**Implementation bridge 2026-09-24:** public routes, sitemap, header service navigation, contact service select and lead validation now read through `src/lib/cms/content-source.ts`. Current mode is `static-approved-content`; Payload CMS cutover should replace this adapter first, not scatter direct CMS calls through page components.

Detailed collection contract: `docs/PAYLOAD_CMS_SCHEMA.md`.

## i18n [REQ]

`/de/...` и `/en/...`, единая i18n-архитектура (не копировать компоненты руками). hreflang de-DE/en/x-default [REC-детализация технической реализации REQ юзера].

## URL-структура [DECIDE решено]

Город НЕ в slug услуги (`/de/leistungen/moebelmontage/`), город (Chemnitz) — в H1/тексте/schema — подтверждено юзером 2026-09-24.

## Sitemap (DE, EN — зеркально)

```
/de/                                          — Главная
/de/leistungen/                               — Услуги (overview, группы меню)
  /de/leistungen/moebelmontage/
  /de/leistungen/kuechenmontage/
  /de/leistungen/demontage/
  /de/leistungen/reparaturen/
  /de/leistungen/innenausbau/
  /de/leistungen/trockenbau/
  /de/leistungen/renovierung/
  /de/leistungen/malerarbeiten/                — только после SERVICE_MATRIX approval (Anlage A risk)
  /de/leistungen/bodenverlegung/
  /de/leistungen/laminat-vinyl-parkett/         — вероятно split: parkett отдельно (Anlage A risk)
  /de/leistungen/umzug-moebeltransport/
  /de/leistungen/entruempelung/
  /de/leistungen/reinigung/
  /de/leistungen/abbrucharbeiten/
/de/projekte/                                 — Portfolio/Referenzen, фильтры по услугам
/de/projekte/[slug]/                          — Карточка проекта
/de/unternehmen/                              — Für Unternehmen (B2B)
/de/ueber-uns/
/de/kontakt/
/de/ratgeber/                                 — SEO-блог
/de/ratgeber/[slug]/
/de/faq/                                      — агрегированные вопросы из homepage/service FAQ
/de/impressum/
/de/datenschutz/
/en/... (зеркально)
```

**Важно:** только услуги с `Owner approved: yes` в SERVICE_MATRIX.md попадают в навигацию/production [REQ-производное].

## Группировка меню [DECIDE решено 2026-09-24]

- **Montage**: Küchenmontage, Möbelmontage, Demontage, Reparaturen
- **Ausbau & Renovierung**: Innenausbau, Trockenbau, Renovierung, Malerarbeiten, Bodenverlegung, Laminat/Vinyl/Parkett
- **Objektservice**: Umzug, Entrümpelung, Reinigung, Abbrucharbeiten

## Структура главной страницы [REQ, порядок блоков от юзера]

Hero → Основные услуги → Преимущества → Реальные работы → Процесс работы → Территория обслуживания → Отзывы → FAQ → CTA → Контакты.

## Doorway-страницы по городам [REC, запрет]

Не создавать отдельные doorway-страницы на каждый город зоны обслуживания — SEO-риск (Google penalizes thin doorway pages). География — единый список в Kontakt/Einsatzgebiet + упоминания в тексте/schema.

## Structured data по маршрутам

- Главная — LocalBusiness [REQ] + Organization [REC]
- Service-страницы — Service schema [REQ] + Breadcrumb [REQ] + FAQPage только где реально есть FAQ [REC-примечание]
- Portfolio — ImageObject где применимо [REC]
- Blog/Ratgeber — Article schema [REC]

## Sitemap.xml / robots.txt [REQ]

Автоматический sitemap.xml с DE/EN. robots.txt — не для скрытия страниц (для этого noindex, не Disallow).
