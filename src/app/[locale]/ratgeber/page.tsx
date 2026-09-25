import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { isLocale, type Locale } from "@/i18n/config";
import { listPublishedArticles } from "@/lib/cms/content-source";

const COPY: Record<
  Locale,
  {
    title: string;
    sub: string;
    emptyTitle: string;
    emptyBody: string;
    cta: string;
  }
> = {
  de: {
    title: "Ratgeber",
    sub: "Praktische Hinweise für Montage, Umzug, Räumung und Reinigung.",
    emptyTitle: "Ratgeber",
    emptyBody: "Unsere Beiträge werden derzeit vorbereitet.",
    cta: "Frage stellen",
  },
  en: {
    title: "Guides",
    sub: "Practical guidance for assembly, moving, clearance and cleaning.",
    emptyTitle: "Guides",
    emptyBody: "Our articles are currently being prepared.",
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
  const articles = await listPublishedArticles();
  return {
    title: COPY[locale].title,
    description: COPY[locale].sub,
    robots: articles.length > 0 ? { index: true, follow: true } : { index: false, follow: true },
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
  const articles = await listPublishedArticles();

  if (articles.length === 0) {
    return (
      <main className="bg-(--color-bg-primary)">
        <section className="flex min-h-[70vh] items-center py-28">
          <Container>
            <FadeIn>
              <p className="mb-6 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
                Grandmont Group — Wissen
              </p>
              <h1 className="max-w-4xl text-5xl font-light leading-[1.02] text-(--color-text-primary) lg:text-7xl">
                {copy.emptyTitle}
              </h1>
              <p className="mt-8 max-w-xl text-base text-(--color-text-muted) lg:text-lg">{copy.emptyBody}</p>
              <Link
                href={`/${locale}/kontakt`}
                className="mt-10 inline-flex rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary) transition-transform hover:scale-[1.03]"
              >
                {copy.cta}
              </Link>
            </FadeIn>
          </Container>
        </section>
      </main>
    );
  }

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
            <div className="grid gap-6 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} locale={locale} />
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}
