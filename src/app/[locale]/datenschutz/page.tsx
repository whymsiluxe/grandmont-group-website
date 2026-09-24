import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { isLocale, type Locale } from "@/i18n/config";

const COPY: Record<Locale, { title: string; sub: string; pending: string; items: { title: string; body: string }[] }> = {
  de: {
    title: "Datenschutz",
    sub: "Die Datenschutzerklärung wird vor Veröffentlichung anhand der tatsächlichen Tools, Formulare und Hosting-Setups finalisiert.",
    pending: "Entwurf: noch keine finale Datenschutzerklärung. Tracking, Formulare, Uploads und CRM-Anbindung müssen vor Launch vollständig geprüft werden.",
    items: [
      { title: "Hosting", body: "VPS/Vercel/Payload-CMS Setup final erfassen und in die Erklärung übernehmen." },
      { title: "Kontaktformular", body: "Lead API, Foto-Upload, Speicherort, Aufbewahrung und Löschung erst nach technischer Umsetzung final beschreiben." },
      { title: "Analytics & Cookies", body: "Nur tatsächlich verwendete Dienste aufführen. Consent-Banner erst nach Tool-Entscheidung finalisieren." },
    ],
  },
  en: {
    title: "Privacy policy",
    sub: "The privacy policy will be finalized before publication based on the actual tools, forms and hosting setup.",
    pending: "Draft: not a final privacy policy. Tracking, forms, uploads and CRM integration must be fully reviewed before launch.",
    items: [
      { title: "Hosting", body: "Record VPS/Vercel/Payload CMS setup and include it in the final policy." },
      { title: "Contact form", body: "Describe Lead API, photo upload, storage, retention and deletion after technical implementation." },
      { title: "Analytics & cookies", body: "List only services actually used. Finalize consent banner after tool decisions." },
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
      canonical: `/${locale}/datenschutz`,
      languages: { de: "/de/datenschutz", en: "/en/datenschutz", "x-default": "/de/datenschutz" },
    },
  };
}

export default async function DatenschutzPage({ params }: { params: Promise<{ locale: string }> }) {
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
              {copy.items.map((item) => (
                <div key={item.title} className="bg-(--color-bg-light) p-6">
                  <h2 className="mb-3 text-2xl font-light">{item.title}</h2>
                  <p className="max-w-3xl text-sm text-black/60">{item.body}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}
