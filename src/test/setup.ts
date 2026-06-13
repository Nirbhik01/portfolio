import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Tear down the DOM between tests to keep them isolated.
afterEach(() => {
  cleanup();
});

// jsdom lacks several browser APIs that @react-three/fiber and framer-style
// components touch. Stub the ones our components rely on so component tests can
// mount without a real WebGL context.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

if (!window.IntersectionObserver) {
  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
    root = null;
    rootMargin = '';
    thresholds = [];
  }
  // @ts-expect-error assigning a test double to the global.
  window.IntersectionObserver = MockIntersectionObserver;
}
