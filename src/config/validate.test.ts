import { describe, it, expect } from 'vitest';
import { isSafeUrl, validateConfig, ConfigValidationError } from './validate';
import type { PortfolioConfig } from './types';
import { portfolioConfig } from './portfolio.config';

/** Deep-clones the real config so individual tests can mutate it safely. */
function cloneConfig(): PortfolioConfig {
  return structuredClone(portfolioConfig);
}

describe('isSafeUrl', () => {
  it('accepts http, https and mailto URLs', () => {
    expect(isSafeUrl('https://github.com/Nirbhik01')).toBe(true);
    expect(isSafeUrl('http://example.com')).toBe(true);
    expect(isSafeUrl('mailto:a@b.com')).toBe(true);
  });

  it('rejects javascript: and data: and other dangerous schemes', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('data:text/html;base64,PHN2Zz4=')).toBe(false);
    expect(isSafeUrl('vbscript:msgbox(1)')).toBe(false);
    expect(isSafeUrl('file:///etc/passwd')).toBe(false);
  });

  it('rejects malformed input', () => {
    expect(isSafeUrl('not a url')).toBe(false);
    expect(isSafeUrl('')).toBe(false);
  });
});

describe('validateConfig', () => {
  it('accepts the real portfolio config', () => {
    expect(() => validateConfig(portfolioConfig)).not.toThrow();
    expect(validateConfig(portfolioConfig)).toBe(portfolioConfig);
  });

  it('rejects an invalid email', () => {
    const bad = cloneConfig();
    bad.profile.email = 'not-an-email';
    expect(() => validateConfig(bad)).toThrow(ConfigValidationError);
  });

  it('rejects an empty name', () => {
    const bad = cloneConfig();
    bad.profile.name = '   ';
    expect(() => validateConfig(bad)).toThrow(/profile.name/);
  });

  it('rejects a social link with an unsafe scheme', () => {
    const bad = cloneConfig();
    bad.profile.social[0].url = 'javascript:alert(document.cookie)';
    expect(() => validateConfig(bad)).toThrow(/disallowed scheme/);
  });

  it('rejects a project link with an unsafe scheme', () => {
    const bad = cloneConfig();
    bad.projects[0].url = 'data:text/html,<script>1</script>';
    expect(() => validateConfig(bad)).toThrow(/disallowed scheme/);
  });

  it('rejects empty required arrays', () => {
    const bad = cloneConfig();
    bad.projects = [];
    expect(() => validateConfig(bad)).toThrow(/projects/);
  });

  it('rejects experience entries missing highlights', () => {
    const bad = cloneConfig();
    bad.experience[0].highlights = [];
    expect(() => validateConfig(bad)).toThrow(/highlights/);
  });
});
