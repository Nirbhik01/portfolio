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

/** Sticky top navigation with anchor links to each section. */
export default function Navbar({ profile }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
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
        scrolled ? 'border-b border-border bg-bg/80 backdrop-blur' : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8"
      >
        <a href="#top" className="flex items-center gap-2 font-semibold" aria-label={`${profile.name} — home`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-2 text-accent">
            {initials}
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>
        <ul className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:text-text sm:px-3"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

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
