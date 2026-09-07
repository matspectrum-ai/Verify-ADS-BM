# Reconstruction Plan

## M0 — Evidence and harness
- [x] Initialize repository.
- [x] Establish evidence ledger.
- [x] Establish system map.
- [x] Establish repository rules.
- [ ] Capture authenticated route tree.
- [ ] Capture target screenshots at desktop/mobile viewports.
- [ ] Capture target network contracts.

## M1 — Public surface
- [ ] Implement `/` semantic baseline.
- [ ] Implement exact visual parity after screenshot capture.
- [ ] Capture/implement `/login`.
- [ ] Capture/implement `/l/privacidade`.
- [ ] Capture/implement `/l/termos`.

## M2 — Auth/session
- [ ] Reproduce login success/failure behavior.
- [ ] Reproduce session persistence/logout/guards.
- [ ] Add contract and E2E tests.

## M3 — Authenticated application
Build route-by-route from the captured navigation tree. No route is marked complete without success, error, loading, empty and permission states where applicable.

## M4 — Domain/DNS workflows
- Domain lifecycle.
- DNS instructions.
- Verification behavior.
- Generated landing pages.
- Relevant API contracts.

## M5 — Billing and account
Capture and reproduce only observed behavior.

## M6 — Parity gate
- Route coverage matrix.
- E2E coverage.
- Contract tests.
- Visual regression at agreed viewports.
- Open unknowns must be zero or explicitly accepted.
