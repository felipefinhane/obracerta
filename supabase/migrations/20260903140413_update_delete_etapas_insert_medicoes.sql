-- Ticket .scratch/planejamento-etapas/issues/01
-- Mesmo gap já visto e fechado nos três efforts anteriores: etapas só tinha
-- select (fundacao-tecnica/05) e insert (despesas-recibo/01) — falta
-- update/delete pra editar/excluir. medicoes só tinha select — falta insert.

create policy "etapas: atualização por quem não é cliente" on public.etapas
  for update
  to authenticated
  using (public.has_obra_write_access(obra_id))
  with check (public.has_obra_write_access(obra_id));

create policy "etapas: exclusão por quem não é cliente" on public.etapas
  for delete
  to authenticated
  using (public.has_obra_write_access(obra_id));

-- medicoes não tem obra_id direto — via etapas, mesmo padrão de
-- despesa_itens/recibos (tabelas sem obra_id próprio).
create policy "medicoes: escrita por quem não é cliente" on public.medicoes
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.etapas e
      where e.id = medicoes.etapa_id
        and public.has_obra_write_access(e.obra_id)
    )
  );
