import { lazy, Suspense } from 'react';
import portfolioConfig from './config/portfolio.config';
import { validateConfig } from './config/validate';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Section from './components/Section';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import Preloader from './components/Preloader';
import Reveal from './components/Reveal';
import StageDeck, { type Panel } from './components/StageDeck';

// The 3D scene is heavy (three.js); load it lazily so first paint isn't blocked.
const Scene3D = lazy(() => import('./components/Scene3D'));

// Validate the config once at module load. A malformed/poisoned config throws
// here rather than rendering a broken or unsafe page.
const config = validateConfig(portfolioConfig);

export default function App() {
  const { profile, experience, projects, skills, education, interests } = config;

  // Each panel is one "stop" on the scroll journey. The id doubles as the
  // anchor target the navbar / section tracker jump to.
  const panels: Panel[] = [
    { id: 'top', label: 'Home', content: <Hero profile={profile} /> },
    {
      id: 'about',
      label: 'About',
      content: (
        <Section id="about" eyebrow="About" title="About Me">
          <Reveal>
            <p className="max-w-3xl text-lg leading-relaxed text-muted">{profile.summary}</p>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">
              Currently an Associate Data Engineer at PMSquare Nepal, where I build fault-tolerant
              data-migration pipelines. Outside of work I explore deep learning — from multimodal medical
              retrieval to gradient-based machine unlearning.
            </p>
          </Reveal>
        </Section>
      ),
    },
    { id: 'experience', label: 'Experience', content: <Experience items={experience} /> },
    { id: 'projects', label: 'Projects', content: <Projects items={projects} /> },
    { id: 'skills', label: 'Skills', content: <Skills groups={skills} /> },
    { id: 'education', label: 'Education', content: <Education items={education} interests={interests} /> },
    { id: 'contact', label: 'Contact', content: <Contact profile={profile} /> },
  ];

  return (
    <>
      {/* Intro counter; locks scroll until the journey is ready. */}
      <Preloader />

      {/* Skip link for keyboard / screen-reader users. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>

      {/* Cinematic backdrop that spans the whole scroll journey. */}
      <Suspense fallback={<div className="fixed inset-0 -z-10 bg-bg" aria-hidden="true" />}>
        <Scene3D />
      </Suspense>
      {/* Global readability scrim over the moving scene. */}
      <div className="pointer-events-none fixed inset-0 -z-[5] bg-bg/45" aria-hidden="true" />

      <Navbar profile={profile} />

      <main id="main">
        <StageDeck panels={panels} />
      </main>
    </>
  );
}
