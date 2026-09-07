# System Map

Status: discovery in progress.
Target: `https://score-scanner-7q2s.vercel.app/`

## Public route inventory

| Route | Evidence status | Current replica status |
| --- | --- | --- |
| `/` | OBSERVED | Implemented from captured DOM/style evidence; visual diff still pending. |
| `/login` | OBSERVED UI | Implemented UI; real auth behavior intentionally not fabricated. |
| `/cadastro` | ROUTE OBSERVED, UI CAPTURE PENDING | Not implemented until current CI capture is inspected. |
| `/l/privacidade` | OBSERVED | Implemented from captured content/layout. |
| `/l/termos` | OBSERVED | Implemented from captured content/layout. |

## Public navigation contracts
- Header: `Benefícios -> #beneficios`, `Como Funciona -> #como-funciona`, `Planos -> #planos`, `Minha Área -> /login`.
- Hero: `Acessar Minha Área -> /login`, `Ver Benefícios -> #beneficios`.
- Pricing: Starter, Business and Agency CTAs all point to `/cadastro`.
- Footer: Privacidade, Termos, Login.
- Login: signup link -> `/cadastro`; back link -> `/`.

## Public homepage sections
1. Sticky navigation / VerifyAds mark.
2. Hero.
3. Benefits (`#beneficios`).
4. Metrics strip.
5. Three-step process (`#como-funciona`).
6. Pricing (`#planos`).
7. Footer.

## Authenticated application
Status: UNKNOWN.

Credentials were supplied out-of-band in the conversation for a test account. They are intentionally not stored in the repository, documentation, workflow YAML, artifacts or logs.

## Next discovery targets
1. Capture and reconstruct `/cadastro`.
2. Produce scroll-revealed desktop/mobile homepage screenshots and visual-diff the replica.
3. Securely execute authenticated discovery using repository secrets or another non-public credential channel.
4. Capture post-login default route and full navigation tree.
5. Capture API requests/responses for auth/session and each domain/DNS workflow.
6. Build route coverage and state matrices before implementing authenticated behavior.
