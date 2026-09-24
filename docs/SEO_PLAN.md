# SEO_PLAN.md (Phase 0.4)

[REQ] «нужно заложить SEO до разработки, а не после».

## Keyword clusters [REQ, дословные примеры от юзера]

**Möbelmontage:** Möbelmontage Chemnitz; Möbel montieren lassen Chemnitz; Möbelaufbau Chemnitz; Möbelmontage Service Chemnitz.

**Küchenmontage:** Küchenmontage Chemnitz; Küche aufbauen lassen; Küchenmonteur Chemnitz.

**Maler** (только после legal clearance в SERVICE_MATRIX.md): Maler Chemnitz; Malerarbeiten Chemnitz; Wohnung streichen Chemnitz.

Остальные услуги — кластеры по аналогии, построить на Phase 6 (SEO), после подтверждения SERVICE_MATRIX.

## URL-структура [DECIDE решено]

Город не в slug — см. SITE_ARCHITECTURE.md.

## Мультиязычность [REQ]

`/de/...` `/en/...`, hreflang de-DE/en/x-default, self-referencing + alternate links.

## Structured data [REQ основные типы + REC дополнение]

LocalBusiness; Service; FAQ schema; Breadcrumb schema [REQ, юзер перечислил явно]. Organization schema [REC добавление]. FAQPage — только где реально есть FAQ-контент, без искусственного добавления ради rich snippets (Google сильно ограничил их показ) [REC-примечание].

## Local SEO [REQ]

Google Business Profile синхронизация: название; адрес; телефон; сайт; категории; фото; услуги; часы; отзывы.

**[FINDING]** На текущем сайте — разные номера телефона в разных местах (footer vs CTA «Jetzt anrufen»). Рекомендация: единый canonical business phone везде (schema, Impressum, Google Business, footer); call tracking — отдельным слоем поверх canonical номера, не заменяя его.

## Sitemap/robots [REQ]

См. SITE_ARCHITECTURE.md.

## Ratgeber/блог — стартовые темы [REQ примеры от юзера]

«Wie viel kostet eine Möbelmontage in Chemnitz?»; «Was kostet eine Küchenmontage?»; «Laminat selbst verlegen oder Fachbetrieb beauftragen?»; «Was muss ich vor einer Möbelmontage vorbereiten?»

## География обслуживания [REQ, список городов]

Chemnitz, Limbach-Oberfrohna, Frankenberg, Zschopau, Mittweida, Burgstädt, Annaberg-Buchholz, Freiberg — только реальная зона работы. Без doorway-страниц по городам [REC].

## Internal linking [REC, Phase 6]

Service-pages ↔ Portfolio ↔ Blog — перекрёстные ссылки для SEO-веса, построить на Phase 6.
