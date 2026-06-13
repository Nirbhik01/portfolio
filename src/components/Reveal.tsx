import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface RevealProps {
  children: ReactNode;
  /** Extra classes merged onto the wrapper (e.g. `h-full` for grid cells). */
  className?: string;
  /** Stagger, in milliseconds, before this element animates in. */
  delay?: number;
}

/**
 * Scroll-triggered entrance wrapper. Children start translated-down and
 * transparent, then settle into place the first time the element scrolls into
 * view (observed once, then disconnected).
 *
 * Honours `prefers-reduced-motion`: motion-averse users — and any environment
 * without IntersectionObserver — get the content shown immediately, with no
 * transform, so nothing is ever hidden behind an animation that won't run.
 */
export default function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Start visible when there's no animation to run, so content is never hidden
  // behind an effect that won't fire (reduced motion, or no IntersectionObserver).
  const [visible, setVisible] = useState(
    () => reducedMotion || typeof IntersectionObserver === 'undefined',
  );

  useEffect(() => {
    if (reducedMotion || typeof IntersectionObserver === 'undefined') return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className={`reveal${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
