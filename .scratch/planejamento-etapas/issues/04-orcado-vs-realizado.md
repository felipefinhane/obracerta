# Relatório Orçado vs. Realizado

Status: done

## Contexto

Núcleo do produto (`docs/mvp.md` seção 1 e "Relatórios"; `docs/modelo-dados.md` seção Planejamento). A view `orcado_vs_realizado` já existe e foi testada de ponta a ponta desde `fundacao-tecnica`/06 (`security_invoker = true`, soma `despesas.valor` `confirmada` por `etapa_id` comparado com `etapas.valor_planejado`) — nunca foi exibida em nenhuma tela. Mockup `docs/stitch/stitch_obra_certa/{relat_rio_or_ado_x_realizado,relat_rio_or_ado_x_realizado_desktop}` ("Custo Total Consolidado" + "Detalhamento por Etapa").

## Escopo

- `/obras/[obraId]/orcado-realizado`: consulta a view filtrada por `obra_id`, uma linha por etapa (nome, planejado, realizado, % consumido, indicador visual de estouro quando realizado > planejado).
- Consolidado da obra: soma de planejado/realizado de todas as etapas **mais** despesas confirmadas sem `etapa_id` (a view não cobre isso — precisa de uma query separada ou union pra não sumir gasto sem etapa vinculada do total).
- Link de acesso a partir de `/obras/[obraId]/etapas` e da listagem de Obras.

## Comments

- `/obras/[obraId]/orcado-realizado`: consulta a view `orcado_vs_realizado` por `obra_id` (uma linha por etapa, com barra de progresso e destaque vermelho quando `valor_realizado > valor_planejado`) + soma à parte de despesas confirmadas com `etapa_id` nulo (a view não cobre, mas é gasto real — linha "Sem etapa vinculada"). Card consolidado no topo soma tudo. Links a partir de `/etapas` e da listagem de Obras.
- **Testado de ponta a ponta de verdade contra o hospedado**: criei uma despesa confirmada de R$30.000 vinculada à etapa "Fundação" (planejado R$25.000, real, do cadastro do effort anterior) e confirmei que a página mostrou "Estourou o planejado" com a barra vermelha e os dois valores certos (25.000,00 / 30.000,00) — cobre exatamente o caso de estouro que o ticket pede. Despesa de teste apagada ao final.
