-- Ticket .scratch/convite-equipe/issues/01
-- Fecha o gap anotado desde fundacao-tecnica/03 ("fluxo de convite/onboarding
-- de membro ainda não desenhado"). Decisão de produto em spec.md: sem
-- e-mail transacional — admin adiciona por e-mail; se a pessoa ainda não
-- tem conta, fica um convite pendente aplicado no cadastro dela.

create table public.convites (
  id uuid primary key default gen_random_uuid(),
  construtora_id uuid not null references public.construtoras (id) on delete cascade,
  -- null = convite pra construtora (admin/engenheiro/financeiro, acesso a
  -- todas as obras); preenchido = convite pra uma obra só (cliente).
  obra_id uuid references public.obras (id) on delete cascade,
  email text not null,
  papel text not null,
  criado_por uuid references auth.users (id),
  criado_em timestamptz not null default now(),
  aceito_em timestamptz
);

create index convites_email_idx on public.convites (lower(email));

alter table public.convites enable row level security;

create policy "convites: leitura por membro da construtora" on public.convites
  for select
  to authenticated
  using (public.has_construtora_access(construtora_id));

-- Sem policy de insert/update pra authenticated de propósito — escrita só
-- via convidar_membro() e o trigger de aplicação, ambos security definer
-- (mesmo padrão de criar_construtora, que já bypassa RLS em obras/
-- construtora_membros do mesmo jeito).

create or replace function public.convidar_membro(p_email text, p_papel text, p_obra_id uuid default null)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_construtora_id uuid;
  v_user_id uuid;
begin
  if auth.uid() is null then
    raise exception 'usuário não autenticado';
  end if;

  select construtora_id into v_construtora_id
  from public.construtora_membros
  where user_id = auth.uid()
  limit 1;

  if v_construtora_id is null then
    raise exception 'usuário não pertence a nenhuma construtora';
  end if;

  if p_obra_id is not null then
    if not public.has_obra_write_access(p_obra_id) then
      raise exception 'sem acesso de escrita a esta obra';
    end if;
    if p_papel not in ('engenheiro', 'financeiro', 'cliente') then
      raise exception 'papel inválido pra convite de obra: %', p_papel;
    end if;
  else
    if not public.has_construtora_access(v_construtora_id) then
      raise exception 'sem acesso a esta construtora';
    end if;
    if p_papel not in ('admin', 'engenheiro', 'financeiro') then
      raise exception 'papel inválido pra convite de construtora: %', p_papel;
    end if;
  end if;

  select id into v_user_id from auth.users where lower(email) = lower(p_email);

  if v_user_id is not null then
    if p_obra_id is not null then
      insert into public.obra_membros (obra_id, user_id, papel)
      values (p_obra_id, v_user_id, p_papel)
      on conflict (obra_id, user_id) do update set papel = excluded.papel;
    else
      insert into public.construtora_membros (construtora_id, user_id, papel)
      values (v_construtora_id, v_user_id, p_papel)
      on conflict (construtora_id, user_id) do update set papel = excluded.papel;
    end if;
    return 'adicionado';
  else
    insert into public.convites (construtora_id, obra_id, email, papel, criado_por)
    values (v_construtora_id, p_obra_id, lower(p_email), p_papel, auth.uid());
    return 'convite_pendente';
  end if;
end;
$$;

comment on function public.convidar_membro(text, text, uuid) is
  'Adiciona alguém por e-mail à construtora (obra_id null) ou a uma obra específica (obra_id preenchido). Se o e-mail já tem conta, dá acesso na hora; senão grava um convite pendente aplicado no cadastro (ver aplicar_convites_pendentes). Ver .scratch/convite-equipe/spec.md.';

revoke execute on function public.convidar_membro(text, text, uuid) from public;
grant execute on function public.convidar_membro(text, text, uuid) to authenticated;

create or replace function public.aplicar_convites_pendentes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_convite record;
begin
  for v_convite in
    select * from public.convites
    where lower(email) = lower(new.email) and aceito_em is null
  loop
    if v_convite.obra_id is not null then
      insert into public.obra_membros (obra_id, user_id, papel)
      values (v_convite.obra_id, new.id, v_convite.papel)
      on conflict (obra_id, user_id) do nothing;
    else
      insert into public.construtora_membros (construtora_id, user_id, papel)
      values (v_convite.construtora_id, new.id, v_convite.papel)
      on conflict (construtora_id, user_id) do nothing;
    end if;

    update public.convites set aceito_em = now() where id = v_convite.id;
  end loop;

  return new;
end;
$$;

comment on function public.aplicar_convites_pendentes() is
  'Trigger em auth.users (after insert): aplica convite(s) pendente(s) que batem com o e-mail recém-cadastrado. Ver .scratch/convite-equipe/spec.md.';

create trigger on_auth_user_created_aplicar_convites
  after insert on auth.users
  for each row execute function public.aplicar_convites_pendentes();

-- Views pra listar membro com e-mail — sem security_invoker de propósito
-- (mesmo truque do orcado_vs_realizado, fundacao-tecnica/06): rodam com
-- privilégio de dono pra poder ler auth.users (não exposto via PostgREST
-- pro client comum), mas replicam o filtro de RLS no where.

create view public.membros_construtora_com_email as
select cm.id, cm.construtora_id, cm.papel, u.email
from public.construtora_membros cm
join auth.users u on u.id = cm.user_id
where public.has_construtora_access(cm.construtora_id);

create view public.membros_obra_com_email as
select om.id, om.obra_id, om.papel, u.email
from public.obra_membros om
join auth.users u on u.id = om.user_id
where public.has_obra_access(om.obra_id);
