# Minha Conta — observed contract

Source of truth: authenticated bundle recovered from the target Firefox cache plus the target's public Supabase `plans` table.

## Route

`/minha-conta`

## Header

- Title: `Minha Conta`
- Description: `Gerencie seu plano e configurações de acesso`

## Subscription states observed in bundle

The account card supports these states:

- `active`: shows current plan, `Ativo`, price and optional next renewal.
- `trialing`: shows `Trial Gratuito`, trial expiration and current plan.
- `unpaid`: shows `Pagamento Pendente`, current plan name and `Pagar Agora`.
- no matching subscription: shows `Nenhum plano ativo` and `Escolha um plano abaixo`.

The authenticated user's actual subscription state was not recoverable from cache and must remain `UNKNOWN` until observed again. The deterministic reconstruction baseline therefore renders the no-plan state rather than fabricating account data.

## Public plans snapshot

Observed directly from the same Supabase backend queried by the target UI:

| Plan | Price | Domains | Featured |
| --- | ---: | ---: | --- |
| Starter | R$ 100/mês | 4 | no |
| Professional | R$ 150/mês | 10 | yes (`POPULAR`) |
| Enterprise | R$ 250/mês | 20 | no |

Plan descriptions and feature lists are reproduced from the backend snapshot.

## PIX flow

Selecting an available plan opens the payment modal. Observed states:

1. `loading`: `Gerando dados do Pix...`
2. `pix`: QR/code or manual Pix details returned by `/api/billing/create-payment`
3. `success`: `Pagamento Confirmado!`
4. `error`: `Erro ao Gerar PIX`

The target polls the corresponding subscription status while the modal is in the Pix state. Until the payment backend is reproduced, the reconstruction must not generate fake QR codes or fake Pix payloads.

## Security

The route exposes:

- `Alterar Email`
  - placeholder `Novo endereço de email`
  - target calls Supabase `auth.updateUser({ email })`
- `Alterar Senha`
  - `Nova senha`
  - `Confirmar nova senha`
  - minimum 6 characters
  - matching confirmation required
  - target calls Supabase `auth.updateUser({ password })`

## Acceptance criteria

- All three public plans and current prices/limits are rendered.
- Professional is visually marked `POPULAR`.
- Clicking `Pagar com PIX` opens a modal with plan name, price and the observed loading copy.
- Closing the modal returns to the account page without navigation.
- Email/password forms preserve observed validation copy.
- No unobserved subscription, Pix code or account identity is invented.