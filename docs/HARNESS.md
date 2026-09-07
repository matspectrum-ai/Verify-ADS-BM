# Verification Harness

The reconstruction is gated by deterministic checks wherever possible.

## Current checks
- TypeScript typecheck.
- Next.js production build.
- Playwright E2E contract for the observed public homepage.
- Chromium desktop execution in CI.

## Planned checks
- Mobile E2E parity.
- Screenshot baselines against the target at matching viewport/device scale.
- Auth success/failure/session tests.
- API contract fixtures captured from the target.
- DNS verification state-machine tests.

## Completion rule
A reconstructed feature is not complete because it looks plausible. It is complete when its observable behavior is covered by evidence and the corresponding verification passes.
