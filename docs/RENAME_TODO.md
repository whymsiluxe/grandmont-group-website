# RENAME_TODO.md — Замена "Promonta" на "Grandmont Group"

**[РЕШЕНО 2026-09-24]** Финальное имя выбрано юзером: **Grandmont Group** (UG на старте, позже GmbH). Проверено в Handelsregister.de — "Grandmont" и "Grandmont Group" оба 0 Treffer, юридически свободно на момент проверки.

---

## Текстовые упоминания — ЗАВЕРШЕНО (2026-09-24)

| # | Файл | Статус |
|---|------|--------|
| 1 | `README.md` | ✅ заменено |
| 2 | `docs/PROJECT_BRIEF.md` | ✅ заменено (упоминание реального Promonta-бизнеса юзера оставлено намеренно, как явный референс) |
| 3 | `docs/CONTENT_VERIFY.md` | ✅ заменено |
| 4 | `docs/DESIGN_SYSTEM.md` | ✅ заменено (упоминание старого HEX-бренда Promonta юзера оставлено как явный "не переносить" референс) |
| 5 | `docs/SERVICE_MATRIX.md` | ✅ заменено |
| 6 | `docs/LEAD_FLOW_SPEC.md` | ✅ заменено (форма реального Promonta оставлена как явный референс-источник) |
| 7 | `docs/REFERENCE_ANALYSIS.md` | ✅ заменено (все 6 упоминаний) |
| 8 | `src/app/[locale]/page.tsx` | ✅ заменено |
| 9 | `src/lib/seo/site-config.ts` | ✅ заменено — name/legalName/titleTemplates/url (placeholder-домен `grandmont-group.de`) |
| 10 | `src/app/globals.css` | ✅ заменено (комментарий про "existing Promonta colors" переписан) |

Билд проверен после правок (`npm run build`) — чисто, `/de`/`/en` остались SSG.

## Инфраструктура — ЗАВЕРШЕНО (2026-09-24)

- [x] **GitHub репозиторий** — переименован, перенесён на `github.com/whymsiluxe/grandmont-group-website`.
- [x] **Локальная папка проекта** — `~/Projects/grandmont-group-website/`.
- [x] **Домен** — `siteConfig.url` placeholder `https://grandmont-group.de` (реальный домен ещё не зарегистрирован — открытый пункт вне rename-скоупа).
- [x] **VPS/hosting** — CMS развёрнут на VPS, отдельный сервис/порт от Promonta-инстанса, не смешаны (детали — `~/.claude/server-structure.md`, не в публичном репо).
- [x] **Мастер-план** — переименован на Grandmont Group.
- [x] **Auto-memory (Claude)** — переписан на Grandmont Group.
- [x] **paths.md** — обновлён.

## Что НЕ трогать

- Реальный отдельный проект `~/Projects/promonta/` (сам бизнес Promonta юзера, Angebot/Baustelle/CRM и т.д.) — не связан, не путать.
- Referо-референсы в `docs/REFERENCE_ANALYSIS.md` — названия компаний-референсов (Sequel, Aker, ThoughtLab и т.д.) не менять.
- Явные упоминания реального Promonta-бизнеса юзера как референса/источника (PROJECT_BRIEF.md блок про происхождение владельца, LEAD_FLOW_SPEC.md текущая форма Promonta, DESIGN_SYSTEM.md старый HEX) — оставлены намеренно с пометкой "другой его бизнес" / "не переносить".

## Процесс — ЗАВЕРШЁН

1. ~~Юзер выбирает финальное имя~~ ✅ Grandmont Group.
2. ~~Проверить финальное имя по Handelsregister.de~~ ✅ свободно на 2026-09-24.
3. ~~Пройтись по всем текстовым файлам~~ ✅ завершено.
4. ~~Переименовать репозиторий, перенести на правильный аккаунт~~ ✅ `whymsiluxe/grandmont-group-website`.
5. ~~Обновить мастер-план, auto-memory, paths.md, локальную папку, VPS-план~~ ✅ завершено. Домен — открытый пункт (не блокирует rename).
