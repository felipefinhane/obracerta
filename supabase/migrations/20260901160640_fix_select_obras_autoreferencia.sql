-- Bug real descoberto testando o ticket 01 de auth-bootstrap-obras: um
-- INSERT ... RETURNING em obras (o que o supabase-js faz por padrão em todo
-- .insert().select()) falhava com "new row violates row-level security
-- policy for table obras", mesmo com has_construtora_access() retornando
-- true pro usuário.
--
-- Causa: a policy de select de obras usava has_obra_access(id), que
-- internamente reconsulta a própria tabela obras (`select ... from
-- public.obras o where o.id = target_obra_id ...`) pra descobrir
-- construtora_id. Isso cria uma auto-referência — a policy de select de
-- obras dispara uma nova consulta a obras pra se avaliar — que quebra
-- especificamente na checagem implícita de RETURNING logo após um INSERT
-- (não em selects avulsos, por isso os testes anteriores, que sempre
-- inseriam via service_role, nunca pegaram isso).
--
-- Correção: a policy de obras passa a usar as colunas da própria linha
-- (id, construtora_id) direto, sem reconsultar obras. has_obra_access()
-- continua igual e continua correta pra uso em outras tabelas (etapas,
-- despesas, diario_entradas, etc.), que checam acesso a um obra_id que
-- referenciam — não têm esse problema de auto-referência.

drop policy "obras: leitura por membro (construtora ou obra)" on public.obras;

create policy "obras: leitura por membro (construtora ou obra)" on public.obras
  for select
  to authenticated
  using (
    public.has_construtora_access(construtora_id)
    or exists (
      select 1
      from public.obra_membros om
      where om.obra_id = obras.id
        and om.user_id = auth.uid()
    )
  );
