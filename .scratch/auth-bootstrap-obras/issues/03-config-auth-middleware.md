# Config de Auth + middleware de sessão no Next.js

Status: open
Blocked by: nenhuma

## Contexto

Email + senha (decidido). Precisa decidir/configurar confirmação de email — Supabase Free tem limite baixo de envio (ver `planejamento.md` §8), então autoconfirmar (sem exigir clique em link de confirmação) pode valer a pena no MVP pra não depender de entrega de email funcionando bem. Não decidido em nenhuma sessão de grilling — decidir ao pegar esta ticket.

## Escopo

- Config do Supabase Auth: email+senha habilitado; decidir autoconfirmação de email (ver nota acima).
- Middleware do Next.js (`src/middleware.ts`) usando `@supabase/ssr`: renova sessão a cada request, redireciona pra `/login` se não autenticado (exceto rotas públicas: `/login`, `/cadastro`).
- Testar: sessão persiste entre requests, expira/renova corretamente, redirecionamento funciona.

## Comments
