import type { PortfolioConfig, SocialLink } from './types';

/**
 * Runtime validation for the portfolio config.
 *
 * This is both a correctness check (so a malformed config fails fast and
 * loudly rather than rendering a broken page) and a security control: only
 * http(s)/mailto URLs are permitted, blocking `javascript:`/`data:` URI
 * injection through link fields.
 */

export class ConfigValidationError extends Error {
  constructor(message: string) {
    super(`Invalid portfolio config: ${message}`);
    this.name = 'ConfigValidationError';
  }
}

const ALLOWED_URL_SCHEMES = new Set(['http:', 'https:', 'mailto:']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns true only for http(s) and mailto URLs; everything else is unsafe. */
export function isSafeUrl(url: string): boolean {
  try {
    // mailto: has no host, so parse defensively.
    const parsed = new URL(url);
    return ALLOWED_URL_SCHEMES.has(parsed.protocol);
  } catch {
    return false;
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new ConfigValidationError(message);
}

function nonEmptyString(value: unknown, field: string): void {
  assert(typeof value === 'string' && value.trim().length > 0, `${field} must be a non-empty string`);
}

function validateSocial(link: SocialLink, idx: number): void {
  nonEmptyString(link.label, `social[${idx}].label`);
  nonEmptyString(link.url, `social[${idx}].url`);
  assert(isSafeUrl(link.url), `social[${idx}].url uses a disallowed scheme: ${link.url}`);
}

/**
 * Validates a config object, throwing {@link ConfigValidationError} on the
 * first problem found. Returns the config (narrowed) on success.
 */
export function validateConfig(config: PortfolioConfig): PortfolioConfig {
  assert(config && typeof config === 'object', 'config must be an object');

  // Profile
  const { profile } = config;
  assert(profile && typeof profile === 'object', 'profile is required');
  nonEmptyString(profile.name, 'profile.name');
  nonEmptyString(profile.title, 'profile.title');
  nonEmptyString(profile.location, 'profile.location');
  nonEmptyString(profile.summary, 'profile.summary');
  assert(EMAIL_RE.test(profile.email), `profile.email is not a valid email: ${profile.email}`);
  nonEmptyString(profile.phone, 'profile.phone');
  assert(Array.isArray(profile.social) && profile.social.length > 0, 'profile.social must be a non-empty array');
  profile.social.forEach(validateSocial);

  // Experience
  assert(Array.isArray(config.experience), 'experience must be an array');
  config.experience.forEach((exp, i) => {
    nonEmptyString(exp.role, `experience[${i}].role`);
    nonEmptyString(exp.company, `experience[${i}].company`);
    nonEmptyString(exp.period, `experience[${i}].period`);
    assert(Array.isArray(exp.stack) && exp.stack.length > 0, `experience[${i}].stack must be non-empty`);
    assert(
      Array.isArray(exp.highlights) && exp.highlights.length > 0,
      `experience[${i}].highlights must be non-empty`,
    );
  });

  // Projects
  assert(Array.isArray(config.projects) && config.projects.length > 0, 'projects must be a non-empty array');
  config.projects.forEach((p, i) => {
    nonEmptyString(p.name, `projects[${i}].name`);
    nonEmptyString(p.description, `projects[${i}].description`);
    assert(Array.isArray(p.stack) && p.stack.length > 0, `projects[${i}].stack must be non-empty`);
    if (p.url !== undefined) {
      assert(isSafeUrl(p.url), `projects[${i}].url uses a disallowed scheme: ${p.url}`);
    }
  });

  // Skills
  assert(Array.isArray(config.skills) && config.skills.length > 0, 'skills must be a non-empty array');
  config.skills.forEach((s, i) => {
    nonEmptyString(s.category, `skills[${i}].category`);
    assert(Array.isArray(s.items) && s.items.length > 0, `skills[${i}].items must be non-empty`);
  });

  // Education
  assert(Array.isArray(config.education) && config.education.length > 0, 'education must be a non-empty array');
  config.education.forEach((e, i) => {
    nonEmptyString(e.degree, `education[${i}].degree`);
    nonEmptyString(e.institution, `education[${i}].institution`);
    nonEmptyString(e.period, `education[${i}].period`);
  });

  // Interests + footer
  assert(Array.isArray(config.interests) && config.interests.length > 0, 'interests must be a non-empty array');
  nonEmptyString(config.footerNote, 'footerNote');

  return config;
}
