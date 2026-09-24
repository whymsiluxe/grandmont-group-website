import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";

export function ServiceSection({
  title,
  children,
  light,
}: {
  title: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <section
      className={
        light
          ? "bg-(--color-bg-light) py-20 text-(--color-text-on-light) lg:py-28"
          : "bg-(--color-bg-primary) py-20 lg:py-28"
      }
    >
      <Container>
        <FadeIn>
          <h2
            className={
              light
                ? "mb-8 text-2xl font-light lg:text-4xl"
                : "mb-8 text-2xl font-light text-(--color-text-primary) lg:text-4xl"
            }
          >
            {title}
          </h2>
          {children}
        </FadeIn>
      </Container>
    </section>
  );
}

export function BulletList({ items, light }: { items: string[]; light?: boolean }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className={light ? "text-sm text-black/70" : "text-sm text-(--color-text-muted)"}
        >
          — {item}
        </li>
      ))}
    </ul>
  );
}

export function ProseBlock({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={light ? "max-w-2xl text-base text-black/70" : "max-w-2xl text-base text-(--color-text-muted)"}>
      {children}
    </p>
  );
}
