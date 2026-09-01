# Onboarding — criar minha construtora

Status: open
Blocked by: 02, 04

## Contexto

Usuário logado sem nenhuma construtora precisa de um caminho óbvio pra criar a primeira. Ver `CONTEXT.md` pro vocabulário (Construtora, Obra).

## Escopo

- Tela simples pós-login: se o usuário não tem nenhuma linha em `construtora_membros`, mostra formulário (nome, CNPJ opcional) que chama a função `criar_construtora` (ticket 02).
- Depois de criar, redireciona pra listagem de Obras (ticket 06) — vazia, mas navegável.
- Testar: fluxo completo cadastro → login → onboarding → construtora criada → vira admin.

## Comments
