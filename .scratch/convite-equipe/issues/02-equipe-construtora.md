# Equipe da construtora — convidar e listar

Status: done
Blocked by: 01

## Escopo

- `/equipe`: form (e-mail, papel: Admin/Engenheiro/Financeiro) chamando `convidar_membro` sem `obra_id`; lista de membros atuais (`membros_construtora_com_email`) e convites pendentes (`convites` onde `obra_id is null` e `aceito_em is null`).
- Link a partir do `AppHeader`, ao lado de "Cadastros".
- Mensagem clara conforme o retorno da função: "adicionado" (já tinha conta, acesso liberado na hora) vs "convite pendente" (aplica quando a pessoa se cadastrar).

## Comments

- `/equipe`: lista `membros_construtora_com_email` + convites pendentes (`obra_id is null`), form de convite (e-mail + papel), mensagem de resultado via `searchParams` (`status=adicionado|convite_pendente`, mesmo padrão de `erro` do onboarding). Link no `AppHeader`.
- **Testado de ponta a ponta de verdade contra o hospedado**, incluindo o POST real do form (wire protocol do Server Action): convidei um e-mail sem conta como "engenheiro", recebi o banner de convite pendente e ele apareceu em "Convites pendentes"; depois simulei o cadastro real dessa pessoa (admin API) e confirmei que ela apareceu em "Membros" (não mais pendente) — o mesmo dado que a própria tela tinha produzido, não um caso à parte. Dado de teste apagado ao final.
