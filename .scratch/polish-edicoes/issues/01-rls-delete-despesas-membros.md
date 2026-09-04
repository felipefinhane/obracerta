# RLS: delete em despesas, update/delete em membros

Status: done

## Escopo

- `despesas`: policy de `delete` via `has_obra_write_access` (update já existia, sem restrição de status — editar despesa confirmada já era tecnicamente permitido, só faltava UI).
- `construtora_membros`: `update` e `delete` via `has_construtora_access`.
- `obra_membros`: `update` e `delete` via `has_obra_write_access`.

## Comments

- Migration `supabase/migrations/20260904133034_delete_despesas_update_delete_membros.sql`. Testado indiretamente pelos tickets 02/03 (POST real de update/delete funcionando confirma a RLS).
