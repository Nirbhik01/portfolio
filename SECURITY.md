# Security Policy

## Reporting a vulnerability

If you discover a security issue in this project, please report it privately by
emailing **nirbhikdhakal8@gmail.com** rather than opening a public issue. You
should expect an acknowledgement within a few days.

## Hardening in this project

- Strict Content-Security-Policy injected at build time (no inline scripts).
- Config link URLs are validated against an allow-list of safe schemes
  (`http`, `https`, `mailto`); unsafe schemes are rejected at load time.
- All external links use `rel="noopener noreferrer"`.
- Dependencies are pinned via `package-lock.json` and audited in CI
  (`npm audit --audit-level=high`).
- GitHub Actions workflows use least-privilege permissions.
