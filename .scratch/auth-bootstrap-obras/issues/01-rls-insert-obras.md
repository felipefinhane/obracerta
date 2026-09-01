# RLS: policy de insert em `obras`

Status: open
Blocked by: nenhuma

## Contexto

`obras` só tem policy de `select` hoje (ticket 03 de `fundacao-tecnica`). Criar uma obra é uma ação de nível construtora (não tem obra ainda pra checar `has_obra_access` contra) — usa `has_construtora_access`, igual às policies de `categorias`/`fornecedores`.

## Escopo

- Migration: `create policy ... for insert on public.obras with check (has_construtora_access(construtora_id))`.
- Testar (local + hospedado): membro da construtora cria obra; usuário sem vínculo com a construtora não consegue.

## Comments
