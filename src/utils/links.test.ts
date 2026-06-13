import { describe, it, expect } from 'vitest';
import { safeLinkAttrs, EXTERNAL_LINK_REL } from './links';

describe('safeLinkAttrs', () => {
  it('hardens external http(s) links with target and rel', () => {
    const attrs = safeLinkAttrs('https://github.com/Nirbhik01');
    expect(attrs.href).toBe('https://github.com/Nirbhik01');
    expect(attrs.target).toBe('_blank');
    expect(attrs.rel).toBe(EXTERNAL_LINK_REL);
    expect(attrs.rel).toContain('noopener');
    expect(attrs.rel).toContain('noreferrer');
  });

  it('opens mailto links in place without new-tab rel', () => {
    const attrs = safeLinkAttrs('mailto:a@b.com');
    expect(attrs.href).toBe('mailto:a@b.com');
    expect(attrs.target).toBeUndefined();
    expect(attrs.rel).toBeUndefined();
  });

  it('neutralises unsafe schemes to "#"', () => {
    expect(safeLinkAttrs('javascript:alert(1)').href).toBe('#');
    expect(safeLinkAttrs('data:text/html,<script>').href).toBe('#');
    expect(safeLinkAttrs('not a url').href).toBe('#');
  });
});
