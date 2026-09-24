import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { isLocale, type Locale } from "@/i18n/config";
import { siteConfig } from "@/lib/seo/site-config";

const COPY: Record<Locale, { title: string; sub: string; pending: string; sections: { title: string; body: string }[] }> = {
  de: {
    title: "Impressum",
    sub: "Pflichtangaben nach deutschem Recht werden vor Veröffentlichung final geprüft und ergänzt.",
    pending: "Entwurf: Diese Seite ist strukturell vorbereitet, aber rechtlich noch nicht final.",
    sections: [
      { title: "Angaben zum Unternehmen", body: `${siteConfig.legalName} — finale Rechtsform, Registerdaten und Anschrift werden vor Launch eingetragen.` },
      { title: "Kontakt", body: "Telefon, E-Mail und vertretungsberechtigte Person werden nach Freigabe ergänzt." },
      { title: "Hinweis", body: "Keine rechtlichen Pflichtangaben veröffentlichen, bevor Notar/IHK/Steuerberater die finalen Daten bestätigt haben." },
    ],
  },
  en: {
    title: "Legal notice",
    sub: "Mandatory German legal information will be reviewed and completed before publication.",
    pending: "Draft: this page is structurally prepared, but not legally final yet.",
    sections: [
      { title: "Company information", body: `${siteConfig.legalName} — final legal form, registry data and address will be added before launch.` },
      { title: "Contact", body: "Phone, email and authorized representative will be added after approval." },
      { title: "Note", body: "Do not publish mandatory legal information before notary/IHK/tax advisor confirms the final data." },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: COPY[locale].title,
    description: COPY[locale].sub,
    alternates: {
      canonical: `/${locale}/impressum`,
      languages: { de: "/de/impressum", en: "/en/impressum", "x-default": "/de/impressum" },
    },
  };
}

export default async function ImpressumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = COPY[locale];

  return (
    <main>
      <section className="bg-(--color-bg-primary) py-28 lg:py-40">
        <Container>
          <FadeIn>
            <p className="mb-6 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
              Grandmont Group
            </p>
            <h1 className="max-w-4xl text-5xl font-light leading-[1.02] text-(--color-text-primary) lg:text-8xl">
              {copy.title}
            </h1>
            <p className="mt-8 max-w-3xl text-base text-(--color-text-muted) lg:text-xl">{copy.sub}</p>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-(--color-bg-light) py-20 text-(--color-text-on-light) lg:py-28">
        <Container>
          <FadeIn>
            <p className="mb-10 rounded-2xl border border-black/10 bg-white p-5 text-sm text-black/60">{copy.pending}</p>
            <div className="grid gap-px overflow-hidden rounded-2xl bg-black/10">
              {copy.sections.map((section) => (
                <div key={section.title} className="bg-(--color-bg-light) p-6">
                  <h2 className="mb-3 text-2xl font-light">{section.title}</h2>
                  <p className="max-w-3xl text-sm text-black/60">{section.body}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}
