/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// The repository name for the GitHub Pages project site. The deployed site is
// served from https://<user>.github.io/<repo>/, so assets must be requested
// with this base path. Overridable via PUBLIC_BASE_PATH for forks/renames.
const BASE_PATH = process.env.PUBLIC_BASE_PATH ?? '/portfolio/';

/**
 * Content-Security-Policy applied to the production build.
 *
 * GitHub Pages cannot set response headers, so the policy is delivered via a
 * <meta http-equiv> tag injected at build time. It is intentionally omitted in
 * dev because Vite's HMR client uses inline scripts that a strict policy blocks.
 *
 * - script-src 'self'        : only our bundled JS (module-preload polyfill is
 *                              disabled below, so there are no inline scripts).
 * - style-src 'unsafe-inline': three.js/react set inline style *attributes* on
 *                              the canvas; this does not permit inline <script>.
 * - worker-src blob:         : allow three.js/drei loaders that spin up workers.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

function cspPlugin(): Plugin {
  return {
    name: 'inject-csp-meta',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<head>',
        `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Use the project base path only for production builds; dev server stays at "/".
  base: command === 'build' ? BASE_PATH : '/',
  plugins: [react(), cspPlugin()],
  build: {
    outDir: 'dist',
    // No source maps in production — avoids shipping original source to clients.
    sourcemap: false,
    // Native modulepreload is widely supported; dropping the polyfill keeps the
    // build free of inline scripts so the strict CSP above needs no hashes.
    modulePreload: { polyfill: false },
    // Fail loudly if a single chunk balloons, keeping bundle size honest.
    chunkSizeWarningLimit: 900,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        '**/*.config.{ts,js}',
        '**/src/test/**',
        '**/src/main.tsx',
        '**/dist/**',
        '**/*.d.ts',
      ],
    },
  },
}));
