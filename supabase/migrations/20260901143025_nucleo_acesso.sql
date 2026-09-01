-- Núcleo: obra e acesso (ticket .scratch/fundacao-tecnica/issues/03)
-- Ver docs/modelo-dados.md ("Núcleo: obra e acesso") e planejamento.md §7.
--
-- Isolamento em dois níveis: construtora é o limite principal de tenant;
-- obra_membros dá acesso fino a uma obra específica (uso típico: cliente).
--
-- Esta migration cobre schema + RLS de LEITURA (select), que é o que
-- docs/modelo-dados.md especifica ("Como a RLS decide acesso a uma obra").
-- Policies de escrita (quem cria uma obra, quem convida um membro, o
-- bootstrap de "primeiro admin de uma construtora nova") NÃO estão
-- desenhadas ainda — ficam para quando a UI de equipe/onboarding entrar
-- em pauta. Até lá, escrita nessas quatro tabelas só via service role.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------

create table public.construtoras (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text
);

create table public.obras (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  endereco text,
  cliente_nome text,
  construtora_id uuid not null references public.construtoras (id) on delete cascade,
  valor_planejado_total numeric,
  data_inicio_prevista date,
  data_fim_prevista date,
  criado_em timestamptz not null default now()
);

create table public.construtora_membros (
  id uuid primary key default gen_random_uuid(),
  construtora_id uuid not null references public.construtoras (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  papel text not null check (papel in ('admin', 'engenheiro', 'financeiro')),
  unique (construtora_id, user_id)
);

create table public.obra_membros (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  -- 'cliente' só faz sentido aqui — nunca deveria ter linha em construtora_membros
  -- também (ver docs/modelo-dados.md).
  papel text not null check (papel in ('engenheiro', 'financeiro', 'cliente')),
  unique (obra_id, user_id)
);

create index obras_construtora_id_idx on public.obras (construtora_id);
create index construtora_membros_construtora_id_idx on public.construtora_membros (construtora_id);
create index construtora_membros_user_id_idx on public.construtora_membros (user_id);
create index obra_membros_obra_id_idx on public.obra_membros (obra_id);
create index obra_membros_user_id_idx on public.obra_membros (user_id);

-- ---------------------------------------------------------------------
-- Funções RLS auxiliares centralizadas (planejamento.md §7 — evita
-- subquery duplicada por tabela)
-- ---------------------------------------------------------------------

create or replace function public.has_construtora_access(target_construtora_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.construtora_membros cm
    where cm.construtora_id = target_construtora_id
      and cm.user_id = auth.uid()
  );
$$;

comment on function public.has_construtora_access(uuid) is
  'True se o usuário logado tem uma linha em construtora_membros para essa construtora — acesso automático a todas as obras dela.';

create or replace function public.has_obra_access(target_obra_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.obras o
    where o.id = target_obra_id
      and (
        public.has_construtora_access(o.construtora_id)
        or exists (
          select 1
          from public.obra_membros om
          where om.obra_id = target_obra_id
            and om.user_id = auth.uid()
        )
      )
  );
$$;

comment on function public.has_obra_access(uuid) is
  'True se o usuário logado enxerga essa obra: via construtora_membros (acesso a todas as obras da construtora) OU via obra_membros (acesso restrito a essa obra só, ex. cliente).';

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------

alter table public.construtoras enable row level security;
alter table public.obras enable row level security;
alter table public.construtora_membros enable row level security;
alter table public.obra_membros enable row level security;

create policy "construtoras: leitura por membro" on public.construtoras
  for select
  to authenticated
  using (public.has_construtora_access(id));

create policy "obras: leitura por membro (construtora ou obra)" on public.obras
  for select
  to authenticated
  using (public.has_obra_access(id));

create policy "construtora_membros: leitura por membro" on public.construtora_membros
  for select
  to authenticated
  using (public.has_construtora_access(construtora_id));

create policy "obra_membros: leitura por membro" on public.obra_membros
  for select
  to authenticated
  using (public.has_obra_access(obra_id));
