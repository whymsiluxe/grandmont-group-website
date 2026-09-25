"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { ApprovedService } from "@/lib/services/approved-services";

type FormState = "idle" | "sending" | "success" | "error";
type LeadResponse = {
  message?: string;
  status?: "stored" | "validated" | "ignored";
  leadId?: string | null;
  notificationSent?: boolean;
};

const ATTRIBUTION_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];

const COPY: Record<
  Locale,
  {
    service: string;
    postcode: string;
    description: string;
    photos: string;
    name: string;
    contact: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    stored: string;
    validated: string;
    leadId: string;
    servicePlaceholder: string;
    privacyNote: string;
    privacyLink: string;
    hints: {
      postcode: string;
      description: string;
      photos: string;
      name: string;
      contact: string;
    };
  }
> = {
  de: {
    service: "Leistung",
    postcode: "PLZ / Ort",
    description: "Kurzbeschreibung",
    photos: "Fotos",
    name: "Name (optional)",
    contact: "Telefon oder E-Mail",
    submit: "Anfrage senden",
    privacyNote: "Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß unserer",
    privacyLink: "Datenschutzerklärung",
    sending: "Anfrage wird gesendet...",
    success: "Anfrage erhalten. Wir prüfen sie und melden uns.",
    error: "Bitte prüfen Sie die Angaben.",
    stored: "Die Anfrage wurde sicher gespeichert.",
    validated: "Die Anfrage wurde geprüft. Speicherung und Benachrichtigung sind in dieser Umgebung noch nicht aktiviert.",
    leadId: "Anfrage-ID",
    servicePlaceholder: "Leistung auswählen",
    hints: {
      postcode: "PLZ oder Ort im Einsatzgebiet, z. B. Chemnitz.",
      description: "Mindestens 20 Zeichen: Was soll gemacht werden, wo, und gibt es Besonderheiten?",
      photos: "1 bis 10 Fotos, je max. 8 MB. JPG, PNG oder WebP (iPhone-Fotos im HEIC-Format bitte vorher als JPEG sichern).",
      name: "Damit wir Sie beim Rückruf richtig ansprechen können.",
      contact: "Telefonnummer oder E-Mail, damit wir Rückfragen stellen können.",
    },
  },
  en: {
    service: "Service",
    postcode: "Postcode / city",
    description: "Short description",
    photos: "Photos",
    name: "Name (optional)",
    contact: "Phone or email",
    submit: "Send request",
    privacyNote: "By submitting, you agree to the processing of your data as described in our",
    privacyLink: "privacy policy",
    sending: "Sending request...",
    success: "Request received. We will review it and get back to you.",
    error: "Please check the details.",
    stored: "The request was stored securely.",
    validated: "The request was checked. Storage and notification are not active in this environment yet.",
    leadId: "Request ID",
    servicePlaceholder: "Select service",
    hints: {
      postcode: "Postcode or city in the service area, e.g. Chemnitz.",
      description: "At least 20 characters: what needs to be done, where, and any special details?",
      photos: "1 to 10 photos, max. 8 MB each. JPG, PNG or WebP (please save iPhone HEIC photos as JPEG first).",
      name: "So we can address you correctly when we call back.",
      contact: "Phone number or email so we can ask follow-up questions.",
    },
  },
};

export function ContactForm({
  locale,
  services,
  initialService,
}: {
  locale: Locale;
  services: ApprovedService[];
  initialService?: string;
}) {
  const copy = COPY[locale];
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<LeadResponse | null>(null);
  // Reused across retries of the same failed attempt (network error → user
  // clicks submit again with the same content) so the server treats it as
  // one lead instead of duplicates; a fresh id is minted for any attempt
  // that doesn't follow an error, i.e. a genuinely new submission.
  const submissionIdRef = useRef(crypto.randomUUID());

  const acceptedServices = useMemo(() => services.map((service) => service.slug), [services]);
  const initialServiceValue = initialService && acceptedServices.includes(initialService) ? initialService : "";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");
    setResult(null);

    if (state !== "error") submissionIdRef.current = crypto.randomUUID();

    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("locale", locale);
    data.set("submissionId", submissionIdRef.current);
    data.set("landingPath", `${window.location.pathname}${window.location.search}`);
    if (document.referrer) data.set("referrer", document.referrer);

    const url = new URL(window.location.href);
    for (const key of ATTRIBUTION_PARAMS) {
      const value = url.searchParams.get(key);
      if (value) data.set(key, value);
    }

    try {
      const response = await fetch("/api/leads", { method: "POST", body: data });
      const payload = (await response.json().catch(() => null)) as LeadResponse | null;

      if (!response.ok) {
        setState("error");
        setMessage(payload?.message || copy.error);
        return;
      }

      setState("success");
      setResult(payload);
      setMessage(payload?.message || copy.success);
    } catch {
      setState("error");
      setMessage(copy.error);
    }
  }

  return (
    <form aria-busy={state === "sending"} onSubmit={submit} className="rounded-lg border border-black/10 bg-white p-6 lg:p-10">
      <h2 className="mb-10 text-3xl font-light">{locale === "de" ? "Foto-Anfrage" : "Photo request"}</h2>

      <fieldset className="grid gap-6" disabled={state === "sending"}>
        <label className="grid gap-2 text-sm font-medium">
          {copy.service}
          <select
            data-event="service_selected"
            data-event-location="lead_form"
            name="service"
            required
            defaultValue={initialServiceValue}
            className="border-b border-black/20 bg-transparent py-3 text-base font-normal focus:border-black/50 focus:outline-none"
          >
            <option value="">{copy.servicePlaceholder}</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.title[locale]}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          {copy.postcode}
          <input
            name="postcode"
            required
            minLength={3}
            maxLength={80}
            autoComplete="postal-code"
            inputMode="text"
            aria-describedby="lead-postcode-hint"
            className="border-b border-black/20 bg-transparent py-3 text-base font-normal focus:border-black/50 focus:outline-none"
          />
          <span id="lead-postcode-hint" className="text-xs font-normal text-black/45">
            {copy.hints.postcode}
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          {copy.description}
          <textarea
            name="description"
            required
            minLength={20}
            maxLength={1800}
            aria-describedby="lead-description-hint"
            className="min-h-32 border-b border-black/20 bg-transparent py-3 text-base font-normal focus:border-black/50 focus:outline-none"
          />
          <span id="lead-description-hint" className="text-xs font-normal text-black/45">
            {copy.hints.description}
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          {copy.photos}
          <input
            data-event="photo_upload"
            data-event-location="lead_form"
            name="photos"
            type="file"
            multiple
            required
            accept="image/jpeg,image/png,image/webp"
            aria-describedby="lead-photos-hint"
            className="border-b border-black/20 bg-transparent py-3 text-base font-normal file:mr-4 file:rounded-lg file:border-0 file:bg-black/5 file:px-4 file:py-2 file:text-sm focus:border-black/50 focus:outline-none"
          />
          <span id="lead-photos-hint" className="text-xs font-normal text-black/45">
            {copy.hints.photos}
          </span>
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            {copy.name}
            <input
              name="name"
              maxLength={160}
              autoComplete="name"
              className="border-b border-black/20 bg-transparent py-3 text-base font-normal focus:border-black/50 focus:outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            {copy.contact}
            <input
              name="contact"
              required
              minLength={5}
              maxLength={160}
              inputMode="text"
              className="border-b border-black/20 bg-transparent py-3 text-base font-normal focus:border-black/50 focus:outline-none"
            />
          </label>
        </div>

        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="sr-only"
        />

        <button
          data-event="lead_submit"
          data-event-location="lead_form"
          type="submit"
          disabled={state === "sending"}
          className="mt-3 rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary) disabled:opacity-60"
        >
          {state === "sending" ? copy.sending : copy.submit}
        </button>

        <p className="mt-3 text-xs text-black/50">
          {copy.privacyNote}{" "}
          <Link href={`/${locale}/datenschutz`} className="underline underline-offset-2 hover:text-black/70">
            {copy.privacyLink}
          </Link>
          .
        </p>

        {state === "success" && result?.status ? (
          <div className="rounded-lg border border-emerald-700/15 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
            <p className="font-medium">{result.status === "stored" ? copy.stored : copy.validated}</p>
            {result.leadId ? (
              <p className="mt-1 text-xs text-emerald-950/70">
                {copy.leadId}: {result.leadId}
              </p>
            ) : null}
          </div>
        ) : null}

        {message ? (
          <p className={state === "error" ? "text-sm text-red-700" : "text-sm text-black/65"} role="status">
            {message}
          </p>
        ) : null}
      </fieldset>
    </form>
  );
}
