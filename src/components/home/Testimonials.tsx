import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";

const COPY: Record<Locale, { title: string; sub: string; principles: { title: string; body: string }[] }> = {
  de: {
    title: "Erfahrungen unserer Kunden",
    sub: "Dieser Bereich bleibt bewusst ohne erfundene Zitate oder Sterne. Bewertungen und Referenzen werden erst veröffentlicht, wenn sie echt, freigegeben und nachvollziehbar sind.",
    principles: [
      {
        title: "Echte Aufträge",
        body: "Öffentliche Bewertungen entstehen nach abgeschlossenen Arbeiten, nicht als Platzhalter vor dem Start.",
      },
      {
        title: "Keine Vorauswahl",
        body: "Feedback wird intern ernst genommen; eine Bitte um öffentliche Bewertung darf nicht nur an zufriedene Kunden gehen.",
      },
      {
        title: "Freigabe vor Veröffentlichung",
        body: "Fotos, Projektdetails und Namen werden nur mit klarer Zustimmung veröffentlicht.",
      },
    ],
  },
  en: {
    title: "What our clients say",
    sub: "This section intentionally avoids fabricated quotes or star ratings. Reviews and references are published only when they are real, approved and traceable.",
    principles: [
      {
        title: "Real work only",
        body: "Public reviews follow completed jobs, not placeholder content before launch.",
      },
      {
        title: "No preselection",
        body: "Feedback is handled internally; public review requests must not be sent only to happy clients.",
      },
      {
        title: "Approval first",
        body: "Photos, project details and names are published only with clear consent.",
      },
    ],
  },
};

export function Testimonials({ locale }: { locale: Locale }) {
  const copy = COPY[locale];

  return (
    <section className="bg-(--color-bg-light) py-24 text-(--color-text-on-light) lg:py-32">
      <Container>
        <FadeIn>
          <h2 className="mb-3 text-3xl font-light lg:text-5xl">{copy.title}</h2>
          <p className="max-w-md text-sm text-black/60">{copy.sub}</p>
        </FadeIn>

        <div className="mt-12 grid gap-px overflow-hidden rounded-none bg-black/10 md:grid-cols-3">
          {copy.principles.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.05} className="bg-white p-6">
              <h3 className="mb-3 text-sm font-medium">{item.title}</h3>
              <p className="text-sm text-black/60">{item.body}</p>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
