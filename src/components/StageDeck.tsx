import type { ReactNode } from 'react';
import { StageActiveContext } from '../context/stage';
import { useStageScroll } from '../hooks/useStageScroll';
import { useReducedMotion } from '../hooks/useReducedMotion';

export interface Panel {
  /** Anchor id (also the scroll-track marker the navbar links to). */
  id: string;
  /** Short label shown in the fixed section tracker. */
  label: string;
  content: ReactNode;
}

interface StageDeckProps {
  panels: Panel[];
}

/** One full-viewport panel, crossfaded in/out based on the active index. */
function StagePanel({
  panel,
  active,
  offset,
}: {
  panel: Panel;
  active: boolean;
  offset: number;
}) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center px-5 pt-24 pb-20 transition-all duration-700 ease-out sm:px-8 ${
        active ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      style={{ transform: active ? 'none' : `translateY(${offset > 0 ? 60 : -60}px) scale(0.97)` }}
    >
      {/* Tall panels scroll internally, then chaining hands scroll back to the
          window so the next panel advances — so no overscroll-contain here. */}
      <div className="no-scrollbar max-h-[86dvh] w-full max-w-5xl overflow-y-auto">
        <StageActiveContext.Provider value={active}>{panel.content}</StageActiveContext.Provider>
      </div>
    </div>
  );
}

/** Fixed vertical section tracker (left edge) — mirrors hubtown's list. */
function SectionTracker({ panels, index }: { panels: Panel[]; index: number }) {
  return (
    <nav
      aria-label="Sections"
      className="fixed left-5 top-1/2 z-20 hidden -translate-y-1/2 md:block"
    >
      <ul className="space-y-3.5">
        {panels.map((panel, i) => {
          const current = i === index;
          return (
            <li key={panel.id}>
              <a href={`#${panel.id}`} className="group flex items-center gap-3">
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    current ? 'w-6 bg-accent' : 'w-1.5 bg-border group-hover:bg-muted'
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`text-[0.7rem] uppercase tracking-[0.2em] transition-colors ${
                    current ? 'text-text' : 'text-muted group-hover:text-text'
                  }`}
                >
                  {panel.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Scroll-scrubbed panel deck (the hubtown.co.in interaction model).
 *
 * Instead of the page scrolling, a fixed "stage" stays put and scroll position
 * scrubs which panel is shown — panels crossfade in place while the 3D scene
 * (mounted separately in App) flies forward. A tall, otherwise-empty scroll
 * track behind the stage supplies the scroll range *and* the anchor targets
 * that the navbar / tracker links jump to.
 *
 * Under prefers-reduced-motion this collapses to an ordinary stacked document,
 * so motion-averse users get a calm, conventional scroll.
 */
export default function StageDeck({ panels }: StageDeckProps) {
  const reduced = useReducedMotion();
  const index = useStageScroll(panels.length);

  if (reduced) {
    return (
      <>
        {panels.map((panel) => (
          <div key={panel.id} id={panel.id} className="scroll-mt-24">
            <StageActiveContext.Provider value={true}>{panel.content}</StageActiveContext.Provider>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {/* Scroll track: gives the page its height and the anchor jump targets. */}
      <div aria-hidden="true">
        {panels.map((panel) => (
          <div key={panel.id} id={panel.id} className="h-screen" />
        ))}
      </div>

      {/* Pinned stage holding every panel. */}
      <div className="fixed inset-0 z-[1]">
        {panels.map((panel, i) => (
          <StagePanel key={panel.id} panel={panel} active={i === index} offset={i - index} />
        ))}
      </div>

      <SectionTracker panels={panels} index={index} />
    </>
  );
}
