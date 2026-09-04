# Editar papel e remover membro

Status: done
Blocked by: 01

## Escopo

- `/equipe`: cada membro ganha um select de papel editável (atualiza direto ao mudar, ou com botão salvar) e um botão de excluir (`confirm()`).
- `/obras/[obraId]/equipe`: cada cliente ganha botão de excluir (sem edição de papel — só existe `cliente` nesse formulário, ticket 03 de `convite-equipe`).
- Sem trava de segurança pra impedir auto-remoção ou remover o último admin (`spec.md`, fora de escopo por ora).

## Comments

- `ConfirmDeleteForm` (`src/components/ConfirmDeleteForm.tsx`) criado como versão compartilhada do padrão já usado em `ExcluirEtapaForm` — usado aqui (`/equipe` e `/obras/[obraId]/equipe`, ambos Server Components). `excluirDespesa` (ticket 02) ficou inline no `ExtratoDespesas`, que já era Client Component.
- `/equipe`: cada membro ganha select de papel + botão salvar, e remover. `/obras/[obraId]/equipe`: só remover (papel é sempre `cliente` ali).
- **Testado de ponta a ponta de verdade contra o hospedado**, com usuário de teste real (criado e removido via admin API) e POST real dos três forms (wire protocol): mudei o papel de engenheiro pra financeiro (confirmado via REST), removi da equipe da construtora (sumiu), convidei o mesmo e-mail como cliente de uma obra e removi de lá também (sumiu de `obra_membros`).
