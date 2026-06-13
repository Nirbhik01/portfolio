import { useEffect, useRef, useState } from 'react';
import type { Profile } from '../config/types';
import { getScrollProgress } from '../utils/scroll';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

interface NavbarProps {
  profile: Profile;
}

/**
 * Fixed top navigation. Inline anchor links on md+ screens; on smaller screens
 * the links collapse into a toggleable dropdown menu so they never overflow.
 */
export default function Navbar({ profile }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Drive the progress bar straight to the DOM — no re-render per frame.
        if (barRef.current) barRef.current.style.transform = `scaleX(${getScrollProgress()})`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Initials for the brand mark.
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  return (
    <header
      className={`fixed inset-x-0 top-0 z-20 transition-colors ${
        scrolled || menuOpen ? 'border-b border-border bg-bg/80 backdrop-blur' : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8"
      >
        <a
          href="#top"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 font-semibold"
          aria-label={`${profile.name} — home`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-2 text-accent">
            {initials}
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>

        {/* Inline links on md+ screens. */}
        <ul className="hidden items-center gap-1 md:flex lg:gap-2">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:text-text lg:px-3"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger toggle on small screens. */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-2 text-text transition-colors hover:border-accent md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Collapsible mobile menu. */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-border bg-bg/95 backdrop-blur transition-[max-height] duration-300 md:hidden ${
          menuOpen ? 'max-h-80 border-b' : 'max-h-0'
        }`}
      >
        <ul className="mx-auto flex max-w-5xl flex-col gap-1 px-5 pb-4 pt-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2.5 text-base text-muted transition-colors hover:bg-surface-2 hover:text-text"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Scroll-progress bar pinned to the bottom edge of the header. */}
      <div
        ref={barRef}
        className="h-0.5 origin-left bg-gradient-to-r from-accent to-accent-2"
        style={{ transform: 'scaleX(0)' }}
        aria-hidden="true"
      />
    </header>
  );
}
