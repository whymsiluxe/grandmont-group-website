# LEAD_FLOW_SPEC.md (Phase 0.4)

## Общий подход к форме [REQ]

Юзер просил: «проанализируй какие формы дают больше конверсию именно в германии». Честный ответ [REC]: независимого немецкого исследования по формам нет, цифры конверсии не выдумываются. Общий паттерн Handwerk-digital-продуктов в Германии: короткий request + фото + WhatsApp + телефон [REC, основано на данных Bundesnetzagentur о смартфон-доминировании, не строгая статистика конверсии].

## 1. Foto-Anfrage [REQ, юзер явно дважды описал]

«Einfach Fotos hochladen und in zwei Sätzen beschreiben, was gemacht werden soll.»

Поля: PLZ; 1-10 фото; Kurzbeschreibung; Telefon oder E-Mail. Без регистрации.

## 2. Angebot anfragen — progressive form [REQ минимум полей, REC порядок шагов]

[REQ] Минимум обязательных полей, не 20 полей сразу.

[REC] Шаговый порядок:
1. Service + PLZ
2. Fotos + Kurzbeschreibung
3. Service-specific вопросы (conditional)
4. Zeitraum
5. Kontakt

[REQ] Conditional-поля: не спрашивать м² у сборки шкафа — юзер сам привёл этот пример как иллюстрацию принципа.

## 3. WhatsApp / Anrufen [REQ]

Для тех, кто не хочет заполнять форму. WhatsApp — с заранее подготовленным (prepared) сообщением, привязанным к конкретной service-странице [REQ основа + REC контекстность по странице]. Пример: «Hallo, ich interessiere mich für eine Möbelmontage in Chemnitz…»

Телефон [REQ]: «Jetzt anrufen» — реальный `tel:` линк, единый canonical номер везде (см. FINDING в SEO_PLAN.md).

## 4. Референсный wizard заявки [REQ]

За основу взят проверенный flow: Standort → Dienstleistung → Detail → Projektgröße+Fotos → Zeitraum → Budget → Kontaktdaten/Objektart.

Вывод [REC]: основа правильная, улучшить conditional-полями (см. п.2), не переделывать с нуля.

## 5. KI-Voranalyse [REQ, упомянуто юзером явно]

По фото — предварительное определение типа работы, объёма, сложности. НЕ обещать точную цену автоматически.

## 6. Upload security [REC методы — реализация REQ про DSGVO-безопасность]

Private object storage; non-guessable IDs; signed URLs; role-based access; retention policy; delete process; file type validation (MIME + magic-byte, не только расширение); size limits; malware protection; strip EXIF/GPS; никаких публичных `/uploads/` директорий.

**Implemented baseline 2026-09-24:** `/api/leads` has approved-service validation, locale normalization, request/content-size limits, field max lengths, plausible phone/email contact validation, 1-10 photo limit, magic-byte image validation, EXIF stripping via `sharp` conversion, private filesystem storage when `LEAD_STORAGE_DIR` is configured, retention metadata via `LEAD_RETENTION_DAYS`, `npm run leads:cleanup` for expired lead-folder cleanup, honeypot field and an in-memory IP window limit. Remaining production work: persistent/shared rate limiting at proxy/WAF layer, CAPTCHA if spam appears and malware scanning.

## 7. Постоянный CTA [REQ mobile, DECIDE desktop отложено]

**Mobile sticky bar** [REQ, юзер сам предложил]: Anrufen | WhatsApp | Angebot. Уважать iPhone safe-area, не перекрывать контент.

**Desktop** — [DECIDE, отложено юзером до Phase 2/дизайн-макета] — не фиксировать раньше.

## 8. Уведомления [REQ]

Клиенту: «Vielen Dank für Ihre Anfrage…» с номером заявки. Компании: «Neue Anfrage #1042 — Möbelmontage — Chemnitz — 2 Fotos — Telefon…». Каналы: Email; Telegram; WhatsApp Business; CRM notification.

## Минимизация данных [REQ]

«Не нужно собирать у клиента 25 полей просто потому что можно» — юзер прямо.
