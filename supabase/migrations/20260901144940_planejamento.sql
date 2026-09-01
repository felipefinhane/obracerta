-- Planejamento (ticket .scratch/fundacao-tecnica/issues/05)
-- Ver docs/modelo-dados.md ("Planejamento"). Sem fluxo de aprovação formal
-- na v1 (docs/mvp.md).

create table public.etapas (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras (id) on delete cascade,
  nome text not null,
  descricao text,
  valor_planejado numeric,
  peso_percentual numeric,
  ordem int,
  data_inicio_prevista date,
  data_fim_prevista date
);

create table public.medicoes (
  id uuid primary key default gen_random_uuid(),
  etapa_id uuid not null references public.etapas (id) on delete cascade,
  data date not null,
  percentual_concluido numeric not null,
  observacao text,
  criado_por uuid references auth.users (id)
);

create index etapas_obra_id_idx on public.etapas (obra_id);
create index medicoes_etapa_id_idx on public.medicoes (etapa_id);

alter table public.etapas enable row level security;
alter table public.medicoes enable row level security;

create policy "etapas: leitura por membro da obra" on public.etapas
  for select
  to authenticated
  using (public.has_obra_access(obra_id));

-- medicoes não tem obra_id direto (só via etapas) — sem função auxiliar
-- própria, join explícito contra etapas reusando has_obra_access.
create policy "medicoes: leitura por membro da obra" on public.medicoes
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.etapas e
      where e.id = medicoes.etapa_id
        and public.has_obra_access(e.obra_id)
    )
  );
