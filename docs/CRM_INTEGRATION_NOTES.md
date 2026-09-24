# CRM_INTEGRATION_NOTES.md — интеграция реализована (Phase 5)

Status 2026-09-25: adapter написан и задеплоен (`src/lib/crm/client.ts`),
подтверждён end-to-end тестовым лидом на живом стеке. Client/Object
creation работает полностью. Photo upload на CRM-стороне был сломан,
**пофикшен в тот же день** (см. ниже) — осталось повторно прогнать
тестовый лид с фото сквозь весь пайплайн.

## Auth

`POST /api/auth/login` — email+password → JWT. Bearer, кэшируется в
памяти процесса на 10 минут (без явного `expires_in` в ответе CRM).

## Реальная цепочка (подтверждена, не предположение)

`POST /api/clients` (name/email/phone/postal_code/lead_status/source/notes)
→ `POST /api/objects` (title/client_id/postal_code/status="Anfrage"/gewerke)
→ `POST /api/objects/{id}/photos` по одному файлу (multipart, нет batch-эндпоинта).

- `name` в ClientCreate обязателен, а у формы сайта нет отдельного поля
  "имя" — честно используется `contact` (телефон/email) как name, не
  выдумываем.
- `lead_status` явно ставится `"Kalt"` (дефолт API — `"Warm"`, для
  свежего лида это неверно).
- `objects.status` дефолтится в `"Anfrage"` — совпадает с первым шагом
  REQ-пайплайна (Neue Anfrage), подтверждено, не предположение.
- Нет lookup-by-external-id эндпоинта для idempotency-дедупликации —
  результат пуша записывается в `metadata.json` самого лида
  (`crm: {pushed, clientId, objectId}` или `{pushed:false, stage, error}`),
  ручной retry проверяет это перед повторной отправкой.

## ✅ БАГ CRM НАЙДЕН И ПОФИКШЕН (не в этом репо, фикс в grandmont-group-crm)

**Было: `POST /api/objects/{object_id}/photos` возвращал 500 на любой файл.**

Подтверждено end-to-end тестом 2026-09-25: client (`6ab5a751f6d8f7bb52c7a0bc`)
и object (`6ab5a751f6d8f7bb52c7a0bd`) создались корректно, фото — нет.

Причина (из `journalctl -u grandmont-group-crm` на VPS):
```
File "backend/storage_service.py", line 22, in init_storage
    raise RuntimeError("EMERGENT_LLM_KEY missing")
```

`backend/storage_service.py` требует `EMERGENT_LLM_KEY` в `.env` — этой
переменной там нет. Похоже CRM изначально строился под Emergent-платформу
(S3-подобное object storage через их API-ключ) и при переносе на
self-hosted VPS эта часть не была доведена до конца — не связано с
website-интеграцией, найдено ею.

**Текущее поведение адаптера при этом баге:** photo upload — per-file,
падение одного файла не роняет весь push (object уже создан к этому
моменту). `metadata.json` лида фиксирует `photosFailed` явно, ничего не
скрывается и не выдаёт себя за успех.

**Фикс (2026-09-25, в `grandmont-group-crm`):** `storage_service.py`
переписан на локальное filesystem-хранилище
(`backend/storage/`, chmod 600 на файлах, path-traversal защита в
`_resolve()`). `EMERGENT_LLM_KEY` не заводили — self-hosted VPS не
Emergent-managed. Backup старого файла:
`storage_service.py.bak-pre-local-storage-20260925`. Сервис рестартнут.

**Проверено:** `POST /api/objects/{id}/photos` → 200 (было 500), файл
реально лежит на диске, путь записан в объект. `GET /api/files/{path}`
→ 200, содержимое совпадает байт-в-байт с загруженным.

## Открытые вопросы — закрыты

- ~~Website lead → client сразу или после ревью человеком?~~ → сразу,
  `lead_status: Kalt` — это и есть шаг "Neue Anfrage", подтверждено рабочим
  пайплайном CRM (`objects.status` enum начинается с того же "Anfrage").
- ~~Фото на client или на object?~~ → на object, подтверждено схемой.
- `/api/files/{path}` GET — не исследовано (не нужно для intake-потока,
  это про отдачу уже загруженных файлов обратно).

## Что дальше

- Дождаться фикса `EMERGENT_LLM_KEY`/storage на CRM-стороне, повторно
  прогнать тестовый лид с фото.
- `/api/quotes` (создание Angebot) — вне scope intake-adapter, отдельная
  downstream-задача (REQ: финальная цена контролируется человеком).
