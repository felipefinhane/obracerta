# Timeline do diário de obra

Status: done

## Contexto

Mockup `docs/stitch/stitch_obra_certa/{di_rio_de_obra,di_rio_de_obra_desktop}`.

## Escopo

- `/obras/[obraId]/diario`: lista `diario_entradas` da obra, mais recente primeiro, com clima, descrição, efetivo presente, ocorrências, etapa vinculada (nome) e as fotos anexadas (`diario_midia`, via URL assinada de leitura gerada por entrada).
- Link de acesso a partir da listagem de Obras (mesmo padrão de Despesas/Etapas/Orçado x Realizado).
- Sem paginação (volume esperado no MVP não justifica ainda, mesmo raciocínio do extrato de despesas).

## Comments

- `/obras/[obraId]/diario`: lista `diario_entradas` com `etapas(nome)` e `diario_midia(id)` embutidos; URL assinada de leitura gerada por foto via `getSignedStorageUrl` (mesmo helper do effort `despesas-recibo`/05). Ocorrência destaca a entrada com borda vermelha.
- **Testado de ponta a ponta de verdade contra o hospedado**: reaproveitando o mesmo lançamento criado no ticket 01 (com foto real no R2), a página renderizou descrição, clima, etapa vinculada, efetivo presente, ocorrência e a foto (via URL assinada real) corretamente.
