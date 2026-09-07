# Mining Contract

Evidence status: OBSERVED from authenticated Firefox cache bundle `86683481b8de1914.js`.
Target route: `/minerar`.

## Initial surface
- Topbar contains VerifyAds and the authenticated account menu.
- Main title renders `VerifyAds` plus badge `V91`.
- Subtitle: `Empresas reais. Anúncios seguros`.
- Fixed mining target: 20 active companies with capital up to R$ 20.000.
- Primary action: `🔄 MINERAR DADOS REAIS`.
- Idle empty state instructs the user to configure filters and start mining.
- Footer attributes data to BrasilAPI.

## First-use guide
- Storage key: `verifyads_welcome_seen`.
- If missing, modal opens after approximately 800ms.
- Heading: `Antes de começar, confira nosso guia 👋`.
- Contains guidance for the ☰ account menu and Central de Ajuda.
- Primary action `Abrir Central de Ajuda` navigates to `/dashboard/docs` and marks guide as seen.
- Secondary action `Já sei usar — começar a mineração` marks guide as seen and closes it.

## Mining loop
- Target count: 20.
- Progress state exposes `tried`, `found`, `target`, `percentage`, `isComplete`.
- Running UI: `Minerando empresas...`, `Parar`, `Progresso:`, `<found> / 20`, `<tried> CNPJs testados`.
- Company lookup: GET `/api/cnpj?cnpj=<encoded>`.
- Usage check: GET `/api/cnpj/check-usage?cnpj=<encoded>`.
- 404 means candidate not found; 429 and `RATE_LIMIT` invoke rate-limit handling.
- Candidate must be active, trust score >= 65, and satisfy the fixed capital maximum.
- Target uses local whitelist/blacklist/used caches synchronized with Supabase.

## Result cards
- Show razão social, formatted CNPJ, Trust Score and status.
- Detail grid includes Capital Social, Localização, Porte and CNAE.
- Card footer: `Clique para ver detalhes e salvar`.
- Results section heading: `Empresas Encontradas`.

## Implementation status
- OBSERVED UI states are implemented.
- The replica mining network loop is not yet marked complete; current progress animation is an IMPLEMENTATION scaffold and must be replaced by the observed API-driven loop before parity is claimed.
