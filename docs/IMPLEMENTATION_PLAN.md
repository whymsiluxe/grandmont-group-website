# IMPLEMENTATION_PLAN.md (Phase 0.4)

Полный чеклист по фазам — источник истины: `~/.claude/plans/elegant-booping-wren.md` (секция CHECKLIST в конце). Копия здесь для удобства в репозитории.

## Phase 0 — Research/Art Direction — ЗАВЕРШЕНА (2026-09-24)
Все документы этой папки, SERVICE_MATRIX.md, REFERENCE_ANALYSIS.md — готовы. STOP для ревью владельца.

## Phase 1 — Foundation
Next.js/TS init; роутинг DE/EN; SEO-metadata база; design tokens; шрифты (лицензия проверена); header/footer; responsive grid; motion primitives.

**Progress 2026-09-24:** header/home service links подключены к реальным approved routes; sitemap расширен approved service routes; `npm run lint` и `npm run build` проходят.

## Phase 2 — Design proof
Homepage + Möbelmontage service-page собраны; проверка desktop/iPhone/Android; анимации + reduced-motion; черновой Lighthouse; go/no-go решение юзера «выглядит дорого».

## Phase 3 — Content system
Service template параметризован; страницы ТОЛЬКО для услуг с Owner approved=yes; Portfolio; B2B; Über uns; Kontakt; Ratgeber (структура).

**Progress 2026-09-24:** сделан approved-services data layer, `/[locale]/leistungen` overview и динамические `/[locale]/leistungen/[slug]` страницы только для approved услуг: Küchenmontage, Möbelmontage, Demontage, Umzug/Möbeltransport, Entrümpelung, Reinigung.

**Progress 2026-09-24:** добавлен `/[locale]/kontakt` frontend-shell с Foto-Anfrage структурой, service select, фото input, Einsatzgebiet и CTA links. Backend отправки намеренно не включён до Phase 4 Lead API.

**Progress 2026-09-24:** добавлены `/[locale]/ueber-uns` и `/[locale]/unternehmen`; footer links и sitemap обновлены.

**Progress 2026-09-24:** добавлены `/[locale]/projekte` и `/[locale]/ratgeber` как CMS-ready структуры без выдуманных кейсов/статей; footer links и sitemap обновлены.

**Progress 2026-09-24:** добавлены draft legal routes `/[locale]/impressum` и `/[locale]/datenschutz`, footer legal links, sitemap entries и DE/EN language switcher. Legal pages явно помечены как не финальные до правовой проверки.

**Progress 2026-09-24:** контактная форма вынесена в client component; добавлен `/api/leads` intake validator для approved service, PLZ/описания/контакта и 1-10 фото с базовой magic-byte проверкой. Storage/notifications намеренно возвращают pending status до настройки Phase 4 backend.

**Progress 2026-09-24:** добавлен mobile sticky CTA `Anrufen / WhatsApp / Angebot` с safe-area; phone/WhatsApp показываются disabled до заполнения canonical контактов в siteConfig.

**Progress 2026-09-24:** `/api/leads` умеет private filesystem storage при `LEAD_STORAGE_DIR`: создаёт приватную папку заявки, конвертирует фото через sharp в JPEG без metadata/EXIF, пишет `metadata.json`; если env не задан — остаётся validation-only без ложного успеха.

**Progress 2026-09-24:** добавлено optional Telegram internal notification через `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`; отсутствие env не ломает intake и не имитирует отправку.

**Progress 2026-09-24:** добавлен `docs/ENVIRONMENT.md` с runtime env для lead storage/Telegram без секретов.

**Progress 2026-09-24:** добавлен custom 404 page.

**Progress 2026-09-24:** `/[locale]/projekte` усилен до CMS-ready portfolio module: published-only data layer, будущий detail route `/[locale]/projekte/[slug]`, quality gates для публикации реальных кейсов, проектные поля и sitemap integration без фейковых референсов.

**Progress 2026-09-24:** `/[locale]/ratgeber` усилен до CMS-ready article module: planned SEO topics отдельно от published articles, будущий detail route `/[locale]/ratgeber/[slug]`, Article/Breadcrumb schema helper и sitemap integration только для опубликованных статей.

**Progress 2026-09-24:** lead intake усилен server-side лимитами и anti-spam baseline; добавлены site-wide security headers в `next.config.ts`.

**Progress 2026-09-24:** homepage hero заменён на premium coded visual без фейковых проектных фото; homepage portfolio-блок стал data-driven и показывает только published projects либо честный empty-state.

**Progress 2026-09-24:** language switcher теперь сохраняет текущий путь `/de/...` ↔ `/en/...`; contact form сохраняет выбранную услугу из CTA и получила понятные field hints/limits.

**Progress 2026-09-24:** draft legal pages оставлены доступными, но помечены `noindex,nofollow` и исключены из sitemap до финальной юридической проверки.

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
