# Schema — núcleo de acesso (construtoras, obras, membros) + funções RLS auxiliares

Status: done (leitura) — escrita fica pra depois, ver comentário
Blocked by: 02

## Contexto

Todo o resto do schema (tickets 04-07) depende das funções RLS auxiliares definidas aqui — é o que resolve o isolamento em dois níveis (construtora como limite de tenant, obra como acesso fino). Ver `docs/modelo-dados.md` seção "Núcleo: obra e acesso" e `CONTEXT.md` para o vocabulário (Construtora, Obra).

## Escopo

- Tabelas: `construtoras`, `obras`, `construtora_membros`, `obra_membros` — schema exato em `docs/modelo-dados.md`.
- Funções SQL auxiliares centralizadas `has_obra_access(obra_id)` e `has_construtora_access(construtora_id)` (decidido em `planejamento.md` §7 — evita subquery duplicada por tabela).
- Políticas RLS em todas as quatro tabelas usando essas funções.
- Regra de acesso: usuário enxerga a obra se tem linha em `construtora_membros` para a `construtora_id` da obra, **ou** linha em `obra_membros` específica pra aquela obra (ver `modelo-dados.md` pra lógica completa, incluindo a nota de que `obra_membros.papel = cliente` só faz sentido pelo segundo caminho).

## Fora de escopo

Fluxo de convite/onboarding de membro (ainda não desenhado — sinalizar se aparecer como bloqueio real quando a UI entrar em pauta).

## Comments

- Migration `supabase/migrations/20260901143025_nucleo_acesso.sql`: as quatro tabelas, `has_construtora_access`/`has_obra_access` (`security definer`, centralizadas), RLS habilitada, policies de **leitura** nas quatro tabelas.
- Testado contra o Supabase local (`supabase db reset` limpo, sem erro de SQL) com dois usuários reais criados via admin API do GoTrue: um admin de construtora e um cliente restrito a uma obra só. Confirmado por simulação de sessão (`set role authenticated` + `request.jwt.claims`):
  - Admin (linha em `construtora_membros`) vê as duas obras da construtora.
  - Cliente (só linha em `obra_membros` numa delas) vê **só** essa obra — não vaza a outra.
  - Sem sessão (`role anon`) não vê nenhuma.
- **Deliberadamente fora desta ticket**: policies de `insert`/`update`/`delete` nas quatro tabelas. `docs/modelo-dados.md` só especifica a regra de *leitura* ("Como a RLS decide acesso a uma obra") — quem pode criar uma obra, convidar um membro, ou o bootstrap do primeiro admin de uma construtora nova (problema clássico de ovo-e-galinha de RLS: o primeiro admin não tem acesso ainda pra poder inserir a própria linha em `construtora_membros`) não foram desenhados em nenhuma sessão de grilling. Até isso ser decidido, escrita nessas tabelas só via `service_role` (bypassa RLS). Vale um ticket próprio quando a UI de equipe/onboarding entrar em pauta.


