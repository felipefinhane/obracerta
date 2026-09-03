# Relatório Orçado vs. Realizado

Status: pending

## Contexto

Núcleo do produto (`docs/mvp.md` seção 1 e "Relatórios"; `docs/modelo-dados.md` seção Planejamento). A view `orcado_vs_realizado` já existe e foi testada de ponta a ponta desde `fundacao-tecnica`/06 (`security_invoker = true`, soma `despesas.valor` `confirmada` por `etapa_id` comparado com `etapas.valor_planejado`) — nunca foi exibida em nenhuma tela. Mockup `docs/stitch/stitch_obra_certa/{relat_rio_or_ado_x_realizado,relat_rio_or_ado_x_realizado_desktop}` ("Custo Total Consolidado" + "Detalhamento por Etapa").

## Escopo

- `/obras/[obraId]/orcado-realizado`: consulta a view filtrada por `obra_id`, uma linha por etapa (nome, planejado, realizado, % consumido, indicador visual de estouro quando realizado > planejado).
- Consolidado da obra: soma de planejado/realizado de todas as etapas **mais** despesas confirmadas sem `etapa_id` (a view não cobre isso — precisa de uma query separada ou union pra não sumir gasto sem etapa vinculada do total).
- Link de acesso a partir de `/obras/[obraId]/etapas` e da listagem de Obras.

## Comments
