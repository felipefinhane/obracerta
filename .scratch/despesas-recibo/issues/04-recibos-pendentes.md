# Recibos pendentes de confirmação

Status: pending
Blocked by: 01, 03

## Contexto

`docs/planejamento.md` §3 passo 3: "tela de Recibos pendentes de confirmação: lista de todos os lançamentos provisórios". Atualiza por polling/refetch simples — Supabase Realtime foi descartado (`planejamento.md` §7).

## Escopo

- `/obras/[obraId]/despesas/pendentes`: lista `despesas` com `status = pendente_confirmacao` da obra, join com `recibos` pra mostrar `status_processamento` (badge: aguardando upload / processando / pronto pra revisar / falhou).
- Cada item linka pra `/obras/[obraId]/despesas/[despesaId]/confirmar` (ticket 05) quando `status_processamento` é `processado` ou `falhou` (falhou também precisa poder confirmar manualmente, preenchendo tudo à mão — a foto não se perde mesmo se a extração falhar, `CONTEXT.md`/ADR 0002).
- Refetch simples ao focar a aba ou botão manual de atualizar — sem Realtime, sem polling automático em intervalo (não pedido, evita gasto de tier gratuito).

## Comments
