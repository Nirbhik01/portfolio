import type { Experience as ExperienceItem } from '../config/types';
import Section from './Section';
import Chip from './Chip';

interface ExperienceProps {
  items: ExperienceItem[];
}

export default function Experience({ items }: ExperienceProps) {
  return (
    <Section id="experience" eyebrow="Where I've worked" title="Experience">
      <ol className="relative space-y-8 border-l border-border pl-6">
        {items.map((exp) => (
          <li key={`${exp.company}-${exp.role}`} className="relative">
            <span
              className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-bg"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-xl font-semibold">
                {exp.role} <span className="text-accent">· {exp.company}</span>
              </h3>
              <span className="text-sm text-muted">{exp.period}</span>
            </div>
            {exp.project ? <p className="mt-1 text-sm italic text-muted">{exp.project}</p> : null}
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted">
              {exp.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {exp.stack.map((tech) => (
                <Chip key={tech}>{tech}</Chip>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
