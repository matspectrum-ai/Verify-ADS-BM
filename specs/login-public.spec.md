# Spec: Public Login UI

## Route
`GET /login`

## Acceptance criteria
1. VerifyAds brand mark is centered above the form card.
2. H1 is `Bem-vindo de volta`.
3. Supporting text is `Acesse sua conta VerifyAds`.
4. Email field is required, `type=email`, `autocomplete=email`, placeholder `seu@email.com`.
5. Password field is required, `type=password`, `autocomplete=current-password`, placeholder `••••••••`.
6. Submit action is labeled `Entrar na Minha Conta`.
7. `Criar conta grátis` links to `/cadastro`.
8. `← Voltar ao início` links to `/`.
9. Desktop and mobile layout reproduce the captured dark ambient background and glass card.

## Boundary
The submit side effects, backend contract, error copy, loading state and success redirect are currently UNKNOWN. The replica must not invent them and claim parity.
