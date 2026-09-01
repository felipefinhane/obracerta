# Setup Supabase (CLI local via Docker + projeto hospedado)

Status: done
Blocked by: nenhuma

## Contexto

Schema e RLS são desenvolvidos localmente antes de subir pro projeto hospedado (decidido em `planejamento.md` §7).

## Escopo

- Supabase CLI instalado, projeto local rodando via Docker.
- Projeto hospedado criado no tier **Supabase Free** (`planejamento.md` §8 — atenção: pausa após 1 semana sem uso).
- `supabase-js` configurado no Next.js (client browser + server), sem ORM (ADR 0001).
- Fluxo de migration: schema versionado como SQL puro via Supabase CLI (ADR 0001) — confirmar o comando/processo de `db push`/`migration up` do local pro hospedado.

## Fora de escopo

Qualquer tabela (tickets 03-07), Auth/fluxo de convite de membro (avaliar se precisa de ticket próprio quando a UI de equipe entrar em pauta).

## Comments

- Supabase CLI instalada como devDependency (`pnpm add -D supabase`, v2.116.0) — evita depender de instalação global.
- `pnpm exec supabase init` rodado — gerou `supabase/config.toml` e `supabase/.gitignore`. Ainda sem migrations (entra no ticket 03).
- Stack local via Docker validado: `pnpm exec supabase start` sobe limpo (Postgres, Auth, Storage, Studio em `http://127.0.0.1:54323` etc.) e `pnpm exec supabase stop` para. Não precisa de login nem de projeto hospedado pra isso.
- `@supabase/supabase-js` + `@supabase/ssr` instalados. Clients criados em `src/lib/supabase/client.ts` (browser) e `src/lib/supabase/server.ts` (Server Components/Route Handlers/Server Actions) — sem ORM, RLS como fonte de verdade (ADR 0001).
- `.env.local` criado apontando pro Supabase local, com as chaves fixas de dev que o próprio `supabase start` imprime (não são segredo real — mudam quando o projeto hospedado existir).
- `pnpm lint` e `pnpm build` passam limpos com os clients no lugar.
- Projeto hospedado criado pelo usuário (tier Free, `vsowiqfswpmlwvlvkhyh`) e linkado via `supabase link --project-ref` (usando um Personal Access Token gerado no dashboard — **token foi colado na conversa, o usuário vai revogar e gerar um novo por precaução**).
- `.env.local` atualizado com as chaves reais do projeto hospedado (par legacy JWT anon/service_role — as novas `sb_publishable_`/`sb_secret_` funcionam mas o CLI mascara o valor do secret na saída, então ficamos com o par legacy que vem completo). Local Docker continua disponível, comentado no mesmo arquivo pra trocar rápido.
- `supabase db push` rodado — migration do ticket 03 aplicada no projeto hospedado também, não só local. Testado via REST direto (`curl .../rest/v1/obras` com a anon key): tabela existe, RLS ativa, retorna `[]` sem sessão — igual ao comportamento validado localmente.
- `docker` já está disponível no ambiente — `pnpm exec supabase start` sobe o stack local quando precisar (ex. pra testar novas migrations antes de dar `db push`).
