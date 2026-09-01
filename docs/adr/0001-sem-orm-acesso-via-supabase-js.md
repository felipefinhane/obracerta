---
Status: accepted
---

# Sem ORM — acesso a dados via `supabase-js` para preservar RLS como fonte de verdade

O modelo de permissões do ObraCerta depende inteiramente de RLS (Row Level Security) no Postgres — a construtora é o limite de tenant, e o acesso fino por obra é resolvido no banco via `has_construtora_access` / `has_obra_access`, não na camada de aplicação. Isso só funciona se cada query carregar o contexto de autenticação do usuário logado (o Postgres avalia a policy usando o JWT da sessão).

Decidimos **não usar um ORM** (Prisma ou Drizzle) como camada de query. Um ORM tipicamente conecta ao banco por uma connection string única (pooler), perdendo o contexto por-request do usuário — reimplementar isso manualmente (`set_config` do JWT a cada query) é complexidade extra pra rejeitar algo que a RLS já resolve de graça via `supabase-js`, que propaga a sessão do usuário automaticamente em cada chamada.

Schema é versionado como migrations SQL puras via Supabase CLI, sem camada de schema-as-code por cima.

## Considered Options

- **Drizzle ORM**: schema como código TypeScript e tipos gerados automaticamente — atraente, mas como client de query reintroduz o problema de contexto de RLS por request. Poderia ser adotado no futuro só como gerador de tipos (sem ser o client de query), sem custo de migração do que existe.
- **Prisma**: ecossistema mais popular em apps Next.js, mas o modelo de conexão via pooler bypassa RLS por padrão.

## Exceção conhecida

O upload/leitura de arquivo via Cloudflare R2 (ADR 0003) não passa por RLS — R2 não tem esse conceito. A chamada ao R2 em si é uma exceção; a autorização de *quem pode pedir a URL*, porém, continua sendo a RLS de verdade (o Route Handler busca a linha via client autenticado da sessão do usuário — se a `select` policy deixar passar, o acesso está provado). É a única exceção ao "RLS como fonte de verdade" descrito acima, e mesmo ela reusa a RLS em vez de reimplementar a regra em JS.
