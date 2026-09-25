import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { Process } from "@/components/home/Process";
import { isLocale, type Locale } from "@/i18n/config";
import { listGroupedApprovedServices } from "@/lib/cms/content-source";

const COPY: Record<
  Locale,
  {
    title: string;
    sub: string;
    principles: string;
    items: { title: string; body: string }[];
    tasksTitle: string;
    tasksSub: string;
    cta: string;
  }
> = {
  de: {
    title: "Über uns",
    sub: "Grandmont Group ist ein lokaler Dienstleister für Montage, Objektservice und praktische Unterstützung rund um Wohnung, Objekt und Übergabe in Chemnitz.",
    principles: "Unsere Prinzipien",
    items: [
      { title: "Klare Absprachen", body: "Jeder Auftrag beginnt mit einem verständlichen Umfang, passenden Fotos oder einer kurzen Einschätzung." },
      { title: "Saubere Ausführung", body: "Wir arbeiten strukturiert, schützen Oberflächen und übergeben den Arbeitsbereich ordentlich." },
      { title: "Lokale Verlässlichkeit", body: "Fokus auf Chemnitz und Umgebung, kurze Wege und nachvollziehbare Kommunikation." },
    ],
    tasksTitle: "Was wir übernehmen",
    tasksSub: "Zwei Leistungsbereiche, klar begrenzt und rechtlich geprüft.",
    cta: "Projekt anfragen",
  },
  en: {
    title: "About us",
    sub: "Grandmont Group is a local provider for assembly, property services and practical support around apartments, properties and handovers in Chemnitz.",
    principles: "Our principles",
    items: [
      { title: "Clear agreements", body: "Every job starts with an understandable scope, suitable photos or a short assessment." },
      { title: "Clean execution", body: "We work in a structured way, protect surfaces and hand over the work area neatly." },
      { title: "Local reliability", body: "Focused on Chemnitz and the surrounding area, short routes and transparent communication." },
    ],
    tasksTitle: "What we take on",
    tasksSub: "Two service areas, clearly scoped and legally reviewed.",
    cta: "Request a project",
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
      canonical: `/${locale}/ueber-uns`,
      languages: { de: "/de/ueber-uns", en: "/en/ueber-uns", "x-default": "/de/ueber-uns" },
    },
  };
}

export default async function UeberUnsPage({ params }: { params: Promise<{ locale: string }> }) {
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
              Grandmont Group — Chemnitz
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
            <h2 className="mb-12 text-3xl font-light lg:text-5xl">{copy.principles}</h2>
          </FadeIn>
          <div className="grid gap-8 lg:grid-cols-3">
            {copy.items.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.08}>
                <div className="border-t border-black/15 pt-6">
                  <p className="mb-4 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mb-3 text-xl font-light">{item.title}</h3>
                  <p className="text-sm text-black/60">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
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

      <Process locale={locale} />

      <section className="bg-(--color-bg-light) py-16 text-(--color-text-on-light)">
        <Container>
          <FadeIn>
            <Link
              href={`/${locale}/kontakt`}
              className="inline-flex rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary) transition-transform hover:scale-[1.03]"
            >
              {copy.cta}
            </Link>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}
