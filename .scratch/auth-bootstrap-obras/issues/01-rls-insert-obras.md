# RLS: policy de insert em `obras`

Status: done — achou e corrigiu um bug real, ver comentário
Blocked by: nenhuma

## Contexto

`obras` só tem policy de `select` hoje (ticket 03 de `fundacao-tecnica`). Criar uma obra é uma ação de nível construtora (não tem obra ainda pra checar `has_obra_access` contra) — usa `has_construtora_access`, igual às policies de `categorias`/`fornecedores`.

## Escopo

- Migration: `create policy ... for insert on public.obras with check (has_construtora_access(construtora_id))`.
- Testar (local + hospedado): membro da construtora cria obra; usuário sem vínculo com a construtora não consegue.

## Comments

- Migration `supabase/migrations/20260901160323_insert_obras.sql`.
- **Bug real encontrado e corrigido** (`20260901160640_fix_select_obras_autoreferencia.sql`): `insert().select()` (o padrão do supabase-js) em `obras` falhava com "new row violates row-level security policy", porque a policy de `select` de `obras` usava `has_obra_access(id)`, que reconsulta a própria `obras` internamente — auto-referência que quebra na checagem implícita do `RETURNING`. Não apareceu nos testes anteriores (tickets 03-07 de `fundacao-tecnica`) porque todo dado de teste sempre foi inserido via `service_role` (bypassa RLS), nunca através de um insert real de usuário autenticado. Corrigido reescrevendo a policy de `obras` pra usar as colunas da própria linha em vez de reconsultar a tabela; `has_obra_access()` continua igual e correta pras outras tabelas (não têm esse problema, consultam `obras`, não a si mesmas).
- Testado com login real: membro da construtora cria obra (incluindo o `insert().select()` que expôs o bug); usuário sem vínculo não consegue (bloqueado pela RLS, confirmado o erro correto).
