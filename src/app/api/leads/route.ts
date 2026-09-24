import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { isLocale } from "@/i18n/config";
import { listApprovedServices } from "@/lib/cms/content-source";

export const runtime = "nodejs";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_TOTAL_SIZE = 40 * 1024 * 1024;
const MAX_REQUEST_SIZE = MAX_TOTAL_SIZE + 512 * 1024;
const MAX_POSTCODE_LENGTH = 80;
const MAX_CONTACT_LENGTH = 160;
const MAX_DESCRIPTION_LENGTH = 1800;
const MAX_ATTRIBUTION_LENGTH = 500;
const MIN_PHONE_DIGITS = 6;
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
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
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

async function hasValidImageSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (VALID_IMAGE_PREFIXES.some((prefix) => prefix.every((byte, index) => bytes[index] === byte))) return true;
  const signature = new TextDecoder("latin1").decode(bytes);
  const isWebp = signature.startsWith("RIFF") && signature.slice(8, 12) === "WEBP";
  const isHeic = signature.includes("ftypheic") || signature.includes("ftypheif") || signature.includes("ftypmif1");
  return isWebp || isHeic;
}

function configuredStorageDir() {
  const dir = process.env.LEAD_STORAGE_DIR?.trim();
  if (!dir) return null;
  if (!path.isAbsolute(dir)) throw new Error("LEAD_STORAGE_DIR must be absolute");
  if (dir.includes(`${path.sep}public${path.sep}`)) throw new Error("LEAD_STORAGE_DIR must not be public");
  return dir;
}

async function storeLead(params: {
  locale: string;
  service: string;
  postcode: string;
  description: string;
  contact: string;
  photos: File[];
  attribution: LeadAttribution;
}) {
  const storageDir = configuredStorageDir();
  if (!storageDir) return null;

  const leadId = `lead_${Date.now()}_${randomUUID()}`;
  const leadDir = path.join(storageDir, leadId);
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
          contact: params.contact,
          attribution: compactAttribution(params.attribution),
          photos: savedPhotos,
          storage: "private-filesystem",
        },
        null,
        2,
      ),
      { mode: 0o600 },
    );

    return leadId;
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

  for (const photo of photos) {
    if (!(await hasValidImageSignature(photo))) {
      return NextResponse.json({ ok: false, message: errorMessage }, { status: 400 });
    }
  }

  let leadId: string | null = null;

  try {
    leadId = await storeLead({ locale, service, postcode, description, contact, photos, attribution });
  } catch {
    const message =
      locale === "en"
        ? "Request is valid, but secure storage is not configured correctly yet."
        : "Anfrage ist valide, aber sichere Speicherung ist noch nicht korrekt konfiguriert.";
    return NextResponse.json({ ok: false, message }, { status: 503 });
  }

  const notificationSent = leadId
    ? await notifyTeam({ leadId, locale, service, postcode, description, contact, photoCount: photos.length }).catch(
        () => false,
      )
    : false;

  const message = leadId
    ? locale === "en"
      ? "Request received. We will review it and get back to you."
      : "Anfrage erhalten. Wir prüfen sie und melden uns."
    : locale === "en"
      ? "Request is valid. Storage and notifications are not configured yet."
      : "Anfrage ist valide. Speicherung und Benachrichtigungen sind noch nicht aktiviert.";

  return NextResponse.json({
    ok: true,
    status: leadId ? "stored" : "validated",
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
