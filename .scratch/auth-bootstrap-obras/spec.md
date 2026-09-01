# Auth + bootstrap + Obras

Status: open

Primeiro effort de UI do MVP. Sem login, nenhuma tela é utilizável de verdade (RLS depende de sessão autenticada) — e sem um jeito de criar a primeira construtora e virar admin dela, ninguém chega a ver uma obra sequer (problema de ovo-e-galinha anotado como pendente no ticket 03 de `fundacao-tecnica`). Este effort fecha os dois antes de entrar em qualquer módulo funcional (Despesas, Diário, etc.).

## Escopo

- Login/cadastro com **email + senha** (decidido em `planejamento.md` §7 — magic link fica pra depois, `mvp.md` seção 2).
- Bootstrap: usuário autenticado sem construtora nenhuma cria uma e vira admin dela, atomicamente.
- Cadastro/listagem de Obras (mínimo pra ter algo navegável — sem edição/exclusão ainda).

Fora de escopo: convite de outros membros pra construtora/obra (fica o mesmo gap já anotado no ticket 03 de `fundacao-tecnica` — write policies de `construtora_membros`/`obra_membros` pra outros usuários além do próprio bootstrap); recuperação de senha; qualquer módulo além de Obras.

## Issues

01. RLS: policy de insert em `obras`
02. Função `criar_construtora` (bootstrap do primeiro admin)
03. Config de Auth + middleware de sessão no Next.js
04. Telas de login e cadastro
05. Onboarding — criar minha construtora
06. Tela de Obras — listagem + criação

Ordem: 01 e 02 são schema, independentes entre si, bloqueiam 05. 03 bloqueia 04-06 (precisa de sessão funcionando). 04 bloqueia 05 (precisa estar logado pra fazer onboarding). 05 bloqueia 06 (precisa ter uma construtora antes de criar obra).

## Comments
