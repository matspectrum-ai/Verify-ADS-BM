# Evidence Ledger

This ledger separates target evidence from implementation choices. Credentials, cookies, auth state, private screenshots and captured personal data are never committed.

## E-001 Public homepage
- Status: OBSERVED.
- URL: `/`.
- Captured at desktop and mobile viewports with DOM/style/request inventory.
- Visual system: dark `#070711` base, dot grid, animated ambient blue/purple/indigo/cyan orbs, translucent navigation, Inter body font and Poppins display font.

## E-002 Login
- Status: OBSERVED UI.
- URL: `/login`.
- Inputs: email `seu@email.com`; password `••••••••`.
- Submit: `Entrar na Minha Conta`.
- Links: `/cadastro` and `/`.
- Auth success/failure/session contracts are not yet promoted to complete.

## E-003 Signup
- Status: ROUTE OBSERVED; parity review pending.
- URL: `/cadastro`.

## E-004 Privacy
- Status: OBSERVED.
- URL: `/l/privacidade`.
- Exact content/layout captured in the public evidence harness.

## E-005 Terms
- Status: OBSERVED.
- URL: `/l/termos`.
- Exact content/layout captured in the public evidence harness.

## E-006 Authenticated session
- Status: OBSERVED.
- An already-authenticated Firefox session reached `/minha-area` without persisting credentials in this repository.
- Read-only browser/cache inspection exposed the account navigation tree and route-specific Next.js bundles.
- Private captures remain under ignored local evidence directories.

## E-007 Target technology surface
- Status: OBSERVED externally.
- Next.js App Router assets are delivered under `/_next/static/chunks/`.
- Styles include Tailwind-generated utilities plus custom animation rules.
- Google Fonts requests include Inter 400/500/600/700/800 and Poppins 600/700/800/900.

## E-008 `/minha-area`
- Status: OBSERVED.
- Header: `PAINEL DE CONTROLE`, `Minha Área`, `Gerencie suas empresas e domínios verificados`.
- Metrics: Total de Domínios, Domínios Verificados, Landing Pages Ativas, Novos este Mês.
- Tabs: Minhas Empresas Ativas; Domínios Próprios (White Label).
- Empty companies and empty domains states captured.
- APIs observed: domain stats/list/add/delete/verify-dns and companies list/delete.
- Replica surface has passing E2E coverage for the captured empty states and account-menu destinations.

## E-009 `/minerar`
- Status: OBSERVED UI + delivered-bundle behavior.
- Product mark includes `V91`; subtitle `Empresas reais. Anúncios seguros`.
- First-use guide uses `verifyads_welcome_seen` and appears after about 800ms when unseen.
- Mining target is 20 companies; running state exposes tried/found/target/percentage/isComplete.
- APIs observed: `/api/cnpj` and `/api/cnpj/check-usage`.
- Candidate rules observed: active company, trust score >= 65, capital ceiling.
- Replica currently implements observed UI states only. Its timer is an IMPLEMENTATION scaffold, not target parity.

## E-010 `/minha-conta` and plans
- Status: PARTIALLY OBSERVED.
- Delivered bundle references subscription/account UI and `/api/billing/create-payment`.
- Public plan data observed: Starter (4 domains, 100/month), Professional (10 domains, 150/month, featured), Enterprise (20 domains, 250/month).
- Subscription state for the authenticated account was not captured.
- Payment QR payload, payment state machine and email/password mutations are UNKNOWN. Any placeholder behavior for those is prohibited.

## E-011 Dossier/domain onboarding
- Status: PARTIALLY OBSERVED from delivered bundle.
- Bundle references `/api/cnpj`, `/api/domain/list`, `/api/domain/save-with-company`, `/minha-area?tab=domains` and the account navigation routes.
- Full dossier route, field matrix, generated assets, save flow, DNS states and error states remain pending.
