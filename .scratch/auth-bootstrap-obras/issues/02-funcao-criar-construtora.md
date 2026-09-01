# Função `criar_construtora` (bootstrap do primeiro admin)

Status: open
Blocked by: nenhuma

## Contexto

Problema de ovo-e-galinha anotado no ticket 03 de `fundacao-tecnica`: um usuário recém-cadastrado não tem linha em `construtora_membros` nenhuma, então não passaria numa policy de `insert` comum em `construtora_membros` (que exigiria já ter acesso). Precisa de um caminho que crie a construtora **e** a linha de admin atomicamente.

## Escopo

- Função SQL `security definer`: `criar_construtora(nome text, cnpj text default null) returns uuid`. Dentro da função (que roda com privilégio elevado, não como o usuário): insere em `construtoras`, insere em `construtora_membros` com `user_id = auth.uid()` e `papel = 'admin'`, retorna o id da construtora nova.
- Única checagem: `auth.uid()` não pode ser nulo (usuário precisa estar autenticado) — qualquer usuário logado pode criar uma construtora nova e virar admin dela. Sem limite de quantas construtoras um usuário pode criar (não decidido, não é bloqueio pro MVP).
- Chamável via RPC (`supabase.rpc('criar_construtora', { nome, cnpj })`).
- Testar: usuário sem nenhuma construtora chama a função, vira admin, consegue criar obra na sequência (via ticket 01).

## Comments
