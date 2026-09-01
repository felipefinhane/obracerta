# Schema — cadastros de apoio (categorias, fornecedores)

Status: done — mas ver achado abaixo, precisa de decisão do usuário
Blocked by: 03

## Contexto

Ver `docs/modelo-dados.md` seção "Cadastros de apoio". Compartilhados entre as obras da mesma construtora (decidido em `planejamento.md` §7) — por isso vinculados a `construtora_id`, não a `obra_id`.

## Escopo

- Tabelas `categorias` (com `categoria_pai_id` nullable pra subcategoria) e `fornecedores` — schema exato em `docs/modelo-dados.md`.
- RLS via `has_construtora_access` (ticket 03).

## Comments

- Migration `supabase/migrations/20260901144939_cadastros_apoio.sql`, aplicada local e no hospedado.
- **Achado no teste de RLS** (ver ticket 06 pro cenário completo): um usuário com acesso só via `obra_membros` (ex. cliente) **não consegue ler `categorias`/`fornecedores`**, mesmo sendo da mesma construtora da obra dele — a policy usa `has_construtora_access`, que só é true pra quem tem linha em `construtora_membros`. Na prática, um relatório de despesas pro cliente não traria nome de categoria/fornecedor, só o que der pra ver via `despesas`/`etapas`/`diario_*` (que usam `has_obra_access`, esse sim cobre cliente). Não decidido em nenhuma sessão de grilling anterior — fica pra você: aceita essa lacuna (cliente vê despesa sem rótulo de categoria/fornecedor) ou abre uma policy adicional pra isso?
