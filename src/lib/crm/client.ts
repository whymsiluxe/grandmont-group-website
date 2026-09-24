// Адаптер к CRM (crm.promonta.fun) — отправка website-лидов в реальный
// pipeline (Neue Anfrage → Kontaktiert → ...). НЕ вторая CRM, просто
// клиент к уже существующему API (см. docs/CRM_INTEGRATION_NOTES.md).
//
// Важно: это best-effort слой поверх уже сохранённого лида. Лид уже
// надёжно лежит в приватном filesystem (см. storeLead() в
// /api/leads/route.ts) ДО того, как этот код вообще вызывается — если
// CRM недоступна/упала, лид всё равно не теряется, просто не попадает
// в CRM автоматически (можно дослать вручную по metadata.json).

const CRM_BASE_URL = process.env.CRM_BASE_URL || "https://crm.promonta.fun/api";
const CRM_SERVICE_EMAIL = process.env.CRM_SERVICE_EMAIL;
const CRM_SERVICE_PASSWORD = process.env.CRM_SERVICE_PASSWORD;

type LeadStatus = "Kalt" | "Warm" | "Auftrag";
type ObjectStatus = "Anfrage" | "Angebot erstellt" | "Beauftragt" | "In Arbeit" | "Abgeschlossen" | "Storniert";

export type CrmLeadInput = {
  leadId: string;
  service: string;
  serviceTitleDe: string;
  postcode: string;
  description: string;
  name?: string; // опциональное поле формы — если пусто, CRM получает contact как name (fallback)
  contact: string; // телефон или email, как есть с формы
  photoPaths: string[]; // абсолютные пути к уже сохранённым JPEG на диске
};

export type CrmPushResult =
  | { ok: true; clientId: string; objectId: string; photosUploaded: number; photosFailed: number }
  | { ok: false; stage: "auth" | "client" | "object" | "photos"; error: string };

let cachedToken: { token: string; expiresAt: number } | null = null;

// Токен кэшируется в памяти процесса на время его жизни (не персистится
// между рестартами) — избегаем логина на каждый лид, но и не строим
// отдельное персистентное хранилище токена ради этого.
async function getAuthToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  if (!CRM_SERVICE_EMAIL || !CRM_SERVICE_PASSWORD) {
    throw new Error("CRM_SERVICE_EMAIL/CRM_SERVICE_PASSWORD не заданы");
  }

  const res = await fetch(`${CRM_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: CRM_SERVICE_EMAIL, password: CRM_SERVICE_PASSWORD }),
  });
  if (!res.ok) throw new Error(`CRM login failed: HTTP ${res.status}`);
  const body = (await res.json()) as { access_token: string };

  // JWT без явного expires_in в ответе — держим кэш короткий (10 минут),
  // безопаснее перелогиниться лишний раз, чем словить протухший токен.
  cachedToken = { token: body.access_token, expiresAt: Date.now() + 10 * 60_000 };
  return body.access_token;
}

function splitContact(contact: string): { email?: string; phone?: string } {
  const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/i;
  if (emailPattern.test(contact)) return { email: contact };
  return { phone: contact };
}

async function createClient(token: string, input: CrmLeadInput): Promise<string> {
  const { email, phone } = splitContact(input.contact);
  const res = await fetch(`${CRM_BASE_URL}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      // Форма даёт опциональное поле "имя"; если клиент его не заполнил,
      // используем contact (телефон/email) как name — честно, не
      // выдумываем имя клиента.
      name: input.name || input.contact,
      email,
      phone,
      postal_code: input.postcode,
      lead_status: "Kalt" satisfies LeadStatus,
      source: "grandmont-website",
      notes: input.description,
    }),
  });
  if (!res.ok) throw new Error(`CRM client create failed: HTTP ${res.status} — ${await res.text()}`);
  const body = (await res.json()) as { id: string };
  return body.id;
}

async function createObject(token: string, clientId: string, input: CrmLeadInput): Promise<string> {
  const res = await fetch(`${CRM_BASE_URL}/objects`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      title: `${input.serviceTitleDe} — ${input.postcode}`,
      client_id: clientId,
      postal_code: input.postcode,
      status: "Anfrage" satisfies ObjectStatus,
      gewerke: [input.service],
    }),
  });
  if (!res.ok) throw new Error(`CRM object create failed: HTTP ${res.status} — ${await res.text()}`);
  const body = (await res.json()) as { id: string };
  return body.id;
}

async function uploadPhoto(token: string, objectId: string, photoPath: string): Promise<boolean> {
  const { readFile } = await import("node:fs/promises");
  const path = await import("node:path");
  try {
    const buffer = await readFile(photoPath);
    const form = new FormData();
    form.append("file", new Blob([buffer], { type: "image/jpeg" }), path.basename(photoPath));
    const res = await fetch(`${CRM_BASE_URL}/objects/${objectId}/photos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Отправляет уже сохранённый лид в CRM: client → object → фото (по
 * одному, best-effort — падение одной фотографии не роняет весь пуш).
 * Idempotency: вызывающий код (route.ts) должен передавать этот вызов
 * только для лидов, у которых ещё нет crmClientId в metadata.json —
 * сам adapter не хранит состояние между вызовами.
 */
export async function pushLeadToCrm(input: CrmLeadInput): Promise<CrmPushResult> {
  if (!CRM_SERVICE_EMAIL || !CRM_SERVICE_PASSWORD) {
    return { ok: false, stage: "auth", error: "CRM credentials not configured" };
  }

  let token: string;
  try {
    token = await getAuthToken();
  } catch (error) {
    return { ok: false, stage: "auth", error: error instanceof Error ? error.message : String(error) };
  }

  let clientId: string;
  try {
    clientId = await createClient(token, input);
  } catch (error) {
    return { ok: false, stage: "client", error: error instanceof Error ? error.message : String(error) };
  }

  let objectId: string;
  try {
    objectId = await createObject(token, clientId, input);
  } catch (error) {
    // Клиент уже создан в CRM на этом этапе — не теряем это в ошибке,
    // но сам объект не создан. Вызывающий код должен залогировать
    // clientId вместе с ошибкой, чтобы не плодить дублей при retry.
    return {
      ok: false,
      stage: "object",
      error: `${error instanceof Error ? error.message : String(error)} (client ${clientId} уже создан)`,
    };
  }

  let photosUploaded = 0;
  let photosFailed = 0;
  for (const photoPath of input.photoPaths) {
    const success = await uploadPhoto(token, objectId, photoPath);
    if (success) photosUploaded += 1;
    else photosFailed += 1;
  }

  return { ok: true, clientId, objectId, photosUploaded, photosFailed };
}
