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
import Footer from './components/Footer';

// Validate the config once at module load. A malformed/poisoned config throws
// here rather than rendering a broken or unsafe page.
const config = validateConfig(portfolioConfig);

export default function App() {
  const { profile, experience, projects, skills, education, interests, footerNote } = config;
  const year = new Date().getFullYear();

  return (
    <>
      {/* Skip link for keyboard / screen-reader users. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>

      <Navbar profile={profile} />

      <main id="main">
        <Hero profile={profile} />

        <Section id="about" eyebrow="About" title="About Me">
          <p className="max-w-3xl text-lg leading-relaxed text-muted">{profile.summary}</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            Currently an Associate Data Engineer at PMSquare Nepal, where I build fault-tolerant data-migration
            pipelines. Outside of work I explore deep learning — from multimodal medical retrieval to
            gradient-based machine unlearning.
          </p>
        </Section>

        <Experience items={experience} />
        <Projects items={projects} />
        <Skills groups={skills} />
        <Education items={education} interests={interests} />
        <Contact profile={profile} />
      </main>

      <Footer note={footerNote} year={year} />
    </>
  );
}
