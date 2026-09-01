# Schema — diário de obra

Status: open
Blocked by: 03

## Contexto

Ver `docs/modelo-dados.md` seção "Diário de obra".

## Escopo

- Tabelas `diario_entradas` e `diario_midia` — schema exato em `docs/modelo-dados.md`.
- `diario_midia.tipo` só aceita `foto` no MVP — vídeo é fase 2 (`docs/mvp.md`, ADR 0003).
- `diario_midia.arquivo_url` guarda a chave do objeto no R2 (mesmo padrão de `recibos.arquivo_url`, ADR 0003).
- RLS via `has_obra_access` (ticket 03).

## Comments
