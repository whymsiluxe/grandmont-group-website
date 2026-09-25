import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { isLocale, type Locale } from "@/i18n/config";
import { listGroupedApprovedServices } from "@/lib/cms/content-source";

const COPY: Record<
  Locale,
  {
    title: string;
    sub: string;
    audiencesTitle: string;
    audiences: string[];
    tasksTitle: string;
    tasksSub: string;
    processTitle: string;
    process: string[];
    docsTitle: string;
    docs: string[];
    cta: string;
  }
> = {
  de: {
    title: "Für Unternehmen",
    sub: "Zuverlässige Unterstützung für wiederkehrende Montage-, Objektservice- und Übergabeaufgaben — mit klarer Kommunikation und Rechnung.",
    audiencesTitle: "Für wen",
    audiences: ["Möbelhäuser", "Küchenstudios", "Hausverwaltungen", "Immobilienunternehmen", "Facility Management", "Umzugsunternehmen"],
    tasksTitle: "Welche Aufgaben",
    tasksSub: "Dieselben Leistungen wie für Privatkunden, im wiederkehrenden Geschäftskontext.",
    processTitle: "Wie die Zusammenarbeit funktioniert",
    process: [
      "Anfrage mit Umfang und Zeitraum",
      "Ein fester Ansprechpartner für alle Termine",
      "Planbare, abgestimmte Ausführung",
      "Foto- und Auftragsdokumentation je Einsatz",
    ],
    docsTitle: "Dokumentation & Abrechnung",
    docs: ["Transparente Abrechnung", "Rechnung für jeden Auftrag", "Ein Ansprechpartner"],
    cta: "Zusammenarbeit anfragen",
  },
  en: {
    title: "For businesses",
    sub: "Reliable support for recurring assembly, property service and handover tasks — with clear communication and invoices.",
    audiencesTitle: "Who we work with",
    audiences: ["Furniture stores", "Kitchen studios", "Property managers", "Real estate companies", "Facility management", "Moving companies"],
    tasksTitle: "What we take on",
    tasksSub: "The same services as for private clients, in a recurring business context.",
    processTitle: "How the cooperation works",
    process: [
      "Request with scope and timeframe",
      "One fixed point of contact for every job",
      "Predictable, coordinated execution",
      "Photo and job documentation for each visit",
    ],
    docsTitle: "Documentation & billing",
    docs: ["Transparent billing", "Invoice for every job", "One point of contact"],
    cta: "Request cooperation",
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
      canonical: `/${locale}/unternehmen`,
      languages: { de: "/de/unternehmen", en: "/en/unternehmen", "x-default": "/de/unternehmen" },
    },
  };
}

export default async function UnternehmenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = COPY[locale];
  const groups = await listGroupedApprovedServices();

  return (
    <main>
      <section className="bg-(--color-bg-primary) py-28 lg:py-40">
        <Container>
          <FadeIn>
            <p className="mb-6 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
              B2B — Grandmont Group
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
            <h2 className="mb-8 text-3xl font-light">{copy.audiencesTitle}</h2>
            <ul className="grid gap-px overflow-hidden rounded-lg bg-black/10 sm:grid-cols-2 lg:grid-cols-3">
              {copy.audiences.map((item) => (
                <li key={item} className="bg-white px-6 py-4 text-sm text-black/70">
                  {item}
                </li>
              ))}
            </ul>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-(--color-bg-primary) py-20 lg:py-28">
        <Container>
          <FadeIn>
            <h2 className="mb-4 text-3xl font-light text-(--color-text-primary)">{copy.tasksTitle}</h2>
            <p className="mb-10 max-w-xl text-sm text-(--color-text-muted)">{copy.tasksSub}</p>
            <div className="grid gap-8 sm:grid-cols-2">
              {groups.map((group) => (
                <div key={group.id} className="border-t border-white/15 pt-5">
                  <h3 className="text-lg font-medium text-(--color-text-primary)">{group.label[locale]}</h3>
                  <p className="mt-2 text-sm leading-6 text-(--color-text-muted)">
                    {group.services.map((service) => service.title[locale]).join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-(--color-bg-light) py-20 text-(--color-text-on-light) lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <FadeIn>
              <h2 className="mb-8 text-3xl font-light">{copy.processTitle}</h2>
              <ol className="grid gap-3">
                {copy.process.map((item, i) => (
                  <li key={item} className="flex gap-4 border-t border-black/10 py-3 text-sm text-black/65">
                    <span className="text-xs font-medium text-(--color-accent)">{String(i + 1).padStart(2, "0")}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mb-8 text-3xl font-light">{copy.docsTitle}</h2>
              <ul className="grid gap-3">
                {copy.docs.map((item) => (
                  <li key={item} className="border-t border-black/10 py-3 text-sm text-black/65">
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/kontakt`}
                className="mt-10 inline-flex rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary) transition-transform hover:scale-[1.03]"
              >
                {copy.cta}
              </Link>
            </FadeIn>
          </div>
        </Container>
      </section>
    </main>
  );
}
