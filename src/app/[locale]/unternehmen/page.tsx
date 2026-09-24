import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { isLocale, type Locale } from "@/i18n/config";

const COPY: Record<
  Locale,
  { title: string; sub: string; audiencesTitle: string; audiences: string[]; promiseTitle: string; promises: string[]; cta: string }
> = {
  de: {
    title: "Für Unternehmen",
    sub: "Zuverlässige Unterstützung für wiederkehrende Montage-, Objektservice- und Übergabeaufgaben — mit klarer Kommunikation und Rechnung.",
    audiencesTitle: "Für wen",
    audiences: ["Möbelhäuser", "Küchenstudios", "Hausverwaltungen", "Immobilienunternehmen", "Facility Management", "Umzugsunternehmen"],
    promiseTitle: "Zusammenarbeit",
    promises: ["Ein Ansprechpartner", "Planbare Termine", "Foto- und Auftragsdokumentation", "Transparente Abrechnung"],
    cta: "Zusammenarbeit anfragen",
  },
  en: {
    title: "For businesses",
    sub: "Reliable support for recurring assembly, property service and handover tasks — with clear communication and invoices.",
    audiencesTitle: "Who we work with",
    audiences: ["Furniture stores", "Kitchen studios", "Property managers", "Real estate companies", "Facility management", "Moving companies"],
    promiseTitle: "Cooperation",
    promises: ["One point of contact", "Predictable appointments", "Photo and job documentation", "Transparent billing"],
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
          <div className="grid gap-12 lg:grid-cols-2">
            <FadeIn>
              <h2 className="mb-8 text-3xl font-light">{copy.audiencesTitle}</h2>
              <ul className="grid gap-3">
                {copy.audiences.map((item) => (
                  <li key={item} className="border-t border-black/10 py-3 text-sm text-black/65">
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mb-8 text-3xl font-light">{copy.promiseTitle}</h2>
              <ul className="grid gap-3">
                {copy.promises.map((item) => (
                  <li key={item} className="border-t border-black/10 py-3 text-sm text-black/65">
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/kontakt`}
                className="mt-10 inline-flex rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary)"
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
