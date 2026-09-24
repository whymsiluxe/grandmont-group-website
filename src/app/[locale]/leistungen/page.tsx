import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { isLocale, type Locale } from "@/i18n/config";
import { listGroupedApprovedServices } from "@/lib/cms/content-source";

const COPY: Record<Locale, { title: string; sub: string; cta: string }> = {
  de: {
    title: "Leistungen",
    sub: "Veröffentlichte Leistungen mit bestätigtem Leistungsumfang. Rechtlich offene Arbeiten erscheinen erst nach Freigabe.",
    cta: "Details ansehen",
  },
  en: {
    title: "Services",
    sub: "Published services with confirmed scope. Legally pending work appears only after approval.",
    cta: "View details",
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
      canonical: `/${locale}/leistungen`,
      languages: { de: "/de/leistungen", en: "/en/leistungen", "x-default": "/de/leistungen" },
    },
  };
}

export default async function LeistungenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = COPY[locale];
  const groups = await listGroupedApprovedServices();

  return (
    <main className="bg-(--color-bg-primary)">
      <section className="py-28 lg:py-40">
        <Container>
          <FadeIn>
            <p className="mb-6 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
              Grandmont Group — Chemnitz
            </p>
            <h1 className="max-w-4xl text-5xl font-light leading-[1.02] text-(--color-text-primary) lg:text-8xl">
              {copy.title}
            </h1>
            <p className="mt-8 max-w-2xl text-base text-(--color-text-muted) lg:text-lg">{copy.sub}</p>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-(--color-bg-light) py-20 text-(--color-text-on-light) lg:py-28">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            {groups.map((group, groupIndex) => (
              <FadeIn key={group.id} delay={groupIndex * 0.08}>
                <div id={group.id} className="scroll-mt-24 border-t border-black/15 pt-8">
                  <h2 className="text-3xl font-light">{group.label[locale]}</h2>
                  <p className="mt-3 max-w-md text-sm text-black/60">{group.description[locale]}</p>
                  <div className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-black/10">
                    {group.services.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/${locale}/leistungen/${service.slug}`}
                        className="group bg-(--color-bg-light) p-6 transition-colors hover:bg-white"
                      >
                        <span className="block text-xl font-light">{service.title[locale]}</span>
                        <span className="mt-3 block max-w-xl text-sm text-black/60">{service.statement[locale]}</span>
                        <span className="mt-5 inline-flex text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
                          {copy.cta}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
