# Componente ErrorBanner + aplicar em todas as ações

Status: pending

## Escopo

- `src/components/ErrorBanner.tsx`: extrai o markup já usado (idêntico) em `onboarding` e `equipe` — banner de erro com ícone, `role="alert"`.
- Cada ação listada em `spec.md` passa a `redirect` pra própria tela com `?erro=<mensagem>` em vez de só `console.error` + `return` silencioso; cada página correspondente passa a ler `searchParams.erro` e renderizar `<ErrorBanner mensagem={erro} />`.
- `excluirEtapa` (chamada inline, sem tela própria de destino) redireciona de volta pra lista de etapas com `?erro=...` no caso de falha.

## Comments
