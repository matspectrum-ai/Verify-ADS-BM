# Verify ADS BM

Evidence-driven reconstruction of the authorized VerifyAds target.

The repository follows an Observe -> Inventory -> Specify -> Implement -> Verify -> Diff -> Iterate workflow. The target application's observable behavior is the source of truth; unobserved behavior is never invented.

## Current coverage
- Public homepage/login/signup/legal baseline.
- `/minha-area`: observed empty-company and white-label surfaces with E2E contracts.
- `/minerar`: observed initial/onboarding/running UI with E2E contracts. The real mining network/cache loop is still pending and explicitly not claimed as complete.
- `/minha-conta`, docs, dossier, DNS/landing-page workflows, auth/session and billing remain in active discovery.

## Safety of evidence
Credentials, cookies, authenticated state, screenshots containing account data, cached target bundles and local evidence are ignored and must never be committed.

See `docs/EVIDENCE.md`, `docs/SYSTEM-MAP.md` and `docs/IMPLEMENTATION-PLAN.md` for the verification state.
