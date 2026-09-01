# Scaffold Next.js (App Router) + estrutura de pastas por módulo

Status: done
Blocked by: nenhuma

## Contexto

Base do projeto. Nada de lógica de negócio aqui — só a casca que os demais tickets vão preencher.

## Escopo

- Projeto Next.js com **App Router** (decidido em `planejamento.md` §7 — sessão de grilling sobre arquitetura técnica).
- Estrutura de pastas por domínio/módulo: `src/modules/{obras,planejamento,despesas,diario,cadastros}/`.
- Lint/format básico, `.env.example` com as variáveis que os próximos tickets vão precisar (Supabase URL/anon key, credenciais R2, chave da API de extração).
- Deploy inicial no Vercel Hobby (subdomínio `*.vercel.app`, sem domínio próprio — `planejamento.md` §8).

## Fora de escopo

Qualquer tela real, client Supabase configurado (ticket 02), autenticação.

## Comments

- Next.js 16.3.4 (App Router, TS, Tailwind, `src/` dir, `@/*` alias) via `create-next-app`, scaffolded fora do repo e mesclado à mão (não sobrescreveu `CLAUDE.md`/`CONTEXT.md`/`docs/`/`.scratch/`).
- Pastas `src/modules/{obras,planejamento,despesas,diario,cadastros}/` criadas (com `.gitkeep`, ainda vazias).
- `package.json` renomeado pra `obracerta`. `.env.example` criado com as variáveis que os tickets 02/08/09 vão precisar (Supabase, R2, Gemini).
- `pnpm lint` e `pnpm build` passam limpos.
- Deploy no Vercel Hobby **não feito** — exige conta/login do usuário; fica como passo manual (ver comentário no ticket 02).
