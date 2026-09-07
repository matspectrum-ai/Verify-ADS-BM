# Evidence Ledger

This file separates verified target behavior from unknowns and implementation choices.

## E-001 Public homepage
- Status: OBSERVED
- URL: `/`
- HTTP: 200 on desktop and mobile capture.
- Evidence captured: full DOM, body text, CSS rules, computed-style samples, request inventory, desktop screenshot at 1440x1000 and mobile screenshot at 390x844.
- Visual facts: dark `#070711` base, 40px dot grid, animated blue/purple/indigo/cyan ambient orbs, sticky translucent navigation, Inter body font, Poppins display font, gradient hero accent, six colored benefit cards, four metrics, three-step flow and three pricing cards.
- Note: initial full-page capture occurred before scroll-triggered animations revealed lower sections. The capture harness now scrolls the page before the screenshot so the next artifact can be used as the full visual baseline.

## E-002 Login route
- Status: OBSERVED (public UI)
- URL: `/login`
- HTTP: 200 on desktop and mobile capture.
- Observed controls:
  - email input, type `email`, placeholder `seu@email.com`
  - password input, type `password`, placeholder `••••••••`
  - submit button `Entrar na Minha Conta`
  - `/cadastro` link `Criar conta grátis`
  - `/` link `← Voltar ao início`
- Observed visual composition: same dark ambient/grid background; centered VerifyAds mark; translucent 448px max-width glass card; gradient primary button.
- Authentication success/failure/API behavior: UNKNOWN until authenticated discovery is executed securely.

## E-003 Signup route
- Status: OBSERVED route existence / CAPTURE PENDING
- URL: `/cadastro`
- Discovered from the login page and all three pricing CTAs.
- Public capture was added to the CI evidence harness and will be promoted to OBSERVED UI after artifact inspection.

## E-004 Privacy route
- Status: OBSERVED
- URL: `/l/privacidade`
- HTTP: 200.
- Exact text, headings and layout captured.
- Layout: slate-50 page, centered white max-w-3xl card, green lock icon, 30px heading, 9/2/2026 update date and home backlink.

## E-005 Terms route
- Status: OBSERVED
- URL: `/l/termos`
- HTTP: 200.
- Exact text, headings and layout captured.
- Layout: same legal-page shell, blue shield-alert icon, 30px heading, 9/2/2026 update date and home backlink.

## E-006 Authenticated product
- Status: BLOCKED
- Reason: the local browser runtime cannot resolve/navigate outbound to the target. GitHub Actions can browse the target, but the repository is public and credentials must not be committed or passed as visible workflow inputs.
- Required next evidence: authenticated route tree, session behavior, domain CRUD, DNS workflow, landing-page workflow, billing/account states and network contracts.
- Rule: none of those behaviors will be fabricated while blocked.

## E-007 Target technology surface
- Status: OBSERVED externally
- The target serves Next.js App Router assets under `/_next/static/chunks/`.
- The target stylesheet exposes Tailwind-generated utilities plus custom animation rules.
- Google Fonts request observed for Inter 400/500/600/700/800 and Poppins 600/700/800/900.
- These are observations about delivered assets, not claims about unavailable source code or backend internals.
