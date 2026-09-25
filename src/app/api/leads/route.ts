import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { isLocale } from "@/i18n/config";
import { listApprovedServices } from "@/lib/cms/content-source";
import { pushLeadToCrm } from "@/lib/crm/client";

export const runtime = "nodejs";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_TOTAL_SIZE = 40 * 1024 * 1024;
const MAX_REQUEST_SIZE = MAX_TOTAL_SIZE + 512 * 1024;
const MAX_POSTCODE_LENGTH = 80;
const MAX_NAME_LENGTH = 160;
const MAX_CONTACT_LENGTH = 160;
const MAX_DESCRIPTION_LENGTH = 1800;
const MAX_ATTRIBUTION_LENGTH = 500;
const MIN_PHONE_DIGITS = 6;
const SUBMISSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DEFAULT_LEAD_RETENTION_DAYS = 90;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 12;
const EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/i;
const VALID_IMAGE_PREFIXES = [
  [0xff, 0xd8, 0xff],
  [0x89, 0x50, 0x4e, 0x47],
];

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type LeadAttribution = Partial<
  Record<
    | "landingPath"
    | "referrer"
    | "utmSource"
    | "utmMedium"
    | "utmCampaign"
    | "utmTerm"
    | "utmContent"
    | "gclid"
    | "fbclid",
    string
  >
>;

const rateLimitByIp = new Map<string, RateLimitEntry>();

function textValue(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function clientIp(request: Request) {
  // Trust boundary: this app is only reachable through Caddy (port 3020 is
  // not in the VPS firewall allow-list — see server-structure.md), and
  // Caddy's reverse_proxy appends the real connecting IP as the LAST hop
  // in X-Forwarded-For rather than passing through whatever the client
  // sent. Taking the first (client-supplied, spoofable) entry would let
  // anyone bypass rate limiting by sending a fake header; the last entry
  // is the one Caddy itself set.
  const forwarded = request.headers.get("x-forwarded-for");
  const lastHop = forwarded?.split(",").pop()?.trim();
  return lastHop || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  for (const [key, entry] of rateLimitByIp.entries()) {
    if (entry.resetAt <= now) rateLimitByIp.delete(key);
  }

  const current = rateLimitByIp.get(ip);
  if (!current) {
    rateLimitByIp.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function requestSizeTooLarge(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  return Number.isFinite(contentLength) && contentLength > MAX_REQUEST_SIZE;
}

function hasPlausibleContact(value: string) {
  if (EMAIL_PATTERN.test(value)) return true;
  const digits = value.replace(/\D/g, "");
  return digits.length >= MIN_PHONE_DIGITS;
}

// The client mints one UUID per submission attempt and resends the same
// value on a retry of that same attempt (network failure, not a fresh
// form fill-out). Keying the lead directory — and therefore the CRM
// external_id in pushLeadToCrm — off that value means a retried request
// lands on the exact same lead instead of creating a duplicate. Falls
// back to a server-generated id when the field is missing or malformed
// (older cached client bundle, non-browser client) so the endpoint still
// works without it; the pattern check also keeps the value safe to use
// as a filesystem path segment.
function resolveLeadId(data: FormData) {
  const submissionId = textValue(data, "submissionId");
  if (SUBMISSION_ID_PATTERN.test(submissionId)) return `lead_${submissionId.toLowerCase()}`;
  return `lead_${Date.now()}_${randomUUID()}`;
}

function attributionValue(data: FormData, key: string) {
  return textValue(data, key).slice(0, MAX_ATTRIBUTION_LENGTH);
}

function collectAttribution(data: FormData): LeadAttribution {
  return {
    landingPath: attributionValue(data, "landingPath"),
    referrer: attributionValue(data, "referrer"),
    utmSource: attributionValue(data, "utm_source"),
    utmMedium: attributionValue(data, "utm_medium"),
    utmCampaign: attributionValue(data, "utm_campaign"),
    utmTerm: attributionValue(data, "utm_term"),
    utmContent: attributionValue(data, "utm_content"),
    gclid: attributionValue(data, "gclid"),
    fbclid: attributionValue(data, "fbclid"),
  };
}

function compactAttribution(attribution: LeadAttribution) {
  return Object.fromEntries(Object.entries(attribution).filter(([, value]) => Boolean(value)));
}

// "heic" is its own outcome, not folded into "valid": the installed sharp
// build (prebuilt libvips, no HEVC decoder — see node_modules/sharp
// format table, heif input is AVIF-only) cannot actually decode HEIC/HEIF,
// so accepting the signature here would let the file through validation
// only to blow up inside storeLead()'s sharp() call, which the caller
// then reports as a generic "storage not configured" 503 — misleading for
// what is, for a lot of iPhone users, the default camera format.
async function classifyImageSignature(file: File): Promise<"valid" | "heic" | "invalid"> {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (VALID_IMAGE_PREFIXES.some((prefix) => prefix.every((byte, index) => bytes[index] === byte))) return "valid";
  const signature = new TextDecoder("latin1").decode(bytes);
  if (signature.startsWith("RIFF") && signature.slice(8, 12) === "WEBP") return "valid";
  if (signature.includes("ftypheic") || signature.includes("ftypheif") || signature.includes("ftypmif1")) return "heic";
  return "invalid";
}

function configuredStorageDir() {
  const dir = process.env.LEAD_STORAGE_DIR?.trim();
  if (!dir) return null;
  if (!path.isAbsolute(dir)) throw new Error("LEAD_STORAGE_DIR must be absolute");
  if (dir.includes(`${path.sep}public${path.sep}`)) throw new Error("LEAD_STORAGE_DIR must not be public");
  return dir;
}

function leadRetentionDays() {
  const raw = process.env.LEAD_RETENTION_DAYS?.trim();
  if (!raw) return DEFAULT_LEAD_RETENTION_DAYS;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 3650) {
    throw new Error("LEAD_RETENTION_DAYS must be an integer between 1 and 3650");
  }
  return value;
}

async function storeLead(params: {
  leadId: string;
  locale: string;
  service: string;
  postcode: string;
  description: string;
  name: string;
  contact: string;
  photos: File[];
  attribution: LeadAttribution;
}) {
  const storageDir = configuredStorageDir();
  if (!storageDir) return null;

  const { leadId } = params;
  // storageDir is validated absolute and outside public/ (configuredStorageDir
  // above); leadId is either a UUID from resolveLeadId's regex-checked
  // submissionId or a server-generated id, never user-controlled path
  // segments. turbopackIgnore avoids Next's output tracer conservatively
  // bundling the whole project just because this join isn't statically
  // resolvable to a literal.
  const leadDir = path.join(/* turbopackIgnore: true */ storageDir, leadId);
  const retentionDays = leadRetentionDays();
  const deleteAfter = new Date(Date.now() + retentionDays * MS_PER_DAY).toISOString();
  await mkdir(leadDir, { recursive: true, mode: 0o700 });

  try {
    const savedPhotos = [];

    for (const [index, photo] of params.photos.entries()) {
      const input = Buffer.from(await photo.arrayBuffer());
      const output = await sharp(input, { failOn: "error" })
        .rotate()
        .jpeg({ quality: 84, mozjpeg: true })
        .toBuffer();
      const filename = `photo-${String(index + 1).padStart(2, "0")}.jpg`;
      await writeFile(path.join(leadDir, filename), output, { mode: 0o600 });
      savedPhotos.push({
        filename,
        originalName: photo.name,
        originalType: photo.type,
        originalBytes: photo.size,
        storedBytes: output.length,
      });
    }

    await writeFile(
      path.join(leadDir, "metadata.json"),
      JSON.stringify(
        {
          id: leadId,
          createdAt: new Date().toISOString(),
          locale: params.locale,
          service: params.service,
          postcode: params.postcode,
          description: params.description,
          name: params.name || undefined,
          contact: params.contact,
          attribution: compactAttribution(params.attribution),
          retention: {
            days: retentionDays,
            deleteAfter,
          },
          photos: savedPhotos,
          storage: "private-filesystem",
        },
        null,
        2,
      ),
      { mode: 0o600 },
    );

    return { leadId, leadDir, photoPaths: savedPhotos.map((p) => path.join(leadDir, p.filename)) };
  } catch (error) {
    await rm(leadDir, { recursive: true, force: true });
    throw error;
  }
}

async function notifyTeam(params: {
  leadId: string;
  locale: string;
  service: string;
  postcode: string;
  description: string;
  contact: string;
  photoCount: number;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return false;

  const approvedServices = await listApprovedServices();
  const serviceTitle = approvedServices.find((item) => item.slug === params.service)?.title.de || params.service;
  const text = [
    `Neue Anfrage: ${params.leadId}`,
    `Leistung: ${serviceTitle}`,
    `PLZ/Ort: ${params.postcode}`,
    `Kontakt: ${params.contact}`,
    `Fotos: ${params.photoCount}`,
    `Sprache: ${params.locale}`,
    "",
    params.description,
  ].join("\n");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  return response.ok;
}

// Отправляет лид в CRM и дописывает результат в metadata.json того же
// лида — так в приватном хранилище всегда видно, дошла ли заявка до
// CRM (crm: { pushed: true, clientId, objectId } либо
// crm: { pushed: false, stage, error } для ручного дослать позже).
// Не бросает исключения наружу — вызывается через `void` в основном
// хендлере, ответ клиенту уже отправлен независимо от результата.
async function pushLeadToCrmAndRecord(params: {
  leadId: string;
  leadDir: string;
  service: string;
  postcode: string;
  description: string;
  name: string;
  contact: string;
  locale: string;
  pageUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  photoPaths: string[];
}) {
  const result = await pushLeadToCrm({
    leadId: params.leadId,
    service: params.service,
    postcode: params.postcode,
    description: params.description,
    name: params.name || undefined,
    contact: params.contact,
    locale: params.locale,
    pageUrl: params.pageUrl,
    utmSource: params.utmSource,
    utmMedium: params.utmMedium,
    utmCampaign: params.utmCampaign,
    photoPaths: params.photoPaths,
  }).catch(
    (error): Awaited<ReturnType<typeof pushLeadToCrm>> => ({
      ok: false,
      stage: "lead",
      error: error instanceof Error ? error.message : String(error),
    }),
  );

  try {
    const metadataPath = path.join(params.leadDir, "metadata.json");
    const raw = await readFile(metadataPath, "utf-8");
    const metadata = JSON.parse(raw);
    metadata.crm = result.ok
      ? {
          pushed: true,
          leadId: result.crmLeadId,
          duplicate: result.duplicate,
          attachmentsAttached: result.attachmentsAttached,
          attachmentsDuplicatesSkipped: result.attachmentsDuplicatesSkipped,
          pushedAt: new Date().toISOString(),
        }
      : { pushed: false, stage: result.stage, error: result.error, attemptedAt: new Date().toISOString() };
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2), { mode: 0o600 });
  } catch {
    // Обновление metadata.json — вторичный шаг (наблюдаемость), не
    // должен маскировать/ронять сам CRM push, если файл почему-то
    // недоступен для чтения/записи в моменте.
  }
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, message: "Too many requests." }, { status: 429 });
  }

  if (requestSizeTooLarge(request)) {
    return NextResponse.json({ ok: false, message: "Request is too large." }, { status: 413 });
  }

  const data = await request.formData();
  const submittedLocale = textValue(data, "locale") || "de";
  const locale = isLocale(submittedLocale) ? submittedLocale : "de";
  const website = textValue(data, "website");
  const service = textValue(data, "service");
  const postcode = textValue(data, "postcode");
  const description = textValue(data, "description");
  const name = textValue(data, "name").slice(0, MAX_NAME_LENGTH);
  const contact = textValue(data, "contact");
  const attribution = collectAttribution(data);
  const attributionFields = compactAttribution(attribution);
  const photos = data.getAll("photos").filter((item): item is File => item instanceof File && item.size > 0);
  const approvedServices = await listApprovedServices();
  const approvedSlugs = new Set(approvedServices.map((item) => item.slug));

  const errorMessage =
    locale === "en" ? "Please check the request fields and photos." : "Bitte prüfen Sie Angaben und Fotos.";

  if (website) {
    return NextResponse.json({
      ok: true,
      status: "ignored",
      message: locale === "en" ? "Request received." : "Anfrage erhalten.",
    });
  }

  if (
    !approvedSlugs.has(service) ||
    postcode.length < 3 ||
    postcode.length > MAX_POSTCODE_LENGTH ||
    description.length < 20 ||
    description.length > MAX_DESCRIPTION_LENGTH ||
    contact.length < 5 ||
    contact.length > MAX_CONTACT_LENGTH ||
    !hasPlausibleContact(contact)
  ) {
    return NextResponse.json({ ok: false, message: errorMessage }, { status: 400 });
  }

  if (photos.length < 1 || photos.length > MAX_FILES) {
    return NextResponse.json({ ok: false, message: errorMessage }, { status: 400 });
  }

  const totalSize = photos.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > MAX_TOTAL_SIZE || photos.some((file) => file.size > MAX_FILE_SIZE)) {
    return NextResponse.json({ ok: false, message: errorMessage }, { status: 400 });
  }

  const heicMessage =
    locale === "en"
      ? "HEIC/HEIF photos aren't supported yet — please switch to JPG, PNG or WebP (on iPhone: Settings > Camera > Formats > Most Compatible, or choose \"Save as JPEG\" when picking a file)."
      : "HEIC/HEIF-Fotos werden noch nicht unterstützt — bitte JPG, PNG oder WebP verwenden (am iPhone: Einstellungen > Kamera > Formate > Meist kompatibel, oder beim Auswählen „Als JPEG sichern“).";

  for (const photo of photos) {
    const signature = await classifyImageSignature(photo);
    if (signature === "heic") {
      return NextResponse.json({ ok: false, message: heicMessage }, { status: 400 });
    }
    if (signature === "invalid") {
      return NextResponse.json({ ok: false, message: errorMessage }, { status: 400 });
    }
  }

  const leadId = resolveLeadId(data);
  let storeResult: Awaited<ReturnType<typeof storeLead>> = null;

  try {
    storeResult = await storeLead({
      leadId,
      locale,
      service,
      postcode,
      description,
      name,
      contact,
      photos,
      attribution,
    });
  } catch {
    storeResult = null;
  }

  if (!storeResult) {
    const message =
      locale === "en"
        ? "Request could not be saved. Secure storage is not configured yet — please contact us by phone or WhatsApp instead."
        : "Anfrage konnte nicht gespeichert werden. Sichere Speicherung ist noch nicht konfiguriert — bitte per Telefon oder WhatsApp kontaktieren.";
    return NextResponse.json({ ok: false, message }, { status: 503 });
  }

  const { leadDir, photoPaths } = storeResult;

  const notificationSent = await notifyTeam({
    leadId,
    locale,
    service,
    postcode,
    description,
    contact,
    photoCount: photos.length,
  }).catch(() => false);

  // CRM push — best-effort по результату (не роняет ответ клиенту при
  // ошибке), но awaited: процесс здесь persistent Node (runtime =
  // "nodejs", не serverless/edge), fire-and-forget рисковал бы обрубить
  // запрос при рестарте/деплое между storeLead и завершением push без
  // всякого следа. Лид уже надёжно сохранён локально в любом случае —
  // если CRM недоступна, заявка не теряется, просто требует ручного
  // дослать позже по metadata.json.
  await pushLeadToCrmAndRecord({
    leadId,
    leadDir,
    service,
    postcode,
    description,
    name,
    contact,
    locale,
    pageUrl: attribution.landingPath,
    utmSource: attribution.utmSource,
    utmMedium: attribution.utmMedium,
    utmCampaign: attribution.utmCampaign,
    photoPaths,
  });

  const message =
    locale === "en"
      ? "Request received. We will review it and get back to you."
      : "Anfrage erhalten. Wir prüfen sie und melden uns.";

  return NextResponse.json({
    ok: true,
    status: "stored",
    message,
    leadId,
    notificationSent,
    draft: {
      service,
      postcode,
      descriptionLength: description.length,
      contactProvided: true,
      photoCount: photos.length,
      totalPhotoBytes: totalSize,
      attributionCaptured: Object.keys(attributionFields).length > 0,
    },
  });
}
