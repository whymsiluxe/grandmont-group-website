import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { isLocale, type Locale } from "@/i18n/config";
import {
  articleQualityGates,
  getArticleService,
  getPublishedArticles,
  plannedArticleTopics,
} from "@/lib/articles/articles";

const COPY: Record<
  Locale,
  {
    title: string;
    sub: string;
    clustersTitle: string;
    published: string;
    planned: string;
    emptyTitle: string;
    emptyBody: string;
    qualityTitle: string;
    note: string;
    cta: string;
  }
> = {
  de: {
    title: "Ratgeber",
    sub: "Praktische Hinweise für Montage, Umzug, Räumung und Reinigung. Inhalte werden fachlich geprüft, bevor sie veröffentlicht werden.",
    clustersTitle: "Geplante SEO-Themen",
    published: "Veröffentlicht",
    planned: "Geplant",
    emptyTitle: "Artikel werden vorbereitet",
    emptyBody: "Der Ratgeber ist technisch bereit. Veröffentlichte Beiträge erscheinen erst, wenn Inhalt, Leistungsgrenzen und SEO-Struktur geprüft sind.",
    qualityTitle: "Redaktionsregeln",
    note: "Artikel folgen nach Content-Freigabe und SEO-Priorisierung. Keine automatisch erzeugten Ratgebertexte.",
    cta: "Frage stellen",
  },
  en: {
    title: "Guides",
    sub: "Practical guidance for assembly, moving, clearance and cleaning. Content is reviewed before publication.",
    clustersTitle: "Planned SEO topics",
    published: "Published",
    planned: "Planned",
    emptyTitle: "Articles are being prepared",
    emptyBody: "The guide section is technically ready. Published posts appear only after content, scope limits and SEO structure are reviewed.",
    qualityTitle: "Editorial rules",
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
  const articles = getPublishedArticles();

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
          <FadeIn>
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <h2 className="text-2xl font-light">{copy.clustersTitle}</h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-black/55">{copy.note}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-3xl font-light text-black">{articles.length}</p>
                  <p className="mt-2 text-xs font-medium tracking-[0.08em] text-black/45 uppercase">
                    {copy.published}
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-3xl font-light text-black">{plannedArticleTopics.length}</p>
                  <p className="mt-2 text-xs font-medium tracking-[0.08em] text-black/45 uppercase">
                    {copy.planned}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          {articles.length > 0 ? (
            <FadeIn delay={0.1}>
              <div className="mt-16 grid gap-6 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} locale={locale} />
                ))}
              </div>
            </FadeIn>
          ) : (
            <FadeIn delay={0.1}>
              <div className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-2xl bg-(--color-bg-primary) p-8 text-(--color-text-primary) lg:p-10">
                  <p className="text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
                    CMS ready
                  </p>
                  <h2 className="mt-6 max-w-md text-4xl font-light">{copy.emptyTitle}</h2>
                  <p className="mt-6 max-w-xl text-sm leading-6 text-(--color-text-muted)">{copy.emptyBody}</p>

                  <div className="mt-10 grid gap-3">
                    {plannedArticleTopics.map((topic) => {
                      const service = getArticleService(topic);
                      return (
                        <article key={topic.id} className="rounded-xl border border-white/10 p-4">
                          <div className="mb-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/50">
                              {service?.title[locale] ?? (locale === "de" ? "Allgemein" : "General")}
                            </span>
                          </div>
                          <h3 className="text-lg font-light text-white">{topic.title[locale]}</h3>
                          <p className="mt-2 text-sm leading-6 text-white/55">{topic.intent[locale]}</p>
                        </article>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-8 lg:p-10">
                  <h2 className="text-3xl font-light text-black">{copy.qualityTitle}</h2>
                  <ul className="mt-6 space-y-3">
                    {articleQualityGates[locale].map((rule) => (
                      <li key={rule} className="flex gap-3 text-sm leading-6 text-black/60">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-(--color-accent)" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${locale}/kontakt`}
                    className="mt-10 inline-flex rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary) transition-transform hover:scale-[1.03]"
                  >
                    {copy.cta}
                  </Link>
                </div>
              </div>
            </FadeIn>
          )}

        </Container>
      </section>
    </main>
  );
}
