# PERFORMANCE_BUDGET.md (Phase 0.4)

## Цели [REQ]

Быстрый первый экран; оптимизированные изображения; минимальный JS; lazy loading; caching; CDN; WebP/AVIF; Core Web Vitals. Минификация CSS/JS [REQ, было пропущено на раннем этапе плана, восстановлено при финальном тегировании] + code-splitting. Не красивый сайт с 5-секундной загрузкой [REQ].

## Целевые метрики [REC — отраслевой стандарт Google, юзер сам цифры не называл]

- LCP (Largest Contentful Paint) ≤ 2.5s
- INP (Interaction to Next Paint) ≤ 200ms
- CLS (Cumulative Layout Shift) ≤ 0.1

Юзер требовал «Core Web Vitals» в общем виде — конкретные пороговые значения выше взяты из официальных рекомендаций Google, не придуманы произвольно.

## Responsive / тестирование [REQ + REC breakpoints]

[REQ] Адаптация под все устройства/девайсы, ничего не съезжает/не обрезается/не искажается/без horizontal scroll/без артефактов.

[REC] Конкретные breakpoints: 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920+; portrait/landscape; mouse/touch.

## Тестирование [REQ три вида явно + REC детали]

[REQ] Кросс-браузерное, кросс-девайсное, нагрузочное тестирование — все три явно названы юзером.

[REC] Конкретный список браузеров/устройств (детализация, не список юзера): Chrome, Safari, Firefox, Edge, iOS Safari, Android Chrome.

[REQ] Accessibility-аудит и Lighthouse-оценки.

## Accessibility [REQ — «accessibility-аудит»]

WCAG 2.2 AA где практично [REC-уровень]: семантический HTML; keyboard-навигация; focus-состояния; labels; контраст; alt-текст; понятные ошибки форм; touch-targets достаточного размера; reduced motion (`prefers-reduced-motion`).

## Motion vs performance [REC — логическое следствие]

Анимация не должна ломать Core Web Vitals/SEO/accessibility/mobile UX — логическое следствие REQ юзера «быть быстрым» + «адаптирован под все устройства». Одна согласованная motion-библиотека на весь сайт, не несколько одновременно [REC]. Mobile — упрощённые версии тяжёлых motion-сцен без артефактов [REQ, из общего требования адаптации под все устройства].

## Проверка на Phase 8

Core Web Vitals измерены (LCP/INP/CLS) — mobile и desktop; Lighthouse прогон (performance/accessibility/SEO/best practices); кросс-браузерное и кросс-device тестирование на реальных устройствах; нагрузочное/load-тестирование; 404/500 страницы; form/upload failure states протестированы; минификация CSS/JS подтверждена в production build.
