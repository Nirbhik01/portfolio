import { describe, it, expect } from 'vitest';
import { portfolioConfig } from './portfolio.config';
import { isSafeUrl } from './validate';

/**
 * Config-integrity tests: assert the data that drives the entire site is
 * present, well-formed, and free of accidental duplication or unsafe links.
 */
describe('portfolioConfig integrity', () => {
  it('has the expected identity', () => {
    expect(portfolioConfig.profile.name).toBe('Nirbhik Dhakal');
    expect(portfolioConfig.profile.email).toBe('nirbhikdhakal8@gmail.com');
    expect(portfolioConfig.profile.location).toContain('Nepal');
  });

  it('exposes a GitHub link to the correct account', () => {
    const gh = portfolioConfig.profile.social.find((s) => s.icon === 'github');
    expect(gh).toBeDefined();
    expect(gh?.url).toBe('https://github.com/Nirbhik01');
  });

  it('every social and project URL is safe', () => {
    for (const s of portfolioConfig.profile.social) {
      expect(isSafeUrl(s.url), `social ${s.label}`).toBe(true);
    }
    for (const p of portfolioConfig.projects) {
      if (p.url) expect(isSafeUrl(p.url), `project ${p.name}`).toBe(true);
    }
  });

  it('contains every project from the CV', () => {
    const names = portfolioConfig.projects.map((p) => p.name);
    expect(names).toEqual(
      expect.arrayContaining([
        'Machine Unlearning',
        'Multimodal-RAG',
        'Intent-Classification Chatbot',
        'Reportease',
        'Bidbay',
      ]),
    );
  });

  it('has no duplicate project names', () => {
    const names = portfolioConfig.projects.map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('has no duplicate skills within a category', () => {
    for (const group of portfolioConfig.skills) {
      expect(new Set(group.items).size, group.category).toBe(group.items.length);
    }
  });

  it('has a well-formed ongoing flag on every project', () => {
    // `ongoing` is optional; when present it must be a boolean so the UI badge
    // renders predictably. (No project is required to be ongoing.)
    for (const p of portfolioConfig.projects) {
      expect(['undefined', 'boolean'], p.name).toContain(typeof p.ongoing);
    }
  });
});
