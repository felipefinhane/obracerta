# Schema — cadastros de apoio (categorias, fornecedores)

Status: done
Blocked by: 03

## Contexto

Ver `docs/modelo-dados.md` seção "Cadastros de apoio". Compartilhados entre as obras da mesma construtora (decidido em `planejamento.md` §7) — por isso vinculados a `construtora_id`, não a `obra_id`.

## Escopo

- Tabelas `categorias` (com `categoria_pai_id` nullable pra subcategoria) e `fornecedores` — schema exato em `docs/modelo-dados.md`.
- RLS via `has_construtora_access` (ticket 03).

## Comments

- Migration `supabase/migrations/20260901144939_cadastros_apoio.sql`, aplicada local e no hospedado.
- **Achado no teste de RLS, resolvido**: um usuário com acesso só via `obra_membros` (ex. cliente) não conseguia ler `categorias`/`fornecedores`, mesmo sendo da mesma construtora da obra dele (a policy original usa `has_construtora_access`, que exige `construtora_membros`). Fechado em `supabase/migrations/20260901145517_categorias_fornecedores_via_despesa.sql`: policy adicional (RLS combina policies do mesmo comando com OR) — visível também se referenciado por uma despesa de obra que o usuário acessa. Testado: cliente vê a categoria/fornecedor da despesa dele, **não** vê uma segunda categoria não referenciada por nenhuma despesa da obra dele — não abre o cadastro inteiro da construtora, só o que já aparece nas despesas visíveis.
