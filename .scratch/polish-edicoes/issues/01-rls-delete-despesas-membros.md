# RLS: delete em despesas, update/delete em membros

Status: pending

## Escopo

- `despesas`: policy de `delete` via `has_obra_write_access` (update já existia, sem restrição de status — editar despesa confirmada já era tecnicamente permitido, só faltava UI).
- `construtora_membros`: `update` e `delete` via `has_construtora_access`.
- `obra_membros`: `update` e `delete` via `has_obra_write_access`.

## Comments
