import type { Profile } from '../config/types';
import { safeLinkAttrs } from '../utils/links';
import Icon from './Icon';

interface HeroProps {
  profile: Profile;
}

/**
 * Opening panel of the journey. The 3D flythrough lives behind every panel
 * (mounted once in App); the hero just adds a local radial scrim so its text
 * stays crisp where the tunnel is brightest. Its navigational anchor (#top)
 * lives on the scroll-track marker in StageDeck, so this element has no id.
 */
export default function Hero({ profile }: HeroProps) {
  return (
    <section aria-labelledby="hero-heading" className="relative mx-auto max-w-3xl text-center">
      {/* Local readability scrim, just for the hero. */}
      <div className="hero-scrim pointer-events-none absolute -inset-x-16 -inset-y-24 -z-[1]" aria-hidden="true" />

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

      {/* Scroll cue — invites the user to begin the flythrough. */}
      <div className="mt-12 flex flex-col items-center gap-2 text-muted">
        <span className="text-xs uppercase tracking-[0.2em]">Scroll to explore</span>
        <span className="animate-scroll-cue text-lg text-accent" aria-hidden="true">
          ↓
        </span>
      </div>
    </section>
  );
}
