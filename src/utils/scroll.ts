/**
 * Returns how far down the page the user has scrolled, as a value in [0, 1].
 *
 * This is the single "scrubber" that drives the whole experience: the 3D
 * camera flythrough (see Scene3D), the navbar progress bar, and any other
 * scroll-linked motion all read from the same computation so they stay in sync.
 */
export function getScrollProgress(): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 0;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  const y = window.scrollY || doc.scrollTop || 0;
  return Math.min(1, Math.max(0, y / max));
}
