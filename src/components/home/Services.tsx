import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { listGroupedApprovedServices } from "@/lib/cms/content-source";

const HEADING: Record<Locale, string> = {
  de: "Unsere Leistungen",
  en: "Our services",
};

export async function Services({ locale }: { locale: Locale }) {
  const groups = await listGroupedApprovedServices();

  return (
    <section className="bg-(--color-bg-primary) py-24 lg:py-32">
      <Container>
        <FadeIn>
          <h2 className="mb-16 text-3xl font-light text-(--color-text-primary) lg:text-5xl">
            {HEADING[locale]}
          </h2>
        </FadeIn>

        <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 lg:grid-cols-3">
          {groups.map((group, i) => (
            <FadeIn key={group.id} delay={i * 0.1} className="bg-(--color-bg-surface) p-8 lg:p-10">
              <h3 className="mb-6 text-xl text-(--color-text-primary)">{group.label[locale]}</h3>
              <ul className="space-y-3">
                {group.services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/${locale}/leistungen/${service.slug}`}
                      className="text-sm text-(--color-text-muted) transition-colors hover:text-(--color-text-primary)"
                    >
                      {service.title[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
