# `/minha-area` authenticated dashboard

Status: PARTIALLY OBSERVED — desktop empty-account state captured from an authenticated Firefox session on 2026-09-07.

## Entry contract
- Route: `/minha-area`.
- Requires an authenticated session on the target.
- Page label: `PAINEL DE CONTROLE`.
- Heading: `Minha Área`.
- Subtitle: `Gerencie suas empresas e domínios verificados`.

## Summary metrics
The desktop empty-account state renders four cards, in this order:
1. `Total de Domínios` — value `0`.
2. `Domínios Verificados` — value `0`.
3. `Landing Pages Ativas` — value `0`.
4. `Novos este Mês` — value `0`.

## Primary tabs
- `Minhas Empresas Ativas` is selected by default.
- `Domínios Próprios (White Label)` is the second tab.
- The populated states and exact White Label empty-state copy remain UNKNOWN.

## Empty company state
- Section heading: `📋 Minhas Empresas Ativas`.
- Empty-state heading: `Nenhuma empresa salva`.
- Copy: `Minere um CNPJ, abra o Dossiê Empresarial e clique em Salvar para adicionar uma empresa aqui.`
- CTA: `Ir para Mineração`.
- A `Dica Rápida` block is rendered beneath the CTA.

## Global account menu
Opening the user pill reveals, in order:
- `Minerar CNPJs`
- `Minha Área`
- `Minha Conta`
- `Manual / Ajuda`
- separator
- `Sair`

The exact destination URLs for menu items other than `/minha-area`, logout semantics, loading states, error states and permission variants remain UNKNOWN and must not be invented.

## Visual contract observed at 1920×1080
- Dark near-black/navy background with a subtle dotted field.
- Large blue glow from the left and purple glow from the right.
- Main content centered in a wide desktop container.
- Metric cards use translucent navy surfaces, subtle borders and 16px-class rounded corners.
- Heading uses a blue-to-purple gradient; each metric icon has a distinct solid accent tile.
