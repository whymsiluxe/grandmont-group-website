# OWNER_TODO.md — требует решения/доступа от владельца

Единое место для пунктов, которые блокированы не техническим долгом, а
решением/данными/доступом, которые может дать только владелец.

---

## Открыто

- [ ] **Email-провайдер для lead-confirmation** — REQ (план блок 16): клиент должен получать email "Vielen Dank für Ihre Anfrage…" с номером заявки, сейчас реализовано только как in-UI response + опциональный Telegram (internal). Нужен: зарегистрировать провайдера (рекомендация: [Resend](https://resend.com), free tier 100 email/день, официальный Next.js SDK) и дать API key — попадёт в `configs/ACCESS.md` + VPS `.env`.
- [ ] **Реальные контакты сайта** — телефон/email/WhatsApp сейчас пустые (`siteConfig.phone/email/whatsapp`), CTA корректно скрываются пока пусто (не баг). Заполнить когда будут.
- [ ] **Impressum-данные** — юр.форма/адрес/Registergericht/Registernummer/УСт-ID для Grandmont Group UG. Структура страницы готова (§5 DDG), ждёт значений после регистрации фирмы в Handelsregister.
- [ ] **Домен `grandmont-group.de`** (или другой) — не зарегистрирован, сайт живёт на временном `grandmont.promonta.fun` через Caddy. `promonta.fun` DNS сейчас не резолвится вообще (NXDOMAIN) — отдельная проблема, требует доступа к регистратору (Openprovider).
- [ ] **Telegram bot token/chat_id для lead-нотификаций** — юзер попросил пропустить пока (2026-09-24), сайт работает без него.
- [ ] **CRM service-аккаунт** (Phase 5) — юзер подтвердил: сделает отдельный service-аккаунт с паролем под CMS, когда дойдёт до реальной CRM-интеграции. Endpoint/auth-flow уже известны (`https://crm.promonta.fun/api`, `POST /api/auth/login`).
- [ ] **Payload admin roles + 2FA** — обязательный pre-launch пункт, НЕ блокер сейчас. Единственный CMS-пользователь (owner) сегодня имеет полный доступ ко всем коллекциям — нормально для одного администратора. Роли (owner/editor, с запретом editor на users/access/legal-approval поля) и 2FA нужно внедрить ДО добавления второго CMS-пользователя (менеджера/редактора), не раньше.

## Закрыто

- [x] Company name — Grandmont Group, проверено свободно в Handelsregister.de (2026-09-24).
- [x] GitHub repo — `whymsiluxe/grandmont-group-website`, public.
