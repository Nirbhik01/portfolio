import type { Project } from '../config/types';
import Section from './Section';
import Chip from './Chip';
import { safeLinkAttrs } from '../utils/links';

interface ProjectsProps {
  items: Project[];
}

function ProjectCard({ project }: { project: Project }) {
  const linkAttrs = project.url ? safeLinkAttrs(project.url) : null;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/60">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        {project.ongoing ? (
          <span className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
            Ongoing
          </span>
        ) : null}
      </div>
      {project.tagline ? <p className="mb-3 text-sm font-medium text-accent">{project.tagline}</p> : null}
      <p className="flex-1 text-sm leading-relaxed text-muted">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <Chip key={tech}>{tech}</Chip>
        ))}
      </div>
      {linkAttrs ? (
        <a
          {...linkAttrs}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          View project →
        </a>
      ) : null}
    </article>
  );
}

export default function Projects({ items }: ProjectsProps) {
  return (
    <Section id="projects" eyebrow="Selected work" title="Projects">
      <div className="grid gap-5 sm:grid-cols-2">
        {items.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </Section>
  );
}
