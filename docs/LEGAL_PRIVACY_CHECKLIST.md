# LEGAL_PRIVACY_CHECKLIST.md (Phase 0.4)

## Базовые требования [REQ]

Impressum + Datenschutzerklärung обязательны. Не заявлять «100% rechtssicher» — финальная юридическая проверка перед production обязательна, это НЕ юридическая консультация от Claude [REQ].

## DSGVO-детали [REC-дополнение к REQ юзера про "GDPR/DSGVO, минимизацию данных"]

- **§5 DDG** — доступность Impressum (актуальный закон, заменил §5 TMG).
- **Art. 13 DSGVO** — обязательное раскрытие информации об обработке данных (кто обрабатывает, зачем, на каком основании, сколько хранится, права субъекта).
- **§25 TDDDG** — требования согласия для не-обязательных cookies/хранилища (бывший §25 TTDSG).

Источник этих трёх пунктов — ChatGPT-бриф, фактическая юридическая справка, не проверено юристом отдельно — финальная сверка перед Phase 7/9.

## Фото и DSGVO [REQ заголовок + REC методы]

[REQ] Безопасная обработка заявок/фотографий, GDPR/DSGVO, минимизация данных — общее требование юзера.

[REC] Конкретные технические методы (см. также LEAD_FLOW_SPEC.md п.6): private object storage; non-guessable IDs; signed URLs; role-based access; retention policy; delete process; file type validation (MIME + magic-byte); size limits; malware protection; strip EXIF/GPS; никаких публичных `/uploads/`.

## Минимизация данных [REQ]

«Не нужно собирать у клиента 25 полей просто потому что можно» — юзер прямо.

## Consent-баннер [REC, вывод из §25 TDDDG]

Нужен только если используются non-essential cookies (аналитика без legitimate-interest режима, ads-трекеры и т.п.). Если аналитика настроена privacy-first (напр. без cookies до согласия) — баннер можно минимизировать. Решить на Phase 7.

---

## ОТЗЫВЫ — ОБЯЗАТЕЛЬНАЯ ПРАВКА REQ юзера [REQ + замена, юзер согласился 2026-09-24]

### Исходный запрос юзера [REQ, дословно]

«желательно сделать так, чтоб только позитивные комментарии летели» / «в файле по объектам отмечать объект завершения и сразу летит письмо, только желательно чтоб только позитивные комментарии летели».

### Почему это нельзя реализовать буквально

Google запрещает (Google Business Profile / Google Reviews policy):
- Препятствовать оставлению негативных отзывов.
- Selectively solicit (выборочно запрашивать) только позитивные отзывы у клиентов.

Нарушение — риск санкций против Google Business Profile компании (вплоть до скрытия/удаления всех отзывов или понижения в локальной выдаче).

### Утверждённая замена [REC → подтверждено юзером]

После статуса **Abgeschlossen** в CRM:
1. Всем клиентам одинаково отправляется нейтральный вопрос: «Wie zufrieden waren Sie mit unserem Service?»
2. Ответ (приватный satisfaction score) сохраняется в CRM — это внутренняя аналитика, разрешена без ограничений.
3. Публичная просьба оставить отзыв на Google — отправляется всем клиентам одинаково, независимо от оценки в п.2. Никакой фильтрации/выборочной отправки.
4. Если клиент дал низкую приватную оценку — срабатывает внутренний alert для менеджера (follow-up звонок/письмо), но это НЕ влияет на то, попросят ли его оставить публичный отзыв — просьба уходит всем одинаково.

**Статус: юзер явно согласился на замену 2026-09-24** (см. мастер-план, AskUserQuestion раунд 2: «Да, нейтральная схема (Recommended)»).

---

## Безопасность [REQ явный список + REC дополнения]

[REQ] HTTPS; firewall; защита форм; CAPTCHA/anti-bot (обязательно как принцип; техническую реализацию — сразу CAPTCHA или honeypot+rate-limit первым шагом — решить в Phase 7, [DECIDE]); rate limiting; secure headers; защита API; резервные копии; 2FA для админки; надёжные пароли/строгая парольная политика; регулярные обновления; логирование.

[REC] Дополнения сверх списка юзера: CSP (Content Security Policy); CSRF protection где применимо; безопасное управление конфиденциальными ключами доступа (не хранить в репозитории).

**Implemented baseline 2026-09-24:** `next.config.ts` sends CSP, Referrer-Policy, X-Content-Type-Options, X-Frame-Options, Permissions-Policy and HSTS headers for all routes. CSP intentionally keeps Next-compatible inline/eval allowances until a nonce-based policy is implemented and verified. Remaining production work: HTTPS proxy validation, firewall/WAF, persistent rate limiting, backup/restore test, admin 2FA/password policy and final legal/privacy review.

## Итоговый статус документа

Черновик для Phase 0. Финальная юридическая проверка (реальный юрист/Impressum-generator с проверкой) — обязательна перед Phase 9 (Release), это явно вне возможностей Claude как AI-инструмента.
