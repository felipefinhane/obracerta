# Schema — diário de obra

Status: done
Blocked by: 03

## Contexto

Ver `docs/modelo-dados.md` seção "Diário de obra".

## Escopo

- Tabelas `diario_entradas` e `diario_midia` — schema exato em `docs/modelo-dados.md`.
- `diario_midia.tipo` só aceita `foto` no MVP — vídeo é fase 2 (`docs/mvp.md`, ADR 0003).
- `diario_midia.arquivo_url` guarda a chave do objeto no R2 (mesmo padrão de `recibos.arquivo_url`, ADR 0003).
- RLS via `has_obra_access` (ticket 03).

## Comments

- Migration `supabase/migrations/20260901144943_diario_obra.sql`. `diario_midia.tipo` com `check (tipo in ('foto'))` — trava vídeo no nível do banco, não só por convenção da aplicação; solta quando vídeo voltar (fase 2).
- Testado local e hospedado: `diario_entradas`/`diario_midia` seguem a mesma regra de `has_obra_access` das outras tabelas.
