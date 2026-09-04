# Equipe da construtora — convidar e listar

Status: pending
Blocked by: 01

## Escopo

- `/equipe`: form (e-mail, papel: Admin/Engenheiro/Financeiro) chamando `convidar_membro` sem `obra_id`; lista de membros atuais (`membros_construtora_com_email`) e convites pendentes (`convites` onde `obra_id is null` e `aceito_em is null`).
- Link a partir do `AppHeader`, ao lado de "Cadastros".
- Mensagem clara conforme o retorno da função: "adicionado" (já tinha conta, acesso liberado na hora) vs "convite pendente" (aplica quando a pessoa se cadastrar).

## Comments
