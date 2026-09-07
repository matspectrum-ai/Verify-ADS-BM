# System Map

Status: authenticated discovery in progress.
Target: `https://score-scanner-7q2s.vercel.app/`

## Public route inventory

| Route | Evidence status | Current replica status |
| --- | --- | --- |
| `/` | OBSERVED | Implemented from captured DOM/style evidence; visual diff still pending. |
| `/login` | OBSERVED UI | Implemented UI; real auth behavior intentionally not fabricated. |
| `/cadastro` | OBSERVED | Baseline implementation present. |
| `/l/privacidade` | OBSERVED | Implemented from captured content/layout. |
| `/l/termos` | OBSERVED | Implemented from captured content/layout. |

## Authenticated route inventory

| Route | Evidence status | Replica status |
| --- | --- | --- |
| `/minha-area` | OBSERVED AUTHENTICATED | Empty-company/White Label dashboard reconstructed and covered by E2E. |
| `/minerar` | BUNDLE + AUTHENTICATED EVIDENCE | Local reconstruction exists; integration to GitHub pending device reconnection. |
| `/minha-conta` | BUNDLE + PUBLIC BACKEND EVIDENCE | Account baseline, plans, security forms and PIX loading modal reconstructed on `reconstruction/account-parity`. |
| `/dashboard/docs` | ROUTE + COPY REFERENCES OBSERVED | Full content capture still pending. |
| `/admin` | CONDITIONAL ROUTE OBSERVED | Only exposed when `isAdmin`; UI not yet captured. |

## Authenticated account menu

Observed destinations:

- `Minerar CNPJs` → `/minerar`
- `Minha Área` → `/minha-area`
- `Minha Conta` → `/minha-conta`
- `Manual / Ajuda` → `/dashboard/docs`
- `Painel Admin` → `/admin` only for admin users
- `Sair` → clears local/session browser state, calls `/api/auth/logout`, then redirects to `/login`

## Mining contract

Observed baseline filter is fixed in the current target bundle:

- target: 20 active companies
- maximum capital: R$ 20.000
- primary action: `🔄 MINERAR DADOS REAIS`
- running state: `MINERANDO...`, progress count and stop action
- first-use onboarding key: `verifyads_welcome_seen`

Observed APIs include `/api/cnpj?cnpj=...` and `/api/cnpj/check-usage?cnpj=...`. The target also maintains local whitelist/blacklist/used CNPJ caches and synchronizes corresponding data with Supabase.

## Account and billing contract

Current public plan snapshot from the same Supabase backend used by the target:

- Starter — R$ 100/mês — 4 domains
- Professional — R$ 150/mês — 10 domains — featured/POPULAR
- Enterprise — R$ 250/mês — 20 domains

Observed subscription states: `active`, `trialing`, `unpaid`, or no matching subscription. The specific authenticated account state was not recoverable and remains `UNKNOWN`.

Observed billing entry point: `POST /api/billing/create-payment`. PIX modal states include loading, PIX/manual payment details, success and error. Subscription status is polled while awaiting confirmation.

## Company/domain contracts observed in private bundles

- `/api/companies/list`
- `/api/companies/delete`
- `/api/domain/list`
- `/api/billing/create-payment`

Additional request/response schemas remain subject to direct capture; endpoint names alone are not treated as proof of full semantics.

## Evidence discipline

Credentials supplied for the test account are intentionally not stored in repository files, workflow YAML, test artifacts or documentation. Unknown account-specific values are not synthesized.

## Next discovery targets

1. Reconnect the Fedora device and integrate the newer local `/minerar` implementation with the GitHub account branch.
2. Capture `/dashboard/docs` completely, including responsive states and navigation.
3. Capture `/admin` only if the supplied test account legitimately exposes it.
4. Capture request/response schemas for company save/delete, domain/DNS verification, CNPJ lookup/usage and billing.
5. Replace deterministic UI baselines with real auth/data adapters only after contracts are verified.
6. Run screenshot diffs for authenticated desktop and mobile states before declaring parity.