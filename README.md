# Nirbhik Dhakal — Portfolio

An interactive 3D portfolio website. The entire site renders dynamically from a
single typed configuration file, so updating content never requires touching a
component.

[![CI](https://github.com/Nirbhik01/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Nirbhik01/portfolio/actions/workflows/ci.yml)

## Tech stack

| Concern        | Choice                                            |
| -------------- | ------------------------------------------------- |
| Framework      | React 19 + TypeScript                             |
| Build tool     | Vite 8                                            |
| 3D / graphics  | three.js via `@react-three/fiber` + `@react-three/drei` |
| Styling        | Tailwind CSS v4                                    |
| Testing        | Vitest + Testing Library (jsdom)                  |
| CI / Deploy    | GitHub Actions → GitHub Pages                     |

## Architecture

```
src/
├── config/
│   ├── types.ts              # Config type definitions (single source of shape)
│   ├── portfolio.config.ts   # ← edit this to change all site content
│   └── validate.ts           # Runtime validation + URL-safety guard
├── components/               # Presentational, data-driven components
│   └── Scene3D.tsx           # Interactive 3D hero backdrop (lazy-loaded)
├── hooks/
│   └── useReducedMotion.ts   # Honours prefers-reduced-motion
├── utils/
│   └── links.ts              # Hardened external-link attributes
└── App.tsx                   # Composition root (validates config on load)
```

**Data-driven rendering.** Every section maps over `portfolioConfig`. To update
your experience, projects, skills, etc., edit
[`src/config/portfolio.config.ts`](src/config/portfolio.config.ts) only.

## Security

This is a static site, but it ships several hardening measures:

- **Content-Security-Policy** injected at build time (`script-src 'self'`, no
  inline scripts — the module-preload polyfill is disabled to keep it strict).
- **URL-scheme allow-list** — `validate.ts` rejects any config link that isn't
  `http(s)`/`mailto`, blocking `javascript:`/`data:` injection. The app refuses
  to render an invalid config.
- **Tabnabbing protection** — every external link uses
  `rel="noopener noreferrer"`.
- **No source maps** in production; **`npm audit`** runs in CI.
- **Least-privilege** GitHub Actions tokens.

These invariants are covered by the test suite (see `*.test.ts`).

## Local development

```bash
npm install      # install dependencies
npm run dev      # start dev server (http://localhost:5173)
npm test         # run the test suite
npm run lint     # lint
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs the tests,
builds the site, and publishes `dist/` to GitHub Pages. The site is served from
a project sub-path (`/portfolio/`); override via the `PUBLIC_BASE_PATH`
environment variable if you rename the repo.

> **One-time setup:** in the repository, go to **Settings → Pages → Build and
> deployment → Source** and select **GitHub Actions**.

## License

[MIT](LICENSE) © Nirbhik Dhakal
