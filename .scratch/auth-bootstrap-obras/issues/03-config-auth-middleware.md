# Config de Auth + middleware de sessão no Next.js

Status: done
Blocked by: nenhuma

## Contexto

Email + senha (decidido). Precisa decidir/configurar confirmação de email — Supabase Free tem limite baixo de envio (ver `planejamento.md` §8), então autoconfirmar (sem exigir clique em link de confirmação) pode valer a pena no MVP pra não depender de entrega de email funcionando bem. Não decidido em nenhuma sessão de grilling — decidir ao pegar esta ticket.

## Escopo

- Config do Supabase Auth: email+senha habilitado; decidir autoconfirmação de email (ver nota acima).
- Middleware do Next.js (`src/middleware.ts`) usando `@supabase/ssr`: renova sessão a cada request, redireciona pra `/login` se não autenticado (exceto rotas públicas: `/login`, `/cadastro`).
- Testar: sessão persiste entre requests, expira/renova corretamente, redirecionamento funciona.

## Comments

- Decisão tomada: **sem confirmação de email** (`enable_confirmations = false`) — evita depender de entrega de email funcionando bem no tier gratuito. Sincronizado pro hospedado via `supabase config push` (que também desligou MFA/TOTP, efeito colateral do template padrão do CLI, sem uso planejado no MVP mesmo).
- `src/lib/supabase/middleware.ts` (`updateSession`) + `src/proxy.ts` — Next.js 16 depreciou o nome `middleware.ts`/`middleware()` em favor de `proxy.ts`/`proxy()` (rodei o codemod oficial, `npx @next/codemod middleware-to-proxy`). Rotas públicas: `/login`, `/cadastro`.
- Usa `supabase.auth.getUser()` (não `getSession()`) — valida contra o servidor de auth em vez de confiar no cookie.
- Testado com `pnpm dev` de verdade: `GET /` sem sessão redireciona (307) pra `/login`; `/login` não entra em loop por já ser rota pública.
