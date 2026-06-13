import type { SkillGroup } from '../config/types';
import Section from './Section';
import Chip from './Chip';
import Reveal from './Reveal';

interface SkillsProps {
  groups: SkillGroup[];
}

export default function Skills({ groups }: SkillsProps) {
  return (
    <Section id="skills" eyebrow="What I work with" title="Technical Skills">
      <div className="grid gap-5 sm:grid-cols-2">
        {groups.map((group, i) => (
          <Reveal key={group.category} className="h-full" delay={(i % 2) * 90}>
            <div className="h-full rounded-2xl border border-border bg-surface p-6">
              <h3 className="mb-4 text-base font-semibold text-text">{group.category}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
