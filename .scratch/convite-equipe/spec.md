# Convite de membros (equipe e cliente)

Status: em andamento

Sexto effort de UI, fechando o gap mais antigo do projeto: anotado desde `fundacao-tecnica`/03 ("Fluxo de convite/onboarding de membro ainda não desenhado") e citado como fora de escopo em `auth-bootstrap-obras` — até agora só o próprio bootstrap (via `criar_construtora`) conseguia entrar numa construtora. Sem isso, o sistema só serve pra uma pessoa (mesmo com 4 papéis modelados — `docs/mvp.md` §2.7).

## Decisão de produto (registrada, não fica em aberto)

Convite **sem e-mail de convite**: o admin digita o e-mail de alguém, e:
- Se essa pessoa **já tem conta** (já passou por `/cadastro`), ganha acesso na hora.
- Se **ainda não tem conta**, fica um convite pendente — assim que ela se cadastrar com esse mesmo e-mail, o acesso é aplicado automaticamente (sem precisar convite ativo, sem depender de e-mail transacional).

Motivo: Supabase Free tem limite baixo de envio de e-mail (mesmo argumento que já tinha descartado magic link, `docs/mvp.md` §2). Convite por e-mail de verdade fica como opção futura, não removida, só adiada.

## Desenho técnico

- Tabela `convites` (email, papel, construtora_id, obra_id nullable, criado_por) — fila de convites ainda não aplicados.
- Função `convidar_membro(p_email, p_papel, p_obra_id default null)`, `security definer` (mesmo padrão de `criar_construtora`): se o e-mail já existe em `auth.users` (consulta só possível dentro de uma função com privilégio elevado — nunca exposto ao client), insere direto em `construtora_membros`/`obra_membros`; senão, grava um convite pendente.
- Trigger em `auth.users` (`after insert`) aplica convites pendentes automaticamente quando alguém se cadastra com e-mail que já tinha convite — sem cron, sem worker, só o INSERT do próprio cadastro dispara.
- Duas views (mesmo truque do `orcado_vs_realizado`: sem `security_invoker`, rodam com privilégio do dono pra poder ler `auth.users`, mas replicam o filtro de RLS no `where` com `has_construtora_access`/`has_obra_access`) pra listar membros com e-mail — não dá pra expor `auth.users` direto pro client.

## Escopo

- Convidar pra construtora (papéis `admin`/`engenheiro`/`financeiro` — acesso automático a todas as obras).
- Convidar cliente pra uma obra específica (papel `cliente`, só aquela obra).
- Listar membros atuais + convites pendentes, nos dois níveis.

## Fora de escopo

- Convite por e-mail transacional de verdade (adiado, ver decisão acima).
- Editar papel de um membro já existente, remover membro (fica pra quando aparecer necessidade real).
- Expirar/cancelar convite pendente.
- Aceitar/recusar convite pelo lado de quem recebe — é automático no cadastro, sem tela de "convites recebidos".

## Issues

01. Schema: `convites`, RPC `convidar_membro`, trigger em `auth.users`, views de leitura com e-mail
02. Equipe da construtora — convidar e listar (admin/engenheiro/financeiro)
03. Equipe da obra — convidar e listar cliente

Ordem: 01 bloqueia 02 e 03. 02 e 03 são independentes entre si.

## Comments
