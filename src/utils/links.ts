import { isSafeUrl } from '../config/validate';

/**
 * Props that should be applied to every link pointing at an external origin.
 *
 * `rel="noopener noreferrer"` prevents the opened page from gaining access to
 * `window.opener` (reverse-tabnabbing) and strips the referrer. These are the
 * baseline security attributes for `target="_blank"` links.
 */
export const EXTERNAL_LINK_REL = 'noopener noreferrer';

export interface SafeLinkAttrs {
  href: string;
  target?: '_blank';
  rel?: string;
}

/**
 * Builds anchor attributes for a config-provided URL.
 *
 * - Unsafe schemes (`javascript:`, `data:`, …) are dropped to `#` so a
 *   malformed/poisoned config can never produce a clickable script URL.
 * - http(s) links open in a new tab with hardened `rel`.
 * - `mailto:` links open in place without the new-tab rel.
 */
export function safeLinkAttrs(url: string): SafeLinkAttrs {
  if (!isSafeUrl(url)) {
    return { href: '#' };
  }
  if (url.startsWith('mailto:') || url.startsWith('tel:')) {
    return { href: url };
  }
  return { href: url, target: '_blank', rel: EXTERNAL_LINK_REL };
}
