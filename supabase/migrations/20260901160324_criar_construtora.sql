-- Ticket .scratch/auth-bootstrap-obras/issues/02
-- Bootstrap: cria a construtora e a linha de admin do usuário logado numa
-- transação só. Resolve o ovo-e-galinha anotado no ticket 03 de
-- fundacao-tecnica — um usuário sem nenhuma construtora não passaria numa
-- policy de insert comum em construtora_membros (que exigiria já ter
-- acesso). security definer roda com privilégio elevado; a única checagem
-- é que auth.uid() exista (usuário autenticado) — qualquer usuário logado
-- pode criar uma construtora nova e virar admin dela, sem limite de
-- quantas (não é bloqueio pro MVP).

create or replace function public.criar_construtora(nome text, cnpj text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  nova_construtora_id uuid;
begin
  if auth.uid() is null then
    raise exception 'usuário não autenticado';
  end if;

  insert into public.construtoras (nome, cnpj)
  values (nome, cnpj)
  returning id into nova_construtora_id;

  insert into public.construtora_membros (construtora_id, user_id, papel)
  values (nova_construtora_id, auth.uid(), 'admin');

  return nova_construtora_id;
end;
$$;

comment on function public.criar_construtora(text, text) is
  'Bootstrap: cria uma construtora e o usuário logado vira admin dela, atomicamente. Ver ticket auth-bootstrap-obras/02.';

revoke execute on function public.criar_construtora(text, text) from public;
grant execute on function public.criar_construtora(text, text) to authenticated;
