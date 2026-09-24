import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { isLocale, type Locale } from "@/i18n/config";

const COPY: Record<
  Locale,
  {
    title: string;
    sub: string;
    sections: { title: string; body: string }[];
    note: string;
    cta: string;
  }
> = {
  de: {
    title: "Ratgeber",
    sub: "Praktische Hinweise für Montage, Umzug, Räumung und Reinigung. Inhalte werden fachlich geprüft, bevor sie veröffentlicht werden.",
    sections: [
      { title: "Anfrage vorbereiten", body: "Welche Fotos, Maße und Informationen helfen, schneller ein gutes Angebot zu erstellen." },
      { title: "Montage planen", body: "Zugang, Etage, Verpackung, Wandbeschaffenheit und Terminfenster richtig vorbereiten." },
      { title: "Objekt übergeben", body: "Checklisten für Räumung, Reinigung und saubere Übergabe an Vermieter oder Verwaltung." },
    ],
    note: "Artikel folgen nach Content-Freigabe und SEO-Priorisierung. Keine automatisch erzeugten Ratgebertexte.",
    cta: "Frage stellen",
  },
  en: {
    title: "Guides",
    sub: "Practical guidance for assembly, moving, clearance and cleaning. Content is reviewed before publication.",
    sections: [
      { title: "Prepare a request", body: "Which photos, measurements and details help create a better quote faster." },
      { title: "Plan assembly", body: "Access, floor level, packaging, wall condition and time windows prepared properly." },
      { title: "Handover a property", body: "Checklists for clearance, cleaning and tidy handover to landlords or property managers." },
    ],
    note: "Articles follow after content approval and SEO prioritization. No automatically generated guide text.",
    cta: "Ask a question",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: COPY[locale].title,
    description: COPY[locale].sub,
    alternates: {
      canonical: `/${locale}/ratgeber`,
      languages: { de: "/de/ratgeber", en: "/en/ratgeber", "x-default": "/de/ratgeber" },
    },
  };
}

export default async function RatgeberPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = COPY[locale];

  return (
    <main>
      <section className="bg-(--color-bg-primary) py-28 lg:py-40">
        <Container>
          <FadeIn>
            <p className="mb-6 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
              Grandmont Group — Wissen
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
          <div className="grid gap-px overflow-hidden rounded-2xl bg-black/10 lg:grid-cols-3">
            {copy.sections.map((section, index) => (
              <FadeIn key={section.title} delay={index * 0.08} className="bg-(--color-bg-light) p-8">
                <p className="mb-6 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mb-4 text-2xl font-light">{section.title}</h2>
                <p className="text-sm text-black/60">{section.body}</p>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2}>
            <div className="mt-12 border-t border-black/15 pt-8">
              <p className="max-w-2xl text-sm text-black/60">{copy.note}</p>
              <Link
                href={`/${locale}/kontakt`}
                className="mt-8 inline-flex rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary)"
              >
                {copy.cta}
              </Link>
            </div>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}
