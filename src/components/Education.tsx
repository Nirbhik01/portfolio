import type { Education as EducationItem } from '../config/types';
import Section from './Section';
import Chip from './Chip';
import Reveal from './Reveal';

interface EducationProps {
  items: EducationItem[];
  interests: string[];
}

export default function Education({ items, interests }: EducationProps) {
  return (
    <Section id="education" eyebrow="Background" title="Education & Interests">
      <div className="grid gap-5 md:grid-cols-2">
        <Reveal className="space-y-4">
          {items.map((edu) => (
            <div key={`${edu.degree}-${edu.institution}`} className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold">{edu.degree}</h3>
                <span className="text-sm text-muted">{edu.period}</span>
              </div>
              <p className="mt-1 text-muted">{edu.institution}</p>
              {edu.detail ? <p className="mt-1 text-sm text-muted">{edu.detail}</p> : null}
            </div>
          ))}
        </Reveal>
        <Reveal delay={90}>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="mb-4 text-lg font-semibold">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Chip key={interest}>{interest}</Chip>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
