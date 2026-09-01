-- Despesas e captura de recibo (ticket .scratch/fundacao-tecnica/issues/06)
-- Ver docs/modelo-dados.md ("Despesas e captura de recibo"), ADR 0002
-- (revisado) e ADR 0003. CONTEXT.md tem o vocabulário: Despesa, Origem,
-- Lançamento provisório, Recibo, Status de processamento.

create table public.despesas (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras (id) on delete cascade,
  etapa_id uuid references public.etapas (id) on delete set null,
  categoria_id uuid references public.categorias (id) on delete set null,
  fornecedor_id uuid references public.fornecedores (id) on delete set null,
  valor numeric,
  data_despesa date,
  descricao text,
  origem text not null check (origem in ('foto', 'manual')),
  status text not null default 'pendente_confirmacao' check (status in ('pendente_confirmacao', 'confirmada')),
  forma_pagamento text,
  criado_por uuid references auth.users (id),
  criado_em timestamptz not null default now(),
  confirmado_em timestamptz
);

create table public.despesa_itens (
  id uuid primary key default gen_random_uuid(),
  despesa_id uuid not null references public.despesas (id) on delete cascade,
  descricao text,
  quantidade numeric,
  valor_unitario numeric,
  valor_total numeric
);

create table public.recibos (
  id uuid primary key default gen_random_uuid(),
  -- unique: 1 recibo por despesa, sem suporte a múltiplas fotos no MVP
  -- (sessão de grilling sobre armazenamento de arquivo).
  despesa_id uuid not null unique references public.despesas (id) on delete cascade,
  -- chave do objeto no Cloudflare R2 (ADR 0003), não URL resolvível direto;
  -- preenchida já no INSERT (caminho determinístico), não é flag de upload.
  arquivo_url text not null,
  tipo_documento text check (tipo_documento in ('nfe', 'recibo_informal')),
  chave_acesso_nfe text,
  dados_extraidos jsonb,
  confianca_extracao numeric,
  -- única fonte de verdade do estado do upload/extração (ADR 0002 revisado).
  status_processamento text not null default 'aguardando_upload'
    check (status_processamento in ('aguardando_upload', 'pendente', 'processado', 'falhou')),
  criado_em timestamptz not null default now()
);

create index despesas_obra_id_idx on public.despesas (obra_id);
create index despesas_etapa_id_idx on public.despesas (etapa_id);
create index despesa_itens_despesa_id_idx on public.despesa_itens (despesa_id);

alter table public.despesas enable row level security;
alter table public.despesa_itens enable row level security;
alter table public.recibos enable row level security;

create policy "despesas: leitura por membro da obra" on public.despesas
  for select
  to authenticated
  using (public.has_obra_access(obra_id));

create policy "despesa_itens: leitura por membro da obra" on public.despesa_itens
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.despesas d
      where d.id = despesa_itens.despesa_id
        and public.has_obra_access(d.obra_id)
    )
  );

create policy "recibos: leitura por membro da obra" on public.recibos
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.despesas d
      where d.id = recibos.despesa_id
        and public.has_obra_access(d.obra_id)
    )
  );

-- "Orçado vs. Realizado" (docs/modelo-dados.md "Planejamento") — não é
-- tabela, soma despesas confirmadas por etapa comparado com o planejado.
-- security_invoker: roda com as permissões de quem consulta a view, não do
-- dono dela — senão a RLS de etapas/despesas seria contornada.
create view public.orcado_vs_realizado
with (security_invoker = true) as
select
  e.id as etapa_id,
  e.obra_id,
  e.nome as etapa_nome,
  e.valor_planejado,
  coalesce(sum(d.valor) filter (where d.status = 'confirmada'), 0) as valor_realizado
from public.etapas e
left join public.despesas d on d.etapa_id = e.id
group by e.id, e.obra_id, e.nome, e.valor_planejado;
