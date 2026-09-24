# IMPLEMENTATION_PLAN.md (Phase 0.4)

Полный чеклист по фазам — источник истины: `~/.claude/plans/elegant-booping-wren.md` (секция CHECKLIST в конце). Копия здесь для удобства в репозитории.

## Phase 0 — Research/Art Direction — ЗАВЕРШЕНА (2026-09-24)
Все документы этой папки, SERVICE_MATRIX.md, REFERENCE_ANALYSIS.md — готовы. STOP для ревью владельца.

## Phase 1 — Foundation
Next.js/TS init; роутинг DE/EN; SEO-metadata база; design tokens; шрифты (лицензия проверена); header/footer; responsive grid; motion primitives.

## Phase 2 — Design proof
Homepage + Möbelmontage service-page собраны; проверка desktop/iPhone/Android; анимации + reduced-motion; черновой Lighthouse; go/no-go решение юзера «выглядит дорого».

## Phase 3 — Content system
Service template параметризован; страницы ТОЛЬКО для услуг с Owner approved=yes; Portfolio; B2B; Über uns; Kontakt; Ratgeber (структура).

## Phase 4 — Lead system
Foto-Anfrage; progressive form; upload security; Lead API; email confirmation; internal notification.

## Phase 5 — CRM
Доступ к CRM от юзера; API audit; adapter (не вторая CRM); полная цепочка Website→API→CRM→Accounting→Email→WhatsApp/Telegram→Analytics — end-to-end.

## Phase 6 — SEO
Keyword clusters; structured data; internal linking; hreflang; sitemap/robots; Search Console.

## Phase 7 — Privacy/Security
Impressum; Datenschutzerklärung; consent-баннер (если нужен); upload security; HTTPS/HSTS/CSP; firewall; rate limiting; CAPTCHA/anti-bot; строгая парольная политика+2FA; backup+restore тест.

## Phase 8 — Performance/QA
Core Web Vitals; Lighthouse; кросс-браузер/device; load-тест; 404/500; form/upload failure states; минификация подтверждена.

## Phase 9 — Release
SERVICE_MATRIX все approved=yes; CONTENT_VERIFY закрыт; review-policy внедрена; production checklist; DNS/деплой.

---

Детальные подпункты каждой фазы — см. мастер-план напрямую, не дублируется здесь во избежание рассинхронизации.
