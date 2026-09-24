# CONTENT_MODEL.md (Phase 0.4)

## Страница услуги — структура [REQ]

### Верх страницы
Блоки 1-2 из Aker (см. DESIGN_SYSTEM.md п.5) [REQ].

### Далее 6-8 блоков, каждый до ~100 слов [REQ, юзер прямо указал число]

1. **Was ist enthalten** — Aufbau, Montage, Demontage, Ausrichtung, Befestigung, Anpassungen (Anpassungen — только если юридически допустимо по SERVICE_MATRIX) [REQ]
2. **Für wen** — Privatkunden, Vermieter, Hausverwaltungen, Unternehmen, Möbelhäuser, Küchenstudios [REQ]
3. **Was Sie bekommen** — klare Kommunikation; saubere Ausführung; abgestimmte Termine; professionelle Werkzeuge; saubere Übergabe; Rechnung; Gewährleistung (только если применимо) [REQ]
4. **Ablauf** — 01-06 (см. ниже) [REQ]
5. **Projekt/Referenz** [REQ]
6. **Preis/Kalkulationsprinzip** [REQ] — объясняет принцип расчёта цены, НЕ конкретные цифры [REC-правило: не придумывать цифры, только факторы — вывод из общего REQ юзера "не публиковать неподтверждённые данные"]
7. **FAQ** [REQ]
8. **CTA**: «Kostenloses Angebot anfragen» [REQ]

## Процесс работы (Ablauf) [REQ]

01 Anfrage → 02 Einschätzung → 03 Angebot → 04 Termin → 05 Ausführung/Durchführung → 06 Abnahme.

## Portfolio/Referenzen [REQ]

`/projekte`, категории по услугам. Карточка: Projekt | Ort | Leistung | Dauer | фото | before/after | challenge→solution→result. Только реальные данные, только с разрешением клиента [REQ].

Технически [REQ]: фильтры; категории; before/after; fullscreen viewer; responsive gallery; WebP/AVIF; srcset; lazy loading. Никаких оригиналов 8-15MB напрямую [REQ].

## Доверие/преимущества [REQ]

4-6 преимуществ (кандидаты, подтвердить с юзером): schnelle Terminvergabe; transparente Kalkulation/Preise; saubere Ausführung; zuverlässige Kommunikation; professionelle Werkzeuge; Privat- & Gewerbekunden; kurzfristige Termine; Rechnung; Gewährleistung (если применимо).

Не публиковать неподтверждённые сертификаты/гарантии [REQ].

## Über uns [REQ]

Коротко, НЕ 3-страничная биография: wer wir sind; was wir machen; wo wir arbeiten; warum das Unternehmen existiert; Prinzipien; Ansprechpartner.

## Kontakt [REQ]

Telefon; E-Mail; WhatsApp; Formular; Öffnungszeiten; Einsatzgebiet; Google Maps (если адрес публичный).

## FAQ (стартовый набор) [REQ]

Wie schnell bekomme ich einen Termin? / Arbeiten Sie auch kurzfristig? / Kann ich Fotos meiner Möbel senden? / Wie wird der Preis berechnet? / Arbeiten Sie auch für Unternehmen? / Erstellen Sie Rechnungen? / Welche Regionen bedienen Sie? / Kann ich mehrere Leistungen gleichzeitig buchen?

## B2B — «Für Unternehmen» [REQ]

Аудитория: Möbelhäuser; Küchenstudios; Hausverwaltungen; Immobilienunternehmen; Bauunternehmen; Facility Management; Umzugsunternehmen; Generalunternehmer. CTA: «Partner gesucht?» / «Zusammenarbeit anfragen».

## Tone of voice [REQ]

Естественный немецкий, НЕ машинный перевод — особенно заголовки/CTA/услуги/юр.тексты/FAQ/формы.

## Украинское происхождение — чувствительная формулировка [REQ]

[REQ, дословно от юзера]: «мы с Украины, к нам будет особое отношение, ауслендеры — внимательно прописывать». НЕ оправдательные формулировки («хотя мы иностранцы»). Доверие строится ДО возникновения вопроса через: естественный немецкий; немецкая юр.информация; реальные проекты/фото; местный Ansprechpartner; понятная Rechnung; письменный Angebot; реальные отзывы; профессиональный Ablauf; чистые фото; ясные сроки/часы; понятная связь [REC-интерпретация ChatGPT-брифа, сам юзер решение не формулировал, только обозначил проблему]. Позиционирование: серьёзная локальная немецкая компания.
