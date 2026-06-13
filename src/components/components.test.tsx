import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Projects from './Projects';
import Skills from './Skills';
import Experience from './Experience';
import Education from './Education';
import Contact from './Contact';
import { portfolioConfig } from '../config/portfolio.config';

const { projects, skills, experience, education, interests, profile } = portfolioConfig;

describe('Projects', () => {
  it('renders every project name and stack from config', () => {
    render(<Projects items={projects} />);
    for (const p of projects) {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    }
    // A representative tech chip appears.
    expect(screen.getAllByText('PyTorch').length).toBeGreaterThan(0);
  });

  it('flags ongoing projects with a badge', () => {
    render(<Projects items={projects} />);
    expect(screen.getAllByText('Ongoing').length).toBe(projects.filter((p) => p.ongoing).length);
  });
});

describe('Skills', () => {
  it('renders each category and its items', () => {
    render(<Skills groups={skills} />);
    for (const group of skills) {
      expect(screen.getByText(group.category)).toBeInTheDocument();
    }
  });
});

describe('Experience', () => {
  it('renders role, company and highlights', () => {
    render(<Experience items={experience} />);
    const first = experience[0];
    expect(screen.getByText(new RegExp(first.role))).toBeInTheDocument();
    expect(screen.getByText(first.highlights[0])).toBeInTheDocument();
  });
});

describe('Education', () => {
  it('renders degrees and interests', () => {
    render(<Education items={education} interests={interests} />);
    expect(screen.getByText(education[0].degree)).toBeInTheDocument();
    expect(screen.getByText(interests[0])).toBeInTheDocument();
  });
});

describe('Contact — link security', () => {
  it('renders external social links with hardened rel and no unsafe hrefs', () => {
    render(<Contact profile={profile} />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);

    for (const link of links) {
      const href = link.getAttribute('href') ?? '';
      // No dangerous schemes ever reach the DOM.
      expect(href.startsWith('javascript:')).toBe(false);
      expect(href.startsWith('data:')).toBe(false);

      // Any link that opens a new tab must be hardened against tabnabbing.
      if (link.getAttribute('target') === '_blank') {
        const rel = link.getAttribute('rel') ?? '';
        expect(rel).toContain('noopener');
        expect(rel).toContain('noreferrer');
      }
    }
  });

  it('exposes the email as a mailto link', () => {
    render(<Contact profile={profile} />);
    const mailto = screen
      .getAllByRole('link')
      .find((l) => l.getAttribute('href')?.startsWith('mailto:'));
    expect(mailto).toBeDefined();
    expect(mailto?.getAttribute('href')).toBe(`mailto:${profile.email}`);
  });

  it('gives every icon-only social link an accessible name', () => {
    render(<Contact profile={profile} />);
    for (const social of profile.social) {
      const link = within(document.body).getByLabelText(social.label);
      expect(link).toBeInTheDocument();
    }
  });
});
