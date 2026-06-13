import { lazy, Suspense } from 'react';
import type { Profile } from '../config/types';
import { safeLinkAttrs } from '../utils/links';
import Icon from './Icon';

// The 3D scene is heavy (three.js); load it lazily so first paint isn't blocked.
const Scene3D = lazy(() => import('./Scene3D'));

interface HeroProps {
  profile: Profile;
}

export default function Hero({ profile }: HeroProps) {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-20 sm:px-8"
    >
      {/* Interactive 3D backdrop. aria-hidden — purely decorative. */}
      <Suspense fallback={<div className="absolute inset-0 -z-10 bg-bg" aria-hidden="true" />}>
        <Scene3D />
      </Suspense>

      {/* Readability scrim over the 3D scene. */}
      <div
        className="pointer-events-none absolute inset-0 -z-[5] bg-gradient-to-b from-bg/20 via-bg/40 to-bg"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center animate-fade-up">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">{profile.location}</p>
        <h1 id="hero-heading" className="text-4xl font-bold leading-tight sm:text-6xl">
          <span className="text-gradient">{profile.name}</span>
        </h1>
        <p className="mt-4 text-lg font-medium text-text sm:text-xl">{profile.title}</p>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted sm:text-lg">{profile.summary}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#projects"
            className="rounded-lg bg-accent px-5 py-2.5 font-medium text-bg transition-transform hover:scale-[1.03]"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-border bg-surface-2 px-5 py-2.5 font-medium text-text transition-colors hover:border-accent"
          >
            Get in Touch
          </a>
        </div>

        <ul className="mt-8 flex items-center justify-center gap-4">
          {profile.social.map((link) => {
            const attrs = safeLinkAttrs(link.url);
            return (
              <li key={link.label}>
                <a
                  {...attrs}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-2 text-muted transition-colors hover:border-accent hover:text-accent"
                  aria-label={link.label}
                >
                  {/* Decorative — the anchor's aria-label provides the name. */}
                  <Icon name={link.icon} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
