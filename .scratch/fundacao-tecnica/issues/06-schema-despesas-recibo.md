# Schema — despesas e recibo

Status: open
Blocked by: 03

## Contexto

O schema mais discutido do projeto — ver `docs/modelo-dados.md` seção "Despesas e captura de recibo", `docs/adr/0002-pipeline-captura-de-recibo.md` (revisado) e `CONTEXT.md` (Despesa, Origem, Lançamento provisório, Recibo, Status de processamento).

## Escopo

- Tabelas `despesas` (com `origem` `foto`/`manual`, campos nullable até confirmação), `despesa_itens`, `recibos` — schema exato em `docs/modelo-dados.md`.
- Constraint de unicidade em `recibos.despesa_id` (1 recibo por despesa — sem suporte a múltiplas fotos no MVP).
- `recibos.status_processamento` com os quatro valores (`aguardando_upload | pendente | processado | falhou`) como única fonte de verdade do estado do upload.
- `recibos.arquivo_url` **não** nullable — guarda a chave do objeto no R2 desde o `INSERT` (ADR 0003), não uma URL resolvível.
- RLS via `has_obra_access` (ticket 03).

## Fora de escopo

O Route Handler que emite a URL assinada e a Edge Function de extração (tickets 08 e 09) — aqui é só o schema e as policies.

## Comments
