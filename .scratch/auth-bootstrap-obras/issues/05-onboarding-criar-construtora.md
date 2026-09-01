# Onboarding — criar minha construtora

Status: done
Blocked by: 02, 04

## Contexto

Usuário logado sem nenhuma construtora precisa de um caminho óbvio pra criar a primeira. Ver `CONTEXT.md` pro vocabulário (Construtora, Obra).

## Escopo

- Tela simples pós-login: se o usuário não tem nenhuma linha em `construtora_membros`, mostra formulário (nome, CNPJ opcional) que chama a função `criar_construtora` (ticket 02).
- Depois de criar, redireciona pra listagem de Obras (ticket 06) — vazia, mas navegável.
- Testar: fluxo completo cadastro → login → onboarding → construtora criada → vira admin.

## Comments

- `src/app/page.tsx` vira o roteador pós-login: conta `construtora_membros` do usuário, manda pra `/onboarding` (0) ou `/obras` (>0). `src/app/onboarding/` chama a RPC `criar_construtora` (ticket 02) e redireciona pra `/obras`.
- **Testado via HTTP real, fluxo completo**: cadastro → `GET /` redireciona pro onboarding (sem construtora) → cria construtora → `GET /` agora redireciona pra `/obras` (tem construtora) → `/obras` mostra vazio, formulário pré-preenchido com a `construtora_id` certa.
