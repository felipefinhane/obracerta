# Recibos pendentes de confirmação

Status: done
Blocked by: 01, 03

## Contexto

`docs/planejamento.md` §3 passo 3: "tela de Recibos pendentes de confirmação: lista de todos os lançamentos provisórios". Atualiza por polling/refetch simples — Supabase Realtime foi descartado (`planejamento.md` §7).

## Escopo

- `/obras/[obraId]/despesas/pendentes`: lista `despesas` com `status = pendente_confirmacao` da obra, join com `recibos` pra mostrar `status_processamento` (badge: aguardando upload / processando / pronto pra revisar / falhou).
- Cada item linka pra `/obras/[obraId]/despesas/[despesaId]/confirmar` (ticket 05) quando `status_processamento` é `processado` ou `falhou` (falhou também precisa poder confirmar manualmente, preenchendo tudo à mão — a foto não se perde mesmo se a extração falhar, `CONTEXT.md`/ADR 0002).
- Refetch simples ao focar a aba ou botão manual de atualizar — sem Realtime, sem polling automático em intervalo (não pedido, evita gasto de tier gratuito).

## Comments

- `/obras/[obraId]/despesas/pendentes`: lista despesas `pendente_confirmacao` com o `recibos.status_processamento` embutido (PostgREST embute como objeto único, não array, por causa do unique em `recibos.despesa_id` — tratei os dois formatos por segurança). Badge por status; link pra confirmação (ticket 05) só quando `processado` ou `falhou`. Botão de atualizar é um Client Component chamando `router.refresh()` — sem Realtime, conforme decidido.
- **Testado de ponta a ponta de verdade** reaproveitando o mesmo lançamento provisório do ticket 03: com o recibo ainda em `pendente` (Gemini bateu 503 na primeira tentativa), a tela mostrou "Extração falhou — revisar manualmente" com link habilitado pro `/confirmar` — cobre exatamente o caso "extração falhou, mas a foto não se perdeu" que a spec pede. Depois que a extração processou de verdade na segunda tentativa, a mesma página (via refetch) passou a mostrar "Pronto pra revisar" com o mesmo link.
