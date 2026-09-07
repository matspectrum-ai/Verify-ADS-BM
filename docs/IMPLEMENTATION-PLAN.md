# Reconstruction Plan

## M0 — Evidence and harness
- [x] Initialize repository rules and evidence ledger.
- [x] Capture public route/DOM/style baseline.
- [x] Obtain safe evidence from an authenticated browser session.
- [x] Discover authenticated top-level navigation and route bundles.
- [ ] Complete authenticated route/state matrix.
- [ ] Complete network-contract capture for every workflow.

## M1 — Public surface
- [x] Implement `/`, `/login`, privacy and terms baselines.
- [x] Implement `/cadastro` baseline.
- [ ] Finish desktop/mobile visual-diff parity gate.
- [ ] Verify public form error/success states.

## M2 — Auth/session
- [ ] Reproduce login success/failure contract.
- [ ] Reproduce session persistence and route guards.
- [ ] Reproduce logout.
- [ ] Add contract + E2E coverage.

## M3 — Authenticated shell
- [x] `/minha-area` captured empty states and navigation surface.
- [x] `/minerar` captured initial, onboarding and running surfaces.
- [ ] `/minha-conta` visual/state capture and implementation.
- [ ] `/dashboard/docs`.
- [ ] Conditional `/admin` surface if accessible to the authorized account.

## M4 — Mining and dossier
- [ ] Replace mining timer scaffold with observed API/cache loop.
- [ ] Reproduce result cards and dossier navigation.
- [ ] Reproduce dossier fields, save-company flow and all error/loading/empty states.

## M5 — Domain / DNS / landing pages
- [ ] Company/domain list state.
- [ ] Add/delete domain contracts.
- [ ] DNS verification pending/success/error states.
- [ ] Save-with-company flow.
- [ ] Landing-page generation and observable output contracts.

## M6 — Billing/account
- [x] Capture public plan catalog.
- [ ] Capture authenticated subscription state variants.
- [ ] Capture payment creation contract without executing an unintended real payment.
- [ ] Capture email/password mutation contracts before implementing them.

## M7 — Parity gate
- [ ] Route coverage matrix has no unexplained gaps.
- [ ] Contract/E2E suite covers success, failure, loading, empty and permission states where applicable.
- [ ] Visual regression passes at matched desktop/mobile viewports.
- [ ] No credentials, cookies, auth state or personal target evidence is present in Git history.
- [ ] No UNKNOWN is represented as implemented target behavior.
