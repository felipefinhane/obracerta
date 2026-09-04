# Schema: convites, RPC convidar_membro, trigger, views de leitura

Status: pending

## Contexto

Ver `spec.md` — decisão de produto e desenho técnico já registrados ali, não precisa reabrir.

## Escopo

- Tabela `convites` (id, construtora_id, obra_id nullable, email, papel, criado_por, criado_em, aceito_em nullable). RLS: só `select` pra quem tem `has_construtora_access(construtora_id)` — sem policy de insert/update pra `authenticated`, escrita só via a função abaixo.
- Função `convidar_membro(p_email text, p_papel text, p_obra_id uuid default null) returns text` (`security definer`, mesmo padrão de `criar_construtora`):
  - Deriva a construtora do próprio chamador (`select construtora_id from construtora_membros where user_id = auth.uid() limit 1`) — assume que cada usuário pertence a uma construtora só, mesma premissa do resto do app.
  - Se `p_obra_id` for null: exige `has_construtora_access`, papel restrito a `admin|engenheiro|financeiro`.
  - Se `p_obra_id` vier preenchido: exige `has_obra_write_access(p_obra_id)`, papel restrito a `cliente|engenheiro|financeiro`.
  - Busca `auth.users` por e-mail (case-insensitive). Achou: insere/atualiza (`on conflict do update papel`) direto em `construtora_membros` ou `obra_membros`, retorna `'adicionado'`. Não achou: insere em `convites`, retorna `'convite_pendente'`.
- Trigger `after insert on auth.users` chamando `aplicar_convites_pendentes()` (`security definer`): aplica todo convite pendente com o e-mail que acabou de se cadastrar, marca `aceito_em`.
- Views `membros_construtora_com_email` e `membros_obra_com_email` (sem `security_invoker` — mesmo truque do `orcado_vs_realizado`, rodam com privilégio de dono pra ler `auth.users`, mas replicam o filtro de acesso no `where`).

## Comments
