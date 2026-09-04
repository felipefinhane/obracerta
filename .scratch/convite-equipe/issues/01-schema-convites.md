# Schema: convites, RPC convidar_membro, trigger, views de leitura

Status: done

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

- Migration `supabase/migrations/20260904124125_convites_membros.sql`: tabela `convites`, RPC `convidar_membro`, trigger `on_auth_user_created_aplicar_convites` em `auth.users`, views `membros_construtora_com_email`/`membros_obra_com_email`.
- **Testado de ponta a ponta de verdade contra o hospedado**, criando dois usuários reais de teste via admin API (`colega.teste.qa@obracerta-teste.dev`, `cliente.pendente.qa@obracerta-teste.dev`) e usando a sessão real do admin (`felipefinhane@gmail.com`):
  - `convidar_membro` com e-mail que já tinha conta → retornou `"adicionado"`, linha criada em `construtora_membros` na hora, visível via `membros_construtora_com_email` com o e-mail resolvido corretamente.
  - `convidar_membro` com e-mail sem conta (papel `cliente`, `p_obra_id` de uma obra real) → retornou `"convite_pendente"`, linha gravada em `convites`.
  - Simulei o cadastro dessa segunda pessoa criando o `auth.users` com o mesmo e-mail (via admin API, dispara o trigger de verdade, não simulação) → `obra_membros` ganhou a linha automaticamente com o papel certo, e `convites.aceito_em` foi preenchido. Visível via `membros_obra_com_email`.
  - Login como esse cliente recém-criado confirmou acesso de leitura à obra (via `obra_membros`) e bloqueio de escrita em `despesas` (RLS de cliente-é-leitura, já testada antes, se comportou igual pra um membro chegado por convite).
  - Todo dado de teste (dois usuários + convite já aceito) apagado ao final — `on delete cascade` limpou `construtora_membros`/`obra_membros` sozinho ao deletar os usuários; o convite (sem FK pro usuário, só e-mail em texto) precisou de `DELETE` manual.
