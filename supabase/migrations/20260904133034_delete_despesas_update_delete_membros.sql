-- Ticket .scratch/polish-edicoes/issues/01
-- despesas já tinha update sem restrição de status (permite editar despesa
-- confirmada), mas faltava delete. construtora_membros/obra_membros só
-- tinham select (leitura) e o insert que convidar_membro faz via security
-- definer (convite-equipe/01) — faltava update/delete pra editar
-- papel/remover membro pela UI.

create policy "despesas: exclusão por quem não é cliente" on public.despesas
  for delete
  to authenticated
  using (public.has_obra_write_access(obra_id));

create policy "construtora_membros: atualização por membro da construtora" on public.construtora_membros
  for update
  to authenticated
  using (public.has_construtora_access(construtora_id))
  with check (public.has_construtora_access(construtora_id));

create policy "construtora_membros: exclusão por membro da construtora" on public.construtora_membros
  for delete
  to authenticated
  using (public.has_construtora_access(construtora_id));

create policy "obra_membros: atualização por quem não é cliente" on public.obra_membros
  for update
  to authenticated
  using (public.has_obra_write_access(obra_id))
  with check (public.has_obra_write_access(obra_id));

create policy "obra_membros: exclusão por quem não é cliente" on public.obra_membros
  for delete
  to authenticated
  using (public.has_obra_write_access(obra_id));
