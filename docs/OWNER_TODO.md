# OWNER_TODO.md — требует решения/доступа от владельца

Единое место для пунктов, которые блокированы не техническим долгом, а
решением/данными/доступом, которые может дать только владелец.

---

## Открыто

- [ ] **Email-провайдер для lead-confirmation** — REQ (план блок 16): клиент должен получать email "Vielen Dank für Ihre Anfrage…" с номером заявки, сейчас реализовано только как in-UI response + опциональный Telegram (internal). Нужен: зарегистрировать провайдера (рекомендация: [Resend](https://resend.com), free tier 100 email/день, официальный Next.js SDK) и дать API key — попадёт в `configs/ACCESS.md` + VPS `.env`.
- [ ] **Реальные контакты сайта** — телефон/email/WhatsApp сейчас пустые (`siteConfig.phone/email/whatsapp`), CTA корректно скрываются пока пусто (не баг). Заполнить когда будут.
- [ ] **Impressum-данные** — юр.форма/адрес/Registergericht/Registernummer/УСт-ID для Grandmont Group UG. Структура страницы готова (§5 DDG), ждёт значений после регистрации фирмы в Handelsregister.
- [ ] **Домен `grandmont-group.de`** (или другой) — не зарегистрирован. Сайт живёт на временном `grandmont.promonta.fun` — **работает с настоящим HTTPS с 2026-09-24** (DNS-запись + Let's Encrypt сертификат подтверждены). Найден и исправлен инцидент в тот же день: юзер случайно поменял A-запись `app.promonta.fun` (реальный Promonta miniapp) при работе с DNS в HostIQ — восстановлено самим юзером, подтверждено 200 на обоих доменах. `siteConfig.url` намеренно НЕ переключён на `grandmont.promonta.fun` — временный домен не должен попадать в canonical/sitemap/OG до покупки финального, иначе придётся распутывать SEO-индексацию под временным адресом при смене.
- [ ] **Telegram bot token/chat_id для lead-нотификаций** — юзер попросил пропустить пока (2026-09-24), сайт работает без него.
- [x] **CRM service-аккаунт** (2026-09-25) — переиспользован уже существующий `chatgpt-service@grandmontgroup.example` (задокументирован в `~/Projects/promonta/configs/ACCESS.md`, создан для ChatGPT Custom GPT Actions), не создавали новый. Login проверен (200+JWT). Записан в `configs/ACCESS.md` этого проекта.
- [ ] **CRM — локализация на русский** (2026-09-25, юзер попросил "потом") — сейчас статусы/поля CRM на немецком (Anfrage/Angebot erstellt/Beauftragt/...) и английском (title/notes ключи), интерфейс CRM не проверялся на предмет русского. Юзер отложил на потом, что именно нужно перевести — не уточнено (сам CRM UI vs данные, которые туда попадают с сайта).
- [ ] **Payload admin roles + 2FA** — обязательный pre-launch пункт, НЕ блокер сейчас. Единственный CMS-пользователь (owner) сегодня имеет полный доступ ко всем коллекциям — нормально для одного администратора. Роли (owner/editor, с запретом editor на users/access/legal-approval поля) и 2FA нужно внедрить ДО добавления второго CMS-пользователя (менеджера/редактора), не раньше.
- [ ] **`grandmont-group-crm` репо не перенесён на whymsiluxe** (2026-09-25) — репо реально существует, приватный, под `x13labs/grandmont-group-crm` (НЕ под promonta/x13labs webapp, это отдельная находка). API-transfer (`POST /repos/.../transfer`) стабильно отвечает `422 "Repository has already been taken"` независимо от нового имени — похоже на GitHub-side блокировку (возможно whymsiluxe раньше уже владел репо с похожим именем). Юзер решил сделать позже через web UI (Settings → Transfer ownership), там будет видна точная причина конфликта. **Побочный мусор от диагностики**: создал `whymsiluxe/transfer-test-tmp` (пустой приватный тестовый репо) чтобы проверить что API/токен вообще работает — не смог удалить (токен без `delete_repo` scope), нужно удалить вручную вместе с `x13labs/webapp` (тот самый "мусор" из начала сессии, тоже всё ещё не удалён).

## Закрыто

- [x] Company name — Grandmont Group, проверено свободно в Handelsregister.de (2026-09-24).
- [x] GitHub repo — `whymsiluxe/grandmont-group-website`, public.
