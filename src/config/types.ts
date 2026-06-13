/**
 * Type definitions for the portfolio configuration.
 *
 * The entire site renders dynamically from a single config object that
 * conforms to {@link PortfolioConfig}. Keeping the shape strongly typed lets
 * components stay data-driven and lets the test-suite assert config integrity.
 */

export interface SocialLink {
  /** Human-readable label, e.g. "GitHub". */
  label: string;
  /** Absolute URL. Must be http(s) — enforced at validation time. */
  url: string;
  /** Lucide-style icon key used by the UI. */
  icon: 'github' | 'mail' | 'phone' | 'linkedin' | 'globe';
}

export interface Profile {
  name: string;
  /** Short role/title shown under the name. */
  title: string;
  location: string;
  /** One-to-three sentence summary used in the hero + meta description. */
  summary: string;
  email: string;
  phone: string;
  social: SocialLink[];
}

export interface Experience {
  role: string;
  company: string;
  /** Display string, e.g. "June 2025 – September 2025". */
  period: string;
  /** Optional project/product the role centred on. */
  project?: string;
  /** Tech used, rendered as chips. */
  stack: string[];
  /** Bullet-point achievements. */
  highlights: string[];
}

export interface Project {
  name: string;
  /** Optional tagline shown next to the name. */
  tagline?: string;
  description: string;
  stack: string[];
  /** Optional repo/demo link. */
  url?: string;
  /** Marks work that is still in progress. */
  ongoing?: boolean;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  /** Optional GPA / grade detail. */
  detail?: string;
}

export interface PortfolioConfig {
  profile: Profile;
  experience: Experience[];
  projects: Project[];
  skills: SkillGroup[];
  education: Education[];
  interests: string[];
  /** Footer note / copyright owner. */
  footerNote: string;
}
