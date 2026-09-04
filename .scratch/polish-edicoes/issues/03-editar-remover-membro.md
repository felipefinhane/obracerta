# Editar papel e remover membro

Status: pending
Blocked by: 01

## Escopo

- `/equipe`: cada membro ganha um select de papel editável (atualiza direto ao mudar, ou com botão salvar) e um botão de excluir (`confirm()`).
- `/obras/[obraId]/equipe`: cada cliente ganha botão de excluir (sem edição de papel — só existe `cliente` nesse formulário, ticket 03 de `convite-equipe`).
- Sem trava de segurança pra impedir auto-remoção ou remover o último admin (`spec.md`, fora de escopo por ora).

## Comments
