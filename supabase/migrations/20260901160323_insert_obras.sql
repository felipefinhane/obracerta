-- Ticket .scratch/auth-bootstrap-obras/issues/01
-- Criar obra é uma ação de nível construtora — não tem obra ainda pra
-- checar has_obra_access contra, então usa has_construtora_access (mesmo
-- padrão de categorias/fornecedores).

create policy "obras: escrita por membro da construtora" on public.obras
  for insert
  to authenticated
  with check (public.has_construtora_access(construtora_id));
