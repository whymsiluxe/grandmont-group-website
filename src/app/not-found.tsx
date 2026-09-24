import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-(--color-bg-primary) py-28">
      <Container>
        <p className="mb-6 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
          404
        </p>
        <h1 className="max-w-3xl text-5xl font-light leading-[1.02] text-(--color-text-primary) lg:text-8xl">
          Seite nicht gefunden
        </h1>
        <p className="mt-8 max-w-xl text-base text-(--color-text-muted)">
          Die gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link
          href="/de"
          className="mt-10 inline-flex rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary)"
        >
          Zur Startseite
        </Link>
      </Container>
    </main>
  );
}
