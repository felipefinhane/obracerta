# Schema — planejamento (etapas, medições)

Status: done
Blocked by: 03

## Contexto

Ver `docs/modelo-dados.md` seção "Planejamento". É o núcleo do controle de obra (orçado vs. realizado).

## Escopo

- Tabelas `etapas` e `medicoes` — schema exato em `docs/modelo-dados.md`. Sem fluxo de aprovação formal na v1 (`mvp.md`).
- RLS via `has_obra_access` (ticket 03).
- View/query de "Orçado vs. Realizado": soma `despesas.valor` agrupado por `etapa_id` comparado com `etapas.valor_planejado` — **depende do ticket 06** (tabela `despesas`) pra existir de fato, mas o schema de `etapas`/`medicoes` em si não depende.

## Comments

- Migration `supabase/migrations/20260901144940_planejamento.sql`. `medicoes` não tem `obra_id` direto — RLS via `exists` contra `etapas` reusando `has_obra_access`, já que não tem função auxiliar própria pra medição.
- View "Orçado vs. Realizado" criada na migration do ticket 06 (`orcado_vs_realizado`, `security_invoker = true`), já que depende de `despesas` também existir. Testada e confirmada com `security_invoker` — sem ele a view ignoraria a RLS de quem consulta.
