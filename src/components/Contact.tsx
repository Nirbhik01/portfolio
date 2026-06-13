import type { Profile } from '../config/types';
import Section from './Section';
import Icon from './Icon';
import Reveal from './Reveal';
import { safeLinkAttrs } from '../utils/links';

interface ContactProps {
  profile: Profile;
}

export default function Contact({ profile }: ContactProps) {
  const emailAttrs = safeLinkAttrs(`mailto:${profile.email}`);

  return (
    <Section id="contact" eyebrow="Get in touch" title="Let's talk">
      <Reveal className="rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="mx-auto max-w-xl text-muted">
          I'm open to opportunities in data engineering and applied ML/NLP. The fastest way to reach me is by
          email.
        </p>
        <a
          {...emailAttrs}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-medium text-bg transition-transform hover:scale-[1.03]"
        >
          <Icon name="mail" className="h-5 w-5" />
          {profile.email}
        </a>

        <ul className="mt-6 flex items-center justify-center gap-4">
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
      </Reveal>
    </Section>
  );
}
