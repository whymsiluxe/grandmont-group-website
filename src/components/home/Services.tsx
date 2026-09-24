import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";

const GROUPS: Record<Locale, { title: string; items: string[] }[]> = {
  de: [
    { title: "Montage", items: ["Küchenmontage", "Möbelmontage", "Demontage", "Reparaturen"] },
    {
      title: "Ausbau & Renovierung",
      items: ["Innenausbau", "Trockenbau", "Renovierung", "Bodenverlegung"],
    },
    { title: "Objektservice", items: ["Umzug", "Entrümpelung", "Reinigung", "Abbrucharbeiten"] },
  ],
  en: [
    { title: "Assembly", items: ["Kitchen assembly", "Furniture assembly", "Disassembly", "Repairs"] },
    {
      title: "Renovation & Fit-Out",
      items: ["Interior fit-out", "Drywall", "Renovation", "Flooring"],
    },
    { title: "Property Services", items: ["Moving", "Clearance", "Cleaning", "Demolition"] },
  ],
};

const HEADING: Record<Locale, string> = {
  de: "Unsere Leistungen",
  en: "Our services",
};

export function Services({ locale }: { locale: Locale }) {
  const groups = GROUPS[locale];

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
            <FadeIn key={group.title} delay={i * 0.1} className="bg-(--color-bg-surface) p-8 lg:p-10">
              <h3 className="mb-6 text-xl text-(--color-text-primary)">{group.title}</h3>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-(--color-text-muted)">
                    {item}
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
