# Erro visível em todas as ações

Status: done

Primeiro item da lista de "polish geral" identificada depois do MVP completo (ver `.scratch/diario-obra/spec.md` e recomendação de próximos passos de 2026-09-04). Hoje, a maioria dos Server Actions do app só faz `console.error` e retorna silenciosamente quando o `insert`/`update` falha (RLS, constraint, etc.) — o usuário submete o form e nada visível acontece, sem explicação. Só `onboarding` e `equipe` (mais recentes) já tinham o padrão certo: redirecionar pra mesma tela com `?erro=...` e mostrar um banner.

## Escopo

Generalizar esse padrão pra toda ação que hoje só loga no console:
- `criarObra`, `criarCategoria`, `criarFornecedor`, `criarEtapa`, `atualizarEtapa`, `excluirEtapa`, `criarDespesaManual`, `confirmarDespesa`, `criarMedicao`.
- Componente compartilhado `ErrorBanner` (mesmo markup repetido em onboarding/equipe até agora) pra não duplicar JSX de novo em mais 7 lugares.

## Fora de escopo

- Falha secundária depois que a ação principal já teve sucesso e redirecionou (ex: insert de `despesa_itens` depois que a despesa em si já foi criada/confirmada) — continua só `console.error`, não vale a pena complicar o redirect pra isso.
- `criarLancamentoProvisorio`/`criarMidiaDiario`/`confirmarUploadRecibo` (despesas/capturar) e `criarEntradaDiario`/`criarMidiaDiario` (diário/novo) — já tratam erro no Client Component que os chama, com mensagem própria na tela. Não usam o padrão redirect+searchParam porque são chamados imperativamente do cliente, não como `<form action>`.
- Outros itens de polish (editar/remover membro, editar despesa confirmada, offline) — cada um fica pro seu próprio ticket quando entrar em pauta.

## Issues

01. Componente `ErrorBanner` + aplicar em todas as ações listadas acima

## Comments

- 1/1 ticket fechado. Testado de ponta a ponta contra o hospedado forçando uma violação real de constraint via POST do form — confirmado que o erro aparece pro usuário em vez de falhar em silêncio.
- Deploy: mudanças ainda não commitadas/enviadas ao Vercel nesta sessão.
