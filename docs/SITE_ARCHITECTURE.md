# SITE_ARCHITECTURE.md — Sitemap & Routing (Phase 0.4)

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
/de/faq/                                      — если не встроено в отдельные страницы
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
