import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  /** Optional kicker shown above the title. */
  eyebrow?: string;
  children: ReactNode;
}

/**
 * Consistent layout wrapper for every content section: anchored id (for
 * in-page nav), an accessible <section> with an aria-labelledby heading, and
 * shared spacing.
 */
export default function Section({ id, title, eyebrow, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="mx-auto w-full max-w-5xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24"
    >
      <header className="mb-10">
        {eyebrow ? (
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">{eyebrow}</p>
        ) : null}
        <h2 id={headingId} className="text-3xl font-semibold sm:text-4xl">
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}
