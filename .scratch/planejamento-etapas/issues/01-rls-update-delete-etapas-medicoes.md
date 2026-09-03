# RLS: update/delete em etapas, insert em medicoes

Status: pending

## Contexto

`etapas` só tinha `select` (fundacao-tecnica/05) e `insert` (despesas-recibo/01) — falta `update`/`delete` pra editar/excluir. `medicoes` só tinha `select` (fundacao-tecnica/05) — falta `insert`. Mesmo padrão de gap já visto (e fechado) três vezes nos efforts anteriores.

## Escopo

- `etapas`: policy de `update` e `delete` via `has_obra_write_access(obra_id)` (cliente não edita/exclui etapa, mesmo padrão de despesas).
- `medicoes`: policy de `insert` via `exists` contra `etapas` reusando `has_obra_write_access(etapa.obra_id)` — mesmo padrão de `despesa_itens`/`recibos` (tabela sem `obra_id` direto).

## Comments
