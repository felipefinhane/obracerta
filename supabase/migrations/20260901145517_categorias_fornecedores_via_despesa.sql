-- Fecha o achado do ticket 04: usuário com acesso só via obra_membros
-- (ex. cliente) não lia categorias/fornecedores, porque a policy existente
-- exige has_construtora_access. Policy adicional (RLS combina policies do
-- mesmo comando com OR): visível também se referenciado por uma despesa de
-- obra que o usuário acessa — não abre o cadastro inteiro da construtora,
-- só os itens que aparecem nas despesas que ele já pode ver.

create policy "categorias: leitura via despesa da obra" on public.categorias
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.despesas d
      where d.categoria_id = categorias.id
        and public.has_obra_access(d.obra_id)
    )
  );

create policy "fornecedores: leitura via despesa da obra" on public.fornecedores
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.despesas d
      where d.fornecedor_id = fornecedores.id
        and public.has_obra_access(d.obra_id)
    )
  );
