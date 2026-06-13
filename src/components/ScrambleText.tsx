import { useContext, useEffect, useRef, useState } from 'react';
import { StageActiveContext } from '../context/stage';
import { useReducedMotion } from '../hooks/useReducedMotion';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________';
const DURATION = 650; // ms for the full decode

interface ScrambleTextProps {
  text: string;
  className?: string;
}

/**
 * "Decoding" headline effect, as seen on hubtown.co.in — characters resolve
 * left-to-right out of random glyphs when the panel becomes active.
 *
 * Always renders the real text initially (and whenever inactive or under
 * reduced-motion), so the accessible/serialised content is never scrambled —
 * the effect is purely a transient flourish on activation.
 */
export default function ScrambleText({ text, className }: ScrambleTextProps) {
  const active = useContext(StageActiveContext);
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const rafRef = useRef(0);

  useEffect(() => {
    // While inactive (or reduced-motion) we render the real text directly — see
    // `shown` below — so there's nothing to animate here.
    if (!active || reduced) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / DURATION);
      const revealed = Math.floor(t * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (i < revealed || text[i] === ' ') {
          out += text[i];
        } else {
          // Time-seeded glyph (no Math.random) so frames stay deterministic.
          out += GLYPHS[Math.floor(ts / 30 + i * 7) % GLYPHS.length];
        }
      }
      setDisplay(out);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(text);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, reduced, text]);

  // The real text is the source of truth whenever the decode isn't running, so
  // the accessible/serialised content is never left scrambled.
  const shown = active && !reduced ? display : text;
  return <span className={className}>{shown}</span>;
}
