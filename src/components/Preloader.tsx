import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/** How long the 0 → 100% intro counter takes, in milliseconds. */
const DURATION = 1500;

/**
 * Full-screen intro overlay that counts 0 → 100% ("Ready to explore"), then
 * fades out and unmounts — mirroring the loading sequence on hubtown.co.in.
 *
 * Scroll is locked while it's visible so the journey always starts at the top.
 * Motion-averse users skip the whole sequence (rendered as `null`).
 */
export default function Preloader() {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef(0);

  // Drive the counter with rAF so it tracks real elapsed time, not frame count.
  useEffect(() => {
    if (reducedMotion) return;
    document.body.style.overflow = 'hidden';

    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const pct = Math.min(100, Math.round((elapsed / DURATION) * 100));
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDone(true);
      }
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.body.style.overflow = '';
    };
  }, [reducedMotion]);

  // Hold briefly at 100%, then release scroll and begin the fade-out.
  useEffect(() => {
    if (!done || reducedMotion) return;
    const t = window.setTimeout(() => {
      document.body.style.overflow = '';
      setHidden(true);
    }, 450);
    return () => window.clearTimeout(t);
  }, [done, reducedMotion]);

  if (reducedMotion || removed) return null;

  return (
    <div
      aria-hidden="true"
      onTransitionEnd={() => {
        if (hidden) setRemoved(true);
      }}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-bg transition-opacity duration-700 ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="w-[min(80vw,420px)]">
        <div className="flex items-end justify-between">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
            {progress < 100 ? 'Loading' : 'Ready to explore'}
          </span>
          <span className="text-5xl font-bold tabular-nums text-gradient sm:text-6xl">{progress}%</span>
        </div>
        <div className="mt-5 h-px w-full overflow-hidden bg-border">
          <div className="h-full bg-accent transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
