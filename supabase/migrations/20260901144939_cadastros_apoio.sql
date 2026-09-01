-- Cadastros de apoio (ticket .scratch/fundacao-tecnica/issues/04)
-- Ver docs/modelo-dados.md ("Cadastros de apoio"). Compartilhados entre as
-- obras da mesma construtora — por isso vinculados a construtora_id, não a
-- obra_id (decidido em planejamento.md §7).

create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  construtora_id uuid not null references public.construtoras (id) on delete cascade,
  nome text not null,
  tipo text not null check (tipo in ('produto', 'servico', 'mao_de_obra')),
  categoria_pai_id uuid references public.categorias (id) on delete set null
);

create table public.fornecedores (
  id uuid primary key default gen_random_uuid(),
  construtora_id uuid not null references public.construtoras (id) on delete cascade,
  nome text not null,
  cnpj_cpf text,
  telefone text
);

create index categorias_construtora_id_idx on public.categorias (construtora_id);
create index categorias_categoria_pai_id_idx on public.categorias (categoria_pai_id);
create index fornecedores_construtora_id_idx on public.fornecedores (construtora_id);

alter table public.categorias enable row level security;
alter table public.fornecedores enable row level security;

create policy "categorias: leitura por membro da construtora" on public.categorias
  for select
  to authenticated
  using (public.has_construtora_access(construtora_id));

create policy "fornecedores: leitura por membro da construtora" on public.fornecedores
  for select
  to authenticated
  using (public.has_construtora_access(construtora_id));
