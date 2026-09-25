// Адаптер к CRM (crm.promonta.fun) — отправка website-лидов в реальный
// pipeline через публичный webhook (см. docs/CRM_INTEGRATION_NOTES.md).
// НЕ вторая CRM, просто клиент к уже существующему API.
//
// Важно: это best-effort слой поверх уже сохранённого лида. Лид уже
// надёжно лежит в приватном filesystem (см. storeLead() в
// /api/leads/route.ts) ДО того, как этот код вообще вызывается — если
// CRM недоступна/упала, лид всё равно не теряется, просто не попадает
// в CRM автоматически (можно дослать вручную по metadata.json).
//
// Модель: website НЕ логинится в CRM и не создаёт Client/Object
// напрямую (старая service-account/JWT схема удалена). Вместо этого —
// два публичных webhook-эндпоинта, защищённых общим секретом:
//   POST /public/leads/website           → создаёт/находит CRM Lead
//   POST /public/leads/{lead_id}/attachments → прикрепляет фото к Lead
// Конверсия Lead → Client/Object делается вручную в самой CRM позже,
// не автоматически при intake.

const CRM_BASE_URL = process.env.CRM_BASE_URL || "https://crm.promonta.fun/api";
const CRM_WEBHOOK_SECRET = process.env.CRM_WEBHOOK_SECRET;

export type CrmLeadInput = {
  leadId: string; // website leadId — передаётся как external_id, ключ идемпотентности на CRM-стороне
  service: string;
  postcode: string;
  description: string;
  name?: string;
  contact: string; // телефон или email, как есть с формы
  locale: string;
  pageUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  photoPaths: string[]; // абсолютные пути к уже сохранённым JPEG (rotate+re-encode+EXIF-stripped) на диске
};

export type CrmPushResult =
  | {
      ok: true;
      crmLeadId: string;
      duplicate: boolean;
      attachmentsAttached: number;
      attachmentsDuplicatesSkipped: number;
    }
  | { ok: false; stage: "lead" | "attachments"; error: string };

function splitContact(contact: string): { email?: string; phone?: string } {
  const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/i;
  if (emailPattern.test(contact)) return { email: contact };
  return { phone: contact };
}

async function submitLead(
  input: CrmLeadInput,
): Promise<{ leadId: string; duplicate: boolean }> {
  const { email, phone } = splitContact(input.contact);
  const res = await fetch(`${CRM_BASE_URL}/public/leads/website`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webhook-Secret": CRM_WEBHOOK_SECRET as string,
    },
    body: JSON.stringify({
      external_id: input.leadId,
      name: input.name || null,
      email: email || null,
      phone: phone || null,
      message: input.description,
      service: input.service,
      postcode: input.postcode,
      locale: input.locale,
      utm_source: input.utmSource || null,
      utm_medium: input.utmMedium || null,
      utm_campaign: input.utmCampaign || null,
      page_url: input.pageUrl || null,
    }),
  });
  if (!res.ok) throw new Error(`CRM lead webhook failed: HTTP ${res.status} — ${await res.text()}`);
  const body = (await res.json()) as { lead_id: string; duplicate?: boolean };
  return { leadId: body.lead_id, duplicate: Boolean(body.duplicate) };
}

async function submitAttachments(
  crmLeadId: string,
  photoPaths: string[],
): Promise<{ attached: number; duplicatesSkipped: number }> {
  const { readFile } = await import("node:fs/promises");
  const path = await import("node:path");

  const form = new FormData();
  for (const photoPath of photoPaths) {
    const buffer = await readFile(photoPath);
    form.append("files", new Blob([buffer], { type: "image/jpeg" }), path.basename(photoPath));
  }

  const res = await fetch(`${CRM_BASE_URL}/public/leads/${crmLeadId}/attachments`, {
    method: "POST",
    headers: { "X-Webhook-Secret": CRM_WEBHOOK_SECRET as string },
    body: form,
  });
  if (!res.ok) throw new Error(`CRM attachments webhook failed: HTTP ${res.status} — ${await res.text()}`);
  const body = (await res.json()) as { attached: number; duplicates_skipped: number };
  return { attached: body.attached, duplicatesSkipped: body.duplicates_skipped };
}

/**
 * Отправляет уже сохранённый website-лид в CRM: lead webhook →
 * attachments webhook (если есть фото). Idempotent на CRM-стороне по
 * external_id (lead) и sha256 (attachments) — повторный вызов с тем же
 * leadId и теми же байтами фото не создаёт дублей.
 */
export async function pushLeadToCrm(input: CrmLeadInput): Promise<CrmPushResult> {
  if (!CRM_WEBHOOK_SECRET) {
    return { ok: false, stage: "lead", error: "CRM_WEBHOOK_SECRET not configured" };
  }

  let crmLeadId: string;
  let duplicate: boolean;
  try {
    const result = await submitLead(input);
    crmLeadId = result.leadId;
    duplicate = result.duplicate;
  } catch (error) {
    return { ok: false, stage: "lead", error: error instanceof Error ? error.message : String(error) };
  }

  let attachmentsAttached = 0;
  let attachmentsDuplicatesSkipped = 0;
  if (input.photoPaths.length > 0) {
    try {
      const result = await submitAttachments(crmLeadId, input.photoPaths);
      attachmentsAttached = result.attached;
      attachmentsDuplicatesSkipped = result.duplicatesSkipped;
    } catch (error) {
      // Lead уже создан/найден на этом этапе — не теряем это в ошибке,
      // но вложения не прикреплены в этом вызове.
      return {
        ok: false,
        stage: "attachments",
        error: `${error instanceof Error ? error.message : String(error)} (CRM lead ${crmLeadId} уже создан)`,
      };
    }
  }

  return { ok: true, crmLeadId, duplicate, attachmentsAttached, attachmentsDuplicatesSkipped };
}
