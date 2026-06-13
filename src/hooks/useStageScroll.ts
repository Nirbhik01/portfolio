import { useEffect, useState } from 'react';
import { getScrollProgress } from '../utils/scroll';

/**
 * Maps the page's scroll position onto a discrete "active panel" index for a
 * deck of `count` full-screen panels.
 *
 * The page provides a tall (count × 100vh) scroll track; scrolling through it
 * scrubs the index from 0 → count-1. State only updates when the rounded index
 * actually changes, so this drives at most one re-render per panel transition.
 */
export function useStageScroll(count: number): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (count <= 1) return;
    let raf = 0;
    const update = () => {
      const pos = getScrollProgress() * (count - 1);
      setIndex((prev) => {
        const next = Math.round(pos);
        return next === prev ? prev : next;
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [count]);

  return index;
}
