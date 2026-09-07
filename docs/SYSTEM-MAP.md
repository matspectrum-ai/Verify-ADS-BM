# System Map

Status: authenticated discovery in progress.
Target: `https://score-scanner-7q2s.vercel.app/`.

The target is the behavioral source of truth. `OBSERVED` means verified from the rendered target, its delivered frontend bundles, or read-only network contracts. `IMPLEMENTATION` means replica behavior and is never evidence about target internals.

## Public route inventory

| Route | Evidence | Replica |
| --- | --- | --- |
| `/` | OBSERVED | Implemented; final visual-diff gate pending. |
| `/login` | OBSERVED UI | Implemented UI; auth contract still pending. |
| `/cadastro` | ROUTE OBSERVED | Baseline exists; full parity review pending. |
| `/l/privacidade` | OBSERVED | Implemented. |
| `/l/termos` | OBSERVED | Implemented. |

## Authenticated navigation inventory

| Route | Evidence | Replica |
| --- | --- | --- |
| `/minha-area` | OBSERVED | Empty-company and empty-domain surfaces implemented and E2E-covered. |
| `/minerar` | OBSERVED | Initial/onboarding/running surfaces implemented; real mining loop pending. |
| `/minha-conta` | OBSERVED via delivered bundle; visual capture incomplete | Not promoted until fabricated placeholders are removed and target states are captured. |
| `/dashboard/docs` | OBSERVED navigation target | Pending capture/implementation. |
| `/admin` | OBSERVED conditional route | Pending; rendered only when target auth state reports admin. |

## Authenticated account menu
- `Minerar CNPJs` -> `/minerar`.
- `Minha Área` -> `/minha-area`.
- `Minha Conta` -> `/minha-conta`.
- `Manual / Ajuda` -> `/dashboard/docs`.
- `Admin` -> `/admin` only when `isAdmin` is true.
- `Sair` calls `/api/auth/logout` and returns to `/login`.

## Observed domain/company contracts
- `GET /api/domain/stats`.
- `GET /api/companies/list`.
- `DELETE /api/companies/delete` with `company_id`.
- `GET /api/domain/list`.
- `POST /api/domain/add`.
- `DELETE /api/domain/delete`.
- Domain verification: `/api/domain/verify-dns`.
- Dossier flow additionally references `/api/domain/save-with-company`.

## Observed mining contracts
- `GET /api/cnpj?cnpj=<encoded>`.
- `GET /api/cnpj/check-usage?cnpj=<encoded>`.
- Target count is 20.
- Candidate gate includes active status, trust score >= 65 and configured capital ceiling.
- 404 is treated as a missing candidate; 429/`RATE_LIMIT` triggers rate-limit handling.

## Observed account/billing contracts
- `/minha-conta` references `/api/billing/create-payment`.
- Delivered frontend data exposes active public plans Starter, Professional and Enterprise.
- Payment execution, subscription state transitions and account credential mutations remain unverified and must not be fabricated.

## Discovery queue
1. Reconnect authenticated Firefox evidence harness and capture `/minha-conta` visually and structurally.
2. Capture `/dashboard/docs` and all safe GET-only child navigation.
3. Capture dossier/company-detail route and save/domain onboarding states.
4. Capture auth/session success, failure, persistence, guards and logout behavior.
5. Capture DNS success/pending/error states and landing-page workflow.
6. Replace mining scaffold with the observed API/cache loop and contract tests.
7. Run desktop/mobile visual regression for every route/state before parity is claimed.
