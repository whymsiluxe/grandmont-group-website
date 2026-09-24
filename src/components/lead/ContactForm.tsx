"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { ApprovedService } from "@/lib/services/approved-services";

type FormState = "idle" | "sending" | "success" | "error";

const COPY: Record<
  Locale,
  {
    service: string;
    postcode: string;
    description: string;
    photos: string;
    contact: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    storagePending: string;
    servicePlaceholder: string;
  }
> = {
  de: {
    service: "Leistung",
    postcode: "PLZ / Ort",
    description: "Kurzbeschreibung",
    photos: "Fotos",
    contact: "Telefon oder E-Mail",
    submit: "Anfrage prüfen",
    sending: "Prüfe Anfrage...",
    success: "Anfrage ist technisch valide. Versand/Speicherung wird im nächsten Schritt angeschlossen.",
    error: "Bitte prüfen Sie die Angaben.",
    storagePending: "Hinweis: Lead-Speicherung und Benachrichtigungen sind noch nicht aktiviert.",
    servicePlaceholder: "Leistung auswählen",
  },
  en: {
    service: "Service",
    postcode: "Postcode / city",
    description: "Short description",
    photos: "Photos",
    contact: "Phone or email",
    submit: "Check request",
    sending: "Checking request...",
    success: "Request is technically valid. Sending/storage will be connected next.",
    error: "Please check the details.",
    storagePending: "Note: lead storage and notifications are not active yet.",
    servicePlaceholder: "Select service",
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

  const acceptedServices = useMemo(() => services.map((service) => service.slug), [services]);
  const initialServiceValue = initialService && acceptedServices.includes(initialService) ? initialService : "";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("locale", locale);

    try {
      const response = await fetch("/api/leads", { method: "POST", body: data });
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setState("error");
        setMessage(payload?.message || copy.error);
        return;
      }

      setState("success");
      setMessage(payload?.message || copy.success);
    } catch {
      setState("error");
      setMessage(copy.error);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm lg:p-8">
      <h2 className="mb-8 text-3xl font-light">{locale === "de" ? "Foto-Anfrage" : "Photo request"}</h2>

      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-medium">
          {copy.service}
          <select
            name="service"
            required
            defaultValue={initialServiceValue}
            className="rounded-xl border border-black/15 bg-(--color-bg-light) px-4 py-3 text-base font-normal"
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
            className="rounded-xl border border-black/15 bg-(--color-bg-light) px-4 py-3 text-base font-normal"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          {copy.description}
          <textarea
            name="description"
            required
            minLength={20}
            maxLength={1800}
            className="min-h-36 rounded-xl border border-black/15 bg-(--color-bg-light) px-4 py-3 text-base font-normal"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          {copy.photos}
          <input
            name="photos"
            type="file"
            multiple
            required
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            className="rounded-xl border border-black/15 bg-(--color-bg-light) px-4 py-3 text-base font-normal"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          {copy.contact}
          <input
            name="contact"
            required
            minLength={5}
            className="rounded-xl border border-black/15 bg-(--color-bg-light) px-4 py-3 text-base font-normal"
          />
        </label>

        <input type="hidden" name="acceptedServices" value={acceptedServices.join(",")} />

        <button
          type="submit"
          disabled={state === "sending"}
          className="mt-3 rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary) disabled:opacity-60"
        >
          {state === "sending" ? copy.sending : copy.submit}
        </button>

        <p className="text-xs text-black/50">{copy.storagePending}</p>
        {message ? (
          <p className={state === "error" ? "text-sm text-red-700" : "text-sm text-black/65"} role="status">
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
