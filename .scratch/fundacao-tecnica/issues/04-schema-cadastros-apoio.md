# Schema — cadastros de apoio (categorias, fornecedores)

Status: open
Blocked by: 03

## Contexto

Ver `docs/modelo-dados.md` seção "Cadastros de apoio". Compartilhados entre as obras da mesma construtora (decidido em `planejamento.md` §7) — por isso vinculados a `construtora_id`, não a `obra_id`.

## Escopo

- Tabelas `categorias` (com `categoria_pai_id` nullable pra subcategoria) e `fornecedores` — schema exato em `docs/modelo-dados.md`.
- RLS via `has_construtora_access` (ticket 03).

## Comments
