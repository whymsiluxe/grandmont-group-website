# CRM_INTEGRATION_SPEC.md (Phase 0.4)

## Полная интеграционная цепочка [REQ — юзер написал ПОЛНОСТЬЮ, ничего не терять]

```
Website → Backend/API → CRM → Accounting → Email → WhatsApp/Telegram → Analytics
```

(в промежуточной версии документа на предыдущей итерации Accounting был случайно потерян — восстановлено при финальном тегировании плана, зафиксировать это явно здесь, чтобы не повторить ошибку.)

## Существующая CRM [REQ]

«Црм почти готов, чуть позже дам доступ» — НЕ строить параллельную CRM. Сначала аудит API существующей CRM, потом адаптер.

## Поля Lead [REQ]

id; created_at; клиент; телефон; email; PLZ; услуга; описание; фотографии; landing page; language; source; referrer; UTM; status.

## Pipeline-статусы [REQ основные + REC дополнение]

[REQ] Neue Anfrage → Kontaktiert → Besichtigung → Angebot erstellt → Angebot angenommen → Termin geplant → In Arbeit → Abgeschlossen → Rechnung → Bezahlt.

[REC, ChatGPT-добавление для честной воронки, не в исходном REQ юзера] Плюс терминальные статусы: Abgelehnt / Kein Auftrag / Storniert.

## Уведомления [REQ]

Клиенту: «Vielen Dank für Ihre Anfrage…» с номером заявки. Компании: «Neue Anfrage #1042 — Möbelmontage — Chemnitz — 2 Fotos — Telefon…». Каналы: Email; Telegram; WhatsApp Business; CRM notification.

## Отслеживание источника / Analytics [REQ]

Источники: Google; Google Ads; Instagram; Facebook; TikTok; Referral; Direct; Flyer; Website. Хранить: first/last landing; UTM; referrer; campaign — «примерно как делали в Промонта» [REQ, прямая ссылка юзера на существующий паттерн].

**Implemented baseline 2026-09-24:** website lead form sends current `landingPath`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid` together with `/api/leads`; backend stores non-empty values in lead metadata with length caps. No cookies or third-party trackers are added at this stage.

Ads-ready: Google Ads, Meta Ads, local campaigns, remarketing — без трекеров до consent [REQ].

Отслеживать [REQ]: формы (отправки), звонки, WhatsApp-клики, источники трафика.

[REC] Event-taxonomy (имена событий придуманы Claude/ChatGPT, не юзером): `cta_offer_click`; `form_start`; `service_selected`; `photo_upload`; `form_step_complete`; `lead_submit`; `whatsapp_click`; `phone_click`; `portfolio_open`; `before_after_interaction`.

Call tracking [REQ] — знать откуда звонок, canonical phone стабилен везде (см. FINDING в SEO_PLAN.md).

## AI Future-ready [REQ]

- **AI Lead Assistant** — диалоговый сбор заявки (пример юзера: «Ich möchte einen Kleiderschrank aufbauen lassen» → AI дозадаёт размер/этаж/лифт/PLZ/срок/фото).
- **AI Photo Analysis** — классификация типа работы по фото.
- **AI Angebot Assistant** — помогает подготовить предложение, финальная цена — только человек [REQ явно: «окончательная цена должна контролироваться человеком»].

## Отзывы — интеграция с CRM [REQ юзера + ОБЯЗАТЕЛЬНАЯ ПРАВКА, юзер согласился]

После статуса Abgeschlossen → нейтральный вопрос всем клиентам одинаково «Wie zufrieden waren Sie mit unserem Service?». Приватный satisfaction score — хранится в CRM (внутренняя аналитика, разрешено). Публичная просьба оставить Google Review — рассылается всем клиентам одинаково, без фильтрации по оценке. Недовольный клиент (низкий score) → внутренний follow-up alert для менеджера, НЕ публичный gating отзывов.

Подтверждено юзером 2026-09-24 как замена исходного запроса «только позитивные отзывы автоматом» — см. LEGAL_PRIVACY_CHECKLIST.md для юридического обоснования (Google review policy).

## Реализация — этапность

Phase 5 (см. IMPLEMENTATION_PLAN.md): доступ к CRM получен от юзера → API audit → adapter построен (НЕ вторая CRM) → полная цепочка Website→API→CRM→Accounting→Email→WhatsApp/Telegram→Analytics проверена end-to-end.
