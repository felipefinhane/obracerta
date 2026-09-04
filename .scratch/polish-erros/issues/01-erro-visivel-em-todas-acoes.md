# Componente ErrorBanner + aplicar em todas as ações

Status: done

## Escopo

- `src/components/ErrorBanner.tsx`: extrai o markup já usado (idêntico) em `onboarding` e `equipe` — banner de erro com ícone, `role="alert"`.
- Cada ação listada em `spec.md` passa a `redirect` pra própria tela com `?erro=<mensagem>` em vez de só `console.error` + `return` silencioso; cada página correspondente passa a ler `searchParams.erro` e renderizar `<ErrorBanner mensagem={erro} />`.
- `excluirEtapa` (chamada inline, sem tela própria de destino) redireciona de volta pra lista de etapas com `?erro=...` no caso de falha.

## Comments

- `src/components/ErrorBanner.tsx` criado e reusado também em `onboarding`/`equipe` (removendo a duplicação que já existia ali, não só nos lugares novos).
- 9 ações convertidas de `console.error` + `return` silencioso pra `redirect` com `?erro=<mensagem>` de volta pra própria tela: `criarObra`, `criarCategoria`, `criarFornecedor`, `criarEtapa`, `atualizarEtapa` (volta pra `/editar`, não pra lista, no caso de erro), `excluirEtapa`, `criarDespesaManual`, `confirmarDespesa`, `criarMedicao`. 7 páginas correspondentes passaram a ler `searchParams.erro` e renderizar o banner.
- **Testado de ponta a ponta de verdade contra o hospedado**: forcei uma violação real de `check constraint` (`categorias_tipo_check`) enviando um `tipo` inválido via POST real do form (wire protocol do Server Action) em `criarCategoria` — antes desse ticket isso falharia em silêncio; agora voltou `303` pra `/cadastros?erro=...` com a mensagem exata do Postgres, e o banner renderizou certo (`role="alert"`, mensagem visível). Confirmei via REST que nenhuma linha foi criada (constraint segurou o dado ruim, como esperado). Os outros 8 casos seguem o mesmo padrão de código já verificado, não repeti o teste de ponta a ponta em cada um.
