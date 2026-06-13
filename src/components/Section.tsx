import type { ReactNode } from 'react';
import Reveal from './Reveal';
import ScrambleText from './ScrambleText';

interface SectionProps {
  id: string;
  title: string;
  /** Optional kicker shown above the title. */
  eyebrow?: string;
  /** Extra classes merged onto the section wrapper. */
  className?: string;
  children: ReactNode;
}

/**
 * Consistent layout wrapper for every content section: an accessible
 * <section> labelled by its heading, shared spacing, and a heading that
 * "decodes" into view when its panel becomes active.
 *
 * The navigational anchor id lives on the scroll-track marker (see StageDeck),
 * not here, so this element intentionally has no `id` of its own.
 */
export default function Section({ id, title, eyebrow, children, className }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section aria-labelledby={headingId} className={`mx-auto w-full max-w-5xl px-1 sm:px-2 ${className || ''}`}>
      <Reveal>
        <header className="mb-8">
          {eyebrow ? (
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">{eyebrow}</p>
          ) : null}
          <h2 id={headingId} className="text-3xl font-semibold sm:text-4xl">
            <ScrambleText text={title} />
          </h2>
        </header>
      </Reveal>
      {children}
    </section>
  );
}
