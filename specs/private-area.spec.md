# Private Area Contract

Evidence status: OBSERVED from authenticated Firefox session plus cached target bundles.
Target route: `/minha-area`.

## Observable layout
- Header badge: `PAINEL DE CONTROLE`.
- Title: `Minha Área`.
- Description: `Gerencie suas empresas e domínios verificados`.
- Four metrics: Total de Domínios, Domínios Verificados, Landing Pages Ativas, Novos este Mês.
- Two tabs: `Minhas Empresas Ativas` and `Domínios Próprios (White Label)`.

## Empty companies state
- Heading: `Minhas Empresas Ativas`.
- Empty title: `Nenhuma empresa salva`.
- Copy instructs the user to mine a CNPJ, open Dossiê Empresarial and save it.
- CTA `Ir para Mineração` navigates to `/minerar`.
- Quick tip contains the three observed domain onboarding steps.

## User menu
- `/minerar` — Minerar CNPJs.
- `/minha-area` — Minha Área.
- `/minha-conta` — Minha Conta.
- `/dashboard/docs` — Manual / Ajuda.
- `/admin` is rendered only when the target auth state reports `isAdmin`.
- `Sair` clears client state, calls `/api/auth/logout`, then returns to `/login`.

## Observed data contracts
- GET `/api/domain/stats` supplies `total_domains`, `verified_domains`, `active_landing_pages`, `created_this_month`.
- GET `/api/companies/list` returns saved companies.
- DELETE `/api/companies/delete` receives `{ company_id }`.
- GET `/api/domain/list` returns connected domains.
- POST `/api/domain/add` creates a domain.
- DELETE `/api/domain/delete` removes a domain.
- Domain verification uses `/api/domain/verify-dns`.

## White-label empty state
- Form heading: `Conectar Domínio`.
- Copy: `Use seu domínio ou subdomínio (ex: seguro.sualoja.com ou sualoja.com.br) para suas landing pages.`
- Label: `Seu Domínio`.
- Placeholder: `Ex: lp.minhaloja.com ou sualoja.com.br`.
- Empty list title: `Nenhum domínio conectado`.
- Empty list copy: `Use o formulário ao lado para conectar seu primeiro domínio personalizado.`

## Acceptance criteria
1. Desktop viewport preserves the captured four-column metric grid and centered 1280px shell.
2. Default tab is companies; switching tabs is client-side and does not reload the page.
3. Companies empty state exactly preserves observed copy and `/minerar` navigation.
4. Account menu exposes only observed destinations; admin remains conditional.
5. Personal test-account email or credentials must never be committed.
