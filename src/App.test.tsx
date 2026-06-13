import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// The 3D scene needs a WebGL context that jsdom can't provide. Replace it with
// a lightweight stand-in so we can test the page structure around it.
vi.mock('./components/Scene3D', () => ({
  default: () => <div data-testid="scene-3d-mock" />,
}));

describe('App', () => {
  it('renders exactly one top-level h1 with the name', async () => {
    render(<App />);
    const h1s = await screen.findAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('Nirbhik Dhakal');
  });

  it('exposes the major sections as labelled regions', async () => {
    render(<App />);
    // Section headings (h2) — about/experience/projects/skills/education/contact.
    const h2s = await screen.findAllByRole('heading', { level: 2 });
    const texts = h2s.map((h) => h.textContent);
    expect(texts).toEqual(
      expect.arrayContaining([
        'About Me',
        'Experience',
        'Projects',
        'Technical Skills',
        'Education & Interests',
        "Let's talk",
      ]),
    );
  });

  it('has a main landmark and a skip-to-content link', async () => {
    render(<App />);
    expect(await screen.findByRole('main')).toBeInTheDocument();
    expect(screen.getByText('Skip to content')).toHaveAttribute('href', '#main');
  });

  it('renders a primary navigation landmark', async () => {
    render(<App />);
    expect(await screen.findByRole('navigation', { name: /primary/i })).toBeInTheDocument();
  });

  it('never emits a link with a dangerous scheme', async () => {
    render(<App />);
    await screen.findByRole('main');
    for (const link of screen.getAllByRole('link')) {
      const href = link.getAttribute('href') ?? '';
      expect(href.startsWith('javascript:')).toBe(false);
      expect(href.startsWith('data:')).toBe(false);
    }
  });
});
