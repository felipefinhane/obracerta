-- Fecha um gap descoberto testando os tickets 08/09: sem policy de insert,
-- nenhum usuário autenticado conseguia criar despesa/recibo — só service_role.
-- docs/mvp.md §2.7 já define que 'cliente' é só leitura; os demais papéis
-- (admin, engenheiro, financeiro) têm escrita — has_obra_access() cobre
-- cliente também (é o ponto dela), então não serve pra policy de escrita.

create or replace function public.has_obra_write_access(target_obra_id uuid)
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
            and om.papel <> 'cliente'
        )
      )
  );
$$;

comment on function public.has_obra_write_access(uuid) is
  'Como has_obra_access, mas exclui obra_membros.papel = cliente — cliente é leitura (docs/mvp.md §2.7).';

-- despesas: criar (foto ou manual) e editar (confirmação preenche campos)
create policy "despesas: escrita por quem não é cliente" on public.despesas
  for insert
  to authenticated
  with check (public.has_obra_write_access(obra_id));

create policy "despesas: atualização por quem não é cliente" on public.despesas
  for update
  to authenticated
  using (public.has_obra_write_access(obra_id))
  with check (public.has_obra_write_access(obra_id));

create policy "despesa_itens: escrita por quem não é cliente" on public.despesa_itens
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.despesas d
      where d.id = despesa_itens.despesa_id
        and public.has_obra_write_access(d.obra_id)
    )
  );

-- recibos: insert no momento da foto (antes do upload — ADR 0002/0003);
-- update pro cliente confirmar upload (status -> pendente) e pro pipeline
-- de extração preencher dados_extraidos/status_processamento.
create policy "recibos: escrita por quem não é cliente" on public.recibos
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.despesas d
      where d.id = recibos.despesa_id
        and public.has_obra_write_access(d.obra_id)
    )
  );

create policy "recibos: atualização por quem não é cliente" on public.recibos
  for update
  to authenticated
  using (
    exists (
      select 1 from public.despesas d
      where d.id = recibos.despesa_id
        and public.has_obra_write_access(d.obra_id)
    )
  )
  with check (
    exists (
      select 1 from public.despesas d
      where d.id = recibos.despesa_id
        and public.has_obra_write_access(d.obra_id)
    )
  );

create policy "diario_entradas: escrita por quem não é cliente" on public.diario_entradas
  for insert
  to authenticated
  with check (public.has_obra_write_access(obra_id));

create policy "diario_midia: escrita por quem não é cliente" on public.diario_midia
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.diario_entradas de
      where de.id = diario_midia.diario_entrada_id
        and public.has_obra_write_access(de.obra_id)
    )
  );
