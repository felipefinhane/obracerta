-- Ticket .scratch/recebimentos-conciliacao/issues/01
-- Fecha o desenho que faltava do módulo de fase 2 descrito em
-- docs/mvp.md §2.5 (nunca tinha seção em modelo-dados.md nem ADR).
-- Decisões de produto em .scratch/recebimentos-conciliacao/spec.md:
-- saídas = despesas já existentes (sem tabela nova); recebimentos só
-- registra o que já entrou (sem previsão); conciliação só CSV, sem
-- matching automático.

create table public.recebimentos (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras (id) on delete cascade,
  etapa_id uuid references public.etapas (id) on delete set null,
  tipo text not null check (tipo in ('parcela_financiamento', 'aporte_cliente')),
  valor numeric not null,
  data date not null,
  descricao text,
  criado_por uuid references auth.users (id),
  criado_em timestamptz not null default now()
);

create index recebimentos_obra_id_idx on public.recebimentos (obra_id);

create table public.transacoes_bancarias (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras (id) on delete cascade,
  data date not null,
  descricao text,
  -- padrão de extrato bancário: positivo = entrada, negativo = saída.
  valor numeric not null,
  despesa_id uuid references public.despesas (id) on delete set null,
  recebimento_id uuid references public.recebimentos (id) on delete set null,
  criado_em timestamptz not null default now(),
  constraint transacoes_bancarias_vinculo_unico check (despesa_id is null or recebimento_id is null)
);

create index transacoes_bancarias_obra_id_idx on public.transacoes_bancarias (obra_id);

alter table public.recebimentos enable row level security;
alter table public.transacoes_bancarias enable row level security;

create policy "recebimentos: leitura por membro da obra" on public.recebimentos
  for select
  to authenticated
  using (public.has_obra_access(obra_id));

create policy "recebimentos: escrita por quem não é cliente" on public.recebimentos
  for insert
  to authenticated
  with check (public.has_obra_write_access(obra_id));

create policy "transacoes_bancarias: leitura por membro da obra" on public.transacoes_bancarias
  for select
  to authenticated
  using (public.has_obra_access(obra_id));

create policy "transacoes_bancarias: escrita por quem não é cliente" on public.transacoes_bancarias
  for insert
  to authenticated
  with check (public.has_obra_write_access(obra_id));

-- update só pra setar o vínculo (despesa_id/recebimento_id) depois de
-- importado — não tem tela de editar data/valor/descrição da transação.
create policy "transacoes_bancarias: atualização por quem não é cliente" on public.transacoes_bancarias
  for update
  to authenticated
  using (public.has_obra_write_access(obra_id))
  with check (public.has_obra_write_access(obra_id));
