# DESIGN_SYSTEM.md — Brand & Design Tokens (Phase 0.4)

Синтез `REFERENCE_ANALYSIS.md` в конкретные токены. Источник принципов — 8 Refero-референсов [REQ, план блок 2]. Ничего не скопировано дословно — только адаптированные принципы.

## Статус: ЧЕРНОВИК ДЛЯ PHASE 1/2

Конкретные HEX/шрифты ниже — [REC], предложение Claude на основе анализа референсов. Финальное утверждение — на Phase 2 (Design proof), когда юзер увидит реальный макет и скажет "выглядит дорого" (go/no-go).

---

## 1. Палитра [REC]

Основа — Sequel (ахроматика + один тёплый акцент), с терракотовым/тёплым акцентом в духе Aker. **Явно исключена** палитра Vivid+Co (#101010–#495764 blue-gray диапазон) [REQ — прямой запрет юзера].

| Токен | Значение (черновик) | Источник |
|---|---|---|
| `--color-bg-primary` | near-black, тёплый оттенок (не холодный blue-black) | Sequel |
| `--color-bg-surface` | #1a1816 (тёплый matte dark) | Sequel/ThoughtLab-подобный, теплее |
| `--color-text-primary` | тёплый ivory/cream (не чистый белый) | Sequel |
| `--color-text-muted` | нейтральный серый (тёплый, не blue-gray) | Sequel |
| `--color-accent` | тёплый терракотовый/латунный (заменяет terracotta Aker под бренд Grandmont Group) | Aker |
| `--color-bg-light` | тёплый кремовый #f7f5f3 (для light-секций, "Block2"-переходов) | Cosmos/Aker Block2 |

**[DECIDE]** Точный HEX акцентного цвета для Grandmont Group — новый бренд, не связан с существующим брендом Promonta юзера (тот HEX `#003060`/`#FF9900` сюда не переносится) — определить на Phase 1/2 design-proof, не по аналогии со старым проектом.

## 2. Типографика [REC]

- Основной шрифт — геометрический sans с широким весовым диапазоном (300-700), лицензионно чистый. Кандидаты: **Space Grotesk**, **Inter**, **Neue Haas Grotesk Display** — финальный выбор на Phase 1, проверить лицензию перед подключением [REQ, план блок 2 п.5 ThoughtLab].
- Display-заголовки — вес 300 (light/whisper), крупный кегль (62-168px на десктопе), а не bold — приём из Aker/Sequel/Vivid+Co.
- Body — вес 400-500, комфортный line-height (1.4-1.7).
- Uppercase tracked labels (0.03-0.08em) для навигации/лейблов — приём Sequel/Art+Commerce.
- **НЕ использовать** шрифт "sui" (ThoughtLab, проприетарный, лицензия не найдена).

## 3. Type Scale [REC]

Minor Third (1.2) от базы 16-18px — паттерн, повторяющийся в Sequel/Cosmos/ThoughtLab/Lusion. Предложение взять за основу.

## 4. Spacing & Shape [REC]

- Единый border-radius на систему (не смешивать разные радиусы) — Cosmos использует 16px везде; ThoughtLab/Hyper Tria — 0 (острые углы). Для Grandmont Group — выбрать один режим, не смешивать.
- Comfortable spacing scale, base 4px.
- Тени — минимальные/функциональные, не декоративные (drop-shadow только где физически логично).

## 5. Верх страницы услуги — ОБЯЗАТЕЛЬНЫЙ ПАТТЕРН [REQ, план блок 6.1]

**Block 1 (Hero, dark):**
- Full-bleed фото-фон (реальный объект/архитектура/деталь работы Grandmont Group, НЕ stock)
- Короткий tagline вверху слева
- Крупный service-название внизу слева, обрезанное краем экрана (приём Aker)
- Справа — floating card с превью+CTA-стрелкой
- Минимальный chrome

**Block 2 (резкий cut в light):**
- Тёмный full-bleed → чистый светлый (кремовый) холст
- Один крупный текстовый абзац (заявление о ценности услуги), большой воздух вокруг

## 6. Motion-система [REQ количество, REC типология]

10-15 заметных motion-моментов на ВЕСЬ сайт [REQ, план блок 3], не на каждую страницу:

1. Aker-паттерн top-of-page (используется на каждой service-странице — считается как один системный момент, не 14 отдельных)
2. Lusion-подобный depth/scroll-camera момент — точечно, 1 раз (вероятно homepage hero)
3. Art+Commerce-подобный scale-in+fade при входе изображений в viewport — портфолио/галереи
4. Hyper Tria-подобный sticky-image + scroll-through-text — для `/projekte` карточек или before/after
5. Cosmos-подобная свободная коллажная раскладка (статичная композиция, не анимация per se)
6. Text-line reveal на заголовках
7. Micro hover на карточках/кнопках
8. Masked image reveal на портфолио
9. Crossfade между состояниями (напр. before/after)
10. Immersive hero (homepage)

`prefers-reduced-motion` — обязательный fallback [REC-реализация REQ юзера про адаптацию под все устройства].

## 7. Depth-принцип [REC — расшифровка Claude]

НЕ box-shadow/glass/blur везде. Depth = photography + масштаб + overlap + masking + light/dark переходы + controlled parallax + sticky storytelling + spatial композиция + типографика + движение + whitespace [REQ формулировка "объёмно", план блок 2.2].

## 8. Portfolio grid [REC]

Cosmos-подобная галерейная сетка на кремовом фоне, единый radius, no gradients/shadows — для `/projekte`.

## 9. Логотип и Brand [REQ определить; REC направление]

**[REQ]** Юзер требовал определить лого как часть brand system.
**[REC]** Направление — НЕ крыша+молоток+гаечный ключ (клише стройки), а wordmark + абстрактный знак. Финальная разработка — вне scope Phase 0, отдельная задача Phase 1/2.

## 10. Что НЕ делать в дизайне [REQ]

Не шаблонно, не дёшево, не stock-фото, без Bootstrap-темы, без жёлтая-каска-стоковое-фото эстетики, без корпоративного синего цвета подрядчика, без бесконечных скруглённых карточек, без AI-generated шаблонного вида, без дешёвого glassmorphism, без перегруженного WebGL-демо на каждой странице.
