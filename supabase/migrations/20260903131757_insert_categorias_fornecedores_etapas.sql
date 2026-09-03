-- Ticket .scratch/despesas-recibo/issues/01
-- Mesmo gap fechado em 20260901154315 (despesas/recibos/diário) e
-- 20260901160323 (obras): só existia policy de select nessas três tabelas —
-- nenhum usuário autenticado conseguia criar categoria/fornecedor/etapa.

create policy "categorias: escrita por membro da construtora" on public.categorias
  for insert
  to authenticated
  with check (public.has_construtora_access(construtora_id));

create policy "fornecedores: escrita por membro da construtora" on public.fornecedores
  for insert
  to authenticated
  with check (public.has_construtora_access(construtora_id));

-- etapas é por obra, não por construtora — mesmo padrão de has_obra_write_access
-- já usado em despesas (cliente não cria etapa).
create policy "etapas: escrita por quem não é cliente" on public.etapas
  for insert
  to authenticated
  with check (public.has_obra_write_access(obra_id));
