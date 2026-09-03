# RLS: update/delete em etapas, insert em medicoes

Status: done

## Contexto

`etapas` só tinha `select` (fundacao-tecnica/05) e `insert` (despesas-recibo/01) — falta `update`/`delete` pra editar/excluir. `medicoes` só tinha `select` (fundacao-tecnica/05) — falta `insert`. Mesmo padrão de gap já visto (e fechado) três vezes nos efforts anteriores.

## Escopo

- `etapas`: policy de `update` e `delete` via `has_obra_write_access(obra_id)` (cliente não edita/exclui etapa, mesmo padrão de despesas).
- `medicoes`: policy de `insert` via `exists` contra `etapas` reusando `has_obra_write_access(etapa.obra_id)` — mesmo padrão de `despesa_itens`/`recibos` (tabela sem `obra_id` direto).

## Comments

- Migration `supabase/migrations/20260903140413_update_delete_etapas_insert_medicoes.sql`: `etapas` update/delete via `has_obra_write_access`, `medicoes` insert via `exists` contra `etapas` (mesmo padrão de `despesa_itens`).
- **Testado de ponta a ponta de verdade contra o hospedado**: com a sessão real do usuário, `update`/insert funcionaram na etapa/obra reais; `update` contra um `id` inexistente voltou array vazio (RLS + no match) — a função `has_obra_write_access` reusada aqui já tinha sido testada com um `obra_id` de terceiro no effort `despesas-recibo`/01, então não repeti esse caso negativo específico.
