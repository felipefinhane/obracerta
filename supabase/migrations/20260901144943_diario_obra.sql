-- Diário de obra (ticket .scratch/fundacao-tecnica/issues/07)
-- Ver docs/modelo-dados.md ("Diário de obra"). tipo só aceita 'foto' no MVP
-- — vídeo é fase 2 (docs/mvp.md, ADR 0003).

create table public.diario_entradas (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras (id) on delete cascade,
  etapa_id uuid references public.etapas (id) on delete set null,
  data date not null,
  descricao text,
  clima text,
  efetivo_presente int,
  ocorrencias text,
  criado_por uuid references auth.users (id),
  criado_em timestamptz not null default now()
);

create table public.diario_midia (
  id uuid primary key default gen_random_uuid(),
  diario_entrada_id uuid not null references public.diario_entradas (id) on delete cascade,
  -- chave do objeto no Cloudflare R2 (ADR 0003), mesmo padrão de recibos.arquivo_url.
  arquivo_url text not null,
  tipo text not null default 'foto' check (tipo in ('foto'))
);

create index diario_entradas_obra_id_idx on public.diario_entradas (obra_id);
create index diario_midia_diario_entrada_id_idx on public.diario_midia (diario_entrada_id);

alter table public.diario_entradas enable row level security;
alter table public.diario_midia enable row level security;

create policy "diario_entradas: leitura por membro da obra" on public.diario_entradas
  for select
  to authenticated
  using (public.has_obra_access(obra_id));

create policy "diario_midia: leitura por membro da obra" on public.diario_midia
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.diario_entradas de
      where de.id = diario_midia.diario_entrada_id
        and public.has_obra_access(de.obra_id)
    )
  );
